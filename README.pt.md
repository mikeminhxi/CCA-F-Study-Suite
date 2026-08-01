# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇹 Italiano](README.it.md) · **🇧🇷 Português** · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md)

🔗 **Demo ao vivo:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Um único arquivo HTML autocontido para estudar a prova **Claude Certified Architect — Foundations (CCA-F)** da Anthropic. Sem build, sem servidor, sem dependências para instalar — basta abrir `index.html` em um navegador.

## Como abrir

Dê duplo clique em [index.html](index.html), ou sirva com qualquer servidor de arquivos estático. O progresso é salvo localmente no navegador (`localStorage`), por dispositivo/navegador.

## O que tem dentro

A página é um shell com abas contendo quatro ferramentas. Em telas de largura desktop (900px ou mais), ela trava em um layout de altura fixa com uma barra de navegação superior fixa, para que cada ferramenta role de forma independente; abaixo dessa largura, ela volta a ser uma página com rolagem contínua.

| Aba | Finalidade |
|---|---|
| **Study Console** | O treinador principal. Uma trilha de aprendizado organizada pelos 5 domínios oficiais da prova (na ordem de peso do blueprint), cada um dividido em seus **task statements**; uma folha de cola com os princípios centrais mais uma tabela de decisão "SE gatilho → ENTÃO padrão"; um modo Study estilo flashcard (filtre por task statement ou pelo conjunto transversal "Mixed / Applied", marque perguntas como Dominada/Revisar, revele explicações, veja chips de palavras-chave marcadas automaticamente); um modo Quiz "Exam by Domain" onde você ativa domínios inteiros ou task statements individuais, escolhe uma quantidade de perguntas, e obtém uma rodada com pontuação e explicação de cada erro, além de uma **repetição** de um clique que refaz só as perguntas que você errou, com feedback imediato pergunta a pergunta; e uma aba **Concepts** listando os 59 conceitos do blueprint por domínio → task statement, cada um com seu insight central e um nível Foundation/Intermediate/Advanced. |
| **Study Hub** | Uma visão de referência organizada pelos 5 domínios oficiais da prova (ponderados D1–D5), com regras de decisão por domínio, armadilhas a evitar, e gatilhos de palavras-chave, além de uma tabela de decodificação rápida pesquisável. |
| **Neuron Map** | Um mapa de conceitos SVG interativo conectando os domínios da prova aos seus subtópicos, com conexões "sinapse" entre domínios que você pode clicar e seguir. |
| **2-Week Plan** | Um plano de estudo em checklist dia a dia com sua própria barra de progresso; inclui um fallback manual de exportação/importação JSON para contextos onde `localStorage` não está disponível (ex.: algumas configurações `file://`). |

## Conteúdo

- **156 perguntas de prática**, extraídas de `CCA-F_Study_Guide.md`. Um par com uma resposta correta genuinamente contraditória na fonte é sinalizado com um selo ⚠ no modo Study.
- O app é organizado em torno do **blueprint oficial do CCA-F**: **5 domínios → 30 task statements → 59 conceitos**. Cada pergunta é marcada em um task statement, e seu domínio decorre dessa marcação. Os cinco domínios, na ordem de peso da prova: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%), e Context & Reliability (15%). (Taxonomia do blueprint de [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Funcionalidades

- **Seletor de idioma EN / FR / DE / IT / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU** — uma camada de troca de texto em tempo real traduz o conteúdo na tela entre inglês, francês, alemão, italiano, português, espanhol, vietnamita, chinês simplificado, chinês tradicional, japonês, coreano, hindi e russo sem recarregar a página; o idioma escolhido persiste entre visitas.
- **Temas Claro / Escuro / Sistema / Sepia** — escolha uma aparência clara ou escura fixa, siga a configuração do sistema, ou mude para um tema Sepia em tons quentes de âmbar e creme (que também se adapta automaticamente a claro/escuro); a escolha persiste entre visitas.
- **Palavras-chave marcadas automaticamente** — cada pergunta é verificada contra uma lista de dezenas de termos típicos da prova (ex.: "MCP resource", "stateless", "tool_choice") e mostra as que encontrou como chips, para que a frase reveladora salte aos olhos antes de você ler a explicação.
- **Persistência local** — o progresso de estudo (marcações de dominada/revisar) e o estado do checklist do plano são salvos via `localStorage`, com um fallback em memória para a aba atual caso o armazenamento esteja bloqueado.
- **Zero dependências** — JS/CSS/SVG puro em um único arquivo; as únicas chamadas externas são as Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Apoio opcional** — um botão "☕ Buy me a coffee" (sempre visível na navegação superior, além de um aviso ao terminar uma prova de prática) abre um modal com QR codes para algumas opções de pagamento; totalmente opcional e ocultado automaticamente se nenhuma imagem de QR estiver configurada.

## Aviso legal

Não é afiliado nem endossado pela Anthropic. Conteúdo apenas para prática — não é a prova oficial.
