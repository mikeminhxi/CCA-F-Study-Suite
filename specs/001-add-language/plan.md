# Implementation Plan: Add French (Français) Language

**Branch**: `feat/add-french-language` | **Date**: 2026-07-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
French (fr) — a Tier 1 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5, explicitly
named in `spec.md`'s User Story 1 candidate list.

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as the Korean and Portuguese rounds.

## Summary

Add French as the 9th supported UI language: full dictionary translated and staged
at `translations/fr.json` via `fetch-language-dictionary` (current baseline: 715
`i18n` keys + 5 `shell` keys, verified against `window.__I18N__` — re-verify at
implementation time per FR-002, since this count has grown since the Portuguese
round), then wired into `index.html` (`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`,
`#lang-select` dropdown) and all eight existing READMEs' switch-links via
`add-language`, plus a new `README.fr.md`. Matches User Story 1 in `spec.md`
(drop-in Latin-script language, no new layout mechanics) — same mechanics already
proven for Spanish/Vietnamese/Portuguese.

**Dropdown ordering note**: French is Latin-script, sorted alphabetically by English
name among the Latin-script group (English, French, Portuguese, Spanish, Vietnamese),
then the CJK group (Simplified Chinese, Traditional Chinese, Japanese, Korean)
follows unchanged. French's `<option>` and README switch-link position: immediately
after English, before Português.

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change.

**Storage**: N/A — dictionary data lives inline in `index.html`, with
`translations/fr.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use (Playwright) plus scripted JSON-structural validation, consistent with
all prior language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.

**Scale/Scope**: One language — 715 `__I18N_FR__` keys + 5 `__SHELL_FR__` keys
(current baseline; re-verify at implementation time per FR-002), all eight existing
READMEs updated, one new `README.fr.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file.
- **Principle II (i18n-First UI Copy)**: PASS — French added as a full
  `window.__I18N_FR__`/`window.__SHELL_FR__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full current
  key set covered; dropdown and all eight READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  brace-depth-aware scripted JSON edits, never manual `Edit` on raw dictionary lines;
  validated via a case-sensitive re-parse for exact key-set parity both before staging
  and after injection.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated; language
  list kept consistent across the app dropdown and all nine READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to French (overwrites Portuguese's)
└── tasks.md             # French-scoped task list (overwrites Portuguese's)
```

Korean's and Portuguese's plan.md/tasks.md remain recoverable via `git log` on `main`
(PR #1, PR #7); per `spec.md`'s Assumptions, this directory is one reused feature, not
one spec per language, so regeneration per round is expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task, consistent with the Korean and Portuguese rounds.

### Source code (repository root)

```text
index.html                    # window.__I18N_FR__ / __SHELL_FR__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT wired;
                               # #lang-select <option> added (between English and
                               # Português, per alphabetical-by-English-name ordering)
translations/fr.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md, README.pt.md
README.fr.md                  # new
CHANGELOG.md                  # entry added
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on this language's own
branch (`feat/add-french-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
