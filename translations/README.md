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
