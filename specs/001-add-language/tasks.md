# Tasks: Add Swedish (Svenska) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Swedish)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite; verification is manual (Phase 5 below)
plus scripted structural validation.

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all
      nineteen prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from
      `translations/vn.js` — confirmed 723 `i18n` + 5 `shell` keys + 8
      format functions, unchanged since the Dutch round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Swedish end-to-end — trivial Latin-script mechanics.

**Independent Test**: App opens correctly, `translations/sv.js` has full key
parity against the current baseline, passes the pre-wiring under-translation
diff gate against `de.js`, and all nineteen existing READMEs plus the
dropdown reflect Swedish in the correct position (after Español, before
Tiếng Việt).

- [ ] T003 [US1] Translate all current `i18n` + `shell` keys into Swedish via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`,
      `tool_choice`, MCP, CLAUDE.md, Grep/Glob, etc.; leave `IF THE STEM
      SAYS` stem phrases untranslated).
- [ ] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Swedish unit
      word for "questions," e.g. "frågor"), `noSpaceBeforeUnit: false`, the
      8 `*Fmt` functions, `nativeName: 'Svenska'`, `sortHint: 'latin'`
      (reused value).
- [ ] T005 [US1] Validate the written `translations/sv.js` for exact key-set
      parity against the current baseline and that all 8 `*Fmt` fields are
      real functions, via `vm.runInNewContext`.
- [ ] T005b [US1] **Standing quality gate**: run an English-word-overlap diff
      of `sv.js`'s `i18n`/`shell` values against `de.js` *before* wiring the
      dropdown option. Manually spot-check flagged keys rather than trusting
      the translating agent's self-report.
- [ ] T006 [US1] Add `<option value="sv">Svenska</option>` to `#lang-select`,
      positioned **after Español, before Tiếng Việt**.
- [ ] T007 [US1] Update all nineteen existing READMEs' switch-link row and
      Features bullet to include Swedish, in the same position.
- [ ] T008 [US1] Create `README.sv.md` (full translation, mirroring the
      structure of the other nineteen READMEs).

**Checkpoint**: Swedish is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — not applicable; Swedish is LTR.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation
mistakes before Swedish is considered shipped.

**Independent Test**: Key-count parity check passes across all 20 languages;
under-translation diff gate passes; dropdown/README ordering is consistent;
Learning Path, Cheat & Keywords, Exam by Domain, and Concepts tab all render
correctly in Swedish; the donate modal renders translated text with zero
console errors.

- [ ] T009 [US3] Re-parse all nineteen `translations/<code>.js` files
      (including `sv`) via `vm.runInNewContext`; confirm valid JS with
      matching key counts and all 8 `*Fmt` fields present as functions.
- [ ] T010 [US3] Confirm `#lang-select` references `sv` in the correct
      position and `loadLang()` resolves `window.__LANG_SV__` correctly.
- [ ] T011 [US3] Browser verification (Playwright, including via `file://`):
      confirm Study Console Learning Path, Cheat & Keywords core-principle
      cards and decision-rules table (`IF THE STEM SAYS` header translated,
      stem phrases left in English), Concepts tab, Exam by Domain, and the
      donate modal all render correctly in Swedish with **zero console
      errors**.
- [ ] T012 [US3] Update `CHANGELOG.md` documenting the Swedish addition.
- [ ] T013 [US3] Check off Swedish in `SPEC_KIT_INTEGRATION_PLAN.md` §5's
      Tier 2 (remaining) list.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential) → User Story 3
verification. User Story 2 (RTL) skipped — not applicable to Swedish.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for
  that language *before* `fetch-language-dictionary`/`add-language`.
- Continue running the pre-wiring English-word-overlap-vs-`de.js` diff gate
  (T005b) and the manual spot-check of the translating agent's self-reported
  exceptions.
