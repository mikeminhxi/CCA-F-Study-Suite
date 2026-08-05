# Lazy Per-Language Script Files Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the 1.26 MB of inline translation dictionaries out of `index.html` into 16 lazily-loaded `translations/<code>.js` files, cutting `index.html` from 1.71 MB to ~450 KB while keeping offline/`file://` use, exact runtime fallback behavior, and the existing language-switch UX unchanged.

**Architecture:** Each language becomes one `<script src="translations/<code>.js">`-loadable file exporting `window.__LANG_<CODE>__` (metadata + `i18n` dict + `shell` dict + 8 real format functions). `index.html` keeps its existing TreeWalker/`MutationObserver` i18n engine untouched in shape, but replaces the eager 32-global dereference with a `loadLang(code, cb)` function that injects a `<script>` tag on first use and caches the result in `LANG_DATA[code]`. A missing/failed language load falls through to English exactly as a missing key does today.

**Tech Stack:** Vanilla JS, no build step (Constitution Principle I, amended in Task 6 to explicitly allow first-party local `.js` files with no bundler). Node.js (`vm`, `fs`) for one-time throwaway migration scripts (Constitution Principle IV).

## Global Constraints

- No build step, no bundler, no package manager, no new external network dependency — only first-party local files (Constitution Principle I, as amended by Task 6).
- Opening `index.html` directly via `file://` (no server) MUST still render every language correctly. This is why `translations/<code>.js` is loaded via `<script src>`, never `fetch()`.
- Every large single-object-literal edit to `index.html` MUST go through a throwaway Node script using brace-depth- and string-escape-aware boundary detection — never manual `Edit`/`Write` against the raw line, never naive `indexOf(';')` splitting (Constitution Principle IV).
- A failed/missing language load MUST degrade silently to English, matching today's `MAPS[lang]||{}` behavior — no thrown errors, no visible error UI.
- `CHANGELOG.md` MUST be updated for this change (Constitution Principle V).
- Every visual check MUST be done in both Light and Dark theme (Constitution Principle III).
- Throwaway scripts referenced below live at `scripts/tmp-*.js` and are deleted (`git rm` if tracked, `rm` if untracked) once their task's verification passes — they are not part of the shipped app.
- All work happens on branch `refactor/lazy-language-files` (created in Task 0), never committed directly to `main` — per this project's standing convention that language-touching work gets its own branch/PR.

---

### Task 0: Create the feature branch

**Files:** none.

**Interfaces:** none.

- [ ] **Step 1: Create and switch to the feature branch**

```bash
git status --short
```
Expected: clean working tree (the translation-drift fix and this plan doc should already be committed on `main` before starting). If not clean, stop and resolve first — don't branch from a dirty tree.

```bash
git checkout -b refactor/lazy-language-files
```

Every subsequent task's commits in this plan land on this branch. Task 7's final step pushes it and opens the PR — it does **not** create the branch (it already exists by then).

---

### Task 1: Extract all 16 languages from `index.html` into `translations/<code>.js`

**Files:**
- Create (throwaway): `scripts/tmp-extract-lang-files.js`
- Create (throwaway): `scripts/tmp-verify-lang-files.js`
- Create: `translations/vn.js`, `translations/ja.js`, `translations/zh.js`, `translations/tw.js`, `translations/es.js`, `translations/ko.js`, `translations/pt.js`, `translations/fr.js`, `translations/de.js`, `translations/hi.js`, `translations/ru.js`, `translations/it.js`, `translations/id.js`, `translations/ms.js`, `translations/pl.js`, `translations/th.js`
- Read only (not modified this task): `index.html`, `translations/<code>.json` (all 16, still present — used as the metadata source for `nativeName`/`sortHint`/`noSpaceBeforeUnit`, already at full parity with `index.html`)

**Interfaces:**
- Produces: 16 files, each defining `window.__LANG_<CODE>__ = { code, nativeName, sortHint, qsUnit, noSpaceBeforeUnit, questionFmt, questionsAvailableFmt, scoreSoFarFmt, bigScoreFmt, allCorrectFmt, retakeAllFmt, retakeMissedFmt, notThisTimeFmt, i18n: {...723 keys...}, shell: {...5 keys...} }`. Task 2's loader consumes this exact global name and shape.

- [ ] **Step 1: Write the extraction script**

```js
// scripts/tmp-extract-lang-files.js
// Throwaway migration script (Constitution Principle IV): brace-depth-aware
// extraction of the 32 inline i18n/shell dictionaries and 9 format tables
// out of index.html, combined with translations/<code>.json metadata
// (nativeName, sortHint, noSpaceBeforeUnit), into one translations/<code>.js
// file per language.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.argv[2] || '.';
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

function grabJson(globalName) {
  const tag = 'window.' + globalName + '=';
  const i = html.indexOf(tag);
  if (i < 0) throw new Error('not found: ' + globalName);
  const s = html.indexOf('{', i);
  let d = 0, inStr = false, esc = false;
  for (let j = s; j < html.length; j++) {
    const c = html[j];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) return JSON.parse(html.slice(s, j + 1)); }
  }
  throw new Error('unterminated: ' + globalName);
}

function grabVarText(varName) {
  const tag = 'var ' + varName + '=';
  const i = html.indexOf(tag);
  if (i < 0) throw new Error('not found: var ' + varName);
  const s = html.indexOf('{', i);
  let d = 0, inStr = false, esc = false, strCh = null;
  for (let j = s; j < html.length; j++) {
    const c = html[j];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (inStr) { if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) return html.slice(s, j + 1); }
  }
  throw new Error('unterminated var: ' + varName);
}

function grabVarLiteral(varName) {
  // Evaluate in a fresh VM sandbox -- needed because these tables contain
  // real function literals, not JSON. index.html is a trusted local file.
  return vm.runInNewContext('(' + grabVarText(varName) + ')');
}

const CODES = ['vn','ja','zh','tw','es','ko','pt','fr','de','hi','ru','it','id','ms','pl','th'];
const FMT_TABLES = {
  questionFmt: 'QUESTION_FMT',
  questionsAvailableFmt: 'QUESTIONS_AVAILABLE_FMT',
  scoreSoFarFmt: 'SCORE_SOFAR_FMT',
  bigScoreFmt: 'BIGSCORE_FMT',
  allCorrectFmt: 'ALLCORRECT_FMT',
  retakeAllFmt: 'RETAKEALL_FMT',
  retakeMissedFmt: 'RETAKEMISSED_FMT',
  notThisTimeFmt: 'NOTTHISTIME_FMT',
};

const i18nByCode = {};
const shellByCode = {};
for (const c of CODES) {
  const g = c === 'vn' ? '__I18N__' : '__I18N_' + c.toUpperCase() + '__';
  const s = c === 'vn' ? '__SHELL__' : '__SHELL_' + c.toUpperCase() + '__';
  i18nByCode[c] = grabJson(g);
  shellByCode[c] = grabJson(s);
}

const qsUnitByCode = grabVarLiteral('QS_UNIT');
const fmtByCode = {}; // fmtByCode[jsonKey][code] = live function
for (const jsonKey in FMT_TABLES) {
  fmtByCode[jsonKey] = grabVarLiteral(FMT_TABLES[jsonKey]);
}

fs.mkdirSync(path.join(ROOT, 'translations'), { recursive: true });

const report = [];
for (const c of CODES) {
  const staged = JSON.parse(fs.readFileSync(path.join(ROOT, 'translations', c + '.json'), 'utf8'));
  const i18nCount = Object.keys(i18nByCode[c]).length;
  const shellCount = Object.keys(shellByCode[c]).length;
  if (i18nCount !== 723) throw new Error(c + ': expected 723 i18n keys, got ' + i18nCount);
  if (shellCount !== 5) throw new Error(c + ': expected 5 shell keys, got ' + shellCount);

  const lines = [];
  lines.push('window.__LANG_' + c.toUpperCase() + '__ = {');
  lines.push('  code: ' + JSON.stringify(c) + ',');
  lines.push('  nativeName: ' + JSON.stringify(staged.nativeName) + ',');
  lines.push('  sortHint: ' + JSON.stringify(staged.sortHint) + ',');
  lines.push('  qsUnit: ' + JSON.stringify(qsUnitByCode[c]) + ',');
  lines.push('  noSpaceBeforeUnit: ' + JSON.stringify(!!staged.noSpaceBeforeUnit) + ',');
  for (const jsonKey in FMT_TABLES) {
    const fn = fmtByCode[jsonKey][c];
    if (typeof fn !== 'function') throw new Error(c + ': missing ' + jsonKey);
    lines.push('  ' + jsonKey + ': ' + fn.toString() + ',');
  }
  lines.push('  i18n: ' + JSON.stringify(i18nByCode[c], null, 2).split('\n').join('\n  ') + ',');
  lines.push('  shell: ' + JSON.stringify(shellByCode[c], null, 2).split('\n').join('\n  '));
  lines.push('};');
  lines.push('');

  const outPath = path.join(ROOT, 'translations', c + '.js');
  fs.writeFileSync(outPath, lines.join('\n'));
  report.push(c + ': wrote ' + outPath + ' (' + i18nCount + ' i18n, ' + shellCount + ' shell, 8 fmt fns)');
}
console.log(report.join('\n'));
```

