# Eval Foundry and Operator Infrastructure Thesis v0.1

> **Classification:** product / market hypothesis. Not a company commitment and not investment advice.

## Thesis

As frontier models improve, many thin AI applications risk being absorbed into model-provider capabilities.

A more durable layer is not "another thing the model can eventually do by itself," but infrastructure that helps a person or organization answer:

```text
What do we actually need?
Which system fits our world?
How do we know it works?
What should remain human-controlled?
What private information may leave our boundary?
What failures must never recur?
When a new model arrives, should we switch?
```

CHIMERA's strongest commercializable body may therefore be an **Operator / Evaluation Infrastructure layer** rather than a generic AI wrapper.

Working name:

# Eval Foundry

## One-sentence product

> **Turn real goals, workflows, failures, and constraints into private executable evaluations, then use those evaluations to select, configure, route, and improve AI systems without surrendering operator judgment.**

## Why this can orbit frontier models instead of competing with them

A model provider improves the engine.

The Eval Foundry measures whether the new engine fits a specific vehicle, driver, road, and destination.

```text
frontier model capability ↑
        ↓
more possible workflows
        ↓
more routing / evaluation choices
        ↓
more need for local specification
```

The product benefits when models improve because every model release becomes a new candidate to test against the user's Operator Spec.

It is therefore closer to:

- measurement infrastructure;
- model routing;
- workflow QA;
- private regression testing;
- agent reliability;
- organization-specific adaptation;

than to a one-off chatbot feature.

## The wedge

Do not begin with a giant platform.

Begin with one offer:

> **Give us 20 real tasks or failures from your workflow. We turn them into a private eval suite and tell you which model + harness configuration works best, where it fails, and what should remain human-reviewed.**

Output:

```text
Operator Spec
+ private benchmark
+ system comparison
+ failure map
+ cost / latency profile
+ recommended harness
+ regression suite
```

That is already useful without fine-tuning.

## The customer progression

### Level 1 — Personal

A person builds a private evaluation profile for recurring work.

Examples:

- research;
- writing;
- coding;
- job search;
- teaching;
- creative work;
- information verification.

### Level 2 — Team

A team converts recurring failures and quality expectations into regression tests.

### Level 3 — Organization

An organization maintains:

- private task suites;
- domain graders;
- policy constraints;
- model-routing rules;
- production-failure replay;
- secure evaluation data;
- human review thresholds.

## Public core, private value

The existing CHIMERA Framework is CC BY 4.0. Treat openness as part of the strategy rather than pretending public framework text can remain exclusive.

### Public

- research paper;
- CNE construct;
- First Signal / Field Return protocol;
- benchmark schemas;
- sample tasks;
- open generator code;
- reproducibility manifests;
- public benchmark results;
- educational material.

### Private / service layer

- active hidden holdouts;
- customer data;
- customer-specific Operator Specs;
- proprietary failure corpora;
- secure evaluation environments;
- calibrated graders;
- model-routing history;
- regression history;
- integration work;
- workflow redesign;
- ongoing human calibration.

The defensible asset is not merely the idea of "evaluation." It is the accumulated relation among a customer's world, failures, tests, graders, and operational history.

## Why not start with fine-tuning?

Fine-tuning is downstream of specification.

```text
need
→ behavior
→ scenario
→ measurement
→ baseline
→ only then decide whether prompting, retrieval, tools, routing, or tuning is needed
```

Many problems may be solved by a better harness or better model selection without training anything.

Fine-tuning becomes one optional intervention after the benchmark tells us what is failing.

## Why not build another general agent?

General agent functionality is likely to improve rapidly at the model-provider layer.

A thin wrapper that says:

> "Our agent researches / writes / schedules / codes"

can be vulnerable to capability absorption.

A stronger layer says:

> "Our system knows what success means in your environment, can test any new agent against it, and preserves a private history of what actually failed for you."

That relation does not disappear when the underlying model changes.

## Model-agnostic body

Evaluate:

```text
model
+ harness
+ tools
+ retrieval
+ memory
+ agent topology
+ human checkpoints
+ cost
+ latency
```

A smaller model in a good harness may outperform a larger model in the wrong one.

The product therefore should not be loyal to one provider.

Its customer is the operator.

## Local / private agent path

A future personal version may maintain a small local model or local control plane for:

- private context;
- preferences;
- routing;
- Structural IR generation;
- evaluation history;
- permission boundaries.

The local body does not have to match frontier intelligence.

It can call stronger external models selectively while retaining private state and operator policy locally.

```text
PRIVATE WORLD
→ LOCAL CONTROL BODY
→ minimum necessary representation
→ frontier model / tool
→ abstract return
→ local rehydration
→ operator
```

## Structural IR as enterprise bridge

For sensitive environments, export the minimum structure necessary for the reasoning operation.

Do not assume removing names makes information safe.

Potentially sensitive structure includes:

- proprietary topology;
- rare categories;
- fraud logic;
- internal constraints;
- customer segments;
- strategic dependencies.

The correct question is:

> **What is the least information an outside intelligence needs to perform this reasoning operation?**

## The benchmark is also the product's compass

The company should itself be benchmarked.

Measure whether the Eval Foundry actually improves:

- downstream task quality;
- failure detection;
- model-switch decisions;
- operator understanding;
- time-to-evaluate a new model;
- total cost per successful task;
- regression detection;
- retained human judgment;
- customer ability to exit or export their eval body.

If the product merely produces impressive dashboards without predicting real workflow outcomes, it has become its own Clever Hans body.

## Attention before monetization

A reasonable early posture is:

```text
open research
→ useful benchmark
→ public comparisons
→ community replication
→ real users ask for local versions
→ service / hosted infrastructure emerges from demonstrated need
```

Do not charge merely because AI made a product easy to produce.

Charge only where there is recurring costly value such as:

- private integration;
- security;
- expert evaluation design;
- human calibration;
- reliable hosting;
- continuous regression;
- organizational change;
- specialized domain knowledge.

## Smallest company-shaped experiment

Before forming a large company body:

```text
1 real operator
1 repeated workflow
20-50 real tasks
2-4 models / harnesses
1 private eval suite
1 routing recommendation
1 month of world return
```

Question:

> Did the evaluation system help the operator make better model and workflow decisions than informal intuition alone?

If not, revise the product before scaling.

## Relationship to the research paper

The paper and product should not be the same object.

```text
PAPER
proves or falsifies one mechanism

CNE
provides broader evaluation grammar

EVAL FOUNDRY
turns local needs into executable tests

CUBE
provides the full navigation workflow

STORY
pushes the mechanisms to consequences ordinary product language cannot expose
```

This separation keeps scientific claims testable and product claims honest.

## Market risk

This thesis can fail.

Possible failure modes:

- providers absorb enough evaluation tooling that independent infrastructure becomes unnecessary;
- organizations refuse to maintain private test sets;
- custom eval design is too labor-intensive to scale;
- model graders are too unreliable;
- customers prefer provider lock-in to neutral routing;
- public benchmarks do not predict private workflow success;
- evaluation becomes commoditized faster than domain specification does.

The counter-hypothesis is that **local specification remains scarce even when generic evaluation tooling becomes abundant**.

That is what should be tested.

## Strategic posture

> **Do not compete with the frontier model at being the frontier model. Build an instrument that becomes more useful each time the frontier moves.**

The long-lived asset is the operator's map of what good means.
