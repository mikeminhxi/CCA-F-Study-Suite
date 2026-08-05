---
name: add-language
description: Add a new UI language to the CCA-F Study Suite (index.html), from an already-generated translations/<code>.js file. Use this whenever the user asks to add/support a new language, translate the app into a language, or add a language variant — it will trigger fetch-language-dictionary first if no such file exists yet. Covers adding the language dropdown option and updating all README files (translations/<code>.js is already the final, loaded artifact — no wiring into index.html's JS engine needed).
---

# Add a language to the CCA-F Study Suite

This app is a self-contained static app — `index.html` plus a `translations/`
folder of per-language files, no build step — with a runtime text-swap i18n
system. English is the implicit default (it's literally the text already in
the HTML) — every other language is a full dictionary that gets swapped in.
As of the last update the supported languages are: English, Español, Tiếng
Việt, 简体中文 (zh), 繁體中文 (tw), 日本語 (ja).

Translation generation is **not** part of this skill — it lives in
[fetch-language-dictionary](../fetch-language-dictionary/SKILL.md), which
writes the full translated dictionary directly to `translations/<code>.js`
in its final, shipped form before anything here runs. This skill is the
cheap, mechanical half: add the dropdown entry and README rows for an
already-translated, already-validated language file.

## No injection script needed anymore

Earlier versions of this skill required a brace-depth-aware Node script to
inject each language's dictionary into `index.html` as its own multi-KB
`<script>` block, because the Read/Edit tools couldn't safely handle those
programmatically-generated objects. That's gone: `translations/<code>.js`
is loaded directly by the app at runtime (`index.html`'s `loadLang()`), so
this skill's only HTML edit is adding one `<option>` line to `#lang-select`
(Step 2) — a normal, safe `Edit` call, no script required.

## Step 0 — Confirm spec-kit has run for this language

Same gate as [fetch-language-dictionary](../fetch-language-dictionary/SKILL.md)
Step 0, checked again here in case this skill is invoked on its own: per
`specs/001-add-language/spec.md` (FR-009), `specs/001-add-language/plan.md`
and `tasks.md` for this language MUST already exist on its own branch
(`feat/add-<language>-language`) before wiring anything into the app. If
they're missing, stop and tell the user to run `/speckit-plan` →
`/speckit-tasks` first — don't wire the dictionary in anyway as a shortcut.

## Step 1 — Confirm the language file exists

Check for `translations/<code>.js`. **If it doesn't exist, stop and run
the [fetch-language-dictionary](../fetch-language-dictionary/SKILL.md) skill
first** — don't translate inline here as a fallback. That skill's own Step 4
already validates key parity against the baseline at generation time, so no
re-validation is needed here; `translations/<code>.js` is loaded directly by
`index.html`'s `loadLang()` function with no further wiring.

## Step 2 — Add the dropdown option

`#lang-select` in the HTML — add
`<option value="<code>"><nativeName></option>` (from `translations/<code>.js`'s
`nativeName` field) in the agreed position per that file's `sortHint` field:
**Latin-script languages first, alphabetical by English name** — English,
Español, Tiếng Việt — **then CJK languages grouped together** — 简体中文,
繁體中文, 日本語. Ask before assuming a different grouping if `sortHint` is
ambiguous or absent, since this ordering has been revisited multiple times.

## Step 3 — Update every README

All six `README*.md` files' **switch-link header row** (line 3) and
**Features bullet** (the "language toggle" line) must list all supported
languages, in the same order as the dropdown, with the current file's own
entry bolded instead of linked. Add a new `README.<code>.md` if the language
is new (not just a script variant sharing a link target).

## Step 4 — Verify

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
