# CCA-F Study Suite

[🇺🇸 English](README.md) · **🇫🇷 Français** · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇹🇭 ไทย](README.th.md)

🔗 **Démo en ligne :** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Un fichier HTML autonome pour préparer l'examen de certification Anthropic **Claude Certified Architect — Foundations (CCA-F)**. Pas d'étape de build, pas de serveur, aucune dépendance à installer — ouvrez simplement `index.html` dans un navigateur.

## Ouvrir le fichier

Double-cliquez sur [index.html](index.html), ou servez-le avec n'importe quel serveur de fichiers statique. La progression est sauvegardée localement dans le navigateur (`localStorage`), par appareil/navigateur.

## Contenu de la page

La page est une coquille à onglets regroupant quatre outils. Sur les écrans de largeur bureau (900px et plus), elle se verrouille dans une mise en page à hauteur fixe avec une barre de navigation supérieure fixe, de sorte que chaque outil défile indépendamment ; en dessous de cette largeur, elle revient à une seule page à défilement continu.

| Onglet | Objectif |
|---|---|
| **Study Console** | L'outil d'entraînement principal. Un parcours d'apprentissage organisé selon les 5 domaines officiels de l'examen (dans l'ordre de poids du blueprint), chacun décomposé en ses **task statements** ; un aide-mémoire des principes clés plus un tableau de décision « IF déclencheur → THEN schéma » ; un mode Study façon flashcard (filtrez par task statement ou par l'ensemble transversal « Mixed / Applied », marquez les questions Acquis/À revoir, révélez les explications, consultez les puces de mots-clés auto-détectés) ; un mode Quiz « Exam by Domain » où vous activez des domaines entiers ou des task statements individuels, choisissez un nombre de questions, et obtenez une session notée avec chaque erreur expliquée, plus une **reprise** en un clic qui ne repose que sur les questions ratées, avec un retour immédiat question par question ; et un onglet **Concepts** listant les 59 concepts du blueprint par domaine → task statement, chacun avec son insight clé et un niveau Foundation/Intermediate/Advanced. |
| **Study Hub** | Une vue de référence organisée selon les 5 domaines officiels de l'examen (pondérés D1–D5), avec des règles de décision par domaine, des pièges à éviter, et des mots-clés déclencheurs, plus un tableau de décodage rapide consultable. |
| **Neuron Map** | Une carte de concepts SVG interactive reliant les domaines de l'examen à leurs sous-thèmes, avec des connexions « synapse » inter-domaines que vous pouvez explorer en cliquant. |
| **2-Week Plan** | Un plan d'étude en checklist jour par jour avec sa propre barre de progression ; inclut une solution de repli manuelle d'export/import JSON pour les contextes où `localStorage` n'est pas disponible (par ex. certaines configurations `file://`). |

## Contenu pédagogique

- **156 questions d'entraînement**, tirées de `CCA-F_Study_Guide.md`. Une paire dont la réponse correcte est réellement contradictoire dans la source est signalée par un badge ⚠ en mode Study.
- L'application est organisée autour du **blueprint officiel du CCA-F** : **5 domaines → 30 task statements → 59 concepts**. Chaque question est rattachée à un task statement, et son domaine en découle. Les cinq domaines, dans l'ordre de poids de l'examen : Agentic Architecture (27 %), Tool Design & MCP (18 %), Claude Code & Workflows (20 %), Prompt Engineering & Output (20 %), et Context & Reliability (15 %). (Taxonomie du blueprint tirée de [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Fonctionnalités

- **Sélecteur de langue EN / FR / DE / ID / IT / MS / PL / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU / TH** — une couche de remplacement de texte en temps réel traduit le contenu affiché entre l'anglais, le français, l'allemand, l'indonésien, l'italien, le malais, le polonais, le portugais, l'espagnol, le vietnamien, le chinois simplifié, le chinois traditionnel, le japonais, le coréen, l'hindi, le russe et le thaï sans recharger la page ; la langue choisie est conservée lors des visites futures.
- **Thèmes Clair / Sombre / Système / Sépia** — choisissez un rendu clair ou sombre fixe, suivez le réglage du système, ou passez à un thème « Sépia » chaleureux ambre et crème (qui s'adapte aussi automatiquement au clair/sombre) ; le choix est conservé lors des visites futures.
- **Mots-clés auto-détectés** — chaque question est comparée à une liste de dizaines de termes fréquents de l'examen (ex. « MCP resource », « stateless », « tool_choice ») et affiche ceux qui correspondent sous forme de puces, pour que la phrase révélatrice saute aux yeux avant même de lire l'explication.
- **Persistance locale** — la progression d'étude (marques Acquis/À revoir) et l'état de la checklist du plan sont sauvegardés via `localStorage`, avec une solution de repli en mémoire pour l'onglet actuel si le stockage est bloqué.
- **Zéro dépendance** — JS/CSS/SVG pur dans un seul fichier ; les seuls appels externes sont Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Soutien optionnel** — un bouton « ☕ Offrez-moi un café » (toujours visible dans la barre de navigation supérieure, avec un rappel après avoir terminé un examen d'entraînement) ouvre une fenêtre avec des codes QR pour quelques moyens de paiement ; entièrement optionnel et masqué automatiquement si aucune image QR n'est configurée.

## Avertissement

Non affilié ni approuvé par Anthropic. Contenu d'entraînement uniquement — ce n'est pas l'examen officiel.
