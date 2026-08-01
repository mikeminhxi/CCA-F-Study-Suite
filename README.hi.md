# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇹 Italiano](README.it.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · **🇮🇳 हिन्दी** · [🇷🇺 Русский](README.ru.md)

🔗 **लाइव डेमो:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Anthropic की **Claude Certified Architect — Foundations (CCA-F)** प्रमाणन परीक्षा की तैयारी के लिए एक स्वतंत्र (self-contained) HTML फ़ाइल। कोई build step नहीं, कोई server नहीं, इंस्टॉल करने के लिए कोई dependency नहीं — बस `index.html` को किसी भी browser में खोलें।

## फ़ाइल खोलें

[index.html](index.html) पर डबल-क्लिक करें, या इसे किसी भी static file server के ज़रिए serve करें। प्रगति (progress) आपके browser में स्थानीय रूप से (`localStorage`) सहेजी जाती है, प्रति डिवाइस/browser।

## पेज की सामग्री

यह पेज एक tabbed shell है जो चार tools को एक साथ रखता है। डेस्कटॉप-चौड़ाई की स्क्रीन पर (900px और उससे अधिक) यह एक fixed-height लेआउट में लॉक हो जाता है जिसमें एक sticky ऊपरी navigation bar होती है, जिससे हर tool स्वतंत्र रूप से scroll करता है; इस चौड़ाई से नीचे यह एक ही निरंतर-scrolling पेज पर वापस आ जाता है।

| Tab | उद्देश्य |
|---|---|
| **Study Console** | मुख्य अभ्यास tool। 5 आधिकारिक परीक्षा domains (blueprint के weight क्रम में) के अनुसार व्यवस्थित एक learning path, जिनमें से प्रत्येक को उसके **task statements** में विभाजित किया गया है; मुख्य सिद्धांतों की एक cheat sheet साथ ही "IF trigger → THEN pattern" वाली एक decision table; एक flashcard-जैसा Study मोड (task statement या cross-cutting "Mixed / Applied" सेट के अनुसार filter करें, प्रश्नों को Known/To review के रूप में चिह्नित करें, explanations देखें, स्वतः पहचाने गए keyword chips देखें); एक "Exam by Domain" quiz मोड, जिसमें आप पूरे domains या individual task statements को सक्रिय करते हैं, प्रश्नों की संख्या चुनते हैं, और हर गलती के explanation के साथ एक scored session प्राप्त करते हैं, साथ ही एक एक-क्लिक **Retake** सुविधा जो सिर्फ आपसे छूटे प्रश्नों को तुरंत feedback के साथ दोबारा कराती है; और एक **Concepts** tab जो 59 blueprint concepts को domain → task statement के अनुसार सूचीबद्ध करता है, प्रत्येक के साथ एक core insight और Foundation/Intermediate/Advanced स्तर। |
| **Study Hub** | 5 आधिकारिक परीक्षा domains (D1–D5 के अनुसार weighted) के अनुसार व्यवस्थित एक reference दृश्य, जिसमें प्रति-domain decision rules, बचने योग्य traps, और trigger keywords शामिल हैं, साथ ही एक searchable rapid-decoder table। |
| **Neuron Map** | एक interactive SVG concept map जो परीक्षा domains को उनके sub-topics से जोड़ता है, जिसमें cross-domain "synapse" connections होते हैं जिन्हें आप क्लिक करके explore कर सकते हैं। |
| **2-Week Plan** | अपनी खुद की progress bar वाला एक दिन-दर-दिन checklist study plan; इसमें उन contexts के लिए एक manual JSON export/import fallback शामिल है जहाँ `localStorage` उपलब्ध नहीं है (जैसे कुछ `file://` configurations)। |

## अध्ययन सामग्री

- **156 अभ्यास प्रश्न**, `CCA-F_Study_Guide.md` से लिए गए हैं। एक जोड़ी जिसका सही उत्तर स्रोत में वास्तव में परस्पर विरोधी है, उसे Study मोड में एक ⚠ badge के साथ चिह्नित किया गया है।
- यह ऐप **आधिकारिक CCA-F blueprint** के इर्द-गिर्द व्यवस्थित है: **5 domains → 30 task statements → 59 concepts**। हर प्रश्न एक task statement से जुड़ा है, जिससे उसका domain तय होता है। परीक्षा के weight क्रम में पाँच domains: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%), और Context & Reliability (15%)। (Blueprint taxonomy [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn) से ली गई है।)

## विशेषताएँ (Features)

- **EN / FR / DE / IT / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU भाषा टॉगल** — एक runtime text-swap layer, पेज को दोबारा लोड किए बिना, ऑन-स्क्रीन कॉपी को अंग्रेज़ी, फ़्रेंच, जर्मन, इतालवी, पुर्तगाली, स्पेनिश, वियतनामी, सरलीकृत चीनी, पारंपरिक चीनी, जापानी, कोरियाई, हिंदी और रूसी के बीच translate करता है; चुनी गई भाषा आगामी visits में भी बनी रहती है।
- **Light / Dark / System / Sepia थीम** — एक स्थिर light या dark लुक चुनें, अपने OS की सेटिंग फ़ॉलो करें, या गर्माहट भरे amber-cream वाले Sepia थीम पर स्विच करें (यह भी light/dark के अनुसार अपने आप ढल जाता है); चुनी गई थीम आगामी visits में भी बनी रहती है।
- **स्वतः-टैग किए गए keywords** — हर प्रश्न को दर्जनों आम exam buzzwords की एक सूची (जैसे "MCP resource", "stateless", "tool_choice") के विरुद्ध जाँचा जाता है और मेल खाने वाले शब्दों को chips के रूप में दिखाया जाता है, ताकि explanation पढ़ने से पहले ही निर्णायक संकेत वाक्यांश (giveaway phrase) उभर आए।
- **Local persistence** — study progress (Known/To review markers) और plan की checklist स्थिति `localStorage` के ज़रिए सहेजी जाती है, और यदि storage blocked हो तो वर्तमान tab के लिए एक in-memory fallback भी उपलब्ध है।
- **शून्य dependencies** — एक ही फ़ाइल में शुद्ध JS/CSS/SVG; एकमात्र बाहरी calls Google Fonts (Space Grotesk, Inter, JetBrains Mono) के लिए हैं।
- **वैकल्पिक समर्थन (Optional support)** — एक "☕ मुझे एक कॉफ़ी पिलाएँ" बटन (हमेशा ऊपरी navigation bar में दिखाई देता है, और एक अभ्यास परीक्षा पूरी करने के बाद एक याद-दिलाने वाला संकेत भी) कुछ भुगतान विधियों के लिए QR codes वाली एक विंडो खोलता है; यह पूरी तरह से वैकल्पिक है और यदि कोई QR image कॉन्फ़िगर नहीं की गई है तो अपने आप छिप जाता है।

## अस्वीकरण (Disclaimer)

Anthropic से संबद्ध या समर्थित नहीं है। केवल अभ्यास सामग्री — यह आधिकारिक परीक्षा नहीं है।
