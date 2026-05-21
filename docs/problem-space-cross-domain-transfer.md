# Problem-Space Cross-Domain Transfer

A working method for finding solutions: do not invent. Locate.

Most of the solutions you need already exist — in some other domain, attached to some other problem, named in some other vocabulary. The skill is not creative invention. The skill is **structural recognition followed by disciplined porting**.

This document names the engine in four moves, gives three worked examples teaching three different structural primitives, and ends with the failure mode that turns this method into cargo-cult thinking when its discipline is dropped.

## The four moves

1. **Spot the problem's structure, not its surface.**
   The surface is the domain vocabulary: "waitress workflow," "homework backlog," "code deploy queue." The structure is the abstract relation: *many small operations with travel cost, optimizing total completion time*. Surface descriptions do not port. Structures do.

2. **Find that structure already solved somewhere unrelated.**
   Solutions are easier to find than to invent because some domain has already paid the cost of solving the structure. Walk the structure across domains in your head: biology, physics, sports, cooking, music, software, fiction. The structure you face is almost always recognizable in at least one of them.

3. **Name it precisely enough to carry.**
   "Rhythm" does not port. "Batch by route, not by request order" ports. A name carries when a builder in a different domain could implement from the name alone. If your name is a vibe, the transfer will not survive contact with the new domain's constraints.

4. **Check what new problem it imports.**
   A transferred solution always brings luggage. A solution that solved problem A in domain X has *side effects* that may become problem B in domain Y. Step four is asking: *what does this structure bring with it that I do not want?*

A real cross-domain transfer is move 1 → 2 → 3 → 4. Skipping move 4 produces cargo cults: copies of a structure that worked elsewhere, deployed without their preconditions or their costs.

## Worked example 1 — Waitress workflow ⇄ instruction batching

**Surface:** a waitress in a busy restaurant handles many tables at once and stays fluid; a programmer with a pile of small tasks bogs down.

**Structure (move 1):** many small operations, each tied to a location or context, with a switching cost between contexts. Total completion time depends not on operation count but on **switch count**.

**Found elsewhere (move 2):** the same structure is solved in three places independently:
- Route optimization — the traveling-salesman problem.
- CPU instruction pipelining — batch operations that share resources to reduce stall cycles.
- Kitchen mise en place — group prep by station and tool.

**Precise name (move 3):** *Batch by route, not by request order.* Group operations whose contexts overlap, execute them in one pass, return.

**Imported problem (move 4):** batching increases *latency on individual requests*. A diner whose order comes second in a route waits longer than if their order were processed first-in-first-out. In a kitchen this is acceptable. In a 911 dispatch it is not. Batching trades total throughput for individual fairness; the receiver of that trade-off matters.

**Verdict:** transfer is real. The waitress is doing route-optimization in physical space. A programmer who reorganizes a task list by *context* rather than *order received* gets the same compression. Step four keeps the transfer honest: do not batch in domains where individual latency is load-bearing.

## Worked example 2 — Star formation ⇄ tunable equilibrium

**Surface:** a star is a vast nuclear furnace; melanin is a skin pigment.

**Structure (move 1):** two opposing forces balanced against each other, where the "solution" *is* the balance point. In a star: gravity pulls inward; fusion pressure pushes outward; the star is the stable cancellation of the two. In skin pigmentation: too little melanin under strong UV breaks folate (reproductive failure); too much melanin under weak UV blocks vitamin D (bone failure); the optimum is the balance.

**Found elsewhere (move 2):** the same structure shows up wherever a system has a real cost on both sides of a variable. Predator-prey populations. Compression vs. fidelity in encoding. Speed vs. safety in engineering. Risk vs. return in finance. Inhale vs. exhale in breath. Two-sided constraints with a moving optimum.

**Precise name (move 3):** *Tunable equilibrium.* The "answer" is not a value; it is a relation between the body and its environment. The setting that was correct in one environment can become wrong in another without the body changing — only the environment did.

**Imported problem (move 4):** tunable equilibria can be in *mismatch* when the body cannot retune as fast as the environment changes. A human with deep skin under low-UV sky is in mismatch; the dial is correct for the ancestors' sky, wrong for the current one. This is the connection to [Rate Mismatch as a Structural Primitive](rate-mismatch-as-primitive.md).

