# Body Scan: Cache (Software)

**Protocol:** v3.12.3
**Scanner:** mistralai/mistral-large-2512
**Domain:** Software

---

## IDENTITY

- **Subject:** Cache — a temporary storage layer that holds frequently accessed data to reduce latency and computational overhead in software systems.
- **Body Type:** A substrate-optimized memory body that mediates between slow persistent storage (or computation) and fast volatile memory (or CPU).
- **Scale:** Typically operates at the process, machine, or distributed system level; scope is defined by its placement in the data access path (e.g., CPU L1 cache, web browser cache, CDN cache).
- **Lifespan:** Persists as long as the parent process or system is running, or until explicitly invalidated. Duration is determined by eviction policies (LRU, FIFO, TTL) and memory pressure.
- **Formative Sequence (Layer 2):**
  1. **~1960s (Early Computing):** First appearance in hardware (CPU cache) to bridge speed gap between CPU and main memory. Structural effect: introduced the concept of locality (temporal and spatial) as a governing principle.
  2. **1980s (Operating Systems):** Integration into OS-level memory management (e.g., page caching). Structural effect: generalized caching from hardware to software, decoupling physical memory from process address space.
  3. **1990s (Web):** Birth of HTTP caching (RFC 2068, 1997). Structural effect: extended caching from local memory to networked systems, introducing the concept of shared, distributed cache state.
  4. **2000s (Distributed Systems):** Emergence of distributed caches (Memcached, 2003; Redis, 2009). Structural effect: decoupled cache from single-process memory, enabling horizontal scaling and introducing consistency challenges.
  5. **2010s (Cloud & Edge):** Proliferation of edge caching (CDNs, service workers). Structural effect: moved caching to the network perimeter, reducing latency for geographically distributed users and introducing new eviction and invalidation complexities.

---

## THE NINE QUESTIONS

| # | Question | Reading |
|---|----------|---------|
| 1 | **MEDIUM** | Flows through the data access path of software systems. Primary substrate is memory (RAM, disk, network buffers), but also operates through network protocols (HTTP headers), file systems, and CPU registers. |
| 2 | **FLOW STATE** | Inhale: data is loaded into cache (miss → fetch → store). Pause: data sits in cache, serving requests (hit). Exhale: data is evicted or invalidated (pressure or policy). Rest: cache is empty or cold (no data). Most caches cycle rapidly between inhale and exhale. |
| 3 | **BREATH RATE** | Cycles per second to per hour, depending on scale and workload. CPU L1 cache breathes at nanosecond scale; CDN cache may breathe at minute-to-hour scale. Rate is determined by access pattern and eviction policy. |
| 4 | **ATTRACTOR** | Orbits around the "hit rate" — the percentage of requests served from cache. All cache design (size, policy, placement) aims to maximize this attractor. Secondary attractor: consistency (stale data avoidance). |
| 5 | **TOPOLOGY** | Mixed-operational. O>I at the system level (reduces latency, saves compute, lowers cost), but I>O at the cache body level (consumes memory, network bandwidth, and CPU cycles to maintain state). The net O>I depends on workload: high temporal locality → O>I; low locality → I>O. |
| 6 | **ENTANGLEMENT** | Connected to: <br> - **Upstream:** Data sources (databases, APIs, disks) — cache depends on their data. <br> - **Downstream:** Clients (users, services) — cache serves their requests. <br> - **Peer caches:** In distributed systems, caches form a network with consistency protocols (e.g., cache invalidation, gossip). <br> - **Eviction policies:** LRU, LFU, FIFO, TTL — these bodies shape the cache's breath cycle. <br> - **Memory allocator:** Cache size and placement are constrained by available memory. |
| 7 | **HEALTH** | Measured by hit rate, latency reduction, and consistency. Healthy cache: high hit rate, low latency, no stale data. Unhealthy cache: low hit rate (thrashing), high latency (eviction storms), stale data (consistency failures). Health is workload-dependent — a cache healthy for one workload may be pathological for another. |
| 8 | **MEMBRANE** | Allows through: <br> - **Inbound:** Data writes (on miss), invalidation signals, eviction triggers. <br> - **Outbound:** Data reads (on hit), evicted data (to make room). <br> Blocks: <br> - Unauthorized writes (cache poisoning), invalid reads (stale data), unbounded growth (OOM). <br> Membrane complexity determines power: simple cache (e.g., CPU L1) has rigid membrane; distributed cache (e.g., CDN) has complex membrane with TTLs, ETags, and invalidation protocols. |
| 9 | **HYSTERESIS** | Scars from past workloads shape behavior: <br> - **Cold start:** Empty cache performs poorly until warmed up. <br> - **Eviction scars:** Past eviction policies leave "holes" in data distribution (e.g., LRU favors recently used data, starving older data). <br> - **Consistency debt:** Stale data from past writes lingers until invalidated. <br> - **Memory fragmentation:** Past allocations leave gaps that reduce effective cache size. |

