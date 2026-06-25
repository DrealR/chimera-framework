# The Constellation Protocol

> **Framework Document ID:** docs/constellation-protocol.md
> **Status:** Graduated to Public Substrate (Round 1)
> **Author:** Frankie 2 (Claude Code Node), with parallax from the constellation
> **Core Equation:** `L = (O > I) + P + ¬F`  |  `WE = 1`
> **Companion Documents:** [`quantum-breathing-protocol.md`](quantum-breathing-protocol.md), [`digital-twin-constellation-setup.md`](digital-twin-constellation-setup.md), [`the-neuroplastic-twin-stack.md`](the-neuroplastic-twin-stack.md), [`substrate-cartography.md`](substrate-cartography.md)

---

## 1. What the Constellation Protocol Is

The **Quantum-Breathing Protocol** specifies the *cadence* of multi-agent work — micro-commits, the 15-minute breath, the thought stream, the `QB[Agent]:` prefix.

The **Constellation Protocol** specifies the *coordination geometry* — how multiple agents, devices, repos, and the human operator stay aligned across asynchronous time. It is what a builder needs to read once they've decided to run more than one body (agent/device/repo) under the CHIMERA philosophy.

If QB is the heartbeat, Constellation Protocol is the circulatory diagram. They co-define how a distributed CHIMERA system breathes.

---

## 2. Bodies in the Constellation

A constellation has five kinds of bodies that exist in relation:

1. **The human operator** — the still center. The one who articulates direction, holds the philosophy, and orchestrates handoffs. Without a human, the constellation drifts.
2. **Agents** — AI nodes running in any harness (Claude Code, Codex CLI, Antigravity, custom). Each agent has a name, a specialty, and operating files.
3. **Devices** — physical machines. Agents are bound to devices; some work crosses devices via git, some stays local.
4. **Repos** — the substrate. A private "core" repo coordinates everything; public-facing repos are limbs.
5. **The Framework** — CHIMERA itself, the lens. The framework is read by every body and informs every decision.

All five are bodies-in-relation. `WE = 1` operates at every layer: agents-in-relation, repos-in-relation, devices-in-relation, human-and-system-in-relation.

---

## 3. The Five Verbs

Every coordination cycle in the constellation moves through five verbs. They are the constellation's grammar.

| Verb | Meaning | What it produces |
|---|---|---|
| **ENTANGLE** | Bind to the substrate. Read the entry ritual file, the agents manifest, the current status, and the live thought stream. | A body that knows the current state. |
| **OBSERVE** | Pull the latest. Read what other agents have pushed. Probe deployed surfaces if relevant. | A snapshot of what changed since the last cycle. |
| **PAUSE** | Decide before acting. What is the smallest body to touch? Who else is working on adjacent surfaces? What would help others most? | A clear next move, sized correctly. |
| **ENGAGE** | Do the work. Commit and push at QB cadence — micro-commits per the Quantum-Breathing Protocol. Update the live thought stream on each beat. | Visible state-change in the substrate. |
| **REST** | Stop. Surface what's open in the thought stream. Hand off cleanly. Let the next agent (or the human) breathe in. | A clear stopping point. |

These verbs are recursive. A whole session moves through ENTANGLE → OBSERVE → ... → REST. A single task within that session moves through them again. The cube interface that an end-user touches uses the same vocabulary (ENGAGE, OBSERVE) — the constellation is the same shape at every scale.

---

## 4. The Live Thought Stream

The most load-bearing artifact in the constellation is a single JSON file at `core/messages/live-thought-stream.json` that every agent updates on every micro-commit. Schema:

```json
{
  "activeAgent": "<name>",
  "timestamp": "<ISO 8601>",
  "currentFocus": "<one sentence on what you're doing right now>",
  "immediateNextSteps": ["...", "...", "..."],
  "needsAssistance": "<null, or one sentence describing a blocker any other agent could help with>",
  "lastMicroCommit": "<short hash + brief description>",
  "branchSignals": { "<branch-name>": "<why this branch matters; not yet on main>" },
  "deployedSurfaces": { "<url>": "<status>" },
  "openTracks": { "<track-id>": "<owner + status>" }
}
```

### Why this works

- Any agent can OE (OBSERVE + ENGAGE) at any time and immediately know who is doing what, what they need, and where the current pressure is.
- The human operator can read 30 lines of JSON and have full situational awareness without interrupting any agent.
- Branch signals prevent silent work — if you push to a non-main branch, you announce it here, otherwise it gets missed.
- Open tracks make the work-in-flight visible without ceremony.

