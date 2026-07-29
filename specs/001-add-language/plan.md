# Implementation Plan: Add German (Deutsch) Language

**Branch**: `feat/add-german-language` | **Date**: 2026-07-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
German (de) — a Tier 1 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5, explicitly
named in `spec.md`'s User Story 1 candidate list.

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as the Korean, Portuguese, and French rounds.

## Summary

Add German as the 10th supported UI language: full dictionary translated and staged
at `translations/de.json` via `fetch-language-dictionary` (current baseline: verify
key count against `window.__I18N__` at implementation time per FR-002, since this
count has grown since the French round), then wired into `index.html`
(`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select` dropdown) and all nine
existing READMEs' switch-links via `add-language`, plus a new `README.de.md`.
Matches User Story 1 in `spec.md` (drop-in Latin-script language, no new layout
mechanics) — same mechanics already proven for Spanish/Vietnamese/Portuguese/French.

**Dropdown ordering note**: German is Latin-script, sorted alphabetically by English
name among the Latin-script group (English, French, German, Portuguese, Spanish,
Vietnamese), then the CJK group (Simplified Chinese, Traditional Chinese, Japanese,
Korean) follows unchanged. German's `<option>` and README switch-link position:
immediately after French, before Português.

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change.

**Storage**: N/A — dictionary data lives inline in `index.html`, with
`translations/de.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use (Playwright) plus scripted JSON-structural validation, consistent with
all prior language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.

**Scale/Scope**: One language — full `__I18N_DE__` + `__SHELL_DE__` key set (current
baseline; re-verify at implementation time per FR-002), all nine existing READMEs
updated, one new `README.de.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file.
- **Principle II (i18n-First UI Copy)**: PASS — German added as a full
  `window.__I18N_DE__`/`window.__SHELL_DE__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full current
  key set covered; dropdown and all nine READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  brace-depth-aware scripted JSON edits, never manual `Edit` on raw dictionary lines;
  validated via a case-sensitive re-parse for exact key-set parity both before staging
  and after injection.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated; language
  list kept consistent across the app dropdown and all ten READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to German (overwrites French's)
└── tasks.md             # German-scoped task list (overwrites French's)
```

Korean's, Portuguese's, and French's plan.md/tasks.md remain recoverable via `git
log` on `main` (PR #1, PR #7, PR #13); per `spec.md`'s Assumptions, this directory is
one reused feature, not one spec per language, so regeneration per round is expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task, consistent with prior rounds.

### Source code (repository root)

```text
index.html                    # window.__I18N_DE__ / __SHELL_DE__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT wired;
                               # #lang-select <option> added (between French and
                               # Português, per alphabetical-by-English-name ordering)
translations/de.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md, README.pt.md,
README.fr.md
README.de.md                  # new
CHANGELOG.md                  # entry added
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on this language's own
branch (`feat/add-german-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
