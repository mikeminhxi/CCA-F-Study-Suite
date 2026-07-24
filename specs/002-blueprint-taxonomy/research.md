# Phase 0 Research: Blueprint Taxonomy Restructure

No open `NEEDS CLARIFICATION` items — the design forks were resolved by owner
decision during planning. This file records the decisions and their rationale.

## Decision 1 — Domain is derived from the task-statement id, not stored separately

- **Decision**: A question stores only a `ts` tag (`ts-1.1`…`ts-5.6`); its
  domain is computed as `'D' + ts.slice(3,4)`. `TASK_STATEMENTS[]` carries the
  authoritative `domain` per task statement; `CONCEPTS[]` carries `ts` (and, for
  convenience, `domain`).
- **Rationale**: Eliminates the class of bug that made the *old* app diverge
  from the blueprint — a separate `MODULE_DOMAIN` map that could (and did) put
  error-propagation under D2 instead of D5. One source of truth = no drift.
- **Alternatives considered**: Keep an explicit per-question `domain` field
  (rejected: redundant, can desync from `ts`). Keep the module concept as an
  intermediate layer (rejected: it's exactly what we're replacing).

## Decision 2 — Neuron Map leaves = task statements, not concepts

- **Decision**: Replace each domain's hand-picked `leaves` in the Neuron Map
  `domains[]` structure with that domain's **task statements** (~5–7 per
  domain), re-pointing `synapses` to task-statement ids. Concepts are surfaced
  in the new Concept library instead.
- **Rationale**: The radial layout was tuned (per CHANGELOG) for ~6–7 leaves
  per domain. 59 concepts (up to 15 in one domain) would overcrowd and
  regress the layout. Task statements preserve current leaf density.
- **Alternatives considered**: All 59 concepts as leaves (rejected: layout
  breakage). A curated concept subset (rejected: arbitrary, and task statements
  are the natural mid-tier node).

## Decision 3 — Mixed / Applied as a filter, not a domain

- **Decision**: Tag every currently-"mixed" question to a best-fit single task
  statement. Provide a non-domain "Mixed / Applied" study/quiz filter (a saved
  multi-ts selection) for exam-style breadth.
- **Rationale**: The blueprint has exactly 5 domains and no "mixed" bucket;
  a 6th synthetic domain would misrepresent the exam. A filter gives the same
  cross-cutting practice without corrupting the taxonomy.
- **Alternatives considered**: Keep the `MIX` pseudo-domain (rejected: not in
  blueprint, pollutes per-domain math). Multi-tag questions (rejected: FR-002
  requires exactly one task statement per question; multi-tag complicates
  progress math and pool dedup).

## Decision 4 — Learning Path in blueprint weight order (D1→D5)

- **Decision**: Order the Learning Path by exam weight, D1 (27%) → D5 (15%).
- **Rationale**: Domains are now primary; the exam is organized and weighted
  this way, so weight-order matches the mental model and puts the heaviest,
  highest-yield material first. The old "easiest-foundations-first" phase order
  was a property of the retired phase structure.
- **Alternatives considered**: Preserve a pedagogical easiest-first ordering
  (rejected as default; may be revisited as an optional "suggested order" hint).

## Decision 5 — Concept library as a new Study Console tab

- **Decision**: Add `concepts` as a fifth top-tab in the Study Console
  (`path` / `cheat` / `study` / `quiz` / `concepts`).
- **Rationale**: It's taxonomy navigation and belongs next to the other
  taxonomy-driven views; the Study Hub is a separate hand-authored reference
  tool with a different layout idiom.
- **Alternatives considered**: A Study Hub section (rejected: different layout
  system, further from the study/quiz flows learners use it alongside).

## Decision 6 — English-first delivery

- **Decision**: Ship the ~150 new strings in English only this pass; translate
  to the 6 other languages as a follow-up via `fetch-language-dictionary`.
- **Rationale**: Owner priority is a working, verifiable restructure now. The
  text-swap engine falls back to English for any missing key, so non-English
  users keep a functioning app with zero console errors (FR-012). New strings
  still flow through the i18n layer, so the follow-up is pure translation with
  no re-plumbing.
- **Alternatives considered**: Translate everything in one pass (declined by
  owner — multiplies change size, delays a testable app).

## Decision 7 — Question re-tagging: reviewable table first, scripted apply

- **Decision**: Produce a `question-id → ts` mapping as a standalone JSON in
  scratchpad (first-pass heuristic from the old module `q.c`, then per-question
  review), sanity-check the per-ts/per-domain distribution, then apply it to
  `QDATA` via a brace-depth-aware PowerShell JSON script.
- **Rationale**: 157 individual judgments are the riskiest part; isolating the
  classification as reviewable data (before touching the 600KB app file)
  matches Constitution Principle IV and makes the tagging auditable.
- **Alternatives considered**: Inline manual edits (rejected: violates
  Principle IV, unauditable). Pure module→ts mechanical map with no per-question
  review (rejected: task statements are finer than modules; many questions
  under one module split across several task statements).
