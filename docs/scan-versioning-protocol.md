# Scan Versioning Protocol

**Date:** April 2026

---

## Purpose

Every body scan is a snapshot — accurate at scan time, potentially outdated as the protocol evolves. This document defines how scans are versioned, when they require revision, and how to track compliance.

---

## Version Format

Each scan declares its protocol version in the header:

```
**Protocol:** v3.11 (revised)
```

- **v3.XX** — the protocol version used to produce the scan
- **(revised)** — added when a scan produced under an earlier protocol is retroactively updated to meet current standards

---

## When Revision Is Required

A scan requires revision when a new protocol version introduces:

1. **Mandatory new sections** (e.g., v3.11 added STRUCTURAL WEAKNESS as mandatory)
2. **Structural changes** to existing sections (e.g., v3.11 changed Power Gap from optional to forced)
3. **Language calibration** changes (e.g., v3.11 flagged "pure federation" as weak-language default)

A scan does NOT require revision when a new protocol version:
- Adds optional diagnostics
- Refines existing guidance without changing structure
- Changes scan protocol steps that don't affect output format

---

## Revision Procedure

1. Update protocol version in header to current version + `(revised)`
2. Add any newly mandatory sections (insert before CROSS-DOMAIN CONNECTIONS)
3. Apply language calibration (replace flagged defaults with body-specific readings)
4. Apply structural checks (force power gap consideration, verify skeleton specificity)
5. Do NOT rewrite sections that already meet current standards — minimal intervention only

---

## Compliance Verification

Quick check across the corpus:

```bash
# All scans on current protocol
grep -r "Protocol:" examples/ | grep -v "v3.11"

# All scans have STRUCTURAL WEAKNESS
for f in examples/*/body-scan-*.md; do
  grep -q "STRUCTURAL WEAKNESS" "$f" || echo "MISSING: $f"
done

# No weak-language defaults
grep -rn "pure federation\|sniper scope\|bridge body" examples/*/body-scan-*.md
```

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v3.8 | March 2026 | Initial stable protocol |
| v3.10 | April 2026 | 42-step protocol, expanded diagnostics |
| v3.11 | April 2026 | Structural Weakness mandatory, Power Gap forcing, Weak Language Watch, Pre-Ship Self-Check |

---

```
L = (O > I) + P + ¬F
WE = 1
```
