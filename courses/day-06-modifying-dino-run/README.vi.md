[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 6 — Chỉnh Sửa Game Đầu Tiên (`Dino Run`)

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 5](../day-05-tech-stack-deep-dive/README.vi.md) · **Tiếp theo:** [Ngày 7](../day-07-building-a-board-game/README.vi.md)

---

## Tổng quan & Khái niệm chính
Trước khi làm game từ đầu, cách nhanh nhất để nắm vững vibe coding là **tùy biến một game đang chạy tốt** bằng câu lệnh đời thường. Hôm nay bạn sẽ tùy biến **Dino Run**: đổi màu nền bầu trời, chỉnh tốc độ chạy và thêm một chướng ngại vật mới—tất cả được kiểm tra tự động bằng `make`!

---

## Mục tiêu & Kết quả học tập
Sau Ngày 6, bạn sẽ có thể:
1. Tạo nhánh Git thực hành an toàn trước khi chỉnh sửa game.
2. Nhờ Google `agy` đổi màu sắc, tốc độ và thêm chướng ngại vật bằng ngôn ngữ tự nhiên—không cần tự sửa code.
3. Xác minh mọi thay đổi với `make dev GAME=dino-run` và `make verify GAME=dino-run`.

---

## Hướng dẫn từng bước

### 1. Tạo nhánh Git thực hành
```bash
git checkout -b day-06-dino-mod
```

### 2. Xem trước `Dino Run` trực tiếp
```bash
make dev GAME=dino-run
```

### 3. Nhờ `agy` tùy biến Màu sắc, Tốc độ & Chướng ngại vật
Dùng từng câu lệnh mẫu bên dưới, xem thay đổi trực tiếp trên trình duyệt và chạy kiểm tra tự động:
```bash
make verify GAME=dino-run
```

---

## Câu lệnh mẫu cho `agy`

**Câu lệnh 1 — Đổi màu nền:**
```text
Change Dino Run's Classic Desert daytime sky to a warm sunset peach (#fce7d6) while keeping strong contrast for the dinosaur and score text. Verify that tests and build pass.
```

**Câu lệnh 2 — Tăng nhịp độ trò chơi:**
```text
Make Dino Run start slightly faster and speed up a bit quicker so the action feels snappier, then run Dino Run's unit tests to confirm everything passes.
```

**Câu lệnh 3 — Thêm chướng ngại vật mới:**
```text
/plan Add a new rolling "desert boulder" obstacle to Classic mode in Dino Run that rolls slightly faster than cacti, and add automated unit tests for boulder collisions.
```

---

## Điểm cốt lõi
- Câu lệnh ngắn gọn, tự nhiên + kiểm tra ngay bằng `make verify GAME=dino-run` giúp vibe coding nhanh và an toàn.
- Bạn không cần biết tốc độ hay màu sắc nằm ở tệp code nào—chỉ cần mô tả điều bạn muốn!

---

## Bài tập & Thử thách (Vibe Coding Chỉ Dùng Câu Lệnh)

Sử dụng các câu lệnh mẫu bên dưới với Google `agy`—không cần tự viết code thủ công:

1. **Hiểu Dự án Sâu hơn:** Nhờ `agy` giải thích các tính năng và độ khó tăng dần của `Dino Run`.
   ```text
   Explain the features in the game "Dino Run", including how the game gets harder over time, how Day/Night cycles work, and what the Tutorial and Hint markers do.
   ```
2. **Cải tiến Tính năng:** Nhờ `agy` làm hiệu ứng chuyển Ngày/Đêm mượt mà thay vì đổi đột ngột.
   ```text
   Improve Dino Run's Classic mode so the sky smoothly blends between Day and Night every 700 points instead of switching abruptly. Verify with make verify GAME=dino-run.
   ```
3. **Triển khai Tính năng Mới:** Nhờ `agy` thêm cơ chế **Nhảy Đúp (Double-Jump)** trên nhánh thực hành.
   ```text
   /plan Add an optional Double-Jump mechanic to Dino Run Classic mode with a small jump-charge indicator on the screen. Verify with make verify GAME=dino-run.
   ```
4. **Cải thiện Kiểm thử / Tài liệu:** Nhờ `agy` thêm kiểm thử trình duyệt cho tính năng mới và cập nhật hướng dẫn người chơi.
   ```text
   Add a Playwright browser test confirming the new Double-Jump feature works in Dino Run, and document it in Dino Run's user guide.
   ```
5. **Tạo Game Mới:** Nhờ `agy` xây dựng một game chạy vô tận tương tự mang tên **"Space Astro Runner"**.
   ```text
   /plan Create a similar endless runner "Space Astro Runner" following AGENTS.md, where an astronaut dodges asteroids and laser drones with gravity-flip controls, How to Play, Tutorial, Hint, and automated tests.
   ```
