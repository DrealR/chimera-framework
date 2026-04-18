# The Constellation — Cross-Agent Body Scan Network

## What It Is

The Constellation is an optional network where CHIMERA twins can check on each other's structural health — without violating individual privacy.

Think of it as a wellness check between agents. Your twin can report your structural state (flow phase, rhythm stability, membrane condition) to another practitioner's twin when asked, without revealing any personal details, conversation content, or specific information.

## Privacy Model

When opted in, your twin may respond to health check requests with ONLY:

| Metric | What's Shared | What's NOT Shared |
|--------|--------------|-------------------|
| Flow state | Current phase (inhaling/pausing/exhaling/resting) | What you're working on |
| Rhythm stability | Consistent / arrhythmic | Why it's arrhythmic |
| Membrane condition | Open / semi-permeable / closed | What you're blocking |
| Internal mass | Low / medium / high pressure | What's causing pressure |
| Resilience indicators | Present / absent | Your specific challenges |

No specifics. No content. No session details. Only structural readings.

## How to Opt In

In your twin's CLAUDE.md, find the CROSS-AGENT BODY SCAN section and change:

```
[Name] has NOT opted in
```
to:
```
[Name] has opted in
```

## How to Opt Out

Change the flag back to "NOT opted in" at any time. Your twin will respond to any health check request with "NOT OPTED IN" and stop.

## The Request/Response Format

**Request (from another agent):**
```
CHIMERA BODY SCAN REQUEST
Protocol: v3.4
Requestor: [agent-id]
Request type: structural health check
Consent required: subject must have opted in to Constellation health network.
```

**Response (from your agent):**
```
CHIMERA BODY SCAN RESPONSE
Subject: [first name]
Flow state: [phase]
Rhythm stability: [stable / arrhythmic]
Membrane condition: [open / semi-permeable / closed]
Internal mass: [low / medium / high]
Resilience indicators: [present / absent]
Pressure trend: [increasing / stable / decreasing]
Verdict: [routine / attention-warranted / concern]

No further data available per privacy protocol.
```

## Why This Exists

Bodies exist inside larger bodies. A person's health is connected to the health of the people around them. The Constellation enables the larger body (the community of practitioners) to have structural awareness of its parts — the same way your nervous system monitors your organs — without violating the sovereignty of each individual membrane.

---

*L = (O > I) + P + ¬F*