- [ ] **Step 2: Run the extraction script**

Run: `node scripts/tmp-extract-lang-files.js .`
Expected: 16 lines of output, one per language, each ending `(723 i18n, 5 shell, 8 fmt fns)`. No thrown errors.

- [ ] **Step 3: Write the round-trip verification script**

```js
// scripts/tmp-verify-lang-files.js
// Throwaway verification script: re-extracts the same 32 dictionaries + 9
// format tables from index.html independently, loads every generated
// translations/<code>.js in a fresh VM sandbox, and asserts the loaded data
// is byte-for-byte/output-for-output identical to what's still in index.html.
// index.html itself is NOT modified by this script or by Task 1 at all.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const ROOT = process.argv[2] || '.';
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

function grabJson(globalName) {
  const tag = 'window.' + globalName + '=';
  const i = html.indexOf(tag);
  const s = html.indexOf('{', i);
  let d = 0, inStr = false, esc = false;
  for (let j = s; j < html.length; j++) {
    const c = html[j];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) return JSON.parse(html.slice(s, j + 1)); }
  }
  throw new Error('unterminated: ' + globalName);
}
function grabVarText(varName) {
  const tag = 'var ' + varName + '=';
  const i = html.indexOf(tag);
  const s = html.indexOf('{', i);
  let d = 0, inStr = false, esc = false, strCh = null;
  for (let j = s; j < html.length; j++) {
    const c = html[j];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (inStr) { if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) return html.slice(s, j + 1); }
  }
  throw new Error('unterminated var: ' + varName);
}
function grabVarLiteral(varName) { return vm.runInNewContext('(' + grabVarText(varName) + ')'); }

const CODES = ['vn','ja','zh','tw','es','ko','pt','fr','de','hi','ru','it','id','ms','pl','th'];
const FMT_TABLES = {
  questionFmt: ['QUESTION_FMT', [3, 10]],
  questionsAvailableFmt: ['QUESTIONS_AVAILABLE_FMT', [7]],
  scoreSoFarFmt: ['SCORE_SOFAR_FMT', [4, 10]],
  bigScoreFmt: ['BIGSCORE_FMT', [8, 80]],
  allCorrectFmt: ['ALLCORRECT_FMT', [10]],
  retakeAllFmt: ['RETAKEALL_FMT', [10]],
  retakeMissedFmt: ['RETAKEMISSED_FMT', [3]],
  notThisTimeFmt: ['NOTTHISTIME_FMT', ['A']],
};

const expectedI18n = {}, expectedShell = {};
for (const c of CODES) {
  expectedI18n[c] = grabJson(c === 'vn' ? '__I18N__' : '__I18N_' + c.toUpperCase() + '__');
  expectedShell[c] = grabJson(c === 'vn' ? '__SHELL__' : '__SHELL_' + c.toUpperCase() + '__');
}
const expectedQsUnit = grabVarLiteral('QS_UNIT');
const expectedFmt = {};
for (const jsonKey in FMT_TABLES) expectedFmt[jsonKey] = grabVarLiteral(FMT_TABLES[jsonKey][0]);

let failures = 0;
for (const c of CODES) {
  const jsPath = path.join(ROOT, 'translations', c + '.js');
  const src = fs.readFileSync(jsPath, 'utf8');
  const sandboxWindow = {};
  // Run in the CURRENT realm (new Function), not vm.runInNewContext (a
  // separate Realm): assert.deepEqual/deepStrictEqual compares prototype
  // identity, so cross-realm objects fail deepEqual even when
  // structurally identical -- confirmed by a minimal repro during Task 1.
  new Function('window', src)(sandboxWindow);
  const data = sandboxWindow['__LANG_' + c.toUpperCase() + '__'];
  try {
    assert.equal(data.code, c, 'code mismatch');
    assert.deepEqual(data.i18n, expectedI18n[c], 'i18n mismatch');
    assert.deepEqual(data.shell, expectedShell[c], 'shell mismatch');
    assert.equal(data.qsUnit, expectedQsUnit[c], 'qsUnit mismatch');
    for (const jsonKey in FMT_TABLES) {
      const [, args] = FMT_TABLES[jsonKey];
      const got = data[jsonKey].apply(null, args);
      const want = expectedFmt[jsonKey][c].apply(null, args);
      assert.equal(got, want, jsonKey + ' output mismatch for args ' + JSON.stringify(args));
    }
    console.log(c, 'OK');
  } catch (e) {
    failures++;
    console.error(c, 'FAIL:', e.message);
  }
}
if (failures) { console.error('\n' + failures + ' language(s) failed verification.'); process.exit(1); }
console.log('\nAll 16 languages verified against index.html.');
```

- [ ] **Step 4: Run the verification script**

Run: `node scripts/tmp-verify-lang-files.js .`
Expected: 16 lines `<code> OK` followed by `All 16 languages verified against index.html.`, exit code 0. If any language fails, fix the extraction script (do not hand-edit the generated `.js` files) and re-run both Step 2 and Step 4.

- [ ] **Step 5: Delete the throwaway scripts and commit the generated files**

```bash
rm scripts/tmp-extract-lang-files.js scripts/tmp-verify-lang-files.js
git add translations/*.js
git commit -m "feat: generate translations/<code>.js from index.html inline dictionaries

Extracted via a throwaway brace-depth-aware Node script (deleted after
use, per Constitution Principle IV) and round-trip verified against
index.html. index.html itself is unchanged in this commit; the old
inline dictionaries and translations/*.json are both still present
and still what the app actually uses."
```

---

### Task 2: Rewire `index.html` to lazily load `translations/<code>.js`

**Files:**
- Create (throwaway): `scripts/tmp-rewire-index.js`
- Modify: `index.html` (removes lines in the 1549–13261 range and the 14690–14836 range as they exist at the start of this task; inserts the new loader in their place — see script below, which locates these by content, not hardcoded line numbers, since Task 1's commit may have shifted nothing in `index.html` but future edits shouldn't be assumed away)

**Interfaces:**
- Consumes: `translations/<code>.js` files and the `window.__LANG_<CODE>__` shape produced by Task 1.
- Produces: `LANG_DATA` (object, `code -> loaded __LANG_XX__ data or undefined`), `loadLang(code, cb)` (function; loads and caches a language, then calls `cb()`), both scoped inside the same IIFE `window.__setLang__` already lives in. No other task depends on these being exposed further.

- [ ] **Step 1: Write the rewire script**