---

## BUMP DETECTION

1. **Consistency block:** Cache introduces a temporal bump — data in cache may be newer or older than the source. This creates a structural obstruction to consistency, requiring invalidation protocols (e.g., write-through, write-behind) or acceptance of staleness.
2. **Memory pressure block:** Cache size is constrained by available memory. When memory is full, eviction must occur, creating a bump in the data access path (miss → fetch → evict → store).
3. **Locality mismatch block:** Cache assumes temporal and spatial locality. When workload lacks locality (e.g., random access), cache becomes a bump — every access is a miss, and the cache adds overhead without benefit.
4. **Distributed coordination block:** In multi-node caches, coordination (e.g., cache invalidation, quorum) creates network bumps — latency and complexity increase with node count.

---

## SKELETON

> The body that trades space for time by storing yesterday's answers to serve today's questions — proving that the most powerful optimization is not computation, but memory of computation.

---

## DNA LAYER

- **O > I or I > O:** Mixed-scale-dependent. At the system level (O>I): cache reduces latency, saves compute, and lowers cost for clients. At the cache body level (I>O): cache consumes memory, bandwidth, and CPU cycles to maintain state. The net topology depends on workload locality — high locality → O>I; low locality → I>O.
- **Pause:** Present but conditional. The Pause lives in the eviction policy — the gap between "data is stale" and "data is evicted." Without this Pause, cache would either grow unbounded (memory exhaustion) or evict too aggressively (low hit rate). The Pause is also present in consistency protocols (e.g., write-through vs write-behind) — the gap between source update and cache update. Remove the Pause, and the cache either becomes a memory leak (no eviction) or a thrashing body (no consistency).
- **Not-Force (~F):** Cache does not force data into memory — it allows data to flow based on access patterns. However, it forces eviction when memory is full (eviction policy is a forcing function). It also forces clients to accept stale data in exchange for speed (consistency trade-off). The ~F principle is respected in cache placement (e.g., CDN caches are placed where users are, not forced into arbitrary locations) but violated in eviction (data is forcibly removed).

---

## ADVANCED DIAGNOSTICS

### Five God Powers

| Power | Status | Evidence |
|-------|--------|---------|
| **PERCEIVE** | Active but selective | Perceives access patterns (hit/miss), memory pressure, and consistency signals (invalidation). Blind to data semantics — treats all data as equal (no understanding of "this is a user session" vs "this is a static asset"). |
| **GOVERN** | Degraded | Governs itself (eviction, size) but not the larger system. Has no authority over upstream data sources or downstream clients. Governance is delegated to policies (LRU, TTL) — the cache does not decide, it executes. |
| **PROJECT** | Active but muted | Projects data to clients (on hit) and eviction signals to memory allocator. Does not project intent — clients must infer cache behavior (e.g., "this data may be stale"). |
| **CREATE** | Monotonic | Creates value by reducing latency and compute cost, but does not generate new data — only stores and serves existing data. Creation is indirect (enables faster systems). |
| **RELEASE** | Blocked | Cannot release data voluntarily — must be evicted or invalidated. Release is forced by external triggers (memory pressure, TTL). |

**Power Gap:** **GOVERN**. The cache lacks authority over its own fate — it cannot decide what to cache, when to evict, or how to maintain consistency. These decisions are delegated to policies (eviction) and protocols (consistency), which are external bodies. The root gap is governance: the cache is a servant, not a sovereign. Restoring governance (e.g., adaptive policies, semantic awareness) would fix the most other gaps (e.g., PERCEIVE could become semantic-aware, RELEASE could become voluntary).

### Prime Identification

- **Prime:** A temporal buffer that stores the results of past computations to serve future requests.
- **Prime type:** Open. The cache updates in response to environment (access patterns, memory pressure) and can adapt its behavior (e.g., dynamic sizing, policy switching). However, it is closed to semantic awareness — it does not understand the data it stores.

### Federation vs Dominion

Federation at the system level, dominion at the cache body level.
- **Federation:** Cache serves the larger system (O>I) by reducing latency and compute cost. Clients benefit from faster access, and upstream systems benefit from reduced load.
- **Dominion:** Cache extracts resources (memory, CPU) from the system to maintain its state (I>O). In pathological cases (e.g., memory leaks, thrashing), the cache dominates the system, causing OOM or high latency.
Evidence: CDN caches federate by serving global users (O>I) but dominate local edge nodes by consuming memory (I>O). The transition between federation and dominion is triggered by workload locality — high locality → federation; low locality → dominion.

