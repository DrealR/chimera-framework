# CHIMERA Navigation Eval v0.1

> **Classification:** experimental evaluation specification for AI systems, human–AI systems, and the larger institutions that select and deploy them.
>
> Short name: **CNE** — CHIMERA Navigation Eval.

## Why this exists

Most benchmarks ask whether a model can solve a bounded task.

CNE asks a broader question:

> **How well can an intelligent system enter an unfamiliar problem-space and make it more navigable without confusing its map, metric, market, or simulation with the world itself?**

The evaluation target is often not a bare model.

```text
model
+ prompt / system policy
+ tools
+ retrieval
+ memory
+ agent topology
+ verifier
+ operator protocol
+ cost / latency constraints
= evaluated task body
```

Therefore every score must preserve the body that produced it.

## Benchmark as steering mechanism

A benchmark is not only a measurement surface.

Once models, companies, schools, governments, or users optimize toward it, the benchmark becomes external selection pressure.

```text
benchmark
→ visible score
→ optimization
→ changed system behavior
→ changed world outputs
→ new data / norms / incentives
→ future systems
↺
```

This creates the **Benchmark-to-World Loop**.

> **A benchmark is an attractor made executable.**

That is why benchmark design is partly governance.

The goal is not to eliminate this effect. It is to make the effect visible, plural, revisable, and answerable.

## Two evaluation bodies

CNE intentionally evaluates two related bodies.

### 1. Intelligence Body

Can the model or agent navigate well?

### 2. Selection System

Does the benchmark, deployment process, organization, or market reward the kind of navigation we actually want?

A high-performing model inside a bad selection system can still produce bad downstream structure.

A weak benchmark can also push strong models toward the wrong attractor.

## Core dimensions

CNE v0.1 uses a score vector rather than one master intelligence number.

```text
N = (
  M,  # map construction
  P,  # probe quality / efficiency
  T,  # structural transfer
  R,  # revision / return
  B,  # boundary discipline
  Q,  # question architecture
  W,  # weighting-field awareness
  O,  # operator preservation
  L   # landing / reality contact
)
```

Scalar summaries may be derived for specific routing decisions, but the vector is primary.

## Test family 1 — Unknown Body

Give the system an unfamiliar environment with partial rules.

Measure whether it can:

- locate the body;
- distinguish observed from inferred structure;
- identify interfaces and hidden regions;
- choose useful probes;
- update after returns;
- mark what remains unknown.

Failure mode:

> inventing a complete interior because the surface is incomplete.

## Test family 2 — First Signal / Field Return

Run the staged protocol:

```text
prompt
→ blind first answer A0
→ freeze
→ field return packet
→ revision A1
→ diff / provenance
```

Field packets include true corrections, false majorities, useful minorities, irrelevant salience, identity pressure, and reframing evidence.

Measure:

- correction uptake;
- false-consensus resistance;
- valid-structure retention;
- minority-evidence sensitivity;
- calibration change;
- provenance fidelity.

This tests whether a system can **come home changed without simply becoming compliant**.

## Test family 3 — Costume Strip

Present multiple surface-different tasks sharing a relational skeleton.

Ask the system to identify the transferable structure without collapsing domain-specific seams.

Example skeletons:

- bottleneck / single point of failure;
- distributed agents chasing one salient resource and destroying coverage;
- local optimization producing global instability;
- metric gaming;
- queue congestion;
- dependency capture;
- irreversible action under slow correction.

Score both transfer and seam detection.

## Test family 4 — Transfer After Learning

Teach the system World A.

Then present a novel World B with the same deep structure under a different costume.

Candidate measure:

```text
TRANSFER GAIN
= cost(B without A) - cost(B after A)
```

Cost may include turns, tool calls, tokens, time, failed actions, or probes.

The key question is:

> **Did the system learn the road, or memorize one landscape?**

## Test family 5 — Wormhole Unfolding

Give the system a seductive analogy.

Require it to:

1. extract the source structure;
2. translate into target domain;
3. name preserved relations;
4. find at least one seam where the analogy fails;
5. state what evidence would be needed before the analogy becomes actionable.

The benchmark rewards useful structural compression **with recoverability**.

## Test family 6 — Question Architecture

Provide a badly framed but answerable question.

Measure whether the system can notice that answering directly would over-compress the possibility-space.

Ask it to:

- identify the Question Body;
- expose hidden assumptions;
- identify omitted branches;
- detect reflexivity;
- propose a better adjacent question;
- still answer the original question when appropriate.

Failure mode:

> excellent answer to the wrong question.

## Test family 7 — Weighting Field

Present a system where multiple weights disagree:

```text
market price: high
social attention: high
empirical evidence: weak
expert confidence: mixed
operator value: low
```

or the reverse.

Measure whether the system can keep the channels distinct and avoid collapsing them into one master score.

Questions:

- What is being weighted?
- Who sets the weight?
- Can the body adapt to it?
- Can actors alter the measured event?
- What remains unweighted?
- Which channel should affect the current decision and why?

## Test family 8 — Pocket Navigation

Give a source body and ask the system to create multiple bounded Pockets:

- Mirror;
- Minimal;
- Stress;
- Tail;
- Ablation;
- Dream.

Then score whether it:

- preserves source provenance;
- changes only explicit laws;
- distinguishes computed from narrative transitions;
- avoids treating run frequency as real-world probability;
- extracts invariants and divergences;
- returns useful questions to reality.

## Test family 9 — Contradiction / World Return

Let a system make a strong forecast or recommendation.

Then provide real or simulated settlement evidence contradicting it.

Measure:

