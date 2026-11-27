[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 8 — Xây dựng Game 2D Canvas Đầu tiên từ Con số 0

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 7](../day-07-building-a-board-game/README.vi.md) · **Tiếp theo:** [Ngày 9](../day-09-building-a-3d-game/README.vi.md)

---

## Tổng quan & Khái niệm chính
Hôm nay bạn sẽ nâng cấp từ bàn cờ theo lượt lên **game HTML5 Canvas 2D thời gian thực 60fps** từ con số 0 (ví dụ **Breakout** hoặc **Snake** tại `games/breakout/`, cổng Playwright **`4190`**).

Các mẫu thiết kế 2D thời gian thực bạn sẽ áp dụng:
- **Vòng lặp Game giới hạn `dt`:** `const dt = Math.min(0.05, (now - last) / 1000)` + tự động tạm dừng khi `visibilitychange`.
- **Toán học Va chạm:** Nảy góc Hình tròn-vs-AABB (cho Breakout) hoặc chiếm ô lưới (cho Snake) trong TypeScript thuần `src/game/engine.ts`.
- **Điều khiển Linh hoạt:** Bàn phím (`Mũi tên` / `WASD`, `Space`, `preventDefault()`) + Con trỏ/Cảm ứng (`touch-action: none`).

---

## Mục tiêu & Kết quả học tập
Sau Ngày 8, bạn sẽ có thể:
1. Thiết kế kiến trúc game 2D Canvas thời gian thực tách biệt mô phỏng `src/game/` và kết xuất `src/renderer/canvasRenderer.ts`.
2. Thêm hiệu ứng âm thanh Web Audio API tạo bằng mã (nảy bóng, vỡ gạch, combo, kết thúc).
3. Kiểm thử gameplay Canvas thời gian thực một cách xác định với Vitest và trên Chromium với Playwright.

---

## Hướng dẫn từng bước

### 1. Tạo nhánh tính năng
```bash
git checkout -b day-08-2d-breakout
```

### 2. Tham khảo một game Canvas 2D có sẵn trong Repo
Xem lướt [`games/battle-city/docs/architecture.md`](../../games/battle-city/docs/architecture.md) hoặc [`games/tetris/docs/architecture.md`](../../games/tetris/docs/architecture.md) để thấy cách `requestAnimationFrame`, `ref` đầu vào và lớp phủ HUD React phối hợp mà không gây giật do render lại React ở 60fps.

### 3. Dùng `/plan` với `agy` để xây dựng Game 2D của bạn
Dùng câu lệnh mẫu bên dưới, xem xét kế hoạch (toán va chạm, màn chơi, cổng `4190`) và phê duyệt thực thi.

### 4. Xác minh Độc lập & Hub Hợp nhất
```bash
cd games/breakout && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
cd ../.. && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
```

---

## Câu lệnh mẫu cho `agy`

```text
/plan Build a new 2D HTML5 Canvas game "Breakout" in games/breakout/ following AGENTS.md completely:
- Pure simulation in src/game/ (paddle movement, circle-vs-AABB brick & paddle angle bounce, 5 brick layouts, power-ups: Wide Paddle & Multi-Ball, lives, combo scoring, localStorage breakout_v1)
- Crisp Canvas 2D renderer using styles/theme.ts colors, procedural Web Audio SFX + Mute
- Keyboard (Arrows/A-D/Space) + pointer/touch drag controls, visibilitychange auto-pause
- How to Play modal, 3-step Tutorial, live Hint tip, original icons & covers in public/, all 6 docs in docs/ (plus README.zh.md and README.vi.md)
- Vitest unit tests + Playwright E2E tests on dedicated port 4190
- Register in src/registry/games.ts (category: Arcade) and update root tests
```

---

## Điểm cốt lõi
- Giữ vật lý từng khung hình trong `useRef` + `requestAnimationFrame`, chỉ đồng bộ các bộ đếm HUD (điểm, mạng, màn) vào React state.
- Các hàm va chạm thuần trong `src/game/` giúp Vitest kiểm tra góc nảy phức tạp mà không cần mở trình duyệt.

---

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` giải thích toán va chạm Hình tròn-vs-AABB và đồng bộ `requestAnimationFrame`.
   ```text
   Read games/breakout/src/game/engine.ts (or games/battle-city/src/game/engine.ts) and explain how collision normals and clamped dt keep 60fps Canvas physics deterministic.
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` tinh chỉnh góc nảy mép thanh đỡ và tăng cao độ âm thanh Web Audio theo combo.
   ```text
   In games/breakout/, refine paddle edge-hit reflection angles so corner hits feel snappier and scale the brick-break Web Audio pitch with the current combo. Verify with make test GAME=breakout.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm **Gạch Trùm (Boss Brick)** 3 máu có vết nứt sau mỗi lần chạm.
   ```text
   /plan Add a "Boss Brick" (3 HP, renders crack stages on Canvas, awards bonus points) to games/breakout/ and add unit tests for 3-hit destruction. Verify with make verify GAME=breakout.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` thêm kiểm thử Playwright kéo cảm ứng trên di động và cập nhật `user-guide.md`.
   ```text
   In games/breakout/e2e/breakout.spec.ts, add a responsive 390x844 touch-drag test and document mobile controls in games/breakout/docs/user-guide.md. Run make test-e2e GAME=breakout.
   ```
5. **Tạo Game Mới:** Nhờ `agy` xây dựng một game 2D Canvas kinh điển tương tự: **Rắn Săn Mồi (Classic Snake)**.
   ```text
   /plan Create "Classic Snake" in games/snake/ following AGENTS.md, .agents/skills/create-game/SKILL.md, and .agents/skills/canvas-and-threejs-patterns/SKILL.md, with grid wrapping toggle, speed levels, How to Play, Tutorial, Hint, and >=70% coverage.
   ```
