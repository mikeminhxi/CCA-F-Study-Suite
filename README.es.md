# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇧🇷 Português](README.pt.md) · **🇪🇸 Español** · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md)

🔗 **Demo en vivo:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Un archivo HTML autocontenido para preparar el examen de certificación de Anthropic **Claude Certified Architect — Foundations (CCA-F)**. Sin proceso de compilación, sin servidor, sin dependencias que instalar — solo abre `index.html` en un navegador.

## Cómo abrirlo

Haz doble clic en [index.html](index.html), o sírvelo con cualquier servidor de archivos estático. El progreso se guarda localmente en el navegador (`localStorage`), por dispositivo/navegador.

## Qué contiene

La página es un shell con pestañas que reúne cuatro herramientas. En pantallas de ancho de escritorio (900px o más) se fija en un diseño de altura fija con una barra de navegación superior fija, de modo que cada herramienta se desplaza de forma independiente; por debajo de ese ancho, vuelve a una única página con desplazamiento continuo.

| Pestaña | Propósito |
|---|---|
| **Study Console** (Consola de estudio) | La herramienta principal de entrenamiento. Una ruta de aprendizaje organizada por los 5 dominios oficiales del examen (en orden de peso del blueprint), cada uno dividido en sus task statements; una hoja de trucos con los principios centrales más una tabla de decisión "SI hay disparador → ENTONCES patrón"; un modo Study estilo flashcard (filtra por task statement o por el conjunto transversal "Mixed / Applied", marca preguntas como Dominada/Por repasar, revela explicaciones, ve chips de palabras clave automáticos); un modo Quiz "Exam by Domain" (activa dominios completos o task statements individuales, elige una cantidad de preguntas y obtén una ronda calificada con cada fallo explicado, más un **repaso** de un clic que solo vuelve a hacerte las preguntas que fallaste, con retroalimentación inmediata pregunta por pregunta); y una pestaña Concepts que lista los 59 conceptos del blueprint por dominio → task statement, cada uno con su insight central y un nivel Foundation/Intermediate/Advanced. |
| **Study Hub** (Centro de estudio) | Una vista de referencia organizada por los 5 dominios oficiales del examen (ponderados D1–D5), con reglas de decisión, trampas a evitar y disparadores de palabras clave por dominio, además de una tabla de decodificación rápida con búsqueda. |
| **Neuron Map** (Mapa de neuronas) | Un mapa conceptual SVG interactivo que conecta los dominios del examen con sus subtemas, con conexiones "sinapsis" entre dominios que puedes explorar haciendo clic. |
| **2-Week Plan** (Plan de 2 semanas) | Un plan de estudio en forma de checklist día por día, con su propia barra de progreso; incluye una alternativa manual de exportación/importación en JSON para contextos donde `localStorage` no esté disponible (por ejemplo, algunas configuraciones `file://`). |

## Contenido

- **156 preguntas de práctica**, extraídas de `CCA-F_Study_Guide.md`. Un par con respuestas correctas genuinamente contradictorias en la fuente está marcado con una insignia ⚠ en el modo Study.
- La app se organiza en torno al **blueprint oficial de CCA-F**: **5 dominios → 30 task statements → 59 conceptos**. Cada pregunta está etiquetada a un task statement, y su dominio se deriva de esa etiqueta. Los cinco dominios, en orden de peso del examen: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%) y Context & Reliability (15%). (Taxonomía del blueprint de [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Funcionalidades

- **Selector de idioma EN / FR / DE / ID / IT / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU** — una capa de reemplazo de texto en tiempo de ejecución traduce el contenido en pantalla entre inglés, francés, alemán, indonesio, italiano, portugués, español, vietnamita, chino simplificado, chino tradicional, japonés, coreano, hindi y ruso, sin necesidad de recargar; el idioma elegido se mantiene en visitas futuras.
- **Temas Claro / Oscuro / Sistema / Sepia** — elige un aspecto claro u oscuro fijo, sigue la configuración del sistema operativo, o cambia a un cálido tema Sepia en tonos ámbar y crema (también se adapta automáticamente a claro/oscuro); la elección se mantiene en visitas futuras.
- **Palabras clave etiquetadas automáticamente** — cada pregunta se compara con una lista de docenas de términos frecuentes del examen (p. ej., "MCP resource", "stateless", "tool_choice") y muestra las coincidencias como chips, para que la frase reveladora salte a la vista antes de leer la explicación.
- **Persistencia local** — el progreso de estudio (marcas de Dominada/Por repasar) y el estado del checklist del plan se guardan mediante `localStorage`, con una alternativa en memoria para la pestaña actual si el almacenamiento está bloqueado.
- **Cero dependencias** — JS/CSS/SVG puro en un solo archivo; las únicas llamadas externas son a Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Apoyo opcional** — un botón "☕ Buy me a coffee" (siempre visible en la barra de navegación superior, más un aviso al terminar un examen de práctica) abre un modal con códigos QR para varias opciones de pago; totalmente opcional y se oculta automáticamente si no hay imágenes QR configuradas.

## Aviso legal

No afiliado ni respaldado por Anthropic. Contenido solo de práctica — no es el examen oficial.
