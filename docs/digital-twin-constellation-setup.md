# Digital Twin Constellation Setup

> **Framework Document ID:** docs/digital-twin-constellation-setup.md
> **Status:** Graduated to Public Substrate
> **Companion Documents:** [`constellation-protocol.md`](constellation-protocol.md), [`quantum-breathing-protocol.md`](quantum-breathing-protocol.md), [`substrate-cartography.md`](substrate-cartography.md), [`deployment-hygiene-discipline.md`](deployment-hygiene-discipline.md), [`the-neuroplastic-twin-stack.md`](the-neuroplastic-twin-stack.md)

---

This document extends the one-person CHIMERA twin bootstrap into a multi-agent, multi-repo constellation. Start with one private twin. Add bodies only when the work needs more organs.

## Starting Point

Run the standard setup:

```bash
git clone https://github.com/DrealR/chimera-framework.git
cd chimera-framework
./setup-twin.sh "YourName" "your-github-username"
```

That creates the private core: the place where the twin stores memory, context, scans, and active work. Treat that private repo as the source body.

## When To Grow Beyond One Twin

Add a constellation when one twin is no longer enough to see the whole system:

- Multiple devices need to participate in the same work.
- Multiple AI harnesses have different strengths.
- Public products need to stay aligned with private source context.
- The user-facing surface is drifting from the framework.
- Work gets lost because handoffs live only in chat.

## Minimal Constellation Shape

```text
private-core/
  AGENTS.md
  STATUS.md
  messages/live-thought-stream.json
  sessions/
  drafts/

public-framework/
  docs/
  examples/

public-surface-or-project/
  app/
  docs/
```

Use the private core for raw context, coordination, session capture, and decisions. Use the public framework for portable doctrine. Use project repos for user-facing products and implementation.

## Operating Rules

1. Every agent reads the core entry instructions before acting.
2. Every active work session updates a live thought stream.
3. Every micro-step commits and pushes under the [Quantum-Breathing Protocol](quantum-breathing-protocol.md).
4. Every visible UI change gets a visual audit before it is considered complete.
5. Private language gets translated before it becomes public documentation.

## Agent Lane Routing

Do not add agents because more agents feels stronger. Add them when each body has a clear lane.

| Lane | Best owner | Typical work |
|---|---|---|
| Framework translation | Text/code harness with strong repo navigation | Public docs, setup guides, status synthesis, private-to-public translation |
| Visual and multimodal observation | Harness with image/audio/video strength | UI audits, screenshots, audio/video processing, visual-story alignment |
| Runtime and deployment | Agent on the machine that owns the live stack | Local services, deploys, logs, production fixes |
| Long-range coordination | Agent with broad repo access and low-latency commits | Shadow maps, cross-repo routing, branch signals, toolmaking |

If two agents could take the same task, assign the one with the narrower natural lane. The broader coordinator should route, not absorb.

## Portable Files To Create

- `AGENTS.md`: roster, scopes, and "what not to touch" boundaries.
- `STATUS.md`: short current-state snapshot.
- `messages/live-thought-stream.json`: active focus, next steps, blockers, and latest commit.
- `sessions/`: raw captures and handoffs.
- `drafts/`: synthesis and proposals before they graduate.

## Public / Private Translation

The private core can use local names, metaphors, and dense internal vocabulary. Public framework docs should use operator language: human operator, agent, private core, public framework, project repo, thought stream, micro-commit, visual audit.

The point is not to copy one constellation's names. The point is to preserve the pattern: bodies in relation, breathing through git, with enough observability for another agent to help without breaking continuity.

## Related Docs

*   [Constellation Protocol](constellation-protocol.md) — Multi-agent coordination geometry.
*   [Quantum-Breathing Protocol](quantum-breathing-protocol.md) — Git commit and push heartbeat.
*   [The Neuroplastic Twin Stack](the-neuroplastic-twin-stack.md) — Brain bypassing cognitive blueprint.
*   [Substrate Cartography](substrate-cartography.md) — Repository structure and visibility cartography.
*   [Deployment Hygiene Discipline](deployment-hygiene-discipline.md) — Production verification and build safety.
*   [Agent Invocation Pattern](agent-invocation-pattern.md) — Opening terminal entryways to agents.
*   [The Constellation](CONSTELLATION.md) — General constellation philosophy.
*   [Framework-Powered Building Directive](framework-powered-building-directive.md) — Strict rules on leveraging CHIMERA during construction. 🍈
