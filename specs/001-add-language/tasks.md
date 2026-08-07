# Tasks: Add Hebrew (עברית) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Hebrew)

**Prerequisites**: `plan.md` (this round), `spec.md`, the merged RTL layout
foundation (`feat/add-rtl-layout-support`, already on `main`), Arabic (already on
`main`, PR #39 — proof the foundation works end-to-end).

**Tests**: No automated test suite; verification is manual (Phase 5 below) plus
scripted structural validation.

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009.

## Phase 1: Setup

- [x] T001 Confirm the RTL layout foundation is merged to `main` AND that Arabic
      (the first real RTL language) shipped cleanly with zero layout gaps found
      during its verification — both true, so this round adds no further layout
      engineering, exactly like Arabic's round.

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from
      `translations/vn.js` — confirmed 723 `i18n` + 5 `shell` keys + 8 format
      functions, unchanged since the Dutch round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Hebrew end-to-end. Mechanically this is User Story 1 (translation +
wiring) — the RTL layout engineering already landed and was already proven by
Arabic — plus `dir: "rtl"` and Hebrew-specific verification through the real UI.

**Independent Test**: App opens correctly, `translations/he.js` has full key parity
against the current baseline, passes the pre-wiring under-translation diff gate
against `de.js` (adapted for non-Latin script, same as Arabic), sets `dir: "rtl"`,
and all 22 existing READMEs plus the dropdown reflect Hebrew in the correct position
(at the very end, after العربية).

- [ ] T003 [US1] Translate all current `i18n` + `shell` keys into Hebrew via
      `fetch-language-dictionary`, following established conventions (keep
      technical terms in English — `agentic loop`, `stop_reason`, `tool_choice`,
      MCP, CLAUDE.md, Grep/Glob, etc. — as Latin-script loanwords embedded in the
      Hebrew sentence, exactly matching how Arabic and every other language handled
      them; `content.js`'s shared `RULES` data is never translated for any
      language and isn't touched here — only the `IF THE STEM SAYS` UI column
      header i18n key gets translated, same as every other language).
- [ ] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Hebrew word for
      "questions" in the correct grammatical form for this app's counter usage),
      `noSpaceBeforeUnit` (verify correct value for Hebrew — check the established
      pattern: only CJK languages set `true`, every other language including
      Arabic sets `false`), the 8 `*Fmt` functions (translate with correct Hebrew
      grammar/number agreement), `nativeName: 'עברית'`, `sortHint: 'hebrew-rtl'`
      (new value, following Arabic's `<script>-rtl` naming convention), and
      `dir: 'rtl'` (second language to set this field, after Arabic).
- [ ] T005 [US1] Validate the written `translations/he.js` for exact key-set parity
      against the current baseline and that all 8 `*Fmt` fields are real functions,
      via `vm.runInNewContext`.
- [ ] T005b [US1] **Standing quality gate, adapted for a non-Latin script** (same
      approach as Arabic's round): run the English-word-overlap regex pass against
      `de.js` as the technical-term-retention reference, AND have the translating
      agent do a genuine second read-through of a broad sample of Hebrew values
      (not just the flagged exceptions) checking for terminology consistency,
      correct grammar, and register. Do not trust either pass's self-report at
      face value.
- [ ] T006 [US1] Add `<option value="he">עברית</option>` to `#lang-select`,
      positioned **at the very end, after العربية** (new trailing RTL group).
- [ ] T007 [US1] Update all 22 existing READMEs' switch-link row and Features
      bullet to include Hebrew, in the same position.
- [ ] T008 [US1] Create `README.he.md` (full translation, mirroring the structure
      of the other 22 READMEs — use `README.ar.md` as the closest structural
      template since it already solved the RTL-README-on-GitHub problem: body
      wrapped in `<div dir="rtl">`, switch-link row kept LTR-ordered for
      cross-file consistency).

**Checkpoint**: Hebrew is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL layout engineering — already complete, shipped in
`feat/add-rtl-layout-support` and proven by Arabic. This round consumes that
foundation rather than building or re-proving it.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering/under-translation/RTL-rendering
mistakes before Hebrew is considered shipped — verification must confirm RTL
actually engages correctly through the real UI (select Hebrew from the dropdown),
same as Arabic's round.

**Independent Test**: Key-count parity check passes across all 23 languages;
under-translation diff gate passes; dropdown/README ordering is consistent; Learning
Path, Cheat & Keywords, Concepts, Exam by Domain, and 2-Week Plan tabs, plus the
donate modal, all render correctly in Hebrew (translated text, right-to-left layout
engaged automatically), with zero console errors.

- [ ] T009 [US3] Re-parse all 23 `translations/<code>.js` files (including `he`)
      via `vm.runInNewContext`; confirm valid JS with matching key counts, all 8
      `*Fmt` fields present as functions, and `dir: 'rtl'` present only on `ar.js`
      and `he.js`.
- [ ] T010 [US3] Confirm `#lang-select` references `he` in the correct position and
      `loadLang()` resolves `window.__LANG_HE__` correctly.
- [ ] T011 [US3] Browser verification (Playwright, including via `file://`) —
      select Hebrew through the actual `#lang-select` dropdown (not a forced `dir`
      attribute): confirm `document.documentElement`'s `dir` attribute becomes
      `"rtl"` automatically, Study Console Learning Path, Cheat & Keywords
      core-principle cards and decision-rules table (arrows visually flip; the
      `IF THE STEM SAYS` header is translated while literal stem-phrase content in
      `content.js`'s `RULES` data stays English), Concepts tab, Exam by Domain,
      2-Week Plan, and the donate modal all render correctly in Hebrew with
      **zero console errors**.
- [ ] T012 [US3] Update `CHANGELOG.md` documenting the Hebrew addition.
- [ ] T013 [US3] Check off Hebrew in `SPEC_KIT_INTEGRATION_PLAN.md` §5's Tier 3
      list — this completes Tier 3 entirely (both Arabic and Hebrew shipped).

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential) → User Story 3 verification. User
Story 2 (RTL layout engineering) already complete on `main`, not repeated here.

## Notes

- This completes all languages requested in the current batch (RTL foundation →
  Arabic → Hebrew) and all of Tier 3 from `SPEC_KIT_INTEGRATION_PLAN.md` §5. Future
  languages would need a fresh prioritization pass (no remaining ranked candidates
  in Tier 1/2/3 after this round).
- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
