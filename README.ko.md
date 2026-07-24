# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · **🇰🇷 한국어**

Anthropic의 **Claude Certified Architect — Foundations (CCA-F)** 시험 대비를 위한, 단일 HTML 파일로 완결되는 학습 앱입니다. 빌드 과정도, 서버도, 설치할 외부 의존성도 필요 없습니다 — 브라우저에서 `cca-f-study-suite.html`을 열기만 하면 됩니다.

## 여는 방법

[cca-f-study-suite.html](cca-f-study-suite.html)을 더블클릭하거나, 아무 정적 파일 서버로 제공하세요. 학습 진행 상황은 브라우저의 `localStorage`에 로컬로 저장됩니다(기기·브라우저별로 별도 저장).

## 구성

페이지는 4개의 도구를 담은 탭 형식 셸입니다. 데스크톱 폭 화면(900px 이상)에서는 상단 내비게이션을 고정한 채 높이가 고정된 레이아웃이 적용되어 각 도구가 독립적으로 스크롤됩니다. 그보다 좁은 화면에서는 페이지 전체가 하나의 연속 스크롤로 전환됩니다.

| 탭 | 설명 |
|---|---|
| **Study Console**(학습 콘솔) | 메인 학습 도구입니다. 14개의 주제별 모듈(시험 도메인으로 태그됨)로 구성된 7단계 학습 경로(기초 → 응용 시나리오), 핵심 원칙 치트 시트와 "IF 트리거 → THEN 패턴" 판단표, 플래시카드 형식의 Study 모드(문제를 Known/Review로 표시, 해설 확인, 문제별 자동 태그된 키워드 칩 확인), 그리고 도메인별로 그룹화된 Quiz 모드 — "Exam by Domain" 탭 — 에서는 도메인이나 개별 모듈을 켜고 끄고, 문항 수를 선택해 채점된 결과와 모든 오답 해설을 확인할 수 있습니다. |
| **Study Hub**(스터디 허브) | 공식 5개 시험 도메인(D1–D5, 가중치 포함)별로 정리된 참고 화면입니다. 도메인별 판단 규칙, 피해야 할 함정, 키워드 트리거와 함께 검색 가능한 빠른 디코더 표를 포함합니다. |
| **Neuron Map**(뉴런 맵) | 시험 도메인과 그 하위 주제를 연결한 인터랙티브 SVG 개념도입니다. 도메인을 넘나드는 "시냅스" 연결을 클릭해 따라갈 수 있습니다. |
| **2-Week Plan**(2주 계획) | 자체 진행률 표시줄이 있는 일별 체크리스트 학습 계획입니다. `localStorage`를 사용할 수 없는 환경(일부 `file://` 설정 등)을 위한 수동 JSON 내보내기/가져오기 대체 수단도 포함되어 있습니다. |

## 콘텐츠

- `CCA-F_Study_Guide.md`에서 가져온 **157개의 고유 문항** — 원본 자료의 Section 1(Q1–77)과 Section 2(Q1–148) 사이에 중복되던 67문항은 통합되었습니다(설명이 포함된 Section 1 버전을 사용). 원본 자료에서 정답이 실제로 서로 다른 한 쌍은 Study 모드에서 ⚠ 배지로 표시됩니다.
- 문항은 **14개 모듈**로 태그되고 **7개 학습 단계**로 그룹화되며 **5개 시험 도메인**에 매핑됩니다: Agentic Architecture & Orchestration(27%), Claude Code Configuration & Workflows(20%), Prompt Engineering & Structured Output(20%), Tool Design & MCP Integration(18%), Context Management & Reliability(15%).

## 기능

- **EN / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 언어 전환** — 런타임 텍스트 교체 레이어가 새로고침 없이 화면 문구를 영어, 스페인어, 베트남어, 간체 중국어, 번체 중국어, 일본어, 한국어 사이에서 전환합니다. 선택한 언어는 다음 방문 시에도 유지됩니다.
- **자동 키워드 태깅** — 각 문항은 수십 개의 시험 빈출 키워드(예: "MCP resource", "stateless", "tool_choice")와 대조되어 일치하는 항목이 칩으로 표시되므로, 해설을 읽기 전에 결정적인 문구가 한눈에 들어옵니다.
- **로컬 저장** — 학습 진행 상황(Known/Review 표시)과 계획 체크리스트 상태는 `localStorage`에 저장되며, 저장이 차단된 경우 현재 탭에 한해 메모리 기반으로 대체됩니다.
- **의존성 없음** — 순수 바닐라 JS/CSS/SVG로 구성된 단일 파일입니다. 외부 호출은 Google Fonts(Space Grotesk, Inter, JetBrains Mono)뿐입니다.

## 면책 조항

Anthropic과 제휴하거나 승인받은 제품이 아닙니다. 연습용 콘텐츠일 뿐이며, 공식 시험이 아닙니다.
