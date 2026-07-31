# Language Visibility Config — Design

## Problem

The language dropdown in `index.html` (`#lang-select`, currently 13 languages: en, fr, de, it, pt, es, vn, zh, tw, ja, ko, hi, ru) hardcodes every supported language as always visible. The maintainer wants a way to hide a language from the dropdown (e.g. a translation that's rough/WIP) without deleting its code or `translations/<code>.json` file, and without hand-editing the `<option>` list — or any JS — every time.

## Scope

- Maintainer-controlled, site-wide visibility toggle per language. **Not** a per-visitor preference UI (that's an explicit non-goal for this iteration).
- The maintainer-facing interface is a **GitHub repo Variable**, edited from Settings -> Secrets and variables -> Actions -> Variables — not a file the maintainer hand-edits.

## Design

### 1. Runtime artifact: `languages.config.js` (repo root, generated)

```js
window.CCAF_LANG_CONFIG = {
  en: true,
  fr: true,
  de: true,
  ...
};
```

- Plain JS (not JSON), because it's loaded via `<script src="languages.config.js"></script>` rather than `fetch()`. This matches the project's existing "single self-contained app, works even opened via `file://`" property — `fetch()` of a local file is blocked by CORS when `index.html` is opened directly from disk without a server, whereas a `<script src>` tag is not. This is also why the repo Variable itself can't be read directly at runtime: there's no unauthenticated public API for Actions Variables, and even if there were, `fetch()`-ing it would break the `file://` case.
- **This file is generated, not hand-edited.** Its header says so. The source of truth is the `CCAF_LANG_CONFIG` repo Variable (see below); `languages.config.js` is the committed, CI-produced artifact `index.html` actually loads.
- Loaded in `<head>`, before the dropdown-filtering logic runs, so there's no flash of hidden languages.
- **Fail-open default:** a language code missing from this object entirely is treated as `true` (visible). This means newly-added languages (via the `add-language` skill) show up automatically without requiring a config edit.
- **`en` is always visible.** Even if the generated content sets `en: false` (it can't, see validation below), runtime code ignores it — English is the base/fallback language and can't be fully disabled without breaking the app.

### 2. Source of truth: `CCAF_LANG_CONFIG` repo Variable

A single Actions Variable holding a JSON object with the same shape as `window.CCAF_LANG_CONFIG`, e.g. `{"en":true,"fr":true,"de":false,...}`. One JSON variable rather than one variable per language, so adding a new language via the `add-language` skill never requires editing a workflow file.

### 3. Master list of valid codes

No separate file. The valid set is computed as: `en` + every filename under `translations/*.json` (currently 13 codes total, matching the `<option>` list in `index.html`). This is the natural existing source of truth and needs no additional maintenance.

### 4. Runtime behavior (`index.html`)

The language-init IIFE (around the `window.__setLang__` / `window.addEventListener('load', ...)` block near line 11496):

1. Reads `window.CCAF_LANG_CONFIG` (default `{}` if the script failed to load — fail-open globally too).
2. Forces `config.en = true` regardless of the file's contents.
3. For each `<option>` under `#lang-select`: if `config[code] === false`, removes that option from the DOM. All other options remain.
4. On load, when restoring the saved language from `localStorage` (`ccaf_lang`): if the saved code is disabled (`config[code] === false`), uses `en` for this session instead. Does **not** overwrite the stored `localStorage` value — if the language is re-enabled later, the visitor's original preference silently comes back.

### 5. Sync workflow: `.github/workflows/sync-language-config.yml`

- **Trigger:** `workflow_dispatch` only (manual "Run workflow" button in the Actions tab) — run it after changing the `CCAF_LANG_CONFIG` Variable. Not a schedule/poll: toggling a language is a deliberate, infrequent action, so polling would just create noisy no-op runs.
- **What it does** (`.github/scripts/sync-language-config.js`):
  1. Parses the `CCAF_LANG_CONFIG` Variable as JSON.
  2. Validates it (unknown codes, non-boolean values, `en: false` all rejected — reuses `validateConfig`/`getValidCodes` from `.github/scripts/validate-language-config.js`).
  3. Renders `languages.config.js` deterministically (`en` first, then remaining codes in the order given).
  4. Writes the file only if content actually changed.
  5. If changed, commits to a fixed branch (`chore/sync-language-config`, reset from `main` and force-pushed each run so repeated syncs before a merge update the same PR instead of piling up), opens a PR, assigns the maintainer.
- The existing `validate-language-config.yml` workflow (safety net, unchanged in spirit from before) still triggers on PRs touching `languages.config.js` and re-validates independently of how the change got there.

### 6. Editing workflow

1. In GitHub, go to Settings -> Secrets and variables -> Actions -> Variables, edit `CCAF_LANG_CONFIG`.
2. Run the **Sync language config** workflow (Actions tab -> "Run workflow").
3. It opens a PR with the regenerated `languages.config.js` if anything changed.
4. **Validate language config** re-checks the PR automatically.
5. Merge → change is live as soon as GitHub Pages picks up `main` (no manual deploy, no build step).

Hand-editing `languages.config.js` directly still technically works (CI validates the result the same way regardless of origin), but it's not the supported path — the file's own header says so, and the next sync run will overwrite any manual edit that doesn't match the Variable.

## Non-goals (this iteration)

- Per-visitor toggle UI (end users choosing which languages appear for themselves).
- A "master kill-switch" flag to disable all languages at once.
- Auto-adding new config entries when `add-language` runs (fail-open default makes this unnecessary — new languages just appear).
- A scheduled/automatic sync — toggling stays a deliberate two-step action (edit Variable, run workflow) rather than something that happens silently in the background.

## Open follow-ups (not blocking)

- Whether the `add-language` skill should be updated to also add a `<code>: true` line to `languages.config.js` / the `CCAF_LANG_CONFIG` Variable for documentation/discoverability purposes, even though it's not functionally required.