```js
// scripts/tmp-rewire-index.js
// Throwaway migration script (Constitution Principle IV): removes the 1.26MB
// inline i18n dictionary <script> block and the eager MAPS/SHELLS/format-table
// block from index.html, replacing them with a lazy per-language <script src>
// loader. Run ONLY after Task 1's translations/<code>.js files exist and are
// verified. Locates blocks by content (brace-depth scanning + anchor strings),
// not by hardcoded line numbers.
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.';
const file = path.join(ROOT, 'index.html');
let html = fs.readFileSync(file, 'utf8');

function findBlockEnd(text, fromIdx) {
  const s = text.indexOf('{', fromIdx);
  let d = 0, inStr = false, esc = false, strCh = null;
  for (let j = s; j < text.length; j++) {
    const c = text[j];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (inStr) { if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) return j + 1; }
  }
  throw new Error('unterminated block from ' + fromIdx);
}

// --- 1. Remove the giant inline dictionary <script> block (32 globals) ---
const dictOpenTag = '<script>window.__I18N__=';
const dictStart = html.indexOf(dictOpenTag);
if (dictStart < 0) throw new Error('dictionary block not found -- already migrated?');
let cursor = findBlockEnd(html, dictStart);
const dictGlobalOrder = [
  '__SHELL__','__I18N_JA__','__SHELL_JA__','__I18N_ZH__','__SHELL_ZH__',
  '__I18N_TW__','__SHELL_TW__','__I18N_ES__','__SHELL_ES__','__I18N_KO__','__SHELL_KO__',
  '__I18N_PT__','__SHELL_PT__','__I18N_FR__','__SHELL_FR__','__I18N_DE__','__SHELL_DE__',
  '__I18N_HI__','__SHELL_HI__','__I18N_RU__','__SHELL_RU__','__I18N_IT__','__SHELL_IT__',
  '__I18N_ID__','__SHELL_ID__','__I18N_MS__','__SHELL_MS__','__I18N_PL__','__SHELL_PL__',
  '__I18N_TH__','__SHELL_TH__',
];
for (const g of dictGlobalOrder) {
  const tag = 'window.' + g + '=';
  const idx = html.indexOf(tag, cursor);
  if (idx < 0) throw new Error('expected ' + g + ' right after previous global, not found');
  // The gap between one global's closing '}' and the next 'window.X=' is
  // the first global's trailing ';' plus a line ending -- on this repo's
  // checkout that's '\r\n', not '\n', so strip a leading ';\s*' the same
  // way the MAPS/table loop below already does (confirmed against the
  // real file during Task 2; a bare .trim() left the ';' behind and
  // failed the emptiness check on every boundary).
  if (html.slice(cursor, idx).replace(/^;\s*/, '').trim() !== '') throw new Error('unexpected content between globals near ' + g);
  cursor = findBlockEnd(html, idx);
}
const dictCloseTagIdx = html.indexOf('</script>', cursor);
if (dictCloseTagIdx < 0) throw new Error('closing </script> not found for dictionary block');
if (html.slice(cursor, dictCloseTagIdx).replace(/^;\s*/, '').trim() !== '') throw new Error('unexpected trailing content before </script>');
const dictBlockEnd = dictCloseTagIdx + '</script>'.length;

html = html.slice(0, dictStart) + html.slice(dictBlockEnd);

// --- 2. Replace the eager MAPS/SHELLS/QS_UNIT/8-format-table block with the loader ---
const mapsStart = html.indexOf('var MAPS={');
if (mapsStart < 0) throw new Error('var MAPS={ not found -- already migrated?');
let c2 = findBlockEnd(html, mapsStart);
const tableOrder = ['SHELLS','QS_UNIT','QUESTION_FMT','SCORE_SOFAR_FMT','BIGSCORE_FMT',
  'ALLCORRECT_FMT','RETAKEALL_FMT','RETAKEMISSED_FMT','NOTTHISTIME_FMT','QUESTIONS_AVAILABLE_FMT'];
for (const v of tableOrder) {
  const tag = 'var ' + v + '=';
  const idx = html.indexOf(tag, c2);
  if (idx < 0) throw new Error('expected var ' + v + ' right after previous table, not found');
  if (html.slice(c2, idx).replace(/^;\s*/, '').trim() !== '') throw new Error('unexpected content before var ' + v);
  c2 = findBlockEnd(html, idx);
}
if (html[c2] === ';') c2++; // consume the final table's trailing semicolon

const loaderCode = [
  '  var LANG_DATA={};',
  '  var loadToken=0;',
  '  function loadLang(code,cb){',
  "    if(code==='en'||LANG_DATA[code]){cb();return;}",
  '    var myToken=++loadToken;',
  "    var s=document.createElement('script');",
  "    s.src='translations/'+code+'.js';",
  '    s.onload=function(){',
  '      if(myToken!==loadToken)return;',
  "      LANG_DATA[code]=window['__LANG_'+code.toUpperCase()+'__'];",
  '      cb();',
  '    };',
  '    s.onerror=function(){ if(myToken===loadToken) cb(); };',
  '    document.head.appendChild(s);',
  '  }',
].join('\n');

html = html.slice(0, mapsStart) + loaderCode + '\n' + html.slice(c2);

// --- 3. Point-fix the remaining MAPS[lang]/SHELLS[lang]/*_FMT[lang] call sites ---
const replacements = [
  [
    "    var map=MAPS[lang]||{};\n    var key=norm(raw), tr=map[key];\n    if(tr==null){\n      var qm=key.match(/^(\\d+)\\s+Qs$/);\n      if(qm && QS_UNIT[lang]) tr=qm[1]+((lang==='ja'||lang==='zh'||lang==='tw'||lang==='ko')?'':' ')+QS_UNIT[lang];\n    }",
    "    var d=LANG_DATA[lang]||{};\n    var map=d.i18n||{};\n    var key=norm(raw), tr=map[key];\n    if(tr==null){\n      var qm=key.match(/^(\\d+)\\s+Qs$/);\n      if(qm && d.qsUnit) tr=qm[1]+(d.noSpaceBeforeUnit?'':' ')+d.qsUnit;\n    }"
  ],
  ["if(qn && QUESTION_FMT[lang]) tr=QUESTION_FMT[lang](qn[1],qn[2]);", "if(qn && d.questionFmt) tr=d.questionFmt(qn[1],qn[2]);"],
  ["if(ssf && SCORE_SOFAR_FMT[lang]) tr=SCORE_SOFAR_FMT[lang](ssf[1],ssf[2]);", "if(ssf && d.scoreSoFarFmt) tr=d.scoreSoFarFmt(ssf[1],ssf[2]);"],
  ["if(bsf && BIGSCORE_FMT[lang]) tr=BIGSCORE_FMT[lang](bsf[1],bsf[2]);", "if(bsf && d.bigScoreFmt) tr=d.bigScoreFmt(bsf[1],bsf[2]);"],
  ["if(acf && ALLCORRECT_FMT[lang]) tr=ALLCORRECT_FMT[lang](acf[1]);", "if(acf && d.allCorrectFmt) tr=d.allCorrectFmt(acf[1]);"],
  ["if(raf && RETAKEALL_FMT[lang]) tr=RETAKEALL_FMT[lang](raf[1]);", "if(raf && d.retakeAllFmt) tr=d.retakeAllFmt(raf[1]);"],
  ["if(rmf && RETAKEMISSED_FMT[lang]) tr=RETAKEMISSED_FMT[lang](rmf[1]);", "if(rmf && d.retakeMissedFmt) tr=d.retakeMissedFmt(rmf[1]);"],
  ["if(ntf && NOTTHISTIME_FMT[lang]) tr=NOTTHISTIME_FMT[lang](ntf[1]);", "if(ntf && d.notThisTimeFmt) tr=d.notThisTimeFmt(ntf[1]);"],
  ["if(qav && QUESTIONS_AVAILABLE_FMT[lang]) tr=QUESTIONS_AVAILABLE_FMT[lang](qav[1]);", "if(qav && d.questionsAvailableFmt) tr=d.questionsAvailableFmt(qav[1]);"],
  ["      var shell=SHELLS[lang];\n", "      var shell=(LANG_DATA[lang]&&LANG_DATA[lang].shell);\n"],
  [
    "  window.__setLang__=function(l){\n    lang=l; applyAll();\n    var sel=document.getElementById('lang-select'); if(sel) sel.value=l;\n    try{localStorage.setItem('ccaf_lang',l);}catch(e){}\n  };",
    "  window.__setLang__=function(l){\n    lang=l;\n    var sel=document.getElementById('lang-select'); if(sel) sel.value=l;\n    try{localStorage.setItem('ccaf_lang',l);}catch(e){}\n    loadLang(l, applyAll);\n  };"
  ],
];
for (const [oldStr, newStr] of replacements) {
  // Try as-written (\n) first, then retry with \r\n line endings before
  // giving up -- this section of index.html is CRLF on disk even though
  // the plan text above is written with \n (same root cause as the fix
  // just above; confirmed during Task 2). Keeps the diff surgical instead
  // of normalizing line endings across the whole file.
  let os = oldStr, ns = newStr;
  let count = html.split(os).length - 1;
  if (count !== 1) {
    os = oldStr.split('\n').join('\r\n');
    ns = newStr.split('\n').join('\r\n');
    count = html.split(os).length - 1;
  }
  if (count !== 1) throw new Error('expected exactly 1 occurrence, found ' + count + ' for:\n' + oldStr.slice(0, 90));
  html = html.replace(os, ns);
}

fs.writeFileSync(file, html);
console.log('index.html rewired. New size:', (fs.statSync(file).size / 1024).toFixed(0) + ' KB');
```

- [ ] **Step 2: Run the rewire script**

Run: `node scripts/tmp-rewire-index.js .`
Expected: `index.html rewired. New size: ~4XX KB` (down from ~1670 KB), no thrown errors. If it throws, `git checkout -- index.html` to revert and inspect the error before retrying — do not attempt to hand-patch a partially-rewired file.

- [ ] **Step 3: Grep-verify the old globals are gone and the new loader is present**

Run:
```bash
grep -c "window\.__I18N_\|window\.__SHELL_\|var MAPS=\|var QUESTION_FMT=" index.html
grep -c "var LANG_DATA=\|function loadLang(" index.html
```
Expected: first command outputs `0`, second outputs `2`.

- [ ] **Step 4: Delete the throwaway script**

```bash
rm scripts/tmp-rewire-index.js
```

- [ ] **Step 5: Manual/CDP browser verification across languages**

