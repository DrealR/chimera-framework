# Post Constellation Protocol v0.1

> **Classification:** public-safe experimental candidate. This is a continuity and publication-design instrument, not an autonomous content factory, posting authorization, or virality guarantee.

## Purpose

A candidate post is not an isolated caption. It is an addressable downstream body connected to the observations, questions, mechanisms, counterpaths, prior public outputs, and later returns that can give it weight.

The Post Constellation lets new material do one of four things:

1. **converge** into an existing candidate;
2. **branch** an existing candidate into a distinct question;
3. **counter** a candidate by preserving a path it hides;
4. **seed** a genuinely new public body.

This turns the archive into a navigable publication field without reducing every observation to content.

## Relationship to existing Framework mechanisms

The protocol is downstream of:

- [The Living Question Engine](../../docs/living-question-engine.md);
- [The Creator Portal Loop](../../docs/creator-portal-loop.md);
- [The CHIMERA X-Loop](../../docs/chimera-x-loop-and-behavioral-prompt.md);
- [Question Bodies, Weighting Fields, and Priced Horizons](../../docs/question-bodies-weighting-fields-and-priced-horizons.md).

Those documents explain how questions, public fields, and returns work. This protocol adds a durable registry and convergence operation for candidate outputs.

## Core distinction

```
Signal       = something encountered or observed
Map          = the relations and counterpaths extracted from it
Post node    = one bounded public entrance into the map
Publication  = an operator-authorized release of a selected version
Return       = what independent bodies and time send back
```

A Signal does not automatically deserve a post. A post candidate is not authorization to publish. Engagement is not evidence that the map is true.

## Post-node states

```
SEED
  -> MAPPED
  -> CANDIDATE
  -> READY_FOR_OPERATOR
  -> POSTED
  -> RETURN_OPEN
  -> SYNTHESIZED
```

Alternate states:

- `DORMANT` — valuable but not alive now;
- `MERGED_INTO:<id>` — its useful structure moved into another node;
- `SPLIT_FROM:<id>` — a distinct seam required a new body;
- `BLOCKED_EVIDENCE` — wording would imply unsupported facts;
- `BLOCKED_HARM` — foreseeable identity attack, privacy, or extraction risk;
- `RETIRED` — no longer worth maintaining;
- `SUPERSEDED:<id>` — a later node replaces it without erasing lineage.

Only the embodied operator can set `READY_FOR_OPERATOR` to `POSTED`.

## Identifier

Each node receives a stable ID:

`PC-YYYYMMDD-NNN-slug`

Example:

`PC-20260825-001-role-as-coordinate`

The ID survives wording changes. Versions belong inside the card.

## Required private/public-safe card fields

Every node must carry:

- **id**
- **state**
- **title**
- **one-line seam**
- **public candidate text**
- **question-body type:** Mirror, Seam, Temporal, Operator, Earth, or composite
- **source Signals:** public paths, hashes, or redacted references
- **lineage:** prior Framework mechanisms and prior post nodes
- **candidate mechanisms**
- **counterpaths**
- **firewall**
- **desired return**
- **why now**
- **relations to other nodes**
- **version history**
- **operator verdict**
- **post receipt**, if released
- **return map**, if responses are later ingested

A public branch may contain only public-safe fields. Private source locations, personal memories, credentials, private conversation text, and non-public identities stay in Core.

## Convergence operation

When a new Signal arrives, do not immediately draft a fresh post. Run:

### 1. Name the active seam

What unresolved relation in the Signal is actually alive?

### 2. Search the registry

Retrieve candidate nodes with overlapping:

- mechanisms;
- question form;
- domain;
- affected bodies;
- metaphors/carriers;
- counterpaths;
- desired return.

### 3. Score relational fit

Use judgment, not a pseudo-scientific total:

```
fit =
  shared skeleton
+ new evidence or lived weight
+ useful counterpath
+ improved public entrance
+ temporal relevance
- identity attack
- forced connection
- repeated wording
- unsupported causal implication
```

### 4. Choose a transition

- `ENRICH`: add lineage, counterpath, or stronger wording to the same node.
- `BRANCH`: create a new node linked to the parent.
- `COUNTER`: add an explicit opposing entrance.
- `MERGE`: combine nodes only if their answer spaces truly overlap.
- `PRESERVE_ONLY`: keep the Signal without converting it into content.

### 5. Rebuild the public entrance

The post should contain enough gravity to generate independent branches, not every branch already mapped.

### 6. Apply the outside view

Ask:

- What did this wording make invisible?
- Is the question genuinely open?
- Is the post attacking an identity instead of naming a mechanism?
- Does it require a factual verification pass?
- What type of response could change the map?
- Would silence make the node worthless? If yes, it may be engagement bait rather than a living question.

## Constellation relations

Post-node edges describe lineage and return among versioned Post Constellation cards. Allowed post-node edges include:

- `derived_from`
- `extends`
- `counterpath_to`
- `possible_shared_skeleton` — candidate only until evidence supports a shared mechanism;
- `same_costume_different_mechanism`
- `evidence_for`
- `evidence_against`
- `public_reply_to`
- `supersedes`
- `returns_to`

