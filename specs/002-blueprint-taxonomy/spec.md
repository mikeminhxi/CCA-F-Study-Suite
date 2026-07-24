# Feature Specification: Blueprint Taxonomy Restructure

**Feature Branch**: `feat/blueprint-taxonomy`

**Created**: 2026-07-25

**Status**: Draft

**Input**: User description: "Restructure the CCA-F Study Suite around the official CCA-F blueprint taxonomy from prepgenaicerts.com: 5 domains → 30 task statements (ts-1.1…ts-5.6) → 59 concepts (each with a core-insight one-liner and a Foundation/Intermediate/Advanced level). Make domains → task statements → concepts the app's primary navigation, replacing the current 7-phase / 14-module structure. Re-tag all 157 existing questions to task statements. Add a Concept library surface (new Study Console tab). Rewire Learning Path, Study mode, Exam-by-Domain quiz, and the Neuron Map to the new taxonomy. English-first."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Study along the official exam blueprint (Priority: P1)

A learner opens the app and navigates the same structure the certification
itself is organized by: five weighted domains, each broken into named task
statements. They can see their progress per domain and per task statement,
drill a single task statement, or build a scored exam from any selection of
task statements across domains.

**Why this priority**: This is the core value of the change — aligning the
study tool with the actual exam blueprint so a learner's mental model matches
what they'll be tested on. Without it, nothing else in this feature matters.

**Independent Test**: Open the app, confirm the Learning Path lists 5 domains
(weight order) each expanding to its task statements with a progress bar, and
that Study mode and the Exam-by-Domain quiz let the learner pool questions by
task statement and complete a scored run.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** the learner views the Learning Path,
   **Then** they see 5 domains in blueprint weight order (D1 27% → D5 15%),
   each expandable to its task statements, each showing a known/total count.
2. **Given** the learner is in Exam-by-Domain, **When** they select one or
   more task statements and start, **Then** they get a shuffled, scored run
   drawn only from questions tagged to those task statements, with an
   explanation on every miss.
3. **Given** the learner is in Study mode, **When** they filter to a single
   task statement, **Then** only that task statement's questions appear as
   flashcards.
4. **Given** the learner wants exam-style breadth, **When** they choose the
   "Mixed / Applied" filter, **Then** the pool spans cross-cutting questions
   regardless of a single domain.

---

### User Story 2 - Browse the concept library (Priority: P2)

A learner wants a fast reference of every testable concept, not just
questions. They open a Concept library that lists all 59 concepts grouped by
domain and task statement, each with a one-line "core insight" and a
difficulty level (Foundation / Intermediate / Advanced), so they can scan for
gaps and prioritize.

**Why this priority**: High-value reference surface and the main net-new
content of the blueprint, but the app is still useful for its P1 study/quiz
flows without it.

**Independent Test**: Open the Concept library tab, confirm 59 concepts appear
grouped by domain → task statement, each with an insight line and a level
chip, and that the per-domain concept counts match the blueprint
(12/8/10/14/15).

**Acceptance Scenarios**:

1. **Given** the Concept library is open, **When** the learner scans it,
   **Then** all 59 concepts are present, each under its task statement and
   domain, each showing its insight and a Foundation/Intermediate/Advanced
   level.
2. **Given** a domain, **When** the learner reads its section, **Then** the
   concept count matches the blueprint for that domain.

---

### User Story 3 - Trust that every question is correctly placed (Priority: P3)

A learner (and the maintainer) needs confidence that the re-tagging is
complete and correct: every one of the 157 questions belongs to exactly one
task statement, its domain follows from that task statement, and no question
is stranded or mis-domained.

**Why this priority**: A quality/correctness guarantee. It doesn't add a
surface but protects the integrity of P1 and P2.

**Independent Test**: A structural check confirms all 157 questions carry a
valid task-statement tag, every tag is one of the 30, and the per-domain
question distribution is reported for review.

**Acceptance Scenarios**:

1. **Given** the question bank, **When** it is validated, **Then** every
   question has exactly one task-statement tag drawn from the 30, and its
   domain is derivable from that tag.
2. **Given** the old module→domain mappings that diverged from the blueprint,
   **When** questions are re-tagged, **Then** each question's domain reflects
   the blueprint (e.g. error-propagation questions land in D5, not D2).

---

### Edge Cases

- **Task statements with zero existing questions**: some of the 30 task
  statements may have no question among the current 157. The Learning Path and
  quiz must render them gracefully (shown with a 0 count, not hidden in a way
  that misrepresents coverage, and not breaking the "select all" math).
- **Genuinely cross-cutting questions**: a question that spans several domains
  is still assigned one best-fit task statement, and is additionally reachable
  through the "Mixed / Applied" filter.
- **Untranslated new content under a non-English language**: with English-first
  delivery, the 6 non-English languages have no translations for the new
  blueprint strings yet; those strings must fall back to English with no
  console error and no broken layout.
- **Existing saved progress**: learners with prior known/review marks keyed by
  question id must not lose them — question ids are unchanged, only the tagging
  and navigation around them changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST represent the exam as three nested levels — 5
  domains, 30 task statements (`ts-1.1`…`ts-5.6`), and 59 concepts — sourced
  verbatim from the official blueprint (titles, per-concept core insight, and
  Foundation/Intermediate/Advanced level).
