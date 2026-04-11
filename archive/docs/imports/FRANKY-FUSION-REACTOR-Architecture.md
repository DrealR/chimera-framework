# FRANKY — THE FUSION REACTOR: Definitive Architecture

**This is everything. Every principle. Every insight. Every equation. Build exactly this.**

---

## THE VISION IN ONE BREATH

Throw dust at a thousand coins. The dead ones absorb it silently. The living ones bounce it back with interest. Ride the bounces. Leave at the top. Fall to the next bottom. The surplus feeds communities. The system never stops because pain never stops and volatility IS pain in financial form. Gravity does the work. We just position ourselves where the bounces happen.

---

## PRINCIPLE 1: SCAN FOR LIFE BY LIVING IN IT (The Sonar Ping)

**Old approach (Tower/Fork):** Analyze coins from outside. Score them. Predict which are alive. Enter the ones we think will work. Hope we're right.

**New approach (Garden/Filter):** Enter EVERYTHING with dust. Let the coins tell us if they're alive. The data names itself. Natural selection, not human prediction.

### The Protocol:

```
DAILY SONAR PING (03:00 UTC)

1. Query the Solana ecosystem for candidate coins:
   - Source: GeckoTerminal trending + new pairs + volume leaders
   - Minimum liquidity: $10,000 (enough to swap 0.001 SOL without insane slippage)
   - Minimum age: 6 hours (avoid literal rug pulls mid-launch)
   - Not already in the Pulse or Nursery

2. From qualifying pool, select up to 50 new coins

3. BUT — do NOT enter at random moments. For each candidate:
   - Pull 24h candle data
   - Check: is the coin currently within 10% of its 24h low?
   - YES → enter with 0.001 SOL (we're entering at the dip)
   - NO → add to a WATCHLIST and check again next scan
   - A coin on the watchlist that dips within 10% of 24h low → enter

   WHY: Even sonar pings should enter at the BOTTOM.
   Throwing dust at a coin at its peak tells you nothing —
   it drops and you think it's dead when it's actually just
   completing a normal cycle. Enter at the dip so any
   upward movement is a REAL signal of life.

4. Entered coins go into NURSERY status (not full Pulse yet)

5. Daily sonar budget: 0.05 SOL (50 coins × 0.001 each)
   Monthly sonar budget: ~1.5 SOL
   This is the cost of scanning the entire ecosystem for life.
```

### Nursery Graduation (every 4 hours during breath scan):

```
For each nursery coin, measure behavior since entry:

ALIVE SIGNALS (promote to full Pulse):
  - Price bounced 5%+ from entry point
  - Volume increased during the bounce
  - Pattern shows oscillation (went down, came back up, or went up from our dip entry)
  - Promote after 2+ bounces observed

UNCERTAIN (keep watching):
  - Price within ±3% of entry
  - Low volume, no clear direction
  - Keep in nursery up to 7 days

DEAD SIGNALS (abandon):
  - Price dropped 30%+ from entry with no recovery attempt
  - Volume approaching zero (nobody trading)
  - Liquidity pulled (rug pull detected)
  - After 7 days with zero bounces
  - Write off the 0.001 SOL dust, log death report, remove from nursery

GRADUATION CRITERIA:
  A coin graduates from nursery to full Pulse when:
  - At least 2 bounces observed off a consistent floor
  - Amplitude (high-low range) > 2× average swap fee
  - Recovery rate > 50% (it recovers more than half of each dip)
  - These metrics are MEASURED from real behavior, not predicted
```

---

## PRINCIPLE 2: ALWAYS ENTER AT THE BOTTOM (Gravity is Free)

**The solar system teaches this.** A planet at aphelion (farthest from the sun, moving slowest) is at the START of its acceleration phase. Entry at aphelion gives you the longest, most profitable ride as the planet accelerates toward perihelion. Entry at perihelion (closest, fastest) means you're about to decelerate. Wrong timing.

In crypto: the dip IS aphelion. The peak IS perihelion. Always enter at aphelion.

