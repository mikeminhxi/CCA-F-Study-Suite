# Lazy Per-Language Script Files — Design

## Problem

`index.html` is 1.71 MB / 14,983 lines. **1.26 MB (73.6%) is inline translation data** — 32 globals (`window.__I18N_XX__` + `window.__SHELL_XX__` for each of 16 non-English languages, plus 9 sixteen-entry per-language format-function tables) spanning lines 1549–13261. Every visitor downloads and parses all 16 languages regardless of which one they use; English visitors get zero benefit from any of it. The file is also large enough to slow editing and complicate reviews of unrelated changes.

`translations/<code>.json` already exists as a staged, per-language copy of the same data (used by the `add-language`/`fetch-language-dictionary`/`update-translations` skills to draft and review translations before injection), but it's a second copy that drifts from the inline dictionaries unless every language-touching change updates both — which happened: prior to this design, 7 files were missing 5 `i18n` keys each and 2 files (`pl`, `th`) were missing 7 format-function fields each. (This drift has already been fixed as a standalone cleanup, ahead of this refactor — see git history on `translations/*.json` dated 2026-08-05.)

## Scope

- Move the 32 inline dictionary globals + 9 format-function tables out of `index.html` into one file per language.
- Preserve the app's zero-build, offline-capable nature: opening `index.html` directly via `file://` (no server) must still work for every language, not just English.
- Preserve exact runtime behavior otherwise: same visible UI, same fallback-to-English-on-missing-key/language semantics, same `localStorage['ccaf_lang']` persistence, same disabled-language preference-preservation trick.
- **Non-goal:** translating `QDATA` (the 156 exam questions) — it's English-only today and stays that way; this design only touches UI-chrome/concept strings.
- **Non-goal:** changing the visible dropdown, adding new languages, or touching `languages.config.js`'s visibility-toggle mechanism (see the companion design `2026-07-31-language-visibility-config-design.md`) beyond what's needed for the new file layout.

## Constitution impact

Principle I ("one self-contained file... no build step... any change requiring a new external script is out of scope unless the constitution is amended first") directly blocks this. `languages.config.js` already exists as a second first-party `<script src>` file without a prior amendment, establishing precedent, but the literal text still needs updating. **This design requires bumping the constitution to v1.1.0** (Governance allows single-maintainer, explicit-decision amendments) to:
- Explicitly allow first-party local static files with no build step/bundler/package manager, as long as everything shipped is a plain committed file the browser loads directly (no compilation).
- Reword Principle II's verbatim naming of `window.__I18N_XX__`/`window.__SHELL_XX__` to describe the new per-language `window.__LANG_XX__` shape.
- Principle IV (safe large-dictionary edits via throwaway brace-depth-aware Node scripts) stays as-is and continues to govern edits to the new per-language files, which are still large single-object literals.

## Design

### 1. File format: `translations/<code>.js` (one per language, replaces `<code>.json`)

```js
window.__LANG_FR__ = {
  code: "fr",
  nativeName: "Français",
  sortHint: "latin",
  qsUnit: "questions",
  noSpaceBeforeUnit: false,
  questionFmt: function(a,b){ return 'Question '+a+' / '+b; },
  questionsAvailableFmt: function(n){ return n+' questions disponibles'; },
  scoreSoFarFmt: function(a,b){ return a+' / '+b+" correctes jusqu'à présent"; },
  bigScoreFmt: function(n,p){ return '/ '+n+' correctes · '+p+'%'; },
  allCorrectFmt: function(n){ return 'Les '+n+' questions correctes dans cette manche.'; },
  retakeAllFmt: function(n){ return 'Reprendre les '+n; },
  retakeMissedFmt: function(n){ return 'Reprendre uniquement les '+n+' ratées'; },
  notThisTimeFmt: function(l){ return 'Pas cette fois — la bonne réponse est '+l+'.'; },
  i18n:  { "Study Console": "Console d'étude", /* ...723 keys... */ },
  shell: { "brand_sub": "UN SEUL FICHIER · SAUVEGARDE LOCALE", /* ...5 keys... */ }
};
```

