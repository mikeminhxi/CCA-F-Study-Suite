# Tasks: Add Malay (Bahasa Melayu) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Malay)

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
      fourteen prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from `window.__I18N__`/
      `window.__SHELL__` in `index.html` — confirmed 723 `i18n` + 5 `shell` keys,
      grown from 722 since the Indonesian round via the "Exam Domains"/"N
      questions available" translation fix.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Malay end-to-end as a Tier 1 drop-in language (Latin script, no
new layout mechanics).

**Independent Test**: App opens correctly, the `ms` dictionary has full key parity
against the current baseline, passes the pre-injection under-translation diff
gate against `de.json`, and all fourteen existing READMEs plus the dropdown reflect
Malay in the correct order.

- [x] T003 [US1] Translate all current `i18n` + `shell` keys into Malay via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`, `tool_choice`,
      MCP, CLAUDE.md, Grep/Glob, etc.; leave `IF THE STEM SAYS` stem phrases
      untranslated; translate general nouns/headings fully into Malay rather
      than leaving them mostly in English — the specific defect found in the
      Hindi round). Translate from the English source directly — do not
      mechanically derive from `translations/id.json`; Malay and Indonesian
      are distinct standardized languages despite mutual intelligibility.
- [x] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Malay unit word
      for "questions"), `noSpaceBeforeUnit: false` (Latin script, same as
      ES/VN/PT/FR/DE/IT/ID), `questionFmt`, `questionsAvailableFmt` (new since
      the Indonesian round's follow-up fix), `nativeName: 'Bahasa Melayu'`,
      `sortHint: 'latin'`.
- [x] T005 [US1] Validate the staged dictionary for exact key-set parity against
      the current baseline (case-sensitive check) before writing
      `translations/ms.json`.
- [x] T005b [US1] **Standing quality gate (since the Russian round)**: run an
      English-word-overlap diff of the staged `ms.json` against `de.json` (a
      known-complete sibling) *before* injecting into `index.html`. Fix any
      flagged keys in the staged file first. Per the Italian round's lesson,
      manually spot-check a sample of the translating agent's own "verified
      exception" list against `de.json` directly — do not trust the agent's
      self-report at face value.
- [x] T006 [US1] Inject `window.__I18N_MS__` / `window.__SHELL_MS__` into
      `index.html` via a brace-depth-aware scripted JSON edit, pretty-printed
      multi-line to match the app's existing dictionary format.
- [x] T007 [US1] Wire `ms` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT`, and
      the other dynamic-format tables (`SCORE_SOFAR_FMT`, `BIGSCORE_FMT`,
      `ALLCORRECT_FMT`, `RETAKEALL_FMT`, `RETAKEMISSED_FMT`, `NOTTHISTIME_FMT`,
      `QUESTIONS_AVAILABLE_FMT`) — no no-space-before-unit rule change needed,
      Latin script, spaced like ES/VN/PT/FR/DE/IT/ID.
- [x] T008 [US1] Add `<option value="ms">Bahasa Melayu</option>` to
      `#lang-select` in the correct sort position — **between Italiano and
      Português**, per alphabetical-by-English-name ordering (English, French,
      German, Indonesian, Italian, Malay, Portuguese, Spanish, Vietnamese, then
      the CJK/Devanagari/Cyrillic groups unchanged).
- [x] T009 [US1] Update all fourteen existing READMEs' switch-link row and
      Features bullet to include Malay, in dropdown order.
- [x] T010 [US1] Create `README.ms.md` (full translation, mirroring the structure
      of the other fourteen READMEs, including the "Optional support" donation
      bullet).

**Checkpoint**: Malay is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; Malay needs
no layout work.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation mistakes
before Malay is considered shipped.

**Independent Test**: Key-count parity check passes across all 15 languages;
under-translation diff gate passes; dropdown/README ordering is consistent;
Learning Path, Cheat & Keywords, Exam by Domain (including a live exam round
through to the question screen and the "Exam Domains"/"N questions available"
strings), and Concepts tab all render correctly in Malay; the donate modal
(nav button, panel) renders translated text with zero console errors.

- [x] T011 [US3] Re-parse all fourteen `__I18N_*__`/`__SHELL_*__` dicts from the
      HTML (including `ms`); confirm valid JSON with matching key counts.
- [x] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/other dynamic
      FMT tables/dropdown all reference `ms`.
- [x] T013 [US3] Browser verification via headless Edge driven over the
      DevTools Protocol (Node's native WebSocket; Playwright/Puppeteer/
      chromium-cli aren't installed in this environment): confirm Study
      Console Learning Path (5 domains → task statements in Malay), Cheat &
      Keywords core-principle cards and decision-rules table (`IF THE STEM
      SAYS` header translated, literal stem phrases left in English per
      convention), Concepts tab (59 concepts with translated titles/insights),
      a full live exam round (Exam by Domain → question counter, sidebar unit
      label, "Exam Domains" heading, "N questions available" counter), and
      the donate button/modal all render correctly in Malay with **zero
      console errors**. Screenshot the record.
- [x] T014 [US3] Update `CHANGELOG.md` documenting the Malay addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to
Malay.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
- Continue running the pre-injection English-word-overlap-vs-`de.json` diff gate
  (T005b) for every future round — standing process since the Russian round,
  and continue the manual spot-check of the agent's self-reported exceptions
  added after the Italian round's under-translation incident.
- Confirmed distinctness reminder from this round: closely-related language
  pairs (Malay/Indonesian) should each be translated from the English source
  independently, not derived from each other — unlike the Simplified/
  Traditional Chinese script-conversion case, where mechanical derivation is
  the *correct* approach because they're the same language in two scripts.
