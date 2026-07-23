# Spec-Kit Integration Plan — CCA-F Study Suite

## Recommendation

| Tool | Verdict | Why |
|---|---|---|
| **spec-kit** (`D:\Projects\spec-kit`) | **Adopt** | Explicitly requested. Gives this project a repeatable constitution → spec → plan → tasks → implement workflow for future feature work, instead of ad-hoc requests. |
| **github-mcp-server** (`D:\Projects\github-mcp-server`) | **Optional, defer** | Only pays off once spec-kit's `/speckit.taskstoissues` is actually used to push generated tasks to GitHub Issues, or PR/issue automation is wanted. Setup cost (Docker or Go build + a scoped PAT) isn't justified until that's a real need. |
| **context7** (`D:\Projects\context7`) | **Skip** | Context7 looks up docs for external libraries/frameworks. This app is vanilla JS/CSS/SVG with zero runtime dependencies (only a Google Fonts `<link>`), so there is nothing for it to look up. Cheap to add later (`npx ctx7 setup`) if that ever changes. |

This plan covers **spec-kit only**. The other two are noted for later, not actioned now.

---

## 1. Preconditions

Things that must already be true before setup starts:

- [ ] **Git repo is clean.** `git status` shows no uncommitted changes worth losing (spec-kit's `init --force` writes into the current directory and should not clobber in-progress work). At the time of writing, the working tree has substantial uncommitted translation/theme/layout work — **commit or stash that first**, independent of this plan.
- [ ] **Tooling available**: `uv` (Python package/tool manager), Python 3.11+, and Git are installed on this machine. `uv` is not confirmed installed yet — verify with `uv --version` before proceeding; install from https://docs.astral.sh/uv/ if missing.
- [ ] **Decide the integration target**: this session uses Claude Code, so spec-kit will be initialized with `--integration claude`.
- [ ] **No existing `.specify/` folder** in this repo (confirmed — none present), so `init --here` will be a clean install rather than a merge.

## 2. Preparation steps

Run from `D:\Projects\CCA-F-Study-Suite` (this project), not from `D:\Projects\spec-kit` (that's just the upstream source checkout — spec-kit is consumed as an installed CLI, not by copying its repo files in):

```bash
# 1. Install the specify CLI (one-time, machine-wide)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 2. From inside this project's directory, scaffold spec-kit into it
cd D:\Projects\CCA-F-Study-Suite
specify init --here --integration claude --force
```

This adds to the repo:
- `.specify/` — templates, memory (constitution lives here once created), scripts.
- `.claude/commands/speckit.*.md` — the slash commands below become available in Claude Code.

No existing project files (`cca-f-study-suite.html`, the READMEs, `CHANGELOG.md`) are touched by this step.

**Verify:** re-open Claude Code in this project and confirm `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, and `/speckit.implement` are available.

## 3. Spec requirement (first workflow run)

Spec-kit needs a **constitution** before its first real spec, and a **spec** before a plan. Recommended first pass:

### 3a. Constitution
Run once, capturing constraints this project already lives by (derived from the existing READMEs/CHANGELOG, not invented):
```
/speckit.constitution Single self-contained HTML file, no build step, no server, no external
JS dependencies (only Google Fonts). All UI copy must go through the i18n dictionary system
(window.__I18N_XX__ + the TreeWalker translation engine) — no hardcoded English strings that
bypass translation. Every new language addition must cover all six language dictionaries
(EN implicit, VN, JA, ZH, TW, ES) and update all six READMEs' switch-links. Visual changes
must be checked in both Light and Dark theme. Large edits to the inline JS dictionaries
should go through Node scripts (per CLAUDE.md precedent), not manual Edit calls, since several
lines exceed 30KB in a single line.
```

### 3b. First feature spec — candidate, needs your confirmation
This plan doesn't invent a feature to build. Pick one (or supply your own) before running `/speckit.specify`:

- **Option A — Formalize the "add a new language" process.** Turn the manual translation workflow from this session into a spec-kit spec/plan/tasks sequence, so adding language #7 next time is `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement` instead of ad-hoc back-and-forth.
- **Option B — Split the single HTML file's data.** Revisit the earlier "should we separate the i18n data into its own file" discussion as a proper spec (tradeoffs: portability vs. editability), since that decision was deferred, not resolved.
- **Option C — A genuinely new feature** (e.g., a progress-export/sync feature, a printable cheat-sheet view, additional exam-domain content) — whatever you actually want next.

## 4. Expected outcome

After steps 1–3, this repo gains (nothing here exists yet):
```
.specify/
  memory/constitution.md       # from step 3a
  specs/<NNN>-<feature>/
    spec.md                    # from /speckit.specify
    plan.md                    # from /speckit.plan
    tasks.md                   # from /speckit.tasks
.claude/commands/speckit.*.md  # the slash commands themselves
```
Going forward, feature work on the Study Suite follows: **constitution (once) → specify → (optional clarify) → plan → tasks → (optional analyze/checklist) → implement**, with each stage's output kept in the repo as a durable record — instead of the conversation-only planning this project has used so far. `CHANGELOG.md` keeps recording *what shipped*; `.specify/specs/**` starts recording *why and how it was planned*.

## 5. Language expansion priority

Currently supported: English, Español, Tiếng Việt, 简体中文, 繁體中文, 日本語 (6).
Candidates below, in recommended order — rationale is developer/tech-market size
for a technical certification exam, weighed against added engineering effort
(not just translation volume). Check one off when you decide to pursue it;
use the `add-language` skill (`.claude/skills/add-language/SKILL.md`) to run
it, ideally via `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` →
`/speckit.implement` once spec-kit is set up (see Option A above).

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

## Open question for you

Which of Option A / B / C (or something else) should the first real `/speckit.specify` target?
