[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Dò Mìn (Minesweeper)

Trò chơi giải đố logic kinh điển với các mức **Dễ (`9×9`, 10 mìn — mặc định)**, **Trung bình (`16×16`, 40 mìn)**, **Khó (`30×16`, 99 mìn)** và kích thước bàn **Tùy chỉnh**.

## Tính năng chính
- **An toàn Lượt mở Đầu:** Mìn chỉ được đặt sau lần mở ô đầu tiên, đảm bảo vùng 3×3 mở màn luôn an toàn.
- **Mở loang & Mở nhanh (Chording):** Nhấp ô `0` mìn sẽ tự động mở loang; nhấp vào ô số đã cắm đủ cờ sẽ mở nhanh toàn bộ các ô lân cận chưa cắm cờ.
- **Gợi ý Suy luận Thông minh & Tutorial:** Bộ giải logic biên (`💡 Hint`), Hướng dẫn 3 bước, nút chuyển Chế độ Cắm cờ cho màn hình cảm ứng và hộp thoại `? Trợ giúp`.

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, kiểm thử và lệnh build cục bộ
- [architecture.md](./architecture.md) — Động cơ thuần, gợi ý giải đố, Web Audio và React UI
- [techstack.md](./techstack.md) — Tech stack chuẩn theo `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, độ khó và lưu trữ
- [developer-guide.md](./developer-guide.md) — Tùy chỉnh preset, kiểm thử và quy trình xác minh
