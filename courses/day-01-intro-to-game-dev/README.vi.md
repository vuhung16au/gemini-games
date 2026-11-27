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

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` lập bản đồ toàn bộ các game theo danh mục và công nghệ kết xuất.
   ```text
   Inspect src/registry/games.ts and games/*/package.json, then summarize all games grouped by category (Puzzle, Board, Arcade, Simulation, Card) and rendering layer.
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` làm thông báo khi tìm kiếm không thấy game trở nên hữu ích hơn.
   ```text
   In src/components/Dashboard.tsx and src/i18n/translations.ts, improve the empty-filter message so it reminds players they can press "/" to search or click Reset Filters across en, zh, and vi. Verify with make test and make lint.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm nút **"🎲 Chơi Ngẫu Nhiên"** trên Dashboard.
   ```text
   /plan Add a "Surprise Me" button in src/components/Dashboard.tsx (with en/zh/vi labels in src/i18n/translations.ts) that picks and opens a random game from visibleGames. Add a unit test in Dashboard.test.tsx and verify with make verify.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` đối chiếu danh sách game trong `README` 3 ngôn ngữ và chạy kiểm tra tuân thủ.
   ```text
   Verify that README.md, README.zh.md, and README.vi.md list every game in src/registry/games.ts, then run make check-docs.
   ```
5. **Tạo Game Mới:** Nhờ `agy` tạo mini-game **"Đoán Số (Guess the Number)"** tuân thủ `AGENTS.md`.
   ```text
   /plan Create a simple "Guess the Number" puzzle game in games/guess-number/ following AGENTS.md and .agents/skills/create-game/SKILL.md, with 1-100 range, hints (Higher/Lower), How to Play, Tutorial, Vitest >=70% coverage, and Playwright E2E.
   ```
