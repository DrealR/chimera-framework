# Live Event Concentration

> **Origin:** July 2026 — streaming as temporary high-density attention zones (e.g. large concurrent streams leaking into X); conversation layer outlives chat; Field Tier-2 momentum fit; four-area expansion (tool, CHIMERA, event taxonomy, domain mirrors).
>
> **Date:** July 2026
>
> **Status:** graduated practice doc + Field design lock

---

## The claim

Some moments create **temporary high-density pockets of the present** in the attention field: major streams, sports, breaking news, cultural flashpoints. Many people focus on the same thing at the same time for a sustained window. Density spikes; then it decays.

> You do not have to *create* the concentration. You **read where it already exists** and participate in the conversation layer while it is dense.

On X, posts *about* a live event often **outlive** the event’s native surface (stream chat dies when the stream ends; tweets persist and can grow). That is the multi-scale ripple: event core → X talk → clips → culture.

**Metaphor lock:** fishing where the fish are schooling right now — not casting randomly across the whole ocean, not inventing a school from nothing.

---

## Stream / event dual layer

| Layer | Behavior |
|-------|----------|
| **Event core** (stream, game, live show) | Sustained concentration, short half-life |
| **Conversation layer** (X during/after) | Reactions, clips, takes — longer half-life |
| **Feedback** | X can influence the event; event moments seed X |

Planting on X **during** concentration is often higher leverage than only speaking inside ephemeral chat. Chat dies. Tweets live.

---

## Fit to Field filter hierarchy (locked)

This is **not** a new primary filter. It is a **strong Tier-2 density signal** inside the recency window.

| Tier | Filter | Role | Streaming / events |
|------|--------|------|--------------------|
| **1** | Extreme recency (15–45 min; default 30) | Hard gate — stay in the live layer | Non-negotiable foundation |
| **2** | Natural momentum + **live-event boost** | Where attention is unusually dense | Major streams/events are among the strongest signals here |
| **3** | Signatures + framework resonance | Quality + alignment polish | Apply *inside* high-density zones too |

**Practical implication:** When a major stream is live, related posts often already show stronger natural engagement *inside* the recency window. Field may lightly elevate keyword matches so you see that soil without replacing recency.

**Do not** turn Field into an event predictor. Treat live events as **observable density**, one class of fertile soil among others.

---

## Two complementary navigations

| Approach | What you read | Analogy |
|----------|---------------|---------|
| **Back end** | Metrics, ratios, signatures, momentum patterns on X | Water and fish activity through instruments |
| **Front end** | Live high-concentration events (streams, news, culture) | Seeing where the school is right now |

Both are valuable. Streaming insight strengthens the front end. Use both; don’t choose one.

---

## CHIMERA during high-density moments

When the field is already loud and responsive, operators get more precise — and more necessary:

| Law | During density |
|-----|----------------|
| **O > I** | Space is already rich with attention. *Am I adding coherence, or just noise to a loud room?* |
| **P** | Moments move fast. Check: *clarity, or just riding the energy?* |
| **¬F** | Momentum is already strong. Tight narrative control often backfires. Plant lightly; step back. |
| **WE = 1** | Participate in the shared present without dominating it or vanishing into it. |

**Pre-plant prompt (Field, optional during events):**

> This moment has strong momentum. Before you plant: are you adding something real, or just reacting to the energy?

That turns high-density windows into **active CHIMERA practice**, not only optimization.

---

## Event taxonomy (other high-concentration types)

Streaming is one of the strongest signals — not the only one.

| Type | Examples | Character | Signal strength |
|------|----------|-----------|-----------------|
| **Live cultural / sports** | World Cup, fights, awards, big concerts | Sustained concurrent attention | Very strong |
| **Major streams** | Big streamer + event (e.g. match watch parties) | Sustained concentration; loyal + casual mix | Very strong |
| **Breaking news / crisis** | Politics, disasters, viral controversies | Sudden spike + sustained talk | Strong (chaotic) |
| **Product launches / drops** | Hardware, games, crypto | Concentrated hype, short | Strong, short-lived |
| **Viral moments / memes** | Something suddenly blowing up | Fast, unpredictable | Medium–strong |
| **Creator-specific events** | Collabs, drama, milestones | Loyal niche density | Strong in niche |
| **Political / cultural flashpoints** | Debates, scandals, movements | High charge, sustained | Strong, noisier |