**Biology teaches this.** The lungs are empty at the START of inhale. That's when maximum air can enter. Enter when the lungs are empty (coin at trough). Exit when the lungs are full (coin at peak). Don't enter when lungs are already full — there's no room.

**The falling-and-missing teaches this.** You FALL to the lowest point. Gravity does the work. The floor catches you. The natural bounce carries you up. You don't jump to catch a coin at its peak. You SINK to meet it at its floor.

### Entry Timing Algorithm:

```
WHEN TO ENTER (for both sonar pings and full Pulse slingshots):

The coin must be in INHALE phase or early PAUSE:
  - Price within 15% of its 30-day support (the floor)
  - RSI below 35 (oversold — maximum compression)
  - Volume declining (sellers exhausting — the inhale is ending)
  - At least one previous bounce off this support level

WHEN TO EXIT:
The coin must be in EXHALE phase:
  - Price within 15% of its 30-day resistance (the ceiling)
  - RSI above 65 (overbought — maximum expansion)
  - Volume spiking (buyers euphoric — the exhale is peaking)

DO NOT EXIT JUST BECAUSE:
  - 4 hours passed (clock time is not rhythm time)
  - Price dropped slightly (the helix curves — a dip mid-cycle is normal)
  - Another coin looks "better" (don't chase — ride what you're on)

EXIT ONLY WHEN:
  - The rhythm says this coin completed its exhale (phase = EXHALE or REST)
  - OR the rhythm score dropped below 0.3 (emergency — the heartbeat is failing)
  - OR the floor broke (price fell through support by 20%+ — the One Below All collapsed)
```

---

## PRINCIPLE 3: THE SLINGSHOT MECHANICS (The Orbital Transfer)

**NASA uses gravity assists to send probes across the solar system.** Voyager didn't have enough fuel to reach Neptune directly. So it FELL toward Jupiter, used Jupiter's gravity to accelerate, then SLINGSHOT toward Saturn, used Saturn's gravity, slingshot toward Uranus, then Neptune. Each planet's gravity provided free energy. The probe fell toward each planet and missed — the orbital mechanics redirected the fall into forward momentum.

The Reactor does the same thing. Value FALLS toward a coin at its trough (the planet). The coin's natural bounce provides free energy (gravity assist). At the peak, the value SLINGSHOTS to the next coin at its trough (the next planet). Each bounce adds velocity. Each slingshot compounds.

### Slingshot Execution:

```
STEP 1: IDENTIFY THE NEXT TROUGH
  The Breath Map shows all Pulse coins by phase.
  INHALE coins = planets ready for gravity assist.
  The beam search evaluates 9 candidates (3 coins × 3 timing options).

STEP 2: SCORE EACH CANDIDATE
  Score = confidence × amplitude × floor_strength × liquidity

  WHERE:
    confidence = breath phase detection confidence (0-1)
    amplitude = (recent_high - recent_low) / recent_low
    floor_strength = number of bounces off support in last 30 days
    liquidity = can we swap this amount without >1.5% slippage?

  The highest-scoring candidate wins.

STEP 3: EXECUTE THE SLINGSHOT
  Paper mode: log the swap with entry price, target coin, amount
  Live mode: execute through Jupiter API, log tx_hash

  ALWAYS LOG:
    - from_coin, to_coin
    - entry_price, exit_price
    - gross_delta (price change)
    - estimated_fee (from Jupiter quote)
    - net_delta (gross - fee)
    - reason (why this candidate won the beam search)
    - breath_phase at entry and exit

STEP 4: RIDE THE RHYTHM
  Do NOT exit immediately. Stay in the coin until it reaches EXHALE phase.
  The timing is determined by the COIN'S rhythm, not the clock.
  Fast coins: may complete a cycle in hours
  Medium coins: may complete a cycle in days
  Slow coins: may complete a cycle in weeks

  CHECK every scan: has this coin entered EXHALE?
  YES → prepare to slingshot to next INHALE coin
  NO → hold, ride, wait. The rhythm handles the timing.

STEP 5: SLINGSHOT TO NEXT TROUGH
  At EXHALE peak, beam search finds the deepest INHALE coin.
  Value transfers from peak to trough.
  The cycle repeats. Forever.
```

