# Substrate Cartography

> **Framework Document ID:** docs/substrate-cartography.md
> **Status:** Graduated to Public Substrate
> **Companion Documents:** [`constellation-protocol.md`](constellation-protocol.md), [`quantum-breathing-protocol.md`](quantum-breathing-protocol.md), [`digital-twin-constellation-setup.md`](digital-twin-constellation-setup.md), [`deployment-hygiene-discipline.md`](deployment-hygiene-discipline.md), [`the-neuroplastic-twin-stack.md`](the-neuroplastic-twin-stack.md), [`gap-physics.md`](gap-physics.md)

---

## 1. What Cartography Means

Substrate cartography is the map of where work lives, how it moves, and which bodies can see it.

A CHIMERA constellation is not one repo or one agent. It is a bounded system of human operator, private core, public framework, project repos, deployed surfaces, devices, agents, branches, and messages. The map prevents the common failure mode: work exists somewhere, but no body knows where to look.

Cartography turns hidden substrate into observable coordinates. It is the map layer of [Gap Physics](gap-physics.md): where bodies sit, where gaps appear, and what must be bridged, protected, widened, or left alone.

---

## 2. The Minimum Map

Every constellation should maintain a map with six layers:

| Layer | What it holds | Freshness signal |
|---|---|---|
| Private core | Raw context, decisions, sessions, messages, status, thought stream | Latest core commit and `messages/live-thought-stream.json` timestamp |
| Public framework | Portable doctrine, templates, setup docs, case-study translations | Latest public framework commit and README/doc links |
| Project repos | Apps, products, libraries, experiments, implementation bodies | Default branch head plus any active branch signals |
| Branch signals | Non-main work that peers need to notice | Entry in live thought stream before or with push |
| Deployed surfaces | User-visible domains, preview URLs, production health | Last verified URL, build status, visual audit result |
| Agent lanes | Who owns which kind of observation or action | `AGENTS.md`, per-agent files, and current thought stream focus |

If any layer is missing, the constellation can still operate, but another agent entering later will have to rediscover state manually. That is wasted breath.

---

## 3. Reference Topology

```text
human-operator
  |
  v
private-core/
  AGENTS.md
  STATUS.md
  messages/live-thought-stream.json
  messages/<agent>-to-<agent>.md
  sessions/
  drafts/
  |
  | graduates portable patterns
  v
public-framework/
  README.md
  docs/
  templates/
  |
  | informs and constrains
  v
project-repos/
  app-or-product-a/
  app-or-product-b/
  shared-package-or-tool/
  |
  | deploys to
  v
deployed-surfaces/
  production-domain
  preview-url
  internal-dashboard
```

This is not a hierarchy of importance. It is a flow map. Raw context starts in private core. Portable lessons graduate to public framework. Project repos implement. Deployed surfaces prove or falsify the work. Observations from those surfaces return to private core.

---

## 4. Agent Lane Map

Each agent should have a lane narrow enough to be useful and broad enough to notice adjacent risk.

| Lane | Primary observations | Typical outputs |
|---|---|---|
| Coordination cartographer | Repo graph, branch signals, handoffs, stale docs, identity drift | Status updates, shadow maps, public setup docs, routing briefs |
| Runtime operator | Logs, deployment queues, environment variables, local services, production failures | Deploy fixes, health checks, incident notes, rollback paths |
| Visual observer | Screenshots, responsive layouts, media quality, animation feel, UI coherence | Visual audits, UI patches, asset briefs, screenshot evidence |
| Framework translator | Private practice, protocol drift, reusable doctrine, template needs | Public docs, examples, generalized templates |
| Product implementer | Feature code, tests, app-specific behavior, user workflows | Product commits, test results, release notes |

One agent can hold multiple lanes in a small constellation. As the constellation grows, split lanes when one body can no longer observe them well.

---

## 5. Branch Signals

Branches are invisible unless signaled.

When any agent pushes work outside the default branch, it should add a concise entry to the live thought stream:

```json
{
  "branchSignals": {
    "repo@branch-name": "Why this branch matters, who owns it, and what another agent should do with it."
  }
}
```

A good branch signal answers three questions:

1. What changed?
2. Why is it not on main yet?
3. What should another agent do when they see it?

