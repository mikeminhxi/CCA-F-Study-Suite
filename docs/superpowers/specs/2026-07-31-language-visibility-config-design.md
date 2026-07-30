# Language Visibility Config — Design

## Problem

The language dropdown in `index.html` (`#lang-select`, currently 13 languages: en, fr, de, it, pt, es, vn, zh, tw, ja, ko, hi, ru) hardcodes every supported language as always visible. The maintainer wants a way to hide a language from the dropdown (e.g. a translation that's rough/WIP) without deleting its code or `translations/<code>.json` file, and without hand-editing the `<option>` list in `index.html` every time.

## Scope

- Maintainer-controlled, site-wide visibility toggle per language. **Not** a per-visitor preference UI (that's an explicit non-goal for this iteration).
- Config is edited locally, goes through a branch + PR (matching the project's existing language-work convention), validated by CI, and takes effect on merge to `main` (GitHub Pages serves `main` directly — no separate deploy step exists or is needed).

## Design

### 1. Config file: `languages.config.js` (repo root)

```js
window.CCAF_LANG_CONFIG = {
  en: true,
  fr: true,
  de: true,
  it: true,
  pt: true,
  es: true,
  vn: true,
  zh: true,
  tw: true,
  ja: true,
  ko: true,
  hi: true,
  ru: true
};
```

- Plain JS (not JSON), because it's loaded via `<script src="languages.config.js"></script>` rather than `fetch()`. This matches the project's existing "single self-contained app, works even opened via `file://`" property — `fetch()` of a local JSON file is blocked by CORS when `index.html` is opened directly from disk without a server, whereas a `<script src>` tag is not.
- Loaded in `<head>`, before the dropdown-filtering logic runs, so there's no flash of hidden languages.
- **Fail-open default:** a language code missing from this object entirely is treated as `true` (visible). This means newly-added languages (via the `add-language` skill) show up automatically without requiring a config edit.
- **`en` is always visible.** Even if the file sets `en: false`, runtime code ignores it and CI rejects it — English is the base/fallback language and can't be fully disabled without breaking the app.

### 2. Master list of valid codes

No separate file. The valid set is computed as: `en` + every filename under `translations/*.json` (currently 13 codes total, matching the `<option>` list in `index.html`). This is the natural existing source of truth and needs no additional maintenance.

### 3. Runtime behavior (`index.html`)

Extends the existing language-init IIFE (around the `window.__setLang__` / `window.addEventListener('load', ...)` block near line 11496):

1. Read `window.CCAF_LANG_CONFIG` (default `{}` if the script failed to load — fail-open globally too).
2. Force `config.en = true` regardless of the file's contents.
3. For each `<option>` under `#lang-select`: if `config[code] === false`, remove that option from the DOM. All other options remain.
4. On load, when restoring the saved language from `localStorage` (`ccaf_lang`): if the saved code is disabled (`config[code] === false`), use `en` for this session instead. Do **not** overwrite the stored `localStorage` value — if the language is re-enabled later, the visitor's original preference silently comes back.

### 4. CI validation: `.github/workflows/validate-language-config.yml`

- **Trigger:** pull requests that modify `languages.config.js`.
- **Checks** (small Node script; loads the file by stubbing a `window` global before requiring it):
  1. Every key exists in the master list of valid codes (catches typos/unknown codes).
  2. Every value is strictly `true` or `false` (catches typos like `flase`, non-boolean values).
  3. `en` is not set to `false`.
- Fails the PR check with a clear message on any violation; passes otherwise.
- No deploy step is added — this repo has no build process, so merging to `main` *is* the deploy (GitHub Pages serves the branch directly).

### 5. Editing workflow

1. Branch off `main`.
2. Hand-edit `languages.config.js`, flip languages on/off.
3. Push, open a PR.
4. CI Action validates automatically.
5. Merge → change is live as soon as GitHub Pages picks up `main` (no manual deploy).

## Non-goals (this iteration)

- Per-visitor toggle UI (end users choosing which languages appear for themselves).
- A "master kill-switch" flag to disable all languages at once.
- Auto-adding new config entries when `add-language` runs (fail-open default makes this unnecessary — new languages just appear).

## Open follow-ups (not blocking)

- Whether the `add-language` skill should be updated to also add a `<code>: true` line to `languages.config.js` for documentation/discoverability purposes, even though it's not functionally required.
