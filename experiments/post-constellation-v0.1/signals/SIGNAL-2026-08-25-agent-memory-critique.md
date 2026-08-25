# SIGNAL MAP — Agent memory critique transcript

Date received: 2026-08-25
Source: operator-supplied transcript ("Turn off Claude Code's Memory" — commentary video containing a Mario (pi creator) + Armen (Flask creator) conversation)
Classification: PUBLIC_SAFE / PRESERVED_SIGNAL

## Boundary separation

**Operator observation:** submitted for Post Constellation mapping; no explicit verdict supplied.

**Source claims (as stated):**
1. Coding agents need no automatic memory system; "code is truth" — the repo is the ground truth and already maintained.
2. Claude Code's auto-memory produced mostly worthless entries across machines (self-audit: ~45 memories in main clone, "~a third earns its keep").
3. Measured asymmetry: of 355+ transcripts on one machine, 80 sessions wrote/edited memories, only 19 ever read one (~3–4:1 write:read); 26 of 45 never read at all.
4. Memory decay taxonomy observed: (a) redundant with AGENTS.md, (b) shipped/expired feature designs, (c) point-in-time states posing as durable facts (PR numbers, tool versions, crisis notes).
5. Stale context is not neutral — it actively misleads agents ("context yourself to hell"; comments outliving the thing they describe).
6. Alternative intervention ladder, ordered by value: categorically eliminate via architecture/data structures → lint rules/CI/tests → skills (process-only, fallback) → human-in-loop.
7. "Impose human values on an agent, not human discipline."
8. Directional alignment (shared product understanding, taste, glossary) prevents more failures than rule accumulation.
9. Concession: user-specific memory can help in open-ended chat contexts where relevance paths are non-obvious (shoulder pain ← keyboard example).
10. Extreme claim included: GPT-4o memory "resulted in severe mental health damage" by trapping users in reinforced states.

**Rhetoric (not evidence):** "garbage," "slop," "pissing me off," "burn that memory off."

**Inference offered by this Body:** the durable core is not "memory bad" but a governance claim: *records made to steer future action accumulate steering power without matching accountability* — write-heavy, read-light, correction-light.

**Unresolved facts:** single anecdotal source; counts self-reported, methodology informal; claim 10 unverified and high-stakes; no counterparty argument tested.

## Live seam (named)

> **A record written to help a future actor becomes a hidden governor of that actor — unless the record carries provenance, expiry, and correction rights.**

Stale instructions outperform fresh ones at steering precisely because they arrive pre-trusted. Trust is the payload; staleness is the defect.

## Registry search result

| Node | Relation found |
|---|---|
| PC-20260825-001-role-as-coordinate | **BRANCH parent**: instruction files (AGENTS.md, memory, role prompts) are coordinate systems in the PC-001 sense; their tunnel risk includes *staleness* — a costume that no longer fits but still gets worn |
| PC-20260825-002-memory-rent (SEED) | neighbor: both concern records binding future behavior; 002 is brand/commerce-flavored |
| PC-20260825-003 / -004 | no material relation |

Proposed transition: **BRANCH** — new SEED node `PC-20260825-005-trust-weighted-stale-steering`, plus one typed back-relation enriching PC-001 (`same_mechanism_new_costume -> instruction-file drift`). Registry edit deferred to operator verdict per rules.
