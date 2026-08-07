# CCA-F Study Suite

[🇺🇸 English](README.md) · **🇳🇱 Nederlands** · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇸🇪 Svenska](README.sv.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇺🇦 Українська](README.uk.md) · [🇹🇭 ไทย](README.th.md) · [🇬🇷 Ελληνικά](README.el.md) · [🇸🇦 العربية](README.ar.md)

🔗 **Live demo:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Een zelfstandige statische app om te studeren voor Anthropics **Claude Certified Architect — Foundations (CCA-F)**-certificeringsexamen. Geen build-stap, geen server, geen te installeren dependencies — download de map en open `index.html` in een browser.

## Openen

Dubbelklik op [index.html](index.html), of serveer het met een willekeurige statische bestandsserver. Voortgang wordt lokaal in de browser opgeslagen (`localStorage`), per apparaat/browser. Houd `style.css` en `content.js` naast `index.html` — de app heeft beide nodig; wordt `index.html` alleen geopend, dan verschijnt er een foutmelding in plaats van dat de app laadt. Voeg ook de map `translations/` toe voor elke taal anders dan Engels — zonder die map valt de app stilzwijgend terug op Engels.

## Wat erin zit

De pagina is een tabbladschil die vier tools samenbrengt. Op schermen met desktopbreedte (vanaf 900px) vergrendelt de layout tot een vaste hoogte met een vastgeplakte bovenste navigatiebalk, zodat elke tool onafhankelijk scrolt; onder die breedte valt de pagina terug op één doorlopend scrollende pagina.

| Tab | Doel |
|---|---|
| **Study Console** | De belangrijkste oefentool. Een leerpad, georganiseerd volgens de 5 officiële examendomeinen (in de gewichtsvolgorde van de blueprint), elk onderverdeeld in hun **task statements**; een spiekbriefje met kernprincipes plus een beslistabel "ALS trigger → DAN patroon"; een flashcard-achtige Study-modus (filter op task statement of de overkoepelende "Mixed / Applied"-set, markeer vragen als Gekend/Herhalen, toon uitleg, bekijk automatisch getagde trefwoord-chips); een "Exam by Domain"-quizmodus waarin je hele domeinen of afzonderlijke task statements inschakelt, een aantal vragen kiest en een beoordeelde sessie krijgt met uitleg bij elke fout, plus een **herkansing** met één klik die alleen de fout beantwoorde vragen opnieuw afneemt met directe feedback per vraag; en een **Concepts**-tab die alle 59 blueprint-concepten weergeeft per domein → task statement, elk met een kerninzicht en een niveau Foundation/Intermediate/Advanced. |
| **Study Hub** | Een naslagweergave, georganiseerd volgens de 5 officiële examendomeinen (gewogen D1–D5), met beslisregels per domein, te vermijden valkuilen en trefwoord-triggers, plus een doorzoekbare snel-decodeertabel. |
| **Neuron Map** | Een interactieve SVG-conceptkaart die examendomeinen verbindt met hun subonderwerpen, met domeinoverschrijdende "synaps"-verbindingen die je klikkend kunt verkennen. |
| **2-Week Plan** | Een dag-voor-dag checklist-studieplan met een eigen voortgangsbalk; bevat een handmatige JSON-export/import als noodoplossing voor contexten waarin `localStorage` niet beschikbaar is (bijvoorbeeld sommige `file://`-configuraties). |

## Leerinhoud

- **156 oefenvragen**, afkomstig uit `CCA-F_Study_Guide.md`. Eén paar waarvan het juiste antwoord in de bron daadwerkelijk tegenstrijdig is, wordt in de Study-modus gemarkeerd met een ⚠-badge.
- De app is georganiseerd rond de **officiële CCA-F-blueprint**: **5 domeinen → 30 task statements → 59 concepten**. Elke vraag is gekoppeld aan één task statement, waaruit het domein volgt. De vijf domeinen, in de gewichtsvolgorde van het examen: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%), en Context & Reliability (15%). (Blueprint-taxonomie afkomstig van [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Functies

- **Taalschakelaar EN / NL / FR / DE / ID / IT / MS / PL / PT / ES / SV / VN / ZH / TW / JA / KO / HI / RU / UK / TH / EL / AR** — een runtime tekstvervangingslaag vertaalt de zichtbare inhoud tussen Engels, Nederlands, Frans, Duits, Indonesisch, Italiaans, Maleis, Pools, Portugees, Spaans, Zweeds, Vietnamees, vereenvoudigd Chinees, traditioneel Chinees, Japans, Koreaans, Hindi, Russisch, Oekraïens, Thai, Grieks en Arabisch zonder te herladen; de gekozen taal blijft behouden tussen bezoeken.
- **Licht / Donker / Systeem / Sepia thema's** — kies een vast licht of donker uiterlijk, volg de systeeminstelling, of schakel over naar een warm amberkleurig Sepia-thema (dat zich ook automatisch aanpast aan licht/donker); de keuze blijft behouden tussen bezoeken.
- **Automatisch getagde trefwoorden** — elke vraag wordt vergeleken met een lijst van tientallen veelvoorkomende examentermen (bijv. "MCP resource", "stateless", "tool_choice") en toont de treffers als chips, zodat de veelzeggende zin opvalt voordat je de uitleg leest.
- **Lokale persistentie** — studievoortgang (Gekend/Herhalen-markeringen) en de checkliststatus van het plan worden opgeslagen via `localStorage`, met een fallback in het geheugen voor het huidige tabblad als opslag geblokkeerd is.
- **Geen dependencies** — pure JS/CSS/SVG zonder framework of buildtooling; de enige externe aanroepen zijn naar Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Optionele ondersteuning** — een knop "☕ Trakteer me op een koffie" (altijd zichtbaar in de bovenste navigatiebalk, met een herinnering na het afronden van een proefexamen) opent een venster met QR-codes voor enkele betaalmethoden; volledig optioneel en wordt automatisch verborgen als er geen QR-afbeeldingen zijn geconfigureerd.

## Disclaimer

Niet verbonden aan of onderschreven door Anthropic. Alleen oefeninhoud — dit is niet het officiële examen.
