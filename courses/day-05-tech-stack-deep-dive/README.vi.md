[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 5 — Tìm hiểu Chuyên sâu về Tech Stack

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 4](../day-04-dev-tools-and-ai-agents/README.vi.md) · **Tiếp theo:** [Ngày 6](../day-06-modifying-dino-run/README.vi.md)

---

## Tổng quan & Khái niệm chính
Hôm nay bạn sẽ hiểu *lý do* kho mã nguồn này lựa chọn từng công nghệ trong [`docs/techstack.md`](../../docs/techstack.md) và [`techstacks/techstack.md`](../../techstacks/techstack.md), cũng như khi nào nên chọn **CSS/SVG**, **HTML5 Canvas 2D**, hoặc **Three.js**.

| Lớp kết xuất (Rendering) | Phù hợp nhất cho | Ví dụ trong Repo |
| :--- | :--- | :--- |
| **CSS Grid + SVG + React** | Game bàn cờ, giải đố và đánh bài | `1024`, `checkers`, `sudoku`, `minesweeper`, `solitaire`, `ta-la-phom` |
| **HTML5 Canvas 2D** | Game arcade 60fps, đi cảnh, pixel art | `dino-run`, `flappy-bird`, `tetris`, `battle-city`, `super-mario-bros` |
| **Vanilla Three.js (WebGL)** | Thế giới 3D, camera, ánh sáng, raycasting | `simcity` |

---

## Mục tiêu & Kết quả học tập
Sau Ngày 5, bạn sẽ có thể:
1. Chọn đúng lớp kết xuất (CSS/SVG vs. Canvas 2D vs. Three.js) cho bất kỳ ý tưởng game mới nào.
2. Giải thích vai trò của **TypeScript**, **Vite**, **React**, **Web Audio API**, **Vitest** và **Playwright**.
3. Đọc hiểu vòng lặp vẽ Canvas 2D cơ bản và cách thiết lập cảnh Three.js.

---

## Hướng dẫn từng bước

### 1. Nền tảng Cốt lõi
- **TypeScript (`strict: true`):** Phát hiện trạng thái sai, tọa độ lỗi và trường bị thiếu ngay lúc biên dịch (`npx tsc --noEmit`).
- **Vite (`base: './'`):** Tải lại nóng tức thì khi `npm run dev` và tạo gói tĩnh `dist/` gọn nhẹ.
- **React 18:** Kết xuất HUD dễ tiếp cận, hộp thoại (`HowToPlayModal`), nút bấm và lớp phủ phía trên canvas game.

### 2. So sánh 3 Trình kết xuất Thực tế trong Repo
Mở một tệp đại diện từ mỗi tầng kết xuất:
1. **CSS/SVG:** [`games/checkers/src/components/CheckersBoard.tsx`](../../games/checkers/src/components/CheckersBoard.tsx)
2. **HTML5 Canvas 2D:** [`games/battle-city/src/renderer/canvasRenderer.ts`](../../games/battle-city/src/renderer/canvasRenderer.ts)
3. **Three.js 3D:** [`games/simcity/src/renderer/CityScene.ts`](../../games/simcity/src/renderer/CityScene.ts)

### 3. Ngăn xếp Kiểm thử
- **Vitest:** Chạy unit test TypeScript thuần trong Node (`src/**/*.test.ts`).
- **Playwright:** Khởi chạy Chromium thật, nhấp nút, nhấn phím, kiểm tra không lỗi console và xác minh lưu trữ `localStorage` (`e2e/*.spec.ts`).

---

## Câu lệnh mẫu cho `agy`
```text
Compare how games/dino-run/src/renderer/canvasRenderer.ts (Canvas 2D) and games/simcity/src/renderer/CityScene.ts (Three.js) handle the animation loop, resizing, and cleanup on unmount.
```

---

## Điểm cốt lõi
- Chọn công cụ kết xuất đơn giản nhất phù hợp cơ chế game: CSS/SVG cho bàn cờ/bài, Canvas 2D cho hành động 2D, Three.js cho thế giới 3D.
- Luôn dùng React cho HUD/menu và Web Audio API tạo âm thanh bằng mã để không cần tệp âm thanh rời.

---

## Bài tập & Thử thách
1. Đọc [`docs/techstack.md`](../../docs/techstack.md) và liệt kê 3 lý do dự án này tránh dùng CDN bên ngoài lúc chạy.
2. **Thử thách:** Mở [`styles/tokens.css`](../../styles/tokens.css) và [`styles/theme.ts`](../../styles/theme.ts) để xem các biến CSS và màu Canvas/Three.js được đồng bộ như thế nào.
