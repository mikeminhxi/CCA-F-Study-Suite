# Tasks: Add Korean (한국어) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Korean)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 3 below) plus scripted structural validation (JSON key-parity checks).

**Organization**: Tasks grouped by user story per `spec.md`, retrofitted to reflect
work already completed on `feat/add-korean-language`. This plan/tasks pair was
generated *after* implementation, to retroactively satisfy FR-009 (spec-kit round
required per language) for a language shipped before that requirement existed.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already added earlier this session,
      prior to this language round).

## Phase 2: Foundational

- [x] T002 Extract the canonical 526-key + 5-shell-key baseline from
      `window.__I18N__`/`window.__SHELL__` in `cca-f-study-suite.html`.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Korean end-to-end as a Tier 1 drop-in language (CJK-adjacent for
ordering purposes, no new layout mechanics).

**Independent Test**: App opens correctly, the `ko` dictionary has full key
parity, and all six READMEs plus the dropdown reflect Korean in the correct order.

- [x] T003 [US1] Translate all 526 `i18n` + 5 `shell` keys into Korean via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English; leave `IF THE STEM SAYS` stem phrases
      untranslated).
- [x] T004 [US1] Determine dynamic-string metadata: `qsUnit: '문항'`,
      `noSpaceBeforeUnit: true`, `questionFmt`, `nativeName: '한국어'`,
      `sortHint: 'cjk'`.
- [x] T005 [US1] Validate the staged dictionary for exact key-set parity against
      the baseline (case-sensitive check) before writing `translations/ko.json`.
- [x] T006 [US1] Inject `window.__I18N_KO__` / `window.__SHELL_KO__` into
      `cca-f-study-suite.html` via a PowerShell JSON-parsing script
      (brace-depth-safe), pretty-printed multi-line to match the app's existing
      dictionary format.
- [x] T007 [US1] Wire `ko` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT`, and
      the CJK no-space-before-unit rule.
- [x] T008 [US1] Add `<option value="ko">한국어</option>` to `#lang-select` in the
      correct sort position (end of the CJK group, alphabetical by English name:
      Chinese Simplified, Chinese Traditional, Japanese, Korean).
- [x] T009 [US1] Update all six existing READMEs' switch-link row and Features
      bullet to include Korean.
- [x] T010 [US1] Create `README.ko.md` (full translation, mirroring the structure
      of the other six READMEs).

**Checkpoint**: Korean is fully wired and documented; not yet merged to `main`
(PR #1 open).

*(User Story 2 — RTL languages — is not applicable to this round; Korean needs no
layout work.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering mistakes before Korean is
considered shipped.

**Independent Test**: Key-count parity check passes; dropdown/README ordering is
consistent.

- [x] T011 [US3] Re-parse all six `__I18N_*__`/`__SHELL_*__` dicts from the HTML;
      confirm valid JSON with matching key counts (526 + 5 each).
- [x] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/dropdown all
      reference `ko`.
- [ ] T013 [US3] **Outstanding.** Manual browser verification: switch to 한국어
      and confirm the Study Console nav, Cheat & Keywords core-principle cards,
      decision-rules table, and a few Exam by Domain quiz tags render in Korean
      with no leftover English, and that question counters render with no space
      before 문항. No browser-automation tooling (`chromium-cli`/Playwright) was
      available in this environment to confirm programmatically; the app was
      opened locally for the maintainer to check, but visual confirmation is not
      yet recorded here. **Do not mark this done without an actual look.**
- [x] T014 [US3] Update `CHANGELOG.md` documenting the Korean addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to Korean.

## Notes

- T013 is intentionally left unchecked — it's real outstanding work, not a
  formality. Merging PR #1 before it's done means shipping the possibility of a
  missed dictionary entry (the exact failure mode Story 3 exists to catch).
- Future languages: run `/speckit-plan` → `/speckit-tasks` for that language
  *before* running `fetch-language-dictionary`/`add-language`, not after.
