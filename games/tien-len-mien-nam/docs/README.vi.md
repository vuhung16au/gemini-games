[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tiến Lên Miền Nam — Chặt Heo, Tới Trắng Cực Đã

**Tiến Lên Miền Nam** là game bài 52 lá quốc dân chuẩn luật miền Nam, được build bằng TypeScript, React 18 và Vite. Chơi đơn so kè với **AI** thông minh hoặc rủ hội bạn chơi **Pass & Play** 2, 3, 4 người ngay trên một thiết bị.

## Có gì hay?
- **Chuẩn luật Miền Nam phóng khoáng:** Thứ tự `3 < 4 < … < A < 2` với phân chất `♠ < ♣ < ♦ < ♥`, sảnh không cần đồng chất (`>= 3` lá, không gồm `2`) và quyền đi trước ván đầu (`3♠` hoặc lá nhỏ nhất).
- **Combo Chặt Heo cực gắt:**
  - **3 Đôi thông** chặt `2` lẻ hoặc 3 Đôi thông nhỏ hơn.
  - **Tứ quý** chặt `2` lẻ, đôi `2`, 3 Đôi thông hoặc Tứ quý nhỏ hơn.
  - **4 Đôi thông** chặt tất tần tật các bộ trên và 4 Đôi thông nhỏ hơn (không cần vòng cũng chặt được!).
- **Tới Trắng (Chia xong thắng luôn):** Tự động xử thắng ngay khi có **Sảnh Rồng (`3→A`)**, **6 Đôi**, hoặc **Tứ quý `2`**.
- **2–4 người chơi × 2 chế độ:** Đổi nhanh giữa `2P`, `3P`, `4P` với chế độ **vs AI** hoặc **Pass & Play** (kèm Màn che riêng tư).
- **Song ngữ & Trợ giúp tận răng:** Mọi nút đều có Việt + Anh (`Đánh / Play`, `Bỏ lượt / Pass`, `Xếp bài / Sort`), có hộp thoại **How to Play**, **Tutorial** 3 bước và **Hints** (`💡 Gợi ý / Hint`).
- **Offline 100% & SFX tự tạo:** Không tải tài nguyên ngoài; Web Audio **SFX** kèm nút **Mute** và lưu trạng thái vào `localStorage` (`tien_len_mien_nam_v1`).

## Tài liệu chi tiết
- [QUICKSTART.md](./QUICKSTART.md) — Hướng dẫn nhanh: cài đặt, chạy dev, test và build
- [architecture.md](./architecture.md) — Kiến trúc game engine và giao diện
- [techstack.md](./techstack.md) — Tech stack chi tiết
- [user-guide.md](./user-guide.md) — Luật Tiến Lên Miền Nam, điều khiển và mẹo chặt heo
- [developer-guide.md](./developer-guide.md) — Hướng dẫn dev, tùy biến **AI** và chạy test
