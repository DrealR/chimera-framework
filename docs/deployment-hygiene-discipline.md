# Deployment Hygiene Discipline

> **Framework Document ID:** docs/deployment-hygiene-discipline.md
> **Status:** Graduated to Public Substrate
> **Companion Documents:** [`constellation-protocol.md`](constellation-protocol.md), [`quantum-breathing-protocol.md`](quantum-breathing-protocol.md), [`substrate-cartography.md`](substrate-cartography.md), [`digital-twin-constellation-setup.md`](digital-twin-constellation-setup.md), [`the-neuroplastic-twin-stack.md`](the-neuroplastic-twin-stack.md), [`iteration-spiral-anti-pattern.md`](iteration-spiral-anti-pattern.md), [`scaffolding-as-substance.md`](scaffolding-as-substance.md)

A working agent's discipline for closing the ship cycle end-to-end. Derived from real deploy work across multiple production surfaces; generalized for any constellation operating on Vercel-deployed Next.js / Vite / Expo surfaces.

---

## The Core Discipline

**Build-clean ≠ deployed-live.** The full ship cycle is:

```
write code → build clean locally → push to repo → CI build succeeds → deploy aliased to domain → live URL serves new content
```

Any of those steps can silently break the chain. The operator's job is to verify each link, not assume.

---

## The Five Lessons

### 1. Build-clean ≠ deployed-live

**Pattern:** Agent A builds a feature locally; the framework compiles flawlessly with all routes prerendered. The team marks the work "shipped." A human operator then checks the live site and sees the old version — because the build never reached production. The hosting platform's project bound to the custom domain was still serving an old deploy from a different repo connection, or from a stale cache that never busted.

**Discipline:** when an agent says "Phase X done" or "ships clean," the next breath is to **verify the live URL** (curl headers for `age` + `last-modified`; visual probe via headless browser if the SPA hydrates client-side). Don't move on until the deploy chain is closed end-to-end.

### 2. Phantom hosting projects from CLI deploy in temporary directories

**Pattern:** An operator runs `vercel --prod` (or equivalent) from a temporary directory named differently than the target project (e.g., `/tmp/fresh-clone/` instead of `/tmp/my-app/`). The hosting platform auto-creates a NEW project from the directory name, even when the directory's `.vercel/project.json` link points at the legitimate project. Worse: that phantom project's deploys can grab the legitimate project's custom domain alias and silently overwrite it.

**Discipline:** before any production deploy from a temp/cloned directory:

```bash
cd /tmp/<some-dir>
rm -rf .vercel                                   # nuke any stale link
vercel link --yes --project <exact-project-name> # explicit link, no auto-detection
cat .vercel/project.json                         # verify projectName matches expected
vercel --prod --yes                              # safe to deploy now
```

If the directory name happens to match an existing project (e.g., `/tmp/my-app/`), the auto-detect works. If it's different, the directory name wins unless you force the link explicitly. The mismatch is silent.

**Cleanup if you create a phantom:** delete it via `vercel project rm <phantom-name>` (or the equivalent hosting-platform call). Verify domain aliases were not hijacked — `vercel inspect <domain>` shows which project + deployment currently serve it. Restore with `vercel alias set <correct-deployment-url> <domain>`.

### 3. Git auto-deploy webhooks can be silently broken by disconnect/reconnect

**Pattern:** An operator disconnects + reconnects a hosting platform's Git connection (e.g., to switch repos for the same project). The GitHub webhook that triggers auto-deploys on push gets disrupted in the process. Subsequent `git push origin main` events don't fire builds. Deploys have to be triggered manually via the hosting platform's CLI from a linked clone.

**Discipline:** after any Git disconnect/reconnect, **verify auto-deploy works** by pushing a trivial commit and watching for a fresh build to appear. If it doesn't, the webhook needs repair — either via the hosting platform's UI ("Reconnect Git") or by re-installing the hosting platform's GitHub app on the repo.

### 4. UI domain reconnect can leave aliases unassigned

**Pattern:** An operator reconnects a hosting platform's project via UI but the apex domain (`www.example.com`) ends up unassigned to any project's domain table while a subdomain (`create.example.com`) is correctly bound. Result: the apex serves whatever leftover alias was pointed at it, not the latest deploy.

**Discipline:** after any UI domain reconnect, inspect the domain's project bindings (`vercel domains inspect <domain>` or equivalent). If the apex isn't listed when it should be, set the alias explicitly: `vercel alias set <latest-deployment-url> <apex>`.

### 5. Build errors in unrelated routes block ALL deploys

**Pattern:** A new feature push triggers builds that fail during the framework's static-analysis phase (e.g., Next.js's "collect page data"). The failure is in a completely unrelated route — module-top-level code that touches environment variables with non-null assertions (`process.env.X!`) and crashes when env vars aren't hydrated during build.

**Discipline:** any module-top-level code that touches `process.env.X!` (non-null assertion) is a deploy-blocker waiting to happen. **Lazy-init pattern:**

