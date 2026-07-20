# CCA-F Study Suite

[🇬🇧 English](README.md) · **🇻🇳 Tiếng Việt**

Một tệp HTML độc lập (không cần build, không cần server, không phụ thuộc thư viện ngoài) để ôn thi chứng chỉ **Claude Certified Architect — Foundations (CCA-F)** của Anthropic. Chỉ cần mở `cca-f-study-suite-vn.html` bằng trình duyệt là dùng được.

## Cách mở

Nhấp đúp vào [cca-f-study-suite-vn.html](cca-f-study-suite-vn.html), hoặc chạy bằng bất kỳ static file server nào. Tiến độ học được lưu cục bộ ngay trên trình duyệt (`localStorage`), theo từng thiết bị/trình duyệt.

## Nội dung trang

Trang có dạng shell với 4 tab công cụ:

| Tab | Chức năng |
|---|---|
| **Study Console** (Bảng luyện thi) | Công cụ luyện tập chính. Gồm lộ trình học 7 giai đoạn (từ Nền tảng → Tình huống ứng dụng) xây từ 14 module chủ đề, bảng tóm tắt nguyên lý cốt lõi kèm bảng quy tắc "Thấy dấu hiệu → Áp dụng mẫu", chế độ Study kiểu flashcard (đánh dấu câu hỏi Đã thuộc/Cần ôn, xem giải thích), và chế độ Quiz tùy chỉnh (chọn module + số câu, làm bài có chấm điểm và xem lại câu sai). |
| **Study Hub** (Trung tâm học) | Trang tra cứu theo 5 domain chính thức của kỳ thi (theo trọng số D1–D5), với quy tắc quyết định theo từng domain, các bẫy cần tránh, từ khóa nhận diện, và bảng tra cứu nhanh có tìm kiếm. |
| **Neuron Map** (Bản đồ tư duy) | Sơ đồ khái niệm SVG tương tác, liên kết các domain thi với chủ đề con, có cả các đường nối "synapse" xuyên domain có thể bấm vào. |
| **2-Week Plan** (Kế hoạch 2 tuần) | Kế hoạch học theo checklist từng ngày, có thanh tiến độ riêng; kèm cơ chế dự phòng xuất/nhập file JSON thủ công cho các trường hợp `localStorage` không dùng được (ví dụ một số cách mở qua `file://`). |

## Nội dung câu hỏi

- **182 câu hỏi duy nhất**, lấy từ `CCA-F_Study_Guide.md` — 42 câu trùng lặp hoàn toàn giữa Section 1 và Section 2 của tài liệu gốc đã được gộp lại (giữ bản ở Section 1 vì có kèm giải thích). Một cặp câu có đáp án mâu thuẫn thật sự trong tài liệu gốc được đánh dấu bằng huy hiệu ⚠ trong chế độ Study.
- Câu hỏi được gắn vào **14 module**, nhóm theo **7 giai đoạn học**, và ánh xạ tới **5 domain thi** (Kiến trúc & Điều phối Agentic, Thiết kế Công cụ & Tích hợp MCP, Cấu hình & Quy trình Claude Code, Kỹ thuật Prompt & Đầu ra có Cấu trúc, Quản lý Ngữ cảnh & Độ tin cậy).

## Tính năng

- **Chuyển đổi ngôn ngữ EN / VN** — lớp dịch runtime thay thế nội dung hiển thị sang tiếng Việt và ngược lại mà không cần tải lại trang; ngôn ngữ đã chọn được ghi nhớ cho lần truy cập sau.
- **Lưu trữ cục bộ** — tiến độ học (đánh dấu đã thuộc/cần ôn) và trạng thái checklist kế hoạch được lưu qua `localStorage`, có cơ chế dự phòng lưu tạm trong bộ nhớ cho tab hiện tại nếu trình duyệt chặn lưu trữ.
- **Không phụ thuộc thư viện ngoài** — toàn bộ JS/CSS/SVG thuần nằm trong một tệp; phần gọi ra ngoài duy nhất là Google Fonts (Space Grotesk, Inter, JetBrains Mono).

## Miễn trừ trách nhiệm

Không liên kết hay được Anthropic xác nhận. Đây là nội dung luyện tập — không phải đề thi chính thức.
