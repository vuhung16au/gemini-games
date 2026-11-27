[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# 1024 — Trò Chơi Trượt Số

Trò chơi giải đố **1024** tương thích đa màn hình mô phỏng theo `1024game.org`, được xây dựng bằng **React 18 + TypeScript + Vite**, bộ token giao diện `styles/` dùng chung, tích hợp **Gợi ý Thông minh**, **Chế độ Hướng dẫn**, **Hoàn tác** và hiệu ứng âm thanh Web Audio API.

## Tính năng
- **Tiến trình 1024 Cổ điển:** Bắt đầu từ các ô `1` (90%) và `2` (10%), ghép theo lũy thừa của 2 để đạt tới `1024` (có thể chọn **Chơi tiếp** để vượt mốc `2048+`).
- **Hiệu ứng Mượt mà:** Chuyển động ghép ô bóng mờ, hiệu ứng xuất hiện ô mới và điểm `+score` bay lên.
- **Hỗ trợ & Học chơi:** **Hoàn tác** (tối đa 10 bước), bộ đánh giá hướng **Gợi ý Thông minh**, hộp thoại **Hướng dẫn chơi** và **Chế độ Hướng dẫn** 3 bước.

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt cục bộ, máy chủ dev, kiểm thử và lệnh build
- [architecture.md](./architecture.md) — Cấu trúc mô-đun, luật ghép ô, gợi ý và hướng dẫn
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, hoàn tác, hướng dẫn và cài đặt
- [developer-guide.md](./developer-guide.md) — Mở rộng/tinh chỉnh 1024, chạy Vitest & Playwright và build
