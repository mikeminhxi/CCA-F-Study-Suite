# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · **🇵🇱 Polski** · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇹🇭 ไทย](README.th.md)

🔗 **Wersja demonstracyjna na żywo:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Samodzielna aplikacja statyczna do nauki przed egzaminem certyfikacyjnym Anthropic **Claude Certified Architect — Foundations (CCA-F)**. Brak kroku budowania, brak serwera, brak zależności do instalacji — pobierz folder i otwórz `index.html` w przeglądarce.

## Jak otworzyć

Kliknij dwukrotnie plik [index.html](index.html) albo udostępnij go za pomocą dowolnego serwera plików statycznych. Postępy są zapisywane lokalnie w przeglądarce (`localStorage`), oddzielnie dla każdego urządzenia/przeglądarki. Trzymaj pliki `style.css` i `content.js` obok pliku `index.html` — aplikacja potrzebuje obu; otwarty samodzielnie `index.html` wyświetli błąd zamiast się wczytać. Dodaj też folder `translations/`, jeśli chcesz korzystać z języka innego niż angielski — bez niego aplikacja po cichu przełączy się na angielski.

## Co zawiera

Strona to zakładkowa powłoka z czterema narzędziami. Na ekranach o szerokości desktopowej (od 900px) układ blokuje się do stałej wysokości z przyklejonym górnym paskiem nawigacji, dzięki czemu każde narzędzie przewija się niezależnie; poniżej tej szerokości strona wraca do jednej, ciągle przewijanej strony.

| Zakładka | Cel |
|---|---|
| **Study Console** | Główne narzędzie do nauki. Ścieżka nauki uporządkowana według 5 oficjalnych domen egzaminu (w kolejności wag z blueprintu), każda podzielona na swoje **task statements**; ściąga z kluczowymi zasadami plus tabela decyzyjna „JEŚLI wyzwalacz → TO wzorzec"; tryb Study w stylu fiszek (filtrowanie według task statement lub przekrojowego zestawu „Mixed / Applied", oznaczanie pytań jako Znane/Do powtórki, odkrywanie wyjaśnień, automatycznie tagowane chipy słów kluczowych); tryb quizu „Exam by Domain", w którym włączasz całe domeny lub pojedyncze task statements, wybierasz liczbę pytań i otrzymujesz ocenianą sesję z wyjaśnieniem każdego błędu, a do tego jednoklikowe **powtórzenie**, które odpytuje ponownie wyłącznie pytania, w których się pomyliłeś, z natychmiastową informacją zwrotną dla każdego pytania; oraz zakładka **Concepts** wyszczególniająca wszystkie 59 koncepcji z blueprintu według domeny → task statement, każda z kluczową myślą i poziomem Foundation/Intermediate/Advanced. |
| **Study Hub** | Widok referencyjny uporządkowany według 5 oficjalnych domen egzaminu (z wagami D1–D5), z regułami decyzyjnymi dla każdej domeny, pułapkami, których należy unikać, oraz słowami kluczowymi-wyzwalaczami, a także przeszukiwalną tabelą szybkiego dekodowania. |
| **Neuron Map** | Interaktywna mapa koncepcji SVG łącząca domeny egzaminu z ich podtematami, z międzydomenowymi połączeniami „synaptycznymi", które można eksplorować, klikając. |
| **2-Week Plan** | Plan nauki w formie codziennej listy kontrolnej z własnym paskiem postępu; zawiera ręczny mechanizm eksportu/importu JSON jako rozwiązanie awaryjne dla kontekstów, w których `localStorage` jest niedostępny (np. niektóre konfiguracje `file://`). |

## Zawartość

- **156 pytań ćwiczeniowych** pochodzących z `CCA-F_Study_Guide.md`. Jedna para pytań, w której poprawna odpowiedź w źródle jest wewnętrznie sprzeczna, jest oznaczona odznaką ⚠ w trybie Study.
- Aplikacja jest zorganizowana wokół **oficjalnego blueprintu CCA-F**: **5 domen → 30 task statements → 59 koncepcji**. Każde pytanie jest przypisane do jednego task statement, a jego domena wynika z tego przypisania. Pięć domen, w kolejności wag egzaminu: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%) oraz Context & Reliability (15%). (Taksonomia blueprintu z [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Funkcje

- **Przełącznik języka EN / FR / DE / ID / IT / MS / PL / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU / TH** — warstwa podmiany tekstu w czasie działania tłumaczy widoczną na ekranie treść między angielskim, francuskim, niemieckim, indonezyjskim, włoskim, malajskim, polskim, portugalskim, hiszpańskim, wietnamskim, chińskim uproszczonym, chińskim tradycyjnym, japońskim, koreańskim, hindi, rosyjskim i tajskim bez przeładowania strony; wybrany język jest zapamiętywany przy kolejnych wizytach.
- **Motywy Light / Dark / System / Sepia** — wybierz stały jasny lub ciemny wygląd, podążaj za ustawieniem systemu operacyjnego albo przełącz się na ciepły, bursztynowo-kremowy motyw Sepia (który również automatycznie dostosowuje się do jasnego/ciemnego trybu); wybór jest zapamiętywany przy kolejnych wizytach.
- **Automatycznie tagowane słowa kluczowe** — każde pytanie jest sprawdzane pod kątem listy kilkudziesięciu egzaminacyjnych haseł (np. „MCP resource", „stateless", „tool_choice") i pokazuje trafienia jako chipy, dzięki czemu kluczowa fraza rzuca się w oczy, zanim przeczytasz wyjaśnienie.
- **Lokalna trwałość danych** — postępy nauki (oznaczenia Znane/Do powtórki) oraz stan listy kontrolnej planu są zapisywane za pomocą `localStorage`, z zapasowym mechanizmem w pamięci dla bieżącej karty, jeśli pamięć jest zablokowana.
- **Zero zależności** — czysty JS/CSS/SVG bez frameworka i narzędzi do budowania; jedynymi zewnętrznymi wywołaniami są Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Opcjonalne wsparcie** — przycisk „☕ Postaw mi kawę" (zawsze widoczny w górnym pasku nawigacji, a dodatkowo przypomnienie po ukończeniu egzaminu próbnego) otwiera okno modalne z kodami QR i kilkoma opcjami płatności; jest całkowicie opcjonalny i automatycznie ukrywany, jeśli nie skonfigurowano żadnych obrazów QR.

## Zastrzeżenie

Brak powiązania z Anthropic ani wsparcia z jego strony. Wyłącznie treści ćwiczeniowe — to nie jest oficjalny egzamin.
