# Implementation Plan: Extract Inline Scripts from index.html

**Branch**: `003-extract-inline-scripts` | **Date**: 2026-08-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-extract-inline-scripts/spec.md`

## Summary

`index.html` still carries ~1,370 lines of inline JavaScript across six
`<script>` blocks (nav/localStorage helpers, tab switching, the QDATA-driven
exam engine + load-error banner, hub/decoder table builder, neuron map SVG
builder, 2-week plan progress tracker, and the lazy language loader). This
plan moves that code, verbatim and in original order, into a new first-party
`script.js` file loaded via `<script src="script.js"></script>` at the same
position the inline blocks currently occupy — the same code-motion pattern
already used for `style.css` (PR #31) and `content.js` (PR #31). No logic
changes; behavior is verified live in-browser via CDP after the move.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2017-ish, browser-native, no transpilation), HTML5, CSS3

**Primary Dependencies**: None (zero-build static site; existing sibling files `content.js`, `languages.config.js`, `style.css`, `translations/<code>.js`)

**Storage**: Browser `localStorage` (progress tracking, theme/language prefs) — unaffected by this refactor

**Testing**: Manual/scripted in-browser verification via headless Edge over the DevTools Protocol (CDP), per this repo's established verification approach; no automated JS test suite exists in this repo

**Target Platform**: Static site opened via `file://` or served statically (e.g., GitHub Pages); must keep working in both

**Project Type**: Single static web app (no frontend/backend split)

**Performance Goals**: N/A — pure code motion, no behavior/perf change intended

**Constraints**: Zero-build (Constitution I) — no bundler, no transpilation, plain committed file loaded via `<script src>`

**Scale/Scope**: One new file (`script.js`, ~1,370 lines), one edited file (`index.html`, six blocks removed + one `<script src>` added)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Zero-Build, First-Party Files**: PASS. `script.js` is a plain, first-party, same-origin file sitting alongside `index.html`, loaded via `<script src>` (not `fetch`), requiring no compilation — this is the exact pattern the principle explicitly names (`style.css`, `content.js`) and permits extending to a JS file the same way.
- **II. i18n-First UI Copy**: N/A. No UI copy is added, changed, or moved out of the translation system; the lazy language-loader's *logic* moves, but the dictionaries it loads (`translations/<code>.js`) are untouched.
- **III. Theme Parity**: N/A. No visual/layout change; theme CSS is untouched (lives in `style.css`, not touched by this feature).
- **IV. Safe Large-Dictionary Edits**: N/A. `script.js` is code, not a large data dictionary literal like `content.js`/`translations/<code>.js`; ordinary `Edit`/`Write` is appropriate here. (`content.js` itself is not modified by this feature.)
- **V. Documentation Currency**: PASS (bounded). This is not a user-visible change (no new language/theme/feature), so `CHANGELOG.md` gets a brief "internal refactor" note for traceability, but README/dropdown language lists are untouched since nothing user-facing changed.

No violations. Complexity Tracking table not needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-extract-inline-scripts/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output (code-structure inventory, not data entities)
├── quickstart.md        # Phase 1 output (manual/CDP verification guide)
└── tasks.md             # Phase 2 output (/speckit-tasks — not created by this command)
```

### Source Code (repository root)

```text
index.html              # Edited: six inline <script> blocks removed, one
                         # <script src="script.js"></script> added in their place
script.js                # New: all extracted behavior code, in original order
style.css                # Unchanged (existing sibling file, precedent)
content.js                # Unchanged (existing sibling file, precedent)
languages.config.js       # Unchanged
translations/*.js         # Unchanged
```

**Structure Decision**: Single static-site project, no src/tests directory
split — matches the existing flat repository-root layout used by
`style.css`/`content.js`/`languages.config.js`. `script.js` joins them at
the repository root.

## Complexity Tracking

*No violations — table not needed.*
