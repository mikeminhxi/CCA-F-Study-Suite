# Tasks: Add Russian (Русский) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Russian)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 5 below) plus scripted structural validation (JSON key-parity checks and
the new under-translation diff gate).

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009 — this round runs `/speckit-plan` → `/speckit-tasks` *before*
`fetch-language-dictionary`/`add-language`, same as prior rounds.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all
      eleven prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from `window.__I18N__`/
      `window.__SHELL__` in `index.html` — confirmed 715 `i18n` + 5 `shell` keys,
      unchanged since the Hindi round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Russian end-to-end as a Tier 2 language — first Cyrillic-script
addition, no RTL layout work needed (LTR script), reusing the Hindi round's
trailing-script-group ordering precedent without a new maintainer decision.

**Independent Test**: App opens correctly, the `ru` dictionary has full key parity
against the current baseline, passes the under-translation diff gate against
`de.json`, and all eleven existing READMEs plus the dropdown reflect Russian in
the correct (precedent-driven) trailing position.

- [x] T003 [US1] Translate all current `i18n` + `shell` keys into Russian via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`, `tool_choice`,
      MCP, CLAUDE.md, Grep/Glob, etc.; leave `IF THE STEM SAYS` stem phrases
      untranslated; translate general nouns fully into Cyrillic rather than
      leaving headings/titles mostly in English — the specific defect found and
      fixed in the Hindi round).
- [x] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Russian unit word for
      "questions", e.g. `'вопросов'`), `noSpaceBeforeUnit: false` (Cyrillic is
      space-separated like Latin/Devanagari scripts), `questionFmt`,
      `nativeName: 'Русский'`, `sortHint: 'cyrillic'` (new value — first Cyrillic
      script; not covered by the existing `latin`/`cjk`/`devanagari` groups).
- [x] T005 [US1] Validate the staged dictionary for exact key-set parity against
      the current baseline (case-sensitive check) before writing
      `translations/ru.json`.
- [x] T005b [US1] **New quality gate (added after the Hindi round's under-
      translation bug)**: run an English-word-overlap diff of the staged `ru.json`
      against `de.json` (a known-complete sibling) *before* injecting into
      `index.html`. Fix any flagged keys in the staged file first, so the fix
      never needs a second injection pass like Hindi's did.
- [x] T006 [US1] Inject `window.__I18N_RU__` / `window.__SHELL_RU__` into
      `index.html` via a brace-depth-aware scripted JSON edit, pretty-printed
      multi-line to match the app's existing dictionary format.
- [x] T007 [US1] Wire `ru` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT`.
- [x] T008 [US1] Add `<option value="ru">Русский</option>` to `#lang-select` **at
      the very end, after हिन्दी** — reusing the Hindi round's trailing-script-
      group precedent (Latin group → CJK group → Devanagari group → new Cyrillic
      group), no new maintainer decision needed.
- [x] T009 [US1] Update all eleven existing READMEs' switch-link row and Features
      bullet to include Russian, in dropdown order (at the end).
- [x] T010 [US1] Create `README.ru.md` (full translation, mirroring the structure
      of the other eleven READMEs, including the "Optional support" donation
      bullet).

**Checkpoint**: Russian is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; Cyrillic is
LTR, so Russian needs no layout work and no new ordering-precedent decision.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation mistakes
before Russian is considered shipped.

**Independent Test**: Key-count parity check passes across all 12 languages;
under-translation diff gate passes; dropdown/README ordering is consistent;
Learning Path, Cheat & Keywords, Exam by Domain (including a live exam round
through to the question screen), and Concepts tab all render correctly in
Russian; the donate modal (nav button, panel) renders translated text with zero
console errors.

- [x] T011 [US3] Re-parse all eleven `__I18N_*__`/`__SHELL_*__` dicts from the
      HTML (including `ru`); confirm valid JSON with matching key counts.
- [x] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/dropdown all
      reference `ru`.
- [x] T013 [US3] Browser verification via headless Edge (`msedge --headless=new
      --screenshot`/`--dump-dom` against `file://`, since Node/Playwright/
      chromium-cli aren't available in this environment): confirm Study Console
      Learning Path (5 domains → task statements in Russian), Cheat & Keywords
      core-principle cards and decision-rules table (`IF THE STEM SAYS` header
      translated, literal stem phrases left in English per convention), Concepts
      tab (59 concepts with translated titles/insights), a full live exam round
      (Exam by Domain → question counter, sidebar unit label) in Cyrillic
      rendering correctly, and the donate button/modal (including "Bank 1/2/3"
      labels) all render correctly in Russian with **zero console errors**.
      Screenshot the record.
- [x] T014 [US3] Update `CHANGELOG.md` documenting the Russian addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to Russian
(Cyrillic is LTR).

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
- The English-word-overlap-vs-`de.json` diff gate (T005b) is now a standing step
  for every future round, not just this one — added after the Hindi round shipped
  its first translation pass with 148 under-translated keys that had to be fixed
  in a second pass. Running it *before* injection (this round) instead of after
  (Hindi's round) avoids the extra re-injection step entirely.
