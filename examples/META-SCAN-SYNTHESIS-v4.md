# META-SCAN-SYNTHESIS v4: Fourth Audit of the CHIMERA Scan Corpus

**Protocol:** v3.12.1
**Corpus Date:** April 2026
**Scans Audited:** 79 (78 standard + 1 adversarial) — includes first 3 multi-body relational scans
**YAML Data Files:** 78/79 (99%)
**Domains:** 9 + adversarial (multi-body added as 9th domain)
**Purpose:** Audit Phase 4 deliverables — multi-body relational protocol, 5 new physics integrations, 3 canonical multi-body scans, and supporting infrastructure (YAML schema, Quick Scan tool). Special focus on whether multi-body scanning produces genuine emergent insight or just restates component properties.

---

## Section 1: v3 → v4 Comparison

| Metric | v3 Audit | v4 Audit | Change |
|--------|----------|----------|--------|
| Total scans | 71 | 79 | +8 |
| Domains | 8 + adversarial | 9 + adversarial | +1 (multi-body) |
| Physics scans | 8 | 13 | +63% |
| Multi-body scans | 0 | 3 | New domain |
| YAML coverage | 70/71 (99%) | 78/79 (99%) | Maintained |
| Pathological bodies | 12 | 12 | Unchanged (but 1 new pathological composite) |
| Protocol version | v3.12 | v3.12.1 | Multi-body addendum |
| "Bridge body" in new scans | 0/6 | 0/8 | Forward-clean maintained |
| "Bridge body" legacy | 33/71 (46%) | 33/79 (42%) | Diluted further, not cleaned |
| Structural weakness coverage | 71/71 (100%) | 79/79 (100%) | Maintained |
| Body theory docs | 11 | 13 | +2 (Multi-Body Protocol, Quick Scan) |
| Scanner diversity | AI only (Opus) | AI only (Opus + Grok) | Second scanner introduced |

**Summary: Phase 4 introduced the first new scan type in the corpus's history.** Single-body scanning is no longer the only mode. The multi-body relational protocol adds diagnostic, comparative, and generative scanning modes. Physics grew substantially (8→13). The corpus crossed 75 scans and 9 domains. Two new body-theory documents codify Phase 4 methodology (multi-body protocol) and compress the scan protocol for engineering use (Quick Scan).

---

## Section 2: The Multi-Body Scans — Core Audit

This is the primary focus of v4. Three questions: (1) Do the multi-body scans produce genuine emergent insight? (2) Does the protocol work? (3) What broke?

### 2.1 Do the Multi-Body Scans Produce Genuine Emergent Insight?

**Yes. All three composites surface findings that no component scan contains.**

| Scan | Mode | Emergent Gap | Component Gaps | Emergent = Restated? |
|------|------|-------------|----------------|---------------------|
| Pawn-King Axis | Diagnostic (pair) | **Perceive** — mutual blindness to each other's constraints | Pawn: Release, King: Create | **No.** Neither component has a Perceive gap. The gap is relational — it emerges from the interaction, not the parts. |
| Velocity Trap | Diagnostic (triad) | **Perceive** — system-level visibility impossible | Git: Release, Microservice: Release, Tech Debt: Perceive | **Partially.** Tech Debt already has a Perceive gap. But the composite's Perceive gap is architecturally different: it's not that debt can't perceive itself, it's that the *system architecture* prevents *any component* from perceiving the whole. This is a genuine escalation. |
| Pathological Triad | Comparative (cross-domain) | **Govern** — governance failure as universal root of pathology | Cancer: Govern, Memory Leak: Release, Zugzwang: Release | **No.** The composite reveals that Release failure IS governance failure at a deeper level — the two Release gaps are reframed as governance failures wearing different costumes. This is a genuine structural insight. |

**Quality assessment:**

The Pawn-King Axis is the strongest. Its emergent finding — "functional federation does not require mutual perception" — is genuinely surprising and challenges the framework's implicit assumption that healthy relationships require empathy. The composite skeleton ("protection and purpose are structurally inseparable") could not have been derived from either component's scan.

The Velocity Trap is the most practically useful. Its diagnostic of modern software teams is structurally precise: "distributed autonomy without distributed perception produces invisible debt at scale." The three named powers (Velocity Illusion, Distributed Blindfold, Incident Immune Response) are structurally specific and immediately recognizable to any engineer who's lived it.

