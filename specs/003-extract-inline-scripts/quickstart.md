# Quickstart: Verifying the Inline-Script Extraction

This is a pure code-motion refactor with no automated JS test suite in this
repo (Constitution: zero-build, no test framework). Verification is a live
in-browser walkthrough, driven headlessly over the DevTools Protocol (CDP),
per this project's established verification approach for UI-affecting
changes.

## Prerequisites

- `index.html` and the new `script.js` present at repo root, with `index.html`
  no longer containing any inline `<script>` logic blocks (only `<script
  src="...">` includes for `content.js`, `languages.config.js`, `script.js`).
- A headless Chromium-family browser available locally (e.g. Edge/Chrome) that
  can be launched with `--remote-debugging-port`.
- Node.js available to drive the raw DevTools Protocol over `WebSocket` (no
  extra npm packages needed — Node's built-in `ws`-free CDP driving via
  `node:http` + `ws`, or the project's existing CDP verification script if one
  already exists under `docs/`).

## Steps

1. **Static sanity check** — before touching a browser:
   - `grep -n "<script" index.html` → expect exactly three lines, all
     `<script src="...">` (`content.js`, `languages.config.js`, `script.js`),
     no bare `<script>` blocks with inline code.
   - Confirm `script.js` contains all eight blocks from
     [data-model.md](./data-model.md), in order, by checking for their marker
     comments/log tags (`[CONSOLE]`, `[HUB]`, `[MAP]`, `[PLAN]`) and the
     `window.__setLang__` / `window.__setTheme__` definitions.

2. **Launch the app headlessly and open it**, e.g.:
   ```sh
   msedge --headless=new --remote-debugging-port=9222 --user-data-dir=<tmp> "file:///<repo>/index.html"
   ```
   (or serve via a static file server if `file://` script loading is
   restricted in the environment — `script.js` must load either way per FR-002.)

3. **Connect over CDP** (Node + WebSocket to
   `http://localhost:9222/json`) and, per tool pane, script clicks +
   `Runtime.evaluate` checks:

   | Pane | Action | Expected result |
   |------|--------|------------------|
   | Shell nav | Click each `.shell-tab` | Corresponding `.shell-pane` gets `.on`, others lose it; no console errors |
   | Study Console | Start an exam, answer a question, finish | Score/progress renders correctly; retake-missed/skipped flows work; no `[CONSOLE]`-tagged errors |
   | Hub | Click a domain filter button, type in `#search` | Table filters correctly; `#count` updates; `#noresult` toggles correctly |
   | Neuron Map | Load the pane | SVG hub/leaf diagram renders with legend; no `[MAP]`-tagged errors |
   | 2-Week Plan | Click a few `.tasks li` items, reload | Checked state persists via `localStorage['ccaf_plan_progress_v1']`; progress bar % matches; no `[PLAN]`-tagged errors |
   | Language switcher | Switch `#lang-select` to a non-English language, then back to English | UI text updates via `translateNode`/`applyAll`; switching back restores original text; no console errors during the dynamic `translations/<code>.js` load |
   | Theme toggle | Click each `#theme-toggle button` | `data-theme` attribute updates on `<html>`; `localStorage['ccaf_theme']` persists; correct button gets `.on` |

4. **Check `Runtime.consoleAPICalled` events** collected during the whole
   walkthrough for any `error`-level entries — expect none beyond what
   already existed before the refactor (there should be zero, since this is
   a behavior-preserving move).

5. **Diff-review** `git diff --stat` — expect `index.html` shrinks by
   roughly the line count of the eight removed blocks (SC-001), and
   `script.js` is new and contains that code net of only the block-removal
   edits (no logic rewritten).

## Expected outcome

Every row in the table above passes with no new console errors, confirming
SC-002 (behavior parity) and — combined with step 1's static check —
SC-001 and SC-003 (extraction completeness, single-file discoverability).
