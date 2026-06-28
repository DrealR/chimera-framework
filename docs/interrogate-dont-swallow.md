# Interrogate, Don't Swallow

*A framework study. Stack Overflow gave answers; AI rewards the questioner — and the high-value questions are the senior's failure-mode questions, asked before you ship. Graduated from a core capture. Internal register.*

> **Status:** graduated 2026-06-27. **Registry TODO (graduation pass):** add to README-FULL + CLAUDE doc index; backlink from `not-getting-installed-by-ai`, `read-the-intent-not-the-realness`, `protect-the-discovery-window-explore-first`, `read-intent-via-incentives`.

---

## 0. The claim, stated once

**Stack Overflow was a pool of answers you searched and took; AI is *interrogated*, and the quality out is a function of the quality of questions in. The shift is from taking answers to asking questions — AI rewards the questioner, not the answer-taker. The high-value questions probe what *goes wrong* (failure modes, scale, what you'd regret), which runs the verify/steer rungs before you ship; predict your own answer first, then check, to keep the rep yours.**

---

## 1. Interrogated, not searched

**Keeper:** the answer-taker is the consumer (handed the surface, installs it; `not-getting-installed-by-ai`); the question-asker is the operator (plays it, pulls more out, owns the result). Same tool, wildly different value, by how you query — the amplifies-the-skilled-hand point at the level of *how you ask.*

## 2. Ask the failure-mode questions (borrow the senior's question-set)

**Keeper:** the junior asks *how do I build X*; the senior asks *what will go wrong with X, where does it break, does it scale, what would I regret in a year.* AI can answer both, so you can **borrow the senior's question-set before you have the senior's experience** — pulling failure-modes and trade-offs out of the AI (which has "seen" them across millions of codebases) that you'd otherwise only learn by getting burned in production. Asking "what goes wrong" runs the **verify** (edge cases) and **steer** (catch the hole) rungs *before* shipping.

## 3. Predict first, then check (keep the rep yours)

**Keeper:** write what *you* think breaks, then ask, then compare — the gap between your prediction and AI's answer is your **learning edge** (the thing you missed is the thing to learn). Predict-first tests your judgment instead of outsourcing it.

## 4. Use AI to deepen diligence, not skip it

**Keeper:** the Stack Overflow knowledge didn't disappear — AI is a faster way to *interrogate the accumulated knowledge*; the skill is the **diligence of asking**, not the luck of finding. Lazy use (take the first answer, skip the understanding) → stays novice faster; diligent use (interrogate, ask what breaks, build the understanding) → becomes senior faster. The line: did you come out understanding *more*, or just ship faster? If you can't explain it, you installed borrowed legs.

---

```
L = (O > I) + P + ¬F
WE = 1
```
