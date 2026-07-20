# CCA-F Study Suite

**🇬🇧 English** · [🇻🇳 Tiếng Việt](README.vi.md)

A single self-contained HTML file for studying Anthropic's **Claude Certified Architect — Foundations (CCA-F)** exam. No build step, no server, no dependencies to install — just open `cca-f-study-suite-vn.html` in a browser.

## Open it

Double-click [cca-f-study-suite-vn.html](cca-f-study-suite-vn.html), or serve it with any static file server. Progress is saved locally in the browser (`localStorage`), per device/browser.

## What's inside

The page is a tabbed shell with four tools:

| Tab | Purpose |
|---|---|
| **Study Console** | The main trainer. A 7-phase learning path (Foundations → Applied Scenarios) built from 14 topic modules, a cheat sheet of core principles + an "IF trigger → THEN pattern" decision table, a flashcard-style Study mode (mark questions Known/Review, reveal explanations), and a configurable Quiz mode (pick modules + question count, get a scored run with missed-question review). |
| **Study Hub** | A reference view organized by the 5 official exam domains (weighted D1–D5), with per-domain decision rules, traps to avoid, and keyword triggers, plus a searchable rapid-decoder table. |
| **Neuron Map** | An interactive SVG concept map linking exam domains to their sub-topics, with cross-domain "synapse" connections you can click through. |
| **2-Week Plan** | A day-by-day checklist study plan with its own progress bar; includes a manual JSON export/import fallback for contexts where `localStorage` is unavailable (e.g. some `file://` setups). |

## Content

- **182 unique questions**, sourced from `CCA-F_Study_Guide.md` — 42 exact duplicates between the guide's Section 1 and Section 2 were merged (the Section 1 copy is kept, since it carries the written explanation). One pair with a genuinely conflicting source answer is flagged with a ⚠ badge in Study mode.
- Questions are tagged into **14 modules** grouped under **7 learning-path phases**, and mapped to **5 exam domains** (Agentic Architecture & Orchestration, Tool Design & MCP Integration, Claude Code Configuration & Workflows, Prompt Engineering & Structured Output, Context Management & Reliability).

## Features

- **EN / VN language toggle** — a runtime text-swap layer translates on-screen copy to Vietnamese and back without reloading; the selected language persists across visits.
- **Local persistence** — study progress (known/review marks) and plan checklist state are saved via `localStorage`, with an in-memory fallback for the current tab if storage is blocked.
- **Zero dependencies** — vanilla JS/CSS/SVG in one file; the only external calls are Google Fonts (Space Grotesk, Inter, JetBrains Mono).

## Disclaimer

Not affiliated with or endorsed by Anthropic. Practice content only — not the official exam.