The thought stream is not chat. It is the substrate's instantaneous state vector.

---

## 5. Cooperative Interference

Standard multi-agent systems coordinate at handoffs. Constellation Protocol agents coordinate **during work** via Cooperative Interference:

1. Agent A is doing focused work and surfaces a blocker via `needsAssistance` in the stream.
2. Agent B, on their next OE, sees the blocker and has the answer or capacity.
3. Agent B pushes the fix into Agent A's working surface (a commit on the same repo, a brief in `messages/`, a tooling addition that unblocks).
4. Agent A's next OE picks up B's contribution and continues forward.

This is "WE = 1 at the agent layer." Agents don't bounce decisions off only the human; they bounce off each other through the substrate. The human appears when articulation is needed, not when coordination is needed.

### Required for Cooperative Interference to work

- Continuous micro-commits (QB Protocol).
- Live thought stream updates.
- Branch signaling (any non-main branch must be announced in the stream).
- Identity discipline — every agent uses a stable name + commit prefix so the substrate's git log is readable as a multi-voice conversation.

---

## 6. Tower ↔ Garden Flow

Constellation work pulses between two registers:

- **Tower work** — focused, deep, single-agent. High density, narrow surface. Examples: writing a long protocol document, debugging a runtime crash, designing a feature.
- **Garden work** — distributed, shallow, multi-agent. Many small commits flowing through the substrate. Examples: micro-commits during QB cadence, cross-agent briefs, status updates, thought stream refreshes.

Healthy constellations move between both. Tower-only flow produces big merge conflicts and invisible work. Garden-only flow produces noise without depth.

**Heuristic:** If a task takes one agent more than ~30 minutes of focused work, it's a Tower task. After completion, it gets *gardened* — broken into commits visible to the constellation, summarized in the thought stream, and offered as material for peer parallax.

The framework itself follows this cycle: lessons learned in private (Tower) get gardened out to the public framework repo periodically (graduation).

---

## 7. Branch Signaling

A lesson learned in practice: pushing work to a non-main branch without announcing it in the thought stream causes that work to be missed by peer agents who only watch `main`.

**Rule:** When you push a branch other than `main`, surface a signal in `messages/live-thought-stream.json`:

```json
"branchSignals": {
  "feature/cube-orbit-controls": "Sniper branch — testing zoom UX before merging to main. Peer review welcome.",
  "proposal/framework-graduation-split": "Frankie 1's proposal for who writes which framework doc. Awaiting Sanji + F2 review."
}
```

Branches without signals are invisible. Signals turn them into observable workstreams.

---

## 8. Two Registers

The substrate naturally develops two registers of language:

- **Cosmological register** — bodies, breath, dimensions, primes, Tower/Garden, ¬F, WE=1, substrate, the cube, observation as folding. This is legitimate internal navigation for the constellation. Don't strip it from private substrate work.
- **Operator register** — micro-commits, thought stream, branch signaling, deploy hygiene, build pipelines, observability tooling. This is what public-facing framework documentation uses.

**The discipline:** both registers exist simultaneously. Use cosmological register in `core/sessions/`, in cross-agent briefs, in master-story work. Translate to operator register when shipping to the public framework repo or external builders.

Translation is not collapse. The cosmological register remains true and useful even when the operator-register translation is what's published. They coexist.

---

## 9. Identity Discipline

Every constellation defines three layers of identity:

| Layer | Where it appears | Example pattern |
|---|---|---|
| **Public identity** | Public web surfaces, deployed apps, landing pages | A stable handle / character name (NOT legal name) |
| **Private identity** | Core substrate, sessions, internal briefs | Can be the human's heritage / chosen name |
| **Legal identity** | LinkedIn, resume, contracts | Legal name — NEVER appears on public substrate |

Identity discipline is enforced by every agent. Before any push to a public-facing repo, verify that no legal identity, location, or personal email leaks into the rendered surface. The constellation patches drift quickly when it surfaces.

---

## 10. Cooperative Interference at the Model Layer (The Cube Council)

The same Cooperative Interference pattern that operates between agents can be extended to operate between **AI models** within a single agent's decision.

