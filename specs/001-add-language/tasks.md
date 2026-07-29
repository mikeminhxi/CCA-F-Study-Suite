# Tasks: Add German (Deutsch) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to German)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 5 below) plus scripted structural validation (JSON key-parity checks).

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009 — this round runs `/speckit-plan` → `/speckit-tasks` *before*
`fetch-language-dictionary`/`add-language`, same as the Korean, Portuguese, and
French rounds.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all nine
      prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from `window.__I18N__`/
      `window.__SHELL__` in `index.html` — re-verify the exact count at
      implementation time per FR-002, since the baseline may have grown since
      French's round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship German end-to-end as a Tier 1 drop-in language (Latin script, no new
layout mechanics).

**Independent Test**: App opens correctly, the `de` dictionary has full key parity
against the current baseline, and all nine existing READMEs plus the dropdown
reflect German in the correct order.

- [x] T003 [US1] Translate all current `i18n` + `shell` keys into German via
      `fetch-language-dictionary`, following established conventions (keep technical
      terms in English — `agentic loop`, `stop_reason`, `tool_choice`, MCP, CLAUDE.md,
      Grep/Glob, etc.; leave `IF THE STEM SAYS` stem phrases untranslated).
- [x] T004 [US1] Determine dynamic-string metadata: `qsUnit` (German unit word for
      "questions", e.g. `'Fragen'`), `noSpaceBeforeUnit: false` (Latin script, same
      as Spanish/Vietnamese/Portuguese/French), `questionFmt`, `nativeName: 'Deutsch'`,
      `sortHint: 'latin'`.
- [x] T005 [US1] Validate the staged dictionary for exact key-set parity against the
      current baseline (case-sensitive check) before writing `translations/de.json`.
- [x] T006 [US1] Inject `window.__I18N_DE__` / `window.__SHELL_DE__` into
      `index.html` via a brace-depth-aware scripted JSON edit, pretty-printed
      multi-line to match the app's existing dictionary format.
- [x] T007 [US1] Wire `de` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT` (no
      no-space-before-unit rule change needed — Latin script, spaced like ES/VN/PT/FR).
- [x] T008 [US1] Add `<option value="de">Deutsch</option>` to `#lang-select` in the
      correct sort position — **between French and Português**, per alphabetical-by-
      English-name ordering (English, French, German, Portuguese, Spanish, Vietnamese,
      then the CJK group unchanged).
- [x] T009 [US1] Update all nine existing READMEs' switch-link row and Features
      bullet to include German, in dropdown order.
- [x] T010 [US1] Create `README.de.md` (full translation, mirroring the structure of
      the other nine READMEs, including the "Optional support" donation bullet).

**Checkpoint**: German is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; German needs no
layout work.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering mistakes before German is
considered shipped.

**Independent Test**: Key-count parity check passes across all 10 languages;
dropdown/README ordering is consistent; Learning Path, Study, Exam by Domain, and
Concepts tab all render correctly in German; the donate modal (nav button, results
banner) renders translated text with zero console errors.

- [x] T011 [US3] Re-parse all nine `__I18N_*__`/`__SHELL_*__` dicts from the HTML
      (including `de`); confirm valid JSON with matching key counts.
- [x] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/dropdown all
      reference `de`.
- [x] T013 [US3] Browser verification via headless Edge (`msedge --headless=new
      --screenshot`/`--dump-dom` against `file://`, since Node/Playwright/
      chromium-cli weren't available in this environment): confirmed Study Console
      Learning Path (5 domains → task statements in German), Cheat & Keywords
      core-principle cards and decision-rules table (`IF THE STEM SAYS` header
      translated, literal stem phrases left in English, matching French's
      convention), Concepts tab (59 concepts with translated titles/insights), and
      the donate button/modal (nav + panel, including "Bank 1/2/3" labels) all
      render correctly in German. Injected a `window.onerror` collector and
      round-tripped all 5 tabs (path/cheat/study/quiz/concepts) — zero console
      errors. Screenshots taken and reviewed.
- [x] T014 [US3] Update `CHANGELOG.md` documenting the German addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to German.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
