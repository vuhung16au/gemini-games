[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 8 — Xây Dựng Game Arcade 2D Đầu Tiên Từ Đầu

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 7](../day-07-building-a-board-game/README.vi.md) · **Tiếp theo:** [Ngày 9](../day-09-building-a-3d-game/README.vi.md)

---

## Tổng quan & Khái niệm chính
Hôm nay bạn sẽ bước từ bàn cờ theo lượt lên **game arcade 2D Canvas thời gian thực 60fps** từ con số 0 (như **Breakout** hoặc **Snake**).

Những trải nghiệm 2D bạn sẽ nhờ `agy` lo trọn gói:
- **Chuyển động Mượt & Tự Tạm Dừng:** Game chạy mượt 60 khung hình/giây và tự tạm dừng khi bạn chuyển tab trình duyệt.
- **Nảy Bóng & Va Chạm:** Bóng nảy thực tế khỏi gạch và thanh đỡ tùy theo vị trí chạm.
- **Điều khiển Máy tính + Cảm ứng:** Chơi mượt cả bằng bàn phím (`Mũi tên`/`WASD`/`Space`) lẫn kéo chuột/cảm ứng.

---

## Mục tiêu & Kết quả học tập
Sau Ngày 8, bạn sẽ có thể:
1. Mô tả một game arcade 2D thời gian thực (màn chơi, vật phẩm, điều khiển, âm thanh) bằng ngôn ngữ tự nhiên cho `agy`.
2. Xác minh cả luật vật lý (`make test GAME=breakout`) lẫn chơi thử trên trình duyệt thật (`make test-e2e GAME=breakout`).

---

## Hướng dẫn từng bước

### 1. Tạo nhánh tính năng
```bash
git checkout -b day-08-2d-breakout
```

### 2. Dùng `/plan` với `agy` để xây dựng Game Arcade 2D
Dán câu lệnh mẫu bên dưới, xem xét kế hoạch của `agy` rồi phê duyệt thực thi.

### 3. Xác minh Độc lập & Hub Hợp nhất
```bash
make verify GAME=breakout
make verify
```

---

## Câu lệnh mẫu cho `agy`

```text
/plan Build a new 2D arcade game "Breakout" in games/breakout/ following AGENTS.md completely:
- Smooth paddle & bouncing ball physics, 5 brick layouts, power-ups (Wide Paddle & Multi-Ball), lives, and combo scoring
- Crisp 2D Canvas graphics matching the Gemini Games theme, plus retro Web Audio SFX & Mute toggle
- Works with Keyboard (Arrows/A-D/Space) and mouse/touch drag, and auto-pauses when switching tabs
- How to Play modal, 3-step Tutorial, live Hint tip, original icons & covers, multilingual READMEs, and >=70% test coverage
```

---

## Điểm cốt lõi
- Bạn chỉ cần mô tả *cảm giác chơi arcade* (combo, vật phẩm, cảm ứng/bàn phím), `agy` sẽ tự áp dụng các mẫu Canvas 2D chuẩn của repo.
- `make verify GAME=<slug>` đảm bảo vật lý, giao diện, tài liệu và kiểm thử trình duyệt đều đạt.

---

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` giải thích cách các game 2D như `Battle City` hay `Breakout` giữ chuyển động mượt 60fps.
   ```text
   Explain in plain English how 2D Canvas games in this project keep movement smooth at 60fps and handle keyboard + touch controls without scrolling the page.
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` tinh chỉnh góc nảy mép thanh đỡ và tăng cao độ âm thanh combo.
   ```text
   In Breakout, refine paddle edge-hit bounce angles so corner shots feel snappier, and raise the Web Audio chime pitch as the player's brick-break combo grows. Verify with make verify GAME=breakout.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm **Gạch Trùm (Boss Brick)** 3 máu nứt dần sau mỗi lần chạm.
   ```text
   /plan Add a "Boss Brick" (takes 3 hits, shows visual cracks after each hit, awards bonus points) to Breakout with automated unit tests. Verify with make verify GAME=breakout.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` thêm kiểm thử kéo cảm ứng trên di động và cập nhật hướng dẫn người chơi.
   ```text
   Add a Playwright browser test confirming Breakout's paddle responds to touch/pointer dragging on mobile viewports, and document mobile controls in Breakout's user guide.
   ```
5. **Tạo Game Mới:** Nhờ `agy` xây dựng một game arcade 2D kinh điển tương tự: **Rắn Săn Mồi (Classic Snake)**.
   ```text
   /plan Create "Classic Snake" following AGENTS.md, with wall-wrap toggle, speed levels, food combos, How to Play, Tutorial, Hint, and automated unit + browser tests.
   ```
