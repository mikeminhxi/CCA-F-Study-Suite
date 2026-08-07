# Tasks: RTL Layout Foundation

**Input**: Design documents from `specs/001-add-language/` (`spec.md`, `plan.md` —
this round scoped to RTL layout foundation, no new language)

**Prerequisites**: `plan.md` (this round), `spec.md`

**Tests**: No automated test suite; verification is manual (Phase 5 below) plus a
full manual diff review (higher risk than a translation round).

**Organization**: Tasks grouped by user story per `spec.md`. Written prospectively
per the same "plan before implementation" discipline FR-009 establishes for language
rounds, applied here to this non-language engineering round.

## Phase 1: Setup

- [x] T001 Confirm scope with the maintainer: RTL layout foundation ships as its own
      PR, before Arabic, before Hebrew (three separate PRs total for Tier 3).

## Phase 2: Foundational — audit current layout

- [ ] T002 Audit `style.css` for horizontal-axis physical properties: `margin-left`/
      `margin-right`, `padding-left`/`padding-right`, `left:`/`right:` positioning,
      `text-align: left`/`text-align: right`, `border-left`/`border-right`, asymmetric
      `border-radius` corner values. Vertical properties (`margin-top`/`bottom` etc.)
      are out of scope — direction-agnostic.
- [ ] T003 Audit `index.html` and `style.css` for directional glyphs/indicators that
      won't auto-mirror via logical properties: the `.rule .arrow` divs (hard-coded
      `→` text, ~40 occurrences in the Cheat & Keywords "IF trigger → THEN pattern"
      table) and `#tool-hub .rule .ans::before{content:"→ "}` (Study Hub's JS-rendered
      decode table). Note any other directional icon/chevron use found during the
      audit.
- [ ] T004 Identify explicitly out-of-scope items for this round (documented in
      `plan.md`): the Neuron Map SVG's internal node-graph coordinate layout, and
      visual-fill direction of progress bars/gauges. Confirm neither crashes or
      visibly breaks under `dir="rtl"` even though their mirroring isn't perfected.

## Phase 3: User Story 2 - RTL layout foundation (Priority: P2, per spec.md)

**Goal**: The app can render correctly in `dir="rtl"` before any RTL language exists,
so Arabic/Hebrew rounds only need translation + wiring, not layout engineering.

**Independent Test**: Force `document.documentElement.dir='rtl'` (no dropdown option
needed yet) and confirm the shell, nav, tabs, badges, decision-rule tables, and modal
all mirror correctly with zero console errors and zero visual regression when `dir`
is left at its default `ltr`.

- [ ] T005 [US2] Convert the physical properties found in T002 to CSS logical
      property equivalents (`margin-inline-start/end`, `padding-inline-start/end`,
      `inset-inline-start/end`, `text-align: start/end`, `border-inline-start/end`,
      logical `border-*-*-radius`) throughout `style.css`.
- [ ] T006 [US2] Add `[dir="rtl"]` override rules flipping the arrow glyphs found in
      T003 (`transform: scaleX(-1)` on `.rule .arrow` and the `::before` pseudo-element)
      so they still read cause→effect under RTL without editing the ~40 hard-coded
      `→` occurrences in `index.html`'s markup.
- [ ] T007 [US2] Add an optional `dir` field to the language-object schema (documented
      in this plan/tasks, not yet set on any existing `translations/<code>.js` — those
      all implicitly default to `"ltr"`). Update `window.__setLang__` in `index.html`
      to set `document.documentElement`'s `dir` attribute from
      `LANG_DATA[lang] && LANG_DATA[lang].dir === 'rtl' ? 'rtl' : 'ltr'` once the
      language script has loaded, mirroring the existing `data-theme`-attribute
      pattern used for theming.

**Checkpoint**: RTL rendering works when forced; zero regression to existing LTR
languages; not yet merged to `main`.

## Phase 5: User Story 3 - Catch mistakes before they ship (Priority: P3)

**Goal**: Verification catches layout regressions (to the 21 existing LTR languages)
or RTL-mirroring gaps before this round is considered shipped.

**Independent Test**: Browser verification (Playwright) in both `dir="ltr"` (default,
regression check) and `dir="rtl"` (forced) confirms the Study Console, Cheat &
Keywords (arrow direction), Concepts, Exam by Domain, 2-Week Plan, and donate modal
all render with zero console errors in both directions, and LTR is pixel-equivalent
to the pre-change baseline.

- [ ] T008 [US3] Playwright verification pass 1 (regression check): default `dir`
      (unset/`ltr`), no behavior change from before this round — spot-check the same
      tabs/flows used in every prior language round's verification.
- [ ] T009 [US3] Playwright verification pass 2 (RTL check): force
      `document.documentElement.dir='rtl'` via `page.evaluate`, confirm nav/tabs/
      badges/decision-rule-table/modal all mirror correctly, arrows point the correct
      reading direction, zero console errors.
- [ ] T010 [US3] Update `CHANGELOG.md` documenting the RTL layout foundation.
- [ ] T011 [US3] Update `SPEC_KIT_INTEGRATION_PLAN.md` §5's Tier 3 note: the RTL
      layout prerequisite is now shipped (branch `feat/add-rtl-layout-support`);
      Arabic and Hebrew rounds can proceed as standard translation + wiring rounds
      building on this foundation.

## Dependencies & Execution Order

Setup → Foundational (audit) → User Story 2 (implementation, sequential) → User
Story 3 (verification, both directions).

## Notes

- This round intentionally ships **no language** — `translations/`, `#lang-select`,
  and every README are untouched. Arabic and Hebrew each get their own subsequent
  branch/PR/round, following the standard per-language plan/tasks + translate + wire
  + verify flow, now unblocked by this foundation.
- Future RTL languages set `dir: "rtl"` in their own `translations/<code>.js` (a new
  field, first used by Arabic) — no further `index.html`/`style.css` change should be
  needed for a well-behaved RTL language once this foundation lands; if one is needed,
  that's a signal this round's audit missed something and should be logged as a
  follow-up.
