# Tasks: Add Dutch (Nederlands) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Dutch)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 5 below) plus scripted structural validation.

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all
      eighteen prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from
      `translations/vn.js` — confirmed 723 `i18n` + 5 `shell` keys + 8
      format functions, unchanged since the Ukrainian round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Dutch end-to-end — trivial Latin-script mechanics, no new
engineering lift.

**Independent Test**: App opens correctly, `translations/nl.js` has full key
parity against the current baseline, passes the pre-wiring under-translation
diff gate against `de.js`, and all eighteen existing READMEs plus the
dropdown reflect Dutch in the correct position (after English, before
Français).

- [ ] T003 [US1] Translate all current `i18n` + `shell` keys into Dutch via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`,
      `tool_choice`, MCP, CLAUDE.md, Grep/Glob, etc.; leave `IF THE STEM
      SAYS` stem phrases untranslated).
- [ ] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Dutch unit word
      for "questions," e.g. "vragen"), `noSpaceBeforeUnit: false`
      (space-separated), the 8 `*Fmt` functions, `nativeName: 'Nederlands'`,
      `sortHint: 'latin'` (reused value).
- [ ] T005 [US1] Validate the written `translations/nl.js` for exact key-set
      parity against the current baseline and that all 8 `*Fmt` fields are
      real functions, via `vm.runInNewContext`.
- [ ] T005b [US1] **Standing quality gate**: run an English-word-overlap diff
      of `nl.js`'s `i18n`/`shell` values against `de.js` *before* wiring the
      dropdown option. Manually spot-check flagged keys rather than trusting
      the translating agent's self-report.
- [ ] T006 [US1] Add `<option value="nl">Nederlands</option>` to
      `#lang-select`, positioned **after English, before Français**.
- [ ] T007 [US1] Update all eighteen existing READMEs' switch-link row and
      Features bullet to include Dutch, in the same position.
- [ ] T008 [US1] Create `README.nl.md` (full translation, mirroring the
      structure of the other eighteen READMEs).

**Checkpoint**: Dutch is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — not applicable; Dutch is LTR.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation
mistakes before Dutch is considered shipped.

**Independent Test**: Key-count parity check passes across all 19 languages;
under-translation diff gate passes; dropdown/README ordering is consistent;
Learning Path, Cheat & Keywords, Exam by Domain, and Concepts tab all render
correctly in Dutch; the donate modal renders translated text with zero
console errors.

- [ ] T009 [US3] Re-parse all eighteen `translations/<code>.js` files
      (including `nl`) via `vm.runInNewContext`; confirm valid JS with
      matching key counts and all 8 `*Fmt` fields present as functions.
- [ ] T010 [US3] Confirm `#lang-select` references `nl` in the correct
      position and `loadLang()` resolves `window.__LANG_NL__` correctly.
- [ ] T011 [US3] Browser verification (Playwright, including via `file://`):
      confirm Study Console Learning Path, Cheat & Keywords core-principle
      cards and decision-rules table (`IF THE STEM SAYS` header translated,
      stem phrases left in English), Concepts tab, Exam by Domain, and the
      donate modal all render correctly in Dutch with **zero console
      errors**.
- [ ] T012 [US3] Update `CHANGELOG.md` documenting the Dutch addition.
- [ ] T013 [US3] Check off Dutch in `SPEC_KIT_INTEGRATION_PLAN.md` §5's
      Tier 2 (remaining) list.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential) → User Story 3
verification. User Story 2 (RTL) skipped — not applicable to Dutch.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for
  that language *before* `fetch-language-dictionary`/`add-language`.
- Continue running the pre-wiring English-word-overlap-vs-`de.js` diff gate
  (T005b) and the manual spot-check of the translating agent's self-reported
  exceptions.
