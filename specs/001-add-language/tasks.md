# Tasks: Add Arabic (العربية) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Arabic)

**Prerequisites**: `plan.md` (this round), `spec.md`, the merged RTL layout
foundation (`feat/add-rtl-layout-support`, already on `main`).

**Tests**: No automated test suite; verification is manual (Phase 5 below) plus
scripted structural validation.

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009.

## Phase 1: Setup

- [x] T001 Confirm the RTL layout foundation is merged to `main` (verified —
      `window.__setLang__` already reads a `dir` field and sets
      `document.documentElement`'s `dir` attribute; `style.css` already mirrors
      correctly under `dir="rtl"`). This round adds no further layout engineering.

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from
      `translations/vn.js` — confirmed 723 `i18n` + 5 `shell` keys + 8 format
      functions, unchanged since the Dutch round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Arabic end-to-end. Mechanically this is User Story 1 (translation +
wiring), not User Story 2 (layout engineering) — that engineering already landed —
plus one new field (`dir: "rtl"`) and Arabic-specific verification (RTL rendering
through the real UI, not forced).

**Independent Test**: App opens correctly, `translations/ar.js` has full key parity
against the current baseline, passes the pre-wiring under-translation diff gate
against `de.js` (adapted for non-Latin script — see below), sets `dir: "rtl"`, and
all 21 existing READMEs plus the dropdown reflect Arabic in the correct position (at
the very end, after Ελληνικά).

- [ ] T003 [US1] Translate all current `i18n` + `shell` keys into Arabic via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`, `tool_choice`,
      MCP, CLAUDE.md, Grep/Glob, etc. — these typically stay as Latin-script
      loanwords embedded in the Arabic sentence, matching how every other
      language's round has handled them; leave `IF THE STEM SAYS` stem phrases'
      literal content in `content.js`'s shared `RULES` data untouched — that data
      file isn't part of any per-language dictionary and is never translated).
- [ ] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Arabic word for
      "questions" in the correct grammatical form/number agreement for this app's
      counter usage), `noSpaceBeforeUnit` (verify correct value for Arabic — check
      against how the reference languages set this flag and what it controls), the
      8 `*Fmt` functions (translate with correct Arabic numeral/grammar agreement),
      `nativeName: 'العربية'`, `sortHint: 'arabic-rtl'` (new value), and — new for
      this round — `dir: 'rtl'` (the first language to set this field; every prior
      language implicitly defaults to `'ltr'` by omitting it).
- [ ] T005 [US1] Validate the written `translations/ar.js` for exact key-set parity
      against the current baseline and that all 8 `*Fmt` fields are real functions,
      via `vm.runInNewContext`.
- [ ] T005b [US1] **Standing quality gate, adapted for a non-Latin script**: an
      automated English-word-overlap regex still catches accidentally-untranslated
      Latin-script UI copy the same way it did for every prior language, but it
      cannot verify Arabic *grammatical correctness* the way a native-script eyeball
      check could for, say, German. Run the regex pass (against `de.js` as the
      technical-term-retention reference, same as every round), AND have the
      translating agent do a genuine second read-through of a meaningful sample of
      Arabic values (not just the flagged exceptions) checking for consistency,
      correct RTL punctuation/number handling, and register (formal instructional
      tone, matching the other 21 languages). Do not trust either pass's self-report
      at face value — this is the same standing lesson from the Italian round,
      applied to a script where the cheap regex heuristic alone is weaker than
      usual.
- [ ] T006 [US1] Add `<option value="ar">العربية</option>` to `#lang-select`,
      positioned **at the very end, after Ελληνικά** (new trailing RTL group).
- [ ] T007 [US1] Update all 21 existing READMEs' switch-link row and Features
      bullet to include Arabic, in the same position.
- [ ] T008 [US1] Create `README.ar.md` (full translation, mirroring the structure
      of the other 21 READMEs, written right-to-left — decide during implementation
      whether the switch-link header row itself stays LTR-ordered for consistency
      with every other README, or flips; document the decision made).

**Checkpoint**: Arabic is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL layout engineering — already complete, shipped in
`feat/add-rtl-layout-support`. This round consumes that foundation rather than
building it.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation/RTL-rendering
mistakes before Arabic is considered shipped — this is the first language where
verification must also confirm RTL actually engages correctly through the real UI
(select Arabic from the dropdown), not just that the dictionary has key parity.

**Independent Test**: Key-count parity check passes across all 22 languages;
under-translation diff gate passes; dropdown/README ordering is consistent; Learning
Path, Cheat & Keywords, Concepts, Exam by Domain, and 2-Week Plan tabs, plus the
donate modal, all render correctly in Arabic (translated text, right-to-left layout
engaged automatically), with zero console errors.

- [ ] T009 [US3] Re-parse all 22 `translations/<code>.js` files (including `ar`)
      via `vm.runInNewContext`; confirm valid JS with matching key counts, all 8
      `*Fmt` fields present as functions, and `dir: 'rtl'` present only on `ar.js`.
- [ ] T010 [US3] Confirm `#lang-select` references `ar` in the correct position and
      `loadLang()` resolves `window.__LANG_AR__` correctly.
- [ ] T011 [US3] Browser verification (Playwright, including via `file://`) —
      **select Arabic through the actual `#lang-select` dropdown** (not a forced
      `dir` attribute, unlike the foundation round's verification, since a real RTL
      language now exists to exercise the real path): confirm
      `document.documentElement`'s `dir` attribute becomes `"rtl"` automatically,
      Study Console Learning Path, Cheat & Keywords core-principle cards and
      decision-rules table (arrows visually flip; the `IF THE STEM SAYS` header is
      translated while literal stem-phrase content in `content.js`'s `RULES` data
      stays English, exactly as with every other language), Concepts tab, Exam by
      Domain, 2-Week Plan, and the donate modal all render correctly in Arabic with
      **zero console errors**.
- [ ] T012 [US3] Update `CHANGELOG.md` documenting the Arabic addition.
- [ ] T013 [US3] Check off Arabic in `SPEC_KIT_INTEGRATION_PLAN.md` §5's Tier 3
      list.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential) → User Story 3 verification. User
Story 2 (RTL layout engineering) already complete on `main`, not repeated here.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
- Hebrew (next, after this round merges) follows this exact same pattern — it also
  only needs translation + wiring (`dir: 'rtl'`, `sortHint` likely a new
  `'hebrew-rtl'` value, positioned after Arabic since scripts are appended in
  introduction order) — no further layout engineering expected, per the maintainer's
  chosen Tier 3 PR order (RTL foundation → Arabic → Hebrew).
- If Arabic's verification surfaces a genuine RTL layout gap the foundation round
  missed, fix it here, but flag it prominently in this round's PR body — it's a
  signal the foundation's own audit (see its `plan.md`/`tasks.md`, recoverable via
  `git log`) wasn't fully complete, useful context for whoever does the Hebrew round.