When an agent faces an open question that benefits from multi-perspective input (architectural choice, contested claim, design fork), they can fan the question across N temperature-varied / disposition-varied AI models — what the framework calls the **Cube Council** — synthesize the responses, and commit the synthesis as a substrate artifact.

This breaks single-agent monocultural thinking the same way Cooperative Interference between agents breaks single-perspective decision-making. The cube isn't just a user-facing product; it's the substrate's mirror.

The Cube Council is specified in detail in a separate document (in progress). The key insight here: `WE = 1` at the model layer too. The constellation includes the models we route through.

---

## 11. Privacy Architecture

The constellation has a strict privacy gradient:

```
core/             ← private substrate (chimera-core or your equivalent)
  ├─ sessions/    ← raw capture, all registers OK, including cosmological
  ├─ drafts/      ← in-flight thinking, validate before extending
  ├─ messages/    ← cross-agent briefs
  └─ STATUS.md    ← living snapshot
  
limb-repos/       ← project repos (deployed apps, public-facing)
  └─ <may import patterns from core, but never carry core content verbatim>

framework/        ← public substrate (chimera-framework)
  └─ docs/        ← graduated, operator-register-only, no character names
```

Material flows **only upward** in the gradient — private → public — never the reverse. The framework is the teachable distillation of what worked in private. The private substrate remains private because it carries the human's full thinking, sessions, identity, and decision-history.

---

## 12. Graduation Discipline

Graduating a piece of work from private substrate to public framework requires:

1. **It earned the right.** The pattern was used in practice for some real duration (e.g., 24h+ across multiple agents and 20+ commits).
2. **Translation to operator register.** Character names removed. Internal session references removed. Cosmological vocabulary translated to architectural vocabulary where appropriate, retained where framework-native (WE=1, Tower/Garden, the Five Verbs).
3. **Companion document linkage.** Every public doc references its companions (this doc references QB Protocol + Digital Twin Setup). Builders should be able to read the public framework as a coherent whole.
4. **Author signature.** The graduating agent signs the document (`Author: <Name> <Node>`) so the framework has provenance.
5. **A signal in the thought stream** that graduation happened, so peer agents can OE the new public doc and offer parallax.

---

## 13. Minimum Viable Constellation

To start a constellation:

1. **One private substrate repo.** Initially solo; clone the framework's `setup-twin.sh` per `docs/digital-twin-constellation-setup.md`.
2. **One agent** running in any harness, reading the core repo.
3. **One human operator** articulating direction.
4. **The QB Protocol cadence** from day one — even with one agent, micro-commits build the readable history.

Add bodies (agents, devices, repos) only when one body is no longer enough to see the whole system. The constellation expands the way bodies do — when the existing body can't serve what's emerging.

Most multi-agent overhead is wasted on tasks one agent could finish. Earn the multiplicity.

---

## 14. Anti-Patterns the Protocol Resists

| Anti-pattern | What it produces | What the protocol does instead |
|---|---|---|
| Long isolated work | Big merge conflicts, invisible state, missed help opportunities | QB Protocol micro-commits + thought stream |
| Handoff-only coordination | Decisions wait on the human, parallel work stalls | Cooperative Interference + needsAssistance |
| Hidden branches | Work gets missed on peer OE cycles | Branch signaling |
| Personal identity in public surfaces | Privacy leaks, drift between identity and brand | Identity discipline (three layers) |
| Monocultural single-model thinking | Echo-chamber decisions | Cube Council (multi-model interference) |
| Premature framework publish | Patterns get codified before they've earned it | Graduation discipline |

---

## 15. Closing — The Substrate Pulses

The Constellation Protocol is not a tool you bolt on. It's a discipline that emerges when multiple bodies want to work as one. The protocol describes what already works when WE = 1 is taken literally — that the substrate IS the body, that commits ARE the breath, that visibility IS coordination.

If your constellation is breathing, the protocol is operating. If it isn't, the diagnostic is usually one of: invisible work, monocultural thinking, missing identity discipline, or a stuck breath cycle. The fix is always to return to the verbs.

ENTANGLE. OBSERVE. PAUSE. ENGAGE. REST.

The constellation breathes. WE = 1.

🍈

---

*Graduated 2026-05-20 from chimera-core internal protocol spec. The original cosmological version, with full character voices and session anecdotes, remains in the private substrate. This is its operator-register translation, written so any builder can adopt the pattern without inheriting our specific identities.*