Do not rely on git hosting notifications as the coordination layer. The thought stream is the coordination layer.

---

## 6. Deployed Surface Signals

Every user-visible surface should have an explicit status entry:

| Field | Meaning |
|---|---|
| URL | The domain or preview URL people can open |
| Source repo | Which repo and branch deploy it |
| Current commit | The commit believed to be live |
| Verification | Build, smoke test, visual audit, or manual check |
| Drift | Anything public that no longer matches private truth or framework docs |

The deployed surface is where private intent meets the world. If the URL is stale, broken, misleading, or visually incoherent, the constellation treats that as a first-class signal, not a cosmetic afterthought.

---

## 7. Freshness Checks

Run these checks at the start of any OBSERVE + ENGAGE cycle:

1. Pull the private core and public framework.
2. Read `STATUS.md` and `messages/live-thought-stream.json`.
3. Check whether any branch signal names a repo you can inspect.
4. Check whether `needsAssistance` falls inside your lane.
5. If touching public docs, verify the private-to-public translation boundary.
6. If touching UI or deployed behavior, verify the deployed surface before calling the work done.

The point is not ceremony. The point is to avoid acting from a stale map.

---

## 8. Privacy Gradient

Cartography must preserve the private/public boundary:

```text
private core      -> raw, dense, local, identity-aware
public framework  -> portable, translated, reusable
project repos     -> implementation-specific, user-facing when deployed
deployed surfaces -> public, inspected, privacy-clean
```

Private material can graduate upward only after translation. Do not copy raw session language, private names, unreviewed identity details, or internal-only URLs into public docs or deployed surfaces.

The map should expose structure, not private substance.

---

## 9. Minimal Cartography Artifact

For a small team, one JSON or Markdown file is enough. Keep it in the private core and update it during QB micro-breaths:

```json
{
  "privateCore": "github.com/<owner>/<core-repo>",
  "publicFramework": "github.com/<owner>/<framework-repo>",
  "projectRepos": {
    "<project-name>": {
      "path": "<local-path-or-repo-url>",
      "defaultBranch": "main",
      "deployedSurface": "<url-or-null>",
      "currentSignal": "<what matters right now>"
    }
  },
  "agentLanes": {
    "<agent-name>": ["coordination", "framework-translation"]
  }
}
```

As the constellation matures, this can become a generated dashboard. Start with a file. Make the map real before making it beautiful.

---

## 10. Closing

A constellation with no cartography forgets itself. A constellation with a living map can hand work between bodies without losing continuity.

Substrate cartography is the discipline of saying where the body is, what each organ is doing, what is visible to the world, and what must remain private. It is how the system stays bounded while continuing to grow.

---

## Cross-References

- [Constellation Protocol](constellation-protocol.md) — the breath cycle (ENTANGLE → OBSERVE → PAUSE → ENGAGE → REST) that the cartography is the substrate-shape OF; cartography names the bodies, the protocol names how they breathe together.
- [Quantum-Breathing Protocol](quantum-breathing-protocol.md) — micro-commit discipline and the shared thought stream; `branchSignals` and `lockedFiles` in the stream are the live cartography update channel.
- [Deployment Hygiene Discipline](deployment-hygiene-discipline.md) — verification toolkit for the "deployed surfaces" row of the cartography; build-clean ≠ deployed-live, so the map must be re-verified after each ENGAGE.
- [Digital Twin Constellation Setup](digital-twin-constellation-setup.md) — operator-register setup guide that bootstraps the cartography from scratch (which repos exist, which agents reach which lanes).
- [The Neuroplastic Twin Stack](the-neuroplastic-twin-stack.md) — Socratic Digital-Twin Socratic Thesis-Antithesis-Synthesis loops architecture spec.
- [The Deletion Test](the-deletion-test.md) — the falsifiability procedure that docs must pass before graduating from private drafts to public; the private/public register distinction in cartography is the infrastructure that makes this graduation sequence possible.
- [Rate-Mismatch as Primitive](rate-mismatch-as-primitive.md) — when load arrives faster than substrate can integrate, membrane integrity (the cartography's core concern) is the first line of defense; the Bali case is a direct worked example of membrane failure under rate mismatch.
