[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# Tá Lả (Phỏm) — Game Bài Cổ Điển Việt Nam

Phiên bản web chuẩn mực, sẵn sàng ngoại tuyến của **Tá Lả (Phỏm)** được xây dựng bằng TypeScript, React 18 và Vite 5.

## Tính năng

- **Luật 4 Vòng Chuẩn:** Bộ bài 52 lá, người chia cầm 10 lá và các người chơi khác 9 lá, phần còn lại vào nọc **Nọc**, kiểm tra **Ăn** chặt chẽ (tạo thành Phỏm hợp lệ với tối đa 1 lá ăn mỗi Phỏm), vòng 4 **Hạ Phỏm** & **Gửi bài**, nhận diện **Ù** tức thì và **Móm / Cháy**.
- **Bộ giải Quay lui Tối ưu (`solveOptimalMelds`):** Tối thiểu hóa điểm rác (`A=1`, `2–10=điểm mặt`, `J=11`, `Q=12`, `K=13`) trong khi bao phủ toàn bộ các lá bài đã ăn.
- **2–4 Người chơi × 2 Chế độ:** Chơi `2P`, `3P` hoặc `4P` đấu với AI thông minh (`vs AI`) hoặc chơi cùng bạn bè trên một máy (`Pass & Play`) có **Màn che Riêng tư**.
- **Giao diện & Hướng dẫn Song ngữ:** Nhãn Tiếng Việt + Tiếng Anh, hộp thoại `? Trợ giúp`, `💡 Gợi ý` (`getPhomHint`), `Tutorial` 3 bước (`Bốc/Ăn -> Đánh -> Hạ Phỏm`) và âm thanh Web Audio kèm nút tắt tiếng.
- **Không thanh cuộn (`100dvh`):** Bố cục bàn bài responsive với lá bài CSS/SVG sắc nét (`♠ ♣ ♦ ♥`) và lưu `localStorage` an toàn (`ta_la_phom_v1`).

## Danh mục tài liệu

- [Hướng dẫn Nhanh](./QUICKSTART.md)
- [Kiến trúc](./architecture.md)
- [Tech Stack](./techstack.md)
- [Hướng dẫn Người chơi](./user-guide.md)
- [Hướng dẫn Lập trình viên](./developer-guide.md)
