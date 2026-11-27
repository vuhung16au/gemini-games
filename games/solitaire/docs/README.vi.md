[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Bài Solitaire — Trò Chơi Bài Klondike Cổ Điển

Trò chơi **Klondike Solitaire** gọn gàng, tương thích đa màn hình mô phỏng theo `solitaired.com`, xây dựng với **React 18 + TypeScript + Vite**, bộ **lá bài SVG** sắc nét, token `styles/` dùng chung, **Gợi ý Thông minh**, **Chế độ Hướng dẫn**, **Tự động Hoàn thành** và âm thanh Web Audio API.

## Tính năng
- **Chế độ Lật 1 & Lật 3 Lá:** Chuyển đổi giữa Rút 1 lá và Rút 3 lá (xòe bài thải) với vòng lặp bộ bài đầy đủ.
- **Điều khiển Mượt mà:** Nhấp để di chuyển, nhấp đúp (hoặc nhấp lần 2) để gửi nhanh lên ô Gốc, kéo-thả HTML5 và phím tắt (`D`, `H`, `Z`, `P`).
- **Học chơi Có hướng dẫn:** Hộp thoại **Hướng dẫn chơi**, **Tutorial** tương tác 3 bước và **Gợi ý Thông minh**.
- **Không tài nguyên ngoài:** Chất/mặt sau SVG nội tuyến, âm thanh Web Audio API và lưu `localStorage` an toàn (`solitaire_v1`).

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, máy chủ dev, kiểm thử và lệnh build cục bộ
- [architecture.md](./architecture.md) — Cấu trúc mô-đun, máy trạng thái Klondike, gợi ý và hướng dẫn
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, đồ họa SVG, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, tính điểm Lật 1/3 lá, hướng dẫn và cài đặt
- [developer-guide.md](./developer-guide.md) — Mở rộng/tinh chỉnh luật, chạy Vitest & Playwright và build
