# Biên bản kiểm thử mô hình GitHub Pages – AIX UNETI12

- Mô hình nguồn: `UNETI12_model_final.joblib` (LightGBM 2.394 cây, 45 đặc trưng).
- Tệp trình duyệt: `assets/lightgbm_model.json`, xuất trực tiếp từ booster nguồn.
- Đánh giá đối chiếu: **1.000 đầu vào** lấy từ Test riêng chỉ dùng để kiểm thử **cục bộ** (không phát hành dữ liệu Test trong website).
- Kết quả: **0 dự đoán sai lệch khi làm tròn đến 3 chữ số thập phân**.
- Sai khác tuyệt đối tối đa do số thực: khoảng `4.55e-13` giây.
- Mẫu A: `497.6797842224992` giây.
- Mẫu B: `2231.0249215193644` giây.
- Đầu vào không hợp lệ (`pickup_hour = 25`) bị từ chối.

**Phạm vi:** Kiểm thử toán học đối chiếu Python/Node.js thành công. Giao diện HTML/CSS đã xem ở desktop và điện thoại (không bị tràn ngang). Khả năng kết nối mô hình trực tiếp từ GitHub Pages cần được xác nhận **sau khi chủ repository xuất bản**.
