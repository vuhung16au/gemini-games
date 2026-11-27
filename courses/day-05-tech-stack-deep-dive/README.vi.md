[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 5 — Giải Mã Tech Stack Đằng Sau Vibe Coding

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 4](../day-04-dev-tools-and-ai-agents/README.vi.md) · **Tiếp theo:** [Ngày 6](../day-06-modifying-dino-run/README.vi.md)

---

## Bức tranh toàn cảnh
Dù `agy` lo phần gõ code từ A đến Z, nhưng nếu bạn hiểu **mỗi mảnh ghép trong tech stack sinh ra để làm gì**, bạn sẽ ra lệnh cho AI chuẩn xác hơn hẳn! Hôm nay mình sẽ cùng "bóc tem" bộ **TypeScript, Vite, React** cùng 3 lớp đồ họa chính của repo: **CSS/SVG**, **HTML5 Canvas 2D** và **Three.js**.

| Lớp đồ họa | Hợp nhất với thể loại nào? | Ví dụ trong Repo |
| :--- | :--- | :--- |
| **CSS Grid + SVG + React** | Game bàn cờ, giải đố, đánh bài | `1024`, `checkers`, `sudoku`, `minesweeper`, `solitaire`, `ta-la-phom` |
| **HTML5 Canvas 2D** | Game arcade 60fps, đi cảnh, pixel art | `dino-run`, `flappy-bird`, `tetris`, `battle-city`, `super-mario-bros` |
| **Three.js (3D WebGL)** | Thế giới 3D, camera, ánh sáng, bóng đổ | `simcity` |

---

## Học xong hôm nay bạn làm được gì?
1. Chọn đúng "áo" đồ họa (**CSS/SVG**, **Canvas 2D**, hay **3D Three.js**) mỗi khi lên ý tưởng game mới cho `agy`.
2. Hiểu gọn gàng vai trò của **TypeScript**, **Vite**, **React**, **Web Audio**, **Vitest** và **Playwright** mà không cần thuộc lòng cú pháp.
3. Biết vì sao repo nói không với CDN bên ngoài để game chạy **100% offline** mà load vẫn nhanh như chớp.

---

## Điểm danh 6 "nhân vật" cốt lõi (giải thích kiểu đời thường)

- **TypeScript:** Người gác cổng khó tính—bắt lỗi gõ nhầm hay thiếu dữ liệu ngay từ lúc viết code, trước khi người chơi kịp gặp bug.
- **Vite:** Trợ lý tăng tốc—bạn sửa gì là hiện ngay tức thì lúc dev (`make dev`), đến lúc xuất xưởng (`make build`) thì đóng gói gọn nhẹ hết mức.
- **React:** Thợ dựng giao diện—lo toàn bộ menu, nút bấm, bảng điểm, hộp thoại **How to Play** và **Tutorial**.
- **Web Audio API:** Nhạc công toán học—tự tổng hợp hiệu ứng âm thanh retro (SFX) bằng công thức toán, khỏi cần tải hay đính kèm file `.mp3` nặng nề.
- **Vitest & Playwright:** Đội QA cần mẫn—**Vitest** chạy **unit test** kiểm tra luật chơi, còn **Playwright** mở hẳn trình duyệt thật để bấm chuột, gõ phím thay người dùng (**E2E test**).

---

## Prompt mẫu để hỏi `agy`
```text
Introduce the tech stack used in this project in plain English (or
Vietnamese), and explain when I should ask for CSS/SVG vs. Canvas 2D vs.
Three.js when creating a new game.
```
```text
Explain why Gemini Games keeps zero external CDN links and generates sound
effects mathematically instead of downloading MP3 files.
```

---

## Chốt lại cho nhớ
- Biết chọn đúng lớp đồ họa ngay từ đầu giúp **prompt** của bạn rõ nét hơn gấp 10 lần.
- Bộ khung **TypeScript + Vite + React + Vitest + Playwright** chính là "bệ đỡ" giúp mọi game trong hub chạy mượt và ít lỗi vặt.

---

## Bài tập thực hành (Vibe Coding thuần bằng Prompt)

Cứ copy các prompt bên dưới giao cho Google `agy` xử lý—tuyệt đối không cần tự mở file gõ code tay:

1. **Hiểu sâu project hơn:** Nhờ `agy` giải thích cách bộ style chung giữ màu sắc và nút bấm đồng bộ trên cả 16 game.
   ```text
   Explain in plain English how the shared style guide keeps colors, buttons, and
   Light/Dark themes consistent across the Hub and all 16 games.
   ```
2. **Nâng cấp tính năng có sẵn:** Nhờ `agy` làm viền khối bóng mờ (Ghost piece) trong `Tetris` rõ hơn cho dễ canh.
   ```text
   Improve the contrast of Tetris's Ghost piece outline so players can clearly
   see where the block will land, and verify with make verify GAME=tetris.
   ```
3. **Làm thêm tính năng mới:** Nhờ `agy` gắn thêm nút **High-Contrast Mode** (Chế độ Tương phản cao) cho `Sudoku`.
   ```text
   /plan Add a High-Contrast Mode toggle to Sudoku (saved with player settings)
   that makes selected cells and mistake highlights extra clear. Verify with make
   verify GAME=sudoku.
   ```
4. **Cải thiện test / docs:** Nhờ `agy` viết thêm **E2E test** trên màn hình điện thoại cho `Dò Mìn` (`Minesweeper`).
   ```text
   Add a Playwright browser test for Minesweeper confirming the Easy 9x9 board
   fits cleanly on a mobile phone screen (390x844) with no horizontal scrolling.
   Run make test-e2e GAME=minesweeper.
   ```
5. **Tạo game mới toanh:** Nhờ `agy` dựng game lật thẻ **"Memory Match"** dùng icon SVG sắc nét.
   ```text
   /plan Create a "Memory Match" card-flipping puzzle game following AGENTS.md,
   with a 4x4 grid, custom SVG card icons, move counter, How to Play, Tutorial,
   Hint, and automated tests.
   ```