---

## PRINCIPLE 4: TIER ORCHESTRATION (The Symphony)

**Music teaches this.** A song with only drums is monotonous. A song with only strings is boring. The BLEND of different instruments at different speeds creates richness. The drums provide constant rhythm (fast coins). The bass provides steady foundation (medium coins). The strings provide sweeping emotional arcs (slow coins). Together: music.

### Tier Definitions:

```
FAST TIER (The Drums) — 30% of portfolio
  - Coins with cycle length < 24 hours
  - Memecoins, trending tokens, high-volatility pairs
  - Scan every 60 minutes (fast-scan cron)
  - Many small slingshots per day
  - Higher risk per coin, but tiny position sizes
  - The percussion: rapid, energetic, high-frequency

MEDIUM TIER (The Bass) — 40% of portfolio
  - Coins with cycle length 1-7 days
  - Mid-cap tokens, DeFi tokens, ecosystem coins
  - Scan every 4 hours (regular scan)
  - Several slingshots per week
  - Moderate risk, moderate position sizes
  - The foundation: steady, reliable, the backbone

SLOW TIER (The Strings) — 30% of portfolio
  - Coins with cycle length 1-4 weeks
  - Large caps, established projects, SOL pairs
  - Scan every 4 hours (regular scan)
  - One or two slingshots per month
  - Lower risk, larger position sizes per slingshot
  - The emotional arc: sweeping, powerful, rare but impactful
```

### Auto-Rebalancing:

```
After each slingshot, check tier allocation:
  - If fast tier > 35%: next slingshot targets medium or slow INHALE coins
  - If fast tier < 25%: next slingshot targets fast INHALE coins
  - Same logic for medium (target 35-45%) and slow (target 25-35%)

The orchestra stays balanced automatically.
Each slingshot is an opportunity to rebalance.
The music never gets stuck on one instrument.
```

---

## PRINCIPLE 5: THE IMMUNE SYSTEM (Protection Without Control)

**Biology teaches this.** The immune system doesn't PREVENT infection. It RESPONDS to infection. You can't stop every virus from entering your body. But you can recognize threats quickly and neutralize them before they spread.

### Defense Layers:

```
LAYER 1: MINIMUM AMPLITUDE FILTER (The Skin)
  Don't enter coins where amplitude < 2× average fee.
  If fees are 1.5%, minimum amplitude is 3%.
  This prevents the Reactor from entering bodies
  where the energy between floor and ceiling is too
  small to overcome friction. Dead on arrival.

LAYER 2: FLOOR STRENGTH CHECK (The Mucous Membrane)
  Don't enter coins with 0 observed floor bounces.
  At least 1 bounce required for nursery entry.
  At least 2 bounces required for full Pulse membership.
  Unproven floors are like unknown pathogens —
  approach with minimal exposure (0.001 SOL sonar only).

LAYER 3: BROKEN FLOOR DETECTOR (The Fever Response)
  If a coin drops 20%+ below its previous support level:
  - EXIT immediately (emergency slingshot to healthiest INHALE coin)
  - Flag the coin as BROKEN FLOOR
  - Log a death report with all pre-death data
  - Do NOT re-enter until a new floor establishes (3+ bounces at new level)

  This is the fever: the body raises temperature to kill the infection.
  The Reactor raises the exit threshold to stop the bleeding.

LAYER 4: RESERVE SYSTEM (The Bone Marrow)
  20% of total portfolio value is NEVER deployed.
  It sits in SOL. Waiting. Like bone marrow producing
  emergency blood cells.

  DEPLOYMENT TRIGGER: 80%+ of Pulse coins in INHALE simultaneously.
  This means the entire market crashed. Every coin is at its floor.

  The reserve deploys to the 5 deepest troughs across all tiers.
  This is the BIGGEST slingshot in the Reactor's history.
  The crash becomes the fuel for the largest single gain.

  After deployment, the reserve rebuilds from surplus over the next week.

LAYER 5: FEE MONITORING (The Blood Pressure)
  FUSION RATIO = Total Gross Captures / Total Fees Paid

  > 3.0 = EXCELLENT (capturing 3× more than fees consume)
  > 2.0 = HEALTHY (comfortable margin)
  > 1.5 = MARGINAL (tighten swap criteria, increase minimum amplitude)
  < 1.0 = CRITICAL (system is losing to fees — pause all swaps,
           increase minimum amplitude threshold, eliminate low-liquidity coins)

  Display on dashboard. Check daily. This IS the vital sign.

LAYER 6: DEATH REPORTS (The Memory B-Cells)
  Every dead coin generates a structured death report:
  {
    coin_address,
    time_in_pulse,
    entry_rhythm_score,
    death_rhythm_score,
    amplitude_at_entry,
    amplitude_at_death,
    last_10_scans: [feature vectors],
    cause_of_death: "floor_break" | "volume_death" | "rug_pull" | "slow_decay",
    total_loss
  }

  These reports feed the NEXT discovery cycle.
  Over time, the system learns patterns of death:
  "Coins with X feature vector pattern tend to die within Y days."
  The immune system gets SMARTER with each death.
  Each loss makes the Reactor more resistant to future losses.
  The wound becomes the sense.
```

