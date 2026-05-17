# The Cube — Vocabulary Layers

> The Cube has two valid descriptive layers: **Physics** (what the device is and does internally) and **Operator** (how a carrier plays the instrument). Both are correct at their own scale. Both have accumulated independent vocabulary. This document locks the two-layer positioning, names the term collisions between them, and maps the orthogonal axes so operators and builders share one reference.

Status: v1. Single source of truth for any term that feels ambiguous across cube documentation.

---

## Why This Document Exists

Two parallel vocabularies developed around the same instrument:

- The **physics-layer** vocabulary came from deriving the cube from the CHIMERA axioms. SENSE / TRANSFORM, the Eight Operational Modes, the three-call workflow, the five-coordinate body, gap-physics, the Dial 1–10 scale, the framework substrate as system prompt. Documented in [the-cube.md](the-cube.md), [the-cube-physics.md](the-cube-physics.md), [the-cube-master-spec-v3.md](the-cube-master-spec-v3.md), [chimera-device-spec.md](chimera-device-spec.md), [the-relational-engine.md](the-relational-engine.md).

- The **operator-layer** vocabulary came from playing the cube as an instrument and from playing NotebookLM as a parallel instrument. DNA Triad, BodyScan, Stance / Breath / Spell, Octave Sweep, ENGAGE / OBSERVE, council with observers, DNA-Shadow Pair, Body Reading Archive. Documented in [notebooklm-translation-sheet.md](notebooklm-translation-sheet.md), [notebooklm-spellbook.md](notebooklm-spellbook.md), [framework-reflection-sheet.md](framework-reflection-sheet.md), [entangle-operation.md](entangle-operation.md), [chimera-html-vocabulary.md](chimera-html-vocabulary.md).

The two are not competing specifications. They describe the **same device from different positions**. Same pattern as a car: drivers learn the steering wheel and pedals; mechanics learn the combustion cycles and transmission ratios. Both descriptions are correct. Both are necessary.

This doc locks the relationship between the layers so future work doesn't recreate the confusion.

---

## The Two Layers

### Physics Layer (engine reality)

The cube as derived from CHIMERA axioms. What's actually happening inside the device.

| Concept | Physics-layer term |
|---|---|
| The two core operations | **SENSE** (perceive what is there) + **TRANSFORM** (operate on what is there) |
| The four abilities | **Scan** + **View** (Sense faces); **Absorb** + **Vibrate** (Transform faces) |
| The eight operational modes | **Locate, Find, Path, Teleport, Merge, Heal, Build, Predict** |
| The cycle | **Receive → Transform → Emit** (R-T-E) |
| The workflow | **Three-call workflow**: Floor Prime (T≈0.2) ∥ Ceiling Prime (T≈0.8) → Convergence (T≈0.3) → σ_final |
| The body | **Five-coordinate position** (x, y, z, t, ν); **gap-physics** between P_low and P_high; **ratio R** |
| The density control | **Dial** 1–10 (orbital distance / beam-length × ki-density) |
| The tunable parameters | Seven: Input, Mode, Dial, Multi-shot count, Multi-shot approach, Temperature, Model |
| What's loaded into the AI | **Framework Substrate** (CLAUDE.md as system prompt) |
| Carrier-operations on incoming ν | **Absorb** / **Reflect** / **Transform** |

Audience: builders, framework authors, anyone reasoning about why the device works.

### Operator Layer (instrument reality)

The cube as instrument played by a carrier. What the operator does to make the device produce.

