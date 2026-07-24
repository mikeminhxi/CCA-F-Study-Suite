# Contract: In-file taxonomy data shapes

This single-file app has no external API. Its "contracts" are the shapes of the
in-file data structures the render functions depend on, plus the tab contract.
Downstream code (render functions, the translation follow-up) relies on these.

## `TASK_STATEMENTS` (array of 30)

| Field | Type | Rule |
|---|---|---|
| `id` | string | matches `^ts-[1-5]\.[1-9]$`; unique |
| `domain` | string | `"D" + id.charAt(3)`; one of D1–D5 |
| `title` | string | non-empty; English source (translatable key) |

## `CONCEPTS` (array of 59)

| Field | Type | Rule |
|---|---|---|
| `id` | string | unique slug |
| `ts` | string | exists in `TASK_STATEMENTS` |
| `domain` | string | equals the parent task statement's `domain` |
| `title` | string | non-empty; translatable key |
| `insight` | string | non-empty one-liner; translatable key |
| `level` | enum | one of `Foundation` \| `Intermediate` \| `Advanced` |

## `QDATA[].ts` (added field, 157 questions)

| Field | Type | Rule |
|---|---|---|
| `ts` | string | exists in `TASK_STATEMENTS`; exactly one per question |

Domain of a question = `"D" + q.ts.charAt(3)`. No independent question→domain map.

## Tab contract

`#tabs` view keys extend from `{path, cheat, study, quiz}` to
`{path, cheat, study, quiz, concepts}`. The `views` map and the tab-click
handler MUST include `concepts → v-concepts`. All tab labels are translatable
keys (English source).

## i18n contract (English-first)

Every new user-visible string (task-statement titles, concept titles, insights,
tab label, section labels) is emitted as English text that flows through the
TreeWalker `translateNode` engine — i.e. it is a dictionary *key*. For the 6
non-English languages, the key is absent this pass and MUST fall back to the
English source with no console error (existing engine behavior). No new string
may be rendered outside the translation layer (no `data-noi18n` on new copy
unless it is a proper noun/code token, consistent with existing usage).

## Validation (must hold after implementation)

- `TASK_STATEMENTS.length === 30`, per-domain 7/5/6/6/6.
- `CONCEPTS.length === 59`, per-domain 12/8/10/14/15; every `ts` resolvable.
- All 157 `QDATA[].ts` present and in-range; per-domain distribution reported.
- All 6 in-app dictionaries still parse as valid JSON (case-sensitive).
