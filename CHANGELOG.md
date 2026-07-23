# Changelog

All notable changes to the CCA-F Study Suite are recorded here.

## Languages

- Added full Chinese (ZH) and Spanish (ES) translations, bringing the app to five languages: English, Vietnamese, Japanese, Chinese, Spanish.
- Filled in translation gaps that existed even in the original VN/JA dictionaries:
  - The six **core principle cards** (Cheat & Keywords tab) — title + body for all six, all four non-English languages.
  - The **decision rules table** (73 strings: 7 section headers + `REACH FOR`/`TRAP` cell text). The `IF THE STEM SAYS` column is intentionally left in English, since those are literal exam-stem phrases you need to recognize verbatim in the real exam.
  - All **14 quiz category tags** (e.g. "Agent vs. Workflow Design") shown in the Exam by Domain header — only 1 of 14 had a translation before.
  - The Study Console **source line** ("source · CCA-F_Study_Guide.md · …").
- Fixed two dynamic (non-static) strings that could never match a fixed dictionary entry, since they contain runtime numbers:
  - The question-count badge ("N Qs") — added a regex-based fallback keyed off the trailing unit word.
  - The quiz progress counter ("Question 4 / 12") — added a dedicated per-language formatter.
- Language switcher UI: converted from a row of 2-letter buttons (EN/VN/JA/ZH/ES) to a `<select>` dropdown with full language names.
- Added **Traditional Chinese (TW)**, alongside the existing Simplified (ZH), by converting the full 526-entry Simplified dictionary character-by-character (with phrase-level overrides for context-dependent characters like 复/干/系/签, which map to different traditional forms depending on the word — e.g. 复习→複習 but 恢复→恢復, and 标签→標籤 not 標簽). Verified zero leftover Simplified characters in the output.
- Dropdown order settled after a couple of rounds of feedback: Latin-script languages first, alphabetically (English, Español, Tiếng Việt), then CJK languages grouped together (简体中文, 繁體中文, 日本語).
- Updated all six README files' language switch-link row and "Features" bullet to reflect all six languages, in the same order, and added `README.zh-tw.md`.

## Theme

- Added a Light / Dark / Windows Default (system) theme switch, styled as a 3-way icon toggle (sun / moon / monitor SVGs) next to the language dropdown.
- "Windows Default" follows the OS's `prefers-color-scheme` live — it updates automatically if the OS theme changes while selected.
- Preference persists via `localStorage` (defaults to Dark, matching the app's original look).
- Built a full light-theme palette: CSS variables for the shell chrome (nav, tabs, badges) plus per-tool-pane overrides for all four tools (Study Console, Study Hub, Neuron Map, 2-Week Plan), reusing each pane's existing scoped variable names.

## Bug fixes

- **Learning Path timeline** (Study Hub): the vertical connector line between stage badges was painting on top of the percentage number, obscuring it. Fixed with a z-index on the badge.
- **Neuron Map, light mode**:
  - Domain hub circles had a hardcoded dark-navy fill, so they stayed dark (and their labels unreadable) even in light mode. Now theme-aware.
  - The dashed cross-domain "synapse" arcs had no `fill:none`, so the browser filled the implied closed shape under each curve — rendering as large dark wedge-shaped shadows, especially visible against a light background. Fixed.
  - Synapse line opacity/stroke-width bumped specifically for light mode, since the default styling (tuned for a dark background) was too washed out against a light one.

## Neuron Map layout

The leaf-label layout went through several iterations to balance three competing constraints: avoiding label overlap, keeping text legible, and keeping the diagram compact enough to not require heavy scrolling. Final approach:

- Each domain's leaves sit on a single ring (not a stagger/zig-zag), consistent with a clean radial "neuron map" look.
- A domain's ring radius is computed from its actual content (sum of label widths + gaps ÷ angular span), so a domain with more/longer labels (like D1's 7 leaves) gets more room automatically — capped at a fixed maximum so the overall canvas stays a predictable, modest size.
- Given that cap, the busiest domains (D1 most of all) may show a couple of labels sitting close together rather than perfectly spaced — a deliberate trade-off to keep the page from requiring a lot of vertical scrolling.

## Documentation

- Created `README.zh-cn.md`, `README.es.md`, and `README.zh-tw.md` (mirroring the existing README structure) and cross-linked all six README files to each other.
- Renamed `README.zh.md` → `README.zh-cn.md` for symmetry with `README.zh-tw.md` (the in-app language code stays `zh` — this was a docs-only rename). Updated every cross-reference: the other five READMEs, `CHANGELOG.md`, and the `update-readme-languages` skill.
- This changelog.

## Tooling

- Added two project-local Claude Code skills (`.claude/skills/`): `add-language` (the full process for adding a new UI language, including the Simplified/Traditional-Chinese-style ambiguous-character gotchas) and `update-readme-languages` (keeping the README switch-links and the app's language dropdown in sync when reordering/adding/removing a language).
- Added `SPEC_KIT_INTEGRATION_PLAN.md` — a plan for adopting [spec-kit](https://github.com/github/spec-kit) for future feature work on this app (constitution → spec → plan → tasks → implement), with `github-mcp-server` and `context7` evaluated and deferred/skipped as not currently needed for a dependency-free single-file app.
- Added a **language expansion priority list** to the plan doc: Korean, Portuguese (Brazil), French, German (no new engineering lift), then Russian, Italian, with Arabic/Hebrew flagged separately since this app has no RTL layout support yet.
