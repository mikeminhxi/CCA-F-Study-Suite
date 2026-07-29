# Implementation Plan: Add Russian (Русский) Language

**Branch**: `feat/add-russian-language` | **Date**: 2026-07-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Russian (ru) — a Tier 2 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5, explicitly
named in `spec.md`'s User Story 1 candidate list.

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as the Korean, Portuguese, French, German, and Hindi rounds.

## Summary

Add Russian as the 12th supported UI language: full dictionary translated and
staged at `translations/ru.json` via `fetch-language-dictionary` (current baseline:
verify key count against `window.__I18N__` at implementation time per FR-002 —
confirmed 715 `i18n` + 5 `shell` keys, unchanged since the Hindi round), then wired
into `index.html` (`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select`
dropdown) and all eleven existing READMEs' switch-links via `add-language`, plus a
new `README.ru.md`. Matches User Story 1 in `spec.md` — Russian is the app's
**first Cyrillic-script language**, but per `SPEC_KIT_INTEGRATION_PLAN.md` §5 this
is "same mechanics as Latin/CJK (LTR, no layout changes), just a new alphabet" —
comparable engineering lift to Hindi's Devanagari round, minus the new-ordering-
precedent decision (already established).

**Dropdown ordering note**: Reuses the trailing-script-group precedent established
in the Hindi round: script-family groups are appended in the order introduced —
Latin group, then CJK group, then Devanagari group (हिन्दी), then a new Cyrillic
group. Russian's `<option>` and README switch-link position: **at the very end,
after हिन्दी**. No new maintainer decision needed this round — this is exactly the
scenario the Hindi round's precedent was written to cover ("carries forward for any
future single-language script family").

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change. Cyrillic glyphs render via system/browser
default fonts — no new font dependency added, consistent with how Devanagari/CJK
text already relies on system fonts rather than a bundled webfont.

**Storage**: N/A — dictionary data lives inline in `index.html`, with
`translations/ru.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use (headless-browser screenshots, since Node/Playwright/chromium-cli are
not available in this environment) plus scripted JSON-structural validation,
consistent with all prior language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.
No RTL/layout work needed — Cyrillic is LTR, same box-model as every other
language shipped so far.

**Scale/Scope**: One language — full `__I18N_RU__` + `__SHELL_RU__` key set (current
baseline; re-verify at implementation time per FR-002), all eleven existing
READMEs updated, one new `README.ru.md`.

**Quality gate (new this round, carried forward from Hindi's lesson)**: Before
wiring into `index.html`, run an English-word-overlap diff of the staged `ru.json`
against a prior high-quality sibling (`de.json`) to catch systemic
under-translation (the Hindi round's first pass left ~148 headings/titles almost
fully in English) before it ships, not after.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file; no webfont added for Cyrillic.
- **Principle II (i18n-First UI Copy)**: PASS — Russian added as a full
  `window.__I18N_RU__`/`window.__SHELL_RU__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full
  current key set covered; dropdown and all eleven READMEs updated in the same
  pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched;
  no RTL mirroring needed for Cyrillic (LTR script).
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  brace-depth-aware scripted JSON edits, never manual `Edit` on raw dictionary
  lines; validated via a case-sensitive re-parse for exact key-set parity both
  before staging and after injection, plus the new under-translation diff gate.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  language list kept consistent across the app dropdown and all twelve READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Russian (overwrites Hindi's)
└── tasks.md             # Russian-scoped task list (overwrites Hindi's)
```

Prior rounds' plan.md/tasks.md remain recoverable via `git log` on `main` (PR #1,
#7, #13, #15, #16); per `spec.md`'s Assumptions, this directory is one reused
feature, not one spec per language, so regeneration per round is expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task, consistent with prior rounds.

### Source code (repository root)

```text
index.html                    # window.__I18N_RU__ / __SHELL_RU__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT wired;
                               # #lang-select <option> added at the very end,
                               # after हिन्दी (new trailing Cyrillic group)
translations/ru.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md, README.pt.md,
README.fr.md, README.de.md,
README.hi.md
README.ru.md                  # new
CHANGELOG.md                  # entry added
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on this language's own
branch (`feat/add-russian-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
