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

## The 59 concepts (authoritative — T001 fidelity pass complete)

Re-fetched from the five domain pages. `id` slugs are assigned for the app
(`CONCEPTS[].id`). Counts verified: D1=12, D2=8, D3=10, D4=14, D5=15 = 59.

### D1 — Agentic Architecture (12)

| id | ts | title | level | insight |
|---|---|---|---|---|
| c-agentic-loop | ts-1.1 | Agentic Loop Lifecycle | Foundation | stop_reason is the ONLY reliable signal for agentic loop control |
| c-tool-use-flow | ts-1.1 | Tool Use Flow & Mechanics | Foundation | Tool use follows a define → select → execute → return cycle |
| c-coordinator-subagent | ts-1.2 | Coordinator-Subagent (Orchestrator) Pattern | Intermediate | All communication flows through the coordinator (hub-and-spoke) |
| c-narrow-decomp-risk | ts-1.2 | Narrow Decomposition Risk | Intermediate | Narrow task decomposition causes incomplete results even when all subtasks succeed |
| c-task-tool | ts-1.3 | Subagent Invocation & the Task Tool | Intermediate | The Task tool spawns subagents; allowedTools must include 'Task' for the coordinator |
| c-agentdefinition | ts-1.3 | AgentDefinition Configuration | Advanced | AgentDefinition includes description, system prompt, and tool restrictions per subagent type |
| c-workflow-enforcement | ts-1.4 | Multi-Step Workflow Enforcement | Intermediate | Programmatic prerequisites are more reliable than prompt-based ordering |
| c-workflow-orchestration | ts-1.4 | Multi-Step Workflow Orchestration | Advanced | Decompose multi-concern requests and investigate in parallel |
| c-posttooluse-hooks | ts-1.5 | Agent SDK Hooks: PostToolUse & Interception | Intermediate | PostToolUse hooks normalize tool output before the agent processes it |
| c-decomp-routing | ts-1.6 | Task Decomposition & Routing Strategies | Intermediate | Use prompt chaining for predictable workflows, dynamic decomposition for open-ended tasks |
| c-adaptive-vs-fixed | ts-1.6 | Adaptive vs Fixed Decomposition | Advanced | Fixed pipelines for predictable workflows; adaptive decomposition for exploration |
| c-session-state | ts-1.7 | Session State & Resumption | Intermediate | Use --resume <session-name> to continue named investigation sessions |

### D2 — Tool Design & MCP (8)

| id | ts | title | level | insight |
|---|---|---|---|---|
| c-tool-descriptions | ts-2.1 | Tool Definitions & Descriptions | Foundation | Tool descriptions are the #1 lever for tool selection accuracy |
| c-tool-selection-debug | ts-2.1 | Tool Selection Reliability & Debugging | Intermediate | Diagnose tool selection issues: descriptions first, then system prompt, then examples |
| c-structured-errors | ts-2.2 | Structured Error Response Design | Intermediate | Use the MCP isError flag to distinguish tool failures from successful empty results |
| c-retry-patterns | ts-2.2 | Error Recovery & Retry Patterns | Advanced | Structured isRetryable metadata prevents wasted retry attempts on non-retryable errors |
| c-least-privilege | ts-2.3 | Tool Distribution & Least Privilege | Intermediate | Each agent should have only the tools needed for its specific role (4-5 tools, not 18) |
| c-mcp-scoping | ts-2.4 | MCP Server Configuration & Scoping | Intermediate | Use project-scoped .mcp.json for team tools, user-scoped ~/.claude.json for personal tools |
| c-community-vs-custom | ts-2.4 | Community vs Custom MCP Servers | Advanced | Use community MCP servers for standard integrations; build custom only for team-specific needs |
| c-builtin-tools | ts-2.5 | Built-in Claude Code Tools | Foundation | Grep searches file contents; Glob finds files by name pattern — don't confuse them |

### D3 — Claude Code & Workflows (10)

| id | ts | title | level | insight |
|---|---|---|---|---|
| c-claudemd-hierarchy | ts-3.1 | CLAUDE.md Configuration Hierarchy | Foundation | Project CLAUDE.md is loaded for every conversation; user-level has lowest priority |
| c-claudemd-import | ts-3.1 | Modular CLAUDE.md with @import | Foundation | @import lets each package selectively include relevant standards files |
| c-skills-commands | ts-3.2 | Custom Skills & Slash Commands | Foundation | Project skills/commands live in .claude/ (version-controlled, team-wide); personal ones in ~/.claude/ |
| c-skill-frontmatter | ts-3.2 | Skill Frontmatter Configuration | Intermediate | context: fork isolates skill execution from main conversation |
| c-path-rules | ts-3.3 | Path-Specific Rules (.claude/rules/) | Foundation | Use .claude/rules/ with glob patterns for file-type-specific conventions |
| c-plan-vs-direct | ts-3.4 | Plan Mode vs Direct Execution | Foundation | Use plan mode for ambiguous requirements with multiple valid approaches |
| c-iterative-refinement | ts-3.5 | Iterative Refinement Techniques | Foundation | Concrete input/output examples beat prose descriptions for communicating transformations |
| c-tdd-interview | ts-3.5 | Test-Driven Iteration & Interview Pattern | Advanced | Test failures are unambiguous feedback — more effective than prose review |
| c-cicd-integration | ts-3.6 | CI/CD Integration with Claude Code | Foundation | Use -p (--print) flag for non-interactive CI/CD execution |
| c-cicd-structured | ts-3.6 | CI/CD Structured Output & Incremental Reviews | Advanced | --output-format json with --json-schema enables automated inline PR comments |

