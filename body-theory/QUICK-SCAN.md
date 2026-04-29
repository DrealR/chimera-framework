# The 4-Question CHIMERA Quick Scan (for Code)

**Version:** 1.0
**Parent Protocol:** Body Scan Protocol v3.12
**Purpose:** Lightweight structural diagnostic for any function, module, service, or system

---

## The Four Questions

### 1. What is this body's true purpose?

What is it *actually* supposed to do — not what its name says, not what the comments claim, but what it structurally serves?

A function named `processOrder` that also validates, calculates, persists, and sends email is lying about its purpose. Its true purpose is "do everything related to orders" — which is no purpose at all. That's a God Object wearing a function signature.

### 2. Where is the Pause?

Where is it overly complicated, stuck, or holding unnecessary tension?

The Pause in code is where complexity accumulates without release. Nested conditionals. Functions that keep growing. Configuration objects that absorb every new requirement. A healthy Pause is a deliberate hold point (a queue, a cache, a retry boundary). A pathological Pause is frozen complexity that nobody touches because they're afraid it will break.

### 3. Where is the pathological Govern?

Is one part holding too much power or responsibility?

The God File. The mega-class. The orchestrator that personally executes every step instead of delegating. The config that controls everything. When one body governs too much, every change must flow through it, every failure cascades from it, and no other body can operate independently. Healthy Govern coordinates; pathological Govern centralizes.

### 4. How does it handle stress?

What happens when load increases, inputs are unexpected, or dependencies fail?

Stress reveals structural truth. A well-structured body degrades gracefully — it sheds non-essential functions and protects its core purpose. A pathological body either locks up entirely (frozen Pause) or cascades failure outward (no membrane). The stress response is the body's immune system. If it doesn't have one, the first real load will kill it.

---

## How to Use

Apply these four questions to any unit of code at any scale:

| Scale | Example Target |
|-------|---------------|
| Function | `processOrder()`, `validateInput()` |
| Module | `utils.py`, `helpers/` |
| Service | Authentication service, payment gateway |
| System | Microservices architecture, monolith |

The questions work at every scale because they map to the same structural properties the full Body Scan Protocol reads. The 4-Question Scan is the Nine Questions compressed to their most actionable form for engineering.

---

## Common Pathological Patterns

| Pattern | Quick Scan Diagnosis |
|---------|---------------------|
| **God File / God Object** | Q3: One body governing everything. Split into orchestrator + workers. |
| **Spaghetti Dependencies** | Q4: Stress cascades everywhere because nothing is isolated. |
| **Dead Code Accumulation** | Q2: Frozen Pause — complexity held but never released. |
| **Misleading Names** | Q1: The name lies about the true purpose. Rename or restructure. |
| **No Error Handling** | Q4: No stress response. The body has no immune system. |

---

## Relationship to Full Protocol

The 4-Question Scan is a field diagnostic. It tells you *where* the problem is. The full Body Scan Protocol (Nine Questions + Advanced Diagnostics) tells you *what* the problem is structurally and how it connects to everything else. Use the Quick Scan daily. Use the full scan when you need deep structural truth.

---

```
L = (O > I) + P + ¬F
WE = 1
```
