# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇳🇱 Nederlands](README.nl.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇸🇪 Svenska](README.sv.md) · [🇻🇳 Tiếng Việt](README.vi.md) · **🇨🇳 简体中文** · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇺🇦 Українська](README.uk.md) · [🇹🇭 ไทย](README.th.md)

🔗 **在线演示：** https://mikeminhxi.github.io/CCA-F-Study-Suite/

一个用于备考 Anthropic **Claude Certified Architect — Foundations（CCA-F）** 认证考试的自包含静态应用。无需构建、无需服务器、无需安装任何依赖——下载整个文件夹后,在浏览器中打开 `index.html` 即可使用。

## 打开方式

双击 [index.html](index.html),或用任意静态文件服务器托管它。学习进度会通过 `localStorage` 保存在本地浏览器中,按设备/浏览器区分。请将 `style.css` 和 `content.js` 与 `index.html` 放在一起——应用需要这两者齐全;若单独打开 `index.html`,将只会显示错误,而不是正常加载。如果要使用英语以外的语言,还需加上 `translations/` 文件夹——缺少该文件夹时,应用会自动回退为英语,不会报错。

## 页面内容

页面是一个包含四个工具的标签式外壳。在桌面宽度屏幕(900px 及以上)下,会锁定为固定高度布局,顶部导航栏保持吸顶,各工具可独立滚动;低于该宽度时,则回退为单页连续滚动。

| 标签页 | 说明 |
|---|---|
| **Study Console**(学习控制台) | 主训练工具。一条按 5 个官方考试领域(按 blueprint 权重排序)组织的学习路径,每个领域再拆分为其 task statement;一张核心原则速查表,配合「IF 触发词 → THEN 模式」判断表;一个类似闪卡的 Study 模式(按 task statement 或跨领域的「Mixed / Applied」集合筛选,将题目标记为已掌握/待复习、查看解释、查看自动打标的关键词标签);「Exam by Domain」Quiz 模式(整体或按 task statement 切换开关、选择题量,完成一轮计分测试并解释每道错题,并可一键「重考」只重新练习答错的题目,每题即时反馈);以及一个 Concepts 标签页,按领域 → task statement 列出全部 59 个 blueprint 概念,每个都附有核心 insight 和 Foundation/Intermediate/Advanced 难度。|
| **Study Hub**(学习中心) | 按官方5大考试领域(加权 D1–D5)组织的参考视图,包含各领域的判断规则、需规避的陷阱与关键词触发点,以及一张可搜索的快速解码表。|
| **Neuron Map**(神经元地图) | 一张交互式 SVG 概念图,将考试领域与其子主题相连,还包含可点击的跨领域「突触」连接。|
| **2-Week Plan**(两周计划) | 一份按天列出的清单式学习计划,自带独立进度条;在 `localStorage` 不可用的场景(例如某些 `file://` 打开方式)下,提供手动 JSON 导出/导入的备用方案。|

## 内容构成

- **156 道练习题**,来源于 `CCA-F_Study_Guide.md`。有一对题目在原资料中的正确答案确实相互矛盾,会在 Study 模式中以 ⚠ 徽章标出。
- 应用围绕官方 **CCA-F blueprint** 组织:**5 个领域 → 30 个 task statement → 59 个概念**。每道题都标记到一个 task statement,其领域由该标记推导得出。按考试权重排序的五个领域:Agentic Architecture(27%)、Tool Design & MCP(18%)、Claude Code & Workflows(20%)、Prompt Engineering & Output(20%)、Context & Reliability(15%)。(blueprint 分类来自 [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn)。)

## 功能特性

- **EN / NL / FR / DE / ID / IT / MS / PL / PT / ES / SV / VN / ZH / TW / JA / KO / HI / RU / UK / TH 语言切换**——一层运行时文本替换机制,可将界面文案在英语、荷兰语、法语、德语、印尼语、意大利语、马来语、波兰语、葡萄牙语、西班牙语、瑞典语、越南语、简体中文、繁体中文、日语、韩语、印地语、俄语、乌克兰语与泰语之间无需刷新即可切换;所选语言会在下次访问时保留。
- **浅色 / 深色 / 跟随系统 / 复古(Sepia)主题**——选择固定的浅色或深色外观、跟随系统设置,或切换到暖色调的琥珀奶油色 Sepia 主题(该主题也会自动适配浅色/深色);所选主题会在下次访问时保留。
- **自动标注关键词**——每道题都会与数十个考试高频词(例如「MCP resource」「stateless」「tool_choice」)进行比对,匹配到的会以标签形式显示,让关键提示词在你阅读解释之前就先跳出来。
- **本地持久化**——学习进度(已掌握/待复习标记)与计划清单状态均通过 `localStorage` 保存;若存储被阻止,则为当前标签页提供内存中的临时回退方案。
- **零外部依赖**——纯原生 JS/CSS/SVG,不依赖任何框架或构建工具;唯一的外部请求是 Google Fonts(Space Grotesk、Inter、JetBrains Mono)。
- **可选的支持功能**——顶部导航栏始终显示的「☕ Buy me a coffee」按钮(完成一次模拟考试后也会出现提示),点击后会弹出包含几种支付方式二维码的弹窗;完全可选,如果未配置二维码图片会自动隐藏。

## 免责声明

与 Anthropic 无任何关联,亦未获其认可。本内容仅供练习之用——并非官方考试。
