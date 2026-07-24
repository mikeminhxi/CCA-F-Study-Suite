---
description: "Task list for the Blueprint Taxonomy Restructure"
---

# Tasks: Blueprint Taxonomy Restructure

**Input**: Design documents from `specs/002-blueprint-taxonomy/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/taxonomy-data.md`, `quickstart.md`

**Tests**: No automated unit suite exists for this app (Constitution / plan).
Verification is structural (PowerShell + `System.Text.Json`) plus end-to-end
manual/Playwright — captured as explicit tasks, not a TDD test suite.

**Organization**: Grouped by user story (US1 P1, US2 P2, US3 P3) after the
shared setup and foundational data work that all stories depend on.

**Single-file note**: unless stated otherwise, every code task edits the one
app file `cca-f-study-suite.html`; all edits to its large inline literals go
through brace-depth-aware scripts (Constitution Principle IV), not raw Edit.

## Phase 1: Setup

- [x] T001 Fidelity pass: re-read the five prepgenaicerts.com domain pages and
      record, in `specs/002-blueprint-taxonomy/data-model.md`, each concept's
      verbatim title, one-line insight, parent task statement, and level
      (Foundation/Intermediate/Advanced). Must reconcile to per-domain counts
      12/8/10/14/15 (59 total) before any app edit.
- [x] T002 [P] Write the reusable structural validation script to
      `scratchpad/pw_validate_taxonomy.ps1` (PowerShell + `System.Text.Json`)
      asserting the invariants in `contracts/taxonomy-data.md` (30/59, per-domain
      counts, `ts` referential integrity, every `QDATA[].ts` in range, all six
      `__I18N_*__` dicts still parse) and printing the per-ts/per-domain
      question distribution.

## Phase 2: Foundational (blocking prerequisites for all stories)

**Purpose**: Land the taxonomy data model + question re-tagging that every user
story reads from. No user story can start until this is complete.

- [x] T003 Inject `TASK_STATEMENTS` (30 entries, titles from `data-model.md`)
      into the data `<script>` (~L4413) of `cca-f-study-suite.html` via a
      brace-depth-aware script.
- [x] T004 Inject `CONCEPTS` (59 entries from the T001 fidelity pass) into
      `cca-f-study-suite.html`.
- [x] T005 Update `DOMAIN_INFO` (~L4415) labels to official names and remove the
      synthetic `MIX` entry in `cca-f-study-suite.html`.
- [x] T006 Produce the reviewable `question-id → ts` mapping at
      `scratchpad/qtag_map.json`: first-pass heuristic from each question's old
      module (`q.c`), then per-question review of all 157; print the resulting
      per-ts and per-domain distribution and sanity-check it before applying.
- [x] T007 Apply `qtag_map.json`: add a `ts` field to each of the 157 `QDATA`
      objects in `cca-f-study-suite.html` via a brace-depth-aware PowerShell
      JSON script.
- [x] T008 Remove `PHASES` and `MODULE_DOMAIN`; add derived indexes `Q_BY_TS`,
      `TS_BY_DOMAIN`, `CONCEPTS_BY_TS` alongside the existing `MODS` pattern
      (~L4457) in `cca-f-study-suite.html`.
- [x] T009 Run `scratchpad/pw_validate_taxonomy.ps1`; confirm all invariants
      pass (30/59, counts 7/5/6/6/6 and 12/8/10/14/15, every `ts` valid, all
      157 tagged, dictionaries parse). Fix data until green.

**Checkpoint**: taxonomy data + tagging are correct and validated; UI still
renders the old way (nothing rewired yet).

## Phase 3: User Story 1 - Study along the official exam blueprint (Priority: P1) 🎯 MVP

**Goal**: Domains → task statements become the primary navigation across
Learning Path, Study, Quiz (and the Neuron Map), pooling the re-tagged
questions by task statement.

**Independent Test**: Learning Path lists 5 domains (weight order) → task
statements with progress; Study and Exam-by-Domain pool by task statement; a
scored run completes with explanations on misses.

- [x] T010 [US1] Rewire `renderPath()` (~L4472) to iterate `DOMAIN_INFO`
      (weight order D1→D5) → `TS_BY_DOMAIN`, rendering per-domain and per-task-
      statement known/total progress, in `cca-f-study-suite.html`.
- [x] T011 [US1] Rewire Study-mode pool/filter to domain / task statement using
      `Q_BY_TS`, and add the non-domain "Mixed / Applied" filter (saved multi-ts
      selection), in `cca-f-study-suite.html`.
