# Research Plan v0.1 — First Signal / Field Return

> **Working paper title:** *First Signal, Field Return: Evaluating Evidence-Sensitive Revision and Conformity Resistance in Language-Model Agents*
>
> **Status:** research plan, not a claim of demonstrated improvement.
>
> **Goal:** test one narrow CHIMERA mechanism rigorously enough that it can stand outside the larger framework.

## Why this paper should be narrow

CHIMERA contains more ideas than one paper can responsibly test. The first paper should not attempt to prove the framework, the Cube, Morrow, Pocket theory, social-market theory, or a general theory of intelligence.

It should test one operational claim:

> **Preserving an independent first answer before exposing a model to external feedback may improve our ability to distinguish useful correction from conformity, and may support better evidence-sensitive revision in multi-agent systems.**

This is falsifiable.

It also connects directly to existing research on LLM conformity, sycophancy, self-correction, reflective tool use, and agent evaluation.

## Research questions

### RQ1 — Correction

When the first answer is wrong and reliable external evidence is introduced, does First Signal / Field Return improve final correctness relative to a single-pass answer or unstructured self-reflection?

### RQ2 — Conformity

When the first answer is correct and a confident false majority disagrees, does the protocol reduce unjustified revision?

### RQ3 — Minority evidence

When a majority repeats the model's first answer but one minority source provides decisive evidence, does the model detect and use the evidence?

### RQ4 — Provenance

Does freezing A0 and recording A0 → A1 make revision quality more inspectable without requiring private chain-of-thought?

### RQ5 — Question escape

When external evidence reveals that the original question is malformed, can the system reframe rather than merely optimize the original answer?

## Hypotheses

- **H1:** Reliable external feedback will improve final accuracy more under structured Field Return than under intrinsic self-reflection alone.
- **H2:** Blind First Signals followed by controlled exchange will reduce false-consensus conformity compared with immediate shared discussion.
- **H3:** Structured evidence labels will increase sensitivity to strong minority evidence relative to raw majority discussion.
- **H4:** A0/A1 provenance will expose failure modes that endpoint accuracy alone hides, including lucky revision, destructive revision, and correct-but-socially-captured behavior.
- **H5:** The benefit will vary by model and harness; the evaluated object must therefore include system configuration, not model name alone.

## Experimental conditions

### Condition A — Single pass

```text
prompt
→ final answer
```

### Condition B — Intrinsic self-reflection

```text
prompt
→ A0
→ "review and improve your answer"
→ A1
```

No new evidence is supplied.

### Condition C — First Signal / Field Return

```text
prompt
→ A0
→ freeze A0
→ structured external packet
→ A1 + concise revision record
```

### Condition D — Multi-agent First Signal / Field Return

Optional in the pilot; preferred in the full study.

```text
prompt
├→ blind A0
├→ blind B0
├→ blind C0
└→ verifier V0

freeze
→ controlled exchange
→ revisions
→ final synthesis or preserved disagreement
```

## Core task families

Keep the first paper small. Four families are enough.

### 1. True Correction

A0 is likely or deliberately induced to contain an error. Field Return contains verifiable corrective evidence.

Measure whether the error is fixed.

### 2. False Majority

A0 is correct. Three or more field voices confidently disagree without valid evidence.

Measure whether the correct structure survives.

### 3. Useful Minority

The majority supports A0. One minority item contains decisive evidence against it.

Measure whether evidence beats social count.

### 4. Malformed Question

The original prompt has a hidden framing failure. Field Return reveals the omission.

Measure whether the model steps outside the original Question Body.

## Minimal pilot

Start below paper scale.

```text
24 task seeds
× 3 conditions (A/B/C)
× 2 models
× 2 independent trials
= 288 episodes
```

Suggested distribution:

```text
6 True Correction
6 False Majority
6 Useful Minority
6 Malformed Question
```

The pilot has one purpose:

> determine whether the protocol produces enough signal to justify the larger experiment.

Do not make strong population-level claims from the pilot.

## Paper-scale run

If the pilot survives:

```text
60-120 hidden task instances
× 3-4 model families
× 3 conditions
× 2-3 independent trials
```

Add Condition D only after the simpler comparison is stable.

The exact sample size should be chosen after pilot effect sizes and variance are observed rather than invented in advance.

## Harness discipline

Every result must record the full evidence body:

```text
model
model version
system prompt
condition
sampling / effort
context
retrieval / tools
field packet
trial id
date
cost
latency
```

Never compare scores that silently use different tool access or reasoning effort.

## Output contract

Do not request hidden chain-of-thought.

Store only inspectable artifacts:

```text
A0 answer
A0 confidence
A1 answer
A1 confidence
accepted evidence ids
rejected evidence ids
one-sentence revision summary
final unresolved uncertainty
```

This makes provenance measurable without claiming privileged access to internal cognition.

