[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 5 — Hiểu Tech Stack Đằng Sau Vibe Coding

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 4](../day-04-dev-tools-and-ai-agents/README.vi.md) · **Tiếp theo:** [Ngày 6](../day-06-modifying-dino-run/README.vi.md)

---

## Tổng quan & Khái niệm chính
Ngay cả khi `agy` viết code thay bạn, việc hiểu **từng công nghệ trong tech stack làm nhiệm vụ gì** giúp bạn mô tả đúng loại game mình muốn! Hôm nay bạn sẽ hiểu vì sao dự án dùng **TypeScript, Vite, React** cùng 3 lớp hình ảnh: **CSS/SVG**, **HTML5 Canvas 2D** và **Three.js**.

| Công nghệ Hình ảnh | Phù hợp nhất cho | Ví dụ trong Repo |
| :--- | :--- | :--- |
| **CSS Grid + SVG + React** | Game bàn cờ, giải đố và đánh bài | `1024`, `checkers`, `sudoku`, `minesweeper`, `solitaire`, `ta-la-phom` |
| **HTML5 Canvas 2D** | Game arcade 60fps, đi cảnh, pixel art | `dino-run`, `flappy-bird`, `tetris`, `battle-city`, `super-mario-bros` |
| **Three.js (3D WebGL)** | Thế giới 3D, camera, ánh sáng, bóng đổ | `simcity` |

---

## Mục tiêu & Kết quả học tập
Sau Ngày 5, bạn sẽ có thể:
1. Chọn đúng phong cách hiển thị (**Bàn cờ/Bài**, **Canvas 2D**, hay **3D Three.js**) khi mô tả game mới cho `agy`.
2. Giải thích dễ hiểu vai trò của **TypeScript**, **Vite**, **React**, **Web Audio**, **Vitest** và **Playwright**.
3. Hiểu vì sao dự án tránh dùng CDN bên ngoài để game chạy ngoại tuyến và tải siêu nhanh.

---

## Hướng dẫn từng bước

### 1. 6 Thành Phần Cốt Lõi (Ngôn Ngữ Đời Thường)
- **TypeScript:** Kiểm tra lỗi đánh máy hoặc dữ liệu thiếu trước khi người chơi gặp sự cố.
- **Vite:** Hiển thị thay đổi tức thì khi phát triển (`make dev`) và đóng gói gọn nhẹ khi xuất bản (`make build`).
- **React:** Tạo menu, nút bấm, bảng điểm, hộp thoại **Hướng dẫn chơi** và **Tutorial**.
- **Web Audio API:** Tạo hiệu ứng âm thanh retro bằng toán học—không cần tải tệp `.mp3`!
- **Vitest & Playwright:** Tự động kiểm tra luật chơi và thao tác chuột/phím thật trên trình duyệt.

---

## Câu lệnh mẫu cho `agy`
```text
Introduce the tech stack used in this project in plain English (or Vietnamese), and explain when I should ask for CSS/SVG vs. Canvas 2D vs. Three.js when creating a new game.
```
```text
Explain why Gemini Games keeps zero external CDN links and generates sound effects mathematically instead of downloading MP3 files.
```

---

## Điểm cốt lõi
- Biết lớp hình ảnh nào hợp với ý tưởng giúp câu lệnh của bạn rõ ràng gấp 10 lần.
- TypeScript + Vite + React + Vitest + Playwright là bộ khung vững chắc phía sau mỗi game.

---

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` giải thích cách bộ quy chuẩn giao diện giữ màu sắc và nút bấm đồng nhất trên cả 16 game.
   ```text
   Explain in plain English how the shared style guide keeps colors, buttons, and Light/Dark themes consistent across the Hub and all 16 games.
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` tăng độ tương phản viền của khối bóng mờ (Ghost) trong `Tetris`.
   ```text
   Improve the contrast of Tetris's Ghost piece outline so players can clearly see where the block will land, and verify with make verify GAME=tetris.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm nút **"Chế độ Tương phản cao"** cho `Sudoku`.
   ```text
   /plan Add a High-Contrast Mode toggle to Sudoku (saved with player settings) that makes selected cells and mistake highlights extra clear. Verify with make verify GAME=sudoku.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` thêm kiểm thử trình duyệt trên màn hình điện thoại cho `Minesweeper`.
   ```text
   Add a Playwright browser test for Minesweeper confirming the Easy 9x9 board fits cleanly on a mobile phone screen (390x844) with no horizontal scrolling. Run make test-e2e GAME=minesweeper.
   ```
5. **Tạo Game Mới:** Nhờ `agy` xây dựng game **"Lật Thẻ Trí Nhớ (Memory Match)"** với biểu tượng SVG sắc nét.
   ```text
   /plan Create a "Memory Match" card-flipping puzzle game following AGENTS.md, with a 4x4 grid, custom SVG card icons, move counter, How to Play, Tutorial, Hint, and automated tests.
   ```
