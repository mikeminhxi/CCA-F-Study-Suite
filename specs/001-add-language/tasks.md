# Tasks: Add Portuguese, Brazil (Português) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Portuguese)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 3 below) plus scripted structural validation (JSON key-parity checks).

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009 — this round runs `/speckit-plan` → `/speckit-tasks` *before*
`fetch-language-dictionary`/`add-language`, unlike Korean's retrofitted round.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all seven
      prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from `window.__I18N__`/
      `window.__SHELL__` in `cca-f-study-suite.html` (691 `i18n` + 5 `shell` keys as
      of this round — re-verify at implementation time, since the baseline has grown
      since Korean's round due to the blueprint-taxonomy restructure: `TASK_STATEMENTS`
      titles, `CONCEPTS` titles/insights, and `DOMAIN_INFO` labels are now part of the
      i18n-covered key set and must be included in Portuguese's translation).

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Portuguese (Brazil) end-to-end as a Tier 1 drop-in language (Latin
script, no new layout mechanics).

**Independent Test**: App opens correctly, the `pt` dictionary has full key parity
against the current baseline, and all seven existing READMEs plus the dropdown
reflect Portuguese in the correct order.

- [x] T003 [US1] Translate all current `i18n` + `shell` keys into Portuguese (Brazil)
      via `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`, `tool_choice`, MCP,
      CLAUDE.md, Grep/Glob, etc.; leave `IF THE STEM SAYS` stem phrases untranslated).
- [x] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Portuguese unit word for
      "questions", e.g. `'perguntas'`), `noSpaceBeforeUnit: false` (Latin script, same
      as Spanish/Vietnamese), `questionFmt`, `nativeName: 'Português'`,
      `sortHint: 'latin'`.
- [x] T005 [US1] Validate the staged dictionary for exact key-set parity against the
      current baseline (case-sensitive check) before writing `translations/pt.json`.
- [x] T006 [US1] Inject `window.__I18N_PT__` / `window.__SHELL_PT__` into
      `cca-f-study-suite.html` via a brace-depth-aware scripted JSON edit,
      pretty-printed multi-line to match the app's existing dictionary format.
- [x] T007 [US1] Wire `pt` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT` (no
      no-space-before-unit rule change needed — Latin script, spaced like ES/VN).
- [x] T008 [US1] Add `<option value="pt">Português</option>` to `#lang-select` in the
      correct sort position — **between English and Español**, per alphabetical-by-
      English-name ordering (English, Portuguese, Spanish, Vietnamese, then the CJK
      group unchanged).
- [x] T009 [US1] Update all seven existing READMEs' switch-link row and Features
      bullet to include Portuguese, in dropdown order.
- [x] T010 [US1] Create `README.pt.md` (full translation, mirroring the structure of
      the other seven READMEs).

**Checkpoint**: Portuguese is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; Portuguese needs no
layout work.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering mistakes before Portuguese is
considered shipped.

**Independent Test**: Key-count parity check passes across all 8 languages;
dropdown/README ordering is consistent; Learning Path, Study, Exam by Domain, and
Concepts tab all render correctly in Portuguese.

- [x] T011 [US3] Re-parse all seven `__I18N_*__`/`__SHELL_*__` dicts from the HTML
      (including `pt`); confirm valid JSON with matching key counts.
- [x] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/dropdown all
      reference `pt`.
- [x] T013 [US3] Browser verification via Playwright (`file://`, no Node needed):
      confirm Study Console nav, Cheat & Keywords core-principle cards, decision-rules
      table (`IF THE STEM SAYS` left in English), Learning Path (5 domains → task
      statements in Portuguese), Concepts tab (59 concepts with translated titles/
      insights), and the quiz counter all render correctly in Portuguese with **zero
      console errors**. Screenshot the record.
      - **Bug found and fixed** (pre-existing, affected all 7 other languages equally,
        not introduced by this addition): the quiz meta line concatenated the task
        statement id and title into a single text node (`"ts-4.3 · Enforce structured
        output..."`), which never matched a dictionary key, so the title silently
        stayed in English under every non-English language. Fixed by splitting the id
        into its own `.tscode` span, matching the pattern already used in Learning
        Path/Study — confirmed translated correctly in pt/ko/es after the fix.
- [x] T014 [US3] Update `CHANGELOG.md` documenting the Portuguese addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to Portuguese.

## Notes

- The i18n gap Korean's round flagged (domain names / phase titles / module-toggle
  labels not wired into any dictionary) has since been **resolved** by the
  blueprint-taxonomy restructure (PR #3/#4): `DOMAIN_INFO` labels, `TASK_STATEMENTS`
  titles, and `CONCEPTS` titles/insights are now regular i18n-dictionary-backed text
  nodes, translated for all languages including this round. No special-casing needed.
- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