**Discernment:** Not all density is generative. Some windows are creative/discussion-heavy; others are reactive pile-ons. Pause before treating every spike as fertile soil.

---

## Philosophical mirrors (same five moves)

Core pattern across domains:

1. Literacy — read where energy currently is  
2. Position — place yourself in fertile zones  
3. Contribute — substance, not noise  
4. Release — non-interference after plant  
5. Learn — multi-scale feedback  

| Domain | High-density read | Your move | ¬F note |
|--------|-------------------|-----------|---------|
| **Fishing** | School gathered in one area | Cast near the school; let the line sit | Don’t yank every nibble |
| **Markets** | Liquidity / volume surge | Position during activity | Don’t micromanage every tick |
| **Ecology / permaculture** | Seasonal fertile zone (flood soil) | Plant in fertility, not barren force | Let the ecosystem respond |
| **Martial / flow** | Opponent’s energy committed and readable | Time action with their movement | Yield/redirect > dominate |
| **City / social** | Event or square filled with people | Be present while energy is high | Contribute without owning the crowd |
| **X / Field** | Stream or flashpoint leaking into tweets | Light plant in recency window | Don’t manage every reply |

X is a **fast training ground** for the same skill everywhere else.

---

## Field tool: live event awareness

### Already in MVP (`hub/projects/field`)

- Manual **live event notes** (comma/space keywords: streamer, match, topic)  
- Matching posts get a **light** momentum + resonance boost **after** the recency gate  
- Badge: `live event` in tier notes  
- CHIMERA pre/post plant prompts available globally  

### Spec for Frankie (Tier-2 event boost — keep calm)

```text
HARD: recency window (Tier 1) — never bypass
SOFT: if post text/topics match active event keywords →
      small boost to momentum score (and optional resonance)
NOT: hard filter that hides non-event posts
NOT: aggressive push / FOMO loops / auto-post
```

| Mode | Behavior |
|------|----------|
| **Manual notes (now)** | Operator types active events; Field boosts matches |
| **During high-density mode (near)** | UI copy: “Major density window — here are matching recent posts” |
| **Auto awareness (later)** | Optional feed of major streams/news → keyword list; still light boost only |

**Why this fits:** reading existing concentration, not predicting virality; calm, non-addictive; supports positioned planting + non-interference.

### Logging (phase 1+)

Tag plants made during concentration windows for multi-scale observation (stream → X → later ripples).

---

## Operator practice (live test)

1. Notice a high-concentration window (stream, news, game)  
2. Open Field on a tight recency window (15–30m)  
3. Set live-event keywords for that window  
4. Momentum + event boost surfaces related live talk  
5. Pre-plant: real add vs reaction?  
6. Plant once with integrity  
7. Non-interfere — let stream + X compound  

**Test case archetype:** large concurrent stream (e.g. sports watch party) → X reactions in the last 15–45 minutes → plant or pass.

---

## Firewalls

- Not all density is healthy (pile-on, outrage farms)  
- Event FOMO is forced convergence — Pause  
- Don’t abandon non-event literacy; ordinary fresh conversations still matter  
- Front-end event chasing without back-end signature literacy is incomplete  
- Heavy management during density often feels forced because momentum is already strong  

---

## See also

- [Real-Time Attention Layer](real-time-attention-layer.md)  
- [Living Magnet and Resonance Pools](living-magnet-and-resonance-pools.md)  
- [Attention Metric Signatures](attention-metric-signatures.md)  
- [Positioned Planting and Non-Interference](positioned-planting-and-non-interference.md)  
- [Multi-Scale Information Ecology](multi-scale-information-ecology.md)  
- [Genuine Live-Layer Participation](genuine-live-layer-participation.md)  
- [Field Literacy Across Domains](field-literacy-across-domains.md)  
- [Attention Trees and Secondary Attractors](attention-trees-and-secondary-attractors.md)  

```text
L = (O > I) + P + ¬F
WE = 1
```
