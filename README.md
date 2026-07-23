# CCA-F Study Suite

**🇺🇸 English** · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md)

A single self-contained HTML file for studying Anthropic's **Claude Certified Architect — Foundations (CCA-F)** exam. No build step, no server, no dependencies to install — just open `cca-f-study-suite.html` in a browser.

## Open it

Double-click [cca-f-study-suite.html](cca-f-study-suite.html), or serve it with any static file server. Progress is saved locally in the browser (`localStorage`), per device/browser.

## What's inside

The page is a tabbed shell with four tools. On desktop-width screens (900px and up) it locks to a fixed-height layout with a sticky top nav, so each tool scrolls independently; below that width it falls back to one continuously scrolling page.

| Tab | Purpose |
|---|---|
| **Study Console** | The main trainer. A 7-phase learning path (Foundations → Applied Scenarios) built from 14 topic modules tagged by exam domain, a cheat sheet of core principles plus an "IF trigger → THEN pattern" decision table, a flashcard-style Study mode (mark questions Known/Review, reveal explanations, see auto-tagged keyword chips per question), and a domain-grouped Quiz mode — the "Exam by Domain" tab — where you toggle whole domains or individual modules, pick a question count, and get a scored run with every miss explained. |
| **Study Hub** | A reference view organized by the 5 official exam domains (weighted D1–D5), with per-domain decision rules, traps to avoid, and keyword triggers, plus a searchable rapid-decoder table. |
| **Neuron Map** | An interactive SVG concept map linking exam domains to their sub-topics, with cross-domain "synapse" connections you can click through. |
| **2-Week Plan** | A day-by-day checklist study plan with its own progress bar; includes a manual JSON export/import fallback for contexts where `localStorage` is unavailable (e.g. some `file://` setups). |

## Content

- **157 unique questions**, sourced from `CCA-F_Study_Guide.md` — 67 duplicates between the guide's Section 1 (Q1–77) and Section 2 (Q1–148) were merged (the Section 1 copy is kept, since it carries the written explanation). One pair with a genuinely conflicting source answer is flagged with a ⚠ badge in Study mode.
- Questions are tagged into **14 modules** grouped under **7 learning-path phases**, and mapped to **5 exam domains**: Agentic Architecture & Orchestration (27%), Claude Code Configuration & Workflows (20%), Prompt Engineering & Structured Output (20%), Tool Design & MCP Integration (18%), and Context Management & Reliability (15%).

## Features

- **EN / ES / VN / 简体中文 / 繁體中文 / JA language toggle** — a runtime text-swap layer translates on-screen copy between English, Spanish, Vietnamese, Simplified Chinese, Traditional Chinese, and Japanese without reloading; the selected language persists across visits.
- **Auto-tagged keywords** — each question is checked against a list of dozens of exam buzzwords (e.g. "MCP resource", "stateless", "tool_choice") and shows the ones it matches as chips, so the giveaway phrase jumps out before you read the explanation.
- **Local persistence** — study progress (known/review marks) and plan checklist state are saved via `localStorage`, with an in-memory fallback for the current tab if storage is blocked.
- **Zero dependencies** — vanilla JS/CSS/SVG in one file; the only external calls are Google Fonts (Space Grotesk, Inter, JetBrains Mono).

## Disclaimer

Not affiliated with or endorsed by Anthropic. Practice content only — not the official exam.
