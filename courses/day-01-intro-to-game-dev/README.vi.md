[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 1 — Nhập môn Phát triển Game & Vibe Coding

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Mục lục Khóa học](../README.vi.md) · **Tiếp theo:** [Ngày 2](../day-02-game-dev-concepts/README.vi.md)

---

## Tổng quan & Khái niệm chính
Hôm nay bạn sẽ khám phá dự án **Gemini Games**, hiểu **vibe coding** cùng AI agent hoạt động thế nào trong thực tế, và chạy Bảng điều khiển 16 game ngay trên máy—mà không cần tự viết dòng code nào.

- **Trải nghiệm bản Demo trực tuyến trước:** Chơi thử cả 16 game ngay tại **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)**.
- **Vibe Coding khác Lập trình truyền thống ra sao:** Với lập trình truyền thống, bạn phải mất nhiều tháng học cú pháp và gõ từng dòng code. Với **vibe coding**, **ý tưởng, trải nghiệm người chơi và mục tiêu rõ ràng mới là điều quan trọng nhất**—bạn có thể xem **mã nguồn như một sản phẩm đầu ra (artifact)** được tạo từ prompt và xác minh bằng lệnh tự động (`make verify`).
- **Học công cụ & tech stack qua thực hành:** Khóa học không dạy `git`, `make`, `agy`, TypeScript hay React như lý thuyết khô khan—bạn sẽ làm quen tự nhiên trong quá trình chơi, hỏi `agy` và chỉnh sửa game.
- **Chạy 100% Ngoại tuyến hoặc Đưa lên Cloud:** Sau khi clone về máy, toàn bộ game chạy **100% ngoại tuyến** trên trình duyệt; khi muốn chia sẻ, bạn có thể deploy lên **Cloudflare Workers** (hoặc **Vercel**).

---

## Mục tiêu & Kết quả học tập
Sau Ngày 1, bạn sẽ có thể:
1. Giải thích vì sao ý tưởng và mục tiêu rõ ràng quan trọng hơn cú pháp thủ công trong vibe coding (xem mã nguồn như một artifact).
2. Clone kho mã nguồn và khởi chạy Gemini Games Dashboard tại máy (**100% ngoại tuyến**) bằng `make dev`.
3. Hỏi `agy` bằng ngôn ngữ tự nhiên để tóm tắt dự án, giới thiệu tech stack và giải thích tính năng game.

---

## Hướng dẫn từng bước

### 1. Chơi thử Demo & Kiểm tra môi trường
Trước hết, hãy mở **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)** để xem sản phẩm thực tế, sau đó kiểm tra công cụ trên máy:
```bash
node -v   # Khuyến nghị Node.js 20+
npm -v
git --version
```

### 2. Clone kho mã nguồn
```bash
git clone https://github.com/vuhung16au/gemini-games.git
cd gemini-games
```

### 3. Cài đặt thư viện & Khởi chạy Hub (100% ngoại tuyến)
Từ thư mục gốc của kho mã nguồn:
```bash
npm install
make dev
```
Mở URL local mà Vite hiển thị (ví dụ `http://localhost:5173`) và thử:
- Lọc theo danh mục (`Giải đố`, `Cờ`, `Arcade`, `Mô phỏng`, `Đánh bài`).
- Nhấn `/` để tìm kiếm, dùng phím `Mũi tên` để di chuyển qua các thẻ và nhấn `Enter` để mở **Dino Run** hoặc **SimCity 3D**.
- Chuyển ngôn ngữ `EN` / `中文` / `VI`, đổi giao diện Sáng/Tối và gắn sao yêu thích một trò chơi.

### 3. Khám phá Dự án bằng Câu lệnh Đời thường
Bạn không cần đọc tệp mã nguồn—chỉ cần hỏi `agy` bằng các câu lệnh mẫu dưới đây.

---

## Câu lệnh mẫu cho `agy`
Thử hỏi AI agent của bạn:
```text
Summarise this project in plain English (or Vietnamese) for a non-technical
learner, including what all 16 games are and how the Hub brings them together.
```
```text
Introduce the tech stack used in this project and explain what each tool does
in simple, everyday language.
```

---

## Điểm cốt lõi
- Vibe coding giúp người không chuyên IT tạo ra game trình duyệt hoàn chỉnh chỉ bằng cách mô tả kết quả mong muốn.
- Một lệnh `npm run dev` duy nhất phục vụ cả Dashboard gốc lẫn toàn bộ 16 trò chơi.

---

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` tóm tắt toàn bộ 16 game theo thể loại và phong cách đồ họa.
   ```text
   Summarise the project and group all 16 games by category (Puzzle, Board,
   Arcade, Simulation, Card) and visual style (2D, 3D, or Board/Card).
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` làm thông báo khi tìm kiếm không thấy game trở nên thân thiện hơn trên cả 3 ngôn ngữ.
   ```text
   Improve the Hub's empty-search message so it gently reminds players they can
   press "/" to search or click Reset Filters, in English, Chinese, and
   Vietnamese. Verify everything passes.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm nút **"🎲 Chơi Ngẫu Nhiên"** trên Dashboard.
   ```text
   /plan Add a "Surprise Me" button to the Hub header (with English, Chinese, and
   Vietnamese labels) that picks and opens a random game from the visible list,
   and verify with automated tests.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` đối chiếu danh sách 16 game trong `README` 3 ngôn ngữ.
   ```text
   Check that the root README files in English, Chinese, and Vietnamese list all
   16 games accurately, and run the project's documentation compliance check.
   ```
5. **Tạo Game Mới:** Nhờ `agy` tạo mini-game **"Đoán Số (Guess the Number)"** tuân thủ `AGENTS.md`.
   ```text
   /plan Create a simple "Guess the Number" puzzle game following the project's
   AGENTS.md rules, with a 1-100 range, Higher/Lower hints, How to Play,
   Tutorial, and automated tests.
   ```
