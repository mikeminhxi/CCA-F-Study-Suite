# Implementation Plan: RTL Layout Foundation

**Branch**: `feat/add-rtl-layout-support` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, User Story 2
(FR-006) — Tier 3 (Arabic, Hebrew) requires layout-mirroring work distinct from the
standard translation/wiring flow. Per the maintainer's explicit direction, this round
ships that layout-mirroring work **on its own**, before any RTL language's dictionary —
a separate PR from Arabic/Hebrew rather than bundled into the first RTL language's PR
(spec.md's own Assumptions section scopes RTL implementation out of the workflow spec
itself; this plan is the actual engineering work the maintainer asked for, layered on
top of that process).

**Note**: Unlike every prior round in this feature area, this round adds **no new
language** — `translations/` gains no new file, `#lang-select` gains no new option, no
README is touched. It exists purely to make the app capable of rendering right-to-left
before Arabic/Hebrew build on top of it.

## Summary

Add `dir="rtl"`/`dir="ltr"` support to the app shell, driven by a new optional `dir`
field on each `translations/<code>.js` language object (absent/`"ltr"` = default,
`"rtl"` = right-to-left). No existing language sets this field. `window.__setLang__`
in `index.html` sets `document.documentElement`'s `dir` attribute once the language
dictionary is loaded, mirroring the existing `data-theme` attribute pattern.

**CSS strategy**: convert horizontal-axis physical properties in `style.css`
(`margin-left/right`, `padding-left/right`, `left/right` positioning, `text-align:
left/right`, `border-left/right`, asymmetric `border-radius` corners) to their CSS
logical-property equivalents (`margin-inline-start/end`, `padding-inline-start/end`,
`inset-inline-start/end`, `text-align: start/end`, `border-inline-start/end`,
`border-start-start-radius` etc.) wherever the property is about inline/horizontal
layout — not vertical (`margin-top/bottom` etc. are untouched, direction-agnostic).
Logical properties auto-mirror based on the `dir` attribute with zero `[dir="rtl"]`
override blocks needed, and are supported in every evergreen browser this app already
targets (Chrome/Firefox/Safari/Edge, all recent versions) — no new dependency, per
Principle I.

**Non-mirroring cases requiring explicit `[dir="rtl"]` overrides**: the `→` arrow
glyphs used throughout the Cheat & Keywords "IF trigger → THEN pattern" table (both
the hard-coded `.rule .arrow` divs in `index.html` and the JS-rendered `.rule
.ans::before{content:"→ "}` in the Study Hub decode table) need to visually flip
(`transform: scaleX(-1)`) so they still read as pointing from cause to effect in RTL
reading order, without touching the arrow characters baked into markup/content.

**Explicitly out of scope for this round**: mirroring the Neuron Map's internal SVG
node-graph coordinate layout (a much deeper visualization-specific task); flipping the
direction progress bars/gauges visually fill (common practice in real-world RTL apps
is to leave numeric fill indicators LTR-visual regardless of text direction). Both are
flagged as follow-ups, not blockers — the app must not crash or visibly break for
these, but perfecting their mirroring is separate work.

**Testing without a real RTL language**: since no RTL language ships in this round,
verification forces `dir="rtl"` directly (e.g. via a Playwright `page.evaluate` call
setting `document.documentElement.dir='rtl'`) rather than through the language
dropdown — there is nothing in the dropdown to select yet.

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution (v1.2.0).

**Primary Dependencies**: None — CSS logical properties are native browser support,
not a library.

**Storage**: N/A.

**Testing**: No automated test suite; verification is manual browser use (Playwright,
forcing `dir="rtl"`) plus a full manual review of the `style.css`/`index.html` diff
(higher risk than a translation-only round — a layout regression could affect all 21
existing LTR languages too, not just future RTL ones).

**Target Platform**: Any modern browser (client-side single HTML file, must also work
opened directly via `file://`).

**Project Type**: Single self-contained HTML file + first-party sibling files.

**Performance Goals**: N/A.

**Constraints**: Must not add a dependency (Principle I); must not regress the
existing 21 LTR languages' layout (Principle III's theme-parity spirit extended to
direction-parity — LTR must look pixel-identical to before this change).

**Scale/Scope**: `style.css` (851 lines — full audit for physical horizontal
properties), `index.html` (the `.rule .arrow` divs' RTL glyph handling, and
`window.__setLang__`'s new `dir`-attribute-setting logic). No `translations/*.js`
file is touched (no `dir` field is being *set* to `"rtl"` on any of them yet — that
happens in the Arabic/Hebrew rounds that build on this).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Build, First-Party Files)**: PASS — CSS logical properties are
  native, no new file/dependency added.
- **Principle II (i18n-First UI Copy)**: N/A — no new UI copy this round.
- **Principle III (Theme Parity)**: Extended check — LTR rendering (all 21 existing
  languages) must be visually unchanged after the logical-property conversion; this is
  the primary regression risk of this round and gets explicit verification.
- **Principle IV (Safe Large-Dictionary Edits)**: N/A — no dictionary touched.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  `SPEC_KIT_INTEGRATION_PLAN.md` §5 annotated to note the RTL prerequisite is now
  satisfied, ahead of Arabic/Hebrew.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to RTL layout foundation (overwrites Greek's)
└── tasks.md             # RTL-foundation-scoped task list (overwrites Greek's)
```

### Source code (repository root)

```text
style.css                     # physical → logical property conversion, [dir="rtl"]
                               # overrides for the arrow glyphs
index.html                    # window.__setLang__ sets document.documentElement's
                               # dir attribute from the loaded language's `dir` field;
                               # no dropdown/translations change
CHANGELOG.md                  # entry added
SPEC_KIT_INTEGRATION_PLAN.md  # Tier 3 note updated: RTL prerequisite now shipped
```

**Structure Decision**: Single-file app (plus first-party sibling files). This round's
plan/tasks live on `feat/add-rtl-layout-support`, its own branch, separate from any
language's branch.

## Complexity Tracking

Not applicable — no constitution violations.
