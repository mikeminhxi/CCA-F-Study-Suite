# Changelog

All notable changes to the CCA-F Study Suite are recorded here.

## Russian (Русский) — 12th supported language

- **Russian (ru)** — the app's first Cyrillic-script language. Fully wired into `index.html` (`window.__I18N_RU__`/`__SHELL_RU__`, `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select` dropdown), all 11 existing READMEs updated, new `README.ru.md` added. Full 715-key `i18n` + 5-key `shell` dictionary translated and staged at `translations/ru.json` via `fetch-language-dictionary`, then wired via `add-language`. Ran through `specs/001-add-language/` via `/speckit-plan` → `/speckit-tasks` per FR-009, on branch `feat/add-russian-language`.
- Reused the Hindi round's trailing-script-group ordering precedent without needing a new maintainer decision: Russian's `<option>` and README switch-link sit at the very end, after हिन्दी (Latin group → CJK group → Devanagari group → new Cyrillic group).
- **New standing quality gate, added after the Hindi round's under-translation bug**: ran an English-word-overlap diff of the staged dictionary against the German sibling *before* injecting into `index.html`, instead of after. Caught and fixed a handful of under-translated keys pre-injection, avoiding the extra re-injection pass the Hindi round needed.
- Verified via headless Edge (Node/Playwright/chromium-cli unavailable in this environment): Learning Path, Cheat & Keywords decision-rules table, Concepts tab, a full live exam round (question counter, sidebar unit label) in Cyrillic, and the donate button/modal (Russian naturally translated "Bank 1/2/3" to "Банк 1/2/3", unlike German/Hindi which kept "Bank" in English — a reasonable per-language register choice) all render correctly with zero console errors across all 5 Study Console tabs.

## Hindi (हिन्दी) — 11th supported language

- **Hindi (hi)** — the app's first Devanagari-script language. Fully wired into `index.html` (`window.__I18N_HI__`/`__SHELL_HI__`, `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select` dropdown), all 10 existing READMEs updated, new `README.hi.md` added. Full 715-key `i18n` + 5-key `shell` dictionary translated and staged at `translations/hi.json` via `fetch-language-dictionary`, then wired via `add-language`. Ran through `specs/001-add-language/` via `/speckit-plan` → `/speckit-tasks` per FR-009, on branch `feat/add-hindi-language`.
- **New dropdown/README ordering precedent** (confirmed with the maintainer this round): since Hindi is neither Latin nor CJK script, the existing two-group ordering rule didn't cover it. Established: script-family groups are appended in the order introduced — Latin group, then CJK group, then a new Devanagari group. Hindi's `<option>` and README switch-link sit at the very end, after 한국어. This precedent carries forward for any future single-language script family.
- **Bug found and fixed during verification** (specific to this round, not a pre-existing app bug): the first translation pass under-translated 148 keys — mostly section headings, domain names, and concept titles — leaving whole English phrases untouched except swapping a conjunction or adding a grammatical particle, instead of translating the general nouns (e.g. "Agentic Architecture" stayed fully untranslated instead of becoming "एजेंटिक आर्किटेक्चर"). Caught by diffing English-word-overlap against the German sibling dictionary as a completeness bar; fixed with a targeted re-translation pass on exactly those 148 keys (146 changed, 2 legitimately left as-is), then re-injected into `index.html`.
- Verified via headless Edge (Node/Playwright/chromium-cli unavailable in this environment): Learning Path, Cheat & Keywords decision-rules table, Concepts tab, a full live exam round (question counter, sidebar unit label) in Devanagari, and the donate button/modal (including "Bank 1/2/3" labels) all render correctly in Hindi with zero console errors across all 5 Study Console tabs.

## German (Deutsch) — 10th supported language

