[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Cờ Đam (Checkers) — Trò Chơi Bàn Cờ Cổ Điển

Trò chơi **Cờ đam Mỹ 8×8** tương thích đa thiết bị mô phỏng theo `247checkers.com`, xây dựng với **React 18 + TypeScript + Vite**, bộ token `styles/` dùng chung, đối thủ AI alpha-beta và âm thanh Web Audio API.

## Tính năng
- **Chế độ chơi:** **Đấu với AI** (Dễ, Trung bình, Khó) hoặc **2 Người chơi** tại chỗ trên cùng bàn cờ.
- **Luật Cờ đam Mỹ Chuẩn:** Bắt buộc ăn quân, ăn liên hoàn nhiều bước, phong Vua (Vua đi chéo tiến và lùi) và nhận diện thắng khi ăn hết hoặc đối thủ hết nước đi.
- **Điều khiển Hỗ trợ:** Hiển thị nước đi & nước ăn hợp lệ, **Gợi ý** nước đi, **Hoàn tác**, **Ván mới** và nút **Tắt tiếng**.
- **Không tài nguyên ngoài:** Âm thanh Web Audio API tạo bằng mã và lưu `localStorage` an toàn (`checkers_v1`).

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, máy chủ dev, kiểm thử và build cục bộ
- [architecture.md](./architecture.md) — Cấu trúc mô-đun, bộ luật, tìm kiếm minimax AI và luồng dữ liệu
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, ăn liên hoàn, phong Vua và cài đặt
- [developer-guide.md](./developer-guide.md) — Mở rộng/tinh chỉnh AI & luật, chạy Vitest & Playwright và build
