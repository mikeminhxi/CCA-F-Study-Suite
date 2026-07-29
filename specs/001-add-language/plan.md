# Implementation Plan: Add Italian (Italiano) Language

**Branch**: `feat/add-italian-language` | **Date**: 2026-07-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Italian (it) — a Tier 2 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5, explicitly
named in `spec.md`'s User Story 1 candidate list.

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as the Korean, Portuguese, French, German, Hindi, and Russian rounds.

## Summary

Add Italian as the 13th supported UI language: full dictionary translated and
staged at `translations/it.json` via `fetch-language-dictionary` (current baseline:
verify key count against `window.__I18N__` at implementation time per FR-002 —
confirmed 715 `i18n` + 5 `shell` keys, unchanged since the Russian round), then
wired into `index.html` (`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select`
dropdown) and all twelve existing READMEs' switch-links via `add-language`, plus a
new `README.it.md`. Matches User Story 1 in `spec.md` (drop-in Latin-script
language, no new layout mechanics) — same mechanics already proven for
Spanish/Vietnamese/Portuguese/French/German.

**Dropdown ordering note**: Italian is Latin-script, sorted alphabetically by
English name among the Latin-script group (English, French, German, **Italian**,
Portuguese, Spanish, Vietnamese), then the CJK group, then the Devanagari group
(हिन्दी), then the Cyrillic group (Русский) follow unchanged. Italian's `<option>`
and README switch-link position: immediately after Deutsch, before Português.

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the staged `it.json` against `de.json` *before* injecting into
`index.html`, to catch under-translation before it ships rather than after (the
lesson from the Hindi round).

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change.

**Storage**: N/A — dictionary data lives inline in `index.html`, with
`translations/it.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use (headless-browser screenshots, since Node/Playwright/chromium-cli are
not available in this environment) plus scripted JSON-structural validation,
consistent with all prior language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.

**Scale/Scope**: One language — full `__I18N_IT__` + `__SHELL_IT__` key set (current
baseline; re-verify at implementation time per FR-002), all twelve existing
READMEs updated, one new `README.it.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file.
- **Principle II (i18n-First UI Copy)**: PASS — Italian added as a full
  `window.__I18N_IT__`/`window.__SHELL_IT__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full
  current key set covered; dropdown and all twelve READMEs updated in the same
  pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  brace-depth-aware scripted JSON edits, never manual `Edit` on raw dictionary
  lines; validated via a case-sensitive re-parse for exact key-set parity both
  before staging and after injection, plus the pre-injection under-translation
  diff gate.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  language list kept consistent across the app dropdown and all thirteen READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Italian (overwrites Russian's)
└── tasks.md             # Italian-scoped task list (overwrites Russian's)
```

Prior rounds' plan.md/tasks.md remain recoverable via `git log` on `main` (PR #1,
#7, #13, #15, #16, #17); per `spec.md`'s Assumptions, this directory is one reused
feature, not one spec per language, so regeneration per round is expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task, consistent with prior rounds.

### Source code (repository root)

```text
index.html                    # window.__I18N_IT__ / __SHELL_IT__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT wired;
                               # #lang-select <option> added (between Deutsch and
                               # Português, per alphabetical-by-English-name
                               # ordering within the Latin group)
translations/it.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md, README.pt.md,
README.fr.md, README.de.md,
README.hi.md, README.ru.md
README.it.md                  # new
CHANGELOG.md                  # entry added
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on this language's own
branch (`feat/add-italian-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
