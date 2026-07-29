# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · **🇩🇪 Deutsch** · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md)

🔗 **Live-Demo:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Eine eigenständige HTML-Datei zur Vorbereitung auf die Anthropic-Zertifizierungsprüfung **Claude Certified Architect — Foundations (CCA-F)**. Kein Build-Schritt, kein Server, keine zu installierenden Abhängigkeiten — öffnen Sie einfach `index.html` in einem Browser.

## Datei öffnen

Doppelklicken Sie auf [index.html](index.html), oder stellen Sie sie über einen beliebigen statischen Dateiserver bereit. Der Fortschritt wird lokal im Browser (`localStorage`) gespeichert, pro Gerät/Browser.

## Seiteninhalt

Die Seite ist eine Tab-Hülle, die vier Tools zusammenfasst. Auf Desktop-breiten Bildschirmen (ab 900px) rastet sie in ein Layout mit fester Höhe und fixierter oberer Navigationsleiste ein, sodass jedes Tool unabhängig scrollt; unterhalb dieser Breite fällt sie auf eine einzelne, durchgehend scrollbare Seite zurück.

| Tab | Zweck |
|---|---|
| **Study Console** | Das zentrale Übungstool. Ein Lernpfad, gegliedert nach den 5 offiziellen Prüfungsdomänen (in der Gewichtungsreihenfolge des Blueprints), jeweils weiter unterteilt in ihre **Task Statements**; ein Aide-mémoire der Kernprinzipien plus eine Entscheidungstabelle „WENN Auslöser → DANN Muster"; ein Flashcard-artiger Study-Modus (filtern nach Task Statement oder dem übergreifenden „Mixed / Applied"-Set, Fragen als Bekannt/Zu wiederholen markieren, Erklärungen aufdecken, automatisch erkannte Schlagwort-Chips einsehen); ein „Exam by Domain"-Quiz-Modus, in dem Sie ganze Domänen oder einzelne Task Statements aktivieren, eine Fragenanzahl wählen und eine bewertete Sitzung mit Erklärung jedes Fehlers erhalten; sowie ein **Concepts**-Tab, der die 59 Blueprint-Konzepte nach Domäne → Task Statement auflistet, jeweils mit Kern-Insight und Stufe Foundation/Intermediate/Advanced. |
| **Study Hub** | Eine Referenzansicht, gegliedert nach den 5 offiziellen Prüfungsdomänen (gewichtet D1–D5), mit Entscheidungsregeln pro Domäne, zu vermeidenden Fallstricken und Auslöser-Schlagwörtern, plus einer durchsuchbaren Schnellentschlüsselungstabelle. |
| **Neuron Map** | Eine interaktive SVG-Konzeptkarte, die Prüfungsdomänen mit ihren Unterthemen verbindet, mit domänenübergreifenden „Synapsen"-Verbindungen, die Sie per Klick erkunden können. |
| **2-Week Plan** | Ein tageweiser Checklisten-Lernplan mit eigenem Fortschrittsbalken; enthält eine manuelle JSON-Export/Import-Notlösung für Kontexte, in denen `localStorage` nicht verfügbar ist (z. B. bestimmte `file://`-Konfigurationen). |

## Lerninhalt

- **156 Übungsfragen**, entnommen aus `CCA-F_Study_Guide.md`. Ein Paar, dessen korrekte Antwort in der Quelle tatsächlich widersprüchlich ist, wird im Study-Modus mit einem ⚠-Badge gekennzeichnet.
- Die App ist um den **offiziellen CCA-F-Blueprint** herum organisiert: **5 Domänen → 30 Task Statements → 59 Konzepte**. Jede Frage ist einem Task Statement zugeordnet, aus dem sich ihre Domäne ergibt. Die fünf Domänen, in der Gewichtungsreihenfolge der Prüfung: Agentic Architecture (27 %), Tool Design & MCP (18 %), Claude Code & Workflows (20 %), Prompt Engineering & Output (20 %) und Context & Reliability (15 %). (Blueprint-Taxonomie entnommen aus [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Funktionen

- **Sprachumschalter EN / FR / DE / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI** — eine Laufzeit-Textersetzungsschicht übersetzt den angezeigten Inhalt zwischen Englisch, Französisch, Deutsch, Portugiesisch, Spanisch, Vietnamesisch, vereinfachtem Chinesisch, traditionellem Chinesisch, Japanisch, Koreanisch und Hindi, ohne neu zu laden; die gewählte Sprache bleibt über Besuche hinweg erhalten.
- **Automatisch erkannte Schlagwörter** — jede Frage wird mit einer Liste von Dutzenden gängiger Prüfungsbegriffe abgeglichen (z. B. „MCP resource", „stateless", „tool_choice") und zeigt Treffer als Chips an, damit der entscheidende Hinweissatz schon vor dem Lesen der Erklärung ins Auge fällt.
- **Lokale Persistenz** — Lernfortschritt (Bekannt/Zu-wiederholen-Markierungen) und der Checklistenstatus des Plans werden über `localStorage` gespeichert, mit einem In-Memory-Fallback für den aktuellen Tab, falls der Speicher blockiert ist.
- **Null Abhängigkeiten** — reines JS/CSS/SVG in einer einzigen Datei; die einzigen externen Aufrufe gelten Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Optionale Unterstützung** — eine Schaltfläche „☕ Spendier mir einen Kaffee" (immer sichtbar in der oberen Navigationsleiste, mit einer Erinnerung nach Abschluss einer Übungsprüfung) öffnet ein Fenster mit QR-Codes für ein paar Zahlungsmethoden; vollständig optional und wird automatisch ausgeblendet, wenn keine QR-Bilder konfiguriert sind.

## Haftungsausschluss

Nicht mit Anthropic verbunden oder von Anthropic unterstützt. Nur Übungsinhalt — dies ist nicht die offizielle Prüfung.
