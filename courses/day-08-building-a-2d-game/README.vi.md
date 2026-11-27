[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 8 — Tự Tay Dựng Game Arcade 2D Đầu Tiên Từ Số 0

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 7](../day-07-building-a-board-game/README.vi.md) · **Tiếp theo:** [Ngày 9](../day-09-building-a-3d-game/README.vi.md)

---

## Bức tranh toàn cảnh
Hôm nay mình sẽ "lên đời" từ game bàn cờ theo lượt sang **game arcade 2D Canvas chạy 60fps theo thời gian thực** từ số 0 (như **Breakout** hoặc **Snake**).

Những món "ăn chơi" 2D mà `agy` sẽ lo trọn gói cho bạn:
- **Mượt 60fps & Biết tự Pause:** Chuyển động trơn tru 60 khung hình/giây và tự động tạm dừng mỗi khi bạn lỡ chuyển sang tab khác.
- **Vật lý Nảy Bóng & Va Chạm:** Bóng nảy khỏi gạch và thanh đỡ tự nhiên tùy góc chạm, đánh mép là bay xiên cực gắt.
- **Chơi ngon cả Máy tính lẫn Mobile:** Điều khiển mượt từ bàn phím (`Mũi tên`/`WASD`/`Space`) đến kéo chuột hay vuốt cảm ứng.

---

## Học xong hôm nay bạn làm được gì?
1. Biết cách mô tả một game arcade 2D thời gian thực (màn chơi, vật phẩm, điều khiển, âm thanh) cho `agy` hiểu ngay ý đồ.
2. Kiểm tra mượt mà cả logic vật lý (`make test GAME=breakout`) lẫn trải nghiệm chơi thật trên trình duyệt (`make test-e2e GAME=breakout`).

---

## Từng bước thực hành

### 1. Tạo một feature branch mới
```bash
git checkout -b day-08-2d-breakout
```

### 2. Dùng `/plan` để `agy` dựng Game Arcade 2D
Dán **prompt** mẫu bên dưới vào, duyệt kế hoạch của `agy` rồi chờ em nó triển khai.

### 3. Chạy verify cả game lẻ lẫn toàn Hub
```bash
make verify GAME=breakout
make verify
```

---

## Prompt mẫu cho `agy`

```text
/plan Build a new 2D arcade game "Breakout" in games/breakout/ following
AGENTS.md completely:
- Smooth paddle & bouncing ball physics, 5 brick layouts, power-ups (Wide
  Paddle & Multi-Ball), lives, and combo scoring
- Crisp 2D Canvas graphics matching the Gemini Games theme, plus retro Web
  Audio SFX & Mute toggle
- Works with Keyboard (Arrows/A-D/Space) and mouse/touch drag, and auto-pauses
  when switching tabs
- How to Play modal, 3-step Tutorial, live Hint tip, original icons & covers,
  multilingual READMEs, and >=70% test coverage
```

---

## Chốt lại cho nhớ
- Bạn chỉ việc mô tả *cảm giác chơi* (combo, power-up, vuốt chạm/bàn phím), còn chuyện áp dụng các mẫu **Canvas 2D** chuẩn chỉnh của repo cứ để `agy` tự lo.
- Một lệnh `make verify GAME=<slug>` sẽ đảm bảo từ vật lý, UI, **lint/typecheck**, docs đến **E2E test** đều qua ải gọn gàng.

---

## Bài tập thực hành (Vibe Coding thuần bằng Prompt)

Cứ copy các prompt bên dưới giao cho Google `agy` xử lý—không cần gõ dòng code nào:

1. **Hiểu sâu kỹ thuật:** Nhờ `agy` giải thích cách các game 2D như `Battle City 1985` hay `Breakout` giữ được 60fps và bắt phím/touch mà không làm cuộn trang web.
   ```text
   Explain in plain English how 2D Canvas games in this project keep movement
   smooth at 60fps and handle keyboard + touch controls without scrolling the
   page.
   ```
2. **Tinh chỉnh cảm giác chơi:** Nhờ `agy` gọt lại góc nảy ở mép thanh đỡ cho bén hơn và tăng cao độ âm thanh mỗi khi lên combo.
   ```text
   In Breakout, refine paddle edge-hit bounce angles so corner shots feel
   snappier, and raise the Web Audio chime pitch as the player's brick-break
   combo grows. Verify with make verify GAME=breakout.
   ```
3. **Thêm thử thách mới:** Nhờ `agy` tạo thêm **Boss Brick** (gạch trùm) 3 máu, nứt dần sau mỗi cú va chạm.
   ```text
   /plan Add a "Boss Brick" (takes 3 hits, shows visual cracks after each hit,
   awards bonus points) to Breakout with automated unit tests. Verify with make
   verify GAME=breakout.
   ```
4. **Test cảm ứng & cập nhật docs:** Nhờ `agy` viết thêm **Playwright E2E test** kiểm tra thao tác kéo trên màn hình điện thoại và ghi chú vào hướng dẫn chơi.
   ```text
   Add a Playwright browser test confirming Breakout's paddle responds to
   touch/pointer dragging on mobile viewports, and document mobile controls in
   Breakout's user guide.
   ```
5. **Tạo game mới (Thử thách `/teamwork` Đa tác tử):** Nhờ `agy` (dùng model `orchestrator` trên Google AI Pro) gọi nhiều agent chạy song song để **đẻ 2 game 2D cùng một lúc**: **Classic Snake** và **Neon Pong**.
   ```text
   /teamwork Create two 2D Canvas arcade games at the same time in parallel:
   "Classic Snake" and "Neon Pong", each following AGENTS.md (with How to Play,
   Tutorial, Hint, icons/covers, and automated unit + browser tests) and
   passing make verify.
   ```
