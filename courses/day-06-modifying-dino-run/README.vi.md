[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 6 — Chỉnh sửa Game Đầu tiên (`Dino Run`)

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 5](../day-05-tech-stack-deep-dive/README.vi.md) · **Tiếp theo:** [Ngày 7](../day-07-building-a-board-game/README.vi.md)

---

## Tổng quan & Khái niệm chính
Trước khi xây dựng game từ con số 0, cách nhanh nhất để rèn trực giác là **chỉnh sửa một game đang chạy tốt** bằng câu lệnh AI. Hôm nay bạn sẽ tùy biến [`games/dino-run/`](../../games/dino-run/docs/README.vi.md): đổi bảng màu, tinh chỉnh tốc độ vật lý và thêm một chướng ngại vật mới—tất cả đều được xác minh bằng Vitest và Playwright!

---

## Mục tiêu & Kết quả học tập
Sau Ngày 6, bạn sẽ có thể:
1. Tạo nhánh tính năng Git an toàn để thử nghiệm trên một game có sẵn.
2. Nhờ Google `agy` chỉnh sửa màu sắc kết xuất và hằng số mô phỏng một cách gọn gàng.
3. Thêm loại chướng ngại vật mới xuyên suốt `types.ts`, `engine.ts`, `canvasRenderer.ts` và `engine.test.ts`.
4. Xác minh thay đổi bằng `npm test`, `npm run test:e2e`, `tsc --noEmit` và `npm run build`.

---

## Hướng dẫn từng bước

### 1. Tạo nhánh Git thực hành
```bash
git checkout -b day-06-dino-mod
```

### 2. Xem qua các tệp sẽ chỉnh sửa
- [`games/dino-run/src/game/constants.ts`](../../games/dino-run/src/game/constants.ts) — Tốc độ (`BASE_SPEED`, `MAX_SPEED`, `SPEED_INCREMENT`)
- [`games/dino-run/src/game/types.ts`](../../games/dino-run/src/game/types.ts) & [`engine.ts`](../../games/dino-run/src/game/engine.ts) — Tạo chướng ngại vật & kiểm tra va chạm
- [`games/dino-run/src/renderer/canvasRenderer.ts`](../../games/dino-run/src/renderer/canvasRenderer.ts) — Màu nền bầu trời & vẽ chướng ngại vật

### 3. Nhờ `agy` tùy biến Màu sắc & Tốc độ
Dùng từng câu lệnh mẫu bên dưới, sau đó xem trực tiếp bằng:
```bash
cd games/dino-run && npm run dev
```

### 4. Nhờ `agy` thêm Chướng ngại vật mới + Unit Test
Yêu cầu `agy` thêm chướng ngại vật mới (ví dụ **Tảng đá sa mạc** lăn hoặc **Thiên thạch**), vẽ nó trong `canvasRenderer.ts` và thêm unit test Vitest trong `src/game/__tests__/engine.test.ts`.

### 5. Chạy Cổng xác minh đầy đủ
```bash
cd games/dino-run
npm test && npm run test:e2e && npx tsc --noEmit && npm run build
```

---

## Câu lệnh mẫu cho `agy`

**Câu lệnh 1 — Đổi màu nền:**
```text
In games/dino-run/src/renderer/canvasRenderer.ts, change the Classic Desert daytime background to a warm sunset peach (#fce7d6) while keeping high contrast for the deep-purple T-Rex and score text. Verify with npm test and npm run build.
```

**Câu lệnh 2 — Đổi tốc độ:**
```text
In games/dino-run/src/game/constants.ts, increase BASE_SPEED from 290 to 340 and SPEED_INCREMENT from 5.8 to 7.5 so the game feels snappier. Run npm test in games/dino-run to confirm all unit tests still pass.
```

**Câu lệnh 3 — Thêm chướng ngại vật mới:**
```text
/plan Add a new "boulder" obstacle to Classic mode in games/dino-run/ (types.ts, engine.ts, canvasRenderer.ts) that rolls along the ground slightly faster than cacti, and add a Vitest test for boulder collision in src/game/__tests__/engine.test.ts.
```

---

## Điểm cốt lõi
- Câu lệnh nhỏ, tập trung + xác minh ngay (`npm test`, `npm run dev`) giúp vibe coding nhanh và dễ đoán.
- Luôn cập nhật unit test khi thêm thực thể gameplay mới.

---

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` giải thích khoảng cách sinh chướng ngại vật và vùng va chạm trong `Dino Run`.
   ```text
   Read games/dino-run/src/game/engine.ts and explain how obstacle spawn gaps scale with speed and how hitbox forgiving margins work.
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` thêm hiệu ứng chuyển màu mượt mà khi chuyển Ngày/Đêm trong `Dino Run`.
   ```text
   In games/dino-run/src/renderer/canvasRenderer.ts, add a smooth color-lerp transition when switching between Day and Night every 700 points. Verify with make test GAME=dino-run and make build GAME=dino-run.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm cơ chế **Nhảy Đúp (Double-Jump)** trên nhánh thực hành.
   ```text
   /plan Add an optional Double-Jump mechanic to Classic mode in games/dino-run/ (types.ts, engine.ts) with a subtle jump-charge indicator on the HUD. Verify with make verify GAME=dino-run.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` bổ sung kiểm tra Playwright E2E cho tính năng mới và cập nhật `user-guide.md`.
   ```text
   Add a Playwright assertion in games/dino-run/e2e/dino.spec.ts verifying the new feature works in Chromium, and document it in games/dino-run/docs/user-guide.md. Run make test-e2e GAME=dino-run.
   ```
5. **Tạo Game Mới:** Nhờ `agy` xây dựng một game chạy vô tận tương tự mang tên **"Space Astro Runner"**.
   ```text
   /plan Create a similar endless runner "Space Astro Runner" in games/space-runner/ following AGENTS.md and .agents/skills/create-game/SKILL.md, dodging asteroids and laser drones with gravity flip controls.
   ```
