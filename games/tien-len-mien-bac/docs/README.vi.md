[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tiến Lên Miền Bắc — Game Bài Miền Bắc Chuẩn Luật

**Tiến Lên Miền Bắc** là trò chơi đánh bài 52 lá truyền thống của Việt Nam tuân thủ chặt chẽ luật đồng chất và đồng màu miền Bắc, xây dựng bằng TypeScript, React 18 và Vite.

## Tính năng chính

- **Luật Miền Bắc Chuẩn Xác:**
  - Bài lẻ chỉ chặt được bài lẻ **cùng chất** (trừ quân `2` chặt mọi lá khác `2`; `2` chất lớn hơn chặt `2` chất nhỏ hơn).
  - Đôi (`Đôi`) phải **đồng màu** (`♠♣` đen hoặc `♦♥` đỏ) và chỉ chặt đôi cùng màu.
  - Sám cô (`Sám cô`) chỉ chặt sám cô khớp **đúng 3 chất**.
  - Sảnh (`Sảnh`, độ dài `>= 3`, không gồm `2`) phải **đồng chất** và chỉ chặt sảnh cùng độ dài, cùng chất.
  - **Tứ quý** chặt được bất kỳ `2` lẻ nào (**Chặt Heo**) hoặc Tứ quý nhỏ hơn (**Chặt chồng**).
  - Ván đầu đánh từ `3♠` nếu có, và luật **Thối 2** cảnh báo, không cho về nhất bằng quân `2` cuối cùng.
- **2P / 3P / 4P × 2 Chế độ:** Chơi `vs AI` (1 người + 1–3 AI thông minh) hoặc `Pass & Play` (chuyền tay tại chỗ có Màn che Riêng tư).
- **Giao diện & Hướng dẫn Song ngữ:** Đầy đủ nhãn Tiếng Việt + Tiếng Anh, hộp thoại `? Trợ giúp`, `Tutorial` 3 bước, `💡 Hint` (`getNorthernHint`) và âm thanh Web Audio kèm nút Tắt tiếng.

## Tóm tắt Điều khiển

- **Nhấp / Chạm Lá bài:** Chọn hoặc bỏ chọn lá bài trên tay.
- **Nút bấm:** `Đánh / Play`, `Bỏ lượt / Pass`, `Bỏ chọn / Clear`, `Xếp bài / Sort`, `💡 Hint`, `Tutorial`, `?`.
- **Bàn phím:** `Enter` (Đánh), `P` (Bỏ lượt), `H` (Gợi ý), `S` (Xếp bài), `Esc` (Bỏ chọn / Đóng hộp thoại).

## Danh mục tài liệu

- [QUICKSTART.md](./QUICKSTART.md) — Lệnh cài đặt, máy chủ dev, kiểm thử và build sản xuất
- [architecture.md](./architecture.md) — Động cơ thuần (`src/game/`), giao diện React (`src/components/`), âm thanh và lưu trữ
- [techstack.md](./techstack.md) — Ngôn ngữ, framework và công cụ kiểm thử chuẩn theo `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Luật miền Bắc đầy đủ, điều khiển, tính điểm và cài đặt
- [developer-guide.md](./developer-guide.md) — Cấu trúc dự án, mở rộng luật/AI, kiểm thử và quy trình build
