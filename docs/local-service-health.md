# Checking a running local service

A process can keep its listening socket while returning no HTTP response. A
saved checkpoint can also remain valid while the page that displays it fails.
Check those properties separately before calling a system operational.

The repository includes a small standard-library Python probe:

```bash
python3 scripts/check_service_health.py examples/service-health.json
```

Copy the example configuration and replace its addresses and expected fields
with your application's actual contract. Nothing in the example starts a
server. The probe issues GET requests only to literal loopback hosts, follows
no redirects, ignores proxy settings, accepts no URL credentials or query
strings, and prints a timestamped JSON report. It does not return response
bodies, start processes, call a model, write data, or restart services.

JSON probes require HTTP 200, an application/json content type, a nonempty
object, and exact values and types for each configured dotted field path.
HTML probes require HTTP 200, a text/html content type, and an HTML document.
Both reject responses over 64 KiB. `--timeout` sets the socket timeout, not a
hard wall-clock deadline against a continuously trickling server. Requests are
limited to 32 configured services and eight concurrent workers.

Exit code 0 means all required HTTP contracts passed; 1 means at least one
failed; 2 means the configuration or invocation is invalid. Optional failures
remain listed even when required services pass. Mark a dependency optional only
if its absence actually permits the intended workflow; do not use the flag to
hide a broken requirement.

## What a passing check establishes

| Observation | Evidence needed |
|---|---|
| Process exists | Process/supervisor inspection |
| Page or API responds correctly now | A current HTTP contract check |
| Saved records are intact | Inventory/hash verification |
| Execution completes | A bounded job through the real queue and verified output |
| Output is useful and accurate | Review against the task's source and acceptance criteria |
| Another device can resume | A fresh retrieval test on that device |

One row cannot certify the others. In particular, a schema check against an API
that projects historical evidence proves that API's current response, not a
fresh execution or model-quality result.

## Recover without losing the evidence

When a page fails but its source and fixtures still pass, inspect the running
process's working directory, arguments, and output destinations. For example,
an HTTP handler that logs before sending headers can lose the response if its
logging pipe was closed with the launching session. Reproduce the failure and
compare with the same code under valid output streams before concluding that
logging caused it.

Long-lived services should use an explicit supervisor and durable logs instead
of depending on a task terminal. Preserve the same address when browser storage
is involved: different ports have different local storage. Before replacing a
coordinator, let active work finish, back up its database with the database's
backup API, and preserve failed attempts. Restart only a process whose identity
you have verified. Check the page and API again, then verify that accepted
artifacts and notebook data remain available. A passing restart does not prove
login or reboot behavior until that path has also been exercised.

Run the transport regression tests with:

```bash
python3 -B -m unittest discover -s tests -p 'test_service_health.py'
```

This is an operational companion to the
[Project Agent Starter](../templates/project-agent/README.md), not a new
Framework mechanism or a model benchmark. The starter's state receipt and this
probe's service observation answer different questions.
