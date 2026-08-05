# CCA-F Study Suite

[🇺🇸 English](README.md) · [🇫🇷 Français](README.fr.md) · [🇩🇪 Deutsch](README.de.md) · [🇮🇩 Bahasa Indonesia](README.id.md) · [🇮🇹 Italiano](README.it.md) · [🇲🇾 Bahasa Melayu](README.ms.md) · [🇵🇱 Polski](README.pl.md) · [🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · **🇻🇳 Tiếng Việt** · [🇨🇳 简体中文](README.zh-cn.md) · [🇹🇼 繁體中文](README.zh-tw.md) · [🇯🇵 日本語](README.ja.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md) · [🇷🇺 Русский](README.ru.md) · [🇹🇭 ไทย](README.th.md)

🔗 **Bản demo trực tuyến:** https://mikeminhxi.github.io/CCA-F-Study-Suite/

Một ứng dụng tĩnh độc lập (không cần build, không cần server, không phụ thuộc thư viện ngoài) để ôn thi chứng chỉ **Claude Certified Architect — Foundations (CCA-F)** của Anthropic. Chỉ cần mở `index.html` bằng trình duyệt là dùng được.

## Cách mở

Nhấp đúp vào [index.html](index.html), hoặc chạy bằng bất kỳ static file server nào. Tiến độ học được lưu cục bộ ngay trên trình duyệt (`localStorage`), theo từng thiết bị/trình duyệt. Giữ thư mục `translations/` nằm cạnh `index.html` — thư mục này cần thiết cho mọi ngôn ngữ trừ tiếng Anh; nếu chỉ mở riêng `index.html`, ứng dụng sẽ chỉ hoạt động bằng tiếng Anh.

## Nội dung trang

Trang có dạng shell với 4 tab công cụ. Trên màn hình rộng (từ 900px trở lên), trang khóa vào bố cục chiều cao cố định với thanh điều hướng trên cùng luôn dính, để mỗi công cụ tự cuộn riêng; dưới ngưỡng đó, trang quay lại kiểu cuộn liên tục một trang duy nhất.

| Tab | Chức năng |
|---|---|
| **Study Console** (Bảng luyện thi) | Công cụ luyện tập chính. Một lộ trình học tổ chức theo 5 domain thi chính thức (theo thứ tự trọng số blueprint), mỗi domain chia thành các task statement; bảng tóm tắt nguyên lý cốt lõi kèm bảng quy tắc "Thấy dấu hiệu → Áp dụng mẫu"; chế độ Study kiểu flashcard (lọc theo task statement hoặc bộ "Mixed / Applied" xuyên suốt, đánh dấu Đã thuộc/Cần ôn, xem giải thích, xem thẻ từ khóa tự động); chế độ Quiz "Exam by Domain" (bật/tắt cả domain hoặc từng task statement, chọn số câu, làm bài có chấm điểm kèm giải thích cho mỗi câu sai, cùng tính năng **làm lại** chỉ những câu đã sai chỉ với một cú nhấp, có phản hồi ngay cho từng câu); và tab Concepts liệt kê toàn bộ 59 khái niệm blueprint theo domain → task statement, mỗi khái niệm kèm insight cốt lõi và mức Foundation/Intermediate/Advanced. |
| **Study Hub** (Trung tâm học) | Trang tra cứu theo 5 domain chính thức của kỳ thi (theo trọng số D1–D5), với quy tắc quyết định theo từng domain, các bẫy cần tránh, từ khóa nhận diện, và bảng tra cứu nhanh có tìm kiếm. |
| **Neuron Map** (Bản đồ tư duy) | Sơ đồ khái niệm SVG tương tác, liên kết các domain thi với chủ đề con, có cả các đường nối "synapse" xuyên domain có thể bấm vào. |
| **2-Week Plan** (Kế hoạch 2 tuần) | Kế hoạch học theo checklist từng ngày, có thanh tiến độ riêng; kèm cơ chế dự phòng xuất/nhập file JSON thủ công cho các trường hợp `localStorage` không dùng được (ví dụ một số cách mở qua `file://`). |

## Nội dung câu hỏi

- **156 câu luyện tập**, lấy từ `CCA-F_Study_Guide.md`. Một cặp câu có đáp án mâu thuẫn thật sự trong tài liệu gốc được đánh dấu bằng huy hiệu ⚠ trong chế độ Study.
- Ứng dụng được tổ chức quanh **blueprint CCA-F chính thức**: **5 domain → 30 task statement → 59 khái niệm**. Mỗi câu hỏi được gắn vào một task statement, và domain của nó suy ra từ thẻ đó. Năm domain theo thứ tự trọng số thi: Agentic Architecture (27%), Tool Design & MCP (18%), Claude Code & Workflows (20%), Prompt Engineering & Output (20%), và Context & Reliability (15%). (Phân loại blueprint từ [prepgenaicerts.com/learn](https://www.prepgenaicerts.com/learn).)

## Tính năng

- **Chuyển đổi ngôn ngữ EN / FR / DE / ID / IT / MS / PL / PT / ES / VN / 简体中文 / 繁體中文 / JA / 한국어 / HI / RU / TH** — lớp dịch runtime thay thế nội dung hiển thị giữa tiếng Anh, tiếng Pháp, tiếng Đức, tiếng Indonesia, tiếng Ý, tiếng Mã Lai, tiếng Ba Lan, tiếng Bồ Đào Nha, tiếng Tây Ban Nha, tiếng Việt, tiếng Trung giản thể, tiếng Trung phồn thể, tiếng Nhật, tiếng Hàn, tiếng Hindi, tiếng Nga và tiếng Thái mà không cần tải lại trang; ngôn ngữ đã chọn được ghi nhớ cho lần truy cập sau.
- **Giao diện Sáng / Tối / Theo hệ thống / Sepia** — chọn giao diện sáng hoặc tối cố định, theo cài đặt hệ điều hành, hoặc chuyển sang giao diện Sepia ấm màu hổ phách và kem (cũng tự động thích ứng sáng/tối); lựa chọn được ghi nhớ cho các lần truy cập sau.
- **Từ khóa tự động gắn thẻ** — mỗi câu hỏi được đối chiếu với danh sách hàng chục từ khóa đặc trưng của đề thi (ví dụ "MCP resource", "stateless", "tool_choice") và hiển thị những từ khớp dưới dạng thẻ, giúp cụm từ mấu chốt nổi bật lên trước khi bạn đọc phần giải thích.
- **Lưu trữ cục bộ** — tiến độ học (đánh dấu đã thuộc/cần ôn) và trạng thái checklist kế hoạch được lưu qua `localStorage`, có cơ chế dự phòng lưu tạm trong bộ nhớ cho tab hiện tại nếu trình duyệt chặn lưu trữ.
- **Không phụ thuộc thư viện ngoài** — toàn bộ JS/CSS/SVG thuần, không framework hay công cụ build; phần gọi ra ngoài duy nhất là Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Tùy chọn ủng hộ** — nút "☕ Buy me a coffee" (luôn hiển thị trên thanh điều hướng trên cùng, cùng với một lời nhắc sau khi hoàn thành bài thi thử) sẽ mở một hộp thoại chứa mã QR cho vài phương thức thanh toán; hoàn toàn tùy chọn và tự động ẩn nếu chưa cấu hình ảnh QR.

## Miễn trừ trách nhiệm

Không liên kết hay được Anthropic xác nhận. Đây là nội dung luyện tập — không phải đề thi chính thức.
