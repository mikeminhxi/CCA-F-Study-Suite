# CCA-F Study Suite

[🇺🇸 English](README.md) · **🇻🇳 Tiếng Việt** · [🇯🇵 日本語](README.ja.md)

Một tệp HTML độc lập (không cần build, không cần server, không phụ thuộc thư viện ngoài) để ôn thi chứng chỉ **Claude Certified Architect — Foundations (CCA-F)** của Anthropic. Chỉ cần mở `cca-f-study-suite-vn.html` bằng trình duyệt là dùng được.

## Cách mở

Nhấp đúp vào [cca-f-study-suite-vn.html](cca-f-study-suite-vn.html), hoặc chạy bằng bất kỳ static file server nào. Tiến độ học được lưu cục bộ ngay trên trình duyệt (`localStorage`), theo từng thiết bị/trình duyệt.

## Nội dung trang

Trang có dạng shell với 4 tab công cụ. Trên màn hình rộng (từ 900px trở lên), trang khóa vào bố cục chiều cao cố định với thanh điều hướng trên cùng luôn dính, để mỗi công cụ tự cuộn riêng; dưới ngưỡng đó, trang quay lại kiểu cuộn liên tục một trang duy nhất.

| Tab | Chức năng |
|---|---|
| **Study Console** (Bảng luyện thi) | Công cụ luyện tập chính. Gồm lộ trình học 7 giai đoạn (từ Nền tảng → Tình huống ứng dụng) xây từ 14 module chủ đề được gắn nhãn theo domain thi, bảng tóm tắt nguyên lý cốt lõi kèm bảng quy tắc "Thấy dấu hiệu → Áp dụng mẫu", chế độ Study kiểu flashcard (đánh dấu câu hỏi Đã thuộc/Cần ôn, xem giải thích, xem các thẻ từ khóa được tự động gắn cho từng câu), và chế độ Quiz nhóm theo domain — tab "Exam by Domain" (Thi theo lĩnh vực) — nơi bạn bật/tắt cả domain hoặc từng module, chọn số câu, rồi làm bài có chấm điểm kèm giải thích cho từng câu sai. |
| **Study Hub** (Trung tâm học) | Trang tra cứu theo 5 domain chính thức của kỳ thi (theo trọng số D1–D5), với quy tắc quyết định theo từng domain, các bẫy cần tránh, từ khóa nhận diện, và bảng tra cứu nhanh có tìm kiếm. |
| **Neuron Map** (Bản đồ tư duy) | Sơ đồ khái niệm SVG tương tác, liên kết các domain thi với chủ đề con, có cả các đường nối "synapse" xuyên domain có thể bấm vào. |
| **2-Week Plan** (Kế hoạch 2 tuần) | Kế hoạch học theo checklist từng ngày, có thanh tiến độ riêng; kèm cơ chế dự phòng xuất/nhập file JSON thủ công cho các trường hợp `localStorage` không dùng được (ví dụ một số cách mở qua `file://`). |

## Nội dung câu hỏi

- **157 câu hỏi duy nhất**, lấy từ `CCA-F_Study_Guide.md` — 67 câu trùng lặp giữa Section 1 (Q1–77) và Section 2 (Q1–148) của tài liệu gốc đã được gộp lại (giữ bản ở Section 1 vì có kèm giải thích). Một cặp câu có đáp án mâu thuẫn thật sự trong tài liệu gốc được đánh dấu bằng huy hiệu ⚠ trong chế độ Study.
- Câu hỏi được gắn vào **14 module**, nhóm theo **7 giai đoạn học**, và ánh xạ tới **5 domain thi**: Agentic Architecture & Orchestration (Kiến trúc & Điều phối Agentic, 27%), Claude Code Configuration & Workflows (Cấu hình & Quy trình Claude Code, 20%), Prompt Engineering & Structured Output (Kỹ thuật Prompt & Đầu ra có Cấu trúc, 20%), Tool Design & MCP Integration (Thiết kế Công cụ & Tích hợp MCP, 18%), và Context Management & Reliability (Quản lý Ngữ cảnh & Độ tin cậy, 15%).

## Tính năng

- **Chuyển đổi ngôn ngữ EN / VN** — lớp dịch runtime thay thế nội dung hiển thị sang tiếng Việt và ngược lại mà không cần tải lại trang; ngôn ngữ đã chọn được ghi nhớ cho lần truy cập sau.
- **Từ khóa tự động gắn thẻ** — mỗi câu hỏi được đối chiếu với danh sách hàng chục từ khóa đặc trưng của đề thi (ví dụ "MCP resource", "stateless", "tool_choice") và hiển thị những từ khớp dưới dạng thẻ, giúp cụm từ mấu chốt nổi bật lên trước khi bạn đọc phần giải thích.
- **Lưu trữ cục bộ** — tiến độ học (đánh dấu đã thuộc/cần ôn) và trạng thái checklist kế hoạch được lưu qua `localStorage`, có cơ chế dự phòng lưu tạm trong bộ nhớ cho tab hiện tại nếu trình duyệt chặn lưu trữ.
- **Không phụ thuộc thư viện ngoài** — toàn bộ JS/CSS/SVG thuần nằm trong một tệp; phần gọi ra ngoài duy nhất là Google Fonts (Space Grotesk, Inter, JetBrains Mono).

## Miễn trừ trách nhiệm

Không liên kết hay được Anthropic xác nhận. Đây là nội dung luyện tập — không phải đề thi chính thức.