- **German (de)** — fully wired into `index.html` (`window.__I18N_DE__`/`__SHELL_DE__`, `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select` dropdown positioned between Français and Português per alphabetical-by-English-name ordering), all 9 existing READMEs updated, new `README.de.md` added. Full 715-key `i18n` + 5-key `shell` dictionary translated and staged at `translations/de.json` via `fetch-language-dictionary`, then wired via `add-language`. Ran through `specs/001-add-language/` via `/speckit-plan` → `/speckit-tasks` per FR-009, on branch `feat/add-german-language`.
- Verified via headless Edge (`msedge --headless=new`, since Node/Playwright weren't available in this environment): Learning Path (5 domains → task statements in German), Cheat & Keywords core-principle cards + decision-rules table (`IF THE STEM SAYS` header translated, literal exam-stem phrases left in English per convention), Concepts tab (59 concepts), and the donate button/modal (including "Bank 1/2/3" labels) all render correctly in German — a `window.onerror` collector round-tripped through all 5 Study Console tabs with zero console errors.

## French (Français) — 9th supported language

- **French (fr)** — fully wired into `index.html` (`window.__I18N_FR__`/`__SHELL_FR__`, `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select` dropdown positioned between English and Português per alphabetical-by-English-name ordering), all 8 existing READMEs updated, new `README.fr.md` added. Full 715-key `i18n` + 5-key `shell` dictionary translated and staged at `translations/fr.json` via `fetch-language-dictionary`, then wired via `add-language`. Ran through `specs/001-add-language/` via `/speckit-plan` → `/speckit-tasks` per FR-009, on branch `feat/add-french-language`.
- **Bug found and fixed during verification** (pre-existing, affected all 8 other languages equally, not French-specific): the Learning Path's per-domain progress line concatenated the word "known" directly after a dynamic count into one un-matchable text node, so the already-translated "known" dictionary key was never applied — it silently stayed in English under every non-English language. Fixed by isolating it into its own `<span>`; confirmed fixed across fr/es/pt/en.
- **Flagged, not fixed here** (pre-existing, affects all languages equally, tracked in `specs/001-add-language/tasks.md`): the exam-setup "Exam Domains" heading and "N questions available" counter have no matching dictionary key at all; the Study Hub "Rapid Decoder" table pulls some cell fragments from a source never wired into any dictionary; the Neuron Map's node labels were never wired into any dictionary either (a re-surfacing of the Korean round's originally-flagged gap — the blueprint-taxonomy restructure fixed domain/task-statement/concept titles but not this specific array). None are specific to French.
- Verified in a real browser via Playwright: Learning Path, Cheat & Keywords (core-principle cards + decision-rules table), Exam by Domain, Concepts tab (59 concepts), Neuron Map, 2-Week Plan, and the donate modal (nav button + results banner, including "Bank 1/2/3" labels) all render correctly in French — zero console errors throughout.

## Persistent donate button + mobile nav overhaul

- **"☕ Buy me a coffee" is now a persistent button in the top shell-nav**, visible on every page (Study Console, Study Hub, Neuron Map, 2-Week Plan), not just during/after an exam. Removed the now-redundant icon-only button that used to sit next to "Flag for Review" in the exam-taking top bar; the results-page "Found this useful?" banner stays, since it has its own contextual copy.
- QR cards render side by side (up to 360px each, shrinking gracefully on narrow screens instead of overflowing) so they're easy to scan without needing to stack-scroll through 3 separate images. Added translations for the "Bank 1"/"Bank 2"/"Bank 3" labels across all 7 non-English dictionaries.
- Donate popovers redesigned as a centered modal (dark backdrop, closes via the ✕, a backdrop click, or re-clicking the trigger) instead of a small anchored dropdown.
- **Study Console desktop header**: title and tab bar now share one row instead of stacking on two; content stays centered on wide screens.
- **Exam setup screen**: "Length" and "Start exam" moved up near "Select all"/"Clear", above the domain list, instead of buried at the bottom; length options changed to 10/20/60/All.
- **Mobile exam Q&A**: the question-number sidebar now renders below the question instead of above it, so you see the question immediately instead of scrolling past a big number grid first.
- **Mobile nav dropdowns (outer shell-nav tabs + inner Study Console tabs) now expand as a floating overlay** instead of an inline accordion that pushed all page content down and back on every open/close. Tapping the collapsed pill itself (not just the small arrow) now opens the overlay too.
- **Both sticky headers now auto-hide on scroll-down and slide back in on scroll-up** (mobile only), like a mobile browser's address bar — keeps navigation reachable without permanently eating screen space now that the donate button and theme/language controls are always visible.
- Fixed two regressions caught during this work: a `box-sizing` overflow bug in the new overlay (same root cause as the earlier QR-card sizing bug — no `border-box` reset outside `#tool-console`), and an accidental loss of the outer shell-nav's `position:sticky` (a stray `position:relative` added for the overlay's positioning context silently won the cascade over the existing sticky rule at equal specificity).

## Donation QR codes: multiple banks, reachable during the exam, CyberSkill-style placement

