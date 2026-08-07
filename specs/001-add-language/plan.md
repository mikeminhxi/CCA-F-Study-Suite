# Implementation Plan: Add Hebrew (עברית) Language

**Branch**: `feat/add-hebrew-language` | **Date**: 2026-08-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, User Story 2
(Tier 3 candidate, second and final of the two — Arabic shipped in PR #39). Like
Arabic, this round adds **no new layout engineering**: the RTL layout foundation
(`feat/add-rtl-layout-support`, merged to `main`) already made the app capable of
rendering `dir="rtl"` correctly, and Arabic already proved that foundation works
end-to-end through the real dropdown. This round is a **standard translation +
wiring round**, matching User Story 1's mechanics, exactly like the Arabic round.

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as every prior round (most recently Arabic, PR #39).

## Summary

Add Hebrew as the 23rd supported UI language: full dictionary translated and written
directly to `translations/he.js` via `fetch-language-dictionary` (current baseline:
723 `i18n` + 5 `shell` keys + 8 format functions, confirmed against `translations/
vn.js`, unchanged since the Dutch round), with `dir: "rtl"` (the second language to
set it, after Arabic), then wired into `index.html` (`#lang-select` dropdown only —
lazy-loaded via `loadLang()`, no injection) and all 22 existing READMEs' switch-links
via `add-language`, plus a new `README.he.md` (itself written right-to-left, same
approach as `README.ar.md`).

**Dropdown/README position**: Hebrew is a new script family (Hebrew alphabet, RTL) —
distinct from Arabic's script despite both being RTL. Per the established "new
script family opens a new trailing group, appended in the order the script is first
introduced" rule, Hebrew's `<option>`/README entry goes at the very end of the
dropdown, **after العربية (ar)**, which is currently last. `sortHint: "hebrew-rtl"`
(new value — first language to use it, following the same `<script>-rtl` naming
convention Arabic established).

**RTL mechanics**: `translations/he.js` sets `dir: "rtl"`, exactly like Arabic. No
further `index.html`/`style.css` change is expected — Arabic already proved this
plumbing works end-to-end through the real UI, not just a forced attribute. If
Hebrew's verification surfaces any layout gap Arabic's didn't (e.g. a Hebrew-specific
character-width or punctuation quirk), fix it here and flag it clearly in the PR —
that would be a new finding, not a repeat of the foundation round's own audit.

**README.he.md itself is RTL**: same approach as `README.ar.md` — wrap the body in
`<div dir="rtl">`, keep the switch-link header row LTR-ordered for cross-file
consistency with every other README (including `README.ar.md`, its nearest sibling).

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the written `he.js` `i18n`/`shell` values against `de.js` *before* wiring the
dropdown option, and manually spot-check flagged keys against the reference sibling
directly rather than trusting the translating agent's self-report at face value (the
lesson from the Italian round). Same adaptation Arabic's round used: the regex
heuristic alone is weaker for a non-Latin script, so a genuine second manual
read-through pass over a broad sample of Hebrew values is required, not just the
flagged exceptions.

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution (v1.2.0).

**Primary Dependencies**: None. Hebrew script renders via system/browser default
fonts, same as every other non-Latin script this app already supports (and same as
Arabic, which just proved this works with zero font-related issues).

**Storage**: N/A — `translations/he.js` is itself the runtime source.

**Testing**: No automated test suite; verification is manual browser use
(Playwright) plus scripted JS-structural validation. Same as Arabic, this round
verifies RTL rendering through the actual dropdown/UI flow (select Hebrew →
`dir="rtl"` applies automatically), not by forcing the attribute.

**Target Platform**: Any modern browser (client-side single HTML file, must also
work opened directly via `file://`).

**Project Type**: Single self-contained HTML file + first-party sibling files.

**Performance Goals**: N/A.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n engine and the now-merged, now-Arabic-proven RTL layout foundation (Principle
II).

**Scale/Scope**: One language — full `translations/he.js` (with `dir: "rtl"`), all
22 existing READMEs updated, one new `README.he.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Build, First-Party Files)**: PASS.
- **Principle II (i18n-First UI Copy)**: PASS — Hebrew added as a full
  `window.__LANG_HE__` object; full current key set covered; dropdown and all 22
  READMEs updated in the same pass.
- **Principle III (Theme Parity)**: PASS — this round doesn't touch CSS; RTL layout
  correctness was already verified twice (foundation round's forced-attribute pass,
  Arabic's real-dropdown pass). This round's own verification confirms Hebrew
  specifically renders correctly through the real UI.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — `translations/he.js`
  written whole by a script, validated via case-sensitive re-parse, plus the
  pre-wiring under-translation diff gate (adapted for a non-Latin script, same as
  Arabic's round).
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  `SPEC_KIT_INTEGRATION_PLAN.md` §5 Tier 3 Hebrew line checked off, completing Tier
  3 entirely.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Hebrew (overwrites Arabic's)
└── tasks.md             # Hebrew-scoped task list (overwrites Arabic's)
```

### Source code (repository root)

```text
translations/he.js            # new — window.__LANG_HE__, including dir: "rtl"
index.html                    # #lang-select <option> added only (after
                               # العربية, at the very end — new trailing RTL group)
README.md + 22 other READMEs  # switch-link row + Features bullet updated
README.he.md                  # new — written RTL, same approach as README.ar.md
CHANGELOG.md                  # entry added
SPEC_KIT_INTEGRATION_PLAN.md  # Hebrew checked off in Tier 3 (completes the tier)
```

**Structure Decision**: Single-file app (plus first-party sibling files).
Per-language plan/tasks live on this language's own branch
(`feat/add-hebrew-language`).

## Complexity Tracking

Not applicable — no constitution violations.