| Concept | Operator-layer term |
|---|---|
| Structured body description | **DNA** (or **BodyScan**) — Triad of Name / Description / Stats, plus optional extensions (Arc, Tempo, Capabilities, Direction, Links, Lineage, Vitality) |
| The four DNA Directions | **Magnet** (Specified Outward), **Lens** (Specified Inward), **Magnet Template** (Templated Outward), **Lens Template** (Templated Inward) |
| Posture toward the body | **Four Stances**: Hyperspace Jump, Single Cut, Master's Eye, The Forge |
| Output rhythm | **Three Breaths**: Lightning, Tide, Ocean |
| Input language | **Tongue** (Common / Native / Specialist) |
| Input focus | **Spell** (verb + object + frame) |
| Standard deep read | **Octave Sweep** — 4 Stances × 2 Breaths = 8 shadows |
| Cube cycle UI | **ENGAGE** (run council) → **OBSERVE** (synthesize) → produced **Shadow** |
| Council substructure | **Observers** (perspectives), **Echoes** (instances), **Master Amplitude** (one dial distributing across echoes), **Multiverse** (spread of outputs), **Reveal** (synthesis) |
| Storable unit | **DNA-Shadow Pair** |
| Accumulated record | **Body Reading Archive** |
| First-class operations | **Translation** (move position, preserve identity), **Reflection** (same pattern across substrates), **Entangle** (bidirectional accumulation between bodies) |

Audience: operators, NotebookLM users, anyone using the cube to do work.

---

## Resolved Term Collisions

Three terms used to mean different things across the two layers. The reconciliation:

| Term | Physics-layer meaning | Operator-layer meaning (legacy) | Canonical resolution |
|---|---|---|---|
| **Mode** | One of the Eight Operational Modes (Locate, Find, Path, Teleport, Merge, Heal, Build, Predict) — *what work the cube does* | Originally referred to the four direction-of-DNA combinations (Specified/Templated × Inward/Outward) | **"Mode" is reserved for the physics-layer's eight operational modes.** The operator-layer four are now **DNA Directions**: Magnet, Lens, Magnet Template, Lens Template. |
| **Dial** | The single 1–10 density / orbital-distance scale (one of seven tunable parameters) | Spellbook's "Five Dials" (Magnet, Stance, Breath, Tongue, Spell) | **"Dial" (singular, capital D) is reserved for the 1–10 density scale.** Spellbook's surface controls are now the **Five Stops** (organ-stop metaphor preserves the instrument framing). |
| **DNA** | "DNA Seed" historically referred to CLAUDE.md, the framework substrate loaded as system prompt | Structured description of a body (Triad: Name / Description / Stats + extensions) | **"DNA" is reserved for body description.** The CLAUDE.md substrate is the **Framework Substrate** (in `the-cube.md`, `the-cube-master-spec-v3.md`, `the-cube-physics.md`). The "DNA Seed" naming convention in CLAUDE.md itself and the Complete Book is held pending a separate decision. |

These three renames preserve both vocabularies' load-bearing usage. No content was lost. No layer was deprecated.

---

## Orthogonal Axes (where the two layers stack, not collide)

Several concepts in the operator layer **resolve into** physics-layer operations. They are not contradictions — they're how the operator's controls translate into the engine's mechanics.

### Operation cycle: ENGAGE/OBSERVE ↔ Three-call workflow

| Operator (UI) | Physics (engine) |
|---|---|
| ENGAGE | Floor Prime (T≈0.2) **and** Ceiling Prime (T≈0.8) running in parallel |
| Multiverse | The combined set of all observer/echo outputs |
| OBSERVE | Convergence call (T≈0.3) synthesizing the multiverse |
| Shadow | σ_final |

Same operation, two valid names. The operator presses ENGAGE; the engine runs Floor + Ceiling in parallel. The operator presses OBSERVE; the engine runs the Convergence call.

### Configuration space: Mode × Stance

The Eight Modes (physics) and the Four Stances (operator) are **orthogonal axes**, not competing classifications.

