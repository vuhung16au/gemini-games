[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 7 — Xây dựng Game Bàn cờ Đầu tiên từ Con số 0

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 6](../day-06-modifying-dino-run/README.vi.md) · **Tiếp theo:** [Ngày 8](../day-08-building-a-2d-game/README.vi.md)

---

## Tổng quan & Khái niệm chính
Hôm nay bạn sẽ xây dựng một game bàn cờ hoàn chỉnh **tuân thủ `AGENTS.md`** từ đầu—**Tic Tac Toe (Cờ Ca-rô 3×3)** (`games/tic-tac-toe/`)—với cả chế độ **Đấu AI (Minimax)** và **2 Người chơi tại chỗ**, đồ họa gốc, 6 tài liệu, kiểm thử tự động và đăng ký vào Dashboard hợp nhất!

```mermaid
flowchart TD
  Plan["1. /plan Tic Tac Toe"] --> Sim["2. Luật Thuần + Minimax AI (src/game/)"]
  Sim --> UI["3. Bàn cờ React CSS/SVG + Hướng dẫn / Tutorial / Gợi ý"]
  UI --> Art["4. Icon & Ảnh bìa SVG / agy (public/)"]
  Art --> Docs["5. 6 Tài liệu (docs/) + Đăng ký Hub (games.ts)"]
  Docs --> Verify["6. Vitest + Playwright (cổng 4189) + tsc + vite build"]
```

---

## Mục tiêu & Kết quả học tập
Sau Ngày 7, bạn sẽ có thể:
1. Điều phối quy trình tạo game mới hoàn chỉnh từ `/plan` đến bản build sản phẩm bằng `agy`.
2. Áp dụng đầy đủ mọi tiêu chuẩn trong [`AGENTS.md`](../../AGENTS.md): `docs/`, `public/icons/*`, `public/graphics/*`, Hướng dẫn chơi, Tutorial, Gợi ý, Vitest và Playwright.
3. Đăng ký game mới vào [`src/registry/games.ts`](../../src/registry/games.ts) và cấp cổng Playwright riêng (`4189+`).

---

## Hướng dẫn từng bước

### 1. Tạo nhánh tính năng
```bash
git checkout -b day-07-tic-tac-toe
```

### 2. Kiểm tra các ràng buộc `AGENTS.md` trước khi ra lệnh
- **Cổng Playwright riêng:** Các cổng `4175`–`4188` đã được sử dụng; hãy gán **`4189`** cho `games/tic-tac-toe/playwright.config.ts`.
- **Đồ họa gốc:** Ưu tiên `.svg` sắc nét cho quân cờ (`X` / `O`) và nhờ `agy` (`image-generator`) tạo `public/icons/*` và `public/graphics/*`.
- **Giao diện dùng chung:** Import `../../../styles/tokens.css` và `../../../styles/game-ui.css` trong `src/main.tsx`.

### 3. Dùng `/plan` với `agy` để xây dựng `games/tic-tac-toe/`
Dán câu lệnh mẫu bên dưới, xem xét kế hoạch của `agy` và phê duyệt thực thi.

### 4. Xác minh cả bản Độc lập và Hub Hợp nhất
```bash
cd games/tic-tac-toe && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
cd ../.. && npm test && npm run test:e2e && npx tsc --noEmit && npm run build
```

---

## Câu lệnh mẫu cho `agy`

**Câu lệnh Lập kế hoạch & Triển khai:**
```text
/plan Implement a new board game "Tic Tac Toe" in games/tic-tac-toe/ following AGENTS.md completely:
- Modes: vs AI (Easy + Unbeatable Minimax) and 2-Player Local
- Clean pure simulation in src/game/ (win/draw detection, Minimax AI, smart Hint, 3-step Tutorial, localStorage tic_tac_toe_v1)
- Crisp CSS/SVG X & O board using shared styles/tokens.css and styles/game-ui.css
- Web Audio SFX + Mute toggle, How to Play modal, original icons & HD/Full-HD covers in public/, and all 6 docs in docs/ (plus README.zh.md and README.vi.md)
- Vitest unit tests + Playwright E2E tests on dedicated port 4189
- Register in src/registry/games.ts (category: Board) and update root tests
```

---

## Điểm cốt lõi
- Game bàn cờ theo lượt là dự án "từ con số 0" lý tưởng vì luật thắng/thua và Minimax AI rất dễ viết unit test xác định.
- Cấp phát cổng Playwright riêng biệt giúp tránh xung đột khi kiểm thử trong monorepo.

---

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` giải thích cách Minimax AI chấm điểm thế cờ trong Tic Tac Toe hoặc Checkers.
   ```text
   Read games/tic-tac-toe/src/game/engine.ts (or games/checkers/src/game/ai.ts) and explain how Minimax / Alpha-Beta scores winning, losing, and drawing moves.
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` thêm hiệu ứng nét vẽ SVG cho hàng thắng 3 ô và làm nổi bật ô Gợi ý.
   ```text
   In games/tic-tac-toe/, highlight the winning line with an animated SVG stroke and pulse the Hint cell cleanly. Verify with make verify GAME=tic-tac-toe.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm bảng điểm **Loạt đấu Best-of-5** cho Tic Tac Toe.
   ```text
   /plan Add a Best-of-5 Series scoreboard (X wins, O wins, Draws, Match Winner banner) to games/tic-tac-toe/ persisted in tic_tac_toe_v1. Verify with make verify GAME=tic-tac-toe.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` bổ sung unit test chứng minh AI Minimax Bất Bại không bao giờ thua.
   ```text
   In games/tic-tac-toe/src/game/__tests__/engine.test.ts, add a unit test that plays all possible human opening moves against Unbeatable Minimax and asserts AI never loses, keeping coverage >=70%.
   ```
5. **Tạo Game Mới:** Nhờ `agy` xây dựng game bàn cờ chiến thuật tương tự: **Cờ Nối 4 (Connect Four)**.
   ```text
   /plan Create "Connect Four" in games/connect-four/ following AGENTS.md and .agents/skills/create-game/SKILL.md, with 7x6 grid, vs AI + 2P Local, How to Play, Tutorial, Hint, and Vitest >=70% coverage.
   ```
