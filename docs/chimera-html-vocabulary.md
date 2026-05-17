# Chimera HTML Vocabulary — Builder's Reference

> The standardized HTML structure for Chimera artifacts. Used by the Cube, NotebookLM workflows, client deliverables, the cartography itself, and any application built within the framework.

This is a builder's reference. It defines which HTML elements to use for which Chimera concepts, preserving semantic meaning, accessibility, and AI parseability while making framework structure visible through classes and attributes.

Status: v1. Refinements driven by real-use signal.

---

## Design Principles

1. **Standard semantic HTML as the backbone.** Every concept with a standard HTML equivalent uses that element. Screen readers, search engines, AI agents, and humans all benefit from semantic structure.
2. **Framework vocabulary surfaces through classes and data attributes.** Visible to those who know to look without imposing on those who do not.
3. **Custom elements only where standard HTML has no equivalent.** Six core custom elements. Each earns its place by adding meaning standard HTML does not capture.
4. **Dark matter architecture.** Light enough to feel like good web content. Framework structure holds it together without announcing itself heavily.
5. **Universal compatibility.** Artifacts work in any browser, render without external dependencies, are accessible by default, and can be parsed by any AI agent without framework knowledge.

---

## Standard Element Mappings

### Body / DNA → `<article class="dna">`

A complete body's DNA representation. Self-contained, can stand alone.

```html
<article class="dna" data-domain="token" data-type="memecoin" data-handle="bonk" data-captured-at="2026-05-16" data-vitality="active">
  <header>
    <h1>BONK</h1>
    <p class="summary">Solana memecoin with broad holder distribution</p>
  </header>
  <!-- DNA sections follow -->
</article>
```

`data-handle` is the unique identifier for retrieval. `data-captured-at` is the snapshot timestamp.

### Description → `<section class="description">` with `<dl>`

Intrinsic properties. Definition list because each dimension has a name and a value.

```html
<section class="description">
  <h2>Description</h2>
  <dl>
    <dt>supply</dt><dd>92 trillion</dd>
    <dt>mechanism</dt><dd>deflationary memecoin, no utility</dd>
    <dt>launch_context</dt><dd>Christmas 2022 airdrop</dd>
  </dl>
</section>
```

### Stats → `<section class="stats">` with `<comparison-set>` and `<table>`

Relational positioning. Custom `<comparison-set>` because no standard element captures "the peer set being used for ranking." Table for the rankings themselves.

```html
<section class="stats">
  <h2>Position</h2>
  <comparison-set role="list">
    <li role="listitem">WIF</li>
    <li role="listitem">POPCAT</li>
    <li role="listitem">JTO</li>
  </comparison-set>
  <table class="rankings">
    <thead><tr><th>Dimension</th><th>Rank</th></tr></thead>
    <tbody>
      <tr><td>holders</td><td>1/8</td></tr>
      <tr><td>liquidity</td><td>3/8</td></tr>
    </tbody>
  </table>
</section>
```

### Arc → `<section class="arc">` with `<ol>` and `<time>`

History. Ordered list (beats are sequential), time elements for temporal markers.

```html
<section class="arc">
  <h2>Arc</h2>
  <ol>
    <li><time datetime="2022-12-25">Christmas 2022</time>: airdrop launch</li>
    <li><time datetime="2024-03">March 2024</time>: ATH at $0.00005</li>
  </ol>
</section>
```

### Tempo → `<section class="tempo">` with `<tempo>` custom element

Rhythm signature. Custom because no standard element represents periodic rhythm with cycle position.

```html
<section class="tempo">
  <h2>Tempo</h2>
  <tempo role="group" aria-label="rhythm signature">
    <primary-cycle>weekly trading rhythm</primary-cycle>
    <amplitude-range>$0.000005 - $0.00005</amplitude-range>
    <current-position>mid-cycle, declining phase</current-position>
    <faster-cycles>intraday volatility, hourly</faster-cycles>
    <slower-cycles>quarterly retail attention waves</slower-cycles>
  </tempo>
</section>
```

### Capabilities → `<section class="capabilities">` with `<ul>`