- **`.js`, not `.json`, loaded via `<script src>`, not `fetch()`.** This is the load-bearing choice: `fetch()` of a local file is blocked by CORS when `index.html` is opened directly via `file://` without a server (the same reasoning `languages.config.js` already established — see the companion design doc). A `<script src>` tag is not CORS-restricted, so offline/`file://` use keeps working for every language, not just English.
- **Format functions are real JS, not source strings.** Today's `translations/*.json` stores `"questionFmt": "function(a,b){...}"` as a string, requiring `new Function()`/`eval` to revive — a CSP smell and an extra parse step. As real functions in a `.js` file, they just work.
- **One combined object per language** (metadata + `i18n` + `shell` together) rather than three separate structures, so there's exactly one thing to load, one thing to fall back from, and one file to hand-review per language — matching today's `translations/<code>.json` granularity, which the maintainer already reviews language-by-language.
- `translations/<code>.json` files are deleted, not kept alongside. Keeping both would recreate the exact dual-maintenance problem (drift) that caused the cleanup this design follows. `translations/<code>.js` becomes the single source of truth — for both the shipped app and for staging/review during future language additions.
- `translations/README.md` gets rewritten to describe the new format and (finally) the correct key count (723 i18n + 5 shell, not the stale "531/526").

### 2. Runtime loader (`index.html`)

