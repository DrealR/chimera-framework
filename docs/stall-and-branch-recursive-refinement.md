# Stall-and-Branch Recursive Refinement

> **Classification:** experimental mechanism for iterative LLM systems and Pocket search.
>
> This mechanism grew from PromptForge-style loops in which an artifact is repeatedly passed through the same transformation rule. It does not claim that recursive LLM refinement improves indefinitely, nor that the process is quantum tunneling or a physical engine.

## Core form

Treat a model call plus its fixed transformation instruction as an operator:

```text
x_(t+1) = F(x_t ; rule, model, decoding, context)
```

A PromptForge-style loop repeatedly applies the operator:

```text
x0 → F → x1 → F → x2 → F → ...
```

The important empirical observation is that repeated application often stops producing meaningful improvement.

That is not merely a failure condition.

> **A stall can be information about the local possibility-space induced by the current rule, model, evaluator, and artifact.**

## What a stall may mean

A plateau can have several causes that must not be collapsed:

- **soft fixed point** — the model repeatedly returns approximately the same semantic artifact;
- **cycle** — the artifact oscillates among a small set of states;
- **rule exhaustion** — the transformation instruction is too broad to specify the next useful direction;
- **model ceiling** — the current model cannot reliably produce the missing transformation;
- **evaluator saturation** — the score no longer resolves improvements even when changes occur;
- **artifact bottleneck** — further gains require external data, tools, execution, or a changed representation;
- **cost frontier** — improvements continue but marginal gain is no longer worth time / tokens / money.

Therefore:

```text
stall != solved
stall != impossible
stall != proof of model limit
```

## Stall detector

A useful system needs an external measurement body rather than asking the refiner whether it feels done.

Let `Q(x_t)` be one or more external quality measures.

Candidate signals:

```text
ΔQ_t        = Q(x_t) - Q(x_(t-1))
edit_t      = distance(x_t, x_(t-1))
semantic_t  = semantic distance(x_t, x_(t-1))
novelty_t   = new validated structure introduced at step t
cost_t      = incremental time / tokens / money
```

A provisional stall can be declared when, for `k` consecutive iterations:

```text
|ΔQ_t| < ε_quality
AND
semantic_t < ε_semantic
```

or when a cycle detector finds repeated states.

The thresholds belong to the task body. There is no universal `ε`.

## Branch on stall

Once a local trajectory stalls, do **not** simply increase the number of identical iterations.

Change the search geometry.

```text
trajectory stalls at x*
        ↓
inspect missing dimensions / evaluator failures
        ↓
generate branch directions d1 ... dn
        ↓
create altered rules F1 ... Fn
        ↓
run each branch until its own stall
        ↓
compare branches with external evaluator
        ↓
retain useful invariants / seams
```

Working name:

# **Stall-and-Branch Search**

The branch generator should answer:

> **What new constraint, lens, evidence source, objective, representation, or transformation rule would make movement possible from this local attractor?**

## Relation to Pockets

A recursion chain is a one-dimensional walk through possibility-space under a mostly fixed rule.

A Pocket Constellation generalizes it:

```text
one rule / one trajectory
→ detect stall
→ alter one law or search direction
→ multiple trajectories
→ compare returns
```

This is the software-scale analogue of creating several Pockets from one World Seed.

The important transition is:

```text
MORE STEPS
```

becoming:

```text
A BETTER QUESTION ABOUT WHICH DIRECTION DESERVES MORE STEPS
```

## Relation to First Signal / Field Return

The loop can preserve provenance at every branch:

```text
x_t
→ proposed refinement x_(t+1)
→ external field / evaluator return
→ accepted change
→ diff
→ next state
```

When a stall occurs, the system should preserve the final local state before exposing it to branch proposals, exactly as First Signal / Field Return preserves `A0` before social pressure.

This allows researchers to measure whether the branch actually escaped the attractor or merely rewrote the surface.

## Relation to benchmarks

A benchmark provides a direction field only over dimensions it measures.

If the evaluator is too broad — for example `make this better` — repeated refinement may converge to generic stylistic preferences.

A stall can therefore indicate that the benchmark itself needs more resolution.

Example:

```text
general quality plateaus
↓
decompose into correctness / usability / novelty / latency / robustness
↓
find weak coordinate
↓
branch specifically on that coordinate
```

> **When broad improvement stalls, increase measurement resolution before increasing recursion depth.**

## Minimal experiment

For a task with an objective grader:

1. Generate `x0`.
2. Apply the same refinement operator for up to 20 iterations.
3. Record quality, edit distance, semantic distance, cost, and latency.
4. Detect the first plateau.
5. At the plateau, generate 3–5 branch directions from evaluator deficits.
6. Run each branch for up to 10 further iterations.
7. Compare:
   - fixed-rule recursion;
   - random new instruction;
   - evaluator-guided branching;
   - stronger model at the original fixed rule.
8. Report marginal gain per token / dollar / second.

This tests whether branching buys actual movement rather than additional prose.

## PromptForge lineage

PromptForge already implements the important primitive:

```text
current content
→ model + system / rule prompt
→ output
→ output becomes next iteration input
```

and supports model schedules and iteration diffs.

The next research upgrade is therefore not to replace PromptForge but to add:

- objective evaluators;
- stall detection;
- cycle detection;
- branch proposal;
- branch comparison;
- cost accounting;
- provenance-preserving checkpoints.

## Research firewall

Recent recursive-refinement research should be treated as adjacent evidence, not retroactive proof of CHIMERA. If external work independently observes convergence toward soft fixed points, that supports investigating the mechanism while also reducing novelty claims around the basic fact of saturation.

Potential CHIMERA contribution lies instead in the integrated operation:

> **detect the local attractor, treat the stall as a navigation signal, change the Question Body or transformation rule, branch deliberately, and preserve a return path.**

## Carry lines

> **A stall is not the end of the space. It may be the end of what this rule can currently see.**

> **Do not pay for more identical steps when the direction field has gone flat.**

> **When broad improvement stalls, increase measurement resolution before increasing recursion depth.**

> **Stall → inspect → branch → walk → measure → return.**
