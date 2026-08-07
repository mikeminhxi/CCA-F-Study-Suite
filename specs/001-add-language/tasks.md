# Tasks: Add Ukrainian (Українська) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Ukrainian)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 5 below) plus scripted structural validation (JS key-parity checks and
the pre-wiring under-translation diff gate).

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009 — this round runs `/speckit-plan` → `/speckit-tasks` *before*
`fetch-language-dictionary`/`add-language`, same as prior rounds.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all
      seventeen prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from
      `translations/vn.js` (`window.__LANG_VN__`) — confirmed 723 `i18n` +
      5 `shell` keys + 8 format functions, unchanged since the Thai round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Ukrainian end-to-end. Cyrillic script mechanics are already
solved (Russian round, PR #17) — zero new engineering lift, just the second
language in that script-family group.

**Independent Test**: App opens correctly, `translations/uk.js` has full key
parity against the current baseline, passes the pre-wiring under-translation
diff gate against `de.js`, and all seventeen existing READMEs plus the
dropdown reflect Ukrainian in the correct position (joins the existing
Cyrillic group, after Русский, before ไทย).

- [ ] T003 [US1] Translate all current `i18n` + `shell` keys into Ukrainian via
      `fetch-language-dictionary`, translating from scratch (not derived from
      `ru.js` — Ukrainian and Russian are distinct languages, not a
      script-conversion pair like Simplified/Traditional Chinese), following
      established conventions (keep technical terms in English — `agentic
      loop`, `stop_reason`, `tool_choice`, MCP, CLAUDE.md, Grep/Glob, etc.;
      leave `IF THE STEM SAYS` stem phrases untranslated; translate general
      nouns/headings fully into Ukrainian rather than leaving them mostly in
      English — the specific defect found in the Hindi round).
- [ ] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Ukrainian unit
      word for "questions," mind Slavic numeral-agreement classes — 1/21/31
      vs. 2-4/22-24 vs. 5-20/25-30 take different grammatical forms; pick a
      single conventionally-acceptable form or confirm the app's format
      functions only need one fixed unit word, matching how Russian/Polish
      handled the same class of language), `noSpaceBeforeUnit: false`
      (space-separated, like Russian), the 8 `*Fmt` functions
      (`questionFmt`, `questionsAvailableFmt`, `scoreSoFarFmt`, `bigScoreFmt`,
      `allCorrectFmt`, `retakeAllFmt`, `retakeMissedFmt`, `notThisTimeFmt`),
      `nativeName: 'Українська'`, `sortHint: 'cyrillic'` (reused value — not
      a new script family).
- [ ] T005 [US1] Validate the written `translations/uk.js` for exact key-set
      parity against the current baseline (case-sensitive check) and that all
      8 `*Fmt` fields are real functions, via `vm.runInNewContext`.
- [ ] T005b [US1] **Standing quality gate (since the Russian round)**: run an
      English-word-overlap diff of `uk.js`'s `i18n`/`shell` values against
      `de.js` (a known-complete sibling) *before* wiring the dropdown option.
      Fix any flagged keys in `translations/uk.js` first. Per the Italian
      round's lesson, manually spot-check a sample of the translating agent's
      own "verified exception" list against `de.js` directly — do not trust
      the agent's self-report at face value.
- [ ] T006 [US1] Add `<option value="uk">Українська</option>` to
      `#lang-select`, positioned **after Русский, before ไทย** — joins the
      existing Cyrillic group (does not open a new trailing group, unlike
      every round since Hindi).
- [ ] T007 [US1] Update all seventeen existing READMEs' switch-link row and
      Features bullet to include Ukrainian, in the same position (after
      Русский, before ไทย).
- [ ] T008 [US1] Create `README.uk.md` (full translation, mirroring the
      structure of the other seventeen READMEs, including the "Optional
      support" donation bullet).

**Checkpoint**: Ukrainian is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; Ukrainian
is LTR and needs no layout work.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation
mistakes before Ukrainian is considered shipped.

**Independent Test**: Key-count parity check passes across all 18 languages;
under-translation diff gate passes; dropdown/README ordering is consistent;
Learning Path, Cheat & Keywords, Exam by Domain (including a live exam round
through to the question screen and the "Exam Domains"/"N questions
available" strings), and Concepts tab all render correctly in Ukrainian; the
donate modal (nav button, panel) renders translated text with zero console
errors.

- [ ] T009 [US3] Re-parse all seventeen `translations/<code>.js` files
      (including `uk`) via `vm.runInNewContext`; confirm valid JS with
      matching `i18n`/`shell` key counts and all 8 `*Fmt` fields present as
      functions.
- [ ] T010 [US3] Confirm `#lang-select` references `uk` in the correct
      position and `loadLang()` resolves `window.__LANG_UK__` correctly
      (no manual `MAPS`/`SHELLS` wiring needed post-refactor).
- [ ] T011 [US3] Browser verification (including opened directly via
      `file://`, not just from a server): confirm Study Console Learning
      Path, Cheat & Keywords core-principle cards and decision-rules table
      (`IF THE STEM SAYS` header translated, literal stem phrases left in
      English per convention), Concepts tab, a full live exam round (Exam by
      Domain → question counter, sidebar unit label, "Exam Domains" heading,
      "N questions available" counter), and the donate button/modal all
      render correctly in Ukrainian with **zero console errors**.
- [ ] T012 [US3] Update `CHANGELOG.md` documenting the Ukrainian addition.
- [ ] T013 [US3] Check off Ukrainian in `SPEC_KIT_INTEGRATION_PLAN.md` §5's
      Tier 2 (remaining) list.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to
Ukrainian.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
- Continue running the pre-wiring English-word-overlap-vs-`de.js` diff gate
  (T005b) for every future round — standing process since the Russian round,
  and continue the manual spot-check of the agent's self-reported exceptions
  added after the Italian round's under-translation incident.
- This round reuses the `sortHint: 'cyrillic'` value and joins the existing
  Cyrillic script-family group rather than opening a new one — the first
  time a round has done this (every prior non-Latin/non-CJK round opened a
  brand-new trailing group). Future same-script additions (if any) should
  follow this alphabetical-within-group precedent, not always append at the
  very end.