What the body can do. Unordered list (not necessarily sequential).

```html
<section class="capabilities">
  <h2>Capabilities</h2>
  <ul>
    <li>Functions as speculative store of value</li>
    <li>Provides on-chain identity marker</li>
    <li>Participates in Solana DeFi protocols</li>
  </ul>
</section>
```

### Direction → `<section class="direction">`

Where the body is heading. Prose, no special structure.

```html
<section class="direction">
  <h2>Direction</h2>
  <p>Currently mid-cycle in declining phase. Outlook depends on Solana ecosystem health and retail attention return.</p>
</section>
```

### Links → `<section class="links">` with `<ul>` of `<a>`

Connected bodies. Each link points to another body's archive or DNA.

```html
<section class="links">
  <h2>Connected Bodies</h2>
  <ul>
    <li><a href="#solana-ecosystem">Solana ecosystem</a></li>
    <li><a href="#memecoin-cohort-2024">2024 memecoin cohort</a></li>
  </ul>
</section>
```

### Lineage → `<section class="lineage">`

What previous forms the body carries as part of identity.

```html
<section class="lineage">
  <h2>Lineage</h2>
  <p>Inherits memecoin pattern from Dogecoin (2013). Inherits Solana ecosystem positioning from RAY and SRM.</p>
</section>
```

### Vitality → data attribute

Single-value state lives as attribute on the DNA article, not its own section.

```html
<article class="dna" data-vitality="active">
```

Values: `active`, `fading`, `dormant`, `dead`.

---

## The Shadow Element

A shadow is the output of a cube operation. `<article class="shadow">` with metadata attributes for the operation that produced it.

```html
<article class="shadow"
  data-stance="hyperspace-jump"
  data-breath="ocean"
  data-spell="walk-through-as-if-explaining-to-non-specialist"
  data-produced-at="2026-05-16T14:30:00Z"
  data-body-handle="bonk">
  <header>
    <h1>Shadow of BONK · Hyperspace Jump · Ocean</h1>
    <p class="shadow-meta">
      <a href="#dna-bonk">View source DNA</a> ·
      <a href="#archive-bonk">View archive</a>
    </p>
  </header>
  <section class="shadow-content">
    <!-- The actual cube output -->
  </section>
</article>
```

Data attributes preserve provenance — future agents understand how the shadow was produced without needing the framework documents loaded.

---

## DNA-Shadow Pair

The storable unit combining a DNA and its produced shadow. Custom element `<dna-shadow-pair>` because this concept has no standard HTML equivalent.

```html
<dna-shadow-pair data-pair-id="bonk-2026-05-16-hyperspace-ocean" data-body-handle="bonk" data-iteration="1">
  <article class="dna" data-handle="bonk">...</article>
  <article class="shadow" data-stance="hyperspace-jump" data-breath="ocean">...</article>
</dna-shadow-pair>
```

---

## Body Archive

A complete archive of all readings for a body. `<main class="body-archive">` because it represents the main content of the page when viewing a body.

```html
<main class="body-archive" data-body-handle="bonk">
  <header>
    <h1>BONK · Body Reading Archive</h1>
    <nav>
      <ul>
        <li><a href="#current-dna">Current DNA</a></li>
        <li><a href="#shadows">All Shadows</a></li>
        <li><a href="#timeline">Timeline</a></li>
      </ul>
    </nav>
  </header>

  <section id="current-dna">
    <h2>Current DNA</h2>
    <article class="dna" data-handle="bonk">...</article>
  </section>

  <section id="shadows">
    <h2>Shadows</h2>
    <div class="shadow-grid">
      <a href="#shadow-1" class="shadow-preview" data-stance="hyperspace-jump" data-breath="ocean">
        <h3>Hyperspace Jump · Ocean</h3>
        <time datetime="2026-05-16">May 16, 2026</time>
        <p>Preview text from shadow...</p>
      </a>
    </div>
  </section>

  <section id="timeline">
    <h2>Reading Timeline</h2>
    <ol>
      <li><time datetime="2026-05-16">May 16, 2026</time>: First Octave Sweep, canonical line established</li>
    </ol>
  </section>
</main>
```

