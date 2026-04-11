# Execution Breath and Dojo Protocol

This document translates loop theory into a practical build cadence that avoids analysis paralysis and preserves quality.

## Core Problem

Many builders over-index on insight generation ("infinite inhale") and under-index on shipped artifacts ("no exhale"). The result is high conceptual clarity with low external progress.

## Breath Protocol

Run work in four phases:

1. Inhale
- Gather context and identify patterns.
- Time-box this phase to avoid endless expansion.

2. Pause
- Select the smallest controllable body (single function, single component, single route).
- Define success criteria before writing code.

3. Exhale
- Ship one minimal artifact that runs.
- Prefer completion over scope expansion.

4. Rest
- Refactor, annotate, and log what changed.
- Reset before the next cycle.

## Engineering Translation

1. Riverbeds over dams
- Encode branching logic as data mappings where possible.
- Reduce if/else sprawl and make behavior easy to extend.

2. Pure functions over hidden mutation
- Prefer input -> output transforms.
- Preserve prior state when history matters.

3. Immutable ledgers for trajectory
- Store event sequences instead of only latest state.
- This enables replay, audit, and recovery.

4. Single-cell progression
- Build one small high-quality unit per cycle.
- Compose from tested units rather than forcing large monolith changes.

## 30-Minute Daily Dojo (Reference)

1. 5 minutes: read existing code and constraints.
2. 15 minutes: implement one smallest-body artifact.
3. 5 minutes: run tests or basic verification.
4. 5 minutes: commit with explicit intent.

## Quality Gates

Before merge, confirm:

1. Boundary behavior is defined.
2. State mutation is intentional and visible.
3. Output is testable with deterministic inputs.
4. Changes are explainable in one paragraph.

## Operational Rule

If you are repeatedly expanding ideas without shipping, force a phase change:

1. Stop ingesting new context.
2. Pick one smallest-body target.
3. Deliver one artifact in the current cycle.