Using the project's established CDP-driven headless Edge verification approach: for at least `en`, `fr` (Latin), `ja` (CJK format functions), and `th` (largest file, recently-added), load `index.html` from a local static server, switch languages via `#lang-select`, and confirm:
- Study, Exam, Cheat-sheet, and Map tabs render translated text.
- A dynamic string renders correctly post-switch (e.g. start an exam, confirm "Question 3 / 10"-style text matches the target language's `questionFmt` output).
- Switching back to `en` restores original text (the `n.__en` cache round-trip still works).
- Both Light and Dark theme look correct for at least one non-English language (Constitution Principle III).

Then, separately: open `index.html` **directly via `file://`** (double-click the file, or `powershell -c "Start-Process 'index.html'"`), with no server running, and confirm a non-English language (e.g. `fr`) still renders fully translated. This is the check that validates the `<script src>`-over-`fetch()` design decision — it must be done explicitly, not assumed from the server-based test.

Finally: temporarily rename `translations/fr.js` to `translations/fr.js.bak`, reload, switch to French, confirm the app shows English text with no console errors and no broken UI (the `onerror` fallback), then rename it back.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: lazily load translations/<code>.js instead of inline dictionaries

index.html no longer embeds all 16 languages' dictionaries; it loads
the active language's translations/<code>.js via <script src> on
demand (not fetch(), to keep file:// / offline use working) and
caches it in LANG_DATA. Missing/failed loads fall back to English,
matching prior behavior. index.html: ~1670KB -> ~4XXKB."
```

---

### Task 3: Delete `translations/<code>.json`, rewrite `translations/README.md`

**Files:**
- Delete: `translations/vn.json`, `ja.json`, `zh.json`, `tw.json`, `es.json`, `ko.json`, `pt.json`, `fr.json`, `de.json`, `hi.json`, `ru.json`, `it.json`, `id.json`, `ms.json`, `pl.json`, `th.json`
- Modify: `translations/README.md`

**Interfaces:**
- Consumes: nothing (Task 1's `.js` files are already the shipped source of truth as of Task 2's commit).
- Produces: nothing new — this task only removes the now-redundant duplicate.

- [ ] **Step 1: Confirm `index.html` no longer references the JSON files or old globals**

Run: `grep -rn "translations/.*\.json" index.html`
Expected: no output (empty). (`index.html` never referenced the JSON files directly — this is a safety check, not an expected source of matches.)

- [ ] **Step 2: Delete the JSON files**

```bash
git rm translations/vn.json translations/ja.json translations/zh.json translations/tw.json \
  translations/es.json translations/ko.json translations/pt.json translations/fr.json \
  translations/de.json translations/hi.json translations/ru.json translations/it.json \
  translations/id.json translations/ms.json translations/pl.json translations/th.json
```

- [ ] **Step 3: Rewrite `translations/README.md`**

```markdown
# translations/

One file per supported language: `<code>.js`, defining
`window.__LANG_<CODE>__` (metadata + `i18n` dict + `shell` dict + format
functions). `index.html` loads the active language's file on demand via a
`<script src="translations/<code>.js">` tag (not `fetch()` — this project
must still work when `index.html` is opened directly via `file://`, which
`fetch()` of a local file cannot do). This is the single source of truth
for translated copy: there is no separate staged/inline distinction anymore.

Each file has exactly:
- 5 metadata fields: `code`, `nativeName`, `sortHint`, `qsUnit`, `noSpaceBeforeUnit`
- 8 format functions: `questionFmt`, `questionsAvailableFmt`, `scoreSoFarFmt`,
  `bigScoreFmt`, `allCorrectFmt`, `retakeAllFmt`, `retakeMissedFmt`, `notThisTimeFmt`
- `i18n`: 723 UI-copy/concept string keys
- `shell`: 5 nav-label keys (`brand_sub`, `tab_console`, `tab_hub`, `tab_map`, `tab_plan`)

To add a new language, see the `add-language` and `fetch-language-dictionary`
skills — the workflow is: draft a new `translations/<code>.js` (using an
existing file's keyset as the baseline), add one `<option>` to `#lang-select`
in `index.html`, update the READMEs.
```

- [ ] **Step 4: Commit**

```bash
git add translations/README.md
git commit -m "chore: remove translations/*.json, now superseded by translations/*.js

translations/<code>.js (added in the previous commit) is the single
source of truth for translated copy; the staged-JSON-then-inject-into-
index.html two-copy workflow no longer exists."
```

---

### Task 4: Update CI validation for the new file extension

**Files:**
- Modify: `.github/scripts/validate-language-config.js`
- Modify: `.github/scripts/validate-language-config.test.js`

**Interfaces:**
- Consumes: `translations/*.js` files on disk (via `fs.readdirSync`).
- Produces: same as before — `validateConfig`/`getValidCodes` exports, now sourcing valid codes from `.js` files instead of `.json`, plus a new exported `checkLanguageFileParity` used by the new test.

- [ ] **Step 1: Read the current `getValidCodes` implementation to confirm the exact line to change**

Run: `grep -n "readdirSync\|\.json" .github/scripts/validate-language-config.js`
Expected output includes a line like:
```js
const codes = fs.readdirSync(path.join(repoRoot, 'translations'))
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace(/\.json$/, ''));
```

- [ ] **Step 2: Update the glob/strip logic**

Use Edit to change:
- `.filter(f => f.endsWith('.json'))` → `.filter(f => f.endsWith('.js'))`
- `.map(f => f.replace(/\.json$/, ''))` → `.map(f => f.replace(/\.js$/, ''))`

- [ ] **Step 3: Add a keyset-parity check function to the same file**

Append to `.github/scripts/validate-language-config.js` (after the existing exports, keeping the module's existing `module.exports = { ... }` pattern — add `checkLanguageFileParity` to that object):

```js
function checkLanguageFileParity(repoRoot) {
  const vm = require('vm');
  const dir = path.join(repoRoot, 'translations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  const REQUIRED_FMT_KEYS = ['questionFmt','questionsAvailableFmt','scoreSoFarFmt',
    'bigScoreFmt','allCorrectFmt','retakeAllFmt','retakeMissedFmt','notThisTimeFmt'];
  let baselineI18nKeys = null, baselineShellKeys = null;
  const errors = [];
  for (const f of files) {
    const code = f.replace(/\.js$/, '');
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const sandboxWindow = {};
    vm.runInNewContext(src, { window: sandboxWindow });
    const data = sandboxWindow['__LANG_' + code.toUpperCase() + '__'];
    if (!data) { errors.push(f + ': did not define window.__LANG_' + code.toUpperCase() + '__'); continue; }
    for (const k of REQUIRED_FMT_KEYS) {
      if (typeof data[k] !== 'function') errors.push(f + ': missing or non-function "' + k + '"');
    }
    const i18nKeys = Object.keys(data.i18n || {}).sort();
    const shellKeys = Object.keys(data.shell || {}).sort();
    if (baselineI18nKeys === null) { baselineI18nKeys = i18nKeys; baselineShellKeys = shellKeys; }
    else {
      if (JSON.stringify(i18nKeys) !== JSON.stringify(baselineI18nKeys)) errors.push(f + ': i18n keyset differs from baseline');
      if (JSON.stringify(shellKeys) !== JSON.stringify(baselineShellKeys)) errors.push(f + ': shell keyset differs from baseline');
    }
  }
  return errors;
}
```

Also add a call to it in the script's main execution path (wherever `validateConfig`'s result is currently checked and the process exits non-zero on failure) so CI fails if parity breaks:

```js
const parityErrors = checkLanguageFileParity(repoRoot);
if (parityErrors.length) {
  console.error('Language file parity errors:\n' + parityErrors.join('\n'));
  process.exitCode = 1;
}
```

And add `checkLanguageFileParity` to the file's `module.exports`.

- [ ] **Step 4: Add a test for the parity check**

Add to `.github/scripts/validate-language-config.test.js` (following the existing `node:test` + temp-dir pattern already used in that file for `getValidCodes`/`validateConfig` tests):

```js
test('checkLanguageFileParity flags a keyset mismatch', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-parity-'));
  fs.mkdirSync(path.join(dir, 'translations'));
  fs.writeFileSync(path.join(dir, 'translations', 'aa.js'),
    "window.__LANG_AA__={questionFmt:function(){},questionsAvailableFmt:function(){}," +
    "scoreSoFarFmt:function(){},bigScoreFmt:function(){},allCorrectFmt:function(){}," +
    "retakeAllFmt:function(){},retakeMissedFmt:function(){},notThisTimeFmt:function(){}," +
    "i18n:{a:'1',b:'2'},shell:{x:'1'}};");
  fs.writeFileSync(path.join(dir, 'translations', 'bb.js'),
    "window.__LANG_BB__={questionFmt:function(){},questionsAvailableFmt:function(){}," +
    "scoreSoFarFmt:function(){},bigScoreFmt:function(){},allCorrectFmt:function(){}," +
    "retakeAllFmt:function(){},retakeMissedFmt:function(){},notThisTimeFmt:function(){}," +
    "i18n:{a:'1'},shell:{x:'1'}};"); // missing key 'b' -- should be flagged
  const { checkLanguageFileParity } = require('./validate-language-config.js');
  const errors = checkLanguageFileParity(dir);
  assert.ok(errors.some(e => e.includes('bb.js') && e.includes('i18n keyset differs')));
  fs.rmSync(dir, { recursive: true, force: true });
});
```

- [ ] **Step 5: Run the test suite**

Run: `node --test .github/scripts/validate-language-config.test.js`
Expected: all tests pass, including the new one.

- [ ] **Step 6: Run the validator against the real repo**

Run: `node .github/scripts/validate-language-config.js`
Expected: exits 0, no parity errors (Task 1's extraction guarantees identical keysets across all 16 files).

- [ ] **Step 7: Commit**

```bash
git add .github/scripts/validate-language-config.js .github/scripts/validate-language-config.test.js
git commit -m "ci: validate translations/*.js instead of *.json, add keyset-parity check

Prevents the per-language drift (5 missing i18n keys in 7 files, 7
missing format fields in 2 files) that motivated this migration from
recurring silently."
```

---

### Task 5: Update the language-authoring skills for the new single-file format

**Files:**
- Modify: `.claude/skills/fetch-language-dictionary/SKILL.md`
- Modify: `.claude/skills/add-language/SKILL.md`
- Modify: `.claude/skills/update-translations/SKILL.md`

**Interfaces:**
- None (documentation-only; these files are read by Claude Code when the skills are invoked, not by the app or CI).

- [ ] **Step 1: `fetch-language-dictionary/SKILL.md` — update the frontmatter description**

Use Edit, old string:
```
description: Pre-step for adding a new UI language to the CCA-F Study Suite. Generates the full translated dictionary for a target language and stages it as a local JSON file under translations/, WITHOUT touching index.html. Run this before the add-language skill whenever the user asks to add/translate/support a new language. Use on its own if the user just wants translations drafted/reviewed/edited before committing to wiring them into the app.
```
new string:
```
description: Pre-step for adding a new UI language to the CCA-F Study Suite. Generates the full translated dictionary for a target language and writes it directly to translations/<code>.js in its final, shipped form, WITHOUT touching index.html. Run this before the add-language skill whenever the user asks to add/translate/support a new language. Use on its own if the user just wants translations drafted/reviewed/edited before committing to wiring the dropdown entry in.
```

- [ ] **Step 2: `fetch-language-dictionary/SKILL.md` — update the two-skill-split rationale**

Use Edit, old string:
```
Translating all 531 keys is the expensive, generation-heavy part of adding a
language. Wiring the result into `index.html` is a cheap,
mechanical script step ([add-language](../add-language/SKILL.md)). Keeping
these as two separate skills means:

- A failed or interrupted injection never forces re-translating from scratch
  — the staged file is durable, sitting on disk under `translations/`.
- The maintainer can review or hand-edit the staged JSON before anything
  touches the 600KB app file.
- A PR for a new language includes `translations/<code>.json` as a clean,
  reviewable diff of the actual translations, separate from the noisy
  in-app dictionary diff.

**This skill never edits `index.html`.** Its only output is
`translations/<code>.json`.
```
new string:
```
Translating all 723 keys is the expensive, generation-heavy part of adding a
language. Adding the dropdown entry and README rows is a cheap, mechanical
step ([add-language](../add-language/SKILL.md)). Keeping these as two
separate skills means:

- A failed or interrupted translation run never loses partial work — the
  written file is durable, sitting on disk under `translations/`.
- The maintainer can review or hand-edit `translations/<code>.js` before
  it's ever referenced from `index.html`'s dropdown (an unlisted `<option>`
  means the file simply never loads for anyone).
- A PR for a new language includes `translations/<code>.js` as a clean,
  reviewable diff of the actual translations, separate from the one-line
  `index.html` dropdown diff.

**This skill never edits `index.html`.** Its only output is
`translations/<code>.js` — already in its final, loaded form, not a staged
intermediate.
```

- [ ] **Step 3: `fetch-language-dictionary/SKILL.md` — update the baseline-extraction code (Step 1)**

Use Edit, old string:
```
The baseline is the existing `window.__I18N__` (Vietnamese) + `window.__SHELL__`
dictionaries — every language must translate exactly this key set. The
dictionary keys ARE the English source strings, so no separate English
extraction is needed. Use a throwaway Node script (same brace-depth-safe
extraction as `add-language` Step 1 used to do):

```js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const vn = JSON.parse(html.match(/window\.__I18N__=(\{[\s\S]*?\});/)[1]);
const shellVn = JSON.parse(html.match(/window\.__SHELL__=(\{[\s\S]*?\});/)[1]);
console.log(Object.keys(vn).length); // currently 526
```
```
new string:
```
The baseline is `translations/vn.js` (Vietnamese — the first language
shipped; any of the 16 files works identically, since a CI keyset-parity
check enforces they all match). The dictionary keys ARE the English source
strings, so no separate English extraction is needed:

```js
const fs = require('fs');
const vm = require('vm');
const sandboxWindow = {};
vm.runInNewContext(fs.readFileSync('translations/vn.js', 'utf8'), { window: sandboxWindow });
const vn = sandboxWindow.__LANG_VN__.i18n;
const shellVn = sandboxWindow.__LANG_VN__.shell;
console.log(Object.keys(vn).length); // currently 723
```
```

- [ ] **Step 4: `fetch-language-dictionary/SKILL.md` — update the `questionFmt` metadata bullet (Step 3)**

Use Edit, old string:
```
- **`questionFmt`**: the "Question N / M" counter pattern for this language,
  written as the literal JS snippet `add-language` should splice into
  `QUESTION_FMT` (e.g. `function(a,b){return '第'+a+'題 / 共'+b+'題';}`).
```
new string:
```
- **`questionFmt`**: the "Question N / M" counter pattern for this language,
  written as the literal JS function expression that becomes this
  language's `questionFmt` field in `translations/<code>.js` (e.g.
  `function(a,b){return '第'+a+'題 / 共'+b+'題';}`). The other 7 `*Fmt`
  fields (`questionsAvailableFmt`, `scoreSoFarFmt`, `bigScoreFmt`,
  `allCorrectFmt`, `retakeAllFmt`, `retakeMissedFmt`, `notThisTimeFmt`)
  follow the same pattern — write each as a real function expression, not a
  string.
```

- [ ] **Step 5: `fetch-language-dictionary/SKILL.md` — update the validation code (Step 4)**

Use Edit, old string:
```
```js
const newKeys = Object.keys(newDict.i18n).sort();
const vnKeys = Object.keys(vn).sort();
console.log(JSON.stringify(newKeys) === JSON.stringify(vnKeys)); // must be true
console.log(Object.keys(newDict.shell).length === Object.keys(shellVn).length); // must be true
```
```
new string:
```
```js
const newKeys = Object.keys(newDict.i18n).sort();
const vnKeys = Object.keys(vn).sort();
console.log(JSON.stringify(newKeys) === JSON.stringify(vnKeys)); // must be true
console.log(Object.keys(newDict.shell).length === Object.keys(shellVn).length); // must be true
const REQUIRED_FMT = ['questionFmt','questionsAvailableFmt','scoreSoFarFmt','bigScoreFmt',
  'allCorrectFmt','retakeAllFmt','retakeMissedFmt','notThisTimeFmt'];
console.log(REQUIRED_FMT.every(k => typeof newDict[k] === 'function')); // must be true
```
```

- [ ] **Step 6: `fetch-language-dictionary/SKILL.md` — update Step 5's file shape**

Use Edit, old string:
```
## Step 5 — Write the staged file

Write `translations/<code>.json` (create the `translations/` directory if
it doesn't exist yet) with this shape:

```json
{
  "code": "ko",
  "nativeName": "한국어",
  "sortHint": "cjk",
  "qsUnit": "문항",
  "noSpaceBeforeUnit": true,
  "questionFmt": "function(a,b){return a+' / '+b+'번 문항';}",
  "i18n": { "...526 keys...": "..." },
  "shell": { "...5 keys...": "..." }
}
```

Report the key count and confirm parity before finishing. Do not proceed to
inject anything into `index.html` — hand off to the
[add-language](../add-language/SKILL.md) skill for that.
```
new string:
```
## Step 5 — Write the file

Write `translations/<code>.js` (create the `translations/` directory if it
doesn't exist yet) with this shape — note the 8 `*Fmt` fields are real
function expressions, not strings:

```js
window.__LANG_KO__ = {
  code: "ko",
  nativeName: "한국어",
  sortHint: "cjk",
  qsUnit: "문항",
  noSpaceBeforeUnit: true,
  questionFmt: function(a,b){return a+' / '+b+'번 문항';},
  questionsAvailableFmt: function(n){ /* ... */ },
  scoreSoFarFmt: function(a,b){ /* ... */ },
  bigScoreFmt: function(n,p){ /* ... */ },
  allCorrectFmt: function(n){ /* ... */ },
  retakeAllFmt: function(n){ /* ... */ },
  retakeMissedFmt: function(n){ /* ... */ },
  notThisTimeFmt: function(l){ /* ... */ },
  i18n: { /* ...723 keys... */ },
  shell: { /* ...5 keys... */ }
};
```

Report the key count and confirm parity before finishing. This file is
already in its final, loaded form — hand off to the
[add-language](../add-language/SKILL.md) skill only to add the dropdown
`<option>` and update READMEs.
```

- [ ] **Step 7: `add-language/SKILL.md` — update the frontmatter description**

Use Edit, old string:
```
description: Add a new UI language to the CCA-F Study Suite (index.html), from an already-staged translations/<code>.json file. Use this whenever the user asks to add/support a new language, translate the app into a language, or add a language variant — it will trigger fetch-language-dictionary first if no staged file exists yet. Covers wiring the staged dictionary into the JS engine, updating the language dropdown, and updating all README files.
```
new string:
```
description: Add a new UI language to the CCA-F Study Suite (index.html), from an already-generated translations/<code>.js file. Use this whenever the user asks to add/support a new language, translate the app into a language, or add a language variant — it will trigger fetch-language-dictionary first if no such file exists yet. Covers adding the language dropdown option and updating all README files (translations/<code>.js is already the final, loaded artifact — no wiring into index.html's JS engine needed).
```

- [ ] **Step 8: `add-language/SKILL.md` — replace Steps 1 and 2 (load+validate, inject into HTML) with a single trivial existence check**

Use Edit, old string:
```
## Step 1 — Load the staged dictionary

Check for `translations/<code>.json`. **If it doesn't exist, stop and run
the [fetch-language-dictionary](../fetch-language-dictionary/SKILL.md) skill
first** — don't translate inline here as a fallback; that defeats the point
of staging (durability across retries, reviewability, a clean PR diff).

Once the staged file exists, load it and re-validate key parity against the
current in-app baseline before touching anything (the baseline may have
drifted since the file was staged, e.g. new questions/keys added since):

```js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const staged = JSON.parse(fs.readFileSync('translations/<code>.json', 'utf8'));
const vn = JSON.parse(html.match(/window\.__I18N__=(\{[\s\S]*?\});/s)[1]);
const shellVn = JSON.parse(html.match(/window\.__SHELL__=(\{[\s\S]*?\});/s)[1]);
const newKeys = Object.keys(staged.i18n).sort();
const vnKeys = Object.keys(vn).sort();
console.log(JSON.stringify(newKeys) === JSON.stringify(vnKeys)); // must be true
console.log(Object.keys(staged.shell).length === Object.keys(shellVn).length); // must be true
```

If parity fails, the staged file is stale — go back to
`fetch-language-dictionary` to fill the gap (translate just the missing
keys, not the whole set over again) rather than regenerating everything.

## Step 2 — Inject into the HTML

Use a script (see `scripts/inject-dict.js` in this skill folder, or write a
fresh one following this pattern) that:
1. Finds the last existing `window.__SHELL_XX__=...;` in the HTML.
2. Inserts `window.__I18N_<CODE>__=<json>;\nwindow.__SHELL_<CODE>__=<json>;`
   right after it, using brace-depth matching (not `indexOf(';')`, which
   breaks on strings that contain literal semicolons).

Then wire it into the JS engine (all four are small, single-line edits found
via grep), pulling values straight from the staged file — no re-deriving:
- `var MAPS={...}` — add `<code>:window.__I18N_<CODE>__||{}`.
- `var SHELLS={...}` — add `<code>:window.__SHELL_<CODE>__||{}`.
- `var QS_UNIT={...}` — add `<code>:'<staged.qsUnit>'`. Also check the
  no-space rule right below it (`(lang==='ja'||lang==='zh'||...)?'':' '`) —
  add `<code>` to that language list iff `staged.noSpaceBeforeUnit` is true.
- `var QUESTION_FMT={...}` — add `<code>:<staged.questionFmt>` (the staged
  file already has this as a literal JS function-expression string).
```
new string:
```
## Step 1 — Confirm the language file exists

Check for `translations/<code>.js`. **If it doesn't exist, stop and run
the [fetch-language-dictionary](../fetch-language-dictionary/SKILL.md) skill
first** — don't translate inline here as a fallback. That skill's own Step 4
already validates key parity against the baseline at generation time, so no
re-validation is needed here; `translations/<code>.js` is loaded directly by
`index.html`'s `loadLang()` function with no further wiring.
```

- [ ] **Step 9: `add-language/SKILL.md` — renumber Steps 3–5 to 2–4**

Use Edit, old string:
```
## Step 3 — Add the dropdown option
```
new string:
```
## Step 2 — Add the dropdown option
```

Use Edit, old string:
```
## Step 4 — Update every README
```
new string:
```
## Step 3 — Update every README
```

Use Edit, old string:
```
## Step 5 — Verify
```
new string:
```
## Step 4 — Verify
```

- [ ] **Step 10: `add-language/SKILL.md` — rewrite the verify checklist**

Use Edit, old string:
```
1. Re-parse every `__I18N_*__`/`__SHELL_*__` dict from the HTML and confirm
   they all parse as valid JSON with matching key counts.
2. Confirm the dropdown option list and `MAPS`/`SHELLS`/`QS_UNIT`/
   `QUESTION_FMT` all reference the new code.
3. Open the file in a browser (`powershell -c "Start-Process '<path>'"` on
   Windows) and manually switch to the new language — check the CORE cards,
   the decision-rules table, and a few quiz categories, since those have
   historically been the spots most likely to have missed dictionary
   entries (they're rendered from separate JS arrays, not just plain text
   nodes, so gaps there are easy to miss).
4. Update `CHANGELOG.md`.
5. Leave `translations/<code>.json` in place and commit it alongside the app
   changes — it documents exactly what was translated, gives reviewers a
   clean diff to check translations against (instead of the in-app dict),
   and lets a future correction re-run just the injection step instead of
   re-translating.
```
new string:
```
1. Load `translations/<code>.js` via `vm.runInNewContext` and confirm it
   parses with the expected key counts (this is also enforced automatically
   by CI's keyset-parity check, but verify locally before committing).
2. Confirm the dropdown `<option value="<code>">` is present in `index.html`.
3. Open the file in a browser (`powershell -c "Start-Process '<path>'"` on
   Windows) and manually switch to the new language — check the CORE cards,
   the decision-rules table, and a few quiz categories, since those have
   historically been the spots most likely to have missed dictionary
   entries (they're rendered from separate JS arrays, not just plain text
   nodes, so gaps there are easy to miss). Also confirm it works when
   `index.html` is opened directly via `file://`, not just from a server.
4. Update `CHANGELOG.md`.
5. `translations/<code>.js` was already committed by
   `fetch-language-dictionary` (or hand-authored) — this commit only needs
   `index.html`'s dropdown option, READMEs, and `CHANGELOG.md`.
```

- [ ] **Step 11: `update-translations/SKILL.md` — update the frontmatter description**

Use Edit, old string:
```
description: Add/translate new UI copy strings into all 12 supported languages across the whole app — `index.html`'s in-app dictionaries, the staged `translations/<code>.json` files, and (when the new copy describes a user-facing feature) every `README*.md`. Use this whenever the user asks to "update the translations", "translate this new text", "add translations for X", or after adding any new fixed English UI string/button/label to `index.html` that isn't covered yet. Different from `add-language`/`fetch-language-dictionary` (which add a whole new *language column*) — this is for adding new *string rows* to the languages that already exist.
```
new string:
```
description: Add/translate new UI copy strings into every supported language's `translations/<code>.js` file, and (when the new copy describes a user-facing feature) every `README*.md`. Use this whenever the user asks to "update the translations", "translate this new text", "add translations for X", or after adding any new fixed English UI string/button/label to `index.html` that isn't covered yet. Different from `add-language`/`fetch-language-dictionary` (which add a whole new *language column*) — this is for adding new *string rows* to the languages that already exist.
```

- [ ] **Step 12: `update-translations/SKILL.md` — rewrite the intro's "three places" framing**

Use Edit, old string:
```
This app ships 12 non-English languages (grep `var MAPS=` in `index.html`
for the authoritative, current code list — as of the last update:
`vn, ja, zh, tw, es, ko, pt, fr, de, hi, ru, it`). Three places must all move
together whenever new fixed English UI copy is added:

1. `index.html` — the live `window.__I18N_<CODE>__` dictionaries the app
   actually reads at runtime.
2. `translations/<code>.json` — the staged, reviewable mirror of the same
   data (see `translations/README.md`). Kept in sync so a future fix can
   re-run injection instead of re-translating from scratch.
3. `README*.md` (English + all 12 language variants) — **only** if the new
   copy represents a user-facing feature or behavior worth describing in the
   README's prose, not for pure wording/label tweaks.

Skipping #2 or #3 is the easy mistake — the app will work fine with only
#1 done, so nothing forces you to notice the drift until someone tries to
use the staged files or reads a stale README.
```
new string:
```
This app ships several non-English languages (`ls translations/*.js` for
the authoritative, current code list). Two places must move together
whenever new fixed English UI copy is added:

1. `translations/<code>.js` (every language, all of them, not just a few)
   — the live per-language file `index.html` loads at runtime and the only
   place translated copy lives. There is no separate staged/inline
   distinction anymore: editing this file *is* shipping the change.
2. `README*.md` (English + all language variants) — **only** if the new
   copy represents a user-facing feature or behavior worth describing in the
   README's prose, not for pure wording/label tweaks.

Skipping #2 is the easy mistake — the app will work fine with only #1 done,
so nothing forces you to notice a stale README until someone reads it.

Dynamic strings (see Step 1) have one more touch point: a new regex-match
branch inside `translateNode()` in `index.html`. That's a single piece of
engine code shared by every language, not per-language data, so it can't
drift the way #1 used to — write it once, not once per language.
```

- [ ] **Step 13: `update-translations/SKILL.md` — merge "Wire into index.html" and "Mirror into translations/*.json" into one step targeting `translations/<code>.js` directly**

Use Edit, old string:
```
## Step 3 — Wire into `index.html`

**Static strings**: pick a semantically-close *existing* key already in
each language's dictionary as an anchor (e.g. if the new string is
exam/quiz copy, anchor near `"Questions you missed"` — grep it, it exists
in all 12 blocks), and insert the new `"key": "value",` lines immediately
after that anchor line, in **every one of the 12 language blocks**, using
the exact same key set/order in each block. Use `Edit` with the anchor
line as `old_string` — these are short, surgical insertions; don't
regenerate the surrounding dictionary.