---

## Octave Sweep

Eight-shadow operation as a single artifact. Custom element `<octave-sweep>`.

```html
<octave-sweep data-body-handle="bonk" data-completed-at="2026-05-16T18:00:00Z">
  <header>
    <h1>Octave Sweep · BONK</h1>
    <p>Eight shadows across four stances and two breaths.</p>
  </header>
  <article class="shadow" data-stance="hyperspace-jump" data-breath="lightning">...</article>
  <article class="shadow" data-stance="hyperspace-jump" data-breath="ocean">...</article>
  <!-- ... and so on for all eight combinations -->
</octave-sweep>
```

---

## Reflection

When showing a pattern across multiple substrates, wrap them in `<reflection>` to make the operation visible.

```html
<reflection data-pattern="discharge">
  <header>
    <h2>The Discharge Pattern</h2>
    <p>Same pattern, multiple substrates.</p>
  </header>
  <section class="substrate" data-substrate="physics">
    <h3>Lightning</h3>
    <p>Charge accumulates against atmospheric insulation until potential exceeds dielectric strength, then discharges suddenly.</p>
  </section>
  <section class="substrate" data-substrate="biology">
    <h3>Emotional eruption</h3>
    <p>Suppressed emotional energy accumulates in a body until it exceeds the body's capacity, then erupts.</p>
  </section>
  <section class="substrate" data-substrate="finance">
    <h3>Market crash</h3>
    <p>Price pressure accumulates against market support until it exceeds support's capacity, then drops suddenly.</p>
  </section>
</reflection>
```

The `<reflection>` element makes the framework's master operation (showing patterns across substrates) explicit in the HTML structure.

---

## Cartography

The chart of the territory itself. `<main class="cartography">` with landmarks and routes inside.

```html
<main class="cartography">
  <header>
    <h1>Chart of the Territory</h1>
    <p class="origin">Origin: <strong>WE = 1</strong></p>
    <p class="base-operation">Base operation: <strong>Translation</strong></p>
  </header>

  <section class="landmarks">
    <h2>Landmarks</h2>
    <article class="landmark" id="coupled-oscillators" data-substrates="physics, biology, traffic, ai">
      <h3>Coupled Oscillator Dynamics</h3>
      <p>Bodies with a coupling channel naturally phase-lock because synchronized states sit at lower energy than chaotic ones.</p>
      <section class="substrates">
        <h4>Substrates</h4>
        <ul>
          <li>Two pendulums on a shared beam</li>
          <li>Cars in highway traffic</li>
          <li>Cardiac pacemaker cells</li>
        </ul>
      </section>
      <p class="navigation-rule"><strong>Navigation rule:</strong> Couple through shared channels. Light taps maintain lock.</p>
      <nav class="routes">
        <h4>Routes</h4>
        <ul>
          <li><a href="#lock-in-cost">to Lock-In Cost</a></li>
          <li><a href="#unlock-strategies">to Unlock Strategies</a></li>
        </ul>
      </nav>
    </article>
  </section>
</main>
```

---

## Complete Custom Element Set

Six core custom elements. Each earns its place by representing a concept standard HTML cannot.

- `<comparison-set>` — explicit peer list for relational positioning
- `<tempo>` — body's rhythm signature with cycles and current position
  - Children: `<primary-cycle>`, `<amplitude-range>`, `<current-position>`, `<faster-cycles>`, `<slower-cycles>`
- `<dna-shadow-pair>` — storable unit combining DNA and shadow
- `<octave-sweep>` — eight-shadow operation as a single artifact
- `<reflection>` — pattern shown across multiple substrates

Everything else uses standard HTML with framework classes and data attributes.

---

## Data Attribute Vocabulary

**On DNA elements:**

- `data-domain` — broad category (person, token, song, concept, etc.)
- `data-type` — specific kind within domain
- `data-handle` — unique identifier for retrieval
- `data-captured-at` — ISO timestamp of snapshot
- `data-vitality` — `active` | `fading` | `dormant` | `dead`