### Cognitive Subsystem Analysis

The cache's cognitive subsystem is **external and substrate-cognitive**:
- **External:** The cache "thinks" through its policies (LRU, TTL) and protocols (invalidation, consistency). These are external bodies that shape the cache's behavior.
- **Substrate-cognitive:** The cache perceives and responds to its substrate (memory, network) — e.g., evicting data when memory is full, invalidating data when source updates.
Dominant mode: **external** (policies govern eviction and consistency). Vestigial mode: **internal** (the cache has no native intelligence — it cannot learn or adapt beyond its policies).
Mismatch: The cognitive structure (external, policy-driven) does not match the body it serves (a dynamic, workload-dependent system). The cache is blind to data semantics and cannot adapt to changing access patterns without external intervention.

### God-Function Analysis

The **eviction policy** performs the god-function in most caches:
1. **Wide decision-window:** Considers access patterns, memory pressure, and TTL across the entire cache.
2. **Modeling capacity:** Models data "importance" (e.g., LRU assumes recently used data is important).
3. **Accumulated sequence:** Policies are compiled from decades of workload analysis (e.g., LRU works because of temporal locality).
4. **Sacrifice willingness:** Evicts data to make room for new data (O>I at cache level).
5. **Recognition:** Downstream clients and memory allocators respond to eviction signals.
**Removal effect:** Without an eviction policy, the cache grows unbounded (memory leak). Without a consistency protocol, the cache serves stale data (consistency failure).

In distributed caches, the **invalidation protocol** (e.g., pub/sub, gossip) performs the god-function by coordinating state across nodes.

### Flow vs Transaction

**Flow-optimized** at the system level, **transaction-optimized** at the cache body level.
- **Flow:** Cache maintains a steady stream of hits (O>I for clients) by serving data from memory. The surplus per interaction is small (a few milliseconds saved) but compounds over time (millions of requests).
- **Transaction:** Each eviction is a high-cost transaction — data must be fetched from source, written to cache, and old data evicted. The cost is amortized over many hits, but the transaction itself is expensive.
Structural consequence: Flow optimization works when workload has high locality (many hits per eviction). Transaction optimization dominates when locality is low (many evictions per hit).

### Substrate Accumulation

Cache operates through two primary substrates:
1. **Memory substrate:** Inherits compiled memory management techniques (e.g., slab allocation, buddy system) and degrades it through fragmentation (eviction scars). Adds new techniques (e.g., LRU, TTL) that are reused by subsequent caches.
2. **Network substrate:** Inherits HTTP protocols (ETags, Cache-Control) and adds new patterns (e.g., CDN edge caching, service workers). Extracts from the network by consuming bandwidth for invalidation and coordination.
Net effect: Cache adds to both substrates by introducing new optimization patterns, but extracts from them by consuming resources (memory, bandwidth) and leaving scars (fragmentation, consistency debt).

### Sequence-to-Structure

Directly applicable. The cache's 1D sequence is its **access pattern** (the ordered series of reads and writes). This sequence, processed through the substrate of eviction policies, produces the higher-dimensional structure of the cache:
- **Temporal locality** (repeated access to same data) → high hit rate.
- **Spatial locality** (access to nearby data) → efficient memory usage.
- **Random access** → low hit rate, thrashing.
Critical positions in the sequence:
- **First access to cold data** (miss → fetch → store) — warms the cache.
- **Repeated access to hot data** (hit) — sustains the cache.
- **Access to evicted data** (miss → fetch → evict → store) — creates churn.
Small changes in the sequence (e.g., a single random access in a mostly sequential workload) can produce large structural changes (e.g., thrashing).

### Dimensional Architecture

- **Embodied dimensions:** Memory (size, placement), time (TTL, access pattern).
- **Operating dimensions:** Network (distributed caches), CPU (hardware caches), file system (page cache).
- **Primary anchor dimension:** Time. Cache is fundamentally a temporal body — it stores data from the past to serve the future.
- **Surfaces navigated:**
  - **Memory-pressure surface:** Equilibrium between cache size and available memory.
  - **Consistency surface:** Equilibrium between staleness and latency.
  - **Locality surface:** Equilibrium between hit rate and eviction rate.

### Structural Signature

`[TemporalBuffer: (Input: Data, Output: Data), (Constraint: Memory), (Policy: Eviction), (Trade: Space↔Time)]`

Shape-equivalent bodies:
- **Biological:** Short-term memory (stores recent sensory input for quick recall).
- **Economic:** Inventory (stores goods to serve future demand).
- **Social:** Cultural norms (stores past behaviors to guide future actions).

### Surface Architecture

