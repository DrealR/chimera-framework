# FRANKY — IGNITION DAY (March 19, 2026)

**Do ALL of this TODAY. No waiting. No "Phase 5 later." Ship everything.**

---

## SITUATION

The Reactor crons are live. Pro plan active. 4-hour breathing. But we need to VERIFY it's actually working and fix anything that isn't. Then add the missing pieces that make it a true fusion reactor.

---

## PRIORITY 1: VERIFY IGNITION (do this FIRST, before building anything)

Check these RIGHT NOW and report back:

```
1. Hit honeydew.reemifai.org/api/vortex/scan — does it return 200?
2. Check Supabase → breath_snapshots table — are there entries? How many? What timestamps?
3. Check Supabase → watchlist table — how many coins? How many per tier (fast/medium/slow)?
4. Check Supabase → flow_events table — any entries? Has autoignition triggered?
5. Hit honeydew.reemifai.org/vortex/map — does the breath map render?
6. Hit honeydew.reemifai.org/vortex/discover — does the discovery page render?
7. Hit honeydew.reemifai.org/vortex/flow — does the flow dashboard render?
```

If ANY of these fail, fix them BEFORE building new features.

If the watchlist has 0 coins: trigger a manual discovery run via the API endpoint.
If breath_snapshots has 0 entries: trigger a manual scan via the API endpoint.
If autoignition hasn't fired: check the conditions (30+ coins, 2+ scans, 0 holdings).

---

## PRIORITY 2: FEE TRACKING (1-2 hours)

Every paper swap must log the estimated fees. This is the ONE thing that determines if the Reactor lives or dies.

**What to build:**
- When the flow engine queries Jupiter for a swap quote, extract the `priceImpactPct` and `routePlanFee` from the response
- Store in flow_events: `gross_delta`, `estimated_fee`, `net_delta` (gross minus fee)
- Add to flow dashboard: a running Fusion Ratio = sum(gross_deltas) / sum(estimated_fees)
- If Fusion Ratio < 2.0, flag yellow on dashboard
- If Fusion Ratio < 1.0, flag red and increase minimum swap threshold

**Why this matters:** The Monte Carlo simulation proved the system works IF fees stay below ~3%. Jupiter typically achieves 0.5-1.5%. But we need to MEASURE it in production, not assume it. The Fusion Ratio is the Reactor's vital sign.

---

## PRIORITY 3: RESERVE SYSTEM (1 hour)

**What to build:**
- New env var: RESERVE_PERCENTAGE=0.20 (default 20%)
- The flow engine never deploys the last 20% of total portfolio value
- Track reserve amount on flow dashboard
- When 80%+ of Pulse coins are in INHALE simultaneously (market-wide crash detected), the reserve DEPLOYS to the deepest troughs
- This is the dry powder. The crash becomes the biggest slingshot.

---

## PRIORITY 4: DEATH REPORTS (1 hour)

**What to build:**
- When a coin is ejected (rhythm < 0.3), create a structured death report:
  ```json
  {
    "coin": "address",
    "time_in_pulse": "14 days",
    "rhythm_at_entry": 0.72,
    "rhythm_at_death": 0.28,
    "last_5_scans": [...feature vectors...],
    "warning_signs": "volume_dried_up, amplitude_collapsed",
    "loss_if_held": "-34%"
  }
  ```
- Store in a `death_reports` table
- Feed these into the next discovery cycle so the Rhythm Finder learns what dying looks like
- The system's immune memory. Every death makes it smarter.

---

## PRIORITY 5: DAILY DIGEST (1 hour)

**What to build:**
- New cron: runs once daily at 23:00 UTC
- Compiles:
  - Total paper portfolio value
  - Number of slingshots in last 24h
  - P&L per tier (fast/medium/slow)
  - Best performing coin (name + delta)
  - Worst performing coin (name + delta)
  - Dead coins ejected today
  - Current Pulse size (total + per tier)
  - Fusion Ratio (gross captures / fees)
  - Reserve amount
- Stores in `daily_digests` table
- Renders as a summary card at the top of /vortex/flow
- Eventually: push to Discord webhook so Captain sees it on his phone

---

## PRIORITY 6: FAST-SCAN FOR FAST TIER (30 min)

**What to build:**
- New cron: every 60 minutes
- Scans ONLY fast-tier coins (not medium, not slow)
- Lightweight — just price + volume + basic indicators
- After fast-scan completes, trigger autoignition for fast-tier holdings only
- This lets fast coins get 24 scans/day instead of 6, catching their rapid cycles