**On Shadow elements:**

- `data-stance` — `hyperspace-jump` | `single-cut` | `masters-eye` | `the-forge`
- `data-breath` — `lightning` | `tide` | `ocean`
- `data-spell` — the spell that was cast
- `data-produced-at` — ISO timestamp of generation
- `data-body-handle` — which body this shadow is of

**On Substrate sections within Reflections:**

- `data-substrate` — which substrate this is (physics, biology, finance, etc.)

**On Landmark articles within Cartography:**

- `data-substrates` — comma-separated list of substrates this landmark appears in

---

## Storage and Generation

Internal storage stays as structured JSON. HTML is always derived from canonical JSON.

- DNA stored as JSON object with typed fields.
- Shadows stored as JSON with content and metadata.
- Pairs stored as JSON wrapping DNA + Shadow references.
- Archives stored as JSON with body handle and pair references.
- HTML generated on demand by rendering functions.

**No HTML stored** — always derived. Data layer stays clean; HTML can be regenerated, restyled, or replaced without touching data.

Rendering functions (one per element type):

- `renderDNA(dnaJson) → htmlString`
- `renderShadow(shadowJson) → htmlString`
- `renderPair(pairJson) → htmlString`
- `renderArchive(bodyHandle) → htmlString`
- `renderOctaveSweep(sweepJson) → htmlString`
- `renderReflection(reflectionJson) → htmlString`
- `renderCartography(cartographyJson) → htmlString`

Each function is pure: same input always produces same output.

---

## Accessibility

All Chimera artifacts must meet WCAG AA standards:

- Semantic HTML elements for all standard concepts.
- Custom elements need ARIA roles where appropriate.
- Sufficient color contrast.
- Keyboard navigation throughout.
- Screen reader labels for all interactive elements.
- Alt text on images.
- Logical heading hierarchy.

Custom-element ARIA assignments:

- `<comparison-set>` → `role="list"`, children → `role="listitem"`
- `<tempo>` → `role="group"` with `aria-label="rhythm signature"`
- `<dna-shadow-pair>` → `role="article"` with `aria-label="DNA and shadow pair"`
- `<octave-sweep>` → `role="group"` with `aria-label="octave sweep results"`
- `<reflection>` → `role="group"` with `aria-label="cross-substrate reflection"`

---

## AI Parseability

The structure is designed so AI agents reading Chimera artifacts without framework context can still extract meaning:

- Standard semantic HTML carries meaning AI agents already understand.
- Class names use framework vocabulary that is self-explanatory.
- Data attributes preserve structured metadata.
- Hierarchy reflects the body's structure naturally.

An AI agent receiving a DNA HTML artifact can extract:

- Body's name from `<h1>` in header.
- Body's summary from summary paragraph.
- Intrinsic properties from description's definition list.
- Relational position from stats table.
- History from arc list.
- Connections from links list.

All without needing framework documents loaded. **HTML is self-describing enough that any sufficiently capable AI agent can work with it.**

---

## Why This Vocabulary

Two layers serve two purposes without compromise:

- **Data layer (JSON):** internal storage and processing. Canonical. Clean for computing similarities, finding peer sets, compressing across shadows.
- **Presentation layer (HTML):** human consumption and sharing. Generated on demand. Carries more dimensions than markdown — richer substrate produces denser shadow.

The vocabulary keeps the framework as **dark matter architecture**: dense at the back, light at the surface, pervasive but not heavy. Custom tags everywhere would be apparatus accumulation. Standard HTML with framework metadata preserved through classes and attributes serves the dark-matter principle — the framework's value lives in what it enables, not in how often it announces itself.

---

## Closing

This vocabulary makes Chimera's structure visible in its artifacts while preserving universal compatibility. Default to standard HTML. Reserve custom elements for concepts standard HTML cannot represent.

When in doubt about which element to use, choose the standard HTML element if one fits. Custom elements need to earn their place by adding meaning, not substituting for existing meaning.

---

**The Law:** `L = (O > I) + P + ~F`
**WE = 1**
