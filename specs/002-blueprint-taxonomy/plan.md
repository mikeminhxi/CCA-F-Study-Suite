# Implementation Plan: Blueprint Taxonomy Restructure

**Branch**: `feat/blueprint-taxonomy` | **Date**: 2026-07-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-blueprint-taxonomy/spec.md`

## Summary

Replace the app's 7-phase / 14-module content model with the official CCA-F
blueprint taxonomy — **5 domains → 30 task statements → 59 concepts** — as the
primary navigation, re-tag all 157 existing questions to task statements
(domain derived from the tag), add a Concept library tab, and rewire the
Learning Path, Study mode, Exam-by-Domain quiz, and Neuron Map onto the new
taxonomy. Delivered **English-first**: new UI copy ships as translatable
English keys now; translating into the other 6 languages is a follow-up.

Technical approach: extend the existing data-driven `<script>` block in
`cca-f-study-suite.html` with two authoritative arrays (`TASK_STATEMENTS`,
`CONCEPTS`) and a per-question `ts` field, delete the `PHASES` /
`MODULE_DOMAIN` module concept, add derived indexes (`Q_BY_TS`, `TS_BY_DOMAIN`,
`CONCEPTS_BY_TS`) next to the existing `MODS` index, and update the four render
functions plus one new tab/view. No new files, no dependencies.

## Technical Context

**Language/Version**: HTML5 + vanilla ES (no transpile), single file

**Primary Dependencies**: None runtime (Google Fonts `<link>` only), per
Constitution Principle I

**Storage**: `localStorage` (`ccaf_progress_v1`), keyed by question id;
unchanged by this feature

**Testing**: No unit suite. Structural validation via PowerShell +
`System.Text.Json` (case-sensitive JSON parse); end-to-end via Python +
Playwright (Chromium already installed this session, no Node)

**Target Platform**: Any modern browser opening the file via `file://` or a
static server

**Project Type**: Single self-contained HTML study app

**Performance Goals**: Instant client-side render; no perceptible delay
switching tabs or languages

**Constraints**: Zero-dependency single file; i18n via the TreeWalker
text-swap engine; theme parity (Light/Dark); large inline dictionaries edited
only via brace-depth-aware scripts

**Scale/Scope**: 157 questions, 5 domains, 30 task statements, 59 concepts,
~150 new English UI strings, 7 languages, 4 tools + 1 new tab

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Zero-Dependency Single File** — PASS. All new data/views live in
  `cca-f-study-suite.html`; no bundler, package, or new external dependency.
- **II. i18n-First UI Copy** — PASS *with a documented, temporary deviation*.
  All new copy flows through the i18n engine as translatable keys (FR-011), so
  nothing bypasses translation. The 6 non-English dictionaries are not brought
  to full parity in this feature (English-first, FR-012); this is an explicit
  outstanding item closed by the translation follow-up, recorded in
  `CHANGELOG.md` and tasks. Tracked in Complexity Tracking below.
- **III. Theme Parity** — PASS (gate for implementation). New views (Concept
  library, rewired Learning Path, Neuron Map leaves) MUST be verified in Light
  and Dark before done (SC-006).
- **IV. Safe Large-Dictionary Edits** — PASS. Writing the `ts` field into all
  157 `QDATA` objects and injecting `TASK_STATEMENTS`/`CONCEPTS` is done via
  brace-depth-aware scripted JSON edits, never naive string edits.
- **V. Documentation Currency** — PASS (gate for implementation). `CHANGELOG.md`
  + all 7 READMEs updated in the same pass (FR-014); supported-language list
  stays in sync (unchanged by this feature — no language added/removed).

Result: **PASS** — one justified, time-boxed deviation (i18n parity), tracked
below. No blocking violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-blueprint-taxonomy/
├── plan.md              # This file
├── research.md          # Phase 0 output — decisions & rationale
├── data-model.md        # Phase 1 output — entity shapes & indexes
├── quickstart.md        # Phase 1 output — end-to-end validation guide
├── contracts/
│   └── taxonomy-data.md # Phase 1 output — the in-file data contracts
├── checklists/
│   └── requirements.md  # From /speckit-specify
└── tasks.md             # From /speckit-tasks (next command)
```

### Source Code (repository root)

```text
cca-f-study-suite.html          # the entire app — all changes land here
├── <script> data block (~L4413)
│   ├── QDATA[]                  # +ts field on each of 157 questions
│   ├── TASK_STATEMENTS[]        # NEW — 30 entries
│   ├── CONCEPTS[]               # NEW — 59 entries
│   ├── DOMAIN_INFO{}            # labels updated to official names; MIX retired
│   ├── PHASES[] / MODULE_DOMAIN # REMOVED (module concept retired)
│   └── MODS + Q_BY_TS / TS_BY_DOMAIN / CONCEPTS_BY_TS  # derived indexes
├── render/tab logic
│   ├── renderPath()             # domains→task statements
│   ├── study filter             # by domain / task statement
│   ├── quiz builder (~L4680)    # chips = task statements grouped by domain
│   ├── concepts view            # NEW tab (path/cheat/study/quiz/concepts)
│   └── Neuron Map domains[]     # leaves = task statements (~L4865)
└── markup: #tabs, #v-* views, #lang-select (unchanged)

README.md, README.{es,vi,zh-cn,zh-tw,ja,ko}.md   # copy updates
CHANGELOG.md                                       # what shipped + follow-up note
```

**Structure Decision**: Single-file app; there is no `src/` tree. All feature
work is localized to `cca-f-study-suite.html` (data block + four render
functions + one new tab), plus documentation files. This matches Constitution
Principle I and the existing architecture.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Temporary i18n parity gap (Principle II): new blueprint strings ship English-only in the 6 non-English languages | Owner chose English-first to ship the working restructure quickly; translating ~150 strings × 6 languages is a large task with its own dedicated pipeline (`fetch-language-dictionary`) | Translating everything in one pass was offered and declined — it would multiply the change size and delay a verifiable working app; strings still flow through i18n so the follow-up needs no rework |
