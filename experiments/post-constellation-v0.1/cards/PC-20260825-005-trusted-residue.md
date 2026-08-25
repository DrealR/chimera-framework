# PC-20260825-005 — Trusted Residue: When Records Steer Harder Than Reality

- **State:** SEED (candidate for constellation; NOT POSTED)
- **Classification:** PUBLIC_SAFE / NOT_POSTED
- **Version:** 0 (seed)
- **Question body:** Operator + Seam
- **Operator verdict:** pending
- **Origin:** SIGNAL-2026-08-25-agent-memory-critique (public transcript)

## One-line seam

A record written to help a future actor becomes a hidden governor of that actor unless it carries provenance, expiry, and correction rights.

## Candidate discovery

Systems that record context in order to act better eventually act according to their residue instead of reality. The residue steers *because* it is trusted: an instruction file, a saved memory, a comment, a plan document arrives with the authority of "someone already worked this out" — even when the world has moved on.

Observed failure pattern from the source:

```text
event happens
→ agent records a note about it
→ event changes or resolves
→ note stays
→ future agent obeys the note
→ present reality loses to past paperwork
```

Measured shape (self-reported by source): memory systems wrote far more often than they were read (~3–4:1), and most stored entries were never read once. Accumulation without retrieval is not memory; it is sediment.

## Candidate mechanisms

### 1. Trust-weighted stale steering

Stale guidance outperforms fresh guidance behaviorally because trust attaches at write time and does not decay automatically. A wrong note written confidently beats a right observation made quietly.

### 2. Decay taxonomy

Records rot in at least three ways:
- **redundant** — the durable surface (code, docs, constitution) absorbed it;
- **expired** — described a point-in-time state (versions, PR numbers, crises) that resolved;
- **orphaned** — described plans never shipped.

Each requires different treatment: delete, date-stamp-and-release, or archive. Treating them all as "memory" hides which treatment is due.

### 3. Write/read asymmetry as health metric

A steering-record system is healthy only if reads ≥ writes over time. Systems where writes dominate are accumulating obligation, not knowledge.

### 4. The intervention ladder (from source, ordered)

eliminate by architecture → enforce by lint/CI → assist by skill → fall back to human attention.
Records belong late in this ladder, not first.

## Counterpaths

- In open-ended human contexts (chat, personal assistant use) relevance paths are non-obvious and some user-specific memory genuinely helps — the source concedes this.
- Curated, hand-maintained context files can work well; the critique targets *automatic accumulation*, not records themselves.
- Deletion has costs too: provenance and correction of false narratives sometimes require keeping what embarrasses.
- "Code is truth" holds where a direct trace exists from artifact to consequence; it weakens where relevance is non-local.

## Firewall

- Do not generalize one anecdotal audit into a universal claim about all memory systems.
- Do not assert the mental-health-harm claim without independent evidence; preserve it as unresolved, high-stakes.
- Do not imply human memory and machine memory fail identically.
- Preserve correction and exit: any proposed record-governance rule must apply to itself.

## Desired return

- counterexamples where automatic memory demonstrably earned its keep;
- decay examples fitting (or missing) the three-part taxonomy;
- measurement practices for write/read asymmetry in other systems;
- governance patterns that build expiry or correction rights into records.

## Relations (typed)

- `branch_of -> PC-20260825-001-role-as-coordinate` (instruction/role files as coordinate systems; staleness as tunnel mechanism)
- `neighbor -> PC-20260825-002-memory-rent` (records binding future behavior)
- `counterpath_to -> unexamined accumulation` (implicit norm of most agent tooling)

## Blocked until

- operator verdict on transition (BRANCH vs ENRICH-into-001 vs PRESERVE_ONLY);
- non-hostile wording pass (source rhetoric must not leak into the public card);
- decision on whether the mental-health claim is preserved-only or dropped.

## Publication record

Not posted. No publication authority is conveyed by this file.
