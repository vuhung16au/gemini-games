[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Flappy Bird — Huyền Thoại Đập Cánh

Bản **Flappy Bird** trên web với vật lý chuẩn chỉnh không phụ thuộc FPS màn hình, build bằng **React 18 + TypeScript + Vite + Canvas 2D**, dùng bộ token `styles/`, có thêm chế độ **Practice**, **Hints** vẽ hành lang bay và **SFX** từ **Web Audio**.

## Tính năng
- **Vật lý fixed-timestep:** Quỹ đạo bay y hệt nhau dù bạn dùng màn `60Hz`, `120Hz` hay `144Hz+` (bước mô phỏng `1/120 giây`, tự giới hạn `0.05 giây` khi chuyển tab để khỏi rơi tự do).
- **Càng bay càng khó & săn huy chương:** Khe ống thu hẹp dần từ `145 px` xuống `120 px`; qua mốc là có huy chương Đồng (`10+`), Bạc (`20+`), Vàng (`30+`) và Bạch kim (`40+`).
- **Đỡ ức chế cho người mới:** Bảng **How to Play**, chế độ **Practice** (khe ống rộng tới `190 px`) và **Hints** hiển thị vùng hành lang bay an toàn.

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, dev server, test và lệnh build ở local
- [architecture.md](./architecture.md) — Cấu trúc module, vòng lặp fixed-timestep, va chạm và trình vẽ **Canvas 2D**
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, render, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Điều khiển, huy chương, **Tutorial**, **Hints** và cài đặt
- [developer-guide.md](./developer-guide.md) — Tinh chỉnh hằng số vật lý, chạy Vitest & Playwright và build
