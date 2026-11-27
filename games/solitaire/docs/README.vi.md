[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Solitaire — Xếp Bài Klondike Huyền Thoại

Phiên bản **Klondike Solitaire** gọn nhẹ, mượt mà lấy cảm hứng từ `solitaired.com`, code bằng **React 18 + TypeScript + Vite**. Giao diện dùng bộ lá bài SVG nét căng, share chung `styles/` token của hub, có sẵn **Hints** thông minh, **Tutorial** cho người mới, **Auto-Complete** gom bài tự động và **SFX** từ Web Audio API.

## Có gì hay?
- **Rút 1 lá hoặc 3 lá:** Đổi qua lại thoải mái giữa chế độ Draw 1 và Draw 3 (xòe bài đẹp mắt) và xoay vòng bộ bài không giới hạn.
- **Điều khiển sướng tay:** Click để đi bài, double-click (hoặc click lần 2) để phi thẳng lên ô Foundation, hỗ trợ kéo-thả HTML5 lẫn phím tắt (`D`, `H`, `Z`, `P`).
- **Tập chơi siêu nhanh:** Có hộp thoại **How to Play**, **Tutorial** 3 bước cầm tay chỉ việc và **Hints** gợi ý nước đi thông minh.
- **100% offline, không rác ngoài:** Lá bài SVG vẽ sẵn nội tuyến, **SFX** tự tổng hợp bằng Web Audio (có nút **Mute**) và lưu tiến độ an toàn vào `localStorage` (`solitaire_v1`).

## Tài liệu chi tiết
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, bật dev server, chạy test và build local
- [architecture.md](./architecture.md) — Kiến trúc module, state machine của Klondike, hệ thống Hints và Tutorial
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, đồ họa SVG, testing và deploy
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, cách tính điểm Draw 1/3, hướng dẫn và settings
- [developer-guide.md](./developer-guide.md) — Cách mở rộng/tinh chỉnh luật, chạy Vitest & Playwright và build
