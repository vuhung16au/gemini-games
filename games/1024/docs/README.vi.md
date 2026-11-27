[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# 1024 — Game Trượt Số Gây Nghiện

**1024** lấy cảm hứng từ `1024game.org`, chạy mượt trên mọi màn hình nhờ **React 18 + TypeScript + Vite** và bộ token `styles/` dùng chung. Tích hợp sẵn **Hints** thông minh, **Tutorial**, **Undo** và **SFX** từ **Web Audio** (chẳng cần tải file âm thanh ngoài).

## Tính năng
- **Chuẩn bài 1024 cổ điển:** Khởi đầu từ ô `1` (90%) và `2` (10%), gộp theo lũy thừa của 2 để chạm mốc `1024` (thích thì bấm **Chơi tiếp** leo luôn `2048+`).
- **Hiệu ứng đã mắt:** Gộp ô có bóng mờ trượt mượt, ô mới bật lên nảy nhẹ và điểm `+score` bay lên trông cực kỳ "đã".
- **Trợ giúp tận răng:** **Undo** tối đa 10 bước khi lỡ tay, **Hints** soi hướng đi ngon nhất, bảng **How to Play** và **Tutorial** 3 bước cho người mới.

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, chạy dev server, test và lệnh build
- [architecture.md](./architecture.md) — Cấu trúc module, luật ghép ô, logic **Hints** và **Tutorial**
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, kiểm thử và triển khai
- [user-guide.md](./user-guide.md) — Luật chơi, phím điều khiển, **Undo**, **Tutorial** và cài đặt
- [developer-guide.md](./developer-guide.md) — Cách mở rộng/tinh chỉnh **1024**, chạy Vitest & Playwright và build