- [x] T012 [US1] Rewire the Exam-by-Domain quiz builder (~L4680) so chips are
      task statements grouped under their domains (label = title + count from
      `Q_BY_TS`), reusing the domain-header toggle; change the quiz meta line
      (~L4728) to show the question's task-statement title instead of `q.c`, in
      `cca-f-study-suite.html`.
- [x] T013 [US1] Rewire the Neuron Map `domains[]` `leaves` (~L4865) to each
      domain's task statements and re-point `synapses` to task-statement ids, in
      `cca-f-study-suite.html`.
- [x] T014 [US1] Browser-check US1 (Playwright, `file://`): Learning Path, Study
      filter, Exam-by-Domain run, Mixed/Applied filter, Neuron Map render; zero
      console errors.

**Checkpoint**: the app is fully usable on the new taxonomy end-to-end (MVP).

## Phase 4: User Story 2 - Browse the concept library (Priority: P2)

**Goal**: A new Study Console tab lists all 59 concepts by domain → task
statement with insight + level.

**Independent Test**: `concepts` tab present; 59 concepts grouped correctly,
each with an insight and a level chip; per-domain counts 12/8/10/14/15.

- [x] T015 [US2] Add the `concepts` tab: `#tabs` button, `#v-concepts` view
      container, extend the `views` map and tab-click handler
      (`path/cheat/study/quiz/concepts`), in `cca-f-study-suite.html`.
- [x] T016 [US2] Render the concept library from `CONCEPTS` grouped by domain →
      task statement, each row showing title, insight, and a
      Foundation/Intermediate/Advanced level chip, with theme-aware styles
      (Light + Dark), in `cca-f-study-suite.html`.
- [x] T017 [US2] Browser-check the Concepts tab (Playwright) including a
      Light/Dark theme-parity pass; zero console errors.

## Phase 5: User Story 3 - Trust that every question is correctly placed (Priority: P3)

**Goal**: Auditable confidence that re-tagging is complete and blueprint-correct.

**Independent Test**: validation report shows 0 untagged / 0 out-of-range;
per-domain distribution matches expectation; formerly mis-domained questions
(e.g. error-propagation) now resolve to the correct domain.

- [x] T018 [US3] Extend `scratchpad/pw_validate_taxonomy.ps1` to also flag every
      task statement with 0 questions and every question whose `ts`-derived
      domain differs from its old `MODULE_DOMAIN` domain; review the diff to
      confirm each change is a blueprint correction, not an error.
- [x] T019 [US3] In-browser spot review: run a quiz and confirm the meta line's
      task statement matches each question's content for a sample across all 5
      domains.

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T020 Update in-app copy that describes the retired structure (Learning
      Path lede, footer, any "N modules / phases" strings) to the new taxonomy,
      as English source keys flowing through the i18n engine, in
      `cca-f-study-suite.html`.
- [ ] T021 [P] Update all seven READMEs (`README.md` + 6 localized) — "What's
      inside" table and Content bullets — to the domain → task-statement →
      concept taxonomy.
- [ ] T022 [P] Update `CHANGELOG.md` with the restructure and record the
      "translate ~150 new keys × 6 languages via fetch-language-dictionary"
      follow-up as an explicit outstanding item.
- [ ] T023 End-to-end verification (Playwright): switch through all 7 languages
      — zero console errors, new content falls back to English under the 6
      non-English languages, no layout breakage; capture screenshots of Learning
      Path, Concepts tab, and Neuron Map in both Light and Dark themes.
- [ ] T024 Confirm saved progress persists: mark a question known, reload, verify
      the mark survives (question ids unchanged).

## Dependencies & Execution Order

- **Setup (T001–T002)** → **Foundational (T003–T009)** must finish before any
  user story. T001 (fidelity) blocks T004; T006 (mapping) blocks T007.
- **US1 (T010–T014)** is the MVP and depends only on Foundational. T010–T013
  edit different regions of the same file — sequence them (not `[P]`) to avoid
  overlapping edits, though they are logically independent.
- **US2 (T015–T017)** depends on Foundational; independent of US1.
- **US3 (T018–T019)** depends on Foundational (and is most meaningful after
  US1's quiz rewire for T019).
- **Polish (T020–T024)** last. T021 and T022 are `[P]` (different files).

## Implementation Strategy

- **MVP = Setup + Foundational + US1.** That alone delivers a working app fully
  navigated by the blueprint taxonomy.
- Land reviewable commits per phase (taxonomy data → re-tag → US1 rewire →
  concept library → polish/docs), not one mega-commit.
- Keep every new string flowing through i18n (English source); defer the 6-
  language translation to the recorded follow-up.
