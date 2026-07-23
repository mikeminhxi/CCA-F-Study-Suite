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

No existing project files (`cca-f-study-suite.html`, the READMEs, `CHANGELOG.md`) were touched by this step.

**Verify:** confirmed `.specify/` and all `.claude/skills/speckit-*` directories exist; the two pre-existing project skills (`add-language`, `update-readme-languages`) were untouched by the merge.

## 3. Spec requirement (first workflow run)

Spec-kit needs a **constitution** before its first real spec, and a **spec** before a plan.

### 3a. Constitution — done

Because the newly-installed `speckit-constitution` skill wasn't indexed yet in the running session (it didn't exist until the `specify init` step above completed), it couldn't be invoked via the normal skill-dispatch path this turn. Its instructions were read directly from `.claude/skills/speckit-constitution/SKILL.md` and followed by hand instead: filled `.specify/memory/constitution.md`'s placeholders, added a Sync Impact Report, checked `plan-template.md`/`spec-template.md`/`tasks-template.md` for alignment (no edits needed — their Constitution Check gates are generic and resolved per-feature), and committed the result (commit `fc10742`) as **v1.0.0**, ratified 2026-07-24. Five principles: Zero-Dependency Single File, i18n-First UI Copy, Theme Parity, Safe Large-Dictionary Edits, Documentation Currency — plus sections on Language & Translation Conventions and the Development Workflow itself. On a fresh Claude Code session (where the skill is indexed), future amendments can go through `/speckit-constitution` directly.

### 3b. First feature spec — done

Given three options (A: formalize "add a new language"; B: split the single HTML file's i18n data out; C: a genuinely new feature), the maintainer picked **Option A**. Wrote `specs/001-add-language/spec.md` (three prioritized user stories — drop-in languages, RTL-script languages, and a verification-step story targeting two real mistakes made earlier this session) plus a passing quality checklist, following the `speckit-specify` skill's instructions by hand for the same session-indexing reason as the constitution step. `/speckit-plan` and `/speckit-tasks` for this feature are intentionally not yet run — each spec-kit stage is a checkpoint, not a batch.

## 4. Expected outcome

After steps 1–3, this repo gained:
```
.specify/
  memory/constitution.md       # from step 3a
  specs/001-add-language/
    spec.md                    # from step 3b
    checklists/requirements.md
.claude/skills/speckit-*/SKILL.md  # the workflow skills themselves
```
Going forward, feature work on the Study Suite follows: **constitution (once) → specify → (optional clarify) → plan → tasks → (optional analyze/checklist) → implement**, with each stage's output kept in the repo as a durable record — instead of the conversation-only planning this project used before. `CHANGELOG.md` keeps recording *what shipped*; `.specify/specs/**` records *why and how it was planned*.

## 5. Language expansion priority

Currently supported: English, Español, Tiếng Việt, 简体中文, 繁體中文, 日本語 (6).
Candidates below, in recommended order — rationale is developer/tech-market size
for a technical certification exam, weighed against added engineering effort
(not just translation volume). Check one off when you decide to pursue it;
run it through `specs/001-add-language/` — `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement` — which in turn draws on the `add-language` skill
(`.claude/skills/add-language/SKILL.md`) for the mechanical steps.

Each language addition should be done on its own feature branch with its own
pull request, not committed straight to `main` — see [Workflow note](#workflow-note-branch--pr-per-language)
below.

**Tier 1 — next up, no new engineering lift** (Latin or CJK script, same
mechanics as the six already done):

- [ ] Korean (한국어) — large tech/developer population; script complexity is
      comparable to Japanese, already solved.
- [ ] Portuguese, Brazil (Português) — large developer population; Latin
      script, same mechanics as Spanish/Vietnamese.
- [ ] French (Français) — Latin script, straightforward.
- [ ] German (Deutsch) — Latin script, straightforward.

**Tier 2 — good candidates, slightly smaller markets or newer script for this app:**

- [ ] Russian (Русский) — first Cyrillic-script language in the app; same
      mechanics as Latin/CJK (LTR, no layout changes), just a new alphabet.
- [ ] Italian (Italiano) — Latin script, straightforward, smaller market than Tier 1.

**Tier 3 — larger markets, but real engineering lift beyond translation:**

- [ ] Arabic (العربية) — RTL script. This app has **no RTL layout support
      today** (nav/tabs/badges assume LTR; no `dir="rtl"` handling anywhere).
      Adding Arabic means a layout-mirroring pass first, not just a dictionary.
- [ ] Hebrew (עברית) — same RTL caveat as Arabic; if both are wanted, do the
      RTL layout work once and cover both languages in the same pass.

**Not yet prioritized / needs a signal to justify** (from the original
brainstormed list — include if you have a specific reason, e.g. known exam-
candidate demand): Dutch, Greek, Swedish, Thai, Ukrainian.

## Workflow note: branch + PR per language

The maintainer wants each future language addition done on its own branch
with its own pull request (not committed straight to `main`, unlike the six
languages already shipped this way in earlier sessions). When running
`/speckit-plan` / `/speckit-tasks` for `specs/001-add-language/`, or the
`add-language` skill directly, create a branch named e.g.
`add-language-<code>` (matching the two-letter dictionary key, e.g.
`add-language-ko` for Korean) before starting the dictionary work, and open
a PR instead of pushing to `main` once it's done and verified.
