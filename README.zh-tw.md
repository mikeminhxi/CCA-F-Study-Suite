# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · **🇹🇼 繁體中文** · [🇯🇵 日本語](README.ja.md)

一個用於備考 Anthropic **Claude Certified Architect — Foundations（CCA-F）** 認證考試的單文件 HTML 學習應用。無需構建、無需服務器、無需安裝任何依賴——只需在瀏覽器中打開 `cca-f-study-suite.html` 即可使用。

## 打開方式

雙擊 [cca-f-study-suite.html](cca-f-study-suite.html),或用任意靜態文件服務器托管它。學習進度會通過 `localStorage` 保存在本地瀏覽器中,按設備/瀏覽器區分。

## 頁面內容

頁面是一個包含四個工具的標籤式外殼。在桌面寬度屏幕(900px 及以上)下,會鎖定為固定高度布局,頂部導航栏保持吸頂,各工具可獨立滚動;低於該寬度時,則回退為單頁連續滚動。

| 標籤頁 | 說明 |
|---|---|
| **Study Console**(學習控制台) | 主訓練工具。包含一條按7個階段劃分的學習路徑(從基礎 → 應用場景),由14個按考試領域打標籤的主題模塊構成;一張核心原則速查表,配合「IF 觸發詞 → THEN 模式」判斷表;一個類似閃卡的 Study 模式(將題目標記為已掌握/待複習、查看解釋、查看每題自動打標的關鍵詞標籤);以及按領域分組的 Quiz 模式——即「Exam by Domain」標籤頁——你可以整體或按模塊切換開關、選擇題量,完成一輪計分測試,每道錯題都會給出解釋。|
| **Study Hub**(學習中心) | 按官方5大考試領域(加權 D1–D5)組織的參考視圖,包含各領域的判斷規則、需規避的陷阱與關鍵詞觸發點,以及一張可搜索的快速解碼表。|
| **Neuron Map**(神經元地圖) | 一張交互式 SVG 概念圖,將考試領域與其子主題相連,還包含可點擊的跨領域「突觸」連接。|
| **2-Week Plan**(兩周計劃) | 一份按天列出的清單式學習計劃,自帶獨立進度條;在 `localStorage` 不可用的場景(例如某些 `file://` 打開方式)下,提供手動 JSON 導出/導入的備用方案。|

## 內容構成

- **157道獨特題目**,來源於 `CCA-F_Study_Guide.md`——原資料 Section 1(Q1–77)與 Section 2(Q1–148)之間重複的67題已被合並(保留 Section 1 版本,因其附有書面解釋)。有一對題目在原資料中的正確答案確實相互矛盾,會在 Study 模式中以 ⚠ 徽章標出。
- 題目被打上**14個模塊**標籤,歸入**7個學習階段**,並映射到**5大考試領域**:Agentic Architecture & Orchestration(27%)、Claude Code Configuration & Workflows(20%)、Prompt Engineering & Structured Output(20%)、Tool Design & MCP Integration(18%)、Context Management & Reliability(15%)。

## 功能特性

- **EN / ES / VN / 简体中文 / 繁體中文 / JA 語言切換**——一層運行時文本替換機制,可將界面文案在英語、西班牙語、越南語、簡體中文、繁體中文與日語之間無需刷新即可切換;所選語言會在下次訪問時保留。
- **自動標注關鍵詞**——每道題都會與數十個考試高頻詞(例如「MCP resource」「stateless」「tool_choice」)進行比對,匹配到的會以標籤形式顯示,讓關鍵提示詞在你閱讀解釋之前就先跳出來。
- **本地持久化**——學習進度(已掌握/待複習標記)與計劃清單狀態均通過 `localStorage` 保存;若存儲被阻止,則為當前標籤頁提供內存中的臨時回退方案。
- **零外部依賴**——純原生 JS/CSS/SVG 集於一個文件;唯一的外部請求是 Google Fonts(Space Grotesk、Inter、JetBrains Mono)。

## 免責聲明

與 Anthropic 無任何關聯,亦未獲其認可。本內容僅供練習之用——並非官方考試。
