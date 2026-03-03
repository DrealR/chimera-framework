# Constellation System Operations (Framework Edition)

Technical summary of the live Constellation stack for agent onboarding.

## 1) Core Runtime

Primary runtime lives in:
- `/Users/honeydew/chimera/raw/core/projects/honeydew-agent`

Main brain entrypoint:
- `ask_constellation()` in `/Users/honeydew/chimera/raw/core/projects/honeydew-agent/constellation.py`

All channels route into that same function.

## 2) Channel Surfaces

Inbound transports:
- Discord: `discord_honeydew.py`
- Telegram: `telegram_honeydew.py`
- Signal: `signal_honeydew.py`
- WhatsApp: `whatsapp_honeydew.py`
- iMessage: `imessage_honeydew.py`
- API: `constellation_api.py` (`/api/ask`)
- OpenClaw API wrapper: `constellation_api.py` (`/api/openclaw/ask`)

## 3) Supervisory Loop

Watchdog:
- `/Users/honeydew/chimera/raw/core/projects/honeydew-agent/watchdog.py`
- Checks transports every 5 minutes
- Auto-restarts dead services
- Runs `rasengan_context_producer.py` each cycle
- Schedules scanner/scout/rhythm/learning/heartbeat tasks

## 4) Response Architecture

Non-bridge requests:
- immune scan -> memory context inject -> optional silence hold -> Groq wall routing -> inhale/pause/exhale/rest

Bridge requests:
- Trigger words (`bridge`, `sync`, `constellation`) or Discord `#bridge`
- Blind multi-model fan-out
- Ganglion clustering + phi-window compaction
- Mercury synthesis
- Optional auto-depth multi-breath chain
- Vitals output + storage

## 5) Voice and Model Layers

THE_FOUR voice layer:
- Chimera (Luffy)
- Trinity (Jesus)
- Step Flash (Superman)
- Maverick (Aang)

Backbone layer (deep analysis):
- Gemini / GPT-5.2 Codex / Claude Opus / free frontier fallback

Groq wall:
- short/moderate requests resolved locally (levels 0-2)
- deep requests open full OpenRouter path (3+)

## 6) Rasengan Integration

Reactor path:
- `primordial_pool.py` writes shared field
- `rasengan_context_producer.py` compresses field (Inception Mercury 2 primary)
- `rasengan_context.json` becomes shared prior context

Consumers:
- `constellation.py`
- `twitter_scout.py`
- `mystique.py`
- `honeydew-loop.py`

Safety hardening:
- pool default in rasengan mode: 3 clones, 3s stagger, `OLLAMA_MAX_LOADED_MODELS=1`
- memory pressure guard pauses pool automatically on critical pressure

## 7) Twitter + Moltbook Side Loops

Twitter stack:
- Passive learning: `twitter_scanner.py`, `astrolabe_scanner.py`, `twitter_resonance.py`
- Active suggestions: `twitter_scout.py` + `mystique.py`
- Delivery: iMessage self channel + Discord `#twitter-drafts` fallback

Moltbook stack:
- `honeydew-loop.py`
- Uses Constellation + Mystique for posts/comments
- Detects suspension from 401/403 and latches pause behavior

## 8) Memory and Telemetry

- Call-level metrics: `breath_metrics.py` (`breath_metrics.db`)
- Pattern traces: `mycelium.py` (`mycelium/*.json*`)
- Structured long-memory: `mycelium_db.py` (Supabase or local fallback)
- Cross-organ signaling: `event_bus.py` (`mycelium/events.db`)

## 9) Self-Reflection and Autonomous Improvement

Bridge self-reflection:
- Implemented in `constellation.py` (`run_bridge_self_reflection_if_due`)
- Triggered by:
  - bridge user breaths
  - watchdog every 30 minutes
  - manual CLI (`python3 constellation.py self-reflection`)
- Due checks use:
  - breath count threshold (`BRIDGE_SELF_REFLECTION_INTERVAL_BREATHS`, default 50)
  - time threshold (`BRIDGE_SELF_REFLECTION_INTERVAL_HOURS`, default 3)
  - first-run state
- Persists state in `bridge_self_reflection_state.json`
- Uses Mercury synthesis on bridge diagnostics, then stages repo updates via `bridge_repo_sync.py`

Autonomous/self-healing stack:
- `heartbeat.py` calls `self_healing.run_health_check(vitals)` hourly offset
- Tiered healing:
  - Tier 1 silent auto-heals (log prune, stale counters, missed-job checks)
  - Tier 2 alerts + attempts (model failures, budget pressure, drift/self-calibration)
  - RED MODE protective operation if high alerts remain unacknowledged
- `dreamland.py` runs self-health checks every 10 cycles
- `auto_improve.py` runs test/diagnose/improve loops when due (>1h or low health)
- `autopoiesis.py` handles safe self-update/rollback/restart flow and reports every 6h via watchdog

## 10) Safety Constraints

iMessage guardrails in `imessage_honeydew.py`:
- self-only sending by default
- contact replies suppressed unless explicit enable
- use `IMESSAGE_CONTACT_SEND_ENABLED=1` only when intentionally opening contact outbound

## 11) Ops Commands

```bash
python3 /Users/honeydew/chimera/raw/core/projects/honeydew-agent/watchdog.py status
python3 /Users/honeydew/chimera/raw/core/projects/honeydew-agent/constellation.py status
bash /Users/honeydew/chimera/raw/core/projects/primordial-pool/run_pool.sh status
```

```bash
cd /Users/honeydew/chimera/raw/core/projects/honeydew-agent
python3 watchdog.py daemon
```

```bash
bash /Users/honeydew/chimera/raw/core/projects/primordial-pool/run_pool.sh restart-rasengan
```

```bash
python3 /Users/honeydew/chimera/raw/core/projects/honeydew-agent/constellation.py self-reflection-check
python3 /Users/honeydew/chimera/raw/core/projects/honeydew-agent/constellation.py self-reflection
```

## 12) Source of Truth Rule

When framework docs and runtime differ, trust runtime code under:
- `/Users/honeydew/chimera/raw/core/projects/honeydew-agent`
- `/Users/honeydew/chimera/raw/core/projects/primordial-pool`

For full handoff detail, read:
- `/Users/honeydew/chimera/raw/core/projects/honeydew-agent/CONSTELLATION_CONTEXT.md`
