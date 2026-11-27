[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 1 — Nhập môn Phát triển Game & Vibe Coding

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Mục lục Khóa học](../README.vi.md) · **Tiếp theo:** [Ngày 2](../day-02-game-dev-concepts/README.vi.md)

---

## Tổng quan & Khái niệm chính
Hôm nay bạn sẽ khám phá kho mã nguồn **Gemini Games**, hiểu ý nghĩa thực tế của **vibe coding** cùng AI agents, và khởi chạy Bảng điều khiển hợp nhất trên máy của mình.

- **Vibe Coding (Có cấu trúc):** Mô tả *những gì* bạn muốn xây dựng bằng ngôn ngữ tự nhiên rõ ràng, để AI coding agent (`agy`) lập kế hoạch và tạo mã nguồn/tài nguyên, rồi **xác minh mọi thay đổi bằng kiểm thử tự động**.
- **Game Web Local-First:** Mọi game trong kho mã nguồn đều chạy ngoại tuyến trên trình duyệt không cần CDN bên ngoài, sau đó biên dịch thành thư mục tĩnh `dist/` cho Cloudflare Workers.

---

## Mục tiêu & Kết quả học tập
Sau Ngày 1, bạn sẽ có thể:
1. Giải thích cách AI coding agents tăng tốc quá trình lập kế hoạch, viết mã, tạo đồ họa và kiểm thử.
2. Khởi chạy Gemini Games Dashboard tại máy bằng `npm run dev`.
3. Khám phá các game hiện có và mở thư mục `docs/` của từng game.

---

## Hướng dẫn từng bước

### 1. Kiểm tra môi trường
```bash
node -v   # Khuyến nghị Node.js 20+
npm -v
git --version
```

### 2. Cài đặt thư viện & Khởi chạy Hub
Từ thư mục gốc của kho mã nguồn:
```bash
npm install
npm run dev
```
Mở URL local mà Vite hiển thị (ví dụ `http://localhost:5173`) và thử:
- Lọc theo danh mục (`Giải đố`, `Cờ`, `Arcade`, `Mô phỏng`, `Đánh bài`).
- Nhấn `/` để tìm kiếm, dùng phím `Mũi tên` để di chuyển qua các thẻ và nhấn `Enter` để mở **Dino Run** hoặc **SimCity 3D**.
- Chuyển đổi giao diện Sáng/Tối, đổi ngôn ngữ (`EN` / `中文` / `VI`) và gắn sao yêu thích một trò chơi.

### 3. Tham quan các tệp tài liệu chính
Đọc 3 tệp sau để thấy cách dự án duy trì tính nhất quán:
- [`README.vi.md`](../../README.vi.md) — Tổng quan dự án và toàn bộ danh sách game
- [`QUICKSTART.md`](../../QUICKSTART.md) — Các lệnh thường dùng hằng ngày
- [`AGENTS.md`](../../AGENTS.md) — "Bản hợp đồng" mà mọi AI agent tuân thủ khi xây dựng game tại đây

---

## Câu lệnh mẫu cho `agy`
Thử hỏi AI agent của bạn:
```text
Explain the folder structure of this repository and list all games grouped by rendering technology (Canvas 2D, Three.js, CSS/SVG).
```
```text
Run npm test at the repository root and explain what each passing test verifies.
```

---

## Điểm cốt lõi
- Vibe coding hiệu quả nhất khi đi kèm bộ quy tắc rõ ràng ([`AGENTS.md`](../../AGENTS.md)) và kiểm thử tự động.
- Một lệnh `npm run dev` duy nhất phục vụ cả Dashboard gốc lẫn toàn bộ các game độc lập.

---

## Bài tập & Thử thách
1. Mở **3 game khác nhau** (một game Canvas 2D, một game Cờ/Bài CSS/SVG và `SimCity 3D`), sau đó mở hộp thoại **? Trợ giúp** và **Hướng dẫn (Tutorial)** của từng game.
2. Chạy `npm test` tại thư mục gốc và xác nhận mọi bài kiểm thử đều đạt.
3. **Thử thách:** Mở `games/dino-run/docs/README.vi.md` và đối chiếu xem tài liệu đó tuân thủ `AGENTS.md` như thế nào.
