# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · **🇨🇳 简体中文** · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md)

一个用于备考 Anthropic **Claude Certified Architect — Foundations（CCA-F）** 认证考试的单文件 HTML 学习应用。无需构建、无需服务器、无需安装任何依赖——只需在浏览器中打开 `cca-f-study-suite.html` 即可使用。

## 打开方式

双击 [cca-f-study-suite.html](cca-f-study-suite.html),或用任意静态文件服务器托管它。学习进度会通过 `localStorage` 保存在本地浏览器中,按设备/浏览器区分。

## 页面内容

页面是一个包含四个工具的标签式外壳。在桌面宽度屏幕(900px 及以上)下,会锁定为固定高度布局,顶部导航栏保持吸顶,各工具可独立滚动;低于该宽度时,则回退为单页连续滚动。

| 标签页 | 说明 |
|---|---|
| **Study Console**(学习控制台) | 主训练工具。包含一条按7个阶段划分的学习路径(从基础 → 应用场景),由14个按考试领域打标签的主题模块构成;一张核心原则速查表,配合「IF 触发词 → THEN 模式」判断表;一个类似闪卡的 Study 模式(将题目标记为已掌握/待复习、查看解释、查看每题自动打标的关键词标签);以及按领域分组的 Quiz 模式——即「Exam by Domain」标签页——你可以整体或按模块切换开关、选择题量,完成一轮计分测试,每道错题都会给出解释。|
| **Study Hub**(学习中心) | 按官方5大考试领域(加权 D1–D5)组织的参考视图,包含各领域的判断规则、需规避的陷阱与关键词触发点,以及一张可搜索的快速解码表。|
| **Neuron Map**(神经元地图) | 一张交互式 SVG 概念图,将考试领域与其子主题相连,还包含可点击的跨领域「突触」连接。|
| **2-Week Plan**(两周计划) | 一份按天列出的清单式学习计划,自带独立进度条;在 `localStorage` 不可用的场景(例如某些 `file://` 打开方式)下,提供手动 JSON 导出/导入的备用方案。|

## 内容构成

- **157道独特题目**,来源于 `CCA-F_Study_Guide.md`——原资料 Section 1(Q1–77)与 Section 2(Q1–148)之间重复的67题已被合并(保留 Section 1 版本,因其附有书面解释)。有一对题目在原资料中的正确答案确实相互矛盾,会在 Study 模式中以 ⚠ 徽章标出。
- 题目被打上**14个模块**标签,归入**7个学习阶段**,并映射到**5大考试领域**:Agentic Architecture & Orchestration(27%)、Claude Code Configuration & Workflows(20%)、Prompt Engineering & Structured Output(20%)、Tool Design & MCP Integration(18%)、Context Management & Reliability(15%)。

## 功能特性

- **EN / ES / VN / 简体中文 / 繁體中文 / JA 语言切换**——一层运行时文本替换机制,可将界面文案在英语、西班牙语、越南语、简体中文、繁体中文与日语之间无需刷新即可切换;所选语言会在下次访问时保留。
- **自动标注关键词**——每道题都会与数十个考试高频词(例如「MCP resource」「stateless」「tool_choice」)进行比对,匹配到的会以标签形式显示,让关键提示词在你阅读解释之前就先跳出来。
- **本地持久化**——学习进度(已掌握/待复习标记)与计划清单状态均通过 `localStorage` 保存;若存储被阻止,则为当前标签页提供内存中的临时回退方案。
- **零外部依赖**——纯原生 JS/CSS/SVG 集于一个文件;唯一的外部请求是 Google Fonts(Space Grotesk、Inter、JetBrains Mono)。

## 免责声明

与 Anthropic 无任何关联,亦未获其认可。本内容仅供练习之用——并非官方考试。
