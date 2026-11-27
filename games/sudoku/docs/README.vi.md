[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Sudoku — Trò Chơi Giải Đố Số Cổ Điển

Trò chơi **Sudoku 9×9** gọn gàng, tương thích đa thiết bị mô phỏng theo `sudoku.com`, xây dựng với **React 18 + TypeScript + Vite**, bộ token `styles/` dùng chung và hiệu ứng âm thanh Web Audio API.

## Tính năng
- **Đề bài Có Nghiệm Duy Nhất:** Mỗi bảng được sinh bằng thuật toán quay lui và kiểm chứng nghiệm duy nhất qua 4 mức **Dễ**, **Trung bình**, **Khó** và **Chuyên gia**.
- **Đầy đủ Công cụ Hỗ trợ:** **Ghi chú** bút chì (tự động xóa ghi chú trùng hàng/cột/khối), **Hoàn tác** (tối đa 50 bước), **Tẩy**, **Gợi ý**, bộ đếm giờ **Tạm dừng/Tiếp tục** và giới hạn **3 lần sai**.
- **Tô sáng Thông minh:** Làm nổi bật hàng, cột, khối 3×3 đang chọn và các chữ số trùng khớp trên toàn bảng.
- **Không tài nguyên ngoài:** Hoạt động ngoại tuyến 100% với âm thanh Web Audio API và lưu `localStorage` (`sudoku_v1`).

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, máy chủ dev, kiểm thử và lệnh build cục bộ
- [architecture.md](./architecture.md) — Cấu trúc mô-đun, máy trạng thái, bộ sinh/giải đề và luồng dữ liệu
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển bàn phím/cảm ứng, ghi chú, gợi ý và cài đặt
- [developer-guide.md](./developer-guide.md) — Mở rộng/tinh chỉnh Sudoku, chạy Vitest & Playwright và build
