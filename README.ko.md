# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇳🇱 Nederlands](README.nl.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · **🇰🇷 한국어** · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇺🇦 Українська](README.uk.md) · [🇹🇭 ไทย](README.th.md)

🔗 **라이브 데모:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Anthropic의 **Claude Certified Architect — Foundations (CCA-F)** 시험 대비를 위한, 빌드나 서버 없이 그대로 동작하는 정적 앱입니다. 설치할 외부 의존성도 필요 없습니다 — 폴더를 내려받아 브라우저에서 `index.html`을 열기만 하면 됩니다.

## 여는 방법

[index.html](index.html)을 더블클릭하거나, 아무 정적 파일 서버로 제공하세요. 학습 진행 상황은 브라우저의 `localStorage`에 로컬로 저장됩니다(기기·브라우저별로 별도 저장). `style.css`와 `content.js`를 `index.html`과 같은 위치에 두어야 합니다 — 앱이 동작하려면 이 두 가지가 모두 필요하며, `index.html`만 단독으로 열면 로드되지 않고 오류가 표시됩니다. 영어가 아닌 언어를 사용하려면 `translations/` 폴더도 함께 두세요 — 이 폴더가 없으면 앱은 조용히 영어로 대체됩니다.

## 구성

페이지는 4개의 도구를 담은 탭 형식 셸입니다. 데스크톱 폭 화면(900px 이상)에서는 상단 내비게이션을 고정한 채 높이가 고정된 레이아웃이 적용되어 각 도구가 독립적으로 스크롤됩니다. 그보다 좁은 화면에서는 페이지 전체가 하나의 연속 스크롤로 전환됩니다.

| 탭 | 설명 |
|---|---|
| **Study Console**(학습 콘솔) | 메인 학습 도구입니다. 공식 5개 시험 도메인(blueprint 비중 순)으로 구성된 학습 경로 — 각 도메인은 task statement로 나뉩니다 —, 핵심 원칙 치트 시트와 "IF 트리거 → THEN 패턴" 판단표, 플래시카드 형식의 Study 모드(task statement별 또는 교차 영역 "Mixed / Applied" 세트로 필터링, 문제를 Known/Review로 표시, 해설 확인, 자동 태그된 키워드 칩 확인), "Exam by Domain" Quiz 모드(도메인 전체 또는 개별 task statement를 켜고 끄고, 문항 수를 선택해 채점 결과와 모든 오답 해설 확인, 그리고 틀린 문제만 즉시 피드백과 함께 원클릭으로 재도전하는 "Retake" 기능), 그리고 59개 blueprint 개념을 도메인 → task statement별로 정리한 Concepts 탭(각 개념의 핵심 insight와 Foundation/Intermediate/Advanced 난이도 포함)을 제공합니다. |
| **Study Hub**(스터디 허브) | 공식 5개 시험 도메인(D1–D5, 가중치 포함)별로 정리된 참고 화면입니다. 도메인별 판단 규칙, 피해야 할 함정, 키워드 트리거와 함께 검색 가능한 빠른 디코더 표를 포함합니다. |
| **Neuron Map**(뉴런 맵) | 시험 도메인과 그 하위 주제를 연결한 인터랙티브 SVG 개념도입니다. 도메인을 넘나드는 "시냅스" 연결을 클릭해 따라갈 수 있습니다. |
| **2-Week Plan**(2주 계획) | 자체 진행률 표시줄이 있는 일별 체크리스트 학습 계획입니다. `localStorage`를 사용할 수 없는 환경(일부 `file://` 설정 등)을 위한 수동 JSON 내보내기/가져오기 대체 수단도 포함되어 있습니다. |

## 콘텐츠

- `CCA-F_Study_Guide.md`에서 가져온 **156개 연습 문항**. 원본 자료에서 정답이 실제로 서로 다른 한 쌍은 Study 모드에서 ⚠ 배지로 표시됩니다.
- 이 앱은 공식 **CCA-F blueprint**를 중심으로 구성됩니다: **5개 도메인 → 30개 task statement → 59개 개념**. 모든 문항은 하나의 task statement에 태깅되며, 도메인은 그 태그에서 파생됩니다. 시험 비중 순의 다섯 도메인: Agentic Architecture(27%), Tool Design & MCP(18%), Claude Code & Workflows(20%), Prompt Engineering & Output(20%), Context & Reliability(15%). (blueprint 분류 출처: [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## 기능

- **EN / NL / FR / DE / ID / IT / MS / PL / PT / ES / VN / ZH / TW / JA / KO / HI / RU / UK / TH 언어 전환** — 런타임 텍스트 교체 레이어가 새로고침 없이 화면 문구를 영어, 네덜란드어, 프랑스어, 독일어, 인도네시아어, 이탈리아어, 말레이어, 폴란드어, 포르투갈어, 스페인어, 베트남어, 간체 중국어, 번체 중국어, 일본어, 한국어, 힌디어, 러시아어, 우크라이나어, 태국어 사이에서 전환합니다. 선택한 언어는 다음 방문 시에도 유지됩니다.
- **라이트 / 다크 / 시스템 / 세피아 테마** — 고정된 라이트 또는 다크 모습을 선택하거나, OS 설정을 따르거나, 따뜻한 호박색·크림색의 세피아 테마로 전환할 수 있습니다(라이트/다크에도 자동으로 맞춰집니다). 선택한 테마는 다음 방문 시에도 유지됩니다.
- **자동 키워드 태깅** — 각 문항은 수십 개의 시험 빈출 키워드(예: "MCP resource", "stateless", "tool_choice")와 대조되어 일치하는 항목이 칩으로 표시되므로, 해설을 읽기 전에 결정적인 문구가 한눈에 들어옵니다.
- **로컬 저장** — 학습 진행 상황(Known/Review 표시)과 계획 체크리스트 상태는 `localStorage`에 저장되며, 저장이 차단된 경우 현재 탭에 한해 메모리 기반으로 대체됩니다.
- **의존성 없음** — 프레임워크나 빌드 도구 없이 순수 바닐라 JS/CSS/SVG로 구성됩니다. 외부 호출은 Google Fonts(Space Grotesk, Inter, JetBrains Mono)뿐입니다.
- **선택적 후원 기능** — 상단 내비게이션에 항상 표시되는 "☕ Buy me a coffee" 버튼(연습 시험을 마친 뒤에도 안내가 표시됩니다)을 누르면 몇 가지 결제 수단의 QR 코드를 보여주는 모달이 열립니다. 완전히 선택 사항이며, QR 이미지가 설정되어 있지 않으면 자동으로 숨겨집니다.

## 면책 조항

Anthropic과 제휴하거나 승인받은 제품이 아닙니다. 연습용 콘텐츠일 뿐이며, 공식 시험이 아닙니다.
