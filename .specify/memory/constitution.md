<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- List of modified principles: N/A (initial ratification)
  - I. Zero-Dependency Single File (new)
  - II. i18n-First UI Copy (new)
  - III. Theme Parity (new)
  - IV. Safe Large-Dictionary Edits (new)
  - V. Documentation Currency (new)
- Added sections: Language & Translation Conventions; Development Workflow; Governance
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — Constitution Check gate is generic
    ("[Gates determined based on constitution file]"), no edit needed; gates
    are derived per-feature from this file at /speckit-plan time.
  - ✅ .specify/templates/spec-template.md — no constitution-specific
    references, no edit needed.
  - ✅ .specify/templates/tasks-template.md — no constitution-specific
    references, no edit needed.
- Follow-up TODOs: none.
-->

# CCA-F Study Suite Constitution

## Core Principles

### I. Zero-Dependency Single File

The entire application is one self-contained file, `cca-f-study-suite.html`.
No build step, no server, no external JS dependencies — the only external
network call is a Google Fonts `<link>`. Any change that would require a
bundler, package manager, or a new external script/library dependency is out
of scope unless the constitution is amended first to explicitly allow it.

### II. i18n-First UI Copy

All user-visible copy MUST flow through the i18n dictionary system
(`window.__I18N_XX__` dictionaries + `window.__SHELL_XX__` nav labels,
consumed by the `MAPS`/`SHELLS` objects and the TreeWalker-based
`translateNode`/`applyAll` engine). Hardcoded English strings that bypass
translation are not permitted in UI-facing markup. Every new language
addition MUST cover the full key set already present in the other
dictionaries (currently: VN, JA, ZH, TW, ES, with EN implicit) and MUST
update every README's switch-link row and Features bullet, and the
`#lang-select` dropdown, in the same pass. Dropdown/README language order:
Latin-script languages first, alphabetically by English name, then CJK
languages grouped together.

### III. Theme Parity

Every visual or layout change MUST be checked in both Light and Dark theme
(and, where feasible, System) before being considered done. Theme-specific
CSS variables are defined per tool pane, not assumed to inherit from a
shared default — a change that looks correct in one theme and wrong in the
other is a regression, not a follow-up.

### IV. Safe Large-Dictionary Edits

Several inline JS dictionary literals exceed 30KB on a single line. Edits to
them MUST go through a throwaway Node script using brace-depth- and
string-escape-aware JSON boundary detection (never naive string-splitting
such as `indexOf(';')`, which breaks on embedded semicolons in translated
text), executed via the shell — not manual `Edit`/`Write` calls against the
raw line.

### V. Documentation Currency

`CHANGELOG.md` MUST be updated for every user-visible change (new language,
theme change, layout fix, new feature). The list of supported languages MUST
never diverge between `CHANGELOG.md`, the six README files, and the app's
`#lang-select` dropdown.

## Language & Translation Conventions

- In decision-table-style content (e.g. the "IF THE STEM SAYS → THEN"
  rules table), literal exam-stem trigger phrases and pure keyword/pattern
  names are kept in their original (English) form, since they must be
  recognized verbatim in the real exam. Connective and explanatory prose
  around them is translated for reading comprehension.
- Dynamic strings containing runtime numbers (e.g. the "N Qs" badge, the
  "Question N / M" counter) cannot live in a static dictionary; they are
  handled via the `QS_UNIT` / `QUESTION_FMT` regex-based per-language
  formatters in the translation engine, not by trying to force them into
  fixed dictionary entries.
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

**Version**: 1.0.0 | **Ratified**: 2026-07-24 | **Last Amended**: 2026-07-24
