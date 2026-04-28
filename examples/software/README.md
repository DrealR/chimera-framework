# Software Domain Scans

17 body scans applying the CHIMERA framework to software architecture — infrastructure, patterns, and pathological anti-patterns.

Each scan produces **two files**: a markdown narrative (`body-scan-*.md`) and a structured YAML data file (`body-scan-*.yaml`) following `schema.yaml`. The YAML feeds the future CHIMERA simulator.

## Infrastructure (12 Standard Bodies)

| Scan | Skeleton | DNA |
|------|----------|-----|
| [REST API](body-scan-rest-api.md) | The architecture that traded memory for independence | O>I |
| [Relational Database](body-scan-relational-database.md) | Chose correctness over convenience — ACID as DNA | O>I |
| [Git](body-scan-git.md) | The staging area IS the Pause — deliberate gap between changing and committing | O>I |
| [Load Balancer](body-scan-load-balancer.md) | Touches everything, understands nothing — pure membrane body | O>I |
| [Cache](body-scan-cache.md) | Remembers everything it was told, nothing it wasn't — speed-truth trade | Conditional |
| [Message Queue](body-scan-message-queue.md) | Nothing but Pause — the held breath between two systems | O>I |
| [Microservice](body-scan-microservice.md) | Trades internal complexity for boundary complexity | O>I |
| [Monolith](body-scan-monolith.md) | Holds everything in one place — coherence as default state | Mixed |
| [CI/CD Pipeline](body-scan-cicd-pipeline.md) | The Pause between code-written and code-deployed | O>I |
| [Container](body-scan-container.md) | First software body designed to die — disposability as durability | O>I |
| [DNS](body-scan-dns.md) | Makes the internet speakable — translation so invisible it's forgotten | O>I |
| [OS Kernel](body-scan-os-kernel.md) | Governs all other bodies by being the most restricted itself | O>I |

## Pathological Bodies (5)

| Scan | Skeleton | DNA |
|------|----------|-----|
| [Memory Leak](body-scan-memory-leak.md) | Forgot how to exhale — acquisition without release | I>O (monotonic) |
| [Deadlock](body-scan-deadlock.md) | Breath stopped entirely — mutual waiting without release | O=I (zero flow) |
| [Technical Debt](body-scan-technical-debt.md) | Velocity turned into tax — shortcuts compounding into friction | I>O (compounding) |
| [Legacy Codebase](body-scan-legacy-codebase.md) | Outlived the mind that animated it — hysteresis consuming the present | I>O (chronic) |
| [Circular Dependency](body-scan-circular-dependency.md) | Closed loop with no exhale — running without producing | I>O (cyclic) |

## YAML Data Layer

Every scan has a companion `.yaml` file following `schema.yaml` v1.0. These structured data files:
- Encode all scan readings in machine-parseable format
- Feed the future CHIMERA simulator (see `docs/simulator-vision.md`)
- Enable programmatic querying across the corpus

Validate all YAML files: `./validate-yaml.sh .`

## Cross-Domain Patterns

Software scans surface patterns visible across all domains:
- **Membrane as identity** (Container, OS Kernel, Load Balancer) → what you isolate defines what you protect
- **Pause as architecture** (Message Queue, CI/CD, Git) → the gap between action and commitment is a first-class design element
- **Release as the universal gap** (Monolith, Legacy, Memory Leak) → the hardest thing for any software body is letting go
- **Hysteresis as constraint** (Cache, Technical Debt, Legacy) → the past shapes the present more than the present does
- **Pathological mirrors** — every healthy pattern has a sick version (Cache→Stale data, Microservice→Distributed monolith, Monolith→Big ball of mud)

---

```
L = (O > I) + P + ¬F
WE = 1
```