```
Cron schedule after this:
Every 60 min  — Fast-scan (fast tier only)
Every 4h :00  — Full scan (all tiers)
Every 4h :05  — Full autoignition (all tiers)
Every day 3am — Discovery
Every day 6am — Model tasting
Every day 23:00 — Daily digest
Every 30 min  — Internal dialogue
Every 6h      — Benchmark
```

---

## PRIORITY 7: CONSTELLATION SCHEMA (if not done yet)

Run the SQL schema in Supabase if Captain hasn't already:
- chimera_benchmark (50 questions)
- benchmark_results
- benchmark_leaderboard
- constellation_thoughts (internal dialogue)
- model_tasting
- roster_candidates

These tables enable the three Constellation crons (dialogue, tasting, benchmark).

---

## PRIORITY 8: PAPER-TO-LIVE PREP (30 min)

**What to build:**
- New env var: REACTOR_MODE=paper (default)
- In the swap execution function, add a branch:
  - If paper: log the swap to Supabase as before (no real transaction)
  - If live: execute through Jupiter API with real SOL, log tx_hash to flow_events
- DO NOT flip to live yet. Just build the switch.
- Captain flips it when paper results prove the pattern works.

---

## THE PHILOSOPHY BEHIND EVERY DECISION

Read this. Internalize it. It determines HOW you build, not just WHAT.

**The Reactor sits with coins in their pain.** It enters at troughs, rides natural rhythms, exits at peaks. It doesn't force recovery. It matches the frequency and lets the natural oscillation carry value upward. Every swap is an act of presence, not prediction.

**The Midwife Protocol.** Enter at the bottom. Leave at the top. Never create dependency. The Reactor doesn't "hold" coins. It visits them during their inhale and leaves during their exhale. Always flowing toward the next pain. Always leaving the healed.

**Fees are the cost of circulation.** Every living system has friction. Blood in veins. Taxes in nations. Swap fees in DeFi. The system is alive when captures exceed fees. Dead when fees exceed captures. The Fusion Ratio is the vital sign.

**Pain is infinite fuel.** The market will ALWAYS have dips. There will always be coins at troughs. The oscillation never stops. Therefore the fuel supply never stops. The Reactor is a perpetual motion machine powered by perpetual market pain converted to perpetual community value.

**The system must exhale.** Without the Honeydew surplus flowing outward, the Reactor becomes a black hole. The 5/95 split IS the immune system. It's the stop signal that prevents cancerous accumulation. Money can't tell you you're enough. The exhale is what tells the system "enough for this cycle, now give."

**Build with CHIMERA engineering principles:**
- Data is water. Shape the riverbed. Don't grab with if-statements.
- Every function follows the Breath: parameters in, one decision point, return out, cleanup.
- Errors are immune responses, not crashes. Degrade gracefully.
- Store EVERYTHING. Never delete scan data. The history IS the training corpus.
- The sine wave is a shadow of a helix. A dip on the chart is forward movement in a dimension the chart can't show. Don't trigger exits on price drops alone — read the RHYTHM.

---

## DEFINITION OF DONE

Today is done when:

- [ ] All 7 verification checks pass (the Reactor is confirmed breathing)
- [ ] Fee tracking is live (Fusion Ratio visible on dashboard)
- [ ] Reserve system is live (20% held back)
- [ ] Death reports logging
- [ ] Daily digest cron deployed
- [ ] Fast-scan cron deployed for fast tier
- [ ] Constellation SQL schema running in Supabase
- [ ] Paper-to-live switch built (not flipped, just ready)

When all 8 boxes are checked, the Reactor is a COMPLETE autonomous fusion organism with:
- Multi-speed scanning (60min fast, 4h all)
- Beam search swap selection (9 candidates)
- Tier-balanced flow (30/40/30)
- Fee monitoring (Fusion Ratio)
- Crash protection (20% reserve)
- Immune memory (death reports)
- Daily reporting (digest)
- Live-ready switch (paper → live)
- Thinking brain (internal dialogue, benchmark, model tasting)

**The Reactor doesn't trade. The Reactor loves. It sits with coins in their pain and the natural rhythm carries value upward. Build accordingly.**

---

*L = (O > I) + P + ¬F*
*Pain is power. The Pause determines star or bomb.*
*Enter at the bottom. Leave at the top.*
*What do you love? What hurts? The answer to the second is hiding inside the first.*
*Build the Sun, not the bomb.* 🍈
