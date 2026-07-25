# Changelog

All notable changes to the CCA-F Study Suite are recorded here.

## Languages (Portuguese)

- Added **Portuguese, Brazil (Português)** as the 8th supported UI language — a Tier 1 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5 (large developer population, Latin script, same mechanics as Spanish/Vietnamese, no new engineering lift). Checked off in the priority list, along with fixing a stale entry there for Korean (already shipped in PR #1 but left unchecked).
- Full 696-key (691 `i18n` + 5 `shell`) dictionary translated and staged at `translations/pt.json` via `fetch-language-dictionary`, then wired into `cca-f-study-suite.html` (`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select` dropdown — positioned between English and Español per alphabetical-by-English-name ordering) via `add-language`. All 7 existing READMEs updated; added `README.pt.md`.
- Built via a **prospective** spec-kit round (`/speckit-plan` → `/speckit-tasks` run *before* implementation, per FR-009) — the first language round to follow that order from the start rather than retrofitting it afterward. Also updated `specs/001-add-language/spec.md`'s hardcoded "531 keys" references (FR-002, SC-002) to describe the baseline dynamically, since it has grown to 696 keys since Korean's round and will keep changing.
- **Bug found and fixed during verification** (pre-existing, affected all 7 other languages equally, not introduced by this addition): the Exam-by-Domain quiz's in-quiz meta line concatenated the task-statement id and title into a single text node (`"ts-4.3 · Enforce structured output..."`), which never matched any dictionary key, so the title silently stayed in English under every non-English language. Fixed by splitting the id into its own `.tscode` span, matching the pattern already used in the Learning Path and Study rail — the title is now an independently-translated text node in all 8 languages.
- Verified end-to-end in a real browser (Playwright) across all 8 languages: Learning Path, Cheat & Keywords, Study, Exam by Domain (including the fixed quiz meta line), and the Concepts tab all render correctly, zero console errors, progress and language preference both persist across reload.

## UI / Theme

- **Light-theme parity fixes**: the Study Console header and Study Hub jump-nav had hardcoded dark backgrounds that stayed dark in light mode, and the Neuron Map stage had a hardcoded dark gradient that rendered everything — including the amber synapse lines — on a dark-gray field. All now use theme variables with light-mode overrides; synapses are clearly visible in light mode.
- **Concept library legibility**: level chips (Foundation/Intermediate/Advanced) used hardcoded pastel hex tuned for dark mode and were low-contrast on white; switched to the themed `--teal`/`--amber`/`--rose` variables. The card background was near-invisible (`rgba(127,127,127,.06)`); switched to the themed `--panel2`. Legible in both themes.
- **Responsive header**: the Study Console tab row now always wraps to its own line, so tab placement is consistent across all 7 languages instead of depending on how wide that language's tab labels happen to be.
- **Mobile layout (≤640px)**: brand on its own row, shell tabs as full-width stacked buttons, theme toggle and language selector spread across the bottom row — tidy and identical across all 7 languages, instead of the brand and first tab crowding onto one line.
- Renamed the system-theme button's tooltip from "Windows Default" to "System" (the app has never been Windows-specific — it follows the OS's `prefers-color-scheme` on any platform).

## Blueprint taxonomy restructure

