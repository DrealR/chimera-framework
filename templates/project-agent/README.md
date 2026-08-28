# CHIMERA Project Agent Starter

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
- `agent/CURRENT.json`: the compact wake state;
- `agent/WAKE.md`: deterministic cold-start order;
- `agent/requests/`: bounded work addressed to the project agent;
- `agent/receipts/`: evidence returned by a human or agent;
- `agent/handoffs/`: optional human-readable context for a PR or session;
- `.github/PULL_REQUEST_TEMPLATE.md`: the communication loop at review time;
- `schemas/`: closed JSON schemas for current state, requests, and receipts;
- `scripts/project-agent.mjs`: a dependency-free validator and status command.

## Start

From a clone of `chimera-framework`, preview an install into an existing Git
worktree:

```bash
node scripts/install-project-agent.mjs \
  --target /absolute/path/to/project \
  --project "Project Name" \
  --agent PROJECT_NAME_AGENT
```

The preview writes nothing. Review the exact file list, then repeat with
`--apply`. The installer refuses to target a subdirectory or overwrite an
existing project-agent surface.

From a repository created from or containing this starter:

```bash
node scripts/project-agent.mjs check
node scripts/project-agent.mjs status
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

## Self-improvement boundary

The starter supports a reviewable improvement loop; it does not claim that a
model autonomously improves itself. Improvements are changes to the project's
instructions, tools, tests, or product, proposed and verified through ordinary
Git review.
