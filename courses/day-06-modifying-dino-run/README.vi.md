[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Ngày 6 — "Độ" Lại Game Đầu Tiên (`Dino Run`)

**Thời lượng ước tính:** 1 Giờ · **Trước:** [Ngày 5](../day-05-tech-stack-deep-dive/README.vi.md) · **Tiếp theo:** [Ngày 7](../day-07-building-a-board-game/README.vi.md)

---

## Bức tranh toàn cảnh
Trước khi tự dựng game từ số 0, cách nhanh nhất để "lên tay" vibe coding là **độ lại một game đang chạy ngon lành** bằng câu lệnh đời thường. Hôm nay bạn sẽ cầm lái **Dino Run**: đổi màu bầu trời, tinh chỉnh tốc độ chạy và thả thêm chướng ngại vật mới—làm xong tới đâu có `make` kiểm tra tự động tới đó cho chắc kèo!

---

## Học xong hôm nay bạn làm được gì?
1. Biết tạo một **Git branch** riêng để vọc vạch an toàn, không sợ làm hỏng bản gốc.
2. Sai Google `agy` đổi màu sắc, tốc độ và thêm chướng ngại vật bằng ngôn ngữ tự nhiên—không đụng tay vào code.
3. Chạy `make dev GAME=dino-run` để ngắm thành quả trực tiếp và chốt hạ bằng `make verify GAME=dino-run`.

---

## Từng bước thực hành

### 1. Tạo một branch mới để vọc cho an toàn
```bash
git checkout -b day-06-dino-mod
```

### 2. Mở `Dino Run` lên xem trước
```bash
make dev GAME=dino-run
```

### 3. Nhờ `agy` "độ" Màu sắc, Tốc độ & Chướng ngại vật
Thử lần lượt từng **prompt** bên dưới, ngó trình duyệt xem game đổi ra sao rồi chạy lệnh verify:
```bash
make verify GAME=dino-run
```

---

## Bộ prompt mẫu cho `agy`

**Prompt 1 — Đổi màu bầu trời:**
```text
Change Dino Run's Classic Desert daytime sky to a warm sunset peach (#fce7d6)
while keeping strong contrast for the dinosaur and score text. Verify that
tests and build pass.
```

**Prompt 2 — Tăng tốc cho đã tay:**
```text
Make Dino Run start slightly faster and speed up a bit quicker so the action
feels snappier, then run Dino Run's unit tests to confirm everything passes.
```

**Prompt 3 — Thêm chướng ngại vật mới:**
```text
/plan Add a new rolling "desert boulder" obstacle to Classic mode in Dino Run
that rolls slightly faster than cacti, and add automated unit tests for
boulder collisions.
```

---

## Chốt lại cho nhớ
- **Prompt** gọn gàng, nói rõ ý + chạy ngay `make verify GAME=dino-run` là công thức vibe coding vừa nhanh vừa an toàn.
- Bạn chẳng cần biết biến tốc độ hay mã màu nằm ở file nào—chỉ cần mô tả đúng trải nghiệm bạn muốn!

---

## Bài tập thực hành (Vibe Coding thuần bằng Prompt)

Cứ copy các prompt bên dưới giao cho Google `agy` xử lý—không cần gõ dòng code nào:

1. **Hiểu sâu game hơn:** Nhờ `agy` giải thích cơ chế của `Dino Run` (từ cách tăng độ khó đến chu kỳ Ngày/Đêm).
   ```text
   Explain the features in the game "Dino Run", including how the game gets
   harder over time, how Day/Night cycles work, and what the Tutorial and Hint
   markers do.
   ```
2. **Nâng cấp hiệu ứng:** Nhờ `agy` làm cảnh chuyển Ngày/Đêm mượt mà thay vì chớp cái bụp.
   ```text
   Improve Dino Run's Classic mode so the sky smoothly blends between Day and
   Night every 700 points instead of switching abruptly. Verify with make verify
   GAME=dino-run.
   ```
3. **Thêm cơ chế mới:** Nhờ `agy` gắn thêm tính năng **Nhảy Đúp (Double-Jump)** trên branch thực hành.
   ```text
   /plan Add an optional Double-Jump mechanic to Dino Run Classic mode with a
   small jump-charge indicator on the screen. Verify with make verify
   GAME=dino-run.
   ```
4. **Bổ sung E2E test & docs:** Nhờ `agy` viết **Playwright test** cho pha nhảy đúp vừa làm và cập nhật luôn hướng dẫn chơi.
   ```text
   Add a Playwright browser test confirming the new Double-Jump feature works in
   Dino Run, and document it in Dino Run's user guide.
   ```
5. **Tạo game mới toanh:** Nhờ `agy` dựng một game chạy vô tận phiên bản vũ trụ mang tên **"Space Astro Runner"**.
   ```text
   /plan Create a similar endless runner "Space Astro Runner" following
   AGENTS.md, where an astronaut dodges asteroids and laser drones with
   gravity-flip controls, How to Play, Tutorial, Hint, and automated tests.
   ```