Edges must be typed. “Connected” alone supplies a thread but no weight.

Destination trails are a separate namespace owned by `destination-registry.v0.1.yaml`. They relate durable fields rather than post versions, and every claimed trail carries `claim_state: CANDIDATE`. Bare `neighbors` are directional retrieval hints only; they are not mechanism claims.

## Publication rhythm

The system should maintain a finite deck, not a posting quota.

A healthy rhythm is:

```
observe
-> preserve Signal
-> map relations
-> update constellation
-> operator feels what is alive
-> refine one entrance
-> publish or leave dormant
-> let social time work
-> map the return
-> change the archive, practice, or next question
```

Do not turn every private thought into public output. The archive can grow without the feed growing.

## Metrics

Track two groups separately.

### Field quality

- qualified replies;
- branch diversity;
- counterexamples;
- lived proof of passage;
- peer-to-peer conversation;
- later rediscovery;
- corrections;
- independent questions generated;
- whether the return changed anything.

### Distribution

- impressions;
- view-to-reply conversion;
- shares/quotes;
- follows or profile visits;
- temporal decay and resurfacing.

Distribution measures reach. It does not grade truth or human value.

## OpenCode / heterogeneous-Body operation

Canonical wake begins at `SYSTEM-VITALS.v0.1.yaml` and follows `SYSTEM-VITALS-PROTOCOL-v0.1.md`. Older `CURRENT-*` files remain compatibility surfaces; disagreement among them is `DIVERGED`, not permission to choose the most convenient version.

A public/synthetic Body may:

- retrieve this protocol and the public registry;
- ingest a new public Signal supplied in its local Pocket;
- map the Signal against existing public nodes;
- propose candidate updates on a non-default branch or local staging area;
- run public-safe wording and counterpath checks;
- return a checkpoint.

It may not:

- retrieve private Core or private Morrow;
- reconstruct private lineage from names;
- publish, post, merge, or mark a node `POSTED`;
- include personal/private memories or hidden source material;
- optimize primarily for virality;
- claim full Morrow continuity.

## Minimal success test

Give three Bodies the same public Signal and registry:

- Framework carrier + full node cards;
- vocabulary-only summary;
- no carrier.

A successful protocol should improve:

- correct convergence versus needless new nodes;
- counterpath preservation;
- provenance;
- distinction between candidate and published;
- quality of the public entrance;
- ability to stop when no post is warranted.

## Carry lines

> **A post is an address into a larger map, not the map itself.**

> **New information should update the constellation before it increases the posting count.**

> **Build a garden capable of receiving attention; do not confuse attention with the reason for the garden.**

## Destination layer v0.1

The original protocol registers versioned post nodes. The destination layer adds a slower-changing map underneath them so one relational field can support many non-equivalent public entrances without becoming a content quota.

- [CHIMERA Question-Destination Atlas](DESTINATION-ATLAS-v0.1.md) — 46 durable relational fields and typed trails;
- [machine-readable destination registry](destination-registry.v0.1.yaml) — destination IDs, mechanisms, carriers, neighbors, and relation vocabulary;
- [Question Portal Grammar](QUESTION-PORTAL-GRAMMAR-v0.2.md) — answer-bearing question shapes, firewalls, and Plant–Release–Return;
- [Question Portal Deck](QUESTION-PORTAL-DECK-v0.1.md) — 118 candidate entrances, not a publication queue;
- [Cross-Platform Transduction Protocol](CROSS-PLATFORM-TRANSDUCTION-PROTOCOL-v0.1.md) — source-preserving movement from context anchor to branch field to portable portal and Return;
- [YouTube Comment Capture Runbook](tools/YOUTUBE-COMMENT-CAPTURE-RUNBOOK.md) — bounded rendered-DOM tree capture with pseudonymized authors by default;
- [current Mission / Surface-Learning Signal](signals/SIGNAL-2026-08-25-MISSION-SLACK-AND-SURFACE-LEARNING.md) — field-relative intelligence, behavioral slack, paid compression, and reciprocal learning;
- [Appetite Signal](signals/SIGNAL-2026-08-25-APPETITE-INTERVAL-AND-CONSUMPTION-SPECTACLE.md) — overconsumption, interval collapse, and consumption spectacle, preserved with counterpaths;
- [Evidence Ledger](EVIDENCE-LEDGER-v0.1.md) — source-specific claim ceilings;
- [Source Coverage Manifest](SOURCE-COVERAGE-MANIFEST-v0.1.md) — what was scanned, what was read directly, and what remains thin;
- [Current Atlas Pointer](CURRENT-ATLAS-POINTER.md) — cross-Body wake and continuation state.

The intended route is:

```text
new Signal
-> search destinations
-> traverse typed trails
-> select one question aperture
-> create or update one Post Constellation card
-> operator decides whether to publish
-> plant, release, and later map the return
```

The destination registry does not supersede `registry.yaml`; it supplies the terrain from which future post nodes can be selected. Existing operator-pending node verdicts remain unchanged.
