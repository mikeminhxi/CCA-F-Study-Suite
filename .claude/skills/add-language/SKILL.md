---
name: add-language
description: Add a new UI language to the CCA-F Study Suite (cca-f-study-suite.html), from an already-staged translations/<code>.json file. Use this whenever the user asks to add/support a new language, translate the app into a language, or add a language variant — it will trigger fetch-language-dictionary first if no staged file exists yet. Covers wiring the staged dictionary into the JS engine, updating the language dropdown, and updating all README files.
---

# Add a language to the CCA-F Study Suite

This app is a single self-contained HTML file (`cca-f-study-suite.html`) with a
runtime text-swap i18n system. English is the implicit default (it's literally
the text already in the HTML) — every other language is a full dictionary that
gets swapped in. As of the last update the supported languages are: English,
Español, Tiếng Việt, 简体中文 (zh), 繁體中文 (tw), 日本語 (ja).

Translation generation is **not** part of this skill — it lives in
[fetch-language-dictionary](../fetch-language-dictionary/SKILL.md), which
stages the full translated dictionary at `translations/<code>.json` before
anything here runs. This skill is the cheap, mechanical half: wire an
already-translated, already-validated dictionary into the app.

## Why this needs a script, not manual edits

Each language's dictionary is injected as its own `<script>` block. The
Read/Edit tools cannot safely handle these programmatically-generated
objects. **Every step below that touches the HTML must go through a
throwaway Node or PowerShell script** using real JSON parsing (brace-depth-
and string-escape-aware), not direct Edit calls, `indexOf(';')`, or other
naive string-splitting — write the script to the scratchpad directory, run
it, then verify with another script. This is not optional; manual edits
risk corrupting the file, and even a working manual edit reintroduces the
one-language-per-single-line format this app has been moving away from.

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
const html = fs.readFileSync('cca-f-study-suite.html', 'utf8');
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

## Step 3 — Add the dropdown option

`#lang-select` in the HTML — add
`<option value="<code>"><staged.nativeName></option>` in the agreed position
per `staged.sortHint`: **Latin-script languages first, alphabetical by
English name** — English, Español, Tiếng Việt — **then CJK languages grouped
together** — 简体中文, 繁體中文, 日本語. Ask before assuming a different
grouping if `sortHint` is ambiguous or absent, since this ordering has been
revisited multiple times.

## Step 4 — Update every README

All six `README*.md` files' **switch-link header row** (line 3) and
**Features bullet** (the "language toggle" line) must list all supported
languages, in the same order as the dropdown, with the current file's own
entry bolded instead of linked. Add a new `README.<code>.md` if the language
is new (not just a script variant sharing a link target).

## Step 5 — Verify

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
