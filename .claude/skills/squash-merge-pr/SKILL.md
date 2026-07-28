---
name: squash-merge-pr
description: Squash-merge a pull request in the CCA-F Study Suite repo with a properly crafted commit message, following this project's conventions (conventional-commit type prefix + #N suffix title, body bullets that preserve what the squash would otherwise erase). Use whenever asked to squash-merge a PR in this project, or to draft/recommend a squash commit message for one.
---

# Squash-merge a PR (CCA-F Study Suite)

This project squash-merges PRs with a **crafted** commit message, not GitHub's
auto-filled list of commit subjects. A squashed PR collapses many small,
focused commits into one — the message is the only place left afterward to
carry forward the "why," not just the "what," so it needs to actually be
written, not defaulted.

This skill covers **message crafting**. For the surrounding process — blocker
checks (conflicts, failing checks, review status, overlapping PRs), asking
which merge method to use, and posting a merge summary comment — use the
general-purpose `merge-pr` skill if available; this skill supplies the
message that step should use instead of GitHub's default.

## Step 1 — Read everything the PR actually did

Don't draft from the PR title/description alone — read the real commit list
and diff, since that's where the substance is:

```bash
gh pr view <number> --json title,body,commits,additions,deletions,changedFiles
gh pr view <number> --json commits --jq '.commits[].messageHeadline'
```

Look specifically for things a squash would otherwise bury:
- The core deliverable (what actually shipped).
- Any **process or convention change** (new rules, renamed patterns, new
  required steps) — these are easy to lose once buried in commit #4 of 7.
- **Bugs found and fixed during the work itself** (not pre-existing bugs
  fixed as the PR's main point — genuinely-discovered-along-the-way fixes).
- **Explicitly flagged follow-ups or known gaps** left out of scope — if a
  commit message says "not fixed here, flagged for later," that sentence
  needs to survive into the squash message or it effectively disappears.

Skip pure mechanical noise (formatting fixups, "oops typo," intermediate
commits that got superseded later in the same PR).

## Step 2 — Pick the type prefix

Match the actual precedent in this repo's `main` history — the type
reflects the PR's *nature*, not its size:

- **`feat:`** — adds a new capability (a new language, a new feature, a new
  skill that does something the project couldn't do before).
- **`chore:`** — mechanical/maintenance work with no new capability
  (backfilling data files, refactoring, tooling housekeeping, dependency
  bumps).
- **`fix:`** — the PR's main point is correcting a bug.
- **`docs:`** — documentation-only changes.

If a PR is mixed (e.g. a feature plus a process-rule change, as with the
Korean language PR), pick the type for the *primary* deliverable — the body
bullets carry the secondary changes.

## Step 3 — Format the title

```
<type>: <Title, sentence case, imperative or descriptive, ~50-70 chars> #<PR-number>
```

- No parentheses around `#<PR-number>` — matches this repo's actual merged
  history (`chore: Backfill translations/*.json for existing languages #2`),
  not GitHub's own default `(#N)` format.
- Keep it to one line; put everything else in the body.

## Step 4 — Write the body as bullets, not prose

One bullet per substantive fact from Step 1. Each bullet should be able to
stand alone if someone finds it via `git blame` months later with zero other
context. Prioritize in this order: core deliverable → process/convention
changes → bugs found+fixed → flagged follow-ups. Cut anything a future reader
wouldn't need (intermediate/superseded work, restating the title).

## Step 5 — Merge

```bash
gh pr merge <number> --squash --subject "<type>: <title> #<number>" --body "$(cat <<'EOF'
- <bullet 1>
- <bullet 2>
...
EOF
)"
```

Confirm the subject/body with the user before running this — merging is a
shared-state, hard-to-reverse action (per `merge-pr`'s own standing rule),
and a squash commit message is effectively permanent once it lands on `main`.

## Step 6 — Clean up the branch

Once the merge succeeds, delete the now-merged branch and sync local state
so it doesn't linger as stale clutter:

```bash
git checkout main
git pull --ff-only origin main
git branch -d <branch-name>
git push origin --delete <branch-name>
git fetch origin --prune
```

`git branch -d` (not `-D`) is deliberate — it refuses to delete if the local
branch isn't actually merged into your current HEAD, which is a useful
sanity check that the fast-forward above actually happened. The final
`--prune` clears out any other remote-tracking refs (`origin/<branch>`) for
branches already deleted on the remote, so `git branch -a` stays an accurate
picture of what's really open instead of accumulating dead references.

## Example

From this project's actual Korean-language PR:

```
feat: Add Korean (한국어) as the 7th supported language #1

- Full 531-key dictionary translated and staged at translations/ko.json
  via the new fetch-language-dictionary skill, then wired into
  index.html (MAPS/SHELLS/QS_UNIT/QUESTION_FMT), the
  #lang-select dropdown, and all six existing READMEs. Added README.ko.md.
- Verified against the real app with Playwright (newly installed in this
  environment): zero console errors, all core UI renders correctly in
  Korean. Fixed one bug found during verification — the question counter
  read "1 / 15문항 중"; now reads "문항 1 / 15", matching the other
  languages' pattern.
- Established a new process rule: every future language addition must go
  through one spec-kit round (/speckit-plan -> /speckit-tasks) before
  fetch-language-dictionary/add-language run — codified as FR-009 in
  specs/001-add-language/spec.md and enforced by both skills.
- Flagged (not fixed here) a pre-existing, cross-language i18n gap found
  during verification: domain names, phase titles, and quiz module toggle
  button text were never wired into any language's dictionary — affects
  all seven languages equally, tracked as a follow-up in tasks.md.
```
