---
name: add-language
description: Add a new UI language to the CCA-F Study Suite (cca-f-study-suite.html). Use this whenever the user asks to add/support a new language, translate the app into a language, or add a language variant (e.g. a regional/script variant of an existing language). Covers translating the i18n dictionary, wiring it into the JS engine, updating the language dropdown, and updating all README files.
---

# Add a language to the CCA-F Study Suite

This app is a single self-contained HTML file (`cca-f-study-suite.html`) with a
runtime text-swap i18n system. English is the implicit default (it's literally
the text already in the HTML) — every other language is a full dictionary that
gets swapped in. As of the last update the supported languages are: English,
Español, Tiếng Việt, 简体中文 (zh), 繁體中文 (tw), 日本語 (ja).

## Why this needs a script, not manual edits

Each language's dictionary is injected as **one giant single-line JS object
literal** (30–50KB per language, one `<script>` tag per language pair). The
Read/Edit tools cannot safely handle single lines that long. **Every step
below that touches the HTML must go through a throwaway Node script**, not
direct Edit calls — write the script to the scratchpad directory, run it with
Bash, then verify with another script. This is not optional; manual edits on
these lines will fail or corrupt the file.

## Step 1 — Extract the source strings to translate

The canonical source-of-truth key set is the existing `window.__I18N__`
(Vietnamese) dictionary — every language must have translations for exactly
the same keys. Extract it and the shell dict:

```js
const fs = require('fs');
const html = fs.readFileSync('cca-f-study-suite.html', 'utf8');
const vn = JSON.parse(html.match(/window\.__I18N__=(\{[\s\S]*?\});/)[1]);
const shellVn = JSON.parse(html.match(/window\.__SHELL__=(\{[\s\S]*?\});/)[1]);
console.log(Object.keys(vn).length); // currently 526
```

Dump `[key, en_hint, vn, ja]` (or whichever languages already exist) to a
scratchpad text file and read it in chunks — it's too big for one read. This
gives full context for translating consistently (keeps the same technical
terms in English that other languages already kept in English).

## Step 2 — Translate

Translate every key's value into the new language. Conventions established so
far (keep doing these unless told otherwise):

- **Keep technical/product terms in English**, embedded in otherwise-native
  sentences: `agent`, `workflow`, `subagent`, `coordinator`, `tool_choice`,
  `hook`, `MCP`, `Task tool`, `CLAUDE.md`, `session`, `structured output`,
  `direct execution`, etc. This matches how the VN/JA dictionaries already
  handle it.
- **The `IF THE STEM SAYS` column of the decision-rules table is left
  untranslated on purpose** — those are literal exam-stem phrases the user
  needs to recognize verbatim in the real (English) exam. Only the
  `REACH FOR` / `TRAP` columns and section headers get translated.
- Literal quoted example-prompt text (e.g. `"Output only JSON"`) inside a
  cell should stay in English quotes, with only the surrounding connective
  words translated.
- Write the translated dictionary as a scratchpad JSON file, then verify the
  key set matches exactly before touching the HTML:
  ```js
  const newKeys = Object.keys(newDict).sort();
  const vnKeys = Object.keys(vn).sort();
  console.log(JSON.stringify(newKeys) === JSON.stringify(vnKeys)); // must be true
  ```

### If the new language is a script conversion of an existing one (e.g. Traditional from Simplified Chinese)

Don't blindly do a 1:1 character substitution — several common characters map
to **different** target characters depending on the word they're in. Known
gotchas hit in this app's actual content: `复` (複/復/覆 depending on
复习/重复/恢复/反复/回复), `干` (幹/乾/干 depending on 题干/干净/干扰), `系`
(係/系 — only `关系→關係` changes), `签` (簽/籤 — `标签`→`標籤` uses 籤, not
簽/signature). Handle these as **phrase-level** replacements applied *before*
the general character map, then run the general single-character map over
everything else. After conversion, grep the output for every character your
map was supposed to change — zero leftovers should remain.

## Step 3 — Inject into the HTML

Use a script (see `scripts/inject-dict.js` in this skill folder, or write a
fresh one following this pattern) that:
1. Finds the last existing `window.__SHELL_XX__=...;` in the HTML.
2. Inserts `window.__I18N_<CODE>__=<json>;\nwindow.__SHELL_<CODE>__=<json>;`
   right after it, using brace-depth matching (not `indexOf(';')`, which
   breaks on strings that contain literal semicolons).

Then wire it into the JS engine (all four are small, single-line edits found
via grep):
- `var MAPS={...}` — add `<code>:window.__I18N_<CODE>__||{}`.
- `var SHELLS={...}` — add `<code>:window.__SHELL_<CODE>__||{}`.
- `var QS_UNIT={...}` — the translated word for "questions" used in the
  dynamic "N Qs" badge (e.g. `'câu hỏi'`, `'題'`). Also check the no-space
  rule right below it (`(lang==='ja'||lang==='zh'||...)?'':' '`) — CJK
  languages get no space between the number and unit, others do.
- `var QUESTION_FMT={...}` — a formatter function for the dynamic
  "Question N / M" counter, per language (e.g.
  `tw:function(a,b){return '第'+a+'題 / 共'+b+'題';}`).

## Step 4 — Add the dropdown option

`#lang-select` in the HTML — add `<option value="<code>"><Native Name></option>`
in the agreed position (see the ordering rule the user settled on: **Latin-
script languages first, alphabetical by English name** — English, Español,
Tiếng Việt — **then CJK languages grouped together** — 简体中文, 繁體中文,
日本語. Ask before assuming a different order if a 7th language is added,
since this has been revisited multiple times.)

## Step 5 — Update every README

All six `README*.md` files' **switch-link header row** (line 3) and
**Features bullet** (the "language toggle" line) must list all supported
languages, in the same order as the dropdown, with the current file's own
entry bolded instead of linked. Add a new `README.<code>.md` if the language
is new (not just a script variant sharing a link target).

## Step 6 — Verify

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
