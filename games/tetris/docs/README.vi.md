[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Xếp Hình (Tetris) — Game Arcade Cổ Điển

Trò chơi **Tetris** chuẩn Guideline mô phỏng theo `freetetris.org`, xây dựng với **React 18 + TypeScript + Vite + HTML5 Canvas 2D**, bộ token `styles/` dùng chung, **xoay SRS kèm đá tường**, **bộ chia 7-bag**, **Giữ gạch (Hold)**, **Bóng mờ (Ghost)**, **Gợi ý Thông minh**, **Chế độ Hướng dẫn** và âm thanh Web Audio API.

## Tính năng
- **Cơ chế Chuẩn Guideline:** Bàn 10×20, bộ sinh ngẫu nhiên 7-bag, hàng chờ 3 khối Next, ô Hold (1 lần mỗi lượt rơi), bóng mờ vị trí đáp, xoay SRS kèm đá tường và độ trễ khóa 450 ms.
- **Công cụ Học & Hỗ trợ:** Hộp thoại **Hướng dẫn chơi**, **Tutorial** tương tác 3 bước và lớp phủ **Gợi ý Đặt khối Thông minh**.
- **Không tài nguyên ngoài:** Khối Canvas 2D HiDPI, xem trước SVG nội tuyến, âm thanh Web Audio API và lưu `localStorage` an toàn (`tetris_v1`).

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, máy chủ dev, kiểm thử và lệnh build cục bộ
- [architecture.md](./architecture.md) — Cấu trúc mô-đun, vòng lặp bước cố định, đá tường SRS và gợi ý
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, kết xuất, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Điều khiển, tính điểm, hướng dẫn và cài đặt
- [developer-guide.md](./developer-guide.md) — Mở rộng/tinh chỉnh Tetris, chạy Vitest & Playwright và build
