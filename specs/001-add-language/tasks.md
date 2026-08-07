# Tasks: Add Greek (Ελληνικά) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Greek)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite; verification is manual (Phase 5 below)
plus scripted structural validation.

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all
      twenty prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from
      `translations/vn.js` — confirmed 723 `i18n` + 5 `shell` keys + 8
      format functions, unchanged since the Dutch round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Greek end-to-end — new script family, but still LTR/no
layout-engine changes.

**Independent Test**: App opens correctly, `translations/el.js` has full key
parity against the current baseline, passes the pre-wiring under-translation
diff gate against `de.js`, and all twenty existing READMEs plus the dropdown
reflect Greek in the correct position (at the very end, after ไทย).

- [ ] T003 [US1] Translate all current `i18n` + `shell` keys into Greek via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`,
      `tool_choice`, MCP, CLAUDE.md, Grep/Glob, etc.; leave `IF THE STEM
      SAYS` stem phrases untranslated).
- [ ] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Greek unit
      word for "questions," e.g. "ερωτήσεις"), `noSpaceBeforeUnit: false`,
      the 8 `*Fmt` functions, `nativeName: 'Ελληνικά'`, `sortHint: 'greek'`
      (new value — first language to use it).
- [ ] T005 [US1] Validate the written `translations/el.js` for exact key-set
      parity against the current baseline and that all 8 `*Fmt` fields are
      real functions, via `vm.runInNewContext`.
- [ ] T005b [US1] **Standing quality gate**: run an English-word-overlap diff
      of `el.js`'s `i18n`/`shell` values against `de.js` *before* wiring the
      dropdown option. Manually spot-check flagged keys rather than trusting
      the translating agent's self-report.
- [ ] T006 [US1] Add `<option value="el">Ελληνικά</option>` to `#lang-select`,
      positioned **at the very end, after ไทย** (new trailing script-family
      group).
- [ ] T007 [US1] Update all twenty existing READMEs' switch-link row and
      Features bullet to include Greek, in the same position.
- [ ] T008 [US1] Create `README.el.md` (full translation, mirroring the
      structure of the other twenty READMEs).

**Checkpoint**: Greek is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — not applicable; Greek is LTR. Its
Tier-3 successors, Arabic/Hebrew, are what that story is reserved for.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation
mistakes before Greek is considered shipped.

**Independent Test**: Key-count parity check passes across all 21 languages;
under-translation diff gate passes; dropdown/README ordering is consistent;
Learning Path, Cheat & Keywords, Exam by Domain, and Concepts tab all render
correctly in Greek; the donate modal renders translated text with zero
console errors.

- [ ] T009 [US3] Re-parse all twenty-one `translations/<code>.js` files
      (including `el`) via `vm.runInNewContext`; confirm valid JS with
      matching key counts and all 8 `*Fmt` fields present as functions.
- [ ] T010 [US3] Confirm `#lang-select` references `el` in the correct
      position and `loadLang()` resolves `window.__LANG_EL__` correctly.
- [ ] T011 [US3] Browser verification (Playwright, including via `file://`):
      confirm Study Console Learning Path, Cheat & Keywords core-principle
      cards and decision-rules table (`IF THE STEM SAYS` header translated,
      stem phrases left in English), Concepts tab, Exam by Domain, and the
      donate modal all render correctly in Greek with **zero console
      errors**.
- [ ] T012 [US3] Update `CHANGELOG.md` documenting the Greek addition.
- [ ] T013 [US3] Check off Greek in `SPEC_KIT_INTEGRATION_PLAN.md` §5's
      Tier 2 (remaining) list — completing that tier.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential) → User Story 3
verification. User Story 2 (RTL) skipped — not applicable to Greek.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for
  that language *before* `fetch-language-dictionary`/`add-language`.
- Continue running the pre-wiring English-word-overlap-vs-`de.js` diff gate
  (T005b) and the manual spot-check of the translating agent's self-reported
  exceptions.
- With Greek shipped, all four Tier 2 (remaining) candidates from
  `SPEC_KIT_INTEGRATION_PLAN.md` §5 (Ukrainian, Dutch, Swedish, Greek) are
  complete. Tier 3 (Arabic, Hebrew) is next but requires RTL engineering
  work (User Story 2) not yet scoped.
