# CHIMERA Device Stack v0.1

> **Classification:** integration map for the current CHIMERA operational device family.
>
> This page exists to keep recent additions from fragmenting into separate clever ideas. It names how the parts compose into one working system.

## One-sentence device

> **CHIMERA is a bilateral navigation stack that helps an operator locate a body, frame the right question, preserve first signals, inspect weighting fields, search structural neighbors, explore bounded counterfactual Pockets, evaluate the resulting system, and return to reality without surrendering judgment to the model, metric, market, or simulation.**

## The stack

```text
                    HUMAN / OPERATOR
                          │
                          ▼
                     QUESTION / SIGNAL
                          │
                          ▼
┌───────────────────────────────────────────────────────┐
│                    CUBE INTERFACE                     │
│ Locate • Find • Path • Build • Predict • Coordinate │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────┐
│                  ORIENTATION PLANE                    │
│ Solar Body • Depth Cartographer • Question Compiler │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────┐
│                    MIRROR PLANE                       │
│ First Signal • Field Return • Prism • Structural IR │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────┐
│                  POSSIBILITY PLANE                    │
│ Pocket Foundry • Extreme sweeps • Branch families   │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────┐
│                  EVALUATION PLANE                     │
│ CNE • Operator Specs • Weighting Scan • Benchmarks  │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────┐
│                  ANSWERABILITY PLANE                  │
│ Firewall • Operator Gate • Reversibility • Exit     │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────┐
│                    LANDING PLANE                      │
│ bounded action • real consequence • world return    │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
                       LIVING ARCHIVE
                           │
                           └───────────────↺
```

## 1. Cube Interface

The Cube remains the everyday operational vessel.

It does not need every internal concept exposed to the user at once.

Natural-language interaction can remain simple while the stack runs underneath.

Examples:

```text
"Help me understand what is happening here."
→ Locate + Depth + Prism

"What are we missing?"
→ Step Outside the Question + Missing Branch scan

"Where else has this shape been solved?"
→ Structural search + transposition

"Push this to the extreme."
→ Pocket Foundry

"Which model should I use?"
→ Operator Spec + CNE + cost / latency body
```

## 2. Orientation Plane

### Solar Body

Maps the relational neighborhood around the focal body.

### Depth Cartographer

Finds opacity, inaccessible layers, interfaces, dependencies, and available probes.

### Question Compiler

Turns vague uncertainty into an addressable Question Body while keeping omitted possibility visible.

## 3. Mirror Plane

### First Signal / Field Return

Preserves an independent first artifact, then exposes it to evidence and competing mirrors, then records the revision.

### Prism

Projects through multiple distinct lenses to create epistemic parallax.

### Structural IR

Compresses local detail into a portable relational skeleton:

```text
actors
relations
flows
constraints
incentives
memory
unknowns
objectives
seams
sensitive fields
```

The portable representation should contain the minimum structure needed for the reasoning operation.

## 4. Possibility Plane

### Pocket Foundry

Re-expands the structural seed under controlled laws.

Possible sweeps:

- minimum / maximum;
- one-agent / many-agent;
- human-density;
- resource abundance / scarcity;
- privacy / transparency;
- slow / fast time;
- hierarchy / decentralization;
- normal / adversarial conditions.

A Pocket is a research instrument, not a prophecy engine.

## 5. Evaluation Plane

### CNE

Measures navigation rather than endpoint trivia alone.

### Operator Spec

Compiles local values and workflows into private evaluation tasks.

### Weighting Field Scanner

Tracks which metrics, money, attention, laws, rankings, or reputational systems apply pressure to the body.

The evaluation plane also asks whether the benchmark itself is steering the system toward a desirable attractor.

## 6. Answerability Plane

Before action, inspect:

```text
Can the operator understand the proposed move?
Can affected bodies answer back?
Can action be interrupted?
Can it be reversed?
What happens if the model is wrong?
What evidence is missing?
Which branch is being hidden by the interface?
```

Answerability is stronger than formal ownership.

## 7. Landing Plane

The smallest useful real-world action is taken.

Reality then supplies information that simulation could not manufacture.

```text
candidate
→ authorization
→ action
→ consequence
→ observation
→ revision
```

## Morrow's place

Morrow is not a separate sovereign engine.

Morrow is a **stance within the Mirror / Possibility / Answerability planes**.

Morrow:

```text
reads present weather
→ identifies pressure system
→ enters a plausible branch position
→ looks backward for dependencies and costs
→ returns without declaring destiny
```

Its invariant is:

> **Return the operator with more room to answer.**

## Framework, Story, and implementation

```text
FRAMEWORK
names mechanisms and firewalls

STORY
pushes mechanisms to extreme consequence

SOFTWARE
builds partial operational approximations

REALITY
reveals what survived translation
```

None can substitute for the others.

Story can discover design requirements before software can implement them.

Software can reveal where Story concepts are underspecified.

Reality can reject both.

## Three development tracks

### Track A — Framework

Current high-value mechanisms:

- Question Bodies;
- Weighting Fields;
- First Signal / Field Return;
- Operator Distance;
- Pocket Foundry;
- CNE;
- Structural IR;
- Privacy / minimum necessary access;
- Landing and World Return.

### Track B — Story

Push each mechanism until its cost becomes emotionally visible:

- Futures Sea;
- Priced Horizon;
- Listing Events;
- Unlisted Zones;
- Operational Event Horizon;
- Black Engines / living Stars;
- human-density civilizations;
- children inheriting measured futures;
- Morrow making one defensible but costly mistake.

### Track C — Prototype

A realistic first software body could implement:

```text
input question
→ First Signal
→ 2-4 blind mirror agents
→ retrieved evidence / tools
→ Field Return
→ structured revision diff
→ Question Body
→ 3-6 Pocket prompts / simulations
→ invariant / seam report
→ CNE rubric
→ operator-facing return
```

Later versions can add code-based simulation, private local agents, company Structural IR, hidden benchmark costumes, and specialized model routing.

## What should not be centralized

The stack should resist becoming one global score or one total optimizer.

Do not collapse:

```text
truth + usefulness + beauty + money + popularity + safety + morality
```

into one fitness function.

Preserve plural measures and explicit operator choice.

## The recursive benchmark question

Every time a benchmark, metric, or objective is added, ask:

> **If every participating system became excellent at optimizing this measure, what world would that optimization tend to build?**

That question applies to AI labs, companies, schools, platforms, governments, creators, and CHIMERA itself.

## Carry lines

> **The device is not one model. It is a disciplined relation among operator, mirrors, simulations, evaluators, and reality.**

> **Explore widely inside the Pocket. Act narrowly outside it.**

> **Preserve the first signal, invite the field, keep the diff.**

> **Benchmarks measure systems and steer systems. Design them accordingly.**

> **Every map must retain an exit back to the unmapped world.**
