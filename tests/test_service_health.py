from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import json
from pathlib import Path
import threading
import unittest

spec = importlib.util.spec_from_file_location('health', Path(__file__).resolve().parents[1] / 'scripts/check_service_health.py')
health = importlib.util.module_from_spec(spec)
spec.loader.exec_module(health)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == '/closed':
            self.close_connection = True
            return
        status = 503 if self.path == '/failure' else 302 if self.path == '/redirect' else 200
        content_type = 'text/html' if self.path == '/html' else 'application/json'
        bodies = {'/empty': b'', '/bad': b'broken secret-looking payload', '/large': b'x' * 65537,
                  '/array': b'[]', '/html': b'<!doctype html><html><body>Ready</body></html>'}
        body = bodies.get(self.path, b'{"schema":"example.v1","ready":true}')
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Location', 'https://example.invalid/private')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


class HealthTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def service(self, path='/', **kwargs):
        return {'name': 'example', 'url': f'http://127.0.0.1:{self.server.server_port}{path}',
                'expect': {'schema': 'example.v1', 'ready': True}, **kwargs}

    def test_contract_passes(self):
        self.assertTrue(health.probe(self.service())['healthy'])

    def test_listener_without_response_fails(self):
        result = health.probe(self.service('/closed'))
        self.assertFalse(result['healthy'])
        self.assertEqual(result['error'], 'RemoteDisconnected')

    def test_bad_http_and_bodies_fail(self):
        for path in ['/empty', '/bad', '/large', '/array', '/failure', '/redirect']:
            with self.subTest(path=path):
                result = health.probe(self.service(path))
                self.assertFalse(result['healthy'])
                self.assertNotIn('secret-looking', json.dumps(result))

    def test_html_is_not_json_health(self):
        self.assertFalse(health.probe(self.service('/html'))['healthy'])
        self.assertTrue(health.probe(self.service('/html', format='html', expect={}))['healthy'])

    def test_schema_missing_and_type_mismatch_fail(self):
        for expect in [{'schema': 'other'}, {'missing': True}, {'ready': 1}]:
            self.assertFalse(health.probe(self.service(expect=expect))['healthy'])

    def test_optional_failure_is_visible(self):
        result = health.check([self.service(), self.service('/closed', name='dependency', required=False)])
        self.assertTrue(result['healthy'])
        self.assertEqual(result['optional_failures'], ['dependency'])
        self.assertFalse(health.check([self.service('/closed')])['healthy'])

    def test_remote_and_credential_urls_rejected(self):
        for url in ['https://localhost/', 'http://example.com/', 'http://user:pass@localhost/',
                    'http://localhost/?token=x', 'http://localhost/#x']:
            with self.assertRaises(ValueError):
                health.probe(self.service(url=url))


if __name__ == '__main__':
    unittest.main()
