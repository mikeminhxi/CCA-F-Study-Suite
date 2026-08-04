# Implementation Plan: Add Thai (ไทย) Language

**Branch**: `feat/add-thai-language` | **Date**: 2026-08-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Thai (th) — picked up from the "not yet prioritized" list in
`SPEC_KIT_INTEGRATION_PLAN.md` §5 at the maintainer's request, matching User
Story 1 (drop-in language, no RTL layout mechanics — but the app's first
Thai-script addition).

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as all prior rounds (most recently Polish).

## Summary

Add Thai as the 17th supported UI language: full dictionary translated and
staged at `translations/th.json` via `fetch-language-dictionary` (current
baseline: verify key count against `window.__I18N__` at implementation time
per FR-002 — confirmed 723 `i18n` + 5 `shell` keys as of this round, unchanged
since the Polish round), then wired into `index.html` (`MAPS`/`SHELLS`/
`QS_UNIT`/`QUESTION_FMT` plus the other dynamic-format tables, `#lang-select`
dropdown) and all sixteen existing READMEs' switch-links via `add-language`,
plus a new `README.th.md`. Matches User Story 1 in `spec.md` (drop-in
language, no new layout mechanics) — Thai is not RTL, so the mechanics are
the same as every prior round; the only novelty is a new script family.

**New script family note**: Thai is the app's first Thai-script language —
not Latin, not CJK, not Devanagari, not Cyrillic. Per the trailing-script-
group ordering precedent established in the Hindi round (PR #16) and reused
by Russian (PR #17), script-family groups are appended to the dropdown/README
switch-links in the order they were introduced, not merged alphabetically
into an existing group. Thai becomes a new trailing group appended **after**
Cyrillic (Русский), which was the last group introduced. Thai's `<option>`
and README switch-link position: at the very end of the list, after Русский.

**Font coverage note**: the app's loaded Google Fonts (Space Grotesk, Inter,
JetBrains Mono) do not include Thai glyphs — same situation as CJK,
Devanagari, and Cyrillic, none of which are covered by those fonts either.
Browser system-font fallback has handled this correctly for every non-Latin
language shipped so far; no font-loading changes are anticipated for Thai.
Confirm this holds during Phase 5 browser verification.

**Word-spacing note**: Thai is traditionally written without spaces between
words within a sentence, but numerals/counters conventionally do take a
space before their unit word (unlike CJK, which is tightly packed even
around numbers). Confirm the correct `noSpaceBeforeUnit` value with the
translating agent during `fetch-language-dictionary` (Step 3 metadata)
rather than assuming either CJK-style or Latin-style behavior by default.

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the staged `th.json` against `de.json` *before* injecting into
`index.html`, to catch under-translation before it ships rather than after (the
lesson from the Hindi round), and manually spot-check a sample of the translating
agent's self-reported "verified exception" list against the reference sibling
directly rather than trusting the self-report at face value (the lesson from the
Italian round).

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution.

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change (see Font coverage note above).

**Storage**: N/A — dictionary data lives inline in `index.html`, with
`translations/th.json` as a durable staged reference copy.

**Testing**: No automated test suite exists for this app; verification is manual
browser use plus scripted JSON-structural validation, consistent with all prior
language additions.

**Target Platform**: Any modern browser (client-side single HTML file).

**Project Type**: Single self-contained HTML file — no frontend/backend split.

**Performance Goals**: N/A — one more dictionary has negligible load impact.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.
Must not require RTL layout changes — Thai is LTR, so Principle II's existing
LTR-only engine is sufficient.

**Scale/Scope**: One language — full `__I18N_TH__` + `__SHELL_TH__` key set (current
baseline; re-verify at implementation time per FR-002), all sixteen existing
READMEs updated, one new `README.th.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Dependency Single File)**: PASS — no new external dependency;
  dictionary lives inline in the existing file; no new font loaded.
- **Principle II (i18n-First UI Copy)**: PASS — Thai added as a full
  `window.__I18N_TH__`/`window.__SHELL_TH__` pair consumed by the existing
  `MAPS`/`SHELLS`/`translateNode` engine; no hardcoded strings introduced. Full
  current key set covered; dropdown and all sixteen READMEs updated in the same
  pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — injection done via
  brace-depth-aware scripted JSON edits, never manual `Edit` on raw dictionary
  lines; validated via a case-sensitive re-parse for exact key-set parity both
  before staging and after injection, plus the pre-injection under-translation
  diff gate.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  language list kept consistent across the app dropdown and all seventeen READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Thai (overwrites Polish's)
└── tasks.md             # Thai-scoped task list (overwrites Polish's)
```

Prior rounds' plan.md/tasks.md remain recoverable via `git log` on `main` (PR #1,
#7, #13, #15, #16, #17, #18, #23, #25, #26); per `spec.md`'s Assumptions, this
directory is one reused feature, not one spec per language, so regeneration per
round is expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task, consistent with prior rounds.

### Source code (repository root)

```text
index.html                    # window.__I18N_TH__ / __SHELL_TH__ injected;
                               # MAPS/SHELLS/QS_UNIT/QUESTION_FMT + the other
                               # dynamic-format tables wired;
                               # #lang-select <option> added (at the end of
                               # the list, after Русский, as a new trailing
                               # script-family group)
translations/th.json          # staged dictionary (fetch-language-dictionary output)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md, README.pt.md,
README.fr.md, README.de.md,
README.hi.md, README.ru.md,
README.it.md, README.id.md,
README.ms.md, README.pl.md
README.th.md                  # new
CHANGELOG.md                  # entry added
SPEC_KIT_INTEGRATION_PLAN.md  # Thai checked off, moved out of "not yet
                               # prioritized"
```

**Structure Decision**: Single-file app — no frontend/backend split applies.
Per-language plan/tasks live in `specs/001-add-language/` on this language's own
branch (`feat/add-thai-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
