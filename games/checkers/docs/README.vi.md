[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Cờ Đam (Checkers) — Đấu Trí Bàn Cờ 8×8

Game **Cờ Đam Mỹ 8×8** lấy cảm hứng từ `247checkers.com`, chơi ngon lành trên cả desktop lẫn mobile. Build bằng **React 18 + TypeScript + Vite**, dùng chung token `styles/`, có **AI** alpha-beta khá gắt và **SFX** tạo bằng **Web Audio**.

## Tính năng
- **Đủ chế độ chơi:** Đấu với **AI** (Dễ, Trung bình, Khó) hoặc **2 Players** cùng bàn cho hai người ngồi cạnh nhau.
- **Đúng luật Cờ Đam Mỹ:** Bắt buộc ăn quân khi có cơ hội, ăn liên hoàn nhiều bước, phong Vua (Vua đi chéo tiến lùi thoải mái) và tự động nhận diện thắng khi hết quân hoặc đối thủ bí nước.
- **Hỗ trợ tiện lợi:** Hiện các nước đi & nước ăn hợp lệ, **Hints** soi nước đi, **Undo**, **Ván mới** và nút **Mute** tắt tiếng nhanh.
- **100% offline, không tài nguyên ngoài:** **SFX** sinh trực tiếp bằng **Web Audio**, lưu trạng thái an toàn vào `localStorage` (`checkers_v1`).

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, dev server, test và build ở local
- [architecture.md](./architecture.md) — Cấu trúc module, bộ luật, thuật toán minimax **AI** và luồng dữ liệu
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, ăn liên hoàn, phong Vua và cài đặt
- [developer-guide.md](./developer-guide.md) — Cách mở rộng/tinh chỉnh **AI** & luật chơi, chạy Vitest & Playwright và build
