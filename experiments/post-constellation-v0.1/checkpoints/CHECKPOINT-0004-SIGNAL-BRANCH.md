# CHECKPOINT-0004 — SIGNAL mapped → BRANCH proposal (PC-20260825-005 SEED)

Date: 2026-08-25
Carrier branch/head before this commit: `morrow/post-constellation-opencode-20260825` @ `26922c9cbbbf6e22d1e48117caf4b19d9c974349`
Attribution: OpenCode/Ox Alpha Body (Ox selected, no fallback; in-session work)
Writeback class: REMOTE_ARTIFACT

## Signal processed

Operator-supplied public transcript critiquing automatic agent memory systems ("Turn off Claude Code's Memory"). Full boundary-separated map: `signals/SIGNAL-2026-08-25-agent-memory-critique.md`.

## Transition selected

**BRANCH** — new SEED node `PC-20260825-005-trusted-residue` (`cards/PC-20260825-005-trusted-residue.md`, version 0), with typed back-relation enriching PC-001 (`same_mechanism_new_costume -> instruction-file drift`). Rationale: the material's core is record-governance, not role compression; but it branches from PC-001's mechanism rather than standing alone.

## Registry nodes touched

None edited — registry change deferred pending operator verdict per rule "new information updates the constellation" + publication authority = operator only. Proposed registry diff (on verdict):

```yaml
candidate_backlog:
  - id: "PC-20260825-005-trusted-residue"
    state: "SEED"
    seam: "A record written to help a future actor becomes a hidden governor unless it carries provenance, expiry, and correction rights."
    blocked_until:
      - "operator verdict on transition"
      - "non-hostile wording pass"
      - "decision on preserving vs dropping the unverified mental-health claim"
```

Plus typed relation addition on PC-001: `same_mechanism_new_costume -> instruction-file drift and stale steering`.

## Files in this commit

- `experiments/post-constellation-v0.1/signals/SIGNAL-2026-08-25-agent-memory-critique.md`
- `experiments/post-constellation-v0.1/cards/PC-20260825-005-trusted-residue.md`
- `experiments/post-constellation-v0.1/checkpoints/CHECKPOINT-0004-SIGNAL-BRANCH.md` (this file)

## Checks performed

- Registry searched before creating a node (001 branch parent found; 002 neighbor; 003/004 no relation).
- Source rhetoric excluded from candidate card; unverified high-stakes claim quarantined as unresolved.
- All relations typed.
- No publish, no merge, no POSTED marking.

## Unresolved facts

1. Operator verdict on PC-005 transition AND still-pending verdict on PC-001 v2 registry bump.
2. Mental-health claim from source preserved-only or dropped.
3. `docs/living-archive-memory-and-release.md` referenced by CURRENT-STATE.md but outside bounded carrier set — likely strong neighbor for PC-005; unretrieved without authorization.

## Next admissible action

Await operator decisions; on approval, apply registry diff via writeback.
