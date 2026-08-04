# Implementation Plan: Add Polish (Polski) Language

**Branch**: `feat/add-polish-language` | **Date**: 2026-08-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Polish (pl) — the next unchecked Tier 1/2 candidate in `SPEC_KIT_INTEGRATION_PLAN.md`
§5 (major IT-outsourcing/dev-shop hub in Europe), matching User Story 1 (drop-in
Latin-script language, no new layout mechanics).

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as the Korean, Portuguese, French, German, Hindi, Russian, Italian,
Indonesian, and Malay rounds.

## Summary

Add Polish as the 16th supported UI language: full dictionary translated and
staged at `translations/pl.json` via `fetch-language-dictionary` (current baseline:
verify key count against `window.__I18N__` at implementation time per FR-002 —
confirmed 723 `i18n` + 5 `shell` keys as of this round, unchanged since the Malay
round), then wired into `index.html` (`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT` plus
the other dynamic-format tables, `#lang-select` dropdown) and all fifteen existing
READMEs' switch-links via `add-language`, plus a new `README.pl.md`. Matches User
Story 1 in `spec.md` (drop-in Latin-script language, no new layout mechanics) — same
mechanics already proven for
Spanish/Vietnamese/Portuguese/French/German/Italian/Indonesian/Malay.

**Dropdown ordering note**: Polish is Latin-script, sorted alphabetically by
English name among the Latin-script group (English, French, German, Indonesian,
Italian, Malay, **Polish**, Portuguese, Spanish, Vietnamese), then the CJK group
(简体中文, 繁體中文, 日本語, 한국어), then the Devanagari group (हिन्दी), then the
Cyrillic group (Русский) follow unchanged. Polish's `<option>` and README
switch-link position: immediately after Melayu, before Português.

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the staged `pl.json` against `de.json` *before* injecting into
`index.html`, to catch under-translation before it ships rather than after (the
lesson from the Hindi round), and manually spot-check a sample of the translating
agent's self-reported "verified exception" list against the reference sibling
directly rather than trusting the self-report at face value (the lesson from the
Italian round).

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change.

**Storage**: N/A — dictionary data lives inline in `index.html`, with
`translations/pl.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use plus scripted JSON-structural validation, consistent with all prior
language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.

**Scale/Scope**: One language — full `__I18N_PL__` + `__SHELL_PL__` key set (current
baseline; re-verify at implementation time per FR-002), all fifteen existing
READMEs updated, one new `README.pl.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file.
- **Principle II (i18n-First UI Copy)**: PASS — Polish added as a full
  `window.__I18N_PL__`/`window.__SHELL_PL__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full
  current key set covered; dropdown and all fifteen READMEs updated in the same
  pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  brace-depth-aware scripted JSON edits, never manual `Edit` on raw dictionary
  lines; validated via a case-sensitive re-parse for exact key-set parity both
  before staging and after injection, plus the pre-injection under-translation
  diff gate.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  language list kept consistent across the app dropdown and all sixteen READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Polish (overwrites Malay's)
└── tasks.md             # Polish-scoped task list (overwrites Malay's)
```

Prior rounds' plan.md/tasks.md remain recoverable via `git log` on `main` (PR #1,
#7, #13, #15, #16, #17, #18, #23, #25); per `spec.md`'s Assumptions, this directory
is one reused feature, not one spec per language, so regeneration per round is
expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task, consistent with prior rounds.

### Source code (repository root)

```text
index.html                    # window.__I18N_PL__ / __SHELL_PL__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT + the other
                               # dynamic-format tables wired;
                               # #lang-select <option> added (between Melayu
                               # and Português, per alphabetical-by-English-name
                               # ordering within the Latin group)
translations/pl.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md, README.pt.md,
README.fr.md, README.de.md,
README.hi.md, README.ru.md,
README.it.md, README.id.md,
README.ms.md
README.pl.md                  # new
CHANGELOG.md                  # entry added
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on this language's own
branch (`feat/add-polish-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
