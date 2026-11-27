[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tetris — Xếp Gạch Arcade Huyền Thoại

Phiên bản **Tetris** chuẩn Guideline lấy cảm hứng từ `freetetris.org`, được build bằng **React 18 + TypeScript + Vite + HTML5 Canvas 2D**. Dùng chung `styles/` token của hub, tích hợp đầy đủ **xoay SRS có wall kick**, **túi gạch 7-bag**, **Hold**, **Ghost piece**, **Hints**, **Tutorial** và **SFX** từ Web Audio API.

## Có gì hay?
- **Cơ chế chuẩn Guideline:** Lưới 10×20, chia gạch công bằng theo túi 7-bag, xem trước 3 khối Next, ô Hold (1 lần mỗi lượt rơi), bóng mờ Ghost chỉ điểm đáp, xoay SRS kèm wall kick và lock delay 450 ms.
- **Học nhanh, leo rank lẹ:** Có sẵn hộp thoại **How to Play**, **Tutorial** tương tác 3 bước và lớp phủ **Hints** gợi ý chỗ đặt gạch tối ưu.
- **100% offline, gọn nhẹ:** Vẽ khối bằng **Canvas 2D** nét căng trên màn hình HiDPI, xem trước bằng SVG nội tuyến, Web Audio **SFX** (có nút **Mute**) và lưu kỷ lục vào `localStorage` (`tetris_v1`).

## Tài liệu chi tiết
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, chạy dev server, test và build local
- [architecture.md](./architecture.md) — Cấu trúc module, fixed-timestep loop, xoay SRS và hệ thống Hints
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, renderer **Canvas 2D**, testing và deploy
- [user-guide.md](./user-guide.md) — Phím điều khiển, cách tính điểm, hướng dẫn và settings
- [developer-guide.md](./developer-guide.md) — Tùy biến Tetris, chạy Vitest & Playwright và quy trình build
