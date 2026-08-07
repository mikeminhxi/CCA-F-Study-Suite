# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇳🇱 Nederlands](README.nl.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · **🇮🇹 Italiano** · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇸🇪 Svenska](README.sv.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇺🇦 Українська](README.uk.md) · [🇹🇭 ไทย](README.th.md) · [🇬🇷 Ελληνικά](README.el.md) · [🇸🇦 العربية](README.ar.md)

🔗 **Demo live:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Un'app statica autonoma per prepararsi all'esame di certificazione Anthropic **Claude Certified Architect — Foundations (CCA-F)**. Nessun passaggio di build, nessun server, nessuna dipendenza da installare — scarica la cartella e apri `index.html` in un browser.

## Aprire il file

Fai doppio clic su [index.html](index.html), oppure servilo tramite un qualsiasi server di file statici. I progressi vengono salvati localmente nel browser (`localStorage`), per dispositivo/browser. Tieni `style.css` e `content.js` accanto a `index.html` — l'app ha bisogno di entrambi; se `index.html` viene aperto da solo, verrà mostrato un errore invece di caricarsi. Aggiungi anche la cartella `translations/` per qualsiasi lingua diversa dall'inglese — se manca, l'app torna silenziosamente all'inglese.

## Contenuto della pagina

La pagina è un guscio a schede che raggruppa quattro strumenti. Sugli schermi di larghezza desktop (da 900px in su) si blocca in un layout ad altezza fissa con una barra di navigazione superiore fissa, così ogni strumento scorre in modo indipendente; sotto questa larghezza torna a una singola pagina a scorrimento continuo.

| Scheda | Scopo |
|---|---|
| **Study Console** | Lo strumento principale per l'esercitazione. Un percorso di apprendimento organizzato secondo i 5 domini ufficiali dell'esame (nell'ordine di peso del blueprint), ciascuno suddiviso nei propri **task statement**; un promemoria dei principi chiave più una tabella delle decisioni "SE trigger → ALLORA schema"; una modalità Study simile a flashcard (filtra per task statement o per l'insieme trasversale "Mixed / Applied", contrassegna le domande come Conosciute/Da rivedere, rivela le spiegazioni, consulta i chip di parole chiave rilevate automaticamente); una modalità quiz "Exam by Domain" in cui attivi interi domini o singoli task statement, scegli un numero di domande e ottieni una sessione valutata con la spiegazione di ogni errore, più un **ripasso** con un clic che ripropone solo le domande sbagliate con feedback immediato domanda per domanda; e una scheda **Concepts** che elenca i 59 concetti del blueprint per dominio → task statement, ciascuno con un'idea chiave e un livello Foundation/Intermediate/Advanced. |
| **Study Hub** | Una vista di riferimento organizzata secondo i 5 domini ufficiali dell'esame (pesati D1–D5), con regole decisionali per dominio, trappole da evitare e parole chiave trigger, più una tabella di decodifica rapida consultabile. |
| **Neuron Map** | Una mappa concettuale SVG interattiva che collega i domini dell'esame ai loro sottotemi, con connessioni "sinapsi" tra domini che puoi esplorare cliccando. |
| **2-Week Plan** | Un piano di studio in checklist giorno per giorno con la propria barra di avanzamento; include un'alternativa manuale di esportazione/importazione JSON per i contesti in cui `localStorage` non è disponibile (ad es. alcune configurazioni `file://`). |

## Contenuto didattico

- **156 domande di pratica**, tratte da `CCA-F_Study_Guide.md`. Una coppia la cui risposta corretta è effettivamente contraddittoria nella fonte è contrassegnata con un badge ⚠ in modalità Study.
- L'app è organizzata attorno al **blueprint ufficiale del CCA-F**: **5 domini → 30 task statement → 59 concetti**. Ogni domanda è collegata a un task statement, da cui deriva il suo dominio. I cinque domini, nell'ordine di peso dell'esame: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%) e Context & Reliability (15%). (Tassonomia del blueprint tratta da [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Funzionalità

- **Selettore di lingua EN / NL / FR / DE / ID / IT / MS / PL / PT / ES / SV / VN / ZH / TW / JA / KO / HI / RU / UK / TH / EL / AR** — un livello di sostituzione del testo in tempo reale traduce i contenuti a schermo tra inglese, olandese, francese, tedesco, indonesiano, italiano, malese, polacco, portoghese, spagnolo, svedese, vietnamita, cinese semplificato, cinese tradizionale, giapponese, coreano, hindi, russo, ucraino, thailandese, greco e arabo senza ricaricare la pagina; la lingua scelta viene mantenuta nelle visite successive.
- **Temi Chiaro / Scuro / Sistema / Sepia** — scegli un aspetto chiaro o scuro fisso, segui l'impostazione del sistema operativo, oppure passa a un caldo tema Sepia ambra e crema (che si adatta automaticamente anche a chiaro/scuro); la scelta viene mantenuta nelle visite successive.
- **Parole chiave rilevate automaticamente** — ogni domanda viene confrontata con un elenco di decine di termini frequenti dell'esame (ad es. "MCP resource", "stateless", "tool_choice") e mostra le corrispondenze come chip, così la frase rivelatrice salta all'occhio ancora prima di leggere la spiegazione.
- **Persistenza locale** — i progressi di studio (contrassegni Conosciuto/Da rivedere) e lo stato della checklist del piano vengono salvati tramite `localStorage`, con un fallback in memoria per la scheda corrente se lo storage è bloccato.
- **Zero dipendenze** — puro JS/CSS/SVG, senza framework né strumenti di build; le uniche chiamate esterne sono verso Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Supporto facoltativo** — un pulsante "☕ Offrimi un caffè" (sempre visibile nella barra di navigazione superiore, con un promemoria dopo aver completato un esame di pratica) apre una finestra con codici QR per alcuni metodi di pagamento; completamente facoltativo e si nasconde automaticamente se non è configurata alcuna immagine QR.

## Avvertenza

Non affiliato né approvato da Anthropic. Solo contenuto di pratica — non è l'esame ufficiale.