- Supports up to 3 donation QR codes (e.g. different bank accounts), not just one — configured via a `DONATIONS` array (`{file, label}`) and a shared `donateCardsHtml()` renderer so the exam popover and results page can't drift out of sync. Each card degrades independently on a missing file; if all are missing, the whole donate button/section removes itself.
- The results-page "Buy me a coffee" card only reached people who finished a full exam and scrolled past the domain breakdown. Redesigned as a slim "Found this useful? [☕ Buy me a coffee]" banner placed right after the stat tiles, before "Performance by domain" — matching the reference CyberSkill mock-exam results layout the maintainer shared (its "Buy me a banana" card sits in the same spot). Clicking the button opens a popover with the QR cards instead of showing them inline at full size.
- Also added a matching ☕ icon button next to Flag for Review in the exam-taking top bar, opening the same QR popover without leaving the question — the donation ask no longer requires finishing the exam first.
- Fixed a bug caught during verification: the "all files missing" cleanup only removed the empty QR grid, not the button itself, so with zero QR files dropped in, the ☕ button rendered but did nothing when clicked (a silently-emptied popover). Now the button only renders once at least one QR file actually exists.
- The 3 real QR images now live at `donate-qr/1.jpg`, `donate-qr/2.png`, `donate-qr/3.jpg` and are committed to the repo (not gitignored) so they actually ship on GitHub Pages — a donation/payment QR is meant to be scanned by strangers, so it's not treated as sensitive the way credentials would be.
- Reworked the popover into a centered modal (dark backdrop, close via the ✕ button, backdrop click, or Escape-equivalent outside click) with each QR card shown much larger (up to 360px) so it's actually easy to scan, instead of a small anchored dropdown. Multiple cards stack and scroll within the modal if they overflow the viewport height.
- Verified in a real browser (Playwright) at desktop and mobile (390px): both placements render with the real QR images, modal opens/closes via all three interactions, stays within the viewport with internal scroll on mobile, zero console errors.

## Optional "Buy me a coffee" QR code on the results page

- Added a small, unobtrusive donation card to the exam results screen — a caption plus a QR code image (`donate-qr.png`, dropped in next to the HTML file). Since this is a static single-file app with no way to embed a real image, the `<img>` fails and removes its own card gracefully if the file isn't present, so the app still ships clean without it.
- Added and translated 1 new string ("☕ Buy me a coffee") across all 7 non-English dictionaries.
- Also caught up `translations/*.json` with 16 other strings from the exam/results redesign (Questions, Flag for Review, Previous/Next, stat labels, domain/review headings, etc.) that were never synced after that work landed — all 7 files were still at 693 keys against the in-app 710.

## Renamed to `index.html` for GitHub Pages hosting

- **`cca-f-study-suite.html` renamed to `index.html`**, the filename GitHub Pages requires to serve a repo's root as a site. No content changed — same single self-contained file, same `git mv` history.
- Added a **live demo link** (`https://mikeminhxi.github.io/CCA-F-Study-Suite/`) near the top of all 8 READMEs, and updated every `cca-f-study-suite.html` reference/link across them to `index.html`.
- GitHub Pages itself (Settings → Pages → Deploy from branch → `main` / `/ (root)`) is a one-time repo-settings change, not a file change — done separately, outside this PR.

## Pin the exam Previous/Next bar to the bottom of the screen

