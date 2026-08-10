# Research: Extract Inline Scripts from index.html

No `NEEDS CLARIFICATION` markers were present in the spec's Technical
Context; the decisions below were reasonable-default calls made from
existing repo precedent rather than open unknowns.

## Decision: Single `script.js` file, not one file per logical block

**Rationale**: The user description and precedent (PR #31) both point to a
single external file mirroring `content.js`. The six blocks are already
small enough combined (~1,370 lines) that per-block files would add load-order
complexity (six `<script src>` tags instead of one) for no benefit, and would
break from the established `style.css`/`content.js` one-file-per-concern
(not one-file-per-block) convention.

**Alternatives considered**:
- One file per block (6 files): rejected — adds six more `<script src>` tags
  to maintain in lockstep, no precedent in this repo, and the blocks already
  share one runtime concern ("app behavior").
- ES modules (`type="module"`, multiple imported files): rejected — out of
  scope per Constitution I (no build step is required for it to work, but it
  changes loading semantics — defer/strict-module scoping — for no behavior
  benefit, and the existing `content.js`/`languages.config.js` are plain
  classic scripts relying on global scope, e.g. `QDATA`, `LANG_DATA`).

## Decision: Preserve each block's own IIFE + try/catch error boundary

**Rationale**: FR-003 requires that a runtime error in one block (e.g., the
neuron map builder) not prevent other blocks (e.g., the progress tracker)
from running. The current code already achieves this via six independent
`(function(){ "use strict"; try{ ... }catch(e){ console.error("[TAG]",e); }
})();` wrappers. Concatenating the bodies into one shared function/try-block
would silently change this fault-isolation behavior — a regression the spec
explicitly calls out as an edge case. Each IIFE is kept as its own top-level
statement in `script.js`, in original source order.

**Alternatives considered**:
- Merge into one big IIFE: rejected — collapses six independent error
  boundaries into one, so one failing block (e.g. the neuron map on a
  malformed dataset) could abort the progress tracker below it. Violates
  FR-003.

## Decision: Load order — `content.js`, `languages.config.js`, then `script.js`, unchanged relative position

**Rationale**: The first two inline blocks (nav/localStorage helpers, tab
switching) currently run before the main engine block that reads `QDATA`
(defined in `content.js`, already loaded earlier via `<script src>` at the
top of `<head>`) and before the language-loader block that reads
`languages.config.js`'s exported config. Since `content.js` and
`languages.config.js` are loaded in `<head>` (lines 7–8) and the behavior
code was always placed at the end of `<body>`, simply replacing the six
inline blocks with one `<script src="script.js">` at that same end-of-body
position preserves every existing ordering guarantee with zero new risk.

**Alternatives considered**:
- Move `script.js` into `<head>` with `defer`: rejected — changes execution
  timing relative to DOM readiness (the current code relies on running
  after the body markup it queries via `document.querySelectorAll`/
  `getElementById` already exists in the DOM, since it's inlined at the end
  of `<body>`). Out of scope for a pure code-motion refactor.

## Decision: Verification method — headless-Edge CDP walkthrough, not a new test framework

**Rationale**: Per established project practice ([[feedback_cdp_browser_verification]]
in prior work), this repo has no JS test runner; UI behavior is verified by
driving a real (headless) browser over the DevTools Protocol and checking
console output, DOM state, and localStorage. Introducing a test framework
would violate Constitution I (zero-build) and is disproportionate to a pure
refactor. `quickstart.md` documents the concrete CDP verification steps.

**Alternatives considered**:
- Add a JS unit-test framework (Jest/Vitest): rejected — requires Node
  tooling/build step not currently part of the shipped app, out of scope for
  a behavior-preserving refactor, no existing precedent in this repo.