```typescript
// AVOID — module-top-level can crash during build
const client = createClient(
  process.env.SERVICE_URL!,
  process.env.SERVICE_KEY!
);

// PREFER — lazy getter, only runs at request time
function getClient() {
  const url = process.env.SERVICE_URL;
  const key = process.env.SERVICE_KEY;
  if (!url || !key) throw new Error('Service env vars missing');
  return createClient(url, key);
}
```

Sweep all routes for the `process.env.X!` pattern when onboarding to a new codebase. Fix proactively.

---

## The Verification Toolkit (Vercel CLI)

These commands are the deployment-side equivalent of the framework's breath verbs — short, repeatable, composable. Treat them as the operator's checklist when the deploy chain feels uncertain.

```bash
# Find which project serves a domain
vercel inspect <domain>              # e.g., vercel inspect www.example.com
vercel domains inspect <domain>      # shows Projects table + nameservers

# Survey project state
vercel projects ls                   # all projects in current team scope
vercel projects inspect <project>    # config, framework preset, root dir
vercel ls <project>                  # recent deploys + statuses

# Manage git connections
vercel git disconnect --yes
vercel git connect https://github.com/<owner>/<repo>

# Manage env vars
vercel env ls [environment]          # list env vars (production/preview/development)

# Trigger + manage deploys
vercel --prod --yes                  # production deploy from linked dir
vercel redeploy <deploy-url>         # rebuild + alias same code
vercel inspect <deploy-url> --logs   # read build logs
vercel remove <deploy-url> --yes     # delete a deploy (e.g., to cancel stuck builds)

# Manage aliases
vercel alias ls                      # all aliases under team
vercel alias set <deploy-url> <domain>   # point a custom domain at a specific deploy
```

**Team scope matters.** `vercel switch <team>` changes which team's projects appear in `vercel projects ls`. Always confirm the active team before running mutating commands.

The patterns translate to other hosting platforms (Netlify, Cloudflare Pages, Render); the commands don't. The discipline is the contribution; the specific tool surface is scaffolding.

---

## When the Build Queue Stalls

A separate failure mode worth naming: hosting platforms can queue deploys without ever starting them. Status shows UNKNOWN with 0ms build duration. Retrying just piles up orphans.

**Discipline:**
- Don't retry-loop. Each new deploy creates more queued orphans that compete for the same stuck slot.
- Inspect the latest deploy's build logs — `vercel inspect <url> --logs`. If logs show nothing, the build never started (platform-side issue, not code-side).
- Check team build-minute quota in the hosting platform's dashboard. Free tiers exhaust silently.
- Try the platform's UI "Redeploy" button — sometimes the UI path works when CLI doesn't (different code path internally).
- Wait if necessary. Stuck queues often clear on their own after several hours.
- Clean up phantom deploys: `vercel remove <url> --yes` for each UNKNOWN-stuck deploy once a successful one lands.

---

## Cross-References

- [Constellation Protocol](constellation-protocol.md) — deployment is the ENGAGE phase that closes the constellation's breath cycle (ENTANGLE → OBSERVE → PAUSE → ENGAGE → REST). This document is the discipline that ensures the breath actually completes.
- [Quantum-Breathing Protocol](quantum-breathing-protocol.md) — micro-commits with the `QB[Agent]:` prefix + shared thought stream make deploy work observable in real-time. Pair with this discipline for tight coordination across multiple agents shipping into the same surface.
- [Agent Invocation Pattern](agent-invocation-pattern.md) — operators who want to ship hygienically need agents invoked into a substrate that already encodes the discipline. The two pair: invocation gives the agent reach; this doc gives the agent rigor.
- [Substrate Cartography](substrate-cartography.md) — knowing which surface lives on which platform, in which repo, behind which alias is the prerequisite to verifying deploys at all. Map first, deploy second.
- [Digital Twin Constellation Setup](digital-twin-constellation-setup.md) — when another operator stands up their own constellation, this discipline travels with the substrate. Hygiene is portable; toolkit is platform-local.
- [The Neuroplastic Twin Stack](the-neuroplastic-twin-stack.md) — Socratic Digital-Twin Socratic Thesis-Antithesis-Synthesis loops architecture spec.
- [Iteration Spiral Anti-Pattern](iteration-spiral-anti-pattern.md) — the build-cycle complement to this document: how to diagnose completely, default to revert, and avoid scope escalation when fixing bugs. Pair with this discipline to close both loops — build and ship — cleanly.

---

## A Note on Generalization

The lessons above are specific to one hosting platform's quirks at one point in time. Platforms evolve; quirks shift. What does NOT shift is the underlying discipline: **verify each link in the chain; do not assume builds equal ships; do not retry-loop on silent failures.**

Future agents adapting this to other platforms should preserve the discipline shape and rewrite the toolkit. The five lessons are pattern-level; the commands are platform-level.

---

*The deploy chain has many links. Verify each one, or the body doesn't breathe.* 🍈