- The exam-taking screen's Previous/Next bar used to sit directly under the Q&A card, so on a short question it floated mid-page and on a long one you had to scroll to reach it. It's now a fixed footer bar pinned to the bottom of the viewport (like CyberSkill's), always in the same place regardless of question length. `position:sticky` was tried first but doesn't work here — its own wrapper hugs the card tightly with no slack to stick within, so it switched to `position:fixed` with matching bottom padding added to the exam grid so the bar never covers the last answer option.

## Results page polish, after a side-by-side check against CyberSkill's screen

- Verified the exam-taking screen's Previous/Next against a fresh CyberSkill screenshot: already correct (Previous is genuinely disabled — 40% opacity, `disabled` attribute — on question 1; Next stays active). Kept this app's existing amber `.btn` styling rather than copying CyberSkill's cream button color, for consistency with every other button in the app.
- **Added circular status icons** (✓ / ✕ / – / 🕐) to the four results-page stat tiles, matching CyberSkill's layout.
- **Added a "Question N" label to each review card**, using the question's position in the original exam order (not the filtered list) — otherwise, once you filter the review list to just Incorrect or Flagged, there's no way to tell which numbered question you're looking at.
- **Deliberately kept domain-breakdown bars colored by domain identity** (matching Learning Path/Neuron Map elsewhere in this app) rather than switching to CyberSkill's uniform tier-based green — a weak domain is still obvious from its short bar and low percentage, and identity colors stay consistent with the rest of the app.
- Added and translated 1 new string ("Question") across all 7 non-English dictionaries.

## Results/review page redesign (Exam by Domain)

- **Rebuilt the exam results screen** as a single scrollable page instead of a percentage + "Review misses" button gating a separate screen: a score banner (colored by the existing 85/70/50 tier thresholds — no new pass/fail scoring), four stat tiles (Correct / Incorrect / Skipped / Time Taken), a **Performance by domain** breakdown with per-domain progress bars, and an always-visible **Review Questions** list covering every question, not just the missed ones. Modeled after the CyberSkill results-page screenshot, minus the SaaS-only parts (AI tutor, sharing, certificates, leaderboard) that don't fit a zero-dependency single-file app.
- **Skipped is now a real, distinct outcome**: since the new exam-taking screen (previous round) lets you move on without answering, the results page tallies Correct/Incorrect/Skipped separately instead of treating every non-correct answer as a miss.
- The review list is filterable — **All / Incorrect / Flagged** — closing the loop on the Flag for Review feature from the exam-taking screen: you can now jump straight to just the questions you flagged while taking the exam. Each review card shows a Correct/Incorrect/Skipped badge, a 🚩 marker if flagged, and all four options with the correct one highlighted (plus your pick highlighted if wrong), same visual language as Study mode.
- Added a simple elapsed-time stat (recorded from when the exam starts to when it's submitted) — informational only, the exam itself stays untimed.
- **Found and fixed a pre-existing i18n bug while moving this code**: the old quiz's per-question explanation heading concatenated the correct answer's letter directly into the text (`Why C`), which never matched the dictionaries (only the plain `Why` — already used correctly by Study mode — was translated), so it silently stayed in English in all 7 non-English languages. Now uses the same plain `Why` heading as Study mode.
- Added and translated 8 new UI strings (stat labels, section headings, filter chip labels, empty-filter state) across all 7 non-English dictionaries; split the filter-chip counts (e.g. "Incorrect (7)") into a separate non-translated `<span>` so the count doesn't block the label from matching its dictionary entry.
- Verified in a real browser (Playwright): stat accuracy against a mixed correct/incorrect/skipped/flagged run, all three review filters, domain breakdown percentages, desktop dark/light, mobile (390px), and Japanese translation of every new string — zero console errors.

## Exam-taking screen redesign (Exam by Domain)

- **Reworked the exam-taking flow** from a linear one-question-at-a-time quiz that revealed correct/incorrect immediately on each pick, to a real mock-exam layout: a question-number sidebar grid (jump to any question directly), a top bar with a "Practice · untimed" badge, a **Flag for Review** toggle, and a fullscreen button, and Previous/Next navigation at the bottom. No answer feedback is shown during the exam anymore — picking an option just selects it (and can be freely changed) — correctness is only revealed on the existing results screen once you finish, matching how a real exam works. Modeled after a CyberSkill mock-exam screenshot the maintainer shared; the results/review page redesign (pass/fail banner, per-domain breakdown, color-coded review list) is intentionally deferred to a follow-up round.
- Sidebar numbers show answered (filled teal), current (indigo ring), and flagged (amber dot) state at a glance; the counter reads "Questions answered/total".
- **Found and fixed an i18n regression while making this change**: the question counter's English text changed from "Question N / M" to "Question N of M" to match the reference screenshot, which silently broke the app's existing number-substitution translation (it only pattern-matched the old "/" format) — all 7 non-English languages would have shown the raw English counter. Fixed by updating the match pattern instead of leaving it broken.
- Added and translated 7 new UI strings (sidebar header, badge, flag button in both states, Previous/Next/Finish exam) across all 7 non-English dictionaries.
- Verified in a real browser (Playwright): free navigation via sidebar/Previous/Next, answer selection and re-selection with no correctness leak, Flag for Review toggling and persisting across navigation, reaching the existing score screen, desktop dark/light, mobile (390px), and Vietnamese translation of every new string — zero console errors.

## Answer-key fix and cross-check against an external practice set

- **Fixed `ts-4.5-03` (Message Batches SLA/batching-strategy question): the marked correct answer was `A`, but the question's own explanation already argued for `C`** ("Why it's correct: C... 4-hour wait + 24-hour batch SLO = 28-hour worst case, 2-hour cushion under the 30-hour SLA"). Self-contradictory data bug, independent of any external source — the `a` field just didn't match the `w` field. Corrected `a` to `C`.
- Cross-checked a few questions against a third-party practice platform (CyberSkill's "Claude Certified Architect · Practice Together") that the maintainer is using alongside this project. Two questions initially flagged as "missing" turned out to already be present, just under different domain/task-statement tags than expected: the invoice-extraction-reliability question (`ts-4.4-03`) and the citation/provenance-loss question (`ts-5.6-01`) both matched word-for-word (options and correct answer included).
- **`ts-5.6-01`'s question text now includes the lead-in sentence** ("In production, final reports frequently contain claims without proper source attribution.") to match that source's phrasing more closely — a cosmetic addition, the scenario/options/answer were already identical.

## Duplicate question removed (157 → 156)

- **Removed `ts-1.2-06`**, a near-duplicate of `ts-1.2-02` (same scenario: a synthesis agent flattening a financial/news/patent multi-source briefing into uniform bullet points). Found by spot-checking search results after adding the question-search feature. The two originated from the pre-merge S1/S2 decks (`S1-Q12` and `S2-Q10`) and the old `dup` cross-reference field never caught this pair — it pointed `S1-Q12` at an unrelated id (`S2-Q82`) instead, which is part of why that field was dead weight (see the id-scheme entry below). Kept `ts-1.2-02`: `ts-1.2-06`'s question text had words dropped mid-sentence (garbled by whatever process produced the S2 deck) and its `w` (answer explanation) field was empty.
- `ts-1.2` is now 5 questions (`-01`..`-05`) instead of 6; no renumbering needed elsewhere since `-06` was the last in its group. Total question count is now **156**, corrected everywhere it was hardcoded: the Study Console badge, source lines, Learning Path/Study Hub/2-Week Plan copy (English + all 7 translated dictionaries), `translations/*.json`, and every `README*.md`.
- This is a good reminder the original S1/S2 merge's duplicate-detection wasn't exhaustive — there may be other undetected near-duplicates in the remaining 156; none were specifically searched for beyond this one.

## Question search (Study tab)

- **Added a search box to the Study tab** that filters across all 157 questions by id (e.g. `ts-2.2-03`), question/option text, or category — independent of the currently-selected domain/task statement. Previously the only way to find a question was to browse Domain → task statement or the Mixed/Applied filter; there was no way to jump to a specific question. Combines with the existing All/To review/Not yet known filter. Selecting a task statement from the rail, the Mixed/Applied button, or `openTs()` (Learning Path deep links) clears an active search.
- **Each question card now shows its id** (the `ts-x.x-##` code, reusing the existing `.tscode` chip style) — previously `q.id` was never rendered anywhere, so there was no way to see which question you were looking at, in search results or otherwise.
- Added `"Search results"` and the no-match empty-state message to all 7 non-English dictionaries (the search input's placeholder and the clear button's `aria-label` are left untranslated, consistent with the one pre-existing precedent for input placeholders in Cheat & Keywords).
- Verified in a real browser (Playwright): search by id/keyword/category, the clear button, combining search with the known/review filter, the empty "no matches" state, and the Vietnamese translation of that state — all work with zero console errors. Checked desktop (dark + light) and mobile (390px) layouts.

## Question ID scheme (QDATA)

- **Replaced the `S1-Q##` / `S2-Q##` question ids** (a leftover from the two original source sessions, long since merged into one 157-question set) **with `<ts-code>-##`** — e.g. `ts-1.1-01` — a sequence number scoped to each question's task statement, so the id itself encodes both Domain and task statement instead of a meaningless session number. Also dropped the now-fully-stale `sec` field (still `1`/`2` per question, unused anywhere in the app) and the `dup` field (a pre-merge annotation whose every reference pointed at an S1-Q/S2-Q id that no longer exists in QDATA, since the duplicate side was dropped during the original merge; also unused in code).
- `q.id` is only ever used as an internal key (localStorage progress, quiz-answer tracking) — never rendered to the user — so this is a pure data/bookkeeping change with no UI difference. It does mean previously-saved "known"/"review" progress in `localStorage` won't match the new keys and will read as unseen after this update (accepted tradeoff, not migrated).

## Languages (Portuguese)

- Added **Portuguese, Brazil (Português)** as the 8th supported UI language — a Tier 1 candidate from `SPEC_KIT_INTEGRATION_PLAN.md` §5 (large developer population, Latin script, same mechanics as Spanish/Vietnamese, no new engineering lift). Checked off in the priority list, along with fixing a stale entry there for Korean (already shipped in PR #1 but left unchecked).
- Full 696-key (691 `i18n` + 5 `shell`) dictionary translated and staged at `translations/pt.json` via `fetch-language-dictionary`, then wired into `cca-f-study-suite.html` (`MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`, `#lang-select` dropdown — positioned between English and Español per alphabetical-by-English-name ordering) via `add-language`. All 7 existing READMEs updated; added `README.pt.md`.
- Built via a **prospective** spec-kit round (`/speckit-plan` → `/speckit-tasks` run *before* implementation, per FR-009) — the first language round to follow that order from the start rather than retrofitting it afterward. Also updated `specs/001-add-language/spec.md`'s hardcoded "531 keys" references (FR-002, SC-002) to describe the baseline dynamically, since it has grown to 696 keys since Korean's round and will keep changing.
- **Bug found and fixed during verification** (pre-existing, affected all 7 other languages equally, not introduced by this addition): the Exam-by-Domain quiz's in-quiz meta line concatenated the task-statement id and title into a single text node (`"ts-4.3 · Enforce structured output..."`), which never matched any dictionary key, so the title silently stayed in English under every non-English language. Fixed by splitting the id into its own `.tscode` span, matching the pattern already used in the Learning Path and Study rail — the title is now an independently-translated text node in all 8 languages.
- Verified end-to-end in a real browser (Playwright) across all 8 languages: Learning Path, Cheat & Keywords, Study, Exam by Domain (including the fixed quiz meta line), and the Concepts tab all render correctly, zero console errors, progress and language preference both persist across reload.

## Mobile UI (collapse/expand navigation)

- **Outer shell-nav and inner Study Console tab bar now collapse by default on mobile (≤640px)**: previously all tabs in both rows stacked and stayed fully expanded, eating most of the viewport before any content was visible. Each bar now shows only its active tab plus a chevron toggle; picking a tab auto-collapses the bar again.
- **Theme/language controls fold into the same collapse**: `#nav-controls` (theme toggle + language selector) is now hidden while the outer shell-nav is collapsed, so the collapsed state is a single tidy row instead of two.
- **Inner tab bar is sticky while scrolling long content** (e.g. Cheat & Keywords): it now stays pinned just below the outer nav instead of scrolling out of view, so the collapse toggle stays reachable without scrolling back to the top. Kept in sync with the outer nav's height via a `--shell-nav-h` CSS variable, updated on resize and whenever the outer nav's expanded/collapsed state changes.
- **Active inner tab now stretches full width** to match the outer "Study Console" pill, instead of sitting content-width off to one side.
- **Study rail (task-statement list) is now a per-domain accordion** with a "current domain only" collapse on mobile, plus its own toggle to show all domains — switching sets/task statements no longer requires scrolling back to the top of a long list. Selecting a task statement auto-collapses back to the current domain.
- **Two pre-existing CSS-cascade bugs found and fixed** along the way (unrelated to this session's earlier work, but surfaced by it):
  - `#tool-console .top{position:static}` was an unconditional rule that silently defeated *both* the desktop sticky-header rule and the new mobile one, due to equal specificity and later source order — confirmed the desktop inner tab bar had never actually been sticky. Fixed by dropping the redundant `position:static` (CSS's own default) from the base rule.
  - A generic `#tool-console .rail button{display:flex}` rule unintentionally matched the new rail-toggle button (nested inside `.rail`), overriding its `display:none`/`inline-flex` toggle rules regardless of viewport. Fixed by scoping the toggle's `display` rules into non-overlapping `max-width:720px` / `min-width:721px` media queries with a more specific selector.
- Verified in a real browser (Playwright) at 390px and 1400px widths: zero console errors, all collapse/expand and accordion interactions work, desktop layout unaffected.

## UI / Theme

- **Light-theme parity fixes**: the Study Console header and Study Hub jump-nav had hardcoded dark backgrounds that stayed dark in light mode, and the Neuron Map stage had a hardcoded dark gradient that rendered everything — including the amber synapse lines — on a dark-gray field. All now use theme variables with light-mode overrides; synapses are clearly visible in light mode.
- **Concept library legibility**: level chips (Foundation/Intermediate/Advanced) used hardcoded pastel hex tuned for dark mode and were low-contrast on white; switched to the themed `--teal`/`--amber`/`--rose` variables. The card background was near-invisible (`rgba(127,127,127,.06)`); switched to the themed `--panel2`. Legible in both themes.
- **Responsive header**: the Study Console tab row now always wraps to its own line, so tab placement is consistent across all 7 languages instead of depending on how wide that language's tab labels happen to be.
- **Mobile layout (≤640px)**: brand on its own row, shell tabs as full-width stacked buttons, theme toggle and language selector spread across the bottom row — tidy and identical across all 7 languages, instead of the brand and first tab crowding onto one line.
- Renamed the system-theme button's tooltip from "Windows Default" to "System" (the app has never been Windows-specific — it follows the OS's `prefers-color-scheme` on any platform).

## Blueprint taxonomy restructure

- Restructured the Study Console around the **official CCA-F blueprint** (from [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn)): **5 domains → 30 task statements → 59 concepts**, replacing the previous 7-phase / 14-module organization as the app's primary navigation.
- **Re-tagged all 157 questions** to a task statement; a question's domain is now derived from its tag (one source of truth), which fixed the old module→domain mismatches (e.g. Grep/Glob "codebase search" questions now sit under Tool Design & MCP, not Claude Code; session-resumption questions under Agentic Architecture, not Context). 94 questions stayed in their original domain, 63 moved as blueprint corrections.
- **Learning Path**: now lists the 5 domains in blueprint weight order (D1 27% → D5 15%), each expanding to its task statements with per-domain and per-task-statement progress.
- **Study mode**: filter by domain → task statement, plus a non-domain "Mixed / Applied" set for cross-cutting, exam-style practice (the 14 originally-mixed questions).
- **Exam by Domain**: chips are now task statements grouped under their domains; the in-quiz meta line shows each question's task statement.
- **New Concepts tab**: all 59 blueprint concepts grouped by domain → task statement, each with its one-line core insight and a Foundation / Intermediate / Advanced level chip.
- **Neuron Map**: domain labels updated to the official blueprint names.
- Retired the synthetic "Mixed / Applied" 6th domain, the `PHASES`/module structure, and the `MODULE_DOMAIN` map.
- Verified end-to-end in a real browser (Playwright): all five domains / 30 task statements / 59 concepts render, the quiz pools all 157 questions by task statement, zero console errors, both light and dark themes.
- Built **English-first**, then fully localized: all 170 new UI strings (30 task-statement titles, 59 concept titles + 59 insights, 5 domain labels + descriptions, the 3 level words, and the new copy) were translated into Vietnamese, Japanese, Simplified & Traditional Chinese, Spanish, and Korean — in the app dictionaries (696 keys each) and the staged `translations/*.json` files — with technical/code terms kept in English. All seven READMEs were refreshed to the new taxonomy. Spec-kit round for this change is under `specs/002-blueprint-taxonomy/`.

## Languages

- Added full Chinese (ZH) and Spanish (ES) translations, bringing the app to five languages: English, Vietnamese, Japanese, Chinese, Spanish.
- Filled in translation gaps that existed even in the original VN/JA dictionaries:
  - The six **core principle cards** (Cheat & Keywords tab) — title + body for all six, all four non-English languages.
  - The **decision rules table** (73 strings: 7 section headers + `REACH FOR`/`TRAP` cell text). The `IF THE STEM SAYS` column is intentionally left in English, since those are literal exam-stem phrases you need to recognize verbatim in the real exam.
  - All **14 quiz category tags** (e.g. "Agent vs. Workflow Design") shown in the Exam by Domain header — only 1 of 14 had a translation before.
  - The Study Console **source line** ("source · CCA-F_Study_Guide.md · …").
- Fixed two dynamic (non-static) strings that could never match a fixed dictionary entry, since they contain runtime numbers:
  - The question-count badge ("N Qs") — added a regex-based fallback keyed off the trailing unit word.
  - The quiz progress counter ("Question 4 / 12") — added a dedicated per-language formatter.
- Language switcher UI: converted from a row of 2-letter buttons (EN/VN/JA/ZH/ES) to a `<select>` dropdown with full language names.
- Added **Traditional Chinese (TW)**, alongside the existing Simplified (ZH), by converting the full 526-entry Simplified dictionary character-by-character (with phrase-level overrides for context-dependent characters like 复/干/系/签, which map to different traditional forms depending on the word — e.g. 复习→複習 but 恢复→恢復, and 标签→標籤 not 標簽). Verified zero leftover Simplified characters in the output.
- Dropdown order settled after a couple of rounds of feedback: Latin-script languages first, alphabetically (English, Español, Tiếng Việt), then CJK languages grouped together (简体中文, 繁體中文, 日本語).
- Updated all six README files' language switch-link row and "Features" bullet to reflect all six languages, in the same order, and added `README.zh-tw.md`.

## Theme

- Added a Light / Dark / Windows Default (system) theme switch, styled as a 3-way icon toggle (sun / moon / monitor SVGs) next to the language dropdown.
- "Windows Default" follows the OS's `prefers-color-scheme` live — it updates automatically if the OS theme changes while selected.
- Preference persists via `localStorage` (defaults to Dark, matching the app's original look).
- Built a full light-theme palette: CSS variables for the shell chrome (nav, tabs, badges) plus per-tool-pane overrides for all four tools (Study Console, Study Hub, Neuron Map, 2-Week Plan), reusing each pane's existing scoped variable names.

## Bug fixes

- **Learning Path timeline** (Study Hub): the vertical connector line between stage badges was painting on top of the percentage number, obscuring it. Fixed with a z-index on the badge.
- **Neuron Map, light mode**:
  - Domain hub circles had a hardcoded dark-navy fill, so they stayed dark (and their labels unreadable) even in light mode. Now theme-aware.
  - The dashed cross-domain "synapse" arcs had no `fill:none`, so the browser filled the implied closed shape under each curve — rendering as large dark wedge-shaped shadows, especially visible against a light background. Fixed.
  - Synapse line opacity/stroke-width bumped specifically for light mode, since the default styling (tuned for a dark background) was too washed out against a light one.

## Neuron Map layout

The leaf-label layout went through several iterations to balance three competing constraints: avoiding label overlap, keeping text legible, and keeping the diagram compact enough to not require heavy scrolling. Final approach:

- Each domain's leaves sit on a single ring (not a stagger/zig-zag), consistent with a clean radial "neuron map" look.
- A domain's ring radius is computed from its actual content (sum of label widths + gaps ÷ angular span), so a domain with more/longer labels (like D1's 7 leaves) gets more room automatically — capped at a fixed maximum so the overall canvas stays a predictable, modest size.
- Given that cap, the busiest domains (D1 most of all) may show a couple of labels sitting close together rather than perfectly spaced — a deliberate trade-off to keep the page from requiring a lot of vertical scrolling.

## Documentation

- Created `README.zh-cn.md`, `README.es.md`, and `README.zh-tw.md` (mirroring the existing README structure) and cross-linked all six README files to each other.
- Renamed `README.zh.md` → `README.zh-cn.md` for symmetry with `README.zh-tw.md` (the in-app language code stays `zh` — this was a docs-only rename). Updated every cross-reference: the other five READMEs, `CHANGELOG.md`, and the `update-readme-languages` skill.
- This changelog.

## Tooling

- Added two project-local Claude Code skills (`.claude/skills/`): `add-language` (the full process for adding a new UI language, including the Simplified/Traditional-Chinese-style ambiguous-character gotchas) and `update-readme-languages` (keeping the README switch-links and the app's language dropdown in sync when reordering/adding/removing a language).
- Added `SPEC_KIT_INTEGRATION_PLAN.md` — a plan for adopting [spec-kit](https://github.com/github/spec-kit) for future feature work on this app (constitution → spec → plan → tasks → implement), with `github-mcp-server` and `context7` evaluated and deferred/skipped as not currently needed for a dependency-free single-file app.
- Added a **language expansion priority list** to the plan doc: Korean, Portuguese (Brazil), French, German (no new engineering lift), then Russian, Italian, with Arabic/Hebrew flagged separately since this app has no RTL layout support yet.
- Executed the spec-kit integration plan: installed the `specify` CLI, scaffolded `.specify/` (templates, scripts, workflow) and the `speckit-*` Claude Code skills, and ratified the initial project **constitution** (`.specify/memory/constitution.md`, v1.0.0) — five principles covering the single-file/zero-dependency rule, i18n-first UI copy, theme parity, safe large-dictionary editing, and documentation currency. Feature work going forward can use `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- Split the `add-language` skill's translation step out into a new **`fetch-language-dictionary`** skill: it generates the full 531-key translated dictionary and stages it at `translations/<code>.json`, without touching the app file. `add-language` now only does the mechanical wiring (inject into the HTML, dropdown option, all six READMEs), reading from that staged file instead of translating inline. This means a failed or reworked injection never forces re-translating from scratch, the staged JSON is reviewable on its own before anything touches the 600KB app file, and it rides along in a language's PR as a clean diff of just the translations. `cca-f-study-suite.html`'s five per-language dictionaries were also reformatted from single 30–50KB lines to indented multi-line JSON, so they're now directly readable/diffable in an editor.
- Backfilled `translations/{vn,ja,zh,tw,es}.json` for the five already-shipped non-English languages by extracting their existing dictionaries straight out of `cca-f-study-suite.html` into the same schema `fetch-language-dictionary` uses for new languages — purely mechanical, no translation involved. Brings all six supported languages to a consistent staged-file baseline for future review or correction, without needing to hand-edit the app file directly.
- Clarified `fetch-language-dictionary`'s script-conversion guidance (e.g. deriving Traditional Chinese from Simplified): the source to convert from can be another language's staged `translations/<code>.json`, not only an in-app dictionary — needed when a derived-script pair is added together for the first time, before either has been wired into the app.
- Settled the per-language branch-naming convention on `feat/add-<language>-language` (spelled-out language name, e.g. `feat/add-korean-language`) instead of the two-letter code, for readability.
- Every language addition now requires one spec-kit round (`/speckit-plan` → `/speckit-tasks`, producing `plan.md`/`tasks.md` on that language's own branch) before `fetch-language-dictionary`/`add-language` run — codified as FR-009 in `specs/001-add-language/spec.md` and checked by both skills.
- Added a **`squash-merge-pr`** skill: crafts this project's squash-merge commit message convention (`<type>: <title> #<PR-number>`, body bullets preserving what a squash would otherwise erase — process changes, bugs found during the work, flagged follow-ups) instead of relying on GitHub's auto-filled commit-list message.

## Languages (in progress)

- **Korean (한국어)** — fully wired into `cca-f-study-suite.html` (dropdown, `MAPS`/`SHELLS`/`QS_UNIT`/`QUESTION_FMT`), all six existing READMEs updated, `README.ko.md` added. Verified in a real browser via Playwright — zero console errors, all core UI renders correctly. Open as PR #1 (`feat/add-korean-language`), not yet merged to `main`.
