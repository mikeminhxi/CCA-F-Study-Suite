# Tasks: Add French (Français) Language

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to French)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite exists for this app; verification is manual
(Phase 5 below) plus scripted structural validation (JSON key-parity checks).

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per FR-009 — this round runs `/speckit-plan` → `/speckit-tasks` *before*
`fetch-language-dictionary`/`add-language`, same as the Korean and Portuguese rounds.

## Phase 1: Setup

- [x] T001 Confirm `translations/` schema and the `fetch-language-dictionary`/
      `add-language` skills are in place (already established; used for all eight
      prior languages).

## Phase 2: Foundational

- [x] T002 Extract the canonical current-baseline key set from `window.__I18N__`/
      `window.__SHELL__` in `index.html` (715 `i18n` + 5 `shell` keys as of this
      round — re-verify at implementation time, since the baseline has grown since
      Portuguese's round due to the donation-feature work: "Found this useful?",
      "Free and open-source practice questions.", "Bank 1"/"Bank 2"/"Bank 3", and the
      "☕ Buy me a coffee" strings are now part of the i18n-covered key set and must be
      included in French's translation).

## Phase 3: User Story 1 - Add a drop-in language (Priority: P1) 🎯 MVP

**Goal**: Ship French end-to-end as a Tier 1 drop-in language (Latin script, no new
layout mechanics).

**Independent Test**: App opens correctly, the `fr` dictionary has full key parity
against the current baseline, and all eight existing READMEs plus the dropdown
reflect French in the correct order.

- [x] T003 [US1] Translate all current `i18n` + `shell` keys into French via
      `fetch-language-dictionary`, following established conventions (keep technical
      terms in English — `agentic loop`, `stop_reason`, `tool_choice`, MCP, CLAUDE.md,
      Grep/Glob, etc.; leave `IF THE STEM SAYS` stem phrases untranslated).
- [x] T004 [US1] Determine dynamic-string metadata: `qsUnit` (French unit word for
      "questions", e.g. `'questions'`), `noSpaceBeforeUnit: false` (Latin script, same
      as Spanish/Vietnamese/Portuguese), `questionFmt`, `nativeName: 'Français'`,
      `sortHint: 'latin'`.
- [x] T005 [US1] Validate the staged dictionary for exact key-set parity against the
      current baseline (case-sensitive check) before writing `translations/fr.json`.
- [x] T006 [US1] Inject `window.__I18N_FR__` / `window.__SHELL_FR__` into
      `index.html` via a brace-depth-aware scripted JSON edit, pretty-printed
      multi-line to match the app's existing dictionary format.
- [x] T007 [US1] Wire `fr` into `MAPS`, `SHELLS`, `QS_UNIT`, `QUESTION_FMT` (no
      no-space-before-unit rule change needed — Latin script, spaced like ES/VN/PT).
- [x] T008 [US1] Add `<option value="fr">Français</option>` to `#lang-select` in the
      correct sort position — **between English and Português**, per alphabetical-by-
      English-name ordering (English, French, Portuguese, Spanish, Vietnamese, then
      the CJK group unchanged).
- [x] T009 [US1] Update all eight existing READMEs' switch-link row and Features
      bullet to include French, in dropdown order.
- [x] T010 [US1] Create `README.fr.md` (full translation, mirroring the structure of
      the other eight READMEs, including the "Optional support" donation bullet).

**Checkpoint**: French is fully wired and documented; not yet merged to `main`.

*(User Story 2 — RTL languages — is not applicable to this round; French needs no
layout work.)*

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches dictionary/ordering mistakes before French is
considered shipped.

**Independent Test**: Key-count parity check passes across all 9 languages;
dropdown/README ordering is consistent; Learning Path, Study, Exam by Domain, and
Concepts tab all render correctly in French; the donate modal (nav button, results
banner) renders translated text with zero console errors.

- [x] T011 [US3] Re-parse all eight `__I18N_*__`/`__SHELL_*__` dicts from the HTML
      (including `fr`); confirm valid JSON with matching key counts.
- [x] T012 [US3] Confirm `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`/dropdown all
      reference `fr`.
- [x] T013 [US3] Browser verification via Playwright (`file://`, no Node needed):
      confirm Study Console nav, Cheat & Keywords core-principle cards, decision-rules
      table (`IF THE STEM SAYS` left in English), Learning Path (5 domains → task
      statements in French), Concepts tab (59 concepts with translated titles/
      insights), the quiz counter, and the donate button/modal (nav + results banner,
      including "Bank 1/2/3" labels) all render correctly in French with **zero
      console errors**. Screenshot the record.
      - **Bug found and fixed** (pre-existing, affected all 8 other languages equally,
        not introduced by this addition): the Learning Path's per-domain progress line
        concatenated the translatable word "known" directly after a dynamic count
        (`` `${known}/${total} known` ``) into one un-matchable text node, so it never
        looked up the (already-translated) "known" dictionary key and silently stayed
        in English under every non-English language. Fixed by wrapping "known" in its
        own `<span>`, confirmed fixed for fr/es/pt/en.
      - **Flagged (not fixed here), pre-existing, affects all languages equally**:
        (a) the exam-setup "Exam Domains" heading and the "N questions available"
        counter are literal English strings with no matching dictionary key at all
        (not even in the baseline) — fixing requires either adding new keys (needing a
        decision on backfilling the other 8 languages) or changing the English source
        copy, both out of scope for a language-addition round; (b) the Study Hub's
        "Rapid Decoder" table pulls some cell fragments from a source that was never
        wired into any language's dictionary (confirmed absent from the baseline for
        every language), so those specific fragments stay in English under every
        language; (c) the Neuron Map's node labels (`leaves`/`synapses` array) were
        never wired into any dictionary either — same story as the Korean round's
        originally-flagged gap; the blueprint-taxonomy restructure (PR #3/#4) fixed
        domain names/task-statement/concept titles but not this specific array. All
        three are tracked here as a follow-up, not specific to French.
- [x] T014 [US3] Update `CHANGELOG.md` documenting the French addition.

## Dependencies & Execution Order

Setup → Foundational → User Story 1 (sequential, single-maintainer session) →
User Story 3 verification. User Story 2 (RTL) skipped — not applicable to French.

## Notes

- Future languages: continue running `/speckit-plan` → `/speckit-tasks` for that
  language *before* `fetch-language-dictionary`/`add-language`.
