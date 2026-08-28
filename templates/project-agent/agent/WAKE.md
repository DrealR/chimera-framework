# Project Agent Wake Protocol

Use this order on every cold start:

1. `git status --short --branch`
2. `git rev-parse HEAD`
3. `node scripts/project-agent.mjs check`
4. `node scripts/project-agent.mjs status`
5. Open only the request IDs printed by `status`.
6. Compare each request's source revision with the repository.
7. Continue only actions covered by the current human request and the request's
   authority list.

Return `SYNCED` only when the files, Git facts, and active request agree. Return
`BLOCKED` with the exact mismatch or missing dependency otherwise.

