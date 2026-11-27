[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tá Lả (Phỏm) — Đấu Trí Bài Lá Dân Gian

Phiên bản web chuẩn luật, chơi offline tẹt ga của **Tá Lả (Phỏm)**, được build bằng TypeScript, React 18 và Vite 5. Ngồi rảnh mở lên làm vài ván đấu trí với **AI** hoặc rủ bạn bè chơi chung cực tiện.

## Có gì hay?
- **Chuẩn luật 4 vòng:** Bộ bài 52 lá, người cầm cái 10 lá, nhà khác 9 lá, phần dư để vào **Nọc**. Check **Ăn** bài chặt chẽ (phải ghép thành Phỏm hợp lệ, tối đa 1 lá ăn mỗi Phỏm), vòng cuối **Hạ Phỏm** & **Gửi bài**, bắt **Ù** tức thì và tính **Móm / Cháy** không sai một ly.
- **Thuật toán hạ bài tối ưu (`solveOptimalMelds`):** Tự động tính cách xếp Phỏm sao cho điểm rác thấp nhất (`A=1`, `2–10=điểm mặt`, `J=11`, `Q=12`, `K=13`) mà vẫn giữ đủ mọi lá đã ăn.
- **2–4 người chơi × 2 chế độ:** Chọn `2P`, `3P` hoặc `4P` để solo với **AI** (`vs AI`) hoặc chuyền tay trên một máy (`Pass & Play`) kèm **Màn che riêng tư** chống nhìn trộm.
- **Giao diện & Hướng dẫn song ngữ:** Đầy đủ nhãn Việt + Anh, có hộp thoại **How to Play** (`? Trợ giúp`), **Hints** (`💡 Gợi ý` dùng `getPhomHint`), **Tutorial** 3 bước (`Bốc/Ăn -> Đánh -> Hạ Phỏm`) và Web Audio **SFX** kèm nút **Mute**.
- **Gọn trong 1 màn hình (`100dvh`):** Bàn bài responsive không thanh cuộn, lá bài CSS/SVG nét căng (`♠ ♣ ♦ ♥`) và tự lưu trạng thái vào `localStorage` (`ta_la_phom_v1`).

## Tài liệu chi tiết
- [QUICKSTART.md](./QUICKSTART.md) — Hướng dẫn nhanh: cài đặt, chạy dev, test và build
- [architecture.md](./architecture.md) — Kiến trúc game engine và giao diện
- [techstack.md](./techstack.md) — Tech stack sử dụng
- [user-guide.md](./user-guide.md) — Luật chơi Tá Lả, cách hạ/gửi bài và mẹo chơi
- [developer-guide.md](./developer-guide.md) — Hướng dẫn dev, mở rộng **AI** và chạy test