Replaces the current eager two-line `MAPS`/`SHELLS` construction ([index.html:14690-14691](../../../index.html#L14690-L14691)) and the 9 format-function tables ([index.html:14692-14836](../../../index.html#L14692-L14836), ~145 lines, deleted entirely — each language now carries its own formatters).

```js
var LANG_DATA = {};          // code -> loaded __LANG_XX__ object, once available
var loadToken = 0;           // guards against a fast double-switch race

function loadLang(code, cb) {
  if (code === 'en' || LANG_DATA[code]) { cb(); return; }
  var myToken = ++loadToken;
  var s = document.createElement('script');
  s.src = 'translations/' + code + '.js';
  s.onload = function () {
    if (myToken !== loadToken) return;           // a newer switch superseded this one
    LANG_DATA[code] = window['__LANG_' + code.toUpperCase() + '__'];
    cb();
  };
  s.onerror = function () { if (myToken === loadToken) cb(); };  // silent fallback to English
  document.head.appendChild(s);
}
```

- `translateNode`'s lookup (today: `var map=MAPS[lang]||{};`, [index.html:14842](../../../index.html#L14842)) becomes `var d=LANG_DATA[lang]; var map=(d&&d.i18n)||{};` — same `||{}` fallback shape, so a language that failed to load (or hasn't loaded yet) degrades to showing English, silently, exactly as a missing key does today. No new error states introduced.
- The 8 format-lookup tables (`QS_UNIT[lang]`, `QUESTION_FMT[lang](...)`, etc.) become `d.qsUnit`, `d.questionFmt(...)`, reading off the loaded language object instead of a 16-entry table literal.
- `noSpaceBeforeUnit` (already present in every JSON today but ignored by the app) replaces the hardcoded `(lang==='ja'||lang==='zh'||lang==='tw'||lang==='ko')?'':' '` at [index.html:14846](../../../index.html#L14846) — a real bug-risk reduction, since today that list has to be manually kept in sync with which languages need it and the JSON flag is already correct for all 16 but silently unused.

### 3. `window.__setLang__` becomes load-then-apply

```js
window.__setLang__ = function (l) {
  lang = l;
  var sel = document.getElementById('lang-select'); if (sel) sel.value = l;
  try { localStorage.setItem('ccaf_lang', l); } catch (e) {}
  loadLang(l, applyAll);
};
```

- The `<select onchange="window.__setLang__(this.value)">` call site ([index.html:893](../../../index.html#L893)) is unchanged — `__setLang__` keeps the same signature and keeps updating the dropdown value and `localStorage` **synchronously**, so switching still feels instant; only the actual re-render (`applyAll()`) waits on the script load.
- The boot sequence ([index.html:14944-14956](../../../index.html#L14944-L14956)) is unchanged in structure: still reads `localStorage['ccaf_lang']`, still applies the disabled-language override from `languages.config.js`, still calls `__setLang__(saved)` from the same `window.load` + 150ms `setTimeout`, and the `finally` block that reverts the `localStorage` side-effect when a disabled language got silently swapped to English still works exactly as before — `__setLang__`'s synchronous `localStorage.setItem` happens before `loadLang` even starts, so the timing this trick depends on is untouched.
- **Optional perf nicety, not required for correctness:** kick off `loadLang(savedLang, function(){})` as soon as `saved` is read (before the 150ms timeout), so the script download overlaps the rest of page parse/render instead of starting after it. Include this only if trivial; skip if it complicates the boot sequence.

### 4. Migration script (throwaway, per Constitution Principle IV)

A Node script, run once, that:
1. Brace-depth-parses all 32 `window.__I18N_XX__`/`__SHELL_XX__` globals and the 9 `var XXX_FMT={...}` tables out of the current `index.html` (the same extraction technique already validated in the drift-fix script from the prior cleanup step).
2. For each of the 16 codes, assembles one `__LANG_XX__` object (metadata from `languages.config.js`/existing JSON `nativeName`/`sortHint`/`qsUnit`/`noSpaceBeforeUnit` fields + the 8 format functions as real function literals + `i18n` + `shell`) and writes `translations/<code>.js`.
3. Deletes `translations/<code>.json` (all 16) and updates `translations/README.md`.
4. Removes the migrated blocks from `index.html`: the 1549–13261 dictionary script block, the 14692–14836 format tables, and rewires 14690-14691/14842/14846 per the loader design above.
5. **Round-trip verification, required before treating migration as done:** for every language, execute the new `translations/<code>.js` in a sandboxed VM context, and deep-equal-compare its `i18n`/`shell` maps and format-function *outputs* (call each format function with representative args, e.g. `questionFmt(3,10)`) against what was extracted from the original `index.html` in step 1. This catches both data loss and any function-serialization mistakes, without relying on `eval`-based string comparison.

Because the extraction source is `index.html` (already fully caught up — no drift, per the prior cleanup), every emitted `.js` file will have the full 723 i18n + 5 shell + 8 format-function set, with no follow-up backfill needed.

### 5. Downstream ripple effects

- **`.github/scripts/validate-language-config.js`** currently derives valid codes from `translations/*.json` filenames ([validate-language-config.js:36-43]). Change the glob to `translations/*.js` and the code-strip regex from `.json` to `.js`. No other logic changes — it already treats the language directory as a filename-listing exercise, not a content parser.
- **New CI check (recommended addition, small):** a keyset-parity check across all 16 `translations/*.js` files (same `i18n` keys, same `shell` keys, same 8 format-function names present in every file), run via `new Function('window', code)` sandboxing like `validate-language-config.js` already does for `languages.config.js`. This is what prevents the drift this design is cleaning up from ever recurring silently. Runs in `validate-language-config.yml`, gated on the existing `translations/**` path filter (no change needed there — it already matches `.js` and `.json` alike).
- **Four skills need rewriting** (`add-language`, `fetch-language-dictionary`, `update-translations`, `update-readme-languages`'s relationship is unaffected since it only touches READMEs):
  - `fetch-language-dictionary`: stop regex-extracting `window.__I18N__`/`__SHELL__` from `index.html` for the canonical key baseline (that data no longer lives there); read `translations/vn.js` instead (chosen as the baseline since it's the historical "language zero" and, post-migration, keysets are identical across all 16 files anyway — any file would do).
  - `add-language`: collapses dramatically. No more brace-depth injection into a 30KB single-line `index.html` literal, no more editing `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT` (deleted). New steps: write one `translations/<code>.js` file, add one `<option value="<code>">` to `#lang-select`, update READMEs/CHANGELOG. Verification step (today: re-parse every inline dict from the HTML) becomes: load the new file, confirm keyset matches an existing language file, confirm the app renders it.
  - `update-translations`: today's "three places must move together" (inline dict, JSON, README) becomes two (the language `.js` file, README) — the dual-maintenance risk this whole design targets is gone.
- **Constitution v1.1.0** per the "Constitution impact" section above — must land before or alongside this change, not after.

## Verification

- CDP-driven headless Edge (established practice for this project — see prior language-round verification): boot each of the 16 non-English languages plus English, confirm the study/exam/map tabs render translated text, spot-check a `*Fmt` string (e.g. switch languages mid-exam, confirm "Question 3 / 10" renders correctly), confirm light + dark theme parity (Constitution Principle III) for at least 2 languages.
- Force a load failure (temporarily rename one `translations/<code>.js`) and confirm the app falls back to English silently rather than erroring — this is the behavior the loader design is required to preserve.
- Open `index.html` via `file://` directly (no local server) for at least one non-English language and confirm it fully renders translated — this is the entire reason for the `<script src>` choice over `fetch()`, so it must be checked explicitly, not assumed.
- Confirm final `index.html` size (~450 KB expected) and run the migration script's round-trip verification (§4.5) clean across all 16 languages before considering migration complete.
- Run both `.github/scripts/*.test.js` suites (`node --test`) plus the new parity-check logic locally before pushing.

## Open follow-ups (not blocking)

- Whether to also add the boot-time `loadLang` prefetch optimization (§3) in the same change or as a fast-follow — it's not required for correctness, only for shaving the ~150ms + fetch-latency window before non-English content appears.
- Whether `translations/README.md`'s description of the staging workflow needs a bigger rewrite beyond the key-count fix, now that staged files and shipped files are the same file (no more "staged, then wired in" two-step).