### D4 — Prompt Engineering & Output (14)

| id | ts | title | level | insight |
|---|---|---|---|---|
| c-explicit-criteria | ts-4.1 | Explicit Criteria over Vague Instructions | Foundation | Replace vague goals with specific, categorical criteria the model can apply deterministically |
| c-prompt-specificity | ts-4.1 | Prompt Specificity & Precision | Foundation | Replace vague goals with specific, actionable criteria |
| c-classification-consistency | ts-4.1 | Classification Consistency & False Positive Reduction | Intermediate | Use absolute criteria with concrete examples for each classification level |
| c-fewshot | ts-4.2 | Few-Shot Prompting Techniques | Foundation | Few-shot examples are more reliable than instructions for consistent formatting |
| c-io-examples | ts-4.2 | Concrete Input-Output Examples | Foundation | Concrete examples eliminate ambiguity that prose descriptions create |
| c-structured-output | ts-4.3 | Structured Output via Tool Use & JSON Schemas | Intermediate | Tool use with JSON schemas eliminates syntax errors but not semantic errors |
| c-tool-choice | ts-4.3 | tool_choice Options & Forced Tool Selection | Intermediate | tool_choice 'auto' may return text; 'any' guarantees a tool call; forced selection guarantees a specific tool |
| c-retry-feedback | ts-4.4 | Retry-with-Error-Feedback Pattern | Intermediate | Append specific validation errors to the retry prompt — not just 'try again' |
| c-dismissal-analysis | ts-4.4 | Feedback Loop Design & Dismissal Pattern Analysis | Advanced | Add detected_pattern fields to enable systematic analysis of false positive patterns |
| c-batch-selection | ts-4.5 | Batch Processing Strategy & API Selection | Intermediate | Batch API saves 50% but has up to 24-hour processing with no latency SLA |
| c-batch-failure | ts-4.5 | Batch Failure Handling & Constraints | Intermediate | Resubmit only failed documents identified by custom_id, not the entire batch |
| c-batch-cost | ts-4.5 | Batch Cost Optimization Strategies | Advanced | 50% batch savings are reduced by resubmission costs — maximize first-pass success |
| c-self-critique | ts-4.6 | Self-Critique Limitations & Independent Review | Intermediate | Self-review in the same context suffers from confirmation bias — the model retains generation reasoning |
| c-multipass-review | ts-4.6 | Multi-Pass Review Architecture | Advanced | Split large reviews into per-file local passes plus cross-file integration passes |

### D5 — Context & Reliability (15)

| id | ts | title | level | insight |
|---|---|---|---|---|
| c-context-windows | ts-5.1 | Context Windows & Provision Strategies | Foundation | Context window = input tokens + output tokens combined |
| c-lost-in-middle | ts-5.1 | Lost in the Middle & Position Effects | Intermediate | Models attend best to beginning and end of context, less to the middle |
| c-progressive-summary | ts-5.1 | Progressive Summarization Risks | Intermediate | Extract critical transactional facts into a persistent block outside summarized history |
| c-token-caching | ts-5.1 | Context Token Management & Caching | Advanced | Trim verbose tool outputs to only relevant fields before they accumulate in context |
| c-escalation-criteria | ts-5.2 | Escalation Criteria & Patterns | Intermediate | Escalate for genuine policy gaps, not just complexity |
| c-escalation-triggers | ts-5.2 | Appropriate Escalation Triggers | Intermediate | Distinguish genuine policy gaps from mere complexity when deciding to escalate |
| c-ambiguous-results | ts-5.2 | Ambiguous Result Handling | Foundation | Ask for clarification on ambiguous results rather than guessing |
| c-error-propagation | ts-5.3 | Error Propagation in Multi-Agent Systems | Intermediate | Handle errors at the lowest level capable of resolving them |
| c-graceful-degradation | ts-5.3 | Graceful Degradation with Transparency | Intermediate | Continue operating with partial data but annotate gaps transparently |
| c-context-budget | ts-5.4 | Context Budget Management & Upstream Reduction | Intermediate | Reduce data volume at the source rather than trying to handle large inputs downstream |
| c-codebase-exploration | ts-5.4 | Codebase Exploration Context Strategies | Intermediate | Use scratchpad files to externalize findings beyond the context window |
| c-human-review | ts-5.5 | Human Review Workflow Design | Intermediate | Aggregate accuracy metrics can mask poor performance on specific segments |
| c-confidence-calibration | ts-5.5 | Confidence Calibration & Review Thresholds | Advanced | Calibrate confidence thresholds using labeled validation sets, not intuition |
| c-conflicting-sources | ts-5.6 | Handling Conflicting Data Sources | Intermediate | Preserve conflicting data with source attribution; don't choose one |
| c-provenance | ts-5.6 | Information Provenance & Claim-Source Mappings | Intermediate | Require structured claim-source mappings from subagents to preserve attribution |

**Note**: `c-escalation-criteria` and `c-escalation-triggers` (both ts-5.2) had
near-identical source insights; the second is reworded to distinguish it. All
insights are English source strings that will flow through the i18n engine.
