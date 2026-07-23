# Feature Specification: Spec-Driven "Add a New Language" Workflow

**Feature Branch**: `001-add-language`

**Created**: 2026-07-24

**Status**: Draft

**Input**: User description: "Formalize the manual 'add a new language' process (currently
captured ad-hoc in `.claude/skills/add-language/SKILL.md`) into a spec-kit spec/plan/tasks
sequence, so adding language #7 (and beyond) follows `/speckit-specify` → `/speckit-plan` →
`/speckit-tasks` → `/speckit-implement` instead of ad-hoc back-and-forth."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a drop-in language (Priority: P1)

A maintainer picks a Tier 1/2 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5 (Korean,
Portuguese-BR, French, German, Russian, or Italian — Latin or CJK script, no new layout
mechanics) and runs it through the workflow end-to-end, ending with a fully shipped,
verified language addition.

**Why this priority**: This is the common case and the whole reason to formalize the
process — six languages have already been added ad-hoc; the next one should not require
re-deriving the same steps from conversation memory.

**Independent Test**: Run the generated task list for one Tier 1 candidate and confirm the
app builds (opens correctly), the new language's dictionary has full key parity, and all
six READMEs plus the dropdown reflect it in the correct order.

**Acceptance Scenarios**:

1. **Given** the ratified constitution and the existing 526-key + 5-shell-key dictionary
   set, **When** the maintainer runs `/speckit-tasks` for "Add Korean", **Then** the
   generated tasks cover: full dictionary translation, `QS_UNIT`/`QUESTION_FMT` entries,
   the `#lang-select` `<option>` in the correct sort position, all six READMEs' switch-link
   row and Features bullet, and a `CHANGELOG.md` entry.
2. **Given** a completed language addition, **When** the verification task runs, **Then**
   the new dictionary's key set exactly matches the baseline language's key set (no
   missing or extra keys) and the dropdown order matches the ordering rule everywhere.

---

### User Story 2 - Add a language needing new engineering work (Priority: P2)

A maintainer picks a Tier 3 candidate (Arabic or Hebrew — RTL script) and the workflow
makes the extra scope visible before implementation starts, rather than discovering
mid-implementation that layout work is needed.

**Why this priority**: Rarer than User Story 1, but a real gap — this app has no RTL
support today, and silently treating Arabic like Spanish would produce a broken layout.

**Independent Test**: Generate a plan for an RTL candidate and confirm it contains a
distinct, separately-scoped workstream for layout-mirroring work, apart from the standard
dictionary/README tasks.

**Acceptance Scenarios**:

1. **Given** Arabic is requested, **When** `/speckit-plan` runs, **Then** the plan flags a
   distinct RTL layout-mirroring workstream separate from the standard dictionary/README
   tasks, and does not assume the standard drop-in flow applies.

---

### User Story 3 - Catch mistakes before they ship (Priority: P3)

A maintainer relies on the generated task list's verification step to catch the same class
of mistakes made in earlier ad-hoc language additions this session (a missing 9 characters
found only when converting README prose, and one incorrectly-converted context-dependent
Traditional Chinese character) before considering the feature done.

**Why this priority**: Both incidents already happened once in this project's history; a
repeatable verification step is cheap insurance against a repeat, but the workflow is still
useful without it (hence P3, not P1).

**Independent Test**: The task list includes an explicit key-parity check and, for any
script requiring a character-derivation pass, a "zero leftover source-script characters"
check, both run as a task before the feature is marked complete.

**Acceptance Scenarios**:

1. **Given** a new language addition's task list, **When** the verification task runs,
   **Then** it reports key-count parity across all dictionaries and, for phase-converted
   scripts, zero leftover source-script characters.

---

### Edge Cases

- What happens when a candidate language needs layout accommodation beyond RTL (e.g. a
  script whose average string width is much longer/shorter than existing Latin/CJK
  strings, breaking existing button/badge sizing)?
- How does the process handle a language with no single canonical form for a term (e.g. a
  regional variant, such as the Portuguese pt-BR vs. pt-PT distinction already flagged in
  the priority list)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workflow MUST produce a spec, plan, and task list for any candidate
  language drawn from `SPEC_KIT_INTEGRATION_PLAN.md` §5's priority list, or a user-supplied
  language not on that list.
- **FR-002**: Generated tasks MUST include full dictionary translation covering the exact
  key set already present in the existing dictionaries (526 `__I18N_XX__` entries + 5
  `__SHELL_XX__` entries), never a partial subset.
- **FR-003**: Generated tasks MUST include adding the new language's entries to `QS_UNIT`
  and `QUESTION_FMT` for its dynamic (runtime-number-containing) strings.
- **FR-004**: Generated tasks MUST include adding the new language's `<option>` to
  `#lang-select` in the correct sort position per the ordering rule (Latin-script
  languages alphabetically by English name first, then CJK languages grouped together),
  and updating all six READMEs' switch-link row and Features bullet to match.
- **FR-005**: Generated tasks MUST include a `CHANGELOG.md` entry describing the addition.
- **FR-006**: For scripts requiring layout accommodation beyond the existing LTR
  Latin/CJK mechanics (e.g. RTL), the plan MUST separate "translation" tasks from
  "layout/engineering" tasks so the added scope is visible before implementation starts.
- **FR-007**: Generated tasks MUST include a verification step confirming: (a) no
  missing/extra dictionary keys versus the baseline language, (b) dropdown/README ordering
  is consistent across the app and all six READMEs, and (c) for any phase-converted script
  (i.e. one derived from another already-supported language, as Traditional Chinese was
  derived from Simplified), zero leftover source-script characters remain.
- **FR-008**: Large dictionary edits performed during implementation MUST follow the
  constitution's Node-script/brace-depth-boundary-detection rule (see
  `.specify/memory/constitution.md`, Principle IV), never manual `Edit` calls on raw
  single-line dictionary objects.

### Key Entities

- **Language Dictionary**: the `window.__I18N_XX__` object (526 keys) plus
  `window.__SHELL_XX__` (5 keys) for one supported language.
- **Language Candidate**: an entry from the priority list in
  `SPEC_KIT_INTEGRATION_PLAN.md` §5, carrying a tier, a script type, and whether it needs
  engineering work beyond translation.
- **Verification Report**: the key-parity, ordering-consistency, and (where applicable)
  leftover-character check results produced for one language addition.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A maintainer can go from "pick a language from the priority list" to a fully
  shipped language (dictionaries, dropdown, all six READMEs, changelog) using only
  `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`, without
  needing ad-hoc conversational back-and-forth to rediscover the steps.
- **SC-002**: 100% of the 531 dictionary keys (526 + 5 shell) are present for every newly
  added language before it is considered shipped.
- **SC-003**: Zero language-ordering mismatches between the app's dropdown and any of the
  six READMEs after a language addition.
- **SC-004**: For any script requiring a character-derivation pass, zero leftover
  source-script characters remain after verification.

## Assumptions

- The "user" of this feature is the project maintainer running Claude Code locally to
  extend the app, not an end-user of the study app itself — this is a developer/process
  feature, not an end-user-facing one.
- The target dictionary key set stays at the current 526+5 baseline unless a separate
  feature changes the dictionary schema itself.
- RTL layout support (needed for Arabic/Hebrew) is out of scope for this spec's own
  implementation; this spec only requires the generated *plan* to flag RTL as a distinct
  workstream, not to build RTL support.
- The existing `.claude/skills/add-language/SKILL.md` is the authoritative source of
  current tribal knowledge for this process and is treated as input to the plan, not
  superseded by it.
