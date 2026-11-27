[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 1 — Nhập Môn Làm Game & Vibe Coding

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Mục lục Khóa học](../README.vi.md) · **Tiếp theo:** [Ngày 2](../day-02-game-dev-concepts/README.vi.md)

---

## Tổng quan & Ý chính
Hôm nay bạn sẽ dạo một vòng làm quen với **Gemini Games**, xem **vibe coding** cùng AI agent ngoài đời thật chạy ra sao, và tự tay bật Dashboard 16 game ngay trên máy mình—mà chưa cần gõ một dòng code nào.

- **Chơi thử bản Live Demo trước cho nóng máy:** Quẩy thử cả 16 game ngay tại **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)**.
- **Coding Agent (Khuyến nghị `agy` · Miễn phí + Google AI Pro):** Khóa học này và toàn bộ 16 game đều được tạo bằng **Google `agy` (Antigravity)**. **`agy` miễn phí** để xài, còn nếu có **Google AI Pro** thì càng đã vì mở được model **`orchestrator`** trong `agy`. Mấy prompt tương tự (kể cả từ khóa kinh điển `/plan`) cũng chạy ngon trên **Codex / ChatGPT, Claude Code, GitHub Copilot và Cursor**.
- **Vibe Coding khác Code truyền thống chỗ nào:** Code truyền thống là mất cả mấy tháng học cú pháp rồi gõ từng dòng. Còn với **vibe coding**, **ý tưởng, trải nghiệm người chơi và mục tiêu rõ ràng mới là số một**—cứ coi **source code như một artifact** được AI đẻ ra từ prompt, xong xuôi thì chốt kiểm tra bằng `make verify`.
- **Học tool & tech stack qua thực chiến:** Khóa học không nhồi nhét lý thuyết `git`, `make`, `agy`, TypeScript hay React đâu—bạn sẽ quen hết một cách tự nhiên ngay trong lúc chơi game, hỏi `agy` và độ lại game.
- **Chạy 100% Offline hoặc Đẩy Lên Cloud:** Clone về máy xong là chơi **100% offline** trên trình duyệt; lúc nào muốn khoe thì deploy lên **Cloudflare Workers** (hoặc **Vercel**).

---

## Mục tiêu & Kết quả sau Ngày 1
Xong Ngày 1, bạn sẽ nắm được:
1. Giải thích ngon lành vì sao trong vibe coding, ý tưởng và mục tiêu rõ ràng quan trọng hơn chuyện gõ cú pháp (coi source code như một artifact).
2. Fork, clone repo và bật được Gemini Games Dashboard tại máy (**100% offline**) bằng lệnh `make dev`.
3. Hỏi `agy` bằng ngôn ngữ đời thường để tóm tắt dự án, giới thiệu tech stack và giải thích các tính năng trong game.

---

## Hướng dẫn từng bước

### 1. Chơi thử Demo & Check đồ nghề trên máy
Trước hết, mở **[https://gemini-games.vuhung16plus.workers.dev/](https://gemini-games.vuhung16plus.workers.dev/)** để nghía qua thành phẩm, rồi mở terminal check nhanh mấy tool cơ bản:
```bash
node -v   # Khuyến nghị Node.js 20+
npm -v
git --version
```

### 2. Fork & Clone Repo Riêng Của Bạn
Bấm **Fork** tại `https://github.com/vuhung16au/gemini-games` để có một bản sao trên GitHub của riêng bạn (sau này commit/push cho thoải mái), rồi clone bản fork đó về:
```bash
git clone https://github.com/<your-username>/gemini-games.git
cd gemini-games
```

### 3. Cài thư viện & Bật Hub (100% offline)
Đứng ở thư mục gốc của repo và chạy:
```bash
npm install
make dev
```
Mở đường dẫn local mà Vite in ra (thường là `http://localhost:5173`) rồi vọc thử:
- Lọc game theo thể loại (`Giải đố`, `Cờ`, `Arcade`, `Mô phỏng`, `Đánh bài`).
- Bấm `/` để search, lấy phím `Mũi tên` lướt qua các thẻ game rồi nhấn `Enter` mở **Dino Run** hoặc **SimCity 3D**.
- Đổi qua lại `EN` / `中文` / `VI`, bật tắt Light/Dark mode và bấm sao ghim **Yêu thích** một game bạn thích.

### 4. Khám phá dự án bằng câu hỏi đời thường
Khoan đụng tới file code làm gì—cứ mở `agy` lên và hỏi thẳng bằng mấy prompt mẫu dưới đây.

---

## Prompt mẫu cho `agy`
Thử ném mấy câu này cho AI agent của bạn:
```text
Summarise this project in plain English (or Vietnamese) for a non-technical
learner, including what all 16 games are and how the Hub brings them together.
```
```text
Introduce the tech stack used in this project and explain what each tool does
in simple, everyday language.
```

---

## Chốt lại ý chính
- Vibe coding giúp người không chuyên IT vẫn làm được game web chạy thật chỉ bằng cách mô tả rõ thứ mình muốn.
- Một lệnh `npm run dev` (hoặc `make dev`) duy nhất là phục vụ trọn gói từ Dashboard gốc tới cả 16 game.

---

## Bài tập & Thử thách (Vibe Coding Thuần Prompt)

Dùng mấy prompt gợi ý bên dưới với Google `agy`—tuyệt đối không cần tự gõ dòng code nào:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` gom nhóm toàn bộ 16 game theo thể loại và phong cách đồ họa.
   ```text
   Summarise the project and group all 16 games by category (Puzzle, Board,
   Arcade, Simulation, Card) and visual style (2D, 3D, or Board/Card).
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` sửa lại dòng thông báo khi search không ra game cho thân thiện hơn trên cả 3 ngôn ngữ.
   ```text
   Improve the Hub's empty-search message so it gently reminds players they can
   press "/" to search or click Reset Filters, in English, Chinese, and
   Vietnamese. Verify everything passes.
   ```
3. **Thêm Tính năng Mới:** Nhờ `agy` gắn thêm nút **"🎲 Chơi Ngẫu Nhiên"** trên thanh header của Dashboard.
   ```text
   /plan Add a "Surprise Me" button to the Hub header (with English, Chinese, and
   Vietnamese labels) that picks and opens a random game from the visible list,
   and verify with automated tests.
   ```
4. **Check Tài liệu / Kiểm thử:** Nhờ `agy` rà soát danh sách 16 game trong `README` cả 3 thứ tiếng.
   ```text
   Check that the root README files in English, Chinese, and Vietnamese list all
   16 games accurately, and run the project's documentation compliance check.
   ```
5. **Tạo Game Mới:** Nhờ `agy` làm mini-game **"Đoán Số (Guess the Number)"** đúng chuẩn `AGENTS.md`.
   ```text
   /plan Create a simple "Guess the Number" puzzle game following the project's
   AGENTS.md rules, with a 1-100 range, Higher/Lower hints, How to Play,
   Tutorial, and automated tests.
   ```