- **FR-002**: A task statement MUST belong to exactly one domain, and a
  concept MUST belong to exactly one task statement; a question's domain MUST
  be derivable from its task-statement tag (no separate, independently-editable
  question→domain map).
- **FR-003**: Every one of the 157 existing questions MUST be tagged to exactly
  one task statement; no question may be untagged, and no tag may fall outside
  the 30.
- **FR-004**: The Learning Path MUST present domains in blueprint weight order
  (D1 first at 27% through D5 at 15%), each expandable to its task statements,
  with a known/total progress indicator at both domain and task-statement
  level.
- **FR-005**: Study mode MUST let the learner pool flashcards by domain and by
  task statement (replacing the previous module filter).
- **FR-006**: The Exam-by-Domain quiz MUST let the learner select any set of
  task statements (grouped under their domains), report the available question
  count, and run a shuffled, scored exam over the selection, with an
  explanation shown on each miss.
- **FR-007**: The app MUST provide a Concept library surface (a new Study
  Console tab) listing all 59 concepts grouped by domain → task statement, each
  with its insight and level.
- **FR-008**: The Neuron Map MUST reflect the new taxonomy (its per-domain
  nodes derived from task statements rather than the retired ad-hoc topic
  labels), without visual regression in either theme.
- **FR-009**: The 7-phase / 14-module structure and its module→domain map MUST
  be retired as the primary navigation; the decision-rules table and the six
  core-principle cards (orthogonal reference content) are retained.
- **FR-010**: A non-domain "Mixed / Applied" study filter MUST remain available
  for exam-style cross-cutting practice, without reintroducing a fake sixth
  domain.
- **FR-011**: All new user-visible copy MUST flow through the i18n engine as
  translatable keys (English source), so it is picked up by the translation
  follow-up; no new hardcoded string may bypass the translation layer.
- **FR-012**: Under any of the 6 non-English languages, new blueprint strings
  without a translation yet MUST fall back to English with zero console errors
  and no layout breakage.
- **FR-013**: Learner progress keyed by question id MUST be preserved across
  the restructure (question ids unchanged).
- **FR-014**: `CHANGELOG.md`, the in-app copy that described the old structure
  ("14 modules / 7 phases", question-count framing), and all seven READMEs MUST
  be updated to describe the new taxonomy; the translation follow-up MUST be
  recorded as a known outstanding item.

### Key Entities

- **Domain**: one of the 5 official exam areas; attributes: code (D1–D5),
  official label, exam weight, display color. Ordered by weight.
- **Task Statement**: a named exam objective; attributes: id (`ts-X.Y`), parent
  domain (derivable from id), title. 30 total.
- **Concept**: a testable idea under a task statement; attributes: id, parent
  task statement, title, core-insight one-liner, level
  (Foundation/Intermediate/Advanced). 59 total.
- **Question**: an existing practice item; attributes: id (unchanged), stem,
  options, correct answer, explanation, and a new task-statement tag. 157
  total; domain follows from the tag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 157 questions carry exactly one valid task-statement
  tag; a validation report shows 0 untagged and 0 out-of-range tags.
- **SC-002**: The app exposes exactly 30 task statements and 59 concepts, with
  per-domain counts matching the blueprint (task statements 7/5/6/6/6; concepts
  12/8/10/14/15).
- **SC-003**: A learner can go from opening the app to a scored, task-statement-
  scoped exam in under a minute, with the available-question count shown before
  they start.
- **SC-004**: Switching through all 7 languages produces zero console errors,
  and untranslated new content renders in English without layout breakage.
- **SC-005**: No learner loses previously saved known/review progress after the
  restructure.
- **SC-006**: The Learning Path, Concept library, and Neuron Map render
  correctly in both Light and Dark themes.

## Assumptions

- **English-first delivery**: the ~150 new UI strings (30 task-statement
  titles, 59 concept titles, 59 insights, plus a few labels) ship in English in
  this feature; translating them into VN/JA/ZH/TW/ES/KO is an explicit
  follow-up via the `fetch-language-dictionary` pipeline. This is a deliberate,
  temporary deviation from full i18n parity (Constitution Principle II),
  recorded as an outstanding item, not a permanent gap — new strings still flow
  through the i18n engine (FR-011) so they are translatable without rework.
- **Existing 157 questions are kept as-is**: the reference site's own 292
  practice questions are not imported; this feature re-tags and re-navigates
  the app's existing question bank only.
- **Blueprint content is authoritative**: task-statement titles, concept
  titles, insights, and levels are transcribed from the five prepgenaicerts.com
  domain pages captured during planning.
- **Mixed/Applied handling**: each currently-"mixed" question is assigned a
  best-fit single task statement; cross-cutting practice is served by a
  non-domain "Mixed / Applied" filter rather than a sixth domain.
- **Ordering**: now that domains are primary, the Learning Path uses blueprint
  weight order (D1→D5) rather than the previous "easiest foundations first"
  phase order.
- **Concept library placement**: a new Study Console tab (alongside Learning
  Path / Cheat & Keywords / Study / Exam by Domain), not a Study Hub section.
- **Zero-dependency / single-file** constraints (Constitution Principle I) are
  unchanged; all new data and views live in `cca-f-study-suite.html`.
- **Large-dictionary edits** (Constitution Principle IV) are done via
  brace-depth-aware scripted JSON edits, not naive string edits — relevant for
  writing the task-statement tag into all 157 question objects.
