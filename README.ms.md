# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · **🇲🇾 Bahasa Melayu** · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md)

🔗 **Demo langsung:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Satu fail HTML tunggal yang berdiri sendiri untuk belajar bagi peperiksaan pensijilan Anthropic **Claude Certified Architect — Foundations (CCA-F)**. Tiada proses build, tiada pelayan (server), tiada dependency yang perlu dipasang — cukup buka `index.html` dalam pelayar web.

## Cara membuka

Klik dua kali pada [index.html](index.html), atau jalankan melalui mana-mana pelayan fail statik. Kemajuan disimpan secara tempatan dalam pelayar (`localStorage`), mengikut peranti/pelayar.

## Kandungan Halaman

Halaman ini adalah rangka bertab yang menggabungkan empat alat. Pada skrin lebar desktop (900px ke atas), ia terkunci pada susun atur tinggi tetap dengan bar navigasi atas yang melekat (sticky), supaya setiap alat boleh ditatal secara berasingan; di bawah lebar tersebut, ia kembali menjadi satu halaman yang ditatal secara berterusan.

| Tab | Tujuan |
|---|---|
| **Study Console** | Alat latihan utama. Satu laluan pembelajaran yang disusun mengikut 5 domain rasmi peperiksaan (mengikut turutan berat blueprint), setiap satu dipecahkan kepada **task statement** masing-masing; helaian rujukan pantas bagi prinsip teras berserta jadual keputusan "JIKA pencetus → MAKA corak"; mod Study bergaya kad imbas (filter mengikut task statement atau set silang-domain "Mixed / Applied", tandakan soalan sebagai Dikuasai/Ulang kaji, dedahkan penjelasan, lihat cip kata kunci yang ditanda secara automatik); mod kuiz "Exam by Domain" di mana anda hidupkan keseluruhan domain atau task statement tertentu, pilih bilangan soalan, dan dapat sesi berskor dengan setiap kesilapan dijelaskan, ditambah ciri **ulang cuba** sekali klik yang hanya mengulang soalan yang tersalah dengan maklum balas segera bagi setiap soalan; serta tab **Concepts** yang menyenaraikan 59 konsep blueprint mengikut domain → task statement, setiap satu dengan insight teras dan tahap Foundation/Intermediate/Advanced. |
| **Study Hub** | Paparan rujukan yang disusun mengikut 5 domain rasmi peperiksaan (berwajaran D1–D5), dengan peraturan keputusan bagi setiap domain, perangkap yang perlu dielakkan, dan kata kunci pencetus, berserta jadual pengekod pantas yang boleh dicari. |
| **Neuron Map** | Peta konsep SVG interaktif yang menghubungkan domain peperiksaan dengan sub-topik masing-masing, dengan sambungan "sinaps" merentas domain yang boleh anda terokai dengan klik. |
| **2-Week Plan** | Pelan pembelajaran senarai semak harian dengan bar kemajuan tersendiri; turut disertakan alternatif eksport/import JSON secara manual untuk konteks di mana `localStorage` tidak tersedia (contohnya sesetengah persediaan `file://`). |

## Kandungan Soalan

- **156 soalan latihan**, diambil daripada `CCA-F_Study_Guide.md`. Satu pasangan yang jawapan betulnya benar-benar bercanggah dalam sumber asal ditandakan dengan lencana ⚠ dalam mod Study.
- Aplikasi ini disusun berdasarkan **blueprint rasmi CCA-F**: **5 domain → 30 task statement → 59 konsep**. Setiap soalan ditanda kepada satu task statement, dan domainnya diperoleh daripada tanda tersebut. Lima domain, mengikut turutan berat peperiksaan: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%), dan Context & Reliability (15%). (Taksonomi blueprint daripada [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Ciri-ciri

- **Penukar bahasa EN / FR / DE / ID / IT / MS / PL / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU** — satu lapisan penggantian teks masa jalan menterjemah kandungan pada skrin antara bahasa Inggeris, Perancis, Jerman, Indonesia, Itali, Melayu, Poland, Portugis, Sepanyol, Vietnam, Cina Ringkas, Cina Tradisional, Jepun, Korea, Hindi, dan Rusia tanpa perlu memuat semula halaman; bahasa yang dipilih akan kekal pada lawatan seterusnya.
- **Tema Light / Dark / System / Sepia** — pilih rupa terang atau gelap yang tetap, ikut tetapan OS anda, atau tukar kepada tema Sepia berwarna ambar-krim yang hangat (turut menyesuaikan diri secara automatik dengan terang/gelap); pilihan ini kekal pada lawatan seterusnya.
- **Kata kunci bertanda automatik** — setiap soalan disemak berbanding senarai berpuluh-puluh istilah popular peperiksaan (cth. "MCP resource", "stateless", "tool_choice") dan memaparkan yang sepadan sebagai cip, supaya frasa penentu terus kelihatan sebelum anda sempat membaca penjelasannya.
- **Ketekalan tempatan** — kemajuan pembelajaran (tanda Dikuasai/Ulang kaji) dan status senarai semak pelan disimpan melalui `localStorage`, dengan sandaran dalam-memori untuk tab semasa jika storan disekat.
- **Sifar dependency** — JS/CSS/SVG tulen dalam satu fail sahaja; satu-satunya panggilan luaran adalah kepada Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Sokongan pilihan** — butang "☕ Buy me a coffee" (sentiasa kelihatan pada navigasi atas, ditambah seruan selepas selesai peperiksaan latihan) membuka modal kod QR dengan beberapa pilihan pembayaran; sepenuhnya pilihan dan tersembunyi secara automatik jika tiada imej QR dikonfigurasikan.

## Penafian

Tiada gabungan dengan atau sokongan daripada Anthropic. Kandungan latihan sahaja — bukan peperiksaan rasmi.
