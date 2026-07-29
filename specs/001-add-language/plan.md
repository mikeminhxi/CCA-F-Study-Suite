# Implementation Plan: Add Hindi (हिन्दी) Language

**Branch**: `feat/add-hindi-language` | **Date**: 2026-07-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Hindi (hi) — a Tier 2 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5, explicitly
named in `spec.md`'s User Story 1 candidate list.

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as the Korean, Portuguese, French, and German rounds.

## Summary

Add Hindi as the 11th supported UI language: full dictionary translated and staged
at `translations/hi.json` via `fetch-language-dictionary` (current baseline: verify
key count against `window.__I18N__` at implementation time per FR-002, since this
count has grown since the German round), then wired into `index.html`
(`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select` dropdown) and all ten
existing READMEs' switch-links via `add-language`, plus a new `README.hi.md`.
Matches User Story 1 in `spec.md`, but is the **first Devanagari-script language**
added to the app — not RTL (no layout-mirroring work needed, unlike a hypothetical
Arabic/Hebrew round), but a genuinely new (non-Latin, non-CJK) alphabet, so the
dropdown/README ordering rule needs a new grouping decision rather than reusing the
existing Latin/CJK slotting logic verbatim.

**Dropdown ordering note (new decision, confirmed with maintainer this round)**:
Since Hindi is neither Latin nor CJK script, it does not fit the existing two-group
rule ("Latin-script languages first, alphabetical by English name; then CJK
languages grouped together"). Established this round: **script-family groups are
appended in the order they were introduced** — Latin group, then CJK group, then a
new Devanagari group. Hindi's `<option>` and README switch-link position:
**at the very end, after 한국어 (Korean)**. This precedent should be reused for any
future single-language script family (e.g. a hypothetical future Thai or Greek
addition would each get their own trailing group, not be merged into Hindi's).

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change. Devanagari glyphs render via system/browser
default fonts — no new font dependency added, consistent with how CJK/Korean text
already relies on system fonts rather than a bundled webfont.

**Storage**: N/A — dictionary data lives inline in `index.html`, with
`translations/hi.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use (headless-browser screenshots, since Node/Playwright/chromium-cli are
not available in this environment) plus scripted JSON-structural validation,
consistent with all prior language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.
No RTL/layout work needed — Devanagari is LTR, same box-model as every other
language shipped so far.

**Scale/Scope**: One language — full `__I18N_HI__` + `__SHELL_HI__` key set (current
baseline; re-verify at implementation time per FR-002), all ten existing READMEs
updated, one new `README.hi.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file; no webfont added for Devanagari.
- **Principle II (i18n-First UI Copy)**: PASS — Hindi added as a full
  `window.__I18N_HI__`/`window.__SHELL_HI__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full current
  key set covered; dropdown and all ten READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched;
  no RTL mirroring needed for Devanagari (LTR script).
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  brace-depth-aware scripted JSON edits, never manual `Edit` on raw dictionary lines;
  validated via a case-sensitive re-parse for exact key-set parity both before staging
  and after injection.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated; language
  list kept consistent across the app dropdown and all eleven READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Hindi (overwrites German's)
└── tasks.md             # Hindi-scoped task list (overwrites German's)
```

Prior rounds' plan.md/tasks.md remain recoverable via `git log` on `main` (PR #1,
#7, #13, #15); per `spec.md`'s Assumptions, this directory is one reused feature,
not one spec per language, so regeneration per round is expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task, consistent with prior rounds.

### Source code (repository root)

```text
index.html                    # window.__I18N_HI__ / __SHELL_HI__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT wired;
                               # #lang-select <option> added at the very end,
                               # after 한국어 (new trailing Devanagari group)
translations/hi.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md, README.pt.md,
README.fr.md, README.de.md
README.hi.md                  # new
CHANGELOG.md                  # entry added
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on this language's own
branch (`feat/add-hindi-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
