# Tasks: Add Thai (ไทย) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Thai)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 5 below) plus scripted structural validation (JSON key-parity checks and
the pre-injection under-translation diff gate).

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009 — this round runs `/speckit-plan` → `/speckit-tasks` *before*
`fetch-language-dictionary`/`add-language`, same as prior rounds.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all
      sixteen prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from `window.__I18N__`/
      `window.__SHELL__` in `index.html` — confirmed 723 `i18n` + 5 `shell` keys,
      unchanged since the Polish round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Thai end-to-end as a new-script, non-RTL language (same
mechanics as Hindi/Russian — new alphabet, no layout changes).

**Independent Test**: App opens correctly, the `th` dictionary has full key parity
against the current baseline, passes the pre-injection under-translation diff
gate against `de.json`, and all sixteen existing READMEs plus the dropdown reflect
Thai in the correct position (new trailing script-family group, after Русский).

- [ ] T003 [US1] Translate all current `i18n` + `shell` keys into Thai via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`, `tool_choice`,
      MCP, CLAUDE.md, Grep/Glob, etc.; leave `IF THE STEM SAYS` stem phrases
      untranslated; translate general nouns/headings fully into Thai rather
      than leaving them mostly in English — the specific defect found in the
      Hindi round).
- [ ] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Thai unit word/
      classifier for "questions" — Thai uses classifier words after numbers,
      confirm the correct one, e.g. ข้อ), `noSpaceBeforeUnit` (do NOT assume
      CJK-style tight packing by default — confirm whether Thai numeral+unit
      conventionally takes a space, per the plan's word-spacing note),
      `questionFmt`, `questionsAvailableFmt`, `nativeName: 'ไทย'`,
      `sortHint: 'thai'` (new script-family value — first use of this hint).
- [ ] T005 [US1] Validate the staged dictionary for exact key-set parity against
      the current baseline (case-sensitive check) before writing
      `translations/th.json`.
- [ ] T005b [US1] **Standing quality gate (since the Russian round)**: run an
      English-word-overlap diff of the staged `th.json` against `de.json` (a
      known-complete sibling) *before* injecting into `index.html`. Fix any
      flagged keys in the staged file first. Per the Italian round's lesson,
      manually spot-check a sample of the translating agent's own "verified
      exception" list against `de.json` directly — do not trust the agent's
      self-report at face value.
- [ ] T006 [US1] Inject `window.__I18N_TH__` / `window.__SHELL_TH__` into
      `index.html` via a brace-depth-aware scripted JSON edit, pretty-printed
      multi-line to match the app's existing dictionary format.
- [ ] T007 [US1] Wire `th` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT`, and
      the other dynamic-format tables (`SCORE_SOFAR_FMT`, `BIGSCORE_FMT`,
      `ALLCORRECT_FMT`, `RETAKEALL_FMT`, `RETAKEMISSED_FMT`, `NOTTHISTIME_FMT`,
      `QUESTIONS_AVAILABLE_FMT`) — apply whichever no-space-before-unit rule
      T004 determined; if `noSpaceBeforeUnit` is true, add `th` to the
      `(lang==='ja'||lang==='zh'||...)?'':' '` language list.
- [ ] T008 [US1] Add `<option value="th">ไทย</option>` to `#lang-select` at the
      **end of the list, after Русский** — a new trailing script-family group,
      per the Hindi round's ordering precedent (groups appended in the order
      introduced, not merged alphabetically).
- [ ] T009 [US1] Update all sixteen existing READMEs' switch-link row and
      Features bullet to include Thai, at the end of the list (after Русский).
- [ ] T010 [US1] Create `README.th.md` (full translation, mirroring the structure
      of the other sixteen READMEs, including the "Optional support" donation
      bullet).

**Checkpoint**: Thai is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; Thai is LTR
and needs no layout work.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation/font
mistakes before Thai is considered shipped.

**Independent Test**: Key-count parity check passes across all 17 languages;
under-translation diff gate passes; dropdown/README ordering is consistent;
Thai glyphs render correctly via browser system-font fallback (no tofu/
missing-glyph boxes); Learning Path, Cheat & Keywords, Exam by Domain
(including a live exam round through to the question screen and the
"Exam Domains"/"N questions available" strings), and Concepts tab all render
correctly in Thai; the donate modal (nav button, panel) renders translated
text with zero console errors.

- [ ] T011 [US3] Re-parse all sixteen `__I18N_*__`/`__SHELL_*__` dicts from the
      HTML (including `th`); confirm valid JSON with matching key counts.
- [ ] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/other dynamic
      FMT tables/dropdown all reference `th`.
- [ ] T013 [US3] Browser verification: confirm Study Console Learning Path,
      Cheat & Keywords core-principle cards and decision-rules table
      (`IF THE STEM SAYS` header translated, literal stem phrases left in
      English per convention), Concepts tab, a full live exam round (Exam by
      Domain → question counter, sidebar unit label, "Exam Domains" heading,
      "N questions available" counter), and the donate button/modal all
      render correctly in Thai with **zero console errors** and no visible
      missing-glyph ("tofu") boxes, confirming the font-coverage note in
      `plan.md`.
- [ ] T014 [US3] Update `CHANGELOG.md` documenting the Thai addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to
Thai.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
- Continue running the pre-injection English-word-overlap-vs-`de.json` diff gate
  (T005b) for every future round — standing process since the Russian round,
  and continue the manual spot-check of the agent's self-reported exceptions
  added after the Italian round's under-translation incident.
- This round establishes a new `sortHint: 'thai'` value and a new trailing
  script-family group in the dropdown/README ordering — future Thai-script
  additions (if any) would reuse this group rather than starting a new one.