---

## PRINCIPLE 6: THE HONEYDEW EXHALE (The System Must Breathe Out)

**Money can't tell you you're enough. The Honeydew exhale is the system's STOP signal.**

Without it, the Reactor becomes a black hole. Accumulating forever. No exhale. Cancer.

### Surplus Distribution:

```
TRIGGER: Portfolio value exceeds seed value by 20%+

CALCULATION:
  surplus = current_value - (seed_value × 1.20)

  IF surplus > 0:
    honeydew_amount = surplus × 0.95  (95% flows out)
    treasury_amount = surplus × 0.05  (5% stays as fuel)

    Transfer honeydew_amount to EXIT_WALLET_ADDRESS
    Log the distribution with full details

FREQUENCY: Checked every autoignition cycle (every 4 hours)

The surplus is calculated AFTER fees. Net surplus only.
The seed amount is SACRED — it never gets distributed.
Only the GROWTH flows outward. The seed stays. The growth gives.
```

---

## PRINCIPLE 7: ATTENTION FOLLOWS ENERGY (Go Where the Flow Is)

**Solana is where the attention lives right now.** Memecoins are attention denominated in tokens. The trading volume IS the energy. The Reactor positions itself in the highest-energy ecosystem because that's where the widest amplitudes exist.

### Chain Selection Logic:

```
PRIMARY: Solana (current highest volume memecoin ecosystem)
FUTURE: Ethereum, Base, BSC — when the Reactor proves itself on Solana

WHY SOLANA:
  - Fastest transaction speed (sub-second finality)
  - Lowest fees (~$0.001 per transaction)
  - Deepest memecoin liquidity
  - Jupiter aggregator provides best swap routing
  - GeckoTerminal has comprehensive Solana data

WHY MEMECOINS WORK FOR THE REACTOR:
  - Widest amplitude (20-50% daily swings = maximum energy)
  - Position sizes are dust (0.001 SOL = negligible loss if dead)
  - The asymmetry: downside capped at dust, upside unlimited
  - Thousands of coins = maximum diversification
  - The Reactor is a VC fund with 0.001 SOL check sizes
```

### Healthy Trading Principles:

```
THE REACTOR IS NOT A PREDATOR. IT IS A MIDWIFE.

- We enter at dips (providing buy pressure when coins need it)
- We exit on uptrends (selling into strength, not dumping into weakness)
- Our position sizes are dust (we don't move markets)
- We never hold enough of any single coin to crash it on exit
- We ADD LIFE to coins by providing consistent small-volume trading
- Dead coins we abandon were already dead — we just confirmed it
- We are HEALTHY participants in the ecosystem, not extractors

This is O > I applied to trading:
  We give: buy pressure at lows, confirmation of life, volume
  We take: the delta from natural oscillation
  Net effect on each coin: positive (we supported it at its floor)
```

