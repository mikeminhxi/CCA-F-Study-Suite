<!--
Sync Impact Report
- Version change: 1.1.1 → 1.2.0
- List of modified principles:
  - I. Zero-Build, First-Party Files (amended: also permits first-party
    <link rel="stylesheet"> files, and requires every such file to ship
    alongside index.html — added for style.css/content.js)
  - IV. Safe Large-Dictionary Edits (re-grounded: the rule now cites
    escaping correctness across content.js and translations/<code>.js,
    replacing a stale premise about 30KB single-line literals that stopped
    being true when the dictionaries were pretty-printed)
- Added sections: none
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — no edit needed (generic gate).
  - ✅ .specify/templates/spec-template.md — no edit needed.
  - ✅ .specify/templates/tasks-template.md — no edit needed.
- Follow-up TODOs: none.
-->

# CCA-F Study Suite Constitution

## Core Principles

### I. Zero-Build, First-Party Files

The application ships as first-party static files with no build step, no
server-side code, no package manager, and no bundler — only plain files a
browser loads directly. `index.html` is the entry point; it may load
additional same-origin, first-party `<script src>` and
`<link rel="stylesheet">` files (e.g. `style.css`, `content.js`,
`languages.config.js`, `translations/<code>.js`) as long as each one is a
plain committed file requiring no compilation step, and loading uses a
`<script src>`/`<link>` tag rather than `fetch()` so the app keeps working
when `index.html` is opened directly via `file://`. Every such file MUST
sit alongside `index.html` and ship in the repo. The only external network
call is a Google Fonts `<link>`. Any change that would require a bundler,
package manager, transpilation, or a third-party external script/library
dependency is out of scope unless the constitution is amended first to
explicitly allow it.

### II. i18n-First UI Copy

All user-visible copy MUST flow through the i18n dictionary system: one
`translations/<code>.js` file per language (each defining
`window.__LANG_<CODE>__` with an `i18n` dict, a `shell` dict, and 8 format
functions), lazily loaded via `<script src>` into `LANG_DATA[code]` and
consumed by the TreeWalker-based `translateNode`/`applyAll` engine.
Hardcoded English strings that bypass translation are not permitted in
UI-facing markup. Every new language addition MUST cover the full key set
already present in the other language files (verified by CI keyset-parity
checking — currently 723 `i18n` keys + 5 `shell` keys + 8 format functions
per language, EN implicit/untranslated) and MUST update every README's
switch-link row and Features bullet, and the `#lang-select` dropdown, in
the same pass. Dropdown/README language order: Latin-script languages
first, alphabetically by English name, then CJK languages grouped
together.

### III. Theme Parity

Every visual or layout change MUST be checked in both Light and Dark theme
(and, where feasible, System) before being considered done. Theme-specific
CSS variables are defined per tool pane, not assumed to inherit from a
shared default — a change that looks correct in one theme and wrong in the
other is a regression, not a follow-up.

### IV. Safe Large-Dictionary Edits

The app's data files (`content.js`, `translations/<code>.js`) hold large JS
object and array literals — some run to thousands of characters on a single
line, and their string values embed quotes, apostrophes, backslashes and
semicolons across many scripts and languages. Edits to them MUST go through
a throwaway Node script using brace-depth- and string-escape-aware boundary
detection (never naive string-splitting such as `indexOf(';')`, which breaks
on embedded semicolons in translated text), executed via the shell — not
manual `Edit`/`Write` calls against the raw line.

### V. Documentation Currency

`CHANGELOG.md` MUST be updated for every user-visible change (new language,
theme change, layout fix, new feature). The list of supported languages MUST
never diverge between `CHANGELOG.md`, all 17 README files, and the app's
`#lang-select` dropdown.

## Language & Translation Conventions

- In decision-table-style content (e.g. the "IF THE STEM SAYS → THEN"
  rules table), literal exam-stem trigger phrases and pure keyword/pattern
  names are kept in their original (English) form, since they must be
  recognized verbatim in the real exam. Connective and explanatory prose
  around them is translated for reading comprehension.
- Dynamic strings containing runtime numbers (e.g. the "N Qs" badge, the
  "Question N / M" counter) cannot live in a static dictionary; they are
  handled via each language's `qsUnit`/`questionFmt` (and the other 7
  `*Fmt` functions) in `translations/<code>.js`, matched by regex in the
  translation engine, not by trying to force them into fixed dictionary
  entries.
- Simplified/Traditional Chinese conversions must account for
  context-dependent characters (e.g. 复/干/系/签) via phrase-level
  overrides before falling back to a general character map, and must be
  verified with a zero-leftover-simplified-characters sweep.

## Development Workflow

Feature work on the Study Suite follows the spec-kit flow: constitution
(this document, amended as needed) → specify → (optional clarify) → plan →
tasks → (optional analyze/checklist) → implement, with each stage's output
kept under `.specify/specs/**` as a durable record of *why and how* a
change was planned. `CHANGELOG.md` continues to record *what shipped*, in
user-facing terms, independent of the spec-kit artifacts.

## Governance

This constitution supersedes ad-hoc practice for anything it covers. This is
a single-maintainer project; amendments are made by explicit owner decision,
not committee review. Any amendment MUST:

1. Update the version per semantic versioning — MAJOR for backward
   incompatible principle removals/redefinitions, MINOR for a new
   principle or materially expanded guidance, PATCH for wording/typo
   clarifications.
2. Update `Last Amended` below to the date of the change.
3. Be checked against `.specify/templates/plan-template.md`,
   `spec-template.md`, and `tasks-template.md` for consistency (see Sync
   Impact Report above for the current state of that check).

**Version**: 1.2.0 | **Ratified**: 2026-07-24 | **Last Amended**: 2026-08-06
