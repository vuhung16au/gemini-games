[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tiến Lên Miền Bắc — Chuẩn Luật Đồng Chất, Đồng Màu

**Tiến Lên Miền Bắc** là game bài 52 lá truyền thống giữ đúng chất "khó tính" nhưng cực cuốn của luật miền Bắc: đồng chất, đồng màu nghiêm ngặt. Được build bằng TypeScript, React 18 và Vite, sẵn sàng mở lên là chiến.

## Có gì hay?
- **Luật Miền Bắc chuẩn chỉnh:**
  - Bài lẻ chỉ chặt được bài lẻ **cùng chất** (trừ `2` chặt mọi lá khác `2`; `2` chất lớn hơn chặt `2` chất nhỏ hơn).
  - Đôi (`Đôi`) phải **đồng màu** (`♠♣` đen hoặc `♦♥` đỏ) và chỉ đè được đôi cùng màu.
  - Sám cô (`Sám cô`) chỉ chặt sám cô khớp **đúng 3 chất**.
  - Sảnh (`Sảnh`, từ 3 lá trở lên, không chứa `2`) phải **đồng chất** và chỉ chặt sảnh cùng độ dài, cùng chất.
  - **Tứ quý** chặt gọn bất kỳ lá `2` lẻ nào (**Chặt Heo**) hoặc Tứ quý nhỏ hơn (**Chặt chồng**).
  - Ván đầu ai cầm `3♠` đánh trước, kèm cảnh báo **Thối 2** — không cho về nhất bằng lá `2` cuối cùng.
- **2P / 3P / 4P × 2 chế độ:** Solo với **AI** (`vs AI`, 1 người + 1–3 bot) hoặc chơi **Pass & Play** cùng bạn bè trên một máy (có Màn che riêng tư).
- **Song ngữ & Trợ giúp đầy đủ:** Nhãn Việt + Anh dễ nhìn, hộp thoại **How to Play** (`? Trợ giúp`), **Tutorial** 3 bước, nút **Hints** (`💡 Hint` dùng `getNorthernHint`) và Web Audio **SFX** kèm nút **Mute**.

## Điều khiển nhanh
- **Click / Chạm lá bài:** Chọn hoặc bỏ chọn lá trên tay.
- **Nút bấm:** `Đánh / Play`, `Bỏ lượt / Pass`, `Bỏ chọn / Clear`, `Xếp bài / Sort`, `💡 Hint`, `Tutorial`, `?`.
- **Phím tắt:** `Enter` (Đánh), `P` (Bỏ lượt), `H` (Hints), `S` (Xếp bài), `Esc` (Bỏ chọn / Đóng hộp thoại).

## Tài liệu chi tiết
- [QUICKSTART.md](./QUICKSTART.md) — Lệnh cài đặt, dev server, chạy test và build production
- [architecture.md](./architecture.md) — Core logic (`src/game/`), React UI (`src/components/`), Web Audio **SFX** và lưu trữ
- [techstack.md](./techstack.md) — Ngôn ngữ, framework và bộ công cụ test chuẩn theo `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Luật Tiến Lên Miền Bắc đầy đủ, điều khiển, tính điểm và settings
- [developer-guide.md](./developer-guide.md) — Cấu trúc project, mở rộng luật/**AI**, chạy test và quy trình build
