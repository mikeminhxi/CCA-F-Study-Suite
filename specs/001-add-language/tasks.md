# Tasks: Add Italian (Italiano) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Italian)

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
      twelve prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from `window.__I18N__`/
      `window.__SHELL__` in `index.html` — confirmed 715 `i18n` + 5 `shell` keys,
      unchanged since the Russian round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Italian end-to-end as a Tier 2 drop-in language (Latin script, no
new layout mechanics).

**Independent Test**: App opens correctly, the `it` dictionary has full key parity
against the current baseline, passes the pre-injection under-translation diff
gate against `de.json`, and all twelve existing READMEs plus the dropdown reflect
Italian in the correct order.

- [x] T003 [US1] Translate all current `i18n` + `shell` keys into Italian via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`, `tool_choice`,
      MCP, CLAUDE.md, Grep/Glob, etc.; leave `IF THE STEM SAYS` stem phrases
      untranslated; translate general nouns/headings fully into Italian rather
      than leaving them mostly in English — the specific defect found in the
      Hindi round).
- [x] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Italian unit word
      for "questions", e.g. `'domande'`), `noSpaceBeforeUnit: false` (Latin
      script, same as ES/VN/PT/FR/DE), `questionFmt`, `nativeName: 'Italiano'`,
      `sortHint: 'latin'`.
- [x] T005 [US1] Validate the staged dictionary for exact key-set parity against
      the current baseline (case-sensitive check) before writing
      `translations/it.json`.
- [x] T005b [US1] **Standing quality gate (since the Russian round)**: run an
      English-word-overlap diff of the staged `it.json` against `de.json` (a
      known-complete sibling) *before* injecting into `index.html`. Fix any
      flagged keys in the staged file first.
- [x] T006 [US1] Inject `window.__I18N_IT__` / `window.__SHELL_IT__` into
      `index.html` via a brace-depth-aware scripted JSON edit, pretty-printed
      multi-line to match the app's existing dictionary format.
- [x] T007 [US1] Wire `it` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT` (no
      no-space-before-unit rule change needed — Latin script, spaced like
      ES/VN/PT/FR/DE).
- [x] T008 [US1] Add `<option value="it">Italiano</option>` to `#lang-select` in
      the correct sort position — **between Deutsch and Português**, per
      alphabetical-by-English-name ordering (English, French, German, Italian,
      Portuguese, Spanish, Vietnamese, then the CJK/Devanagari/Cyrillic groups
      unchanged).
- [x] T009 [US1] Update all twelve existing READMEs' switch-link row and Features
      bullet to include Italian, in dropdown order.
- [x] T010 [US1] Create `README.it.md` (full translation, mirroring the structure
      of the other twelve READMEs, including the "Optional support" donation
      bullet).

**Checkpoint**: Italian is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; Italian needs
no layout work.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation mistakes
before Italian is considered shipped.

**Independent Test**: Key-count parity check passes across all 13 languages;
under-translation diff gate passes; dropdown/README ordering is consistent;
Learning Path, Cheat & Keywords, Exam by Domain (including a live exam round
through to the question screen), and Concepts tab all render correctly in
Italian; the donate modal (nav button, panel) renders translated text with zero
console errors.

- [x] T011 [US3] Re-parse all twelve `__I18N_*__`/`__SHELL_*__` dicts from the
      HTML (including `it`); confirm valid JSON with matching key counts.
- [x] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/dropdown all
      reference `it`.
- [x] T013 [US3] Browser verification via headless Edge (`msedge --headless=new
      --screenshot`/`--dump-dom` against `file://`, since Node/Playwright/
      chromium-cli aren't available in this environment): confirm Study Console
      Learning Path (5 domains → task statements in Italian), Cheat & Keywords
      core-principle cards and decision-rules table (`IF THE STEM SAYS` header
      translated, literal stem phrases left in English per convention), Concepts
      tab (59 concepts with translated titles/insights), a full live exam round
      (Exam by Domain → question counter, sidebar unit label), and the donate
      button/modal (including "Banca 1/2/3", naturally translated) all render
      correctly in Italian with **zero console errors**. Screenshot the record.
      - **Bug found and fixed during the T005b quality gate**: the word
        "context" was systematically left untranslated (26 occurrences) despite
        the German sibling consistently translating it to "Kontext" — the
        translating agent's own self-check treated it as a false-positive
        exception without verifying against German directly. Caught by a manual
        spot-check of the agent's residual flagged list rather than trusting its
        self-report at face value; fixed with a targeted regex pass
        (`context`→`contesto`, `Context`→`Contesto`, word-boundary-safe so it
        correctly skipped literal identifiers like `context_length_exceeded`),
        then manually repaired 5 compound phrases ("context window" →
        "contesto window") that the blind regex left grammatically broken,
        rephrasing them as "finestra di contesto". Lesson for future Romance-
        language rounds: **don't just accept an agent's self-reported
        under-translation gate results — spot-check a sample of its "verified
        exception" list against the reference sibling directly**, since a
        translating agent verifying its own work is prone to rationalizing
        genuine gaps as acceptable exceptions.
- [x] T014 [US3] Update `CHANGELOG.md` documenting the Italian addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to Italian.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
- Continue running the pre-injection English-word-overlap-vs-`de.json` diff gate
  (T005b) for every future round — standing process since the Russian round,
  added after the Hindi round's post-hoc-discovered under-translation bug.
