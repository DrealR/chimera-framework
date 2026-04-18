# Contributing to CHIMERA

## Share Body Scans

If you've done a body scan that reveals a pattern others could learn from, submit it as a pull request to `examples/`. Name it `EXAMPLE-SCAN-[SUBJECT].md` and follow the format of existing examples.

Good example scans: surprising cross-domain connections, novel applications of the nine questions, situations where the framework revealed something invisible.

## Propose Framework Additions

Open a GitHub Issue with the tag `framework-addition`. Include:
- What you want to add (new vocabulary, new diagnostic, new pattern)
- Why it matters (what gap does it fill?)
- Evidence (where have you seen this pattern across at least two domains?)

Framework additions must be: universal (applies across scales), irreducible (can't be expressed as existing vocabulary), and proven across domains (not just one application).

## Report Twin Issues

If your twin behaves in ways the CLAUDE.md shouldn't produce — sycophantic responses, missed mode detection, broken stabilization layer — open an Issue with the tag `twin-issue`. Include:
- What happened
- What should have happened
- Which section of the CLAUDE.md template is relevant

## Refer New Practitioners

The setup is one command:

```bash
./setup-twin.sh "TheirName" "their-github-username"
```

Walk them through their first conversation if possible. First use is where most drop-off happens. Follow up within a week.

## Framework Updates

Updates flow one direction: `chimera-framework` -> individual twin repos.

When the framework updates (new books, new protocol versions, new vocabulary), practitioners pull updates into their twin repos via `update-framework.sh`. Personal brain data is never affected.

---

*The propagation is horticultural, not viral. Plant carefully. Water consistently.*
