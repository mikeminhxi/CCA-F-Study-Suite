# Implementation Plan: Add Swedish (Svenska) Language

**Branch**: `feat/add-swedish-language` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Swedish (sv) — ranked #3 among remaining candidates in
`SPEC_KIT_INTEGRATION_PLAN.md` §5 (Tier 2 remaining, PR #33), matching User
Story 1 (drop-in Latin-script language, no new engineering lift).

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as all prior rounds (most recently Dutch, PR #35).

## Summary

Add Swedish as the 20th supported UI language: full dictionary translated
and written directly to `translations/sv.js` via `fetch-language-dictionary`
(current baseline: 723 `i18n` + 5 `shell` keys + 8 format functions,
confirmed against `translations/vn.js`, unchanged since the Dutch round),
then wired into `index.html` (`#lang-select` dropdown only — lazy-loaded via
`loadLang()`, no `MAPS`/`SHELLS` injection) and all nineteen existing
READMEs' switch-links via `add-language`, plus a new `README.sv.md`. Matches
User Story 1 in `spec.md` — Swedish is Latin-script and LTR, identical
mechanics to Dutch/French/German/etc.

**Dropdown/README position**: Latin-script languages sort alphabetically by
English name, with English always first. "Swedish" sorts after "Spanish" and
before "Vietnamese" — Swedish's `<option>`/README entry goes immediately
**after Español, before Tiếng Việt**. `sortHint: "latin"` (reused).

**Font coverage note**: Swedish uses the Latin alphabet plus å/ä/ö, already
covered by every font/rendering path this app uses — no font work needed.

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the written `sv.js` `i18n`/`shell` values against `de.js` *before*
wiring the dropdown option, and manually spot-check flagged keys against
the reference sibling directly rather than trusting the translating agent's
self-report at face value (the lesson from the Italian round).

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution (v1.2.0).

**Primary Dependencies**: None. Google Fonts `<link>` unaffected.

**Storage**: N/A — `translations/sv.js` is itself the runtime source (lazily
loaded via `<script src>` into `LANG_DATA['sv']`).

**Testing**: No automated test suite; verification is manual browser use
(Playwright) plus scripted JS-structural validation.

**Target Platform**: Any modern browser (client-side single HTML file, must
also work opened directly via `file://`).

**Project Type**: Single self-contained HTML file + first-party sibling
files — no frontend/backend split.

**Performance Goals**: N/A.

**Constraints**: Must not add a dependency (Principle I); must reuse the
existing i18n engine (Principle II). Swedish is LTR — no layout changes.

**Scale/Scope**: One language — full `translations/sv.js`, all nineteen
existing READMEs updated, one new `README.sv.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Build, First-Party Files)**: PASS.
- **Principle II (i18n-First UI Copy)**: PASS — Swedish added as a full
  `window.__LANG_SV__` object; full current key set covered; dropdown and
  all nineteen READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — `translations/sv.js`
  written whole by a script, validated via case-sensitive re-parse, plus
  the pre-wiring under-translation diff gate.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  language list kept consistent everywhere.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Swedish (overwrites Dutch's)
└── tasks.md             # Swedish-scoped task list (overwrites Dutch's)
```

### Source code (repository root)

```text
translations/sv.js            # new — window.__LANG_SV__
index.html                    # #lang-select <option> added only (after
                               # Español, before Tiếng Việt)
README.md + 18 other READMEs  # switch-link row + Features bullet updated
README.sv.md                  # new
CHANGELOG.md                  # entry added
SPEC_KIT_INTEGRATION_PLAN.md  # Swedish checked off in Tier 2 (remaining)
```

**Structure Decision**: Single-file app (plus first-party sibling files).
Per-language plan/tasks live on this language's own branch
(`feat/add-swedish-language`).

## Complexity Tracking

Not applicable — no constitution violations.
