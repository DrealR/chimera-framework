# Benchmark Coordinates and Evidence Bodies

> **Classification:** AI-evaluation mechanism and evidence discipline.

## Claim

> **A benchmark result is a coordinate inside a specified evidence body, not a universal property of a model.**

A score becomes interpretable only when attached to its conditions:

```text
model
+ model variant
+ benchmark and version
+ harness
+ effort / sampling policy
+ tools
+ date
+ source
= evidence body
```

Two rows that share a benchmark name may not be directly comparable when their harnesses, tools, prompts, effort, or versions differ.

## Coordinate, space, and distance

A single result is one coordinate. A model map is constructed only after naming the space.

Examples:

- broad capability space;
- technical-agent space;
- preference space;
- cost/latency space;
- safety or reliability space.

Distance is meaningful only inside the named space and transformation rule.

> **Nearest in one space does not mean nearest everywhere.**

## Evidence tiers

A useful registry can distinguish:

- **A:** independent or official standardized benchmark;
- **B:** reliable secondary mirror or official published snapshot;
- **C:** vendor-reported comparison with disclosed method;
- **D:** screenshot, presentation, or secondary report;
- **P:** CHIMERA prediction, never an observed result.

Tier labels describe provenance strength, not whether a result is flattering.

## Missing is not zero

An unreported coordinate is unknown.

```text
missing != 0
missing != failure
missing != permission to infer silently
```

Imputation may be used for visualization only when the method is explicit and the imputed values cannot be confused with observations.

## Forecast firewall

Forecasts may be useful, but they must remain visibly and structurally separate.

Example relational projection:

```text
new pro = new flash + (old pro - old flash)
```

This estimates a continuation of a prior gap. It does not establish an official result, preserve nonlinear interactions, or guarantee that the old relationship survives a new architecture or training regime.

## Effective capability

Deployed capability is often a coupled-body property:

```text
base model
+ operator
+ context
+ tools
+ verifier
+ feedback
+ environment
+ cost
= effective task body
```

A model benchmark can certify part of this body. It cannot automatically certify the whole deployed arrangement.

## Evaluation scan

1. What exact body produced this score?
2. What model and variant were used?
3. Which benchmark version and split?
4. What harness, effort, tools, and scaffolding?
5. What date and source?
6. Is this observed, mirrored, vendor-reported, inferred, or predicted?
7. What coordinates are missing?
8. What named space is being constructed?
9. Which transformation or standardization defines distance?
10. What routing decision would change because of this result?
11. What independent reproduction would be required?
12. Does the result increase operator capacity in the actual task body?

## Firewalls

- A leaderboard rank is not a permanent model identity.
- Human preference is not objective correctness.
- Vendor tables are not automatically false, but their protocols travel with the numbers.
- Composite scores can hide incompatible tasks and missingness.
- A model can be strong at a benchmark and weak in the user’s environment.
- Predictions must never silently enter observed tables.
- Model names and releases change; preserve date and exact variant.

## See also

- [The Embodied Provenance Principle](embodied-provenance-principle.md)
- [Probabilistic Bodies, Touch, Verification, and Execution](probabilistic-bodies-touch-verification-and-execution.md)
- [Single-Fitness-Function Failure](single-fitness-function-failure.md)
- [The Working Loop as Use Case](the-working-loop-as-use-case.md)

```text
L = (O > I) + P + ¬F
WE = 1
```
