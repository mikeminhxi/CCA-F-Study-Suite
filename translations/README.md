# translations/

Staged, per-language dictionary files produced by the `fetch-language-dictionary`
Claude Code skill, before they're wired into `index.html` by the
`add-language` skill.

Each `<code>.json` here is the full 531-key translated dictionary (526
`__I18N_XX__` entries + 5 `__SHELL_XX__` entries) plus the metadata needed to
wire it in (`qsUnit`, `noSpaceBeforeUnit`, `questionFmt`, `nativeName`,
`sortHint`) — see `.claude/skills/fetch-language-dictionary/SKILL.md` for the
exact shape.

These files are kept, not deleted, after a language ships: they're the
easiest way to review or correct a language's translations without wading
through the in-app dictionary, and they let a future fix re-run just the
injection step instead of re-translating from scratch.