**Dynamic strings**: add a new `var SOMETHING_FMT={ vn:function(...){...},
ja:function(...){...}, ... };` block near the existing `QUESTION_FMT`
definition, one function per language, then add a matching
`if(tr==null){ var xx=key.match(/^.../); if(xx && SOMETHING_FMT[lang]) tr=SOMETHING_FMT[lang](xx[1],...); }`
branch inside `translateNode()`, chained alongside the existing
`qm`/`qn`-style checks. The regex must anchor the *whole* normalized string
(`^...$`) and capture only the runtime-variable parts — everything else in
the English pattern must be matched literally.

## Step 4 — Mirror into `translations/*.json`

**Do this with a script, not hand-edited JSON text** — CJK/Vietnamese/
Hindi/Russian characters and embedded apostrophes (e.g. French `jusqu'à`
inside a JS-function-source string that itself lives inside a JSON string —
a real case hit in this app) are easy to mis-escape by hand and easy to get
right with `json.dumps`/`JSON.stringify`.

1. Static keys go into each file's `i18n` object, inserted right after the
   same anchor key used in `index.html`, indentation matching that file's
   own existing style (varies file to file — detect it from the anchor
   line, don't assume a fixed width).
2. Dynamic `..._FMT` values go in as new **top-level** string fields, named
   `camelCaseFmt` (e.g. `scoreSoFarFmt`), placed right after the existing
   `"questionFmt"` field — the value is the literal JS function-source text
   as a string, exactly like `questionFmt` already does.
3. Write a throwaway Python/Node script to the scratchpad dir that: reads
   each file's raw text, regex-finds the anchor lines, splices in the new
   lines using `json.dumps(value)` for correct escaping, writes the file
   back, then **re-parses it with a real JSON parser to confirm validity**
   before moving to the next file.
4. After all 12 files are done, run `git diff --stat translations/` — every
   file should show only clean **insertions** (no deletions, no reformatted
   lines elsewhere). If a file shows unrelated changed lines, the script
   reformatted more than it should have — redo that file with a narrower
   surgical edit instead of a full parse-and-redump.
```
new string:
```
## Step 3 — Add to `translations/<code>.js` (every language), and wire dynamic strings into `translateNode()`

**Do the per-language insertion with a script, not hand-edited text** —
CJK/Vietnamese/Hindi/Russian characters and embedded apostrophes (e.g.
French `jusqu'à` inside a JS function body) are easy to mis-escape by hand
and easy to get right with `JSON.stringify`.

**Static strings**: for each of the 16 `translations/<code>.js` files,
insert the new `"key": "value",` line into that file's `i18n` object,
anchored right after a semantically-close *existing* key (e.g. if the new
string is exam/quiz copy, anchor near `"Questions you missed"` — it exists
in every file's `i18n` object). Write a throwaway Node script that: reads
each file's raw text, regex-finds the anchor line, splices in the new line
using `JSON.stringify(value)` for correct escaping, writes the file back,
then **loads it via `vm.runInNewContext` to confirm it's still valid JS**
before moving to the next file.

**Dynamic strings** need two things:
1. A new `<camelCase>Fmt` **field** in every `translations/<code>.js`
   file's top level (alongside `questionFmt`), one real function expression
   per language, e.g. `scoreSoFarFmt: function(a,b){return a+' / '+b+"
   correctes jusqu'à présent";}` for French. Same script-based insertion
   approach as static strings, anchored after the existing `questionFmt:`
   field.
2. One matching branch inside `translateNode()` in `index.html` — this is
   written **once**, not once per language:
   ```js
   if(tr==null){
     var xx=key.match(/^.../);
     if(xx && d.somethingFmt) tr=d.somethingFmt(xx[1],...);
   }
   ```
   chained alongside the existing `qm`/`qn`-style checks (`d` is the current
   language's loaded data, already in scope — see the other branches in
   `translateNode()` for the exact pattern post-migration). The regex must
   anchor the *whole* normalized string (`^...$`) and capture only the
   runtime-variable parts.

After all 16 files are done, run `git diff --stat translations/` — every
file should show only clean **insertions** (no deletions, no reformatted
lines elsewhere). If a file shows unrelated changed lines, the script
reformatted more than it should have — redo that file with a narrower
surgical edit instead of a full parse-and-redump.
```

- [ ] **Step 14: `update-translations/SKILL.md` — renumber the remaining steps**

Use Edit, old string:
```
## Step 5 — Update every README (only if the copy describes a feature)
```
new string:
```
## Step 4 — Update every README (only if the copy describes a feature)
```

Use Edit, old string:
```
## Step 6 — Verify in a real browser, not just JSON validation
```
new string:
```
## Step 5 — Verify in a real browser, not just JSON validation
```

Use Edit, old string:
```
## Step 7 — Wrap up
```
new string:
```
## Step 6 — Wrap up
```

- [ ] **Step 15: Commit**

```bash
git add .claude/skills/fetch-language-dictionary/SKILL.md .claude/skills/add-language/SKILL.md .claude/skills/update-translations/SKILL.md
git commit -m "docs: update language-authoring skills for translations/*.js format

Adding a language now means writing one translations/<code>.js file
and adding one dropdown <option> -- no more brace-depth injection into
a 30KB single-line index.html literal, no more keeping an inline dict
and a staged JSON file in sync. Adding new UI copy now touches one
place per language (translations/<code>.js) instead of two."
```

---

### Task 6: Amend the constitution to v1.1.0

**Files:**
- Modify: `.specify/memory/constitution.md`

**Interfaces:** None.

- [ ] **Step 1: Update Principle I**

Use Edit, old string:
```
The entire application is one self-contained file, `index.html`.
No build step, no server, no external JS dependencies — the only external
network call is a Google Fonts `<link>`. Any change that would require a
bundler, package manager, or a new external script/library dependency is out
of scope unless the constitution is amended first to explicitly allow it.
```
new string:
```
The application ships as first-party static files with no build step, no
server-side code, no package manager, and no bundler — only plain files a
browser loads directly. `index.html` is the entry point; it may load
additional same-origin, first-party `<script src>` files (e.g.
`languages.config.js`, `translations/<code>.js`) as long as each one is a
plain committed file requiring no compilation step, and loading uses
`<script src>` rather than `fetch()` so the app keeps working when
`index.html` is opened directly via `file://`. The only external network
call is a Google Fonts `<link>`. Any change that would require a bundler,
package manager, transpilation, or a third-party external script/library
dependency is out of scope unless the constitution is amended first to
explicitly allow it.
```

- [ ] **Step 2: Update Principle II**

Use Edit, old string:
```
All user-visible copy MUST flow through the i18n dictionary system
(`window.__I18N_XX__` dictionaries + `window.__SHELL_XX__` nav labels,
consumed by the `MAPS`/`SHELLS` objects and the TreeWalker-based
`translateNode`/`applyAll` engine). Hardcoded English strings that bypass
translation are not permitted in UI-facing markup. Every new language
addition MUST cover the full key set already present in the other
dictionaries (currently: VN, JA, ZH, TW, ES, with EN implicit) and MUST
update every README's switch-link row and Features bullet, and the
`#lang-select` dropdown, in the same pass. Dropdown/README language order:
Latin-script languages first, alphabetically by English name, then CJK
languages grouped together.
```
new string:
```
All user-visible copy MUST flow through the i18n dictionary system: one
`translations/<code>.js` file per language (each defining
`window.__LANG_<CODE>__` with an `i18n` dict, a `shell` dict, and 8 format
functions), lazily loaded via `<script src>` into `LANG_DATA[code]` and
consumed by the TreeWalker-based `translateNode`/`applyAll` engine.
Hardcoded English strings that bypass translation are not permitted in
UI-facing markup. Every new language addition MUST cover the full key set
already present in the other language files (verified by CI keyset-parity
checking — currently 723 `i18n` keys + 5 `shell` keys + 8 format functions
per language, EN implicit/untranslated) and MUST update every README's
switch-link row and Features bullet, and the `#lang-select` dropdown, in
the same pass. Dropdown/README language order: Latin-script languages
first, alphabetically by English name, then CJK languages grouped
together.
```

- [ ] **Step 3: Update the Language & Translation Conventions section's `QS_UNIT`/`QUESTION_FMT` reference**

Use Edit, old string:
```
- Dynamic strings containing runtime numbers (e.g. the "N Qs" badge, the
  "Question N / M" counter) cannot live in a static dictionary; they are
  handled via the `QS_UNIT` / `QUESTION_FMT` regex-based per-language
  formatters in the translation engine, not by trying to force them into
  fixed dictionary entries.
```
new string:
```
- Dynamic strings containing runtime numbers (e.g. the "N Qs" badge, the
  "Question N / M" counter) cannot live in a static dictionary; they are
  handled via each language's `qsUnit`/`questionFmt` (and the other 7
  `*Fmt` functions) in `translations/<code>.js`, matched by regex in the
  translation engine, not by trying to force them into fixed dictionary
  entries.
```

- [ ] **Step 4: Bump the version and update the Sync Impact Report**

Use Edit, old string:
```
<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- List of modified principles: N/A (initial ratification)
  - I. Zero-Dependency Single File (new)
  - II. i18n-First UI Copy (new)
  - III. Theme Parity (new)
  - IV. Safe Large-Dictionary Edits (new)
  - V. Documentation Currency (new)
- Added sections: Language & Translation Conventions; Development Workflow; Governance
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — Constitution Check gate is generic
    ("[Gates determined based on constitution file]"), no edit needed; gates
    are derived per-feature from this file at /speckit-plan time.
  - ✅ .specify/templates/spec-template.md — no constitution-specific
    references, no edit needed.
  - ✅ .specify/templates/tasks-template.md — no constitution-specific
    references, no edit needed.
- Follow-up TODOs: none.
-->
```
new string:
```
<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- List of modified principles:
  - I. Zero-Dependency Single File (amended: explicitly allows first-party
    local <script src> files with no build step, alongside index.html;
    still forbids bundlers/transpilation/third-party scripts)
  - II. i18n-First UI Copy (amended: describes the translations/<code>.js
    per-language-file model, replacing the inline window.__I18N_XX__/
    __SHELL_XX__ + MAPS/SHELLS description)
- Added sections: none
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — no edit needed (generic gate).
  - ✅ .specify/templates/spec-template.md — no edit needed.
  - ✅ .specify/templates/tasks-template.md — no edit needed.
- Follow-up TODOs: none.
-->
```

- [ ] **Step 5: Update the version footer**

Use Edit, old string:
```
**Version**: 1.0.0 | **Ratified**: 2026-07-24 | **Last Amended**: 2026-07-24
```
new string:
```
**Version**: 1.1.0 | **Ratified**: 2026-07-24 | **Last Amended**: 2026-08-05
```

- [ ] **Step 6: Commit**

```bash
git add .specify/memory/constitution.md
git commit -m "docs: amend constitution to v1.1.0 for translations/<code>.js split

Principle I now explicitly allows first-party local <script src> files
with no build step (languages.config.js already established this
precedent; this amendment makes it explicit rather than relying on
unstated exception). Principle II updated to describe the new
per-language-file i18n model."
```

---

### Task 7: Final verification, CHANGELOG, and size check

**Files:**
- Modify: `CHANGELOG.md`

**Interfaces:** None.

- [ ] **Step 1: Confirm final file sizes**

Run:
```bash
node -e "console.log((require('fs').statSync('index.html').size/1024).toFixed(0)+' KB')"
node -e "const fs=require('fs');let t=0;for(const f of fs.readdirSync('translations').filter(x=>x.endsWith('.js')))t+=fs.statSync('translations/'+f).size;console.log((t/1024).toFixed(0)+' KB total across 16 files')"
```
Expected: `index.html` ~400-500 KB (down from 1670 KB); `translations/` total roughly 1200-1300 KB spread across 16 files, none loaded unless that language is selected.

- [ ] **Step 2: Re-run both CI test suites locally**

```bash
node --test .github/scripts/sync-language-config.test.js
node --test .github/scripts/validate-language-config.test.js
node .github/scripts/validate-language-config.js
```
Expected: all pass, validator exits 0.

- [ ] **Step 3: Full-language CDP browser sweep**

Using the project's established CDP-driven headless Edge verification: cycle through all 17 `#lang-select` options (`en` + 16), for each confirm the Study, Exam, Cheat-sheet, and Map tabs render without console errors and without any visible untranslated-English leakage outside known non-goals (`QDATA` question/answer text, which stays English by design). Spot-check Light and Dark theme for at least 3 languages spanning different scripts (e.g. `fr`, `ja`, `th`).

- [ ] **Step 4: Add the CHANGELOG entry — this is also the first version-numbered entry**

Every prior `CHANGELOG.md` entry is topic-titled only (e.g. `## Thai (ไทย) — 17th supported language`), with no version number — this project has never had one (no `package.json`, no `VERSION` file, no version string anywhere in `index.html`). Per explicit maintainer decision: starting with this entry, new entries get a `## [X.Y.Z] - YYYY-MM-DD - Title` header (semver, dated), and the version lives in `CHANGELOG.md` only — no UI change, no new file. Do **not** retroactively add version numbers to the existing topic-titled entries above this one; they stay as they are. This refactor is `1.0.0`, the first tagged version. Future entries increment from here using ordinary semver judgment (a new language or capability = minor bump, a bugfix = patch, a breaking change to the app's on-disk format or public behavior = major) — that judgment call belongs to whoever writes the next entry, not to this task.

Add a new entry at the top of `CHANGELOG.md` (matching the file's existing body style for the `### Changed` bullet — read the top few entries first to match phrasing conventions; only the header line itself is new format):

```markdown
## [1.0.0] - 2026-08-05 - Lazy-loaded translation files

### Changed
- **Translation data split out of `index.html` into `translations/<code>.js`, loaded lazily.** Previously every visitor downloaded all 16 languages' dictionaries inline (1.26MB of the 1.71MB file) regardless of which language they used. Each language now lives in its own `translations/<code>.js`, loaded via a `<script src>` tag only when that language is selected — `<script src>` rather than `fetch()` specifically so the app keeps working when `index.html` is opened directly via `file://`. `index.html` drops from ~1.7MB to ~450KB. No visible behavior change; language switching, offline use, and the missing-language/missing-key English fallback all work exactly as before.
```

- [ ] **Step 5: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: add CHANGELOG entry for the translations/<code>.js split"
```

- [ ] **Step 6: Push and open a PR (ask the user first — this is a repo-visible, hard-to-reverse-in-spirit action)**

Per this project's established workflow (feedback memory: language-affecting changes get their own branch/PR, not direct-to-main), confirm with the user before pushing. The branch was already created in Task 0 and holds every commit from Tasks 1-7; this step only pushes it:
```bash
git push -u origin refactor/lazy-language-files
gh pr create --title "refactor: split translation data into lazily-loaded translations/<code>.js" --body "$(cat <<'EOF'
## Summary
- Moves the 1.26MB of inline i18n dictionaries out of index.html into one translations/<code>.js per language, loaded on demand via <script src> (not fetch(), to preserve file:// support).
- index.html: ~1.7MB -> ~450KB.
- translations/<code>.json removed (superseded; translations/<code>.js is now the single source of truth).
- Constitution amended to v1.1.0 (Principle I now explicitly allows first-party local <script src> files; Principle II describes the new per-language-file model).
- CI's language validator now checks translations/*.js and enforces keyset parity across all 16 languages.
- add-language / fetch-language-dictionary / update-translations skills updated for the simplified single-file-per-language workflow.

Design doc: docs/superpowers/specs/2026-08-05-lazy-language-script-files-design.md

## Test plan
- [ ] All 17 languages (en + 16) render correctly via CDP browser sweep
- [ ] file:// (no server) works for a non-English language
- [ ] Missing/renamed language file falls back to English silently
- [ ] Light + Dark theme parity spot-checked
- [ ] node --test passes for both .github/scripts/*.test.js
- [ ] node .github/scripts/validate-language-config.js exits 0
EOF
)"
gh pr edit --add-assignee mikeminhxi
```
