[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Sudoku — Giải Đố Số 9×9 Kinh Điển

Bản **Sudoku 9×9** gọn gàng, chạy mượt trên mọi màn hình theo phong cách `sudoku.com`, được build với **React 18 + TypeScript + Vite**. Dùng chung `styles/` token của hub và có sẵn **SFX** nhẹ nhàng từ Web Audio API để giải đố cho đỡ buồn ngủ.

## Có gì hay?
- **Đề chuẩn 1 nghiệm duy nhất:** Bảng số nào cũng được sinh bằng thuật toán backtracking và check kỹ để đảm bảo chỉ có đúng 1 đáp án qua 4 độ khó: **Dễ**, **Trung bình**, **Khó** và **Chuyên gia**.
- **Đủ đồ nghề cho dân chơi hệ số:** **Notes** ghi chú bút chì (tự động xóa note trùng khi điền số), **Undo** tối đa 50 bước, **Tẩy**, **Hints**, đồng hồ bấm giờ có **Pause/Resume** và giới hạn **3 mạng sai**.
- **Highlight thông minh:** Tự động tô sáng hàng, cột, ô 3×3 đang chọn và toàn bộ các số giống nhau trên bảng để soi cho lẹ.
- **100% offline, không phụ thuộc ngoài:** Chơi mọi lúc mọi nơi với Web Audio **SFX** (có nút **Mute**) và tự lưu ván đang chơi vào `localStorage` (`sudoku_v1`).

## Tài liệu chi tiết
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, chạy dev server, test và build local
- [architecture.md](./architecture.md) — Cấu trúc module, state machine, bộ sinh/giải đề và luồng dữ liệu
- [techstack.md](./techstack.md) — Ngôn ngữ, framework, bộ công cụ test và deploy
- [user-guide.md](./user-guide.md) — Luật chơi, thao tác phím/cảm ứng, Notes, Hints và settings
- [developer-guide.md](./developer-guide.md) — Tùy biến Sudoku, chạy Vitest & Playwright và quy trình build
