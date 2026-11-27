[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Dò Mìn (Minesweeper) — Kinh Điển Văn Phòng

Tựa game giải đố logic quốc dân với đủ mức **Dễ (`9×9`, 10 mìn — mặc định)**, **Trung bình (`16×16`, 40 mìn)**, **Khó (`30×16`, 99 mìn)** và bàn chơi **Tùy chỉnh** theo ý thích.

## Tính năng chính
- **Mở bát luôn an toàn:** Mìn chỉ được rải sau cú click đầu tiên, đảm bảo vùng 3×3 xung quanh ô mở màn không bao giờ nổ.
- **Mở loang & Chording cực nhanh:** Click vào ô `0` mìn sẽ tự động mở loang; click vào ô số đã cắm đủ cờ sẽ bung hết các ô lân cận chưa cắm cờ.
- **Hints suy luận thông minh & Tutorial:** Bộ giải logic biên (`💡 Hint`) soi nước đi chắc ăn, **Tutorial** 3 bước, nút chuyển chế độ Cắm cờ tiện cho màn hình cảm ứng và bảng `? Trợ giúp`.

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, test và lệnh build ở local
- [architecture.md](./architecture.md) — Logic game thuần, bộ giải **Hints**, **Web Audio** và React UI
- [techstack.md](./techstack.md) — Tech stack chuẩn theo `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, độ khó và lưu `localStorage`
- [developer-guide.md](./developer-guide.md) — Tùy chỉnh preset, chạy test và quy trình kiểm tra
