[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 2 — Hiểu Các Khái Niệm Làm Game & Kiểm Thử Tự Động

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 1](../day-01-intro-to-game-dev/README.vi.md) · **Tiếp theo:** [Ngày 3](../day-03-project-architecture/README.vi.md)

---

## Tổng quan & Khái niệm chính
Các game trình duyệt mượt mà và ít lỗi đều tách biệt **luật chơi** (vật lý, tính điểm, thắng/thua) khỏi **phần hiển thị trên màn hình** (đồ họa, nút bấm, âm thanh). Hôm nay bạn sẽ hiểu ý tưởng cốt lõi đằng sau các game trong dự án này và cách kiểm thử tự động giữ cho game luôn ổn định.

```mermaid
flowchart LR
  Input["Thao tác Người chơi (Phím / Chuột / Chạm)"] --> Sim["Luật Chơi & Vật Lý"]
  Sim --> State["Trạng thái Game (Điểm, Mạng, Vị trí)"]
  State --> Render["Hiển thị Màn hình (2D / 3D / UI)"]
  Sim --> Tests["Unit Tests (Kiểm tra Luật cực nhanh)"]
  Render --> E2E["Browser Tests (Nhấn phím & Chuột thật)"]
```

- **Luật chơi vs. Hiển thị:** Khi tách riêng luật chơi khỏi đồ họa, AI agent có thể kiểm tra nhảy, va chạm và tính điểm trong vài mili-giây mà không cần mở trình duyệt.
- **Nhịp khung hình mượt:** Giới hạn bước thời gian giúp game chạy đồng nhất trên mọi màn hình và tự động tạm dừng khi bạn chuyển tab trình duyệt.
- **Hai lớp kiểm thử tự động:** **Unit test** kiểm tra luật và phép tính; **Browser E2E test** mở trình duyệt thật, bấm phím và đảm bảo không có lỗi.

---

## Mục tiêu & Kết quả học tập
Sau Ngày 2, bạn sẽ có thể:
1. Giải thích bằng ngôn ngữ đơn giản vì sao tách luật chơi khỏi phần vẽ màn hình giúp AI làm game đáng tin cậy hơn.
2. Phân biệt **unit test** (kiểm tra luật) và **browser E2E test** (kiểm tra trải nghiệm chơi thật).
3. Chạy cả hai bộ kiểm thử bằng lệnh `make` và hỏi `agy` cách các bài kiểm thử được triển khai.

---

## Hướng dẫn từng bước

### 1. Chạy cả hai bộ kiểm thử trên `Dino Run`
Không cần tự đọc mã kiểm thử—chỉ cần chạy từ thư mục gốc:
```bash
make test GAME=dino-run       # Kiểm thử đơn vị nhanh + kiểm tra độ phủ
make test-e2e GAME=dino-run   # Mở Chromium thật và tự động chơi thử
```

### 2. Hỏi `agy` giải thích `Dino Run` & cách kiểm thử bằng ngôn ngữ dễ hiểu
Thử các câu lệnh mẫu bên dưới để `agy` giải thích rõ ràng mà không dùng thuật ngữ code phức tạp.

---

## Câu lệnh mẫu cho `agy`
```text
Explain the features in the game "Dino Run" in plain English (or Vietnamese), including both game modes, controls, hints, and tutorial mode.
```
```text
How are the tests implemented in this project? Explain in simple terms what unit tests and browser E2E tests check for Dino Run, and what >=70% test coverage means.
```

---

## Điểm cốt lõi
- Tách **luật chơi** khỏi **giao diện hiển thị** giúp vibe coding cùng AI nhanh và ít lỗi.
- `make test GAME=<slug>` kiểm tra luật chơi + độ phủ, còn `make test-e2e GAME=<slug>` kiểm tra trực tiếp trên trình duyệt.

---

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` giải thích cách các bài kiểm thử được triển khai trong dự án.
   ```text
   How are the tests implemented across this project? Explain the difference between make test, make test-e2e, and make test-all for a non-technical learner.
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` làm thông điệp gợi ý trong `Minesweeper` dễ hiểu hơn cho người mới.
   ```text
   Improve Minesweeper's in-game hint messages so they explain in plain, friendly language why a suggested tile is safe or a mine. Verify with make test GAME=minesweeper.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm bộ đếm số nước đi cho `Checkers`.
   ```text
   /plan Add a visible move counter to Checkers that resets on New Game and saves with the game state. Verify everything with make verify GAME=checkers.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` tăng độ phủ kiểm thử cho game `1024`.
   ```text
   Check the test coverage report for the 1024 game and add edge-case unit tests for any untested game rules so coverage is even stronger.
   ```
5. **Tạo Game Mới:** Nhờ `agy` xây dựng game **"Kéo-Búa-Bao (Rock-Paper-Scissors)"** thể thức Best-of-5 kèm đầy đủ kiểm thử.
   ```text
   /plan Create "Rock-Paper-Scissors" following AGENTS.md, with Best-of-5 rounds, win-streak tracking, How to Play, Tutorial, Hint, and automated unit + browser tests.
   ```