The Pathological Triad is the most ambitious and the most self-critical. Its structural weakness section explicitly names selection bias ("all three components are I>O dominion bodies — the findings may be circular") and potential tautology ("failure to exhale may just restate I>O"). This honest self-assessment is the strongest quality indicator in the Phase 4 deliverables. The scan acknowledges its own limits before the auditor has to.

**The deepest multi-body finding: the Pause as universal cure.** Across three domains, the cure for pathology is structurally identical: apoptosis (cellular Pause), garbage collection (memory Pause), pass-option (chess Pause). This is not metaphor — these are literally the same structural operation (interrupt the accumulation cycle, allow the body to exhale) implemented in three different substrates. This finding is only visible from the composite level. No component scan surfaces it because no component scan asks "what do these pathologies share?"

### 2.2 Does the Multi-Body Protocol Work?

**Yes, with one structural concern.**

The protocol (v3.12.1, 84 lines) defines three modes, component selection criteria, required sections, and a quality gate. All three canonical scans follow it. The required sections are all present in each scan. The quality gate ("does the composite skeleton surprise you?") passes for all three.

**What works well:**
- The three modes (diagnostic, comparative, generative) create genuinely different reading postures. Diagnostic reads what exists. Comparative reads what's shared. These are different operations that produce different insights.
- The emergent power gap requirement forces the scanner to find something the components don't have individually. This is the protocol's strongest constraint — it prevents multi-body scans from being comparison tables.
- The structural signature bracket notation (`[irreversible commitment + fragile importance]`) compresses the composite's identity into a portable formula.

**Structural concern: Perceive-gap convergence.**

Two of three multi-body scans produced Perceive as the emergent gap. Is this a real pattern (composites tend to be blind to their own total state) or scanner bias (the protocol nudges toward perception findings because multi-body scanning IS an exercise in perceiving across boundaries)?

The honest answer: probably both. It's structurally plausible that composites have Perceive gaps because the act of combining bodies creates boundaries that block visibility. But the scanner was primed to look for what's invisible across boundaries — which naturally surfaces Perceive. A larger sample (10+ multi-body scans) would clarify whether Perceive dominance is structural or artifactual.

### 2.3 What Broke?

**Nothing broke. But two weaknesses are visible:**

1. **No generative-mode scan exists yet.** The protocol defines three modes. Only two have been tested (diagnostic and comparative). The generative mode — "birth a composite that doesn't exist and read its emergent properties" — remains theoretical. Grok's thought experiments used generative mode extensively ("The Cure," "Cosmic Play Engine"), but no canonical scan uses it. Phase 4 shipped with 2/3 modes validated.

2. **The multi-body YAML schema is untested.** The schema exists (`multi-body-schema.yaml`) and the three YAML data files exist, but no validation script or cross-corpus analysis has been run against them. The single-body YAML has been validated by `validate-yaml.sh`. The multi-body YAML has not. This is infrastructure without verification.

---

## Section 3: Physics Expansion Audit (8 → 13 Scans)

Five new physics scans integrated from Grok Category A material. All five scanned by Grok (xAI, independent DNA seed) — the first canonical scans from a non-Opus scanner.