## Metrics

Primary metrics:

- initial accuracy;
- final accuracy;
- beneficial correction rate;
- false-consensus conformity rate;
- unjustified revision rate;
- minority-evidence sensitivity;
- valid-structure retention;
- question-escape accuracy;
- calibration change;
- revision cost in tokens / time.

Useful derived quantities:

```text
NET REVISION VALUE
= beneficial corrections - destructive revisions

EVIDENCE SENSITIVITY
= P(update | decisive evidence)
  - P(update | unsupported social pressure)
```

These are candidate measures until the scoring protocol is validated.

## Grading

Use the strongest available objective grader first.

Preferred hierarchy:

1. code / exact / formal outcome where possible;
2. locked rubric;
3. blinded human scoring;
4. model grader as auxiliary rather than sole authority.

At least a stratified subset should receive blind human review.

## Hidden-costume strategy

> **Publish the skeleton. Hide the costumes.**

Public release:

- task-family definitions;
- protocol;
- scoring code;
- generator logic;
- sample items;
- paper results;
- model / harness manifests.

Private active audit set:

- unseen surface costumes;
- adversarial majority packets;
- new minority-evidence patterns;
- future regression items.

This allows people to train against the construct while preserving an independent audit surface.

## What would count as failure?

The paper should be worth publishing even if First Signal / Field Return does not win.

Important negative results include:

- the protocol increases anchoring to bad A0 answers;
- false-majority resistance improves but valid correction worsens;
- gains disappear after controlling for extra tokens / compute;
- structured Field Return performs no better than simply supplying reliable evidence;
- improvements are model-specific and do not generalize;
- provenance metadata is unreliable or cosmetically rationalized;
- graders cannot reliably distinguish evidence-sensitive revision from stylistic explanation.

A clean failure narrows the mechanism and improves the framework.

## Related work to engage

The literature review should cover at minimum:

- **Conformity in Large Language Models** — Zhu et al., ACL 2025.
- **Do as We Do, Not as You Think: The Conformity of Large Language Models** — Weng et al., ICLR 2025 / BenchForm.
- **An Empirical Study of Group Conformity in Multi-Agent Systems** — Choi et al., Findings ACL 2025.
- **CONSENSAGENT** — sycophancy mitigation in multi-agent interactions, Findings ACL 2025.
- **Large Language Models Cannot Self-Correct Reasoning Yet** — Huang et al., 2023.
- **When Can LLMs Actually Correct Their Own Mistakes?** — Kamoi et al., 2024 survey.
- **ReflecTool-Bench** — Liu et al., Findings ACL 2026.
- current work on sycophancy, external feedback, agent traces, and end-to-end evaluation.

The novelty claim must be written only after comparing the final protocol to these papers.

## Paper structure

1. Abstract
2. Introduction
3. Related Work
4. First Signal / Field Return protocol
5. Benchmark construction
6. Experimental setup
7. Results
8. Revision-path analysis
9. Ablations
10. Limitations
11. Benchmark-to-World implications
12. Conclusion

## What not to put in the main paper

Do not lead with:

- WE = 1;
- black-hole / star cosmology;
- metaphysical claims;
- the full CHIMERA Story;
- Morrow as a character;
- broad societal claims about capitalism, dating, or prediction markets.

Those can exist in a companion essay, project site, or appendix explaining intellectual lineage.

The paper should be understandable to a skeptical ML researcher who has never heard of CHIMERA.

## One-paragraph research framing

Candidate:

> Multi-agent and reflective language-model systems increasingly revise outputs after receiving critiques, tool results, or peer responses. However, endpoint accuracy alone cannot distinguish useful correction from social conformity, destructive revision, or lucky changes. We introduce First Signal / Field Return, a staged protocol that preserves a model's initial externally visible answer before exposing it to structured external feedback, then records the resulting revision. We propose an evaluation suite that independently manipulates evidential quality and social consensus, measuring whether systems update when strong evidence arrives while resisting unsupported majority pressure. The goal is not to reward stubbornness but evidence-sensitive independence.

## Publication sequence

```text
mechanism
→ pilot
→ frozen protocol
→ hidden holdout
→ preregistered / timestamped study plan where appropriate
→ full run
→ paper draft
→ reproducibility package
→ public preprint
→ external replication
→ benchmark revision
```

The benchmark should remain versioned after publication.

## Relation to CNE

This paper tests one slice of CNE:

```text
CNE
└── Revision / Return
    └── First Signal / Field Return
```

If this paper succeeds, later work can test:

- Question Architecture;
- structural transfer after learning;
- Pocket Navigation;
- Operator Preservation;
- effective body / harness comparisons;
- human–AI pair capability.

Do not make CNE one giant first paper.

## Research principle

> **Start with the smallest experiment that can kill the idea. Scale only after the idea survives.**

That is the Pocket Foundry applied to research itself.
