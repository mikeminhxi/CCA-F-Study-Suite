# CCA-F Study Suite

[🇺🇸 English](README.md) · **🇪🇸 Español** · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md)

Un archivo HTML autocontenido para preparar el examen de certificación de Anthropic **Claude Certified Architect — Foundations (CCA-F)**. Sin proceso de compilación, sin servidor, sin dependencias que instalar — solo abre `cca-f-study-suite.html` en un navegador.

## Cómo abrirlo

Haz doble clic en [cca-f-study-suite.html](cca-f-study-suite.html), o sírvelo con cualquier servidor de archivos estático. El progreso se guarda localmente en el navegador (`localStorage`), por dispositivo/navegador.

## Qué contiene

La página es un shell con pestañas que reúne cuatro herramientas. En pantallas de ancho de escritorio (900px o más) se fija en un diseño de altura fija con una barra de navegación superior fija, de modo que cada herramienta se desplaza de forma independiente; por debajo de ese ancho, vuelve a una única página con desplazamiento continuo.

| Pestaña | Propósito |
|---|---|
| **Study Console** (Consola de estudio) | La herramienta principal de entrenamiento. Incluye una ruta de aprendizaje de 7 fases (de Fundamentos → Escenarios aplicados) construida a partir de 14 módulos temáticos etiquetados por dominio del examen, una hoja de trucos con los principios centrales más una tabla de decisión "SI hay disparador → ENTONCES patrón", un modo Study estilo flashcard (marca preguntas como Dominada/Por repasar, revela explicaciones, ve chips de palabras clave etiquetadas automáticamente por pregunta), y un modo Quiz agrupado por dominio — la pestaña "Exam by Domain" — donde activas dominios completos o módulos individuales, eliges una cantidad de preguntas, y obtienes una ronda calificada con cada fallo explicado. |
| **Study Hub** (Centro de estudio) | Una vista de referencia organizada por los 5 dominios oficiales del examen (ponderados D1–D5), con reglas de decisión, trampas a evitar y disparadores de palabras clave por dominio, además de una tabla de decodificación rápida con búsqueda. |
| **Neuron Map** (Mapa de neuronas) | Un mapa conceptual SVG interactivo que conecta los dominios del examen con sus subtemas, con conexiones "sinapsis" entre dominios que puedes explorar haciendo clic. |
| **2-Week Plan** (Plan de 2 semanas) | Un plan de estudio en forma de checklist día por día, con su propia barra de progreso; incluye una alternativa manual de exportación/importación en JSON para contextos donde `localStorage` no esté disponible (por ejemplo, algunas configuraciones `file://`). |

## Contenido

- **157 preguntas únicas**, extraídas de `CCA-F_Study_Guide.md` — se fusionaron 67 duplicados entre la Sección 1 (Q1–77) y la Sección 2 (Q1–148) del documento fuente (se conserva la copia de la Sección 1, ya que incluye la explicación escrita). Un par con respuestas correctas genuinamente contradictorias en la fuente está marcado con una insignia ⚠ en el modo Study.
- Las preguntas están etiquetadas en **14 módulos** agrupados en **7 fases de la ruta de aprendizaje**, y mapeadas a **5 dominios del examen**: Agentic Architecture & Orchestration (27%), Claude Code Configuration & Workflows (20%), Prompt Engineering & Structured Output (20%), Tool Design & MCP Integration (18%), y Context Management & Reliability (15%).

## Funcionalidades

- **Selector de idioma EN / ES / VN / 简体中文 / 繁體中文 / JA** — una capa de reemplazo de texto en tiempo de ejecución traduce el contenido en pantalla entre inglés, español, vietnamita, chino simplificado, chino tradicional y japonés, sin necesidad de recargar; el idioma elegido se mantiene en visitas futuras.
- **Palabras clave etiquetadas automáticamente** — cada pregunta se compara con una lista de docenas de términos frecuentes del examen (p. ej., "MCP resource", "stateless", "tool_choice") y muestra las coincidencias como chips, para que la frase reveladora salte a la vista antes de leer la explicación.
- **Persistencia local** — el progreso de estudio (marcas de Dominada/Por repasar) y el estado del checklist del plan se guardan mediante `localStorage`, con una alternativa en memoria para la pestaña actual si el almacenamiento está bloqueado.
- **Cero dependencias** — JS/CSS/SVG puro en un solo archivo; las únicas llamadas externas son a Google Fonts (Space Grotesk, Inter, JetBrains Mono).

## Aviso legal

No afiliado ni respaldado por Anthropic. Contenido solo de práctica — no es el examen oficial.
