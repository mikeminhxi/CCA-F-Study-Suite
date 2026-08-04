# Spec-Kit Integration Plan — CCA-F Study Suite

## Recommendation

| Tool | Verdict | Why |
|---|---|---|
| **spec-kit** | **Adopt** | Explicitly requested. Gives this project a repeatable constitution → spec → plan → tasks → implement workflow for future feature work, instead of ad-hoc requests. |
| **github-mcp-server** | **Optional, defer** | Only pays off once spec-kit's `/speckit.taskstoissues` is actually used to push generated tasks to GitHub Issues, or PR/issue automation is wanted. Setup cost (Docker or Go build + a scoped PAT) isn't justified until that's a real need. |
| **context7** | **Skip** | Context7 looks up docs for external libraries/frameworks. This app is vanilla JS/CSS/SVG with zero runtime dependencies (only a Google Fonts `<link>`), so there is nothing for it to look up. Cheap to add later (`npx ctx7 setup`) if that ever changes. |

This plan covers **spec-kit only**. The other two are noted for later, not actioned now.

---

## 1. Preconditions

Things that must already be true before setup starts:

- [x] **Git repo is clean.** Committed the pending translation/theme/layout work (commit `4dc8216`) before running `specify init --force`, so it couldn't clobber in-progress work.
- [x] **Tooling available**: `uv 0.11.28` and `git 2.54.0` confirmed installed.
- [x] **Decide the integration target**: this session uses Claude Code, so spec-kit was initialized with `--integration claude`.
- [x] **No existing `.specify/` folder** in this repo (confirmed — none present), so `init --here` was a clean install rather than a merge.

## 2. Preparation steps — done

Run from this project's root — spec-kit is consumed as an installed CLI, not by copying files from an upstream source checkout:

```bash
# 1. Install the specify CLI (one-time, machine-wide)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 2. From inside this project's directory, scaffold spec-kit into it
specify init --here --integration claude --force --script sh < /dev/null
```

(The `< /dev/null` matters in a non-interactive shell — the first attempt hung indefinitely on an agent-selection prompt with no stdin attached, even though `--integration claude` was already passed. Closing stdin forces the CLI to fall back to the flag value instead of waiting for a keypress that will never come.)

This added to the repo (commit `fc10742`):

- `.specify/` — templates, memory (`constitution.md`), scripts.
- `.claude/skills/speckit-*/SKILL.md` — **not** `.claude/commands/speckit.*.md` as originally assumed. This installed version of spec-kit (0.14.1) ships its workflow as Claude Code **skills**, invoked as `/speckit-constitution`, `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement` (hyphens, not dots), plus optional `/speckit-clarify`, `/speckit-analyze`, `/speckit-checklist`, `/speckit-converge`, and `/speckit-taskstoissues`.

No existing project files (`index.html`, the READMEs, `CHANGELOG.md`) were touched by this step.

**Verify:** confirmed `.specify/` and all `.claude/skills/speckit-*` directories exist; the two pre-existing project skills (`add-language`, `update-readme-languages`) were untouched by the merge.

## 3. Spec requirement (first workflow run)

Spec-kit needs a **constitution** before its first real spec, and a **spec** before a plan.

### 3a. Constitution — done

Because the newly-installed `speckit-constitution` skill wasn't indexed yet in the running session (it didn't exist until the `specify init` step above completed), it couldn't be invoked via the normal skill-dispatch path this turn. Its instructions were read directly from `.claude/skills/speckit-constitution/SKILL.md` and followed by hand instead: filled `.specify/memory/constitution.md`'s placeholders, added a Sync Impact Report, checked `plan-template.md`/`spec-template.md`/`tasks-template.md` for alignment (no edits needed — their Constitution Check gates are generic and resolved per-feature), and committed the result (commit `fc10742`) as **v1.0.0**, ratified 2026-07-24. Five principles: Zero-Dependency Single File, i18n-First UI Copy, Theme Parity, Safe Large-Dictionary Edits, Documentation Currency — plus sections on Language & Translation Conventions and the Development Workflow itself. On a fresh Claude Code session (where the skill is indexed), future amendments can go through `/speckit-constitution` directly.

### 3b. First feature spec — done