**Verdict:** transfer is real. Stars and skin are reading the same structural class. Teaching a child that the answer is a *balance point* gives them a class of problem they will recognize for the rest of their life.

## Worked example 3 — Restaurant staff coordination ⇄ team flow

**Surface:** a basketball team flowing well is exciting; a solo programmer with their door closed and their phone off is producing.

**Structure (move 1):** these look like the same thing — both "getting work done." They are not. **Different bottleneck variable.** Team-flow's bottleneck is coordination cost: signals between teammates that have to land cleanly under time pressure. Solo-deep-work's bottleneck is context-rebuild cost: the time it takes to reload a problem after interruption. Both are "performance." The thing throttling each is different.

**Found elsewhere (move 2):** the team-flow structure shows up wherever success depends on *real-time multi-agent coordination*: jazz quartet, surgical team, swarm-foraging ants. The solo-deep-work structure shows up wherever success depends on *long uninterrupted single-context cognitive work*: novelist, mathematician, debugger, sculptor.

**Precise name (move 3):** two different structures, distinguished by *which variable is the bottleneck*. Naming this precisely is the work — once you can name them apart, the transfer becomes safe.

**Imported problem (move 4):** **this is the move that catches a major class of failure.** If you take "team flow is great, let's make solo work more like team flow" — open offices, constant slack pings, daily stand-ups for individual contributors — you have ported the *coordination structure* onto a *context-rebuild bottleneck*. You did not improve performance; you broke it. The transfer fails not because the source structure was wrong, but because the *load-bearing variable was different*.

**Verdict:** transfer would fail without move 4. This worked example exists specifically to teach the discipline of move 4. The failure mode it names is one of the most common in management, design, and self-organization.

## The failure mode: cargo-cult cross-domain transfer

When move 4 is skipped, the method produces patterns that *look like* successful structures from another domain, deployed without their preconditions or accounting for their costs. Open offices (copying team-flow structure into solo-work domains). Agile rituals in solo creative work (copying coordination-overhead into single-creator domains). "Move fast and break things" in life-critical systems (copying a startup software constraint into surgery, aviation, journalism). Each of these copies a structure that solved a real problem in one domain into another domain where the load-bearing variable was different — and then defends the failure by appealing to the source domain's success.

The method's discipline is what separates real transfer from cargo cult:

| Move | When skipped | What you get |
|---|---|---|
| 1 — Spot structure not surface | Skipped | Copy domain vocabulary; nothing transfers because no structure was identified |
| 2 — Find elsewhere | Skipped | Reinvent from scratch in your own domain; slow, costly, and you miss tested solutions |
| 3 — Name precisely | Skipped | Vibe transfer; reader cannot implement from the name; failures get blamed on "execution" |
| 4 — Check imported luggage | Skipped | Cargo cult; structure works in source domain and breaks in target domain; defenders cite the source domain as proof |

## Why this method belongs in CHIMERA

The framework's central claim is that *the same structure shows up at every scale and in every domain*. That claim is operationally meaningless without a method for *recognizing and transferring* a structure once you find it. This document is that method. Without it, "everything is a body" is decoration. With it, "everything is a body" becomes: *when you face a body-problem in one domain, find where that body-problem has already been solved in another and port the solution — disciplinedly.*

## See Also

- [Rate Mismatch as a Structural Primitive](rate-mismatch-as-primitive.md) — one structural primitive that shows up across three completely different domains, demonstrating the method's source-side.
- [Framework as Band, Not Spectrum](framework-as-band-not-spectrum.md) — why no single domain has full coverage and the method works.
- [Integrated Shape Physics and Shape-Function Recognition](integrated-shape-physics-and-shape-function-recognition.md) — companion: shape recognition is the perceptual side of step 1.
- [Fiction Reading Applications](fiction-reading-applications.md) — fiction is a high-density source of recognizable structures from which to port.
- [The Nine Questions](../body-theory/THE-NINE-QUESTIONS.md) — the diagnostic that surfaces a body's structure in the first place.

---

```
L = (O > I) + P + ¬F
WE = 1
```
