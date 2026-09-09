#!/usr/bin/env python3
"""Read-only loopback HTTP contract checks. A listening socket is not health."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import http.client
import json
from pathlib import Path
import time
from urllib.parse import urlsplit

MAX_BYTES = 65536


def field(value, path):
    for key in path.split('.'):
        if not isinstance(value, dict) or key not in value:
            raise ValueError('missing field: ' + path)
        value = value[key]
    return value


def validate(service):
    url = urlsplit(service['url'])
    if (url.scheme != 'http' or url.hostname not in ('127.0.0.1', 'localhost', '::1')
            or url.username or url.password or url.query or url.fragment):
        raise ValueError('Use a plain HTTP loopback URL without credentials, query, or fragment')
    if not isinstance(service.get('name'), str) or not service['name']:
        raise ValueError('A service name is required')
    if type(service.get('required', True)) is not bool:
        raise ValueError('required must be boolean')
    if service.get('format', 'json') not in ('json', 'html'):
        raise ValueError('format must be json or html')
    if not isinstance(service.get('expect', {}), dict):
        raise ValueError('expect must be an object of dotted field paths and expected values')
    if any(not isinstance(path, str) or not path or any(not part for part in path.split('.'))
           for path in service.get('expect', {})):
        raise ValueError('expect paths must contain nonempty string fields')
    return url


def probe(service, timeout=3):
    url = validate(service)
    start = time.monotonic()
    result = {'name': service['name'], 'url': service['url'],
              'required': service.get('required', True), 'healthy': False}
    conn = http.client.HTTPConnection(url.hostname, url.port or 80, timeout=timeout)
    try:
        conn.request('GET', url.path or '/', headers={'Accept': 'application/json, text/html'})
        response = conn.getresponse()
        result['http_status'] = response.status
        if response.status != 200:
            raise ValueError('expected HTTP 200')
        raw = response.read(MAX_BYTES + 1)
        if not raw:
            raise ValueError('empty response body')
        if len(raw) > MAX_BYTES:
            raise ValueError('response exceeds byte limit')
        if service.get('format', 'json') == 'html':
            if 'text/html' not in response.getheader('Content-Type', ''):
                raise ValueError('expected HTML content type')
            if b'<html' not in raw.lower():
                raise ValueError('expected HTML document')
        else:
            if 'application/json' not in response.getheader('Content-Type', ''):
                raise ValueError('expected JSON content type')
            value = json.loads(raw)
            if not isinstance(value, dict):
                raise ValueError('expected JSON object')
            for path, expected in service.get('expect', {}).items():
                actual = field(value, path)
                if type(actual) is not type(expected) or actual != expected:
                    raise ValueError('unexpected field: ' + path)
        result['healthy'] = True
        result['bytes'] = len(raw)
    except (OSError, http.client.HTTPException, ValueError, UnicodeError) as exc:
        # Do not echo response bodies, model output, tokens, or provider errors.
        result['error'] = str(exc) if isinstance(exc, ValueError) and not isinstance(exc, json.JSONDecodeError) else type(exc).__name__
    finally:
        conn.close()
    result['elapsed_ms'] = round((time.monotonic() - start) * 1000)
    return result


def check(services, timeout=3):
    if not services or len(services) > 32:
        raise ValueError('Configure between 1 and 32 services')
    for service in services:
        validate(service)
    with ThreadPoolExecutor(max_workers=min(8, len(services))) as pool:
        results = list(pool.map(lambda s: probe(s, timeout), services))
    return {'schema': 'service.health.v1', 'observed_at': datetime.now(timezone.utc).isoformat(),
            'healthy': all(r['healthy'] for r in results if r['required']),
            'optional_failures': [r['name'] for r in results if not r['required'] and not r['healthy']],
            'services': results,
            'scope': 'Current HTTP contracts only; not model quality, saved evidence integrity, or authorization.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('config', type=Path)
    parser.add_argument('--timeout', type=float, default=3, help='Socket timeout in seconds (0 < n <= 30)')
    args = parser.parse_args()
    if not 0 < args.timeout <= 30:
        parser.error('timeout must be greater than zero and at most 30')
    try:
        result = check(json.loads(args.config.read_text())['services'], args.timeout)
    except (ValueError, KeyError, TypeError, OSError) as exc:
        parser.error(str(exc))
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if result['healthy'] else 1)


if __name__ == '__main__':
    main()
