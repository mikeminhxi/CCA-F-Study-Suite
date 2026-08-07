# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇳🇱 Nederlands](README.nl.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · **🇮🇩 Bahasa Indonesia** · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇸🇪 Svenska](README.sv.md) · [🇻🇳 Tiếng Việt](README.vi.md) · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇺🇦 Українська](README.uk.md) · [🇹🇭 ไทย](README.th.md) · [🇬🇷 Ελληνικά](README.el.md)

🔗 **Demo langsung:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Aplikasi statis mandiri untuk belajar menghadapi ujian sertifikasi Anthropic **Claude Certified Architect — Foundations (CCA-F)**. Tanpa proses build, tanpa server, tanpa dependency yang perlu diinstal — unduh foldernya lalu buka `index.html` di browser.

## Cara membuka

Klik dua kali [index.html](index.html), atau sajikan melalui static file server apa pun. Progres disimpan secara lokal di browser (`localStorage`), per perangkat/browser. Simpan `style.css` dan `content.js` tetap berada di samping `index.html` — aplikasi ini membutuhkan keduanya; jika `index.html` dibuka sendirian, yang akan muncul adalah error, bukan aplikasinya. Tambahkan juga folder `translations/` untuk bahasa selain Inggris — jika folder ini tidak ada, aplikasi akan otomatis kembali ke bahasa Inggris.

## Isi halaman

Halaman ini berupa shell bertab yang menggabungkan empat tool. Pada layar selebar desktop (900px ke atas), tampilan terkunci ke layout tinggi-tetap dengan navigasi atas yang sticky, sehingga setiap tool bisa di-scroll secara independen; di bawah lebar tersebut, tampilan kembali menjadi satu halaman yang scroll secara berkesinambungan.

| Tab | Fungsi |
|---|---|
| **Study Console** | Tool latihan utama. Sebuah learning path yang disusun berdasarkan 5 domain resmi ujian (sesuai urutan bobot blueprint), masing-masing dipecah lagi menjadi **task statement**-nya; sebuah cheat sheet prinsip inti plus tabel keputusan "JIKA trigger → MAKA pola"; mode Study bergaya flashcard (filter berdasarkan task statement atau kumpulan lintas-domain "Mixed / Applied", tandai pertanyaan sebagai Dikuasai/Perlu diulang, buka penjelasan, lihat chip kata kunci yang ditandai otomatis); mode kuis "Exam by Domain" tempat Anda mengaktifkan seluruh domain atau task statement tertentu, memilih jumlah soal, dan mendapatkan sesi bernilai dengan penjelasan untuk setiap kesalahan, plus fitur **retake** sekali klik yang mengulang khusus soal yang salah dengan umpan balik instan per soal; serta tab **Concepts** yang mendaftar 59 konsep blueprint berdasarkan domain → task statement, masing-masing dengan insight inti dan level Foundation/Intermediate/Advanced. |
| **Study Hub** | Tampilan referensi yang disusun berdasarkan 5 domain resmi ujian (berbobot D1–D5), dengan aturan keputusan per domain, jebakan yang harus dihindari, dan kata kunci pemicu, plus tabel pengurai cepat yang bisa dicari. |
| **Neuron Map** | Peta konsep SVG interaktif yang menghubungkan domain ujian dengan sub-topiknya, dengan koneksi "sinapsis" lintas-domain yang bisa dijelajahi dengan klik. |
| **2-Week Plan** | Rencana belajar berbentuk checklist harian dengan progress bar sendiri; menyertakan alternatif ekspor/impor JSON manual untuk konteks di mana `localStorage` tidak tersedia (misalnya beberapa konfigurasi `file://`). |

## Konten

- **156 soal latihan**, bersumber dari `CCA-F_Study_Guide.md`. Satu pasang soal yang jawaban benarnya memang saling bertentangan di sumber asli ditandai dengan badge ⚠ pada mode Study.
- Aplikasi ini disusun berdasarkan **blueprint resmi CCA-F**: **5 domain → 30 task statement → 59 konsep**. Setiap pertanyaan ditandai ke satu task statement, dan domainnya mengikuti dari tanda tersebut. Lima domain, dalam urutan bobot ujian: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%), dan Context & Reliability (15%). (Taksonomi blueprint dari [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Fitur

- **Pengalih bahasa EN / NL / FR / DE / ID / IT / MS / PL / PT / ES / SV / VN / ZH / TW / JA / KO / HI / RU / UK / TH / EL** — lapisan pergantian teks saat runtime menerjemahkan tampilan layar antara bahasa Inggris, Belanda, Prancis, Jerman, Indonesia, Italia, Melayu, Polandia, Portugis, Spanyol, Swedia, Vietnam, Tionghoa Sederhana, Tionghoa Tradisional, Jepang, Korea, Hindi, Rusia, Ukraina, Thai, dan Yunani tanpa perlu memuat ulang; bahasa yang dipilih tetap tersimpan pada kunjungan berikutnya.
- **Tema Light / Dark / System / Sepia** — pilih tampilan terang atau gelap yang tetap, ikuti pengaturan OS Anda, atau beralih ke tema Sepia berwarna amber-krem yang hangat (yang juga otomatis menyesuaikan terang/gelap); pilihan tersebut tetap tersimpan pada kunjungan berikutnya.
- **Kata kunci bertanda otomatis** — setiap pertanyaan dicocokkan dengan daftar puluhan istilah umum ujian (mis. "MCP resource", "stateless", "tool_choice") dan menampilkan yang cocok sebagai chip, sehingga frasa penentu langsung terlihat sebelum Anda membaca penjelasannya.
- **Persistensi lokal** — progres belajar (tanda Dikuasai/Perlu diulang) dan status checklist rencana disimpan melalui `localStorage`, dengan fallback in-memory untuk tab saat ini jika penyimpanan diblokir.
- **Nol dependency** — JS/CSS/SVG murni tanpa framework atau build tooling; satu-satunya panggilan eksternal adalah ke Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Dukungan opsional** — tombol "☕ Buy me a coffee" (selalu tampil di navigasi atas, plus ajakan setelah menyelesaikan ujian latihan) membuka modal kode QR dengan beberapa opsi pembayaran; sepenuhnya opsional dan otomatis tersembunyi jika tidak ada gambar QR yang dikonfigurasi.

## Sangkalan

Tidak berafiliasi dengan atau didukung oleh Anthropic. Hanya konten latihan — bukan ujian resmi.