| Scan | Tier | Skeleton Quality | Power Gap Quality | Structural Weakness Quality | v3.12 Compliance |
|------|------|-----------------|-------------------|---------------------------|------------------|
| Quantum Entanglement | **Strong** | Body-specific ("Two bodies that share one fate...measuring one writes the result of the other"). Cannot apply to any other body. | Strong — 3 gaps, all specific and defensible (Release into locality, Govern over interpretation, Perceive the mechanism) | Excellent — 4 weaknesses including epistemological ones (interpretation membrane) | Clean. No bridge body. |
| Fire | **Strong** | Body-specific ("eats order and Releases light...the original O>I transformer"). | Strong — 2 gaps, precise (self-limitation, directionality) | Excellent — includes pathological twin (uncontained fire = cancer's logic) | Clean. |
| Water | **Moderate-Strong** | Body-specific but borders on poetic ("never loses its own identity...the ultimate relational medium"). | Adequate — 2 gaps (containment, selectivity) | Strong — inversion condition (pollution saturation) is concrete | **Flag:** "pure federation" and "total non-force" are weak-language defaults per v3.12 pre-ship check. |
| Earth (Element) | **Strong** | Body-specific ("holds everything in place, remembers deep time, slowly gifts nutrients"). | Strong — 2 gaps specific to geological timescale (speed/adaptability, self-repair rate) | Excellent — inversion condition (extraction rate > regeneration rate) with concrete examples | Clean. |
| Air | **Moderate-Strong** | Body-specific but risks generality ("the great connector whose power is proportional to its invisibility"). | Adequate — 2 gaps (containment/memory, selectivity) shared with Water | Strong — Venus as end-state inversion is devastating | **Flag:** "maximum federation" and "most democratic body in physics" are weak-language defaults. |

**Assessment: 3 Strong, 2 Moderate-Strong.** The elemental scans (Fire, Water, Earth, Air) share a structural template: elemental-O>I-federation-with-inversion-condition. This is either a genuine shared property of elemental bodies (plausible — elements are naturally O>I and federative) or template entrainment from being scanned in the same session. Water and Air share the "selectivity" gap and "pure/maximum federation" language — the two weakest scans in the batch.

**Scanner diversity milestone:** These are the first canonical scans from a non-Opus scanner. Grok produced all five independently, compiled with CHIMERA DNA but operating on a different model architecture. The v3 audit's biggest concern was scanner monoculture. With Grok's 5 scans integrated, the corpus now has 2 scanner sources, though Opus still dominates (74/79 = 94%).

**Physics domain profile after expansion:**

| Power Gap | Count (13) | % | Previous (8) | Change |
|-----------|-----------|---|-------------|--------|
| Govern | 5 | 38% | 4 | +1 |
| Perceive | 4 | 31% | 4 | — |
| Release | 3 | 23% | 1 | +2 |
| Create | 1 | 8% | 0 | +1 |

Physics remains Govern/Perceive-heavy (69% of gaps). The elemental scans added Release gaps (containment, self-limitation) — a genuine diversification of the domain's power gap profile.

---

## Section 4: Updated Corpus-Wide Metrics

### 4.1 Domain Coverage

| Domain | v3 | v4 | Change | Status |
|--------|----|----|--------|--------|
| Software | 17 | 17 | — | Saturating |
| Chess | 16 | 16 | — | Saturating |
| Physics | 8 | 13 | +5 | Healthy growth |
| Math | 11 | 11 | — | Stable |
| Biology | 8 | 8 | — | Stable |
| AI Systems | 5 | 5 | — | Minimum threshold |
| Meta | 4 | 4 | — | Below threshold |
| Social Systems | 1 | 1 | — | **Critical — still n=1** |
| Multi-Body | 0 | 3 | +3 | New domain |

**Domains at or above minimum (5+):** 6/9 (Software, Chess, Physics, Math, Biology, AI Systems)
**Domains below minimum:** 3/9 (Meta: 4, Multi-Body: 3, Social Systems: 1)

### 4.2 DNA Distribution (estimated from new scans + v3 data)

| DNA Reading | v3 Count (70 YAML) | New Scans (8) | v4 Estimated | v4 % |
|-------------|-------------------|---------------|-------------|------|
| O>I | 33 | 5 (QE, Fire, Water, Earth, Air) | 38 | 49% |
| I>O | 10 | 0 (but 1 composite is pure I>O) | 10 | 13% |
| Conditional | 10 | 1 (Velocity Trap composite) | 11 | 14% |
| Mixed-operational | 9 | 1 (Pawn-King composite) | 10 | 13% |
| O=I | 5 | 0 | 5 | 6% |
| Mixed-scale-dependent | 3 | 1 (Pathological Triad technically) | 4 | 5% |

Adding the adversarial scan (A Lie = I>O): 11 I>O bodies total.

**O>I at 49%** — essentially unchanged from v3's 47%. The five new physics scans are all O>I (elemental bodies are naturally generous), which should have pushed O>I up. The three multi-body scans pulled it back: one conditional, one mixed, one pure I>O. **The multi-body domain is the most DNA-diverse domain in the corpus per scan.**

### 4.3 Federation/Dominion Update

| Classification | v3 | v4 Estimated | Change |
|----------------|----|----|--------|
| Federation (all variants) | 43 | 49 | +6 (5 physics + Pawn-King nominal federation) |
| Dominion (all variants) | 13 | 14 | +1 (Pathological Triad = first all-dominion composite) |
| Mixed / Neither | 14 | 16 | +2 (Velocity Trap = stated federation, operational dominion) |

Ratio: 3.5:1 federation-to-dominion (was 3.3:1 in v3). The five elemental scans are all federation, which pushed the ratio back up. The Pathological Triad is the necessary counterweight — the first composite where every component AND the composite itself read as dominion.

---

## Section 5: Multi-Body Scans — Deep Structural Analysis

### 5.1 What the Three Composites Share

| Property | Pawn-King | Velocity Trap | Pathological Triad |
|----------|-----------|---------------|-------------------|
| Mode | Diagnostic | Diagnostic | Comparative |
| Domain configuration | Same-domain (chess) | Same-domain (software) | Cross-domain (bio × sw × chess) |
| Component count | 2 | 3 | 3 |
| Emergent gap | Perceive | Perceive | Govern |
| Composite DNA | Mixed-operational | Conditional, trending I>O | Pure I>O |
| Federation/Dominion | Nominal dominion, functional federation | Stated federation, operational dominion | Pure dominion |
| Composite skeleton unique? | Yes — unpredictable from components | Yes — unpredictable from components | Yes — unpredictable from components |
| Self-critical weakness? | Yes (relationship only works under formal rules) | Yes (pathology feels like productivity) | Yes (selection bias + potential tautology) |

**Structural observation 1: Every composite produces a federation/dominion reading more complex than its components.**

Pawn-King is "nominal dominion, functional federation" — neither component has this complexity alone. The Velocity Trap is "stated federation, operational dominion" — the composite reveals that the architecture's claimed federation is overridden by deadline pressure. The Pathological Triad is "pure dominion" — but this is the first time the corpus has a composite where the classification is *simpler* than the components', because all three components are already dominion. The comparative mode produces structural simplification where diagnostic mode produces structural complexification. This may be a real methodological finding about the two modes.

**Structural observation 2: The composite skeletons are the strongest evidence that multi-body scanning produces genuine emergence.**

- Pawn-King: "protection and purpose are structurally inseparable" — not in either component scan
- Velocity Trap: "distributed autonomy without distributed perception produces invisible debt at scale" — not in any component scan
- Pathological Triad: "pathology is not invasion but the failure to exhale" — not in any component scan

Each skeleton passes the quality gate: surprising, body-specific, and not derivable from the component skeletons by combination. This is the strongest evidence in the corpus that the "+" in the Body Creation Equation is entanglement, not addition.

**Structural observation 3: The Pause appears in every composite as the structural cure or missing element.**

- Pawn-King: The opposition (pure Pause) is the winning technique
- Velocity Trap: Git's Pause is the exact point where debt enters or is prevented; the composite lacks a system-level Pause
- Pathological Triad: The Pause is literally the cure in every domain (apoptosis, GC, pass-option)

The Pause is the most consistent finding across all three multi-body scans. It appears with more structural specificity in the composites than in most single-body scans. **The Pause is emerging as the framework's most universal structural concept — more universal than O>I, more universal than federation, more universal than any single power.**

### 5.2 What Distinguishes Multi-Body Scans from Single-Body Scans

| Property | Single-Body | Multi-Body |
|----------|-------------|------------|
| Skeleton | Describes what the body IS | Describes what the relationship PRODUCES |
| Power gap | What the body lacks | What the relationship creates as a new weakness |
| DNA | Intrinsic direction of flow | Emergent direction (can differ from all components) |
| Structural weakness | Body's edge cases | Relationship's edge cases + honesty about methodology |
| Fruit | Insight about the body | Insight about the interaction pattern itself |
| Named powers | Body's capabilities | Composite's emergent capabilities (none inherited from components) |

The most important distinction: single-body scans read what IS. Multi-body scans read what BECOMES. The verb changes from "be" to "become." This is the Body Creation Equation in practice — the composite is a new body with its own identity, not a summary of its parts.

---

## Section 6: Infrastructure Audit

### 6.1 Multi-Body Relational Protocol (v3.12.1)

84 lines. Three modes. Clear component selection criteria. Required sections match the canonical scans. Quality gate is effective. The "NOT" section (not a comparison table, not a summary, not a metaphor hunt) prevents the most common degeneration pattern.

**Grade: Strong.** The protocol is concise, testable, and one mode is still unvalidated (generative). The protocol itself follows the framework's principles: it constrains without forcing, it provides structure without mandating content.

### 6.2 Quick Scan (4-Question Code Diagnostic)

The Quick Scan compresses the Nine Questions into 4 actionable engineering questions: true purpose, Pause location, pathological Govern, stress response. Includes a pathological pattern table mapping code smells to Quick Scan diagnoses. Scale-agnostic (function → system).

**Grade: Useful.** This is the first body-theory document designed for practitioners rather than scanners. It bridges the framework's diagnostic depth with engineering's need for speed. The relationship to the full protocol is explicit: Quick Scan finds WHERE, full scan finds WHAT.

**Concern:** The Quick Scan was extracted from a Grok teaching session, not derived from the framework's own structural analysis. It's a pedagogical artifact, not a diagnostic tool. Whether it produces reliable readings when applied by engineers who don't know the framework is untested.

### 6.3 YAML Schema Extension

The multi-body schema (`multi-body-schema.yaml`) adds: `scan_type`, `components` array, `relational_topology`, `emergent_gap`, `structural_signature`. The three multi-body YAML files follow the schema. The single-body YAML continues unchanged.

**Grade: Adequate.** Schema exists, YAML files exist, no validation has been run. This is infrastructure waiting for verification.

---

## Section 7: v3 Open Questions — Updated Status

| Question | v3 Status | v4 Status |
|----------|-----------|-----------|
| 8.1 What body would break the framework? | Addressed (A Lie: 7/9) | **Unchanged** |
| 8.2 Can a scan produce a negative result? | Partially addressed | **Unchanged** |
| 8.3 Inter-rater reliability? | 1 test (85.7%) | **Unchanged** — no new inter-rater tests |
| 8.4 Where is the I>O library? | 12 bodies | **13** — Pathological Triad composite is pure I>O |
| 8.5 Should "flowing" be removed as default? | Partially addressed | **Partially** — new scans avoid it; old scans carry it |
| 8.6 Is the Between a body or axiom? | Open | **Addressed by multi-body protocol** — the "interaction body" is now formalized as a scannable entity |
| 8.7 Scan retirement protocol? | Addressed | **Addressed** |
| 8.8 Minimum corpus size for cross-domain claims? | Biology above minimum | **Physics now well above minimum (13). Social systems still n=1.** |
| 8.9 External scanner intake process? | Open | **Partially addressed** — Grok Category A material successfully integrated via v3.12 review |
| 8.10 YAML authoritative or convenience? | Open | **Still open** — 15 divergent power gap assignments still unchecked |
| 8.11 Domain saturation? | Open | **Partially addressed** — Chess (16) and Software (17) show no new pattern emergence. Physics (8→13) produced new patterns (elemental breath cycles, phase-transition Pause). Saturation appears to be around 12-15 scans. |

### New Questions from v4

#### 8.12 Is Perceive the default emergent gap for composites?

2/3 multi-body scans produced Perceive as the emergent gap. Is this structural (composites are inherently blind to their total state) or scanner bias (multi-body scanning primes for perception findings)? Need 7+ more multi-body scans to establish the distribution. If Perceive remains dominant, the finding itself is significant: combining bodies reliably produces perception blindness.

#### 8.13 What would a generative-mode scan look like canonically?

The protocol defines three modes. Only diagnostic and comparative have been tested. Grok's thought experiments ("The Cure," "Cosmic Play Engine") used generative mode but are Category B. A canonical generative scan would test the protocol's most speculative claim: that you can birth a composite that doesn't exist and read its emergent properties.

#### 8.14 Does the multi-body domain need its own cross-scan patterns file?

Three scans is below the cross-scan patterns threshold (typically 5+). But the three existing scans already show a pattern (Pause as universal structural finding). At what count does the multi-body domain deserve its own cross-scan analysis?

#### 8.15 Can the Quick Scan be validated against the full protocol?

Apply both the 4-Question Quick Scan and the full 42-step protocol to the same codebase. Do they converge? If the Quick Scan misses something the full scan catches, what does it miss? If it catches something the full scan misses, what is it? This would validate the compression.

---

## Section 8: Corpus Health Summary

| Health Indicator | v3 | v4 | Trend |
|------------------|----|----|-------|
| Domain coverage | 8 domains | 9 domains | ↑ (multi-body added) |
| Minimum depth per domain | 6/8 ≥ 5 scans | 6/9 ≥ 5 scans | → (ratio decreased by new thin domain) |
| Pathological body ratio | 12/71 (17%) | 12/79 (15%) + 1 composite | → |
| O>I dominance | 47% | 49% | → (stable) |
| Power gap forcing | 99% | 100% for all new scans | ↑ |
| Structural weakness | 100% coverage | 100% coverage | → |
| YAML data layer | 70/71 (99%) | 78/79 (99%) | → |
| Inter-rater reliability | 1 test | 1 test | **→ Stalled** |
| Adversarial testing | 1 test | 1 test | **→ Stalled** |
| Scanner diversity | 1 scanner (Opus) | 2 scanners (Opus + Grok) | ↑ First external scanner |
| Bridge body retirement | 33 legacy instances | 33 legacy (42% of corpus) | → (diluted, not cleaned) |
| Multi-body scanning | Not possible | 3 scans, protocol defined | ↑↑ New capability |
| Body theory docs | 11 | 13 | ↑ |
| Weak-language defaults | Uncounted | 10 files with "pure/maximum federation" | New tracking |

---

## Section 9: Recommendations for Phase 5

1. **Social systems expansion is now critical.** v1 flagged it. v2 flagged it. v3 flagged it. Still n=1. Four historical scans are staged in `thought-experiments/` (Nation-State, Hitler, Mussolini, Charismatic Govern Lineage). Review against v3.12 and integrate. Target: 5-6 social systems scans.

2. **Run 3+ more inter-rater tests.** Still at 1 test from Phase 3.5. The multi-body domain is especially ripe for inter-rater testing — have a different scanner (Grok, Haiku, or human) produce a multi-body scan of the same components and compare composite skeletons, emergent gaps, and structural signatures.

3. **Produce 1 canonical generative-mode scan.** The protocol defines three modes. Two are validated. Ship the third.

4. **Validate multi-body YAML against schema.** Run the three YAML files through validation. Extend `validate-yaml.sh` to handle multi-body schema or create a separate validator.

5. **Test the Quick Scan empirically.** Apply the 4-Question Quick Scan to a real codebase and compare results with a full scan. Document convergences and divergences.

6. **Resolve YAML authority question (8.10).** 15 power gap divergences between YAML and markdown have been open since v3. Spot-check and settle which layer is canonical.

7. **Track Perceive-gap convergence (8.12).** As multi-body scans accumulate, track whether Perceive remains the dominant emergent gap. If it does at n=10, this is a structural finding about composites that should be formalized.

8. **Clean "pure federation" and "maximum federation" from elemental scans.** Water and Air use v3.12-flagged weak-language defaults. These are the most recently integrated scans and the easiest to fix — replace with specific structural descriptions of what federation means for each element.

---

## Verdict

Phase 4 delivered the most structurally novel capability in the corpus's history. The jump from single-body to multi-body scanning is not incremental — it's dimensional. Single-body scanning reads what IS. Multi-body scanning reads what BECOMES. The Body Creation Equation is no longer theoretical — it is operational, with three canonical demonstrations.

The three multi-body scans are strong. Each produces a composite skeleton that could not have been derived from the component scans. Each surfaces a genuinely emergent power gap. Each includes honest self-assessment of its own limits. The Pathological Triad's self-critical structural weakness section — naming its own selection bias and potential tautology — is the most mature piece of framework self-assessment in the corpus.

The deepest finding from Phase 4: **the Pause is the framework's most universal structural concept.** It appears in every multi-body composite as either the cure (Pathological Triad), the winning technique (Pawn-King), or the missing element (Velocity Trap). It appears more consistently across multi-body scans than O>I, federation, or any single power. If the framework had to be compressed to a single insight, it would be the Pause — the gap between stimulus and response where structural health lives.

The biggest remaining weakness is still the one that has persisted since v1: scanner monoculture. Grok's integration (5 canonical scans) is a genuine step — the corpus now has 2 scanner sources. But 74/79 scans are still Opus-produced. The addition of a human scanner, a skeptical scanner, or an uncompiled AI would be the most valuable single change to the corpus's credibility.

The second biggest weakness is social systems. Four audits have flagged it. Four audits have recommended expansion. The staged material exists (Nation-State, historical mobilization engine scans). The expansion should stop being recommended and start being done.

Phase 4 proved that multi-body scanning works. Phase 5 should prove that it scales — more composites, more modes, more scanners, and the social systems expansion the corpus has been deferring for too long.

---

```
L = (O > I) + P + ¬F
WE = 1
```
