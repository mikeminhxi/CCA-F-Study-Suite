# Implementation Plan: Add Arabic (العربية) Language

**Branch**: `feat/add-arabic-language` | **Date**: 2026-08-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, User Story 2
(Tier 3 candidate). Arabic is the first RTL language shipped — first among the two
Tier 3 candidates (Arabic, Hebrew) per `SPEC_KIT_INTEGRATION_PLAN.md` §5. Unlike the
prior RTL work, this round adds **no new layout engineering**: the RTL layout
foundation (`feat/add-rtl-layout-support`, merged to `main`) already made the app
capable of rendering `dir="rtl"` correctly. This round is a **standard translation +
wiring round**, matching User Story 1's mechanics, plus one new field
(`dir: "rtl"`) that the foundation round built specifically for this moment.

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as every prior round (most recently the RTL foundation round, before
that Greek, PR #37).

## Summary

Add Arabic as the 22nd supported UI language: full dictionary translated and written
directly to `translations/ar.js` via `fetch-language-dictionary` (current baseline:
723 `i18n` + 5 `shell` keys + 8 format functions, confirmed against `translations/
vn.js`, unchanged since the Dutch round), **plus** a new `dir: "rtl"` field — the
first language to set it — then wired into `index.html` (`#lang-select` dropdown
only — lazy-loaded via `loadLang()`, no injection) and all 21 existing READMEs'
switch-links via `add-language`, plus a new `README.ar.md` (itself written
right-to-left).

**Dropdown/README position**: Arabic is a new script family (Arabic alphabet, RTL)
— not Latin, CJK, Devanagari, Cyrillic, Thai, or Greek. Per the established "new
script family opens a new trailing group, appended in the order the script is first
introduced" rule, Arabic's `<option>`/README entry goes at the very end of the
dropdown, **after Ελληνικά (el)**, which is currently last. `sortHint: "arabic-rtl"`
(new value — first language to use it; distinguishing it from a hypothetical future
non-RTL "arabic" grouping is unnecessary since there is only one, but the suffix
makes the RTL-ness self-documenting at a glance in the dictionary file).

**RTL mechanics**: `translations/ar.js` sets `dir: "rtl"` in its language object.
`window.__setLang__` (already wired in the RTL foundation round) reads this field and
sets `document.documentElement`'s `dir` attribute accordingly — no further
`index.html`/`style.css` change should be required. If one *is* required during this
round's implementation or verification, that's a signal the foundation round's audit
missed something, and should be fixed here with a note back to that round's
`plan.md`/`tasks.md` history (recoverable via `git log`), not worked around locally.

**README.ar.md itself is RTL**: unlike every other language-specific README, this one
needs `<div dir="rtl">` (or equivalent) around its body content so it *reads*
correctly on GitHub, since GitHub-flavored Markdown doesn't auto-detect direction
from language content alone reliably for mixed English/Arabic (code spans, links,
and the switch-link header row itself should likely stay LTR-ordered for consistency
with every other README's switch-link row — this is a content decision to make
during implementation, not a layout-engineering one).

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the written `ar.js` `i18n`/`shell` values against `de.js` *before* wiring the
dropdown option, and manually spot-check flagged keys against the reference sibling
directly rather than trusting the translating agent's self-report at face value (the
lesson from the Italian round). For Arabic specifically, this quality gate cannot
rely on Latin-character-overlap heuristics working automatically the way they did for
Latin-script languages — a human (agent) pass reading actual Arabic is required, not
just a leftover-English-word regex.

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution (v1.2.0).

**Primary Dependencies**: None. Google Fonts `<link>` unaffected — Arabic script
rendering relies on system/browser default fonts, same as every other non-Latin
script this app already supports (CJK, Devanagari, Cyrillic, Thai, Greek all render
via system fonts with no explicit `@font-face`).

**Storage**: N/A — `translations/ar.js` is itself the runtime source.

**Testing**: No automated test suite; verification is manual browser use
(Playwright) plus scripted JS-structural validation. Unlike the RTL foundation
round, this round CAN verify RTL rendering through the actual dropdown/UI flow
(select Arabic → `dir="rtl"` applies automatically), not by forcing the attribute.

**Target Platform**: Any modern browser (client-side single HTML file, must also
work opened directly via `file://`).

**Project Type**: Single self-contained HTML file + first-party sibling files.

**Performance Goals**: N/A.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n engine and the now-merged RTL layout foundation (Principle II).

**Scale/Scope**: One language — full `translations/ar.js` (with `dir: "rtl"`), all
21 existing READMEs updated, one new `README.ar.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Build, First-Party Files)**: PASS.
- **Principle II (i18n-First UI Copy)**: PASS — Arabic added as a full
  `window.__LANG_AR__` object; full current key set covered; dropdown and all 21
  READMEs updated in the same pass.
- **Principle III (Theme Parity)**: PASS — this round doesn't touch CSS; RTL layout
  correctness was already verified for LTR-regression-safety in the foundation
  round. This round's own verification confirms Arabic specifically renders
  correctly through the real dropdown/UI path.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — `translations/ar.js`
  written whole by a script, validated via case-sensitive re-parse, plus the
  pre-wiring under-translation diff gate (adapted for a non-Latin script — see
  Summary).
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  `SPEC_KIT_INTEGRATION_PLAN.md` §5 Tier 3 Arabic line checked off.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Arabic (overwrites RTL foundation's)
└── tasks.md             # Arabic-scoped task list (overwrites RTL foundation's)
```

### Source code (repository root)

```text
translations/ar.js            # new — window.__LANG_AR__, including dir: "rtl"
index.html                    # #lang-select <option> added only (after
                               # Ελληνικά, at the very end — new trailing RTL group)
README.md + 21 other READMEs  # switch-link row + Features bullet updated
README.ar.md                  # new — written RTL
CHANGELOG.md                  # entry added
SPEC_KIT_INTEGRATION_PLAN.md  # Arabic checked off in Tier 3
```

**Structure Decision**: Single-file app (plus first-party sibling files).
Per-language plan/tasks live on this language's own branch
(`feat/add-arabic-language`).

## Complexity Tracking

Not applicable — no constitution violations.
