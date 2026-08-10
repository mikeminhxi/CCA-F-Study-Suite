# Tasks: Extract Inline Scripts from index.html

**Input**: Design documents from `/specs/003-extract-inline-scripts/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated JS test suite exists in this repo (zero-build,
Constitution I). Verification is the in-browser CDP walkthrough in
`quickstart.md`, captured as Polish-phase tasks below instead of a
Tests-first subsection.

**Organization**: This feature has a single user story (P1) — everything
maps to it. There's no Foundational phase because the "foundation" (an empty
`script.js` file wired into `index.html`'s load order) is small enough to be
the first task of the story itself.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files/regions, no dependencies)
- **[Story]**: All implementation tasks map to US1 (the only story)

## Path Conventions

Flat repository-root static site — no `src/`/`tests/` split. Files touched:
`index.html` (edited), `script.js` (new).

---

## Phase 1: Setup

**Purpose**: Nothing to scaffold beyond the target file itself — creating it
is inseparable from moving the first block, so Setup is folded into T001
below rather than kept as a separate empty-shell task.

*(No separate Setup tasks — see Phase 3, T001.)*

---

## Phase 2: Foundational

*(No blocking prerequisites beyond the source blocks already existing in
`index.html` — skipped.)*

---

## Phase 3: User Story 1 - Maintainer edits app behavior without wading through markup (Priority: P1) 🎯 MVP

**Goal**: Move all eight inline `<script>` logic blocks out of `index.html`
into a new `script.js`, in original order, with zero behavior change.

**Independent Test**: `grep -c "<script" index.html` shows only the three
`src=` includes; every feature in `quickstart.md`'s walkthrough table passes.

### Implementation for User Story 1

- [X] T001 [US1] Create `script.js` at repo root and move Block 1 (nav/localStorage helpers: `safeGet`, `safeSet`, `navIsCollapsed`, `expandNav`, `collapseNav`, currently `index.html` lines 671-677) into it verbatim; remove that `<script>` block from `index.html`; leave a single `<script src="script.js"></script>` placeholder at the same position for now (moved to final position in T009).
- [X] T002 [US1] Append Block 2 (shell tab switching IIFE, lines 678-707) to `script.js` verbatim; remove it from `index.html`.
- [X] T003 [US1] Append Block 3 (`showLoadError` + main QDATA-driven exam engine IIFE with `[CONSOLE]` error tag, lines 709-1542 — the largest block) to `script.js` verbatim; remove it from `index.html`.
- [X] T004 [US1] Append Block 4 (hub/decoder table builder IIFE with `[HUB]` error tag, lines 1543-1596) to `script.js` verbatim; remove it from `index.html`.
- [X] T005 [US1] Append Block 5 (neuron map SVG builder IIFE with `[MAP]` error tag, lines 1597-1797) to `script.js` verbatim; remove it from `index.html`.
- [X] T006 [US1] Append Block 6 (2-week plan progress tracker IIFE with `[PLAN]` error tag, lines 1798-1893) to `script.js` verbatim; remove it from `index.html`.
- [X] T007 [US1] Append Block 7 (lazy language loader IIFE — `loadLang`, `translateNode`/`applyAll`, `window.__setLang__`, lines 1894-2021) to `script.js` verbatim; remove it from `index.html`.
- [X] T008 [US1] Append Block 8 (theme toggle IIFE — `window.__setTheme__`, lines 2022-2044) to `script.js` verbatim; remove it from `index.html`.
- [X] T009 [US1] Confirm `index.html` has exactly one `<script src="script.js"></script>` tag, positioned at the end of `<body>` where the inline blocks used to be (after `content.js`/`languages.config.js` in `<head>` remain unaffected); confirm no bare inline `<script>` blocks with logic remain (`grep -n "<script" index.html` shows only the three `src=` includes).
- [X] T010 [US1] Cross-check `script.js` against the symbol inventory in `data-model.md`'s "Global surface" section — confirm `safeGet`, `safeSet`, `navIsCollapsed`, `expandNav`, `collapseNav`, `window.__setLang__`, `window.__setTheme__` are all present and that block order (1→8) matches source order exactly (no reordering, no dropped code).

**Checkpoint**: `index.html` contains markup + three `<script src>` includes
only; `script.js` contains all eight blocks in order. Ready for live
verification.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Prove behavior parity and close out repo bookkeeping.

- [X] T011 [US1] Run the full CDP verification walkthrough from `quickstart.md` (shell nav, Study Console exam flow, Hub search/filter, Neuron Map render, 2-Week Plan persistence, language switch, theme toggle) against the refactored app; confirm zero new console errors.
- [X] T012 [P] Add a brief "internal refactor" line to `CHANGELOG.md` per Constitution V, noting inline JS was extracted to `script.js` (no user-facing behavior change).
- [X] T013 Run `git diff --stat` and confirm `index.html`'s line-count drop matches the ~1,370 lines removed (SC-001), with `script.js` net-new at a comparable size.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup / Foundational**: Skipped (folded into T001; no other blockers).
- **User Story 1 (Phase 3)**: T001 must run first (creates `script.js` and
  the placeholder `<script src>` tag); T002-T008 must run in block order
  (each appends to the same growing `script.js` file — see Parallel
  Opportunities below for why they are NOT marked `[P]` despite editing
  "different" line ranges); T009-T010 depend on T001-T008 all being done.
- **Polish (Phase 4)**: Depends on Phase 3's checkpoint (T001-T010) being
  complete.

### Parallel Opportunities

- None within Phase 3: T001-T008 all write to the same two files
  (`script.js` growing sequentially, `index.html` shrinking sequentially),
  so despite each task touching a distinct source line range, they are not
  safely parallelizable as file-edit operations — do them in order.
- T012 (CHANGELOG) in Phase 4 can run in parallel with T011/T013 since it
  touches a different file with no dependency on their outcome.

---

## Implementation Strategy

### MVP First (and only)

This feature has one story, so "MVP" and "done" are the same milestone:

1. T001-T010 (move all eight blocks, verify structurally complete)
2. T011 (verify behaviorally identical via CDP)
3. T012-T013 (bookkeeping)
4. Stop — feature complete, ready for PR

---

## Notes

- No `[P]` markers appear in Phase 3 because every task in it mutates the
  same two shared files sequentially — marking them parallel would invite
  merge conflicts within a single working tree, not genuine speedup.
- Commit after T010 (structural move complete) and again after T013
  (verified + documented) if splitting into checkpoints; a single commit
  covering the whole feature is also acceptable given its small, atomic
  scope.
- Avoid: rewriting any block's internal logic while moving it — this task
  list exists specifically to keep the diff a pure, verifiable move.