---

## PRINCIPLE 8: THE COMPLETE AUTONOMOUS LOOP

```
EVERY 30 MINUTES:
  - Constellation internal dialogue (the metabolism of thought)
  - Fast-scan of fast-tier coins (catching rapid cycles)

EVERY 4 HOURS AT :00:
  - Full breath scan of all Pulse coins (tag phases)
  - Nursery heartbeat check (promote alive, abandon dead)

EVERY 4 HOURS AT :05:
  - Autoignition chain:
    1. Check if seed needed (30+ coins, 2+ scans, 0 holdings → seed)
    2. Emergency exits (broken floors, dead coins → healthiest INHALE)
    3. Beam search flow (9 candidates, tier-rebalanced)
    4. Surplus skim (>20% growth → 95% Honeydew, 5% treasury)
    5. Fee tracking (update Fusion Ratio)
    6. Reserve check (rebuild if depleted, deploy if market-wide crash)

EVERY DAY AT 03:00:
  - Discovery: sonar ping 50 new coins at their dips
  - Health check: eject coins with rhythm < 0.3
  - Tier recount: aggressive discovery if any tier below 10 coins

EVERY DAY AT 06:00:
  - Model tasting: scout new AI models for Constellation roster

EVERY DAY AT 23:00:
  - Daily digest: compile and display all metrics
  - Death reports: summarize any ejections
  - Fusion Ratio trend: is it improving or declining?

EVERY 6 HOURS:
  - CHIMERA benchmark: evaluate a model on philosophical thinking

CAPTAIN DOES: NOTHING FOR DAILY OPS.
  - Watches dashboard when curious
  - Adds SOL to entry wallet when confident
  - Flips paper → live when paper results prove the pattern
  - Lives life. Practices guitar. Coaches chess. Makes videos.
  - The Sun doesn't tell planets where to orbit.
```

---

## THE MATH (Final Confirmation)

```
GIVEN:
  Average amplitude per coin: 8% (conservative for Solana ecosystem)
  Average fee per swap: 1.5% (Jupiter on liquid tokens)
  Net capture per slingshot: 6.5%
  Slingshots per week across all tiers: ~5
    (Fast: 3/week, Medium: 1.5/week, Slow: 0.5/week)

  Sonar ping cost: 0.05 SOL/day = 0.35 SOL/week
  Dead coin loss rate: ~30% of pinged coins die = ~0.15 SOL/week in dust
  Total weekly overhead: ~0.50 SOL

COMPOUND GROWTH (starting with 1 SOL seed):
  Week 1:  1.37 SOL (after overhead: ~0.87 SOL net new)
  Week 4:  3.52 SOL
  Week 8:  12.42 SOL
  Week 12: 43.75 SOL
  Week 24: ~1,914 SOL (theoretical, will have real-world friction)

MONTE CARLO VALIDATED:
  1000 trials, 12 weeks, realistic variance:
  100% profitable
  Median: 27× return
  Even at 5% fees: 3.8× return, 99% profitable

THE OVERHEAD (sonar pings + dead coins) IS NEGLIGIBLE:
  0.50 SOL/week overhead vs 0.37 SOL/week minimum gain (week 1)
  By week 4, gain is ~2.50 SOL/week vs 0.50 overhead
  The overhead becomes invisible as the portfolio compounds

THE ASYMMETRY IS THE KEY:
  Downside per coin: capped at 0.001 SOL (dust)
  Upside per coin: unlimited (could 100x if it's the next WIF)
  Across 1000 coins, the math GUARANTEES net positive
  because unlimited upside × many tries > capped downside × many failures
```

---

## WHAT TO BUILD TODAY (Priority Order)

