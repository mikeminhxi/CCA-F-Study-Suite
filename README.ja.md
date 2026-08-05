# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · **🇯🇵 日本語** · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇹🇭 ไทย](README.th.md)

🔗 **ライブデモ:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Anthropicの「Claude Certified Architect — Foundations（CCA-F）」試験対策のために作られた、ビルド不要・サーバー不要のスタンドアロン静的アプリです。外部依存も不要 —— ブラウザで `index.html` を開くだけで使えます。

## 開き方

[index.html](index.html) をダブルクリックするか、任意の静的ファイルサーバーで配信してください。学習の進捗はブラウザの `localStorage` にローカル保存されます（端末・ブラウザごと）。`translations/` フォルダは `index.html` と同じ場所に置いたままにしてください —— 英語以外のすべての言語で必要です。`index.html` 単体で開いた場合、表示は英語のみになります。

## 中身

ページは4つのツールをまとめたタブ形式のシェルです。デスクトップ幅の画面（900px以上）では、上部ナビを固定したまま高さ固定のレイアウトになり、各ツールが個別にスクロールします。それより狭い画面では、ページ全体が1つの連続スクロールに戻ります。

| タブ | 内容 |
|---|---|
| **Study Console**（学習コンソール） | メインのトレーニングツール。公式の5試験ドメイン（blueprintの配点順）で構成された学習パス（各ドメインはtask statementに分割）、コア原則のチートシートと「IFトリガー → THENパターン」の判断表、フラッシュカード形式のStudyモード（task statementまたは分野横断の「Mixed / Applied」セットでフィルタ、問題をKnown/Reviewでマーク、解説を表示、自動タグ付けキーワードチップを確認）、「Exam by Domain」Quizモード（ドメイン単位・task statement単位でオン/オフ、出題数を選び、間違えた問題の解説付きで採点、さらにワンクリックで間違えた問題だけを即座のフィードバック付きで再挑戦できる「Retake」機能）、そして59のblueprintコンセプトをドメイン → task statementごとに一覧するConceptsタブ（各コンセプトの核心insightとFoundation/Intermediate/Advancedの難易度付き）を提供します。|
| **Study Hub**（学習ハブ） | 試験の公式5ドメイン（D1〜D5、重み付き）ごとに整理されたリファレンス画面。ドメインごとの判断ルール、避けるべき罠、キーワードのトリガーに加え、検索可能な早見デコーダー表を収録。|
| **Neuron Map**（概念マップ） | 試験ドメインとそのサブトピックを結ぶインタラクティブなSVG概念図。ドメインをまたぐ「シナプス」接続をクリックしてたどれます。|
| **2-Week Plan**（2週間プラン） | 独自の進捗バー付きの日次チェックリスト学習計画。`localStorage` が使えない環境（一部の `file://` での利用など）向けに、手動のJSONエクスポート/インポートのフォールバックも備えています。|

## 収録内容

- **156問の練習問題**を `CCA-F_Study_Guide.md` から収録。元資料の中で正答が本当に矛盾していた1組は、Studyモードで⚠バッジ付きで表示されます。
- このアプリは公式の**CCA-F blueprint**を中心に構成されています：**5ドメイン → 30 task statement → 59コンセプト**。すべての問題は1つのtask statementにタグ付けされ、そのドメインはタグから導かれます。配点順の5ドメイン：Agentic Architecture（27%）、Tool Design & MCP（18%）、Claude Code & Workflows（20%）、Prompt Engineering & Output（20%）、Context & Reliability（15%）。（blueprintの分類は [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn) より。）

## 特徴

- **EN / FR / DE / ID / IT / MS / PL / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU / TH 言語切り替え** —— ランタイムのテキスト置換レイヤーが、再読み込みなしで画面表示を英語・フランス語・ドイツ語・インドネシア語・イタリア語・マレー語・ポーランド語・ポルトガル語・スペイン語・ベトナム語・簡体字中国語・繁体字中国語・日本語・韓国語・ヒンディー語・ロシア語・タイ語の間で切り替えます。選択した言語は次回訪問時も保持されます。
- **ライト / ダーク / システム / セピア テーマ** —— 固定のライトまたはダーク表示を選ぶか、OS設定に追従するか、暖かみのあるアンバー×クリームの「セピア」テーマに切り替えられます(こちらも明暗に自動対応)。選択したテーマは次回訪問時も保持されます。
- **自動キーワードタグ付け** —— 各問題は数十個の試験頻出キーワード（例：「MCP resource」「stateless」「tool_choice」）と照合され、一致したものがチップとして表示されるので、解説を読む前に決め手となるフレーズが一目でわかります。
- **ローカル保存** —— 学習の進捗（Known/Reviewのマーク）とプランのチェックリストの状態は `localStorage` に保存され、保存がブロックされている場合はそのタブ限定でメモリ上にフォールバックします。
- **依存ライブラリなし** —— フレームワークもビルドツールも使わないバニラのJS/CSS/SVGのみ。外部通信はGoogle Fonts（Space Grotesk、Inter、JetBrains Mono）のみです。
- **任意の応援機能** —— 上部ナビに常時表示される「☕ Buy me a coffee」ボタン（練習試験終了後にも案内が表示されます）から、いくつかの支払い方法のQRコードを表示するモーダルを開けます。完全に任意の機能で、QR画像が設定されていない場合は自動的に非表示になります。

## 免責事項

Anthropicとは提携・承認関係にありません。あくまで練習用コンテンツであり、公式試験ではありません。
