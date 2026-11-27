[English](./README.md) | [中文](./README.zh.md) | **Tiếng Việt**

# SimCity 3D

**SimCity 3D** là trò chơi xây dựng thành phố và mô phỏng đô thị 3D low-poly trên trình duyệt—tựa game 3D đầu tiên trong bộ sưu tập Gemini Games.

## Tính năng chính
- **Sa bàn 3D Tương tác:** Xây dựng bằng Three.js với đường sá và cầu tự động nối, các tòa nhà Dân cư/Thương mại/Công nghiệp phát triển theo cấp (L0–L4), tua-bin gió quay, khói nhà máy, xe cộ lưu thông và ánh sáng Ngày / Hoàng hôn / Đêm.
- **Hạ tầng Điện Nước theo Đường:** Nhà máy điện (`+35 MW`) và Tháp nước (`+35`) phân phối điện nước dọc theo mạng lưới đường nối liền qua thuật toán duyệt đồ thị BFS.
- **Nhu cầu RCI & Ngân sách:** Nhu cầu Dân cư, Thương mại, Công nghiệp biến động, thuế suất điều chỉnh (`5%–15%`), thu/chi hàng tháng, giá đất, ô nhiễm và 6 cột mốc đô thị (từ `Hamlet` đến `Megalopolis`).
- **Lớp phủ Dữ liệu 3D & Hướng dẫn:** Bật/tắt lớp phủ Điện, Nước, Giá đất, kiểm tra từng ô đất, làm theo Tutorial 5 bước hoặc tham khảo Cố vấn Thị trưởng.

## Danh mục tài liệu
- [QUICKSTART.md](./QUICKSTART.md) — Cài đặt, kiểm thử và lệnh build cục bộ
- [architecture.md](./architecture.md) — Mô phỏng, trình vẽ Three.js, âm thanh và kiến trúc React HUD
- [techstack.md](./techstack.md) — Tech stack và thư viện chuẩn theo `/techstacks/techstack.md`
- [user-guide.md](./user-guide.md) — Luật chơi, điều khiển, quy hoạch RCI, điện nước và lưu trữ
- [developer-guide.md](./developer-guide.md) — Tinh chỉnh hằng số, thêm công trình, kiểm thử và build
