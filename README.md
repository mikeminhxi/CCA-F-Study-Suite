# CCA-F Study Suite

**🇺🇸 English** · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇹 Italiano](README.it.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md)

🔗 **Live demo:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

A single self-contained HTML file for studying Anthropic's **Claude Certified Architect — Foundations (CCA-F)** exam. No build step, no server, no dependencies to install — just open `index.html` in a browser.

## Open it

Double-click [index.html](index.html), or serve it with any static file server. Progress is saved locally in the browser (`localStorage`), per device/browser.

## What's inside

The page is a tabbed shell with four tools. On desktop-width screens (900px and up) it locks to a fixed-height layout with a sticky top nav, so each tool scrolls independently; below that width it falls back to one continuously scrolling page.

| Tab | Purpose |
|---|---|
| **Study Console** | The main trainer. A learning path organized by the 5 official exam domains (in blueprint weight order), each broken into its **task statements**; a cheat sheet of core principles plus an "IF trigger → THEN pattern" decision table; a flashcard-style Study mode (filter by task statement or the cross-cutting "Mixed / Applied" set, mark questions Known/Review, reveal explanations, see auto-tagged keyword chips); an "Exam by Domain" Quiz mode where you toggle whole domains or individual task statements, pick a question count, and get a scored run with every miss explained; and a **Concepts** tab listing all 59 blueprint concepts by domain → task statement, each with its core insight and a Foundation/Intermediate/Advanced level. |
| **Study Hub** | A reference view organized by the 5 official exam domains (weighted D1–D5), with per-domain decision rules, traps to avoid, and keyword triggers, plus a searchable rapid-decoder table. |
| **Neuron Map** | An interactive SVG concept map linking exam domains to their sub-topics, with cross-domain "synapse" connections you can click through. |
| **2-Week Plan** | A day-by-day checklist study plan with its own progress bar; includes a manual JSON export/import fallback for contexts where `localStorage` is unavailable (e.g. some `file://` setups). |

## Content

- **156 practice questions**, sourced from `CCA-F_Study_Guide.md`. One pair with a genuinely conflicting source answer is flagged with a ⚠ badge in Study mode.
- The app is organized around the **official CCA-F blueprint**: **5 domains → 30 task statements → 59 concepts**. Every question is tagged to one task statement, and its domain follows from that tag. The five domains, in exam-weight order: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%), and Context & Reliability (15%). (Blueprint taxonomy from [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Features

- **EN / FR / DE / IT / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU language toggle** — a runtime text-swap layer translates on-screen copy between English, French, German, Italian, Portuguese, Spanish, Vietnamese, Simplified Chinese, Traditional Chinese, Japanese, Korean, Hindi, and Russian without reloading; the selected language persists across visits.
- **Auto-tagged keywords** — each question is checked against a list of dozens of exam buzzwords (e.g. "MCP resource", "stateless", "tool_choice") and shows the ones it matches as chips, so the giveaway phrase jumps out before you read the explanation.
- **Local persistence** — study progress (known/review marks) and plan checklist state are saved via `localStorage`, with an in-memory fallback for the current tab if storage is blocked.
- **Zero dependencies** — vanilla JS/CSS/SVG in one file; the only external calls are Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Optional support** — a "☕ Buy me a coffee" button (always visible in the top nav, plus a callout after finishing a practice exam) opens a QR-code modal with a few payment options; entirely optional and automatically hidden if no QR images are configured.

## Disclaimer

Not affiliated with or endorsed by Anthropic. Practice content only — not the official exam.
