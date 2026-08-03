# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · **🇹🇼 繁體中文** · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md)

🔗 **線上展示：** https://mikeminhxi.github.io/CCA-F-Study-Suite/

一個用於備考 Anthropic **Claude Certified Architect — Foundations（CCA-F）** 認證考試的單文件 HTML 學習應用。無需構建、無需服務器、無需安裝任何依賴——只需在瀏覽器中打開 `index.html` 即可使用。

## 打開方式

雙擊 [index.html](index.html),或用任意靜態文件服務器托管它。學習進度會通過 `localStorage` 保存在本地瀏覽器中,按設備/瀏覽器區分。

## 頁面內容

頁面是一個包含四個工具的標籤式外殼。在桌面寬度屏幕(900px 及以上)下,會鎖定為固定高度布局,頂部導航栏保持吸頂,各工具可獨立滚動;低於該寬度時,則回退為單頁連續滚動。

| 標籤頁 | 說明 |
|---|---|
| **Study Console**(學習控制台) | 主訓練工具。一條按 5 個官方考試領域(按 blueprint 權重排序)組織的學習路徑,每個領域再拆分為其 task statement;一張核心原則速查表,配合「IF 觸發詞 → THEN 模式」判斷表;一個類似閃卡的 Study 模式(按 task statement 或跨領域的「Mixed / Applied」集合篩選,將題目標記為已掌握/待複習、查看解釋、查看自動打標的關鍵詞標籤);「Exam by Domain」Quiz 模式(整體或按 task statement 切換開關、選擇題量,完成一輪計分測試並解釋每道錯題,並可一鍵「重考」只重新練習答錯的題目,每題即時回饋);以及一個 Concepts 標籤頁,按領域 → task statement 列出全部 59 個 blueprint 概念,每個都附有核心 insight 和 Foundation/Intermediate/Advanced 難度。|
| **Study Hub**(學習中心) | 按官方5大考試領域(加權 D1–D5)組織的參考視圖,包含各領域的判斷規則、需規避的陷阱與關鍵詞觸發點,以及一張可搜索的快速解碼表。|
| **Neuron Map**(神經元地圖) | 一張交互式 SVG 概念圖,將考試領域與其子主題相連,還包含可點擊的跨領域「突觸」連接。|
| **2-Week Plan**(兩周計劃) | 一份按天列出的清單式學習計劃,自帶獨立進度條;在 `localStorage` 不可用的場景(例如某些 `file://` 打開方式)下,提供手動 JSON 導出/導入的備用方案。|

## 內容構成

- **156 道練習題**,來源於 `CCA-F_Study_Guide.md`。有一對題目在原資料中的正確答案確實相互矛盾,會在 Study 模式中以 ⚠ 徽章標出。
- 應用圍繞官方 **CCA-F blueprint** 組織:**5 個領域 → 30 個 task statement → 59 個概念**。每道題都標記到一個 task statement,其領域由該標記推導得出。按考試權重排序的五個領域:Agentic Architecture(27%)、Tool Design & MCP(18%)、Claude Code & Workflows(20%)、Prompt Engineering & Output(20%)、Context & Reliability(15%)。(blueprint 分類來自 [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn)。)

## 功能特性

- **EN / FR / DE / ID / MS / IT / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU 語言切換**——一層運行時文本替換機制,可將界面文案在英語、法語、德語、印尼語、馬來語、義大利語、葡萄牙語、西班牙語、越南語、簡體中文、繁體中文、日語、韓語、印地語與俄語之間無需刷新即可切換;所選語言會在下次訪問時保留。
- **淺色 / 深色 / 跟隨系統 / 復古(Sepia)主題**——選擇固定的淺色或深色外觀、跟隨系統設定,或切換到暖色調的琥珀奶油色 Sepia 主題(該主題也會自動適配淺色/深色);所選主題會在下次造訪時保留。
- **自動標注關鍵詞**——每道題都會與數十個考試高頻詞(例如「MCP resource」「stateless」「tool_choice」)進行比對,匹配到的會以標籤形式顯示,讓關鍵提示詞在你閱讀解釋之前就先跳出來。
- **本地持久化**——學習進度(已掌握/待複習標記)與計劃清單狀態均通過 `localStorage` 保存;若存儲被阻止,則為當前標籤頁提供內存中的臨時回退方案。
- **零外部依賴**——純原生 JS/CSS/SVG 集於一個文件;唯一的外部請求是 Google Fonts(Space Grotesk、Inter、JetBrains Mono)。
- **可選的支持功能**——頂部導航欄始終顯示的「☕ Buy me a coffee」按鈕(完成一次模擬考試後也會出現提示),點擊後會彈出包含幾種支付方式二維碼的彈窗;完全可選,如果未配置二維碼圖片會自動隱藏。

## 免責聲明

與 Anthropic 無任何關聯,亦未獲其認可。本內容僅供練習之用——並非官方考試。
