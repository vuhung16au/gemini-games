[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Flappy Bird — Phiên Bản Arcade Web

Trò chơi arcade **Flappy Bird** độc lập tốc độ khung hình, xây dựng bằng **React 18 + TypeScript + Vite + HTML5 Canvas 2D**, bộ token `styles/` dùng chung, chế độ **Hướng dẫn Luyện tập**, **Gợi ý Hành lang Bay** và âm thanh Web Audio API.

## Tính năng
- **Vật lý Bước thời gian Cố định:** Quỹ đạo giống hệt nhau trên màn hình `60Hz`, `120Hz` và `144Hz+` (bước `1/120 giây` kèm giới hạn `0.05 giây` khi chuyển tab).
- **Độ khó Tăng dần & Huy chương:** Khoảng hở ống thu hẹp dần từ `145 px` xuống `120 px`, trao huy chương Đồng (`10+`), Bạc (`20+`), Vàng (`30+`) và Bạch kim (`40+`).
- **Hỗ trợ & Học chơi:** Hộp thoại **Hướng dẫn chơi**, **Chế độ Luyện tập** (ống rộng `190 px`) và lớp phủ **Gợi ý** hành lang mục tiêu.

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, máy chủ dev, kiểm thử và lệnh build cục bộ
- [architecture.md](./architecture.md) — Cấu trúc mô-đun, vòng lặp bước cố định, va chạm và trình vẽ Canvas
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, kết xuất, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Điều khiển, huy chương, hướng dẫn, gợi ý và cài đặt
- [developer-guide.md](./developer-guide.md) — Tinh chỉnh hằng số vật lý, chạy Vitest & Playwright và build
