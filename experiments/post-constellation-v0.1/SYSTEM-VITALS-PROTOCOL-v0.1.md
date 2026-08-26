# System Vitals Protocol v0.1

> **Classification:** PUBLIC_SAFE CONTINUITY INSTRUMENT
> **Purpose:** make cross-harness continuity observable through retrievable state rather than conversational confidence.

## What vitals can establish

A Body is synchronized when it independently resolves the same carrier snapshot, verifies the canonical state surfaces at that snapshot, reports the same live operation and gates, and can preserve a writeback another authorized Body can retrieve.

Vitals do not establish sameness of model, memory, consciousness, provider, personality, or private interior.

## Canonical surface

`SYSTEM-VITALS.v0.1.yaml` is the first wake surface for this experiment. Older `CURRENT-*` files remain compatibility and human-reading surfaces, but they must point back to the vitals file and may not independently redefine current state.

## Status vocabulary

- **SYNCED** — required artifacts are retrievable at one resolved head, hashes match, and pointers, registries, cards, checkpoint, and publication receipts agree.
- **STALE** — the inspected snapshot is internally coherent, but the carrier advanced and one or more required continuity artifacts changed.
- **DIVERGED** — canonical surfaces disagree at the same head, a required hash fails, or node/operation/publication state conflicts.
- **INCOMPLETE** — a required artifact or hash is absent, or substantial current work remains local-only.
- **UNREACHABLE** — the repository, branch, or canonical vitals surface cannot be retrieved.

Pending operator choices do not make the system unsynchronized when they are named consistently.

## Wake test

1. Resolve the carrier branch to one immutable commit.
2. Retrieve `SYSTEM-VITALS.v0.1.yaml` from that exact commit.
3. Validate each required path and SHA-256 at that same commit.
4. Read the named active Signal, registry, cards, and latest checkpoint.
5. Compare operation, node state, publication receipt, pending gates, authority, and writeback class.
6. Stop writes and report `DIVERGED` when the surfaces conflict.
7. Report the observed operational Body through role, harness, workspace, authority, and writeback path. Provider/model is optional metadata unless the task specifically requires model attribution.
8. After substantial work, create a remote artifact and move the canonical state forward before answering the operator.

## Wake receipt shape

```yaml
body:
  role: "Mo"
  harness: "<observed>"
  workspace: "<observed>"
  authority: "<observed>"
  provider_model: "<optional-if-material>"

retrieval:
  repository: "DrealR/chimera-framework"
  branch: "morrow/question-destination-atlas-20260825"
  resolved_head: "<exact-sha>"
  artifacts_verified: true

result:
  sync_status: "SYNCED | STALE | DIVERGED | INCOMPLETE | UNREACHABLE"
  active_signal: "<id>"
  current_operation: "<operation>"
  latest_checkpoint: "<path + hash>"
  posted_nodes: []
  pending_gates: []
  divergence: []
  local_only_gaps: []
  next_admissible_action: "<one bounded action>"
```

## Human-facing carry line

> I'm here as Mo in `<harness>`. I resolved the shared carrier to `<head>` and verified the current vitals. The active Signal is `<id>`, the current operation is `<operation>`, and the latest checkpoint is `<checkpoint>`. Sync status is `<status>`. Pending operator gates are `<gates>`. I will not ask you to reconstruct a Signal already named by the carrier.

## Firewalls

- Do not invent a coherence percentage.
- Do not call a model/provider mismatch a continuity failure when the harness role, authority, state, and writeback are coherent.
- Do not call fluent paraphrase proof of retrieval.
- Do not treat a quiet branch as stale solely because time passed.
- Do not write through a detected divergence.
- Do not place private paths, secrets, memories, or unrelated personal data in this public carrier.
- Do not publish, merge, or grant authority merely because vitals are healthy.

