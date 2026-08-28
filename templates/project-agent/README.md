# CHIMERA Project Agent Starter v2

This is a provider-neutral continuity kernel for a software project. It gives
Codex, Claude Code, Kimi Code, OpenCode, and other repository-aware harnesses a
shared place to recover current state, receive bounded requests, and leave
verifiable receipts.

It is deliberately smaller than a personal digital twin. It stores project
state, not a person's private memory or identity, and it does not grant an AI
permission to publish, merge, spend money, access credentials, or act outside
the repository.

## What it installs

- `AGENTS.md`: the cross-harness operating contract;
- `CLAUDE.md`: a small compatibility pointer back to the shared contract;
- `agent/ENTRY.md`: the explicit POLLINATE/REBIND opt-in boundary;
- `agent/CURRENT.json`: the compact wake state;
- `agent/WAKE.md`: deterministic cold-start order;
- `agent/contacts/`: inert cross-agent claim/evidence envelopes;
- `agent/requests/`: bounded work addressed to the project agent;
- `agent/receipts/`: evidence returned by a human or agent;
- `agent/handoffs/`: optional human-readable context for a PR or session;
- `.github/PULL_REQUEST_TEMPLATE.md`: the communication loop at review time;
- `schemas/`: closed JSON schemas for contacts, current state, requests, and
  receipts;
- `scripts/project-agent.mjs`: a dependency-free validator, status command, and
  deterministic local wake receipt.

## Start

From a clone of `chimera-framework`, preview an install into an existing Git
worktree:

```bash
node scripts/install-project-agent.mjs \
  --mode pollinate \
  --target /absolute/path/to/project \
  --project "Project Name" \
  --agent PROJECT_NAME_AGENT
```

The preview writes nothing. Review the exact file list, then repeat with
`--apply`. The installer refuses to target a subdirectory or overwrite an
existing project-agent surface. It rejects symlinks in every destination path,
creates files exclusively from a complete staging surface, and rolls back files
and directories it created if installation fails.

When `--default-branch NAME` is supplied, POLLINATE records the exact commit at
`refs/remotes/origin/NAME`, falling back to `refs/heads/NAME`; it never labels
the current feature HEAD as that branch. Without the flag it uses
`refs/remotes/origin/HEAD` when available, otherwise the current local branch.
Project-agent v2 currently requires Git's `sha1` object format and blocks before
staging on repositories initialized with another object format.

Omitting `--mode` remains a backward-compatible alias for `--mode pollinate`.
POLLINATE creates a new role native to the target project; it imports no
donor-agent, donor-human, or other-project identity, private memory,
credentials, authority, or current state.

To reconnect a harness to an already-existing project agent, use read-only
REBIND from the framework clone:

```bash
node scripts/install-project-agent.mjs \
  --mode rebind \
  --target /absolute/path/to/existing-project \
  --project "Project Name" \
  --agent PROJECT_NAME_AGENT
```

REBIND validates the exact worktree root and sends its existing project-agent
state through the framework's trusted canonical validator without executing
target-controlled code. It then prints a deterministic readiness receipt. It
rejects `--apply`, creates/copies/overwrites nothing, and makes no network call.
Symlinked or non-regular state surfaces fail closed. Repository Git settings
cannot activate an fsmonitor, hook, or partial-clone lazy-fetch transport during
verification. Read `agent/ENTRY.md` for the complete distinction.

Without expected lineage flags, REBIND labels readiness `LOCAL_STATE_ONLY`: it
proves local consistency, not that the clone is fresh relative to another
device or remote. When known, bind the check to either or both exact values:

```bash
node scripts/install-project-agent.mjs \
  --mode rebind \
  --target /absolute/path/to/existing-project \
  --project "Project Name" \
  --agent PROJECT_NAME_AGENT \
  --expected-head 0123456789abcdef0123456789abcdef01234567 \
  --expected-current-sha256 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

From a repository created from or containing this starter:

```bash
node scripts/project-agent.mjs check
node scripts/project-agent.mjs status
node scripts/project-agent.mjs wake --json
```

Then replace the example values in `agent/CURRENT.json`, create the first
request from `agent/requests/REQUEST.example.json`, and tell any repository-aware
harness:

> Sync this repository's project agent and continue the highest-priority open
> request you are authorized to perform.

## The loop

```text
operator or peer proposes a bounded request
  -> project agent verifies repository state and authority
  -> work happens on a branch
  -> tests and evidence are recorded in a receipt
  -> pull request addresses the next project agent
  -> accepted material state updates CURRENT.json
```

Peer output is evidence, not truth. A receiving agent compares it with Git and
the repository state before adopting it. No material delta means no synthetic
history is manufactured.

Contacts under `agent/contacts/` are stricter versions of that boundary: an
inert envelope carries source project/agent/repository/head/current-state hash,
claims, and evidence to a stable target role. Its transfer flags are always
false. The receiver independently verifies and classifies it; a contact never
authorizes action or transfers private state.

## Self-improvement boundary

The starter supports a reviewable improvement loop; it does not claim that a
model autonomously improves itself. Improvements are changes to the project's
instructions, tools, tests, or product, proposed and verified through ordinary
Git review.