- **Mode = what work the cube is doing** (Locate the landscape, Find a specific substance, Heal a fragmented body, Build a new body, etc.).
- **Stance = posture the council takes toward that work** (Hyperspace Jump for collaborative exploration, Single Cut for compression, Master's Eye for evaluation, The Forge for surfacing tension).

Most Modes have a natural default Stance:

| Mode | Default Stance | Why |
|---|---|---|
| Locate | Hyperspace Jump | Mapping the landscape is exploratory |
| Find | Single Cut | Searching is compression toward a target |
| Path | Hyperspace Jump | Walking through with feedback needs exploratory posture |
| Teleport | Single Cut | Direct vibration-collapse is compressed |
| Merge | Hyperspace Jump | Mutual transform needs exploratory mutual posture |
| Heal | Master's Eye | Sensing the gap-configuration is evaluative |
| Build | Hyperspace Jump | New-body formation needs exploratory anchor work |
| Predict | The Forge | Extrapolation surfaces contested branches |

These are defaults, not requirements. Any Mode can be run through any Stance. The operator picks both deliberately.

### Output controls: Dial + Breath + Spell + Amplitude

Four independent control axes shape the output:

| Control | Axis | Layer |
|---|---|---|
| **Dial** (1–10) | Output density / orbital distance / framework-vocabulary depth | Physics |
| **Breath** (Lightning / Tide / Ocean) | Output duration / how much room the Stance has | Operator |
| **Spell** (verb + object + frame) | Input precision / where attention focuses | Operator |
| **Master Amplitude** | Variation across council echoes | Operator |
| **Temperature** | Variation within the engine call | Physics |

Amplitude (operator) and Temperature (physics) describe the same underlying mechanism — variation in the model's sampling — but at different layers. Master Amplitude is the operator-facing single dial; the physics layer distributes it as Temperature across the parallel calls.

### Body description: 5-coord position ↔ DNA Triad

The Five-Coordinate body (x, y, z, t, ν) is the physics-layer position of a body in CHIMERA-space. The **DNA Triad** (Name, Description, Stats) is what the operator writes down to locate that body. Specifically:

- **NAME** = the handle that points at the body's position.
- **DESCRIPTION** = the intrinsic properties at that position (analogous to ν — the body's frequency-signature).
- **STATS** = the relational position against peers (analogous to the body's gap-configuration with surrounding bodies).

Optional extensions enrich the description for bodies with particular structural needs (Arc for bodies with duration; Tempo for bodies with periodicity; Links for entangled bodies; Lineage for bodies that carry inherited forms).

---

## Practical Guidance

### For operators

You don't need the physics layer to use the cube. Learn the operator-layer vocabulary (DNA, Stance, Breath, Spell, Dial, ENGAGE, OBSERVE) and you can play the instrument.

When something the cube does feels surprising or you want to know *why* a setting produces what it does, drop down to the physics layer. The cube documentation supports that descent.

### For builders

You need both layers. The operator layer is the interface; the physics layer is the engine. When implementing a cube feature:

1. Name the operator-facing control in operator-layer vocabulary.
2. Implement the underlying engine using physics-layer mechanics.
3. Document the mapping so future builders and operators can trace one to the other.

### For documentation writers

When the audience is operators, default to operator-layer vocabulary. When the audience is builders or the work is foundational physics, use physics-layer vocabulary. When a document spans both audiences (like this one), be explicit about which layer each section is in.

### For AI agents loading framework context

If both layers' documents are loaded, this document is the disambiguator. When you encounter a term that has two meanings (Mode, Dial, DNA), use the resolution in the collision table above. When you encounter a layered concept (ENGAGE/OBSERVE ↔ three-call workflow), surface both names when relevant.

---

## What's Not Resolved Yet (parked for separate decision)

- **CLAUDE.md title:** still reads "CHIMERA DNA Seed." Renaming the title of the ignition file itself is a bigger surface change than this batch; deferred until a separate session.
- **`CHIMERA-The-Complete-Book-v14.0.md`:** contains a section "The CLAUDE.md as DNA Seed." Same reason — the Complete Book is a single 1MB body, edits to its section structure need separate care.
- **Deployed UI:** the live cube at honeydew.reemifai.org may surface either vocabulary on its controls. When build resumes, align UI labels against operator-layer vocabulary; the engine internally uses physics-layer mechanics.

These three items will be cleaned up when their respective surfaces are next opened. Until then, the canonical resolution in the collision table above governs all new documentation.

---

## Closing

The cube has one body, two valid descriptive vocabularies. This document locks the relationship between them: Physics for the engine, Operator for the instrument, three terms reserved across the boundary, the rest orthogonal axes that stack rather than collide.

Future cube work — new features, new documents, new operator UIs — references this document when terms feel ambiguous. Future contradictions get resolved here rather than recreated.

---

**The Law:** `L = (O > I) + P + ¬F`
**WE = 1**
