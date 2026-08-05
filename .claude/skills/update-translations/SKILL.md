---
name: update-translations
description: Add/translate new UI copy strings into every supported language's `translations/<code>.js` file, and (when the new copy describes a user-facing feature) every `README*.md`. Use this whenever the user asks to "update the translations", "translate this new text", "add translations for X", or after adding any new fixed English UI string/button/label to `index.html` that isn't covered yet. Different from `add-language`/`fetch-language-dictionary` (which add a whole new *language column*) — this is for adding new *string rows* to the languages that already exist.
---

# Update translations for new UI text

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

## Step 1 — Classify each new string: static or dynamic

- **Static**: fixed text with no runtime-interpolated values, e.g. `"Next
  question"`, `"Round complete"`. Goes straight into the flat key→value
  dictionaries as `"English text": "translated text"`.
- **Dynamic**: contains a number, letter, or other value that varies at
  runtime, e.g. `"3 / 5 correct so far"`, `"Retake all 22"`. These can't be
  flat dictionary lookups (the exact English string is different every
  render) — they need a small `<camelCase>Fmt` dispatch, same pattern as
  the existing `questionFmt` (search `translateNode` in `index.html` for
  `d.questionFmt`/`d.qsUnit` to see the established shape: a regex that
  extracts the runtime values from the normalized English text, matched
  against a `function(a,b){...}` field read directly off the currently
  loaded language's data — `translations/<code>.js`'s
  `window.__LANG_<CODE>__`, not a separate global `..._FMT` map).

## Step 2 — Translate

Translate every new string into all 12 languages. Match this app's existing
conventions (see `fetch-language-dictionary`'s Step 2 for the fuller list):
keep technical/product terms in English where the rest of the app does,
match the register/formality already used by neighboring keys in that
language's dictionary, and reuse an exact existing translation for a
recurring word/phrase if one already exists in that language (e.g. don't
invent a second translation for "correct" if the dictionary already has one
nearby).

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

## Step 4 — Update every README (only if the copy describes a feature)

If the new text is just a label/button wording tweak, skip this step. If it
describes new app *behavior* (a new mode, a new button that does something,
a changed workflow), update the relevant Features-bullet/table-row prose in
**English `README.md` and all 12 `README.<code>.md` files**, each written
in that file's own language, matching its existing tone and level of
detail — don't just paste an English sentence into a translated file. Find
each file's version by searching for the neighboring feature description
already there (e.g. the "Exam by Domain" table cell), not by assuming line
numbers.

## Step 5 — Verify in a real browser, not just JSON validation

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

## Step 6 — Wrap up

- Update `CHANGELOG.md` if the underlying change is more than a wording fix.
- This skill does **not** need the spec-kit gate from
  `specs/001-add-language/spec.md` (FR-009) — that gate is specifically for
  adding a brand-new *language*, not new strings in languages that already
  exist.
- This repo's standing convention is every change gets its own branch + PR
  + squash-merge, no exceptions for "just a translation update" — see
  `squash-merge-pr`.
