# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇳🇱 Nederlands](README.nl.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · **🇸🇪 Svenska** · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇺🇦 Українська](README.uk.md) · [🇹🇭 ไทย](README.th.md) · [🇬🇷 Ελληνικά](README.el.md)

🔗 **Live-demo:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

En fristående statisk app för att plugga inför Anthropics certifieringsexamen **Claude Certified Architect — Foundations (CCA-F)**. Inget build-steg, ingen server, inga beroenden att installera — ladda ner mappen och öppna `index.html` i en webbläsare.

## Öppna appen

Dubbelklicka på [index.html](index.html), eller servera den med valfri statisk filserver. Framsteg sparas lokalt i webbläsaren (`localStorage`), per enhet/webbläsare. Håll `style.css` och `content.js` kvar bredvid `index.html` — appen behöver båda; öppnas `index.html` för sig visas ett felmeddelande i stället för att appen laddas. Lägg också till mappen `translations/` för alla språk utom engelska — saknas den faller appen tyst tillbaka till engelska.

## Vad som finns i appen

Sidan är ett flikskal som samlar fyra verktyg. På skärmar med desktopbredd (900px och uppåt) låses layouten till en fast höjd med en fastklistrad övre navigeringsrad, så att varje verktyg kan scrollas oberoende av de andra; under den bredden faller sidan tillbaka till en enda sammanhängande scrollbar sida.

| Flik | Syfte |
|---|---|
| **Study Console** | Huvudverktyget för övning. En inlärningsväg organiserad efter de 5 officiella examensdomänerna (i blueprintets viktordning), var och en uppdelad i sina **task statements**; ett fusklapp med kärnprinciper plus en beslutstabell "OM utlösare → DÅ mönster"; ett flashcard-liknande Study-läge (filtrera på task statement eller den domänövergripande "Mixed / Applied"-mängden, markera frågor som Kan/Repetera, visa förklaringar, se automatiskt taggade nyckelordschips); ett quiz-läge "Exam by Domain" där du slår på hela domäner eller enskilda task statements, väljer antal frågor och får en poängsatt session med varje missad fråga förklarad, plus ett **omtag** med ett klick som bara kör de frågor du missade igen med omedelbar feedback per fråga; samt en **Concepts**-flik som listar alla 59 blueprint-koncept efter domän → task statement, vart och ett med sin kärninsikt och en nivå Foundation/Intermediate/Advanced. |
| **Study Hub** | En referensvy organiserad efter de 5 officiella examensdomänerna (viktade D1–D5), med beslutsregler, fällor att undvika och utlösande nyckelord per domän, plus en sökbar snabbavkodningstabell. |
| **Neuron Map** | En interaktiv SVG-konceptkarta som kopplar samman examensdomäner med deras delämnen, med domänöverskridande "synaps"-kopplingar du kan klicka dig igenom. |
| **2-Week Plan** | En dag-för-dag-checklista som studieplan med egen förloppsindikator; innehåller en manuell JSON-export/import som reservlösning för kontexter där `localStorage` inte är tillgängligt (t.ex. vissa `file://`-uppsättningar). |

## Innehåll

- **156 övningsfrågor**, hämtade från `CCA-F_Study_Guide.md`. Ett par vars korrekta svar verkligen är motstridigt i källmaterialet är markerat med en ⚠-badge i Study-läget.
- Appen är organiserad kring den **officiella CCA-F-blueprinten**: **5 domäner → 30 task statements → 59 koncept**. Varje fråga är taggad till ett task statement, och dess domän följer av den taggen. De fem domänerna, i examensviktordning: Agentic Architecture (27 %), Tool Design & MCP (18 %), Claude Code & Workflows (20 %), Prompt Engineering & Output (20 %), och Context & Reliability (15 %). (Blueprint-taxonomi från [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Funktioner

- **EN / NL / FR / DE / ID / IT / MS / PL / PT / ES / SV / VN / ZH / TW / JA / KO / HI / RU / UK / TH / EL språkväxlare** — ett textbytarlager i realtid översätter skärmtexten mellan engelska, nederländska, franska, tyska, indonesiska, italienska, malajiska, polska, portugisiska, spanska, svenska, vietnamesiska, förenklad kinesiska, traditionell kinesiska, japanska, koreanska, hindi, ryska, ukrainska, thailändska och grekiska utan omladdning; det valda språket bevaras mellan besök.
- **Ljust / Mörkt / System / Sepia-teman** — välj ett fast ljust eller mörkt utseende, följ operativsystemets inställning, eller växla till ett varmt bärnstens- och gräddfärgat Sepia-tema (som också anpassar sig automatiskt till ljust/mörkt); valet bevaras mellan besök.
- **Automatiskt taggade nyckelord** — varje fråga kontrolleras mot en lista med dussintals vanliga examenstermer (t.ex. "MCP resource", "stateless", "tool_choice") och visar träffarna som chips, så att den avslöjande frasen sticker ut innan du läser förklaringen.
- **Lokal beständighet** — studieframsteg (Kan/Repetera-markeringar) och planens checklistestatus sparas via `localStorage`, med en reservlösning i minnet för aktuell flik om lagring är blockerad.
- **Noll beroenden** — ren JS/CSS/SVG utan ramverk eller byggverktyg; de enda externa anropen går till Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Frivilligt stöd** — en "☕ Bjud mig på en kaffe"-knapp (alltid synlig i den övre navigeringsraden, plus en uppmaning efter avslutad övningsexamen) öppnar en ruta med QR-koder för några betalningsalternativ; helt frivilligt och döljs automatiskt om inga QR-bilder är konfigurerade.

## Ansvarsfriskrivning

Inte anslutet till eller godkänt av Anthropic. Endast övningsinnehåll — inte den officiella examen.