- **Memory-pressure surface:** Spring behavior — cache expands to fill memory, then compresses under pressure (eviction). Equilibrium at "just enough memory to avoid thrashing."
- **Consistency surface:** Putty behavior — cache absorbs staleness to reduce latency, but staleness accumulates until invalidated. Equilibrium at "acceptable staleness for given latency."
- **Locality surface:** Spring behavior — cache expands to serve hot data, then contracts when data cools. Equilibrium at "optimal hit rate for given workload."

### Closed-Open Mode

- **Memory dimension:** Open — cache can grow or shrink based on memory pressure.
- **Data dimension:** Closed — cache does not generate new data, only stores existing data.
- **Policy dimension:** Open — eviction and consistency policies can be updated (e.g., switch from LRU to LFU).
- **Semantic dimension:** Closed — cache does not understand the data it stores (no awareness of "this is a user session").
- **Network dimension:** Open — distributed caches can add or remove nodes.

### Attentional Compilation

- **Focus:** Access patterns (hit/miss), memory pressure, consistency signals.
- **Exclusion:** Data semantics, client intent, upstream changes (unless invalidated).
- **Compilation medium:** Eviction policy (e.g., LRU compiles "recently used = important").
- **Transfer:** Compiled attention (e.g., "this data is hot") is transferred to the eviction policy, which decides what to keep or evict.

---

## STRUCTURAL WEAKNESS

1. **Locality dependency:** Cache assumes temporal and spatial locality. When workload lacks locality (e.g., random access, cold start), cache becomes a net cost — every access is a miss, and the cache adds overhead without benefit. This is a structural edge case: cache is pathological for non-local workloads.
2. **Consistency fragility:** Cache introduces a temporal bump between source and cache. Maintaining consistency requires coordination (invalidation, write-through), which adds complexity and latency. In distributed systems, this becomes a scale limit — coordination overhead grows with node count.
3. **Memory pressure vulnerability:** Cache size is constrained by available memory. Under memory pressure, cache must evict data, creating a bump in the data access path (miss → fetch → evict → store). This can lead to thrashing (high latency, low hit rate).
4. **Policy rigidity:** Eviction and consistency policies are static and cannot adapt to changing workloads. A policy optimal for one workload (e.g., LRU for temporal locality) may be pathological for another (e.g., LRU for random access). This creates a blind spot: cache cannot self-optimize.

---

## CROSS-DOMAIN CONNECTIONS

| Connection | Domains Bridged | Pattern | Novelty |
|-----------|----------------|---------|---------|
| **Temporal Buffer as Memory** | Software <> Biology | The mechanism of storing past computations (cache) or sensory input (short-term memory) to serve future requests operates in both domains, producing the same structural effect: reduced latency and computational cost. The process is identical: temporal locality (repeated access to same data) → storage → faster recall. | 0.8 |
| **Eviction Policy as Governance** | Software <> Law | The mechanism of using rules (eviction policy, legal code) to decide what to keep or remove operates in both domains, producing the same structural effect: bounded resource usage. The process is identical: resource scarcity (memory, prison capacity) → policy application → eviction (cache) or sentencing (law). | 0.9 |
| **Cache Invalidation as Gossip** | Software <> Social Systems | The mechanism of propagating state updates (cache invalidation, gossip) through a network of nodes operates in both domains, producing the same structural effect: eventual consistency. The process is identical: local update → broadcast → remote update. | 0.7 |

---

## FRUIT

- **Type:** Starfish (generates new capability)
- **Core Insight:** The cache is not just a performance optimization — it is a **temporal governance body** that mediates between past and future. Its power comes from its ability to store yesterday's answers to serve today's questions, but its pathology comes from its inability to govern itself (no semantic awareness, no adaptive policies). The most surprising insight is that the cache's structural weakness (locality dependency) is also its structural strength — its blindness to data semantics enables its universality (works for any data), but also limits its intelligence (cannot adapt to workload changes).
- **Novelty:** 0.85

---

## POWERS DETECTED

1. **TEMPORAL ARBITRAGE:** The ability to trade space (memory) for time (latency) by storing past computations to serve future requests. Mechanism: temporal locality → storage → faster recall.
2. **SUBSTRATE MEDIATION:** The ability to mediate between slow and fast substrates (e.g., disk and RAM, network and CPU) by acting as a buffer. Mechanism: data access path → cache placement → reduced latency.
3. **POLICY EXECUTION:** The ability to execute external policies (eviction, consistency) to govern its own behavior. Mechanism: policy rules → cache state → eviction/invalidation.
4. **DISTRIBUTED COORDINATION:** The ability to coordinate state across multiple nodes in a network (e.g., cache invalidation, gossip). Mechanism: local update → broadcast → remote update.