Given three options (A: formalize "add a new language"; B: split the single HTML file's i18n data out; C: a genuinely new feature), the maintainer picked **Option A**. Wrote `specs/001-add-language/spec.md` (three prioritized user stories — drop-in languages, RTL-script languages, and a verification-step story targeting two real mistakes made earlier this session) plus a passing quality checklist, following the `speckit-specify` skill's instructions by hand for the same session-indexing reason as the constitution step. `/speckit-plan` and `/speckit-tasks` for `specs/001-add-language/` are intentionally reused per-language rather than re-run once — each language addition is its own pass through plan → tasks → implement against this same spec (see [§5](#5-language-expansion-priority)).

(Option B — splitting the i18n dictionaries out of `index.html` into fetched JSON files — was reconsidered later and explicitly declined: it would break the app's core "double-click and use fully offline" story, since browsers block `fetch()` of local files under `file://`. `translations/*.json` stays a staging/review artifact only, not a runtime source.)

### 3c. Second feature cycle — done

Ran the full **constitution → specify → plan → tasks → implement** cycle a second time, this time for a genuinely new feature rather than the language-addition spec: `specs/002-blueprint-taxonomy/` — restructuring the app's navigation around the official CCA-F exam blueprint (5 domains → 30 task statements → 59 concepts), replacing the earlier ad-hoc 7-phase/14-module structure. All artifacts (`spec.md`, `plan.md`, `tasks.md`, `data-model.md`, `research.md`, `quickstart.md`, `contracts/`, `checklists/`) landed in the repo and the feature shipped across PR #3 (restructure) and PR #4 (translate the new taxonomy into all 6 languages at the time). This confirms the spec-kit workflow generalizes beyond the language-addition use case it was first exercised on.

## 4. Expected outcome

After steps 1–3, this repo gained:
```
.specify/
  memory/constitution.md              # from step 3a
  specs/001-add-language/
    spec.md                           # from step 3b — reused per-language via plan/tasks/implement
    checklists/requirements.md
  specs/002-blueprint-taxonomy/       # from step 3c — a second, unrelated feature cycle
    spec.md, plan.md, tasks.md, data-model.md, research.md, quickstart.md, contracts/, checklists/
.claude/skills/speckit-*/SKILL.md     # the workflow skills themselves
```
Going forward, feature work on the Study Suite follows: **constitution (once) → specify → (optional clarify) → plan → tasks → (optional analyze/checklist) → implement**, with each stage's output kept in the repo as a durable record — instead of the conversation-only planning this project used before. `CHANGELOG.md` keeps recording *what shipped*; `.specify/specs/**` records *why and how it was planned*.

## 5. Language expansion priority

Currently supported: English, Français, Deutsch, Bahasa Indonesia, Italiano, Bahasa Melayu, Polski, Português, Español, Tiếng Việt, 简体中文, 繁體中文, 日本語, 한국어, हिन्दी, Русский, ไทย (17).
Candidates below, in recommended order — rationale is developer/tech-market size
for a technical certification exam, weighed against added engineering effort
(not just translation volume). Check one off when you decide to pursue it;
run it through `specs/001-add-language/` — `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement` — which in turn draws on the `fetch-language-dictionary`
(`.claude/skills/fetch-language-dictionary/SKILL.md`) and `add-language`
(`.claude/skills/add-language/SKILL.md`) skills, run in that order, for the
translation and mechanical-wiring steps respectively.

Each language addition should be done on its own feature branch with its own
pull request, not committed straight to `main` — see [Workflow note](#workflow-note-branch--pr-per-language)
below.

Translation generation and app-wiring are now two separate skills, run in
sequence: `fetch-language-dictionary` (translates the full key set — 715
`i18n` + 5 `shell` keys as of the last count; grows as the app does —
stages it at `translations/<code>.json`, never touches the app file) →
`add-language` (mechanical injection into `index.html`, the
dropdown, and the READMEs, sourced from that staged file). Splitting them
means a failed or reworked injection never forces re-translating from
scratch, the staged JSON is reviewable on its own before anything touches
the app file, and it rides along in the language's PR as a clean diff
of just the translations.

`translations/{vn,ja,zh,tw,es}.json` were originally backfilled (mechanical
extraction from the app, no translation) for the languages that predated the
staging-file convention; `pt.json`, `ko.json`, and `fr.json` were each staged
the normal way as part of those languages' own additions. All 8 non-English
shipped languages now have a staged file — the schema isn't just for new
languages going forward.
For a derived-script pair added together from scratch (e.g. a hypothetical
fresh Simplified+Traditional Chinese addition), run `fetch-language-dictionary`
for the base script first, then again for the derived script sourced from
that just-staged file — see the skill's script-conversion section.

**Tier 1 — no new engineering lift** (Latin or CJK script, same
mechanics as the languages already shipped):

- [x] Korean (한국어) — large tech/developer population; script complexity is
      comparable to Japanese, already solved. Shipped in PR #1.
- [x] Portuguese, Brazil (Português) — large developer population; Latin
      script, same mechanics as Spanish/Vietnamese. Shipped in PR #7.
- [x] French (Français) — Latin script, straightforward. Shipped in PR #13.
- [x] German (Deutsch) — Latin script, straightforward. Shipped in PR #15.

**Tier 2 — good candidates, slightly smaller markets or newer script for this app:**

- [x] Hindi (हिन्दी) — India has one of the largest and fastest-growing
      developer populations in the world (GitHub's own Octoverse reports have
      cited it as the #2 or fastest-growing developer nation) — a bigger
      tech-market gap than anything else currently in this tier. Devanagari
      script: not RTL, so no layout-mirroring work like Arabic/Hebrew, just a
      new (non-Latin, non-CJK) alphabet. Shipped in PR #16 — the app's first
      non-Latin, non-CJK script; established a new trailing-script-group
      ordering precedent for the dropdown/READMEs (script-family groups are
      appended in the order introduced — Latin, then CJK, then Devanagari —
      rather than merged alphabetically into an existing group; see
      `specs/001-add-language/plan.md`'s dropdown-ordering note from that
      round for the full rationale).
- [x] Russian (Русский) — first Cyrillic-script language in the app; same
      mechanics as Latin/CJK (LTR, no layout changes), just a new alphabet.
      Shipped in PR #17. Reused the Hindi round's trailing-script-group
      ordering precedent as-is (no new maintainer decision needed). Also
      introduced a standing quality gate for all future rounds: diff the
      staged dictionary's English-word-overlap against a known-complete
      sibling (`de.json`) *before* injecting into `index.html`, added after
      the Hindi round shipped with 148 under-translated keys that needed a
      costly post-hoc fix.
- [x] Italian (Italiano) — Latin script, straightforward, smaller market than
      Tier 1. Shipped in PR #18. Introduced a lesson for the standing
      pre-injection quality gate (added in the Russian round): a translating
      agent verifying its own under-translation self-check is prone to
      rationalizing genuine gaps as acceptable exceptions — this round's agent
      wrongly waved through 26 untranslated instances of "context" as
      exceptions without actually checking the German sibling, caught only by
      manually spot-checking its residual list rather than trusting the
      self-report. Future rounds should keep doing that manual spot-check, not
      just re-running the agent's own gate.
- [x] Indonesian (Bahasa Indonesia) — large, fast-growing Southeast Asian tech
      market; Latin script, trivial engineering. Shipped in PR #23.
- [x] Malay (Bahasa Melayu) — Malaysia's national language; Latin script,
      trivial engineering, same mechanics as Indonesian. Closely related to
      Bahasa Indonesia (both Malayic languages) but a distinct standardized
      language with its own vocabulary/spelling conventions, not a dialect
      to be merged with the Indonesian dictionary. Shipped in PR #25.
- [x] Polish (Polski) — major IT-outsourcing/dev-shop hub in Europe; Latin
      script, trivial engineering. Shipped in PR #26.
- [x] Thai (ไทย) — sizeable Southeast Asian tech market; picked up from the
      "not yet prioritized" list at the maintainer's request. Thai script:
      not RTL, so same mechanics as Hindi/Russian — a new (non-Latin,
      non-CJK, non-Devanagari, non-Cyrillic) alphabet, no layout-mirroring
      work needed. Google Fonts loaded by the app (Space Grotesk, Inter,
      JetBrains Mono) don't cover Thai glyphs, same as they don't cover
      CJK/Devanagari/Cyrillic either — browser system-font fallback already
      handles this for every non-Latin language shipped so far, so no font
      changes anticipated. Becomes a new trailing script-family group in the
      dropdown/READMEs, appended after Cyrillic (Русский) per the Hindi
      round's ordering precedent (script groups appended in the order
      introduced, not merged alphabetically).

**Tier 3 — larger markets, but real engineering lift beyond translation:**

- [ ] Arabic (العربية) — RTL script. This app has **no RTL layout support
      today** (nav/tabs/badges assume LTR; no `dir="rtl"` handling anywhere).
      Adding Arabic means a layout-mirroring pass first, not just a dictionary.
- [ ] Hebrew (עברית) — same RTL caveat as Arabic; if both are wanted, do the
      RTL layout work once and cover both languages in the same pass.

**Not yet prioritized / needs a signal to justify** (from the original
brainstormed list — include if you have a specific reason, e.g. known exam-
candidate demand): Dutch, Greek, Swedish, Ukrainian.

## Workflow note: branch + PR per language

The maintainer wants each future language addition done on its own branch
with its own pull request (not committed straight to `main`, unlike the six
languages already shipped this way in earlier sessions). When running
`/speckit-plan` / `/speckit-tasks` for `specs/001-add-language/`, or the
`fetch-language-dictionary` / `add-language` skills directly, create a
branch named `feat/add-<language>-language` (spelled-out language name, not
the two-letter code — e.g. `feat/add-korean-language`) before starting the
dictionary work, and open a PR instead of pushing to `main` once it's done
and verified.
