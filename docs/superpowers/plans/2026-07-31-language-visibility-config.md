# Language Visibility Config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the maintainer hide a language from the `#lang-select` dropdown site-wide by flipping a flag in a config file, validated by CI before it reaches `main`.

**Architecture:** A new `languages.config.js` at the repo root sets `window.CCAF_LANG_CONFIG`, loaded via `<script src>` in `index.html`'s `<head>` (not `fetch()`, so it still works when `index.html` is opened directly from disk). A small addition to the existing language-init IIFE in `index.html` removes disabled `<option>` elements from `#lang-select` and falls back to `en` if the visitor's saved language is disabled. A GitHub Action validates the config file's shape on every PR that touches it.

**Tech Stack:** Plain JS (matches the existing codebase — no framework, no build step). Node's built-in `node:test` runner for the validation script's unit tests (no new dependencies, no `package.json` needed elsewhere in the repo). GitHub Actions with `actions/setup-node`.

## Global Constraints

- `languages.config.js` is loaded via `<script src>`, never `fetch()` — this repo's `index.html` must keep working when opened directly via `file://`.
- A language code missing from the config object is treated as **enabled** (fail-open) — new languages added later via the `add-language` skill appear automatically.
- `en` can never be disabled: runtime code forces `cfg.en = true` regardless of file contents, and CI rejects a config with `en: false`.
- No deploy step is added anywhere — this repo has no build process; merging to `main` is the deploy (GitHub Pages serves `main` directly).
- Valid language codes = `en` + every filename under `translations/*.json`. No separate master-list file.
- All work happens on the `docs/language-visibility-config-spec` branch (already open as [PR #19](https://github.com/mikeminhxi/CCA-F-Study-Suite/pull/19)), matching this project's branch+PR convention for language-related work.

---

### Task 1: Add `languages.config.js`

**Files:**
- Create: `languages.config.js` (repo root)

**Interfaces:**
- Produces: global `window.CCAF_LANG_CONFIG` object, an `{ [langCode: string]: boolean }` map. Consumed by Task 2 (runtime filtering) and Task 3/4 (CI validation).

- [ ] **Step 1: Create the config file**

```js
// languages.config.js
// Controls which languages appear in the #lang-select dropdown.
// A code missing from this object is treated as enabled (true).
// "en" can never be disabled — runtime and CI both enforce this.
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

- [ ] **Step 2: Verify it loads correctly under Node**

Run:
```bash
node -e "var window={}; require('./languages.config.js'); console.log(Object.keys(window.CCAF_LANG_CONFIG).length, window.CCAF_LANG_CONFIG.en)"
```
Expected output: `13 true`

- [ ] **Step 3: Commit**

```bash
git add languages.config.js
git commit -m "feat: add languages.config.js for per-language visibility control"
```

---

### Task 2: Wire the config into `index.html`

**Files:**
- Modify: `index.html:6` (add script tag in `<head>`)
- Modify: `index.html:11491-11499` (language-init IIFE)

**Interfaces:**
- Consumes: `window.CCAF_LANG_CONFIG` from Task 1.
- Produces: no new exported interface — this is the leaf consumer of the config.

- [ ] **Step 1: Load the config file early in `<head>`**

In `index.html`, immediately after the `<title>` tag:

```html
<title>CCA-F Study Suite</title>
<script src="languages.config.js"></script>
```

- [ ] **Step 2: Filter the dropdown and add the disabled-language fallback**

Find this block in `index.html` (the end of the language-init IIFE):

```js
  window.__setLang__=function(l){
    lang=l; applyAll();
    var sel=document.getElementById('lang-select'); if(sel) sel.value=l;
    try{localStorage.setItem('ccaf_lang',l);}catch(e){}
  };
  window.addEventListener('load',function(){
    var saved='en'; try{saved=localStorage.getItem('ccaf_lang')||'en';}catch(e){}
    setTimeout(function(){ startObserver(); window.__setLang__(saved); },150);
  });
})();
```

Replace it with:

```js
  function getLangConfig(){
    var cfg=(window.CCAF_LANG_CONFIG&&typeof window.CCAF_LANG_CONFIG==='object')?window.CCAF_LANG_CONFIG:{};
    cfg.en=true;
    return cfg;
  }
  function applyLangVisibility(cfg){
    var sel=document.getElementById('lang-select'); if(!sel)return;
    Array.prototype.slice.call(sel.options).forEach(function(opt){
      if(cfg[opt.value]===false) opt.remove();
    });
  }
  window.__setLang__=function(l){
    lang=l; applyAll();
    var sel=document.getElementById('lang-select'); if(sel) sel.value=l;
    try{localStorage.setItem('ccaf_lang',l);}catch(e){}
  };
  window.addEventListener('load',function(){
    var cfg=getLangConfig();
    applyLangVisibility(cfg);
    var saved='en'; try{saved=localStorage.getItem('ccaf_lang')||'en';}catch(e){}
    if(cfg[saved]===false) saved='en';
    setTimeout(function(){ startObserver(); window.__setLang__(saved); },150);
  });
})();
```

- [ ] **Step 3: Manually verify baseline behavior (all languages enabled)**

Open `index.html` directly in a browser (double-click it, or use the `run` skill). Confirm:
- The dropdown still lists all 13 languages, in the same order as before.
- Switching languages still works as before.

- [ ] **Step 4: Manually verify a disabled language is hidden**

Edit `languages.config.js`, set `de: false`. Refresh the page in the browser. Confirm:
- German is no longer in the dropdown.
- All other languages are still present and still work.

- [ ] **Step 5: Manually verify the disabled+saved-preference fallback**

With `de: false` still set from Step 4: open the browser devtools console and run `localStorage.setItem('ccaf_lang','de')`, then refresh the page. Confirm:
- The app displays in English (not German), since `de` is disabled.
- In devtools, `localStorage.getItem('ccaf_lang')` still returns `'de'` (it was not overwritten).

Now edit `languages.config.js` back to `de: true` and refresh again. Confirm:
- The app now displays in German again automatically, with no need to re-select it from the dropdown.

- [ ] **Step 6: Restore `languages.config.js` to all-enabled and commit**

```bash
git add index.html languages.config.js
git commit -m "feat: hide disabled languages from the dropdown at runtime"
```

---

### Task 3: Node validation script + unit tests

**Files:**
- Create: `.github/scripts/validate-language-config.js`
- Test: `.github/scripts/validate-language-config.test.js`

**Interfaces:**
- Produces: `module.exports = { validateConfig, loadConfig, getValidCodes }` from `validate-language-config.js`:
  - `validateConfig(config: object, validCodes: string[]) -> { ok: boolean, errors: string[] }`
  - `loadConfig(repoRoot: string) -> object` (reads and safely evaluates `languages.config.js`)
  - `getValidCodes(repoRoot: string) -> string[]` (derived from `translations/*.json` + `'en'`)
- Consumed by: Task 4 (GitHub Actions workflow calls this script as a CLI).

- [ ] **Step 1: Write the failing tests**

```js
// .github/scripts/validate-language-config.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateConfig } = require('./validate-language-config.js');

test('accepts an all-true config with valid codes', function () {
  const result = validateConfig({ en: true, fr: true }, ['en', 'fr', 'de']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test('accepts missing keys (fail-open)', function () {
  const result = validateConfig({ en: true }, ['en', 'fr', 'de']);
  assert.equal(result.ok, true);
});

test('rejects an unknown language code', function () {
  const result = validateConfig({ en: true, xx: true }, ['en', 'fr']);
  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /unknown language code "xx"/);
});

test('rejects a non-boolean value', function () {
  const result = validateConfig({ en: true, fr: 'nope' }, ['en', 'fr']);
  assert.equal(result.ok, false);
  assert.match(result.errors[0], /must be true or false/);
});

test('rejects en set to false', function () {
  const result = validateConfig({ en: false }, ['en']);
  assert.equal(result.ok, false);
  assert.match(result.errors[0], /"en" cannot be set to false/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test .github/scripts/validate-language-config.test.js`
Expected: FAIL — `Cannot find module './validate-language-config.js'`

- [ ] **Step 3: Implement the validation script**

```js
// .github/scripts/validate-language-config.js
'use strict';
const fs = require('fs');
const path = require('path');

function validateConfig(config, validCodes) {
  const errors = [];
  const validSet = new Set(validCodes);
  Object.keys(config).forEach(function (code) {
    if (!validSet.has(code)) {
      errors.push('unknown language code "' + code + '" (no matching translations/' + code + '.json or "en")');
      return;
    }
    if (config[code] !== true && config[code] !== false) {
      errors.push('value for "' + code + '" must be true or false, got ' + JSON.stringify(config[code]));
    }
  });
  if (config.en === false) {
    errors.push('"en" cannot be set to false — English is the fallback language and is always shown');
  }
  return { ok: errors.length === 0, errors: errors };
}

function loadConfig(repoRoot) {
  const configPath = path.join(repoRoot, 'languages.config.js');
  const code = fs.readFileSync(configPath, 'utf8');
  const sandboxWindow = {};
  const fn = new Function('window', code);
  fn(sandboxWindow);
  return sandboxWindow.CCAF_LANG_CONFIG || {};
}

function getValidCodes(repoRoot) {
  const translationsDir = path.join(repoRoot, 'translations');
  const codes = fs.readdirSync(translationsDir)
    .filter(function (f) { return f.endsWith('.json'); })
    .map(function (f) { return f.replace(/\.json$/, ''); });
  codes.push('en');
  return codes;
}

function main() {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const config = loadConfig(repoRoot);
  const validCodes = getValidCodes(repoRoot);
  const result = validateConfig(config, validCodes);
  if (!result.ok) {
    result.errors.forEach(function (e) { console.error('ERROR: ' + e); });
    process.exit(1);
  }
  console.log('languages.config.js is valid (' + Object.keys(config).length + ' entries checked).');
}

module.exports = { validateConfig: validateConfig, loadConfig: loadConfig, getValidCodes: getValidCodes };

if (require.main === module) {
  main();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test .github/scripts/validate-language-config.test.js`
Expected: PASS — 5 tests, 0 failures

- [ ] **Step 5: Manually verify the CLI path against the real repo files**

Run: `node .github/scripts/validate-language-config.js`
Expected: `languages.config.js is valid (13 entries checked).` and exit code `0`

- [ ] **Step 6: Commit**

```bash
git add .github/scripts/validate-language-config.js .github/scripts/validate-language-config.test.js
git commit -m "feat: add validate-language-config script with unit tests"
```

---

### Task 4: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/validate-language-config.yml`

**Interfaces:**
- Consumes: `.github/scripts/validate-language-config.js` and `.test.js` from Task 3 (runs them as-is, no new interface).

- [ ] **Step 1: Write the workflow**

```yaml
# .github/workflows/validate-language-config.yml
name: Validate language config

on:
  pull_request:
    paths:
      - 'languages.config.js'
      - 'translations/**'
      - '.github/scripts/validate-language-config.js'
      - '.github/scripts/validate-language-config.test.js'
      - '.github/workflows/validate-language-config.yml'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Run unit tests
        run: node --test .github/scripts/validate-language-config.test.js
      - name: Validate languages.config.js
        run: node .github/scripts/validate-language-config.js
```

- [ ] **Step 2: Verify the workflow's commands locally**

Run both commands exactly as the workflow does, from the repo root:
```bash
node --test .github/scripts/validate-language-config.test.js
node .github/scripts/validate-language-config.js
```
Expected: both exit with code `0` and no `ERROR:` lines.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/validate-language-config.yml
git commit -m "ci: validate languages.config.js on pull requests"
```

- [ ] **Step 4: Push and confirm the check runs on the PR**

```bash
git push
```
Then open [PR #19](https://github.com/mikeminhxi/CCA-F-Study-Suite/pull/19) on GitHub and confirm the "Validate language config" check appears and passes.
