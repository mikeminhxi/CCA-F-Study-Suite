# Phase 1 Data Model: Blueprint Taxonomy Restructure

All structures live inline in `cca-f-study-suite.html`'s data `<script>`
(~line 4413). No database, no external files.

## Entities & shapes

### Domain (`DOMAIN_INFO`, existing — labels updated)

```
D#: { label: <official name>, weight: "<pct>%", color: "<hex>" }
```

- 5 domains, ordered D1→D5 by weight. The synthetic `MIX` entry is **removed**.
- Official labels (updated from current): D1 "Agentic Architecture",
  D2 "Tool Design & MCP", D3 "Claude Code & Workflows",
  D4 "Prompt Engineering & Output", D5 "Context & Reliability".
- Weights already correct: 27 / 18 / 20 / 20 / 15.

### Task Statement (`TASK_STATEMENTS`, NEW)

```
{ id: "ts-1.1", domain: "D1", title: "<verbatim objective>" }
```

- 30 entries. `domain` MUST equal `"D" + id.charAt(3)` (validation rule).
- Per-domain counts: D1=7, D2=5, D3=6, D4=6, D5=6.

### Concept (`CONCEPTS`, NEW)

```
{ id: "<slug>", ts: "ts-1.1", domain: "D1",
  title: "<verbatim>", insight: "<one-line core insight>",
  level: "Foundation" | "Intermediate" | "Advanced" }
```

- 59 entries. `ts` MUST exist in `TASK_STATEMENTS`; `domain` MUST match that
  task statement's domain.
- Per-domain counts: D1=12, D2=8, D3=10, D4=14, D5=15.

### Question (`QDATA`, existing — one field added)

```
{ id, sec, q, o:{A,B,C,D}, a, w, c, dup, conflict, ts: "ts-X.Y" }   // +ts
```

- 157 entries. Each gains exactly one `ts` drawn from the 30 (FR-003).
- `id` is unchanged (preserves saved progress, FR-013).
- `c` (old module name) may be retained as a legacy label or dropped; domain is
  now derived from `ts`, not from `c` via `MODULE_DOMAIN` (which is deleted).

### Derived indexes (computed once, like the existing `MODS`)

- `Q_BY_TS`: `{ "ts-X.Y": [question, …] }`
- `TS_BY_DOMAIN`: `{ "D#": [taskStatement, …] }`
- `CONCEPTS_BY_TS`: `{ "ts-X.Y": [concept, …] }`

## Retired structures

- `PHASES[]` (7 phases) — removed.
- `MODULE_DOMAIN{}` (14-module → domain map) — removed.
- `MODS` index — removed or repurposed once study/quiz read `Q_BY_TS`.
- Kept as-is (orthogonal): `RULES` (decision table), `CORE` (6 principle cards),
  `domains[]`/`synapses[]` of the Neuron Map (leaves re-pointed to task
  statements, structure unchanged).

## The 30 task statements (authoritative titles)

**D1 — Agentic Architecture (27%)**
- ts-1.1 Design and implement agentic loops for autonomous task execution
- ts-1.2 Orchestrate multi-agent systems with coordinator-subagent patterns
- ts-1.3 Configure subagent invocation, context passing, and spawning
- ts-1.4 Implement multi-step workflows with enforcement and handoff patterns
- ts-1.5 Apply Agent SDK hooks for tool call interception and data normalization
- ts-1.6 Design task decomposition strategies for complex workflows
- ts-1.7 Manage session state, resumption, and forking

**D2 — Tool Design & MCP (18%)**
- ts-2.1 Design effective tool interfaces with clear descriptions and boundaries
- ts-2.2 Implement structured error responses for MCP tools
- ts-2.3 Distribute tools across agents and configure tool choice
- ts-2.4 Integrate MCP servers into Claude Code and agent workflows
- ts-2.5 Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob)

**D3 — Claude Code & Workflows (20%)**
- ts-3.1 Configure CLAUDE.md files with hierarchy, scoping, and modular organization
- ts-3.2 Create and configure custom slash commands and skills
- ts-3.3 Apply path-specific rules for conditional convention loading
- ts-3.4 Determine when to use plan mode vs direct execution
- ts-3.5 Apply iterative refinement techniques for progressive improvement
- ts-3.6 Integrate Claude Code into CI/CD pipelines

**D4 — Prompt Engineering & Output (20%)**
- ts-4.1 Design prompts with explicit criteria to improve precision
- ts-4.2 Apply few-shot prompting to improve output consistency and quality
- ts-4.3 Enforce structured output using tool use and JSON schemas
- ts-4.4 Implement validation, retry, and feedback loops for extraction quality
- ts-4.5 Design efficient batch processing strategies
- ts-4.6 Design multi-instance and multi-pass review architectures

**D5 — Context & Reliability (15%)**
- ts-5.1 Manage conversation context across long interactions
- ts-5.2 Design escalation and ambiguity resolution patterns
- ts-5.3 Implement error propagation strategies across multi-agent systems
- ts-5.4 Manage context effectively in large codebase exploration
- ts-5.5 Design human review workflows and confidence calibration
- ts-5.6 Preserve information provenance and handle uncertainty in synthesis

## Concept data — fidelity note (implementation step)

The 59 concept titles, one-line insights, and levels were captured from the
five prepgenaicerts.com domain pages during planning, but via a summarizing
fetch. **Before transcribing `CONCEPTS[]` into the app, re-read each of the
five domain pages to confirm each concept's verbatim title, insight wording,
its parent task statement, and its level** (Foundation/Intermediate/Advanced).
Per-domain counts to hit: D1=12, D2=8, D3=10, D4=14, D5=15 (total 59). This
verification is the first task of implementation Phase 1, before any app edit.
