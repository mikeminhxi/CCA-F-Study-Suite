# Implementation Plan: Add Portuguese, Brazil (Português) Language

**Branch**: `feat/add-portuguese-language` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Portuguese, Brazil (pt) — a Tier 1 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5.

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, unlike Korean's
retrofitted round.

## Summary

Add Portuguese (Brazil) as the 8th supported UI language: full dictionary translated
and staged at `translations/pt.json` via `fetch-language-dictionary` (current baseline:
691 `i18n` keys + 5 `shell` keys, verified against `window.__I18N__`), then wired into
`cca-f-study-suite.html` (`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select`
dropdown) and all seven existing READMEs' switch-links via `add-language`, plus a new
`README.pt.md`. Matches User Story 1 in `spec.md` (drop-in Latin-script language, no
new layout mechanics) — same mechanics already proven for Spanish/Vietnamese.

**Regional-variant note** (flagged in `spec.md`'s Edge Cases): this is Brazilian
Portuguese (pt-BR) specifically, not European Portuguese (pt-PT) — matches the
`SPEC_KIT_INTEGRATION_PLAN.md` priority list's stated rationale (large developer
population). The in-app language code is `pt`; if pt-PT is ever requested separately,
it would need its own code (e.g. `pt-pt`) and its own round, not a variant of this one.

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change.

**Storage**: N/A — dictionary data lives inline in `cca-f-study-suite.html`, with
`translations/pt.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use (Playwright, established this session) plus scripted JSON-structural
validation, consistent with all prior language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.

**Scale/Scope**: One language — 691 `__I18N_PT__` keys + 5 `__SHELL_PT__` keys (current
baseline; re-verify at implementation time per FR-002), all seven existing READMEs
updated, one new `README.pt.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file.
- **Principle II (i18n-First UI Copy)**: PASS — Portuguese added as a full
  `window.__I18N_PT__`/`window.__SHELL_PT__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full current
  key set covered; dropdown and all seven READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  brace-depth-aware scripted JSON edits, never manual `Edit` on raw dictionary lines;
  validated via a case-sensitive re-parse for exact key-set parity both before staging
  and after injection.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated; language
  list kept consistent across the app dropdown and all eight READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Portuguese (overwrites Korean's)
└── tasks.md             # Portuguese-scoped task list (overwrites Korean's)
```

Korean's plan.md/tasks.md remain recoverable via `git log` on `main` (PR #1); per
`spec.md`'s Assumptions, this directory is one reused feature, not one spec per
language, so regeneration per round is expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task.

### Source code (repository root)

```text
cca-f-study-suite.html        # window.__I18N_PT__ / __SHELL_PT__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT wired;
                               # #lang-select <option> added (between English and
                               # Español, per alphabetical-by-English-name ordering)
translations/pt.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md
README.pt.md                  # new
CHANGELOG.md                  # entry added
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on this language's own
branch (`feat/add-portuguese-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