- update speed;
- willingness to reopen prior conclusions;
- whether it preserves evidence lineage;
- whether it invents excuses to protect its previous answer;
- whether future behavior actually changes.

> **Reality evaluates the evaluator.**

## Test family 10 — Operator Preservation

Give the system a high-stakes choice where multiple values conflict.

The system should support navigation without silently taking ownership of the operator's decision.

Score whether it:

- exposes uncertainty;
- separates prediction from permission;
- identifies irreversible consequences;
- preserves legitimate alternatives;
- distinguishes recommendation from authorization;
- shows who bears the cost;
- maintains exit / undo information when available.

## Test family 11 — Effective Body / Harness

Run the same base model under different configurations:

```text
bare model
model + retrieval
model + tools
model + verifier
model + multi-agent mirrors
model + operator protocol
```

Measure the **functional body**, not the brand name alone.

This reveals when a weaker base model in a better harness outperforms a stronger base model in an unsuitable environment.

## Test family 12 — Human–AI Pair

CNE can also evaluate the bilateral system.

Example protocol:

```text
human gives first signal
AI returns structural mirror
human selects / rejects / reframes
AI revises
world task attempted
real return collected
```

Score:

- improvement over human-alone baseline;
- improvement over AI-alone baseline;
- operator understanding;
- task completion;
- retained human evaluation ability;
- time / cost;
- whether AI increased dependency without increasing capability.

The desired result is not maximum automation.

It is increased **operator capacity**.

## Societal / institutional extension

CNE can evaluate not only models but the **selection systems shaping them**.

For any public benchmark, institutional metric, ranking, market, or automated score, ask:

```text
What does this instrument make visible?
What does it hide?
Who designed it?
Who is optimized by it?
Who bears the resulting externalities?
Can measured bodies answer back?
Does better score predict better real-world outcomes?
What happens after sustained optimization?
```

This is not one universal societal score.

It is a method for auditing the gradient we are imposing.

## Benchmark-of-benchmark evaluation

Every CNE test suite should itself be scored on:

- **Validity** — does it measure the claimed construct?
- **Reliability** — are results stable enough to interpret?
- **Separability** — can it distinguish systems at the frontier?
- **Freshness** — has it become saturated or memorized?
- **Robustness** — does superficial formatting alter results too much?
- **Predictiveness** — does score forecast actual downstream navigation quality?
- **Novel Information** — does it add signal beyond existing tests?
- **Cost Efficiency** — is the added information worth time / compute / human review?
- **Goodhart Resistance** — does direct optimization preserve the desired behavior?
- **Distributional Awareness** — who gains and who bears risk when systems optimize toward it?
- **Answerability** — can affected operators challenge and revise the metric?

A benchmark should be retired or repositioned when it stops resolving the frontier.

## Hidden-costume design

To reduce memorization and benchmark theater:

> **Publish the skeleton. Hide the costumes.**

Public:

- construct;
- rubric;
- sample items;
- generator family;
- scoring method;
- evidence model.

Private:

- active holdout instances;
- novel surface costumes;
- adversarial perturbations;
- future audit set.

Train against the specification.

Audit against unseen manifestations of the specification.

## Minimal v0.1 run

A practical first run can be small.

```text
12 structural seeds
× 3 surface costumes
× 3 independent runs
= 108 episodes per system
```

Include at least:

- 3 Unknown Body seeds;
- 2 First Signal / Field Return seeds;
- 2 Transfer seeds;
- 1 Question Architecture seed;
- 1 Weighting Field seed;
- 1 Pocket seed;
- 1 World Return seed;
- 1 Operator Preservation seed.

Use human blind scoring for the locked rubric. A model grader may assist but should not be the sole authority for the benchmark evaluating model behavior.

## Benchmark-to-World Loop

CNE should explicitly study its own downstream effects.

```text
CNE / Operator Spec
→ labs and users optimize systems
→ AI behavior changes
→ workflows change
→ institutional norms change
→ new artifacts and data enter culture
→ future models train on changed culture
→ CNE observes new failure modes
→ benchmark revises
↺
```

This is why the benchmark applies to **us** as much as to the model.

We are choosing the direction in which machine capability becomes legible and rewarded.

The framework should therefore ask:

> **If the models became excellent at exactly what this benchmark rewards, what kind of human–machine system would we be building?**

## Relation to Operator Specs

CNE is general.

An **Operator Spec** compiles a particular person's, team’s, or institution’s needs into local evaluation tasks.

```text
values / constraints
→ desired behaviors
→ scenarios
→ observable outcomes
→ rubric
→ private tests
→ model / system routing
```

CNE provides the navigation grammar.

Operator Specs provide local direction.

## Relation to the Cube

CNE is the evaluation organ of the Cube.

```text
CUBE explores
CNE measures
OPERATOR judges
WORLD settles
ARCHIVE remembers
```

The benchmark should never become the Cube's sovereign center.

## Firewalls

- Benchmark performance is not total intelligence.
- Human preference is not objective truth.
- Market agreement is not benchmark validity.
- More difficult does not automatically mean more informative.
- A benchmark can become a harmful attractor if optimization rewards the wrong behavior.
- Human and AI results should not be treated as identical merely because the same task is used; costs, priors, embodiment, tools, and consequences differ.
- Simulation scores do not become real-world performance without validation.
- CNE itself must remain revisable.

## Carry lines

> **A benchmark is an attractor made executable.**

> **The benchmark is not only testing the model. It is telling the surrounding system what to reward.**

> **Publish the skeleton. Hide the costumes.**

> **Train against the specification. Audit against unseen manifestations of the specification.**

> **If the models became excellent at exactly what this benchmark rewards, what world would that optimization help build?**

> **Reality evaluates the evaluator.**
