# Implementation Plan: Add Dutch (Nederlands) Language

**Branch**: `feat/add-dutch-language` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Dutch (nl) — ranked #2 among remaining candidates in
`SPEC_KIT_INTEGRATION_PLAN.md` §5 (Tier 2 remaining, PR #33), matching User
Story 1 (drop-in Latin-script language, no new engineering lift, same
mechanics as every prior Tier 1 round).

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as all prior rounds (most recently Ukrainian, PR #34).

## Summary

Add Dutch as the 19th supported UI language: full dictionary translated and
written directly (already in final, loaded form) to `translations/nl.js` via
`fetch-language-dictionary` (current baseline: 723 `i18n` + 5 `shell` keys +
8 format functions, confirmed against `translations/vn.js`, unchanged since
the Ukrainian round), then wired into `index.html` (`#lang-select` dropdown
only — per the PR #30/#31 lazy-load refactor, `translations/<code>.js`
defines `window.__LANG_NL__` and is loaded on demand by `loadLang()`; no
`MAPS`/`SHELLS`/injected-dictionary step in `index.html` itself) and all
eighteen existing READMEs' switch-links via `add-language`, plus a new
`README.nl.md`. Matches User Story 1 in `spec.md` (drop-in language, no new
layout mechanics) — Dutch is Latin-script and LTR, identical mechanics to
French/German/Italian/etc.

**Dropdown/README position**: Latin-script languages sort alphabetically by
English name, with English itself always first (implicit default). "Dutch"
sorts before "French" — Dutch's `<option>`/README entry goes immediately
**after English, before Français** (the current first Latin entry).
`sortHint: "latin"` (reused, not a new value).

**Font coverage note**: Dutch uses the standard Latin alphabet already
covered by every font/rendering path this app uses — no font work of any
kind, same as every other Latin-script round.

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the written `nl.js` `i18n`/`shell` values against `de.js` *before*
wiring the dropdown option, to catch under-translation before it ships (the
lesson from the Hindi round), and manually spot-check a sample of the
translating agent's self-reported "verified exception" list against the
reference sibling directly rather than trusting the self-report at face
value (the lesson from the Italian round).

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution (v1.2.0).

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change.

**Storage**: N/A — `translations/nl.js` is itself the runtime source (lazily
loaded via `<script src>` into `LANG_DATA['nl']`, per Principle II).

**Testing**: No automated test suite exists for this app; verification is manual
browser use plus scripted JS-structural validation (`vm.runInNewContext`).

**Target Platform**: Any modern browser (client-side single HTML file, must
also work opened directly via `file://`).

**Project Type**: Single self-contained HTML file + first-party sibling files
(`style.css`, `content.js`, `translations/*.js`) — no frontend/backend split.

**Performance Goals**: N/A — one more lazily-loaded file has no load-time
impact until selected.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II). Dutch is LTR — no layout changes.

**Scale/Scope**: One language — full `translations/nl.js` (`i18n` + `shell` +
8 `*Fmt` functions), all eighteen existing READMEs updated, one new
`README.nl.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Build, First-Party Files)**: PASS — `translations/nl.js`
  is a plain first-party file loaded via `<script src>`, no bundler/fetch.
- **Principle II (i18n-First UI Copy)**: PASS — Dutch added as a full
  `window.__LANG_NL__` object (`i18n`, `shell`, 8 format functions) consumed
  by the existing `loadLang`/`translateNode`/`applyAll` engine; no hardcoded
  strings introduced. Full current key set covered; dropdown and all
  eighteen READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — `translations/nl.js`
  is written whole by a script, validated via a case-sensitive re-parse for
  exact key-set parity, plus the pre-wiring under-translation diff gate. The
  only `Edit` touching `index.html` is the single `<option>` line.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  language list kept consistent across the app dropdown and all nineteen READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Dutch (overwrites Ukrainian's)
└── tasks.md             # Dutch-scoped task list (overwrites Ukrainian's)
```

Prior rounds' plan.md/tasks.md remain recoverable via `git log` on `main`.
No `research.md`/`data-model.md`/`contracts/` — not applicable.

### Source code (repository root)

```text
translations/nl.js            # new — window.__LANG_NL__, already in final,
                               # loaded form (fetch-language-dictionary output)
index.html                    # #lang-select <option> added only (after
                               # English, before Français)
README.md + 17 other READMEs  # switch-link row + Features bullet updated
README.nl.md                  # new
CHANGELOG.md                  # entry added
SPEC_KIT_INTEGRATION_PLAN.md  # Dutch checked off in Tier 2 (remaining)
```

**Structure Decision**: Single-file app (plus first-party sibling files) — no
frontend/backend split applies. Per-language plan/tasks live in
`specs/001-add-language/` on this language's own branch
(`feat/add-dutch-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