- Restructured the Study Console around the **official CCA-F blueprint** (from [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn)): **5 domains → 30 task statements → 59 concepts**, replacing the previous 7-phase / 14-module organization as the app's primary navigation.
- **Re-tagged all 157 questions** to a task statement; a question's domain is now derived from its tag (one source of truth), which fixed the old module→domain mismatches (e.g. Grep/Glob "codebase search" questions now sit under Tool Design & MCP, not Claude Code; session-resumption questions under Agentic Architecture, not Context). 94 questions stayed in their original domain, 63 moved as blueprint corrections.
- **Learning Path**: now lists the 5 domains in blueprint weight order (D1 27% → D5 15%), each expanding to its task statements with per-domain and per-task-statement progress.
- **Study mode**: filter by domain → task statement, plus a non-domain "Mixed / Applied" set for cross-cutting, exam-style practice (the 14 originally-mixed questions).
- **Exam by Domain**: chips are now task statements grouped under their domains; the in-quiz meta line shows each question's task statement.
- **New Concepts tab**: all 59 blueprint concepts grouped by domain → task statement, each with its one-line core insight and a Foundation / Intermediate / Advanced level chip.
- **Neuron Map**: domain labels updated to the official blueprint names.
- Retired the synthetic "Mixed / Applied" 6th domain, the `PHASES`/module structure, and the `MODULE_DOMAIN` map.
- Verified end-to-end in a real browser (Playwright): all five domains / 30 task statements / 59 concepts render, the quiz pools all 157 questions by task statement, zero console errors, both light and dark themes.
- Built **English-first**, then fully localized: all 170 new UI strings (30 task-statement titles, 59 concept titles + 59 insights, 5 domain labels + descriptions, the 3 level words, and the new copy) were translated into Vietnamese, Japanese, Simplified & Traditional Chinese, Spanish, and Korean — in the app dictionaries (696 keys each) and the staged `translations/*.json` files — with technical/code terms kept in English. All seven READMEs were refreshed to the new taxonomy. Spec-kit round for this change is under `specs/002-blueprint-taxonomy/`.

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
- Executed the spec-kit integration plan: installed the `specify` CLI, scaffolded `.specify/` (templates, scripts, workflow) and the `speckit-*` Claude Code skills, and ratified the initial project **constitution** (`.specify/memory/constitution.md`, v1.0.0) — five principles covering the single-file/zero-dependency rule, i18n-first UI copy, theme parity, safe large-dictionary editing, and documentation currency. Feature work going forward can use `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- Split the `add-language` skill's translation step out into a new **`fetch-language-dictionary`** skill: it generates the full 531-key translated dictionary and stages it at `translations/<code>.json`, without touching the app file. `add-language` now only does the mechanical wiring (inject into the HTML, dropdown option, all six READMEs), reading from that staged file instead of translating inline. This means a failed or reworked injection never forces re-translating from scratch, the staged JSON is reviewable on its own before anything touches the 600KB app file, and it rides along in a language's PR as a clean diff of just the translations. `cca-f-study-suite.html`'s five per-language dictionaries were also reformatted from single 30–50KB lines to indented multi-line JSON, so they're now directly readable/diffable in an editor.
- Backfilled `translations/{vn,ja,zh,tw,es}.json` for the five already-shipped non-English languages by extracting their existing dictionaries straight out of `cca-f-study-suite.html` into the same schema `fetch-language-dictionary` uses for new languages — purely mechanical, no translation involved. Brings all six supported languages to a consistent staged-file baseline for future review or correction, without needing to hand-edit the app file directly.
- Clarified `fetch-language-dictionary`'s script-conversion guidance (e.g. deriving Traditional Chinese from Simplified): the source to convert from can be another language's staged `translations/<code>.json`, not only an in-app dictionary — needed when a derived-script pair is added together for the first time, before either has been wired into the app.
- Settled the per-language branch-naming convention on `feat/add-<language>-language` (spelled-out language name, e.g. `feat/add-korean-language`) instead of the two-letter code, for readability.
- Every language addition now requires one spec-kit round (`/speckit-plan` → `/speckit-tasks`, producing `plan.md`/`tasks.md` on that language's own branch) before `fetch-language-dictionary`/`add-language` run — codified as FR-009 in `specs/001-add-language/spec.md` and checked by both skills.
- Added a **`squash-merge-pr`** skill: crafts this project's squash-merge commit message convention (`<type>: <title> #<PR-number>`, body bullets preserving what a squash would otherwise erase — process changes, bugs found during the work, flagged follow-ups) instead of relying on GitHub's auto-filled commit-list message.

## Languages (in progress)

- **Korean (한국어)** — fully wired into `cca-f-study-suite.html` (dropdown, `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`), all six existing READMEs updated, `README.ko.md` added. Verified in a real browser via Playwright — zero console errors, all core UI renders correctly. Open as PR #1 (`feat/add-korean-language`), not yet merged to `main`.
