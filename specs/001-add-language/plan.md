# Implementation Plan: Add Ukrainian (Українська) Language

**Branch**: `feat/add-ukrainian-language` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-add-language/spec.md`, scoped to
Ukrainian (uk) — ranked #1 among remaining candidates in
`SPEC_KIT_INTEGRATION_PLAN.md` §5 (PR #33), matching User Story 1 (drop-in
language, no RTL layout mechanics, script already solved by the Russian
round).

**Note**: Written prospectively, per FR-009 — this plan and `tasks.md` are generated
and committed *before* `fetch-language-dictionary`/`add-language` run, following the
same pattern as all prior rounds (most recently Thai, PR #27).

## Summary

Add Ukrainian as the 18th supported UI language: full dictionary translated
and written directly (already in final, loaded form — no separate staging
step) to `translations/uk.js` via `fetch-language-dictionary` (current
baseline: 723 `i18n` + 5 `shell` keys + 8 format functions, confirmed against
`translations/vn.js`, unchanged since the Thai round), then wired into
`index.html` (`#lang-select` dropdown only — since PR #30/#31's lazy-load
refactor, `translations/<code>.js` defines `window.__LANG_UK__` and is loaded
on demand by `loadLang()`; there is no more `MAPS`/`SHELLS`/injected-dictionary
step in `index.html` itself) and all seventeen existing READMEs' switch-links
via `add-language`, plus a new `README.uk.md`. Matches User Story 1 in
`spec.md` (drop-in language, no new layout mechanics) — Ukrainian is not RTL.

**Script family note — joins an existing group, does not open a new one**:
unlike every round since Hindi (which each introduced a brand-new trailing
script-family group), Ukrainian is the app's **second** Cyrillic-script
language. Per the ordering rule (script-family groups appended in the order
introduced; languages *within* an already-established group ordered
alphabetically by English name — same rule Tier-1 Latin languages use), it
joins the existing Cyrillic group alongside Русский (Russian), not after it
as a new group. "Russian" < "Ukrainian" alphabetically by English name, so
Ukrainian's `<option>`/README entry goes immediately **after** Русский, still
directly before Thai (the next trailing group). Net position: ... Русский,
Українська, ไทย. `sortHint: "cyrillic"` (reused, not a new value).

**Font coverage note**: Cyrillic glyphs are already covered by the app's
browser system-font fallback (confirmed working for Russian, PR #17) — no
new font work anticipated for Ukrainian.

**Quality gate (standing since the Russian round)**: run the English-word-overlap
diff of the staged `uk.js` `i18n`/`shell` values against `de.js` *before*
wiring the dropdown option, to catch under-translation before it ships (the
lesson from the Hindi round), and manually spot-check a sample of the
translating agent's self-reported "verified exception" list against the
reference sibling directly rather than trusting the self-report at face value
(the lesson from the Italian round). Ukrainian and Russian are related but
distinct languages (not mutually intelligible enough to reuse translations
wholesale) — translate from scratch into Ukrainian, do not derive from
`ru.js` the way Traditional Chinese was derived from Simplified.

## Technical Context

**Language/Version**: Vanilla JS/CSS/HTML — no build step, no framework, per the
app's zero-dependency constitution (v1.2.0).

**Primary Dependencies**: None. Google Fonts `<link>` is the only external network
call and is unaffected by this change.

**Storage**: N/A — `translations/uk.js` is itself the runtime source (lazily
loaded via `<script src>` into `LANG_DATA['uk']`, per Principle II), not a
staged intermediate.

**Testing**: No automated test suite exists for this app; verification is manual
browser use plus scripted JS-structural validation (`vm.runInNewContext`),
consistent with all prior language additions.

**Target Platform**: Any modern browser (client-side single HTML file, must
also work opened directly via `file://`).

**Project Type**: Single self-contained HTML file + first-party sibling files
(`style.css`, `content.js`, `translations/*.js`) — no frontend/backend split.

**Performance Goals**: N/A — one more lazily-loaded file has no load-time
impact until selected.

**Constraints**: Must not add a dependency (Principle I); must reuse the existing
i18n dictionary-swap engine (Principle II) rather than introduce a new mechanism.
Must not require RTL layout changes — Ukrainian is LTR.

**Scale/Scope**: One language — full `translations/uk.js` (`i18n` + `shell` +
8 `*Fmt` functions), all seventeen existing READMEs updated, one new
`README.uk.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Zero-Build, First-Party Files)**: PASS — `translations/uk.js`
  is a plain first-party file loaded via `<script src>`, no bundler/fetch.
- **Principle II (i18n-First UI Copy)**: PASS — Ukrainian added as a full
  `window.__LANG_UK__` object (`i18n`, `shell`, 8 format functions) consumed
  by the existing `loadLang`/`translateNode`/`applyAll` engine; no hardcoded
  strings introduced. Full current key set covered; dropdown and all
  seventeen READMEs updated in the same pass.
- **Principle III (Theme Parity)**: N/A — copy-only change, no layout/CSS touched.
- **Principle IV (Safe Large-Dictionary Edits)**: PASS — `translations/uk.js`
  is written whole by a script (not hand-typed line-by-line), validated via a
  case-sensitive re-parse for exact key-set parity, plus the pre-wiring
  under-translation diff gate. The only `Edit` touching `index.html` is the
  single `<option>` line — safe for the normal `Edit` tool per this skill's
  "No injection script needed anymore" note, not a large-dictionary edit.
- **Principle V (Documentation Currency)**: PASS — `CHANGELOG.md` updated;
  language list kept consistent across the app dropdown and all eighteen READMEs.

No violations — Complexity Tracking not needed.

## Project Structure

### Documentation (this feature, this language round)

```text
specs/001-add-language/
├── plan.md              # this file, scoped to Ukrainian (overwrites Thai's)
└── tasks.md             # Ukrainian-scoped task list (overwrites Thai's)
```

Prior rounds' plan.md/tasks.md remain recoverable via `git log` on `main` (PR #1,
#7, #13, #15, #16, #17, #18, #23, #25, #26, #27); per `spec.md`'s Assumptions, this
directory is one reused feature, not one spec per language, so regeneration per
round is expected.

No `research.md`/`data-model.md`/`contracts/` — not applicable to a
translation-and-wiring task, consistent with prior rounds.

### Source code (repository root)

```text
translations/uk.js            # new — window.__LANG_UK__, already in final,
                               # loaded form (fetch-language-dictionary output)
index.html                    # #lang-select <option> added only (after
                               # Русский, before ไทย — joins the existing
                               # Cyrillic group)
README.md, README.es.md,      # switch-link row + Features bullet updated
README.vi.md, README.zh-cn.md,
README.zh-tw.md, README.ja.md,
README.ko.md, README.pt.md,
README.fr.md, README.de.md,
README.hi.md, README.ru.md,
README.it.md, README.id.md,
README.ms.md, README.pl.md,
README.th.md
README.uk.md                  # new
CHANGELOG.md                  # entry added
SPEC_KIT_INTEGRATION_PLAN.md  # Ukrainian checked off in Tier 2 (remaining)
```

**Structure Decision**: Single-file app (plus first-party sibling files) — no
frontend/backend split applies. Per-language plan/tasks live in
`specs/001-add-language/` on this language's own branch
(`feat/add-ukrainian-language`), per the Assumptions note in `spec.md`.

## Complexity Tracking

Not applicable — no constitution violations.
