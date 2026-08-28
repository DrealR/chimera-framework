# Project Agent Entry

Choose exactly one opt-in mode. Neither mode grants authority to act.

## POLLINATE — create a project-native agent

Use POLLINATE only when the operator explicitly wants this repository to gain
its own new project-agent role. POLLINATE installs the public starter files and
initial project state after a dry-run review.

The new role belongs to this project. It does **not** import or clone a donor
agent, donor human, or another project's identity, private memory, credentials,
authority, or current state. Shared instructions are a protocol, not
transferred identity or permission.

Preview from `chimera-framework`:

```bash
node scripts/install-project-agent.mjs \
  --mode pollinate \
  --target /absolute/path/to/project \
  --project "Project Name" \
  --agent PROJECT_NAME_AGENT
```

Only the same command with `--apply` creates files.

## REBIND — reconnect to an existing project agent

Use REBIND only when this exact Git worktree already contains the project agent
named by the operator. REBIND verifies the exact worktree root, project name,
stable agent address, schema-valid state, local Git facts, and exact
`agent/CURRENT.json` hash before reporting readiness.

REBIND never creates or clones an identity. It is read-only: it copies,
overwrites, and updates nothing; accepts no `--apply`; transfers no private
memory, credentials, current state, or authority; and makes no network call.
The framework's trusted canonical validator reads the target state; REBIND
never executes target-controlled scripts.

```bash
node /path/to/chimera-framework/scripts/install-project-agent.mjs \
  --mode rebind \
  --target /absolute/path/to/existing-project \
  --project "Project Name" \
  --agent PROJECT_NAME_AGENT
```

A readiness receipt proves only the local facts it contains. It does not
authorize work. Without `--expected-head` or `--expected-current-sha256`, its
`LOCAL_STATE_ONLY` scope does not prove remote freshness. Supply either known
value to bind readiness to that lineage. If any fact does not match, stop at
the exact blocked error.
