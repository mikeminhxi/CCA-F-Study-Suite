# Feature Specification: Extract Inline Scripts from index.html

**Feature Branch**: `003-extract-inline-scripts`

**Created**: 2026-08-11

**Status**: Draft

**Input**: User description: "Extract the inline JavaScript in index.html (six <script> blocks spanning lines ~671-2044: nav/localStorage helpers, tab switching, main QDATA-driven exam engine, hub/decoder table, neuron map SVG builder, 2-week plan progress tracker, and the lazy-language-loader) into a single external script.js file loaded via <script src="script.js"></script>, following the exact precedent of PR #31 which split CSS into style.css and static data into content.js. Goal: shrink index.html down to markup only, keep behavior 100% identical (verified in-browser), no functional changes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Maintainer edits app behavior without wading through markup (Priority: P1)

A contributor (including future-Claude working a language or feature round) opens the repository to fix a bug in the exam engine, the progress tracker, or the language loader. Today that logic is interleaved with ~2,000 lines of HTML markup inside `index.html`. After this change, the contributor opens `script.js` directly and finds only behavior code — no markup to scroll past — mirroring how `style.css` and `content.js` already isolate presentation and static data.

**Why this priority**: This is the entire point of the refactor — it's the only user story. Every other property (file size, load order, no functional drift) is a constraint on how this story is satisfied, not a separate story.

**Independent Test**: Open `index.html` in an editor and confirm no `<script>` block (other than the three `src=` includes) contains executable logic. Open `script.js` and confirm it contains all eight behavior blocks with nothing dropped.

**Acceptance Scenarios**:

1. **Given** the repository after this change, **When** a contributor opens `index.html`, **Then** the file contains markup and, at most, `<script src="...">` include tags — no inline logic blocks.
2. **Given** the repository after this change, **When** a contributor opens `script.js`, **Then** it contains the nav/localStorage helpers, tab switching, main QDATA-driven exam engine (with its load-error banner), hub/decoder table builder, neuron map SVG builder, 2-week plan progress tracker, the lazy-language-loader, and the theme toggle, in an order that preserves their original run-time dependencies.
3. **Given** the app loaded in a browser, **When** a study-taker exercises every tab (Study Console, Hub/decoder search, Neuron Map, 2-Week Plan, language switcher, theme toggle), **Then** every feature behaves exactly as it did before the extraction (no console errors, no visual or functional regressions).

### Edge Cases

- What happens if `script.js` fails to load (e.g., served from a broken path, or the file is opened directly via `file://` and the browser blocks the request)? The existing `showLoadError` fallback banner (currently defined inline) must still fire correctly once its code lives in the external file.
- What happens to the two script blocks that reference globals defined by `content.js` (`QDATA`) or by `languages.config.js`? Load order must still guarantee those globals exist before the extracted code runs.
- What happens to the `"use strict"` + `try/catch` wrapping each original IIFE uses for isolated error logging (`[CONSOLE]`, `[HUB]`, `[MAP]`, `[PLAN]` tags)? Each logical block's error boundary must be preserved so one block's failure doesn't silently break the others.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All executable JavaScript currently inline in `index.html` (the eight `<script>` blocks between the closing of the "2-Week Plan" markup and the closing `</body>`, including the theme-toggle block) MUST be moved into a single new file, `script.js`, at the repository root.
- **FR-002**: `index.html` MUST load the extracted code via `<script src="script.js"></script>`, placed at the same relative position the inline blocks occupied (after `content.js` and `languages.config.js`, at the end of `<body>`), so existing DOM-ready ordering is unaffected.
- **FR-003**: The relative order and independent IIFE/error-boundary structure of the six logical blocks MUST be preserved so that a runtime error in one block (e.g., the neuron map builder) does not prevent the others (e.g., the progress tracker) from running, matching current behavior.
- **FR-004**: No behavior, markup, CSS, or data MUST change as a byproduct of this move — this is a pure code-motion refactor.
- **FR-005**: `index.html` MUST NOT reference any function or variable that no longer exists after extraction (e.g., `safeGet`, `safeSet`, `navIsCollapsed`, `expandNav`, `collapseNav` must remain callable exactly as before, now defined in `script.js`).
- **FR-006**: The language-switcher's lazy-loader (the block that dynamically injects `translations/<code>.js` `<script>` tags) MUST continue to function identically after extraction, including its handling of already-loaded languages and load races (`loadToken`).
- **FR-007**: The existing "missing file" error banner shown when `content.js`/`style.css` fail to load MUST continue to work after `script.js` itself becomes a required external dependency (i.e., the banner logic must not depend on being inline to run).
- **FR-008**: The change MUST be verified by exercising the app in an actual browser (tab switching, exam flow, hub search, neuron map, 2-week plan checkboxes/persistence, language switching) — not by code reading alone.

### Key Entities

- **index.html**: Markup shell; after this change, contains structure/content markup plus three `<script src>` includes (`content.js`, `languages.config.js`, `script.js`) and no inline logic.
- **script.js**: New file; contains all behavior code previously inline — DOM helpers, tab controller, exam engine, hub/decoder builder, neuron map builder, progress tracker, language loader.
- **content.js / style.css / languages.config.js**: Existing sibling files this change is patterned after; not modified by this feature except where `index.html`'s script-include ordering relative to them must be preserved.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `index.html`'s line count drops by roughly the ~1,370 lines currently occupied by inline `<script>` blocks, with no inline logic remaining outside `<script src>` includes.
- **SC-002**: Every interactive feature (tab navigation, exam/quiz engine, hub search, neuron map, 2-week plan progress persistence, language switching) is exercised in a live browser after the change and produces output identical to before the change, with zero new console errors.
- **SC-003**: A contributor can locate any piece of app behavior by opening exactly one file (`script.js`) rather than searching through `index.html`.

## Assumptions

- This is an internal refactor with no end-user-facing change in functionality, wording, or appearance; "users" in this spec are contributors/maintainers of the codebase.
- `script.js` is loaded unconditionally (not lazily), the same way `content.js` and `languages.config.js` already are, since the app is unusable without it — this matches the existing precedent rather than introducing deferred/async loading.
- File placement is repository root, alongside `content.js`, `style.css`, and `languages.config.js`, per the established convention.
- No build step / bundler is introduced; this remains a plain static multi-file site.
