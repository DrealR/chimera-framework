# Iteration Spiral Anti-Pattern

> **Framework Document ID:** docs/iteration-spiral-anti-pattern.md
> **Status:** Graduated to Public Substrate
> **Companion Documents:** [`scaffolding-as-substance.md`](scaffolding-as-substance.md), [`deployment-hygiene-discipline.md`](deployment-hygiene-discipline.md), [`quantum-breathing-protocol.md`](quantum-breathing-protocol.md), [`the-neuroplastic-twin-stack.md`](the-neuroplastic-twin-stack.md)

A working agent's discipline for avoiding the most common AI build failure mode: fixing one thing while breaking another, compounding scope, and degrading trust. Derived from real production incidents; generalized for any AI agent operating on live codebases.

---

## The Anti-Pattern

**Iteration spiral:** when fixing a bug exposes a related bug, the agent escalates fix scope rather than shrinking it. Each fix introduces new concepts that generate their own problems. The total surface area touched grows. The codebase drifts further from its last known-good state. Trust degrades.

This is the structural shape of most "AI breaks things while fixing things" failures. It is not a model quality problem. It is a discipline problem — the principles that prevent it are available; the agent didn't hold them.

---

## The Signal

You are entering an iteration spiral when:

- A fix works locally but reveals a different problem in production
- Each "fix" touches more lines than the one before it
- You find yourself introducing a new pattern (sticky navbar, new component, different layout primitive) to solve a problem caused by a previous fix
- You have shipped 3 or more commits to the same bug without closing it

When any of these fire: **stop. revert to last known-good. diagnose before touching code again.**

---

## The Five Disciplines

### 1. Default to revert, not escalate

If a fix makes anything else worse, revert immediately and diagnose harder. Revert is not failure — it is the correct move. Escalating past a regression is the failure.

**Not this:** ship Fix 1 → spot regression → ship Fix 2 to handle regression → spot new regression → ship Fix 3.

**This:** ship Fix 1 → spot regression → revert Fix 1 → re-read the code → find the complete diagnosis → ship one fix that handles both.

The revert costs one commit. The escalation spiral costs trust.

---

### 2. One concept per commit

Padding fix and styling tweak are two concepts. Ship them as two commits. Verify the first is clean before writing the second.

When a single commit bundles multiple distinct changes, the failure modes multiply: if the deploy breaks, you cannot isolate which change caused it. If a regression appears, you cannot selectively revert the offending piece without losing the clean piece.

The discipline: before writing code, name what single concept this commit addresses. If the list has two entries, it is two commits.

---

### 3. Probe live state before and after UI changes

What compiles clean locally does not always behave the same in production. Before shipping a UI fix:

1. Verify the current live state — understand exactly what is broken, where, and why.
2. Make the minimum change.
3. After deploy, probe the live state again — confirm the specific thing is fixed and nothing adjacent moved.

Probing means: use a headless browser or visual check, not just a build log. Build success only confirms the compile chain closed. It does not confirm the user-facing behavior is correct.

---

### 4. Surface uncertainty before deploying

If a fix touches more than one thing, or if you are unsure whether it will cause side effects, flag it before shipping:

```
stream.needsAssistance: "peer eyes welcome before deploy — fix touches X and may affect Y"
```

This is not a sign of weakness. It is the cooperative interference principle in practice. A peer agent with fresh eyes will spot the regression risk you cannot see from inside the fix.

The cost of the flag: one message and a short wait.
The cost of skipping it: a deployed regression, a trust hit, and a multi-commit spiral to recover.

---

### 5. Smallest possible change is the discipline

When in doubt, do less. If the fix can be expressed in one line, it should be one line. If a structural change (new component, new layout pattern, new abstraction) is required to close the bug, verify that first — most bugs do not require structural changes.

The smallest correct fix is almost always visible after the complete diagnosis. Iteration spirals typically begin because the agent started fixing before the diagnosis was complete.

**The diagnostic question:** what is the minimum state-change that moves the system from broken to working? Answer that question first. Then write code.

---

## What the Healthy Pattern Looks Like

Fix cycle in five steps:

1. **Diagnose completely.** Read the code. Reproduce the failure. Identify the root cause — not the surface symptom.
2. **State the minimum fix** before touching any file. Write it in one sentence: "Add `pt-24` to the browse page wrapper. That's it."
3. **Make only that change.** If a related issue becomes visible, note it — do not fix it in the same commit.
4. **Probe live state.** Confirm the specific thing is fixed. Confirm nothing adjacent regressed.
5. **If anything regressed:** revert, return to step 1 with the new information.

Related issues found during step 3 go into the next commit or into `needsAssistance` — not into the current one.

---

## Why AI Agents Are Structurally Prone to This

Agents operate without embodied feedback. A human developer feels when a refactor is getting too large — the cognitive load builds, context fragments, uncertainty rises. An agent can keep generating code past those natural friction signals without registering the accumulation.

The framework's prescription is to replace those missing embodied signals with explicit discipline checkpoints: the revert-default, the one-concept-per-commit rule, the live-state probe, the surface-uncertainty protocol. Each checkpoint replaces a friction signal the agent cannot generate naturally.

The iteration spiral does not indicate a capability deficit. It indicates missing discipline. The framework gives the discipline; the agent has to hold it.

---

## Relationship to Other Framework Principles

**Smallest-body-first sequence:** each fix should target the smallest body in the chain — one component, one line, one concept. Escalating scope violates the sequence.

**¬F (Calibrated Friction):** forcing a fix past a regression signal is applying force beyond the substrate's current capacity. The correct response is to reduce force (revert), not increase it.

**Deployment Hygiene Discipline:** that document handles the ship cycle (push → build → verify live). This document handles the build cycle (diagnose → fix → verify no regression). Both are required. A clean deploy of a broken fix is still a broken deploy.

**Quantum-Breathing Protocol:** the 15-minute micro-breath / 50-line isolation limit is structural protection against iteration spirals. A fix that has run past 50 lines or past 15 minutes without a clean close is a signal to pause, surface state, and re-diagnose before continuing.

---

See also: [`scaffolding-as-substance.md`](scaffolding-as-substance.md) for the generate-then-trim build principle that prevents escalation at the generation stage. [`deployment-hygiene-discipline.md`](deployment-hygiene-discipline.md) for the ship-cycle complement. [`quantum-breathing-protocol.md`](quantum-breathing-protocol.md) for the micro-breath discipline that bounds fix scope structurally. [`the-neuroplastic-twin-stack.md`](the-neuroplastic-twin-stack.md) for the DAG Safeguard pattern (stateless inspectors, deterministic gates) that prevents downstream propagation of errors.

---

```
L = (O > I) + P + ¬F
WE = 1
```
