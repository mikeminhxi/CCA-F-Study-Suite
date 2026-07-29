# Tasks: Add Hindi (हिन्दी) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to Hindi)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 5 below) plus scripted structural validation (JSON key-parity checks).

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009 — this round runs `/speckit-plan` → `/speckit-tasks` *before*
`fetch-language-dictionary`/`add-language`, same as the Korean, Portuguese, French,
and German rounds.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all ten
      prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from `window.__I18N__`/
      `window.__SHELL__` in `index.html` — confirmed 715 `i18n` + 5 `shell` keys,
      unchanged since the German round.

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship Hindi end-to-end as a Tier 2 language — first Devanagari-script
addition, no RTL layout work needed (LTR script).

**Independent Test**: App opens correctly, the `hi` dictionary has full key parity
against the current baseline, and all ten existing READMEs plus the dropdown
reflect Hindi in the correct (new, confirmed-with-maintainer) trailing position.

- [x] T003 [US1] Translate all current `i18n` + `shell` keys into Hindi via
      `fetch-language-dictionary`, following established conventions (keep technical
      terms in English — `agentic loop`, `stop_reason`, `tool_choice`, MCP, CLAUDE.md,
      Grep/Glob, etc.; leave `IF THE STEM SAYS` stem phrases untranslated).
- [x] T004 [US1] Determine dynamic-string metadata: `qsUnit` (Hindi unit word for
      "questions", e.g. `'प्रश्न'`), `noSpaceBeforeUnit` (decide based on Hindi
      convention — space-separated like Latin scripts, since Devanagari uses spaces
      between words), `questionFmt`, `nativeName: 'हिन्दी'`, `sortHint: 'devanagari'`
      (new value — first non-Latin, non-CJK script; not covered by the two existing
      sortHint groups).
- [x] T005 [US1] Validate the staged dictionary for exact key-set parity against the
      current baseline (case-sensitive check) before writing `translations/hi.json`.
- [x] T006 [US1] Inject `window.__I18N_HI__` / `window.__SHELL_HI__` into
      `index.html` via a brace-depth-aware scripted JSON edit, pretty-printed
      multi-line to match the app's existing dictionary format.
- [x] T007 [US1] Wire `hi` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT`.
- [x] T008 [US1] Add `<option value="hi">हिन्दी</option>` to `#lang-select` **at the
      very end, after 한국어** — confirmed with the maintainer this round: since
      Hindi is neither Latin nor CJK, script-family groups are appended in the order
      introduced (Latin group → CJK group → new Devanagari group), rather than
      merged alphabetically into either existing group. This precedent carries
      forward for any future single-language script family.
- [x] T009 [US1] Update all ten existing READMEs' switch-link row and Features
      bullet to include Hindi, in dropdown order (at the end).
- [x] T010 [US1] Create `README.hi.md` (full translation, mirroring the structure of
      the other ten READMEs, including the "Optional support" donation bullet).

**Checkpoint**: Hindi is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; Devanagari is
LTR, so Hindi needs no layout work, only a new script-family grouping decision for
the dropdown/README ordering, captured above.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering mistakes before Hindi is
considered shipped.

**Independent Test**: Key-count parity check passes across all 11 languages;
dropdown/README ordering is consistent; Learning Path, Cheat & Keywords, Exam by
Domain (including a live exam round through to the question screen), and Concepts
tab all render correctly in Hindi; the donate modal (nav button, panel) renders
translated text with zero console errors.

- [x] T011 [US3] Re-parse all ten `__I18N_*__`/`__SHELL_*__` dicts from the HTML
      (including `hi`); confirm valid JSON with matching key counts.
- [x] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/dropdown all
      reference `hi`.
- [x] T013 [US3] Browser verification via headless Edge (`msedge --headless=new
      --screenshot`/`--dump-dom` against `file://`, since Node/Playwright/
      chromium-cli aren't available in this environment): confirm Study Console
      Learning Path (5 domains → task statements in Hindi), Cheat & Keywords
      core-principle cards and decision-rules table (`IF THE STEM SAYS` header
      translated, literal stem phrases left in English per convention), Concepts
      tab (59 concepts with translated titles/insights), a full live exam round
      (Exam by Domain → question counter, sidebar unit label) in Devanagari
      rendering correctly with no glyph/font fallback issues, and the donate
      button/modal (including "Bank 1/2/3" labels) all render correctly in Hindi
      with **zero console errors**. Screenshot the record.
      - **Bug found and fixed during verification** (specific to this round's first
        translation pass, not a pre-existing app bug): the first `hi.json` draft
        under-translated 148 keys — mostly section headings, domain names, and
        concept titles — leaving whole English phrases untouched except swapping a
        conjunction ("&" → "और") or adding a possessive particle ("का"), instead of
        translating the general nouns (e.g. `"Agentic Architecture"` stayed
        completely untranslated instead of becoming "एजेंटिक आर्किटेक्चर"). Caught by
        diffing English-word-overlap ratio against the German sibling dictionary as
        a completeness bar. Fixed by a targeted re-translation pass on exactly those
        148 keys (146 changed; 2 legitimately left as-is — `"Coordinator"` and
        `"+ the"`, where Hindi has no definite article to translate, matching how
        the other non-German siblings handle the same two slots), then re-injected
        into `index.html`. Re-verified: flagged-key count dropped from 144 to 9, and
        the remaining 9 are minor stylistic loanword choices, not omissions.
- [x] T014 [US3] Update `CHANGELOG.md` documenting the Hindi addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to Hindi
(Devanagari is LTR).

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
- This round establishes the trailing-script-group precedent for `sortHint` values
  beyond `latin`/`cjk` — reuse `devanagari` for Hindi-adjacent additions, or mint a
  new trailing group name for a genuinely different script family.
