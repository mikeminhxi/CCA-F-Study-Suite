---
name: fetch-language-dictionary
description: Pre-step for adding a new UI language to the CCA-F Study Suite. Generates the full translated dictionary for a target language and stages it as a local JSON file under translations/, WITHOUT touching index.html. Run this before the add-language skill whenever the user asks to add/translate/support a new language. Use on its own if the user just wants translations drafted/reviewed/edited before committing to wiring them into the app.
---

# Fetch a language dictionary (pre-step for add-language)

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

## Step 0 — Confirm spec-kit has run for this language

Per `specs/001-add-language/spec.md` (FR-009), every language addition MUST
go through one round of `/speckit-plan` → `/speckit-tasks` scoped to that
specific language before either this skill or `add-language` runs. Check
that `specs/001-add-language/plan.md` and `tasks.md` exist **on this
language's own branch** (`feat/add-<language>-language`) and are actually
about this language, not leftover from a previous one.

**If they don't exist yet, stop.** Tell the user to run `/speckit-plan` then
`/speckit-tasks` for this language first — don't translate anyway as a
convenience; that's exactly the ad-hoc shortcut FR-009 exists to close off.

## Step 1 — Extract the canonical key set

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

Also pull one or two existing languages' values alongside each key (e.g. VN
+ JA) for translation-consistency context — dump `[key, vn, ja]` to a
scratchpad file and read it in chunks (too big for one read).

## Step 2 — Translate

Translate every key's value into the target language. Conventions
established so far (keep doing these unless told otherwise):

- **Keep technical/product terms in English**, embedded in otherwise-native
  sentences: `agent`, `workflow`, `subagent`, `coordinator`, `tool_choice`,
  `hook`, `MCP`, `Task tool`, `CLAUDE.md`, `session`, `structured output`,
  `direct execution`, etc.
- **The `IF THE STEM SAYS` column of the decision-rules table is left
  untranslated on purpose** — those are literal exam-stem phrases the user
  needs to recognize verbatim in the real (English) exam. Only the
  `REACH FOR` / `TRAP` columns and section headers get translated.
- Literal quoted example-prompt text (e.g. `"Output only JSON"`) inside a
  cell should stay in English quotes, with only the surrounding connective
  words translated.

### If the new language is a script conversion of an existing one (e.g. Traditional from Simplified Chinese)

The source dictionary to convert from is another language's
`translations/<code>.js` file — either one already shipped, or another
just-written one in the same batch. The latter matters when a related pair
is being added together for the first time — e.g. adding Chinese from
scratch means running this skill for `zh` first (a normal from-scratch
translation, nothing Chinese exists yet), then running it again for `tw` in
conversion mode sourced from the just-written `translations/zh.js`.
Only run `add-language` for both once both files exist.

Don't blindly do a 1:1 character substitution — several common characters
map to **different** target characters depending on the word they're in.
Known gotchas hit in this app's actual content: `复` (複/復/覆 depending on
复习/重复/恢复/反复/回复), `干` (幹/乾/干 depending on 题干/干净/干扰), `系`
(係/系 — only `关系→關係` changes), `签` (簽/籤 — `标签`→`標籤` uses 籤, not
簽/signature). Handle these as **phrase-level** replacements applied
*before* the general character map, then run the general single-character
map over everything else. After conversion, grep the output for every
character your map was supposed to change — zero leftovers should remain.

## Step 3 — Also determine the dynamic-string metadata

These can't live in the plain key/value dictionary because they involve
runtime numbers or per-language grammar:

- **`qsUnit`**: the translated word for "questions" used in the dynamic
  "N Qs" badge (e.g. `'câu hỏi'`, `'題'`).
- **`noSpaceBeforeUnit`**: `true` for CJK languages (no space between the
  number and unit), `false` for space-separated languages.
- **`questionFmt`**: the "Question N / M" counter pattern for this language,
  written as the literal JS snippet `add-language` should splice into
  `QUESTION_FMT` (e.g. `function(a,b){return '第'+a+'題 / 共'+b+'題';}`).
- **`nativeName`**: the language's native-script name for the `<option>`
  label and README rows (e.g. `한국어`).
- **`sortHint`**: `"latin"` or `"cjk"`, per the established dropdown
  ordering rule (Latin-script languages first, alphabetical by English
  name; then CJK languages grouped together) — lets `add-language` place
  the `<option>` and README entries in the right spot without re-asking.

## Step 4 — Validate before writing

```js
const newKeys = Object.keys(newDict.i18n).sort();
const vnKeys = Object.keys(vn).sort();
console.log(JSON.stringify(newKeys) === JSON.stringify(vnKeys)); // must be true
console.log(Object.keys(newDict.shell).length === Object.keys(shellVn).length); // must be true
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
