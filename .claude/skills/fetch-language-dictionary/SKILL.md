---
name: fetch-language-dictionary
description: Pre-step for adding a new UI language to the CCA-F Study Suite. Generates the full translated dictionary for a target language and writes it directly to translations/<code>.js in its final, shipped form, WITHOUT touching index.html. Run this before the add-language skill whenever the user asks to add/translate/support a new language. Use on its own if the user just wants translations drafted/reviewed/edited before committing to wiring the dropdown entry in.
---

# Fetch a language dictionary (pre-step for add-language)

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
  written as the literal JS function expression that becomes this
  language's `questionFmt` field in `translations/<code>.js` (e.g.
  `function(a,b){return '第'+a+'題 / 共'+b+'題';}`). The other 7 `*Fmt`
  fields (`questionsAvailableFmt`, `scoreSoFarFmt`, `bigScoreFmt`,
  `allCorrectFmt`, `retakeAllFmt`, `retakeMissedFmt`, `notThisTimeFmt`)
  follow the same pattern — write each as a real function expression, not a
  string.
- **`nativeName`**: the language's native-script name for the `<option>`
  label and README rows (e.g. `한국어`).
- **`sortHint`**: one of `"latin"`, `"cjk"`, `"devanagari"` (hi), `"cyrillic"`
  (ru), or `"thai"` (th), per the established dropdown ordering rule
  (Latin-script languages first, alphabetical by English name; then each
  other script grouped together as its own trailing block, in the order
  that script was first added) — lets `add-language` place the `<option>`
  and README entries in the right spot without re-asking.

## Step 4 — Validate before writing

```js
const newKeys = Object.keys(newDict.i18n).sort();
const vnKeys = Object.keys(vn).sort();
console.log(JSON.stringify(newKeys) === JSON.stringify(vnKeys)); // must be true
console.log(Object.keys(newDict.shell).length === Object.keys(shellVn).length); // must be true
const REQUIRED_FMT = ['questionFmt','questionsAvailableFmt','scoreSoFarFmt','bigScoreFmt',
  'allCorrectFmt','retakeAllFmt','retakeMissedFmt','notThisTimeFmt'];
console.log(REQUIRED_FMT.every(k => typeof newDict[k] === 'function')); // must be true
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
