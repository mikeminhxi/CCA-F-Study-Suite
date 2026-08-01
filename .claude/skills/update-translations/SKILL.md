---
name: update-translations
description: Add/translate new UI copy strings into all 12 supported languages across the whole app — `index.html`'s in-app dictionaries, the staged `translations/<code>.json` files, and (when the new copy describes a user-facing feature) every `README*.md`. Use this whenever the user asks to "update the translations", "translate this new text", "add translations for X", or after adding any new fixed English UI string/button/label to `index.html` that isn't covered yet. Different from `add-language`/`fetch-language-dictionary` (which add a whole new *language column*) — this is for adding new *string rows* to the languages that already exist.
---

# Update translations for new UI text

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

## Step 1 — Classify each new string: static or dynamic

- **Static**: fixed text with no runtime-interpolated values, e.g. `"Next
  question"`, `"Round complete"`. Goes straight into the flat key→value
  dictionaries as `"English text": "translated text"`.
- **Dynamic**: contains a number, letter, or other value that varies at
  runtime, e.g. `"3 / 5 correct so far"`, `"Retake all 22"`. These can't be
  flat dictionary lookups (the exact English string is different every
  render) — they need a small `..._FMT` dispatch, same pattern as the
  existing `QUESTION_FMT` (search `translateNode` in `index.html` for
  `QUESTION_FMT`/`QS_UNIT` to see the established shape: a regex that
  extracts the runtime values from the normalized English text, matched
  against a per-language `function(a,b){...}` in a `..._FMT` object).

## Step 2 — Translate

Translate every new string into all 12 languages. Match this app's existing
conventions (see `fetch-language-dictionary`'s Step 2 for the fuller list):
keep technical/product terms in English where the rest of the app does,
match the register/formality already used by neighboring keys in that
language's dictionary, and reuse an exact existing translation for a
recurring word/phrase if one already exists in that language (e.g. don't
invent a second translation for "correct" if the dictionary already has one
nearby).

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

## Step 5 — Update every README (only if the copy describes a feature)

If the new text is just a label/button wording tweak, skip this step. If it
describes new app *behavior* (a new mode, a new button that does something,
a changed workflow), update the relevant Features-bullet/table-row prose in
**English `README.md` and all 12 `README.<code>.md` files**, each written
in that file's own language, matching its existing tone and level of
detail — don't just paste an English sentence into a translated file. Find
each file's version by searching for the neighboring feature description
already there (e.g. the "Exam by Domain" table cell), not by assuming line
numbers.

## Step 6 — Verify in a real browser, not just JSON validation

A dictionary key being present doesn't prove it renders translated — this
app resets language to `'en'` briefly during its own boot sequence (~150ms
after `load`, see the `window.__setLang__(saved)` call at the bottom of
`index.html`), so a test script that switches language too early will see
everything silently revert to English and it's easy to misread that as a
translation bug. Serve the file locally
(`python -m http.server <port> --directory .`), drive it with
`playwright-core` against the system's installed Edge/Chrome
(`chromium.launch({executablePath: '...msedge.exe', headless: true})` — no
`chromium-cli` or bundled Playwright browser needed), wait at least ~500ms
after the page's `load` event before switching languages, then exercise the
actual UI path that produces the new string and read its rendered text —
don't just assert the dictionary contains the key.

## Step 7 — Wrap up

- Update `CHANGELOG.md` if the underlying change is more than a wording fix.
- This skill does **not** need the spec-kit gate from
  `specs/001-add-language/spec.md` (FR-009) — that gate is specifically for
  adding a brand-new *language*, not new strings in languages that already
  exist.
- This repo's standing convention is every change gets its own branch + PR
  + squash-merge, no exceptions for "just a translation update" — see
  `squash-merge-pr`.
