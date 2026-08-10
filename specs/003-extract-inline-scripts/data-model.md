# Code Structure Inventory: Extract Inline Scripts from index.html

This feature has no data entities in the traditional sense — it is a pure
code-motion refactor. This document instead inventories the eight logical
units being moved, their current line ranges in `index.html`, their
inter-block dependencies, and the shared globals they rely on, so the move
can be verified as complete and order-preserving.

## Blocks (in current `index.html` order)

| # | Current lines | Wrapper | Responsibility | Depends on |
|---|---------------|---------|-----------------|------------|
| 1 | 671–677 | plain (no IIFE) | `safeGet`/`safeSet` (localStorage helpers), `navIsCollapsed`/`expandNav`/`collapseNav` (nav state helpers) | none — pure functions, defines globals used by blocks 2, 7, 8 |
| 2 | 678–707 | IIFE | Shell tab switching (`.shell-tab` click → show `.shell-pane`), nav collapse toggle | Block 1's `navIsCollapsed`/`expandNav`/`collapseNav`; DOM elements `#shell-nav`, `#shell-nav-toggle`, `.shell-tab`, `.shell-pane` |
| 3 | 709–1542 | IIFE + try/catch (`[CONSOLE]` tag) | `showLoadError` fallback banner; main QDATA-driven exam engine (question rendering, scoring, retake-skipped/missed flows, sticky-header hide-on-scroll) | Global `QDATA` (from `content.js`, loaded in `<head>`); DOM elements throughout Study Console pane |
| 4 | 1543–1596 | IIFE + try/catch (`[HUB]` tag) | Domain filter buttons; decoder table built from `.rule` rows in the domain cards; live search filter | DOM elements `.fbtn`, `.domaincard`, `.rule`, `#decodeBody`, `#count`, `#noresult`, `#search` |
| 5 | 1597–1797 | IIFE + try/catch (`[MAP]` tag) | Neuron map: builds the SVG hub/leaf diagram from an inline `domains` array, positions nodes, wires legend/tooltips | Self-contained (own inline `domains` data); DOM element(s) for the map SVG container and legend |
| 6 | 1798–1893 | IIFE + try/catch (`[PLAN]` tag) | 2-week plan progress tracker: localStorage persistence (`ccaf_plan_progress_v1`), manual save-file fallback (download/load JSON), storage-works probe | DOM elements `.tasks li`, `#fill`, `#pct`, `#storageStatus`, `#fallbackBar`, `#fallbackMsg`, `#reset`, `#fbDownload`, `#fbInput`, `#fbLoad` |
| 7 | 1894–2021 | IIFE (no try/catch — top-level) | Lazy language loader: `loadLang`, dynamic-pattern translation (`translateNode`/`restoreNode`/`walk`/`applyAll`), `MutationObserver`-based re-translation, `window.__setLang__`, language-visibility config, `window.addEventListener('load', ...)` init | Block 1's `safeGet`/`safeSet`; global `window.CCAF_LANG_CONFIG` (from `languages.config.js`); dynamically injects `translations/<code>.js` `<script>` tags; defines `window.__setLang__` consumed by markup's `<select id="lang-select">` |
| 8 | 2022–2044 | IIFE (no try/catch — top-level) | Theme toggle: resolves `system`/`light`/`dark` preference via `matchMedia`, applies `data-theme` attribute, persists via `safeSet`, defines `window.__setTheme__` | Block 1's `safeGet`/`safeSet`; DOM elements `#theme-toggle button`; defines `window.__setTheme__` consumed by markup's theme-toggle buttons |

## Ordering constraint

Blocks MUST be concatenated into `script.js` in the exact order 1→8 shown
above. Block 1's helper functions are plain (unwrapped) function
declarations relied upon by blocks 2, 7, and 8 — JS function-declaration
hoisting means strict ordering isn't technically required for those calls to
resolve, but preserving source order keeps the diff a pure move (no
reordering) and avoids any risk from `"use strict"` scoping subtleties
inside the wrapped blocks.

## Global surface after extraction (unchanged from before)

- Reads: `QDATA` (from `content.js`), `window.CCAF_LANG_CONFIG` (from
  `languages.config.js`)
- Defines on `window`: `window.__setLang__`, `window.__setTheme__`,
  `window.__i18nRaf` (transient, set by the MutationObserver callback)
- Module-scope (not `window`-attached, but still global to the script file
  since blocks 1, 7, 8 are unwrapped/share file scope): `safeGet`, `safeSet`,
  `navIsCollapsed`, `expandNav`, `collapseNav`

No new globals are introduced and none are removed — this table exists so
the implementation step can `grep` `script.js` post-move and confirm every
symbol in this list still resolves.
