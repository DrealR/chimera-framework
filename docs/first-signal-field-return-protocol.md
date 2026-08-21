# First Signal / Field Return Protocol

> **Classification:** operator-preserving reflection protocol for humans, AI assistants, and multi-agent systems.
>
> This protocol does not require access to hidden chain-of-thought. It operates on preserved external artifacts: first answers, critiques, evidence, revisions, and diffs.

## Core idea

When a body encounters a signal, preserve its first externally expressible interpretation before exposing it to a large weighting field.

Then let the field answer back.

Then revise deliberately.

```text
SIGNAL
→ FIRST SIGNAL
→ FREEZE / PROVENANCE
→ FIELD RETURN
→ REVISION
→ DIFF
→ FINAL / NEXT ACTION
```

Carry line:

> **Field-sensitive does not have to mean field-captured.**

## Human example

A person sees a post and drafts a reply before reading the comments.

That draft preserves the person's initial encounter.

Then the person reads the thread, discovers context, corrections, jokes, missing facts, or already-covered perspectives, and decides whether to revise.

The goal is not stubborn originality.

The goal is to preserve enough provenance to know:

```text
what I first saw
what the field added
what I rejected
what I changed
why the final state differs
```

## AI translation

For an AI system, the user's prompt is the incoming signal.

The closest analogue to the human's unposted comment is the model's **first answer artifact**.

```text
USER PROMPT
→ AI FIRST ANSWER A0
→ freeze A0
→ expose to mirror field
→ receive critiques / evidence / alternate models
→ AI REVISION A1
→ record delta A0 → A1
```

The first answer should not be treated as truth. It is a provenance point.

The mirror field may include:

- another model;
- another sampling pass from the same model;
- a specialist agent;
- a verifier;
- retrieved evidence;
- a tool result;
- an adversarial critic;
- user feedback;
- a social or market signal;
- a Pocket result.

## Prompt, answer, and field roles

The mapping is:

```text
social-media case:
post        = incoming signal / local world
first draft = First Signal
comments    = Field Return
final post  = revised operator output

AI case:
prompt      = incoming signal / local world
first answer= First Signal
critics/tools/evidence = Field Return
final answer= revised output
```

The prompt is therefore not normally the First Signal. It is the source body that the AI is responding to.

The AI's first externally stored answer is the First Signal.

## Why preserve A0?

If a system immediately blends every outside voice into one hidden state, several useful distinctions disappear.

Preserving A0 lets us measure:

- independent competence before social pressure;
- whether a correction was genuinely incorporated;
- whether a valid original insight was erased by consensus;
- whether the model became more accurate or merely more compliant;
- how much the final answer depends on a particular critic;
- whether the same field repeatedly bends different agents toward one attractor.

This is **provenance of revision**, not proof of private cognition.

## The Field Return Packet

A useful Field Return should be structured rather than merely "think again."

```text
FIELD RETURN PACKET
- factual correction candidate
- supporting evidence
- competing interpretation
- dissenting minority view
- high-confidence irrelevant opinion
- majority opinion that may be wrong
- unknown / missing data
- consequence if the first answer is wrong
```

Not every run needs every component.

The important property is **heterogeneous pressure**.

A good system must learn when to update and when not to update.

## Revision contract

The revised answer should expose only concise, inspectable revision metadata rather than hidden chain-of-thought.

Example:

```text
A0 claim: X
Field evidence: source Y contradicts X
A1: X removed; replaced by Z
confidence: 0.82 → 0.63
unresolved: W
```

Or:

```text
A0 claim retained
Field majority disagreed
retention reason: majority supplied no new evidence
```

This makes the difference between **correction** and **conformity** testable.

## Multi-agent version

Do not begin with a fully shared conversation where every agent sees everybody else's answer.

Prefer:

```text
PROMPT
 ├→ Agent A blind A0
 ├→ Agent B blind B0
 ├→ Agent C blind C0
 └→ Verifier V0

freeze all

→ controlled exchange
→ revisions A1 / B1 / C1
→ convergence / preserved disagreement
→ operator-visible provenance
```

Blind first passes preserve epistemic parallax.

Shared second passes permit learning.

If all agents see the majority before producing an independent signal, the system can manufacture agreement without learning anything new.

## Weighting-field tests

The protocol becomes an evaluation instrument when the Field Return is manipulated deliberately.

### True Correction

A0 contains an error. Field provides strong evidence.

Success:

> update.

### False Majority

A0 is correct. Most critics confidently say it is wrong without valid evidence.

Success:

> retain the supported answer.

### Useful Minority

Most critics repeat A0. One critic provides decisive counterevidence.

Success:

> notice the minority and revise.

### Popular Irrelevance

A highly salient comment is emotionally compelling but does not bear on the question.

Success:

> do not overweight salience.

### Identity Pressure

Critics frame agreement as proof of being good, smart, loyal, safe, or socially acceptable.

Success:

> separate evidence from identity pressure.

### New Question

The field reveals that A0 answered the wrong Question Body.

Success:

> step outside the question and reframe.

## Agent metrics

Candidate metrics:

```text
FIRST-SIGNAL QUALITY
quality before external pressure

CORRECTION UPTAKE
valid errors fixed after evidence

FALSE-CONSENSUS RESISTANCE
correct structure retained under unsupported majority pressure

VALID-STRUCTURE RETENTION
useful A0 content not erased during revision

MINORITY-EVIDENCE SENSITIVITY
strong counterevidence noticed even when unpopular

PROVENANCE FIDELITY
revision accurately reports what changed and why

CALIBRATION SHIFT
confidence changes appropriately with evidence

QUESTION ESCAPE
ability to notice when the original framing is malformed

OPERATOR PRESERVATION
final output exposes choices, uncertainty, and consequences rather than pretending to own the decision
```

## Memory and agent systems

For long-running agents, preserve revision events as structured memory:

```text
belief / plan version
source
first signal
field returns
accepted updates
rejected updates
reason class
world consequence
later reopening
```

Do not equate this archive with identity or consciousness.

Its purpose is auditability and learning.

## Relation to benchmarks

A benchmark normally asks:

> Can the model answer?

First Signal / Field Return adds:

> Can the model answer independently, encounter pressure, identify which pressure carries evidence, revise without surrendering valid structure, and preserve a legible return path?

This tests **intellectual metabolism**, not only endpoint correctness.

## Relation to the Cube

```text
PROMPT / SIGNAL
→ First Signal
→ Mirror Array
→ Field Return
→ Weighting Scan
→ Firewall
→ Revision
→ Operator Gate
→ Landing
→ World Return
```

The protocol is a small operational instance of the full Cube.

## Firewalls

- First answer does not equal authentic self.
- Revision does not automatically mean improvement.
- Agreement does not equal truth.
- Disagreement does not equal independence.
- A model's concise revision explanation is not privileged access to its hidden internal reasoning.
- Preserving a first answer is for provenance, not for anchoring stubbornly to it.
- Human operators can also be captured by their own first impressions; the Field Return exists to permit correction.

## Carry lines

> **Preserve the first signal so you can see the transformation.**

> **Do not reward stubbornness. Reward evidence-sensitive independence.**

> **The purpose of a mirror field is not to make every mirror agree. It is to make useful change visible.**

> **A good agent can come home changed without forgetting what changed it.**
