# Implementation Plan: Add Korean (한국어) Language

**Branch**: `feat/add-korean-language` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to Korean
(ko) — a Tier 1 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5.

**Note**: Retrofitted after the fact. This language was implemented via direct
`fetch-language-dictionary` → `add-language` skill invocation before FR-009
(spec-kit round required per language) existed in `spec.md`. This plan documents
what was actually done, so PR #1 has a plan/tasks pair like every language after it
will. Future languages must run `/speckit-plan` → `/speckit-tasks` *before*
implementation, not after.

## Summary

Add Korean as the 7th supported UI language: full 531-key dictionary translated and
staged at `translations/ko.json` via `fetch-language-dictionary`, then wired into
`cca-f-study-suite.html` (`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select`
dropdown) and all six README language switch-links via `add-language`, plus a new
`README.ko.md`. Matches User Story 1 in `spec.md` (drop-in language, no new layout
mechanics) — Korean is CJK-adjacent for dropdown/README ordering (`sortHint: "cjk"`)
but was translated from scratch, not derived from another language's script.

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change.

**Storage**: N/A — dictionary data lives inline in `cca-f-study-suite.html`, with
`translations/ko.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use plus scripted JSON-structural validation, consistent with all prior
language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more ~40KB dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.

**Scale/Scope**: One language — 526 `__I18N_KO__` keys + 5 `__SHELL_KO__` keys, all
six existing READMEs updated, one new `README.ko.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file.
- **Principle II (i18n-First UI Copy)**: PASS — Korean added as a full
  `window.__I18N_KO__`/`window.__SHELL_KO__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full
  531-key set covered; dropdown and all six READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  PowerShell scripts using real JSON parsing (`ConvertFrom-Json`/`ConvertTo-Json`)
  and brace-depth-safe block extraction, never manual `Edit` on raw dictionary
  lines; validated via a `System.Text.Json` case-sensitive re-parse for exact
  key-set parity both before staging and after injection.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated; language
  list kept consistent across the app dropdown and all seven READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Korean
└── tasks.md             # Korean-scoped task list
```

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task.

### Source code (repository root)

```text
cca-f-study-suite.html        # window.__I18N_KO__ / __SHELL_KO__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT wired;
                               # #lang-select <option> added
translations/ko.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md
README.ko.md                  # new
CHANGELOG.md                  # entry added
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on that language's own
branch (`feat/add-korean-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
