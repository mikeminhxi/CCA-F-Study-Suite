# Implementation Plan: Add Greek (Ελληνικά) Language

**Branch**: `feat/add-greek-language` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Greek (el) — ranked #4 (last) among remaining candidates in
`SPEC_KIT_INTEGRATION_PLAN.md` §5 (Tier 2 remaining, PR #33), completing that
tier. Matches User Story 1 (drop-in language) but with a new script family,
so also touches the ordering rules normally covered by User Story 2's
non-Latin considerations (without needing RTL, which is User Story 2 proper).

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as all prior rounds (most recently Swedish, PR #36).

## Summary

Add Greek as the 21st supported UI language: full dictionary translated
and written directly to `translations/el.js` via `fetch-language-dictionary`
(current baseline: 723 `i18n` + 5 `shell` keys + 8 format functions,
confirmed against `translations/vn.js`, unchanged since the Dutch round),
then wired into `index.html` (`#lang-select` dropdown only — lazy-loaded via
`loadLang()`, no `MAPS`/`SHELLS` injection) and all twenty existing READMEs'
switch-links via `add-language`, plus a new `README.el.md`.

**Dropdown/README position**: Greek uses its own script (Greek alphabet) —
not Latin, not CJK, not Devanagari, not Cyrillic, not Thai. Per the
established "new script family opens a new trailing group, appended in the
order the script is first introduced" rule (followed by every non-Latin
round except Ukrainian, which instead joined the existing Cyrillic group),
Greek's `<option>`/README entry goes at the very end of the dropdown,
**after ไทย (th)**, which is currently last. `sortHint: "greek"` (new value
— first language to use it).

**Script note**: Greek is LTR (not RTL — User Story 2's RTL-specific work,
e.g. `dir="rtl"` handling, remains out of scope for this round; that's
reserved for Arabic/Hebrew, ranked in Tier 3 behind Greek specifically
because of that prerequisite). Greek alphabet glyphs are covered by standard
system/web fonts already used across this app — no font work needed.

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the written `el.js` `i18n`/`shell` values against `de.js` *before*
wiring the dropdown option, and manually spot-check flagged keys against
the reference sibling directly rather than trusting the translating agent's
self-report at face value (the lesson from the Italian round).

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution (v1.2.0).

**Primary Dependencies**: None. Google Fonts `<link>` unaffected.

**Storage**: N/A — `translations/el.js` is itself the runtime source (lazily
loaded via `<script src>` into `LANG_DATA['el']`).

**Testing**: No automated test suite; verification is manual browser use
(Playwright) plus scripted JS-structural validation.

**Target Platform**: Any modern browser (client-side single HTML file, must
also work opened directly via `file://`).

**Project Type**: Single self-contained HTML file + first-party sibling
files — no frontend/backend split.

**Performance Goals**: N/A.

**Constraints**: Must not add a dependency (Principle I); must reuse the
existing i18n engine (Principle II). Greek is LTR — no layout changes.

**Scale/Scope**: One language — full `translations/el.js`, all twenty
existing READMEs updated, one new `README.el.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Build, First-Party Files)**: PASS.
- **Principle II (i18n-First UI Copy)**: PASS — Greek added as a full
  `window.__LANG_EL__` object; full current key set covered; dropdown and
  all twenty READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — `translations/el.js`
  written whole by a script, validated via case-sensitive re-parse, plus
  the pre-wiring under-translation diff gate.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  language list kept consistent everywhere.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Greek (overwrites Swedish's)
└── tasks.md             # Greek-scoped task list (overwrites Swedish's)
```

### Source code (repository root)

```text
translations/el.js            # new — window.__LANG_EL__
index.html                    # #lang-select <option> added only (after
                               # ไทย, at the very end — new trailing group)
README.md + 19 other READMEs  # switch-link row + Features bullet updated
README.el.md                  # new
CHANGELOG.md                  # entry added
SPEC_KIT_INTEGRATION_PLAN.md  # Greek checked off in Tier 2 (remaining)
```

**Structure Decision**: Single-file app (plus first-party sibling files).
Per-language plan/tasks live on this language's own branch
(`feat/add-greek-language`).

## Complexity Tracking

Not applicable — no constitution violations.