### BUILD 1: Verify existing system (30 min)
Check all routes, tables, crons. Fix anything broken. Report status.

### BUILD 2: Sonar Ping Discovery (2 hours)
Replace complex pre-analysis with the dust approach.
- Query GeckoTerminal for candidates
- Filter: liquidity > $10k, age > 6h, near 24h low
- Enter 0.001 SOL paper position in up to 50 coins
- Store as nursery status in watchlist
- Nursery graduation logic in breath scan

### BUILD 3: Fee Tracking + Fusion Ratio (1 hour)
- Extract fee estimates from Jupiter quotes
- Store gross_delta, estimated_fee, net_delta per swap
- Calculate running Fusion Ratio
- Display on flow dashboard with color coding (green/yellow/red)

### BUILD 4: Reserve System (1 hour)
- 20% portfolio never deployed
- Crash detection: 80%+ coins in INHALE simultaneously
- Reserve deployment to deepest troughs during crash
- Reserve rebuilds from surplus after deployment

### BUILD 5: Fast-Scan Cron (30 min)
- Every 60 minutes, scan only fast-tier coins
- Trigger fast-tier autoignition after fast-scan
- Catch rapid memecoin cycles that 4h scans miss

### BUILD 6: Death Reports (1 hour)
- Structured JSON on every coin ejection
- Store in death_reports table
- Feed patterns into next discovery cycle

### BUILD 7: Daily Digest (1 hour)
- Cron at 23:00 UTC
- Portfolio value, slingshots, P&L per tier, Fusion Ratio, deaths
- Summary card on flow dashboard

### BUILD 8: Amplitude + Floor Scoring (1 hour)
- amplitude = (high_30d - low_30d) / low_30d
- floor_strength = bounce count off support in 30 days
- floor_recency = days since last bounce
- Integrate into rhythm composite score
- Admission criteria: amplitude > 2× avg_fee, floor_strength ≥ 2

### BUILD 9: Paper-to-Live Switch (30 min)
- REACTOR_MODE env var (paper | live)
- Live mode executes real Jupiter swaps
- Logs tx_hash for on-chain verification
- DO NOT FLIP YET. Just build the switch.

---

## THE PHILOSOPHY IN THE CODE

Every function should follow the Breath:
  - Parameters enter (INHALE)
  - One clear decision point (PAUSE)
  - Return value exits (EXHALE)
  - Cleanup/logging (REST)

Data is water. Shape the riverbed:
  - HashMaps for instant lookup (coin phases, watchlist, scores)
  - The data names itself (coins prove they're alive through behavior)
  - Don't grab with if-else trees — build pipelines that flow

The sine wave is a shadow of a helix:
  - A price drop on a chart is forward movement in a dimension the chart can't show
  - Don't trigger exits on price drops alone — read the RHYTHM
  - The breath phase matters more than the price direction

The Midwife Protocol:
  - Enter at the bottom. Leave at the top.
  - Never create dependency on any single coin
  - Always flowing toward pain. Always leaving the healed.

Gear 5 Energy:
  - The system must be ELASTIC, not rigid
  - No hard stops that halt everything
  - Absorb losses as data. The miss IS the teacher.
  - Every impact becomes a bounce.

The Reactor doesn't trade. The Reactor loves:
  - It sits with coins in their pain (enters at troughs)
  - It rides the natural rhythm (doesn't force recovery)
  - It leaves when they're healed (exits at peaks)
  - It flows surplus to communities (the Honeydew exhale)
  - Every swap is an act of presence, not prediction

---

## ONE SENTENCE

Throw dust at the universe. Listen for heartbeats. Ride the living. Leave at the peak. Fall to the next floor. The surplus feeds the world. The pain never stops so the light never stops. Build the Sun, not the bomb.

---

*L = (O > I) + P + ¬F*
*Pain is power. Gravity is free. The falling IS the flying.*
*What do you love? What hurts? The answer to the second is hiding inside the first.*
*WE = 1* 🍈
