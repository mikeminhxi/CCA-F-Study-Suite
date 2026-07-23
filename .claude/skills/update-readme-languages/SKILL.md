---
name: update-readme-languages
description: Update or re-order the language switch-links and language lists across all README*.md files in the CCA-F Study Suite, and keep them in sync with the in-app language dropdown. Use this whenever the user asks to reorder languages, add/remove a language from the README switch-link row, fix inconsistent language lists across READMEs, or wants the READMEs to match the app's dropdown order.
---

# Update README language selections

This project has one README per language: `README.md` (English, the
canonical one), `README.vi.md`, `README.ja.md`, `README.zh-cn.md`,
`README.zh-tw.md`, `README.es.md`. Every one of them carries two things that
must stay in sync with each other, with the in-app `#lang-select` dropdown in
`cca-f-study-suite.html`, and with each other:

1. **The switch-link header row** — line 3 of every README, right under the
   `# CCA-F Study Suite` title. Example (English file):
   ```
   **🇺🇸 English** · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md)
   ```
   The **current file's own language is bold plain text, not a link**; every
   other language is a markdown link to its README file. Every file's row
   must list the exact same set of languages in the exact same order — only
   which entry is bolded (and its own text obviously not being a link)
   changes between files.

2. **The "Features" bullet** describing the language toggle itself (search
   for "language toggle" / "语言切换" / "言語切り替え" / "Chuyển đổi ngôn ngữ" /
   "Selector de idioma" — one per file, in whichever language that file is
   written in). It lists the same languages in the same order as the switch-
   link row, and needs its prose ("translates between X, Y, Z...") updated to
   match whenever the set or order changes. This one gets stale easily —
   check it explicitly, don't assume it auto-follows the header row.

## The current ordering rule

**Latin-script languages first, sorted alphabetically by English name, then
CJK languages grouped together**: English, Español, Tiếng Việt, 简体中文,
繁體中文, 日本語. This is the result of the user overriding a pure-alphabetical
ordering earlier — if asked to reorder again, apply the new rule to *both* the
README switch-links *and* the `#lang-select` dropdown in the HTML (they must
never diverge), and update this skill file's description of the rule to match.

## How to do it safely

1. Read the current switch-link line from each of the six files first (they
   drift out of sync more often than expected — don't assume they currently
   match each other).
2. Build the new line using the ordering rule above, then apply it to all six
   files with individual `Edit` calls (these lines are short — no need for
   Node scripts here, unlike the dictionary work).
3. Update the "Features" bullet in all six files to match.
4. Update the `<option>` order inside `#lang-select` in `cca-f-study-suite.html`
   to match (grep `id="lang-select"` to find it).
5. If a language's flag emoji or native-name label changed, keep it
   consistent between the dropdown `<option>` text and every README link
   text for that language.
6. Re-open the HTML in a browser and confirm the dropdown order visually
   matches what was just written into the READMEs.
7. Note the reorder in `CHANGELOG.md` if it's more than a typo fix.

## Common mistakes to avoid

- Bolding/linking the wrong entry (each file bolds *its own* language only).
- Forgetting the Features-bullet line even though it's not adjacent to the
  header row — it's a completely separate line that must be hunted down per
  file since it's written in that file's own language.
- Leaving the app's dropdown order out of sync with the READMEs after a
  reorder request — they are one visible "list of languages" as far as the
  user is concerned, even though they live in different files.
