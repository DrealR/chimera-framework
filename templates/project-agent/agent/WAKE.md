# Project Agent Wake Protocol

Use this order on every cold start:

1. Read `agent/ENTRY.md`; confirm whether this is a new POLLINATE or an existing
   REBIND. Never infer or clone identity between them.
2. `node scripts/project-agent.mjs wake --json`
3. Confirm the authority-inert receipt reports the expected project role,
   branch, head, dirty state, and exact `agent/CURRENT.json` SHA-256.
4. `node scripts/project-agent.mjs status`
5. Open only the request IDs printed by `status`.
6. Independently verify any non-example contact before classifying its claims.
7. Compare each request's source revision with the repository.
8. Continue only actions covered by the current human request and the request's
   authority list.

Return `SYNCED` only when the files, Git facts, and active request agree. Return
`BLOCKED` with the exact mismatch or missing dependency otherwise.

`wake --json` is local and read-only: it validates all current, contact,
request, and receipt state; inspects local Git; hashes exact CURRENT bytes; and
emits no timestamp or absolute path. Its receipt transfers no authority,
private memory, or credentials and makes no identity or consciousness claim.
