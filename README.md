# NYC Taxi AI – Website demo AIX (UNETI12)

Website tĩnh **thực sự dự đoán bằng LightGBM** dành cho Vòng 2 Olympic Trí tuệ Nhân tạo UNETI 2026. Có thể chạy trên GitHub Pages mà **không cần Python, Streamlit hoặc server riêng**.

## Điểm quan trọng

- Mô hình gồm **2.394 cây LightGBM** và **45 đặc trưng**, xuất trực tiếp từ `UNETI12_model_final.joblib` đã huấn luyện.
- JavaScript tái hiện đúng các công thức feature engineering trong `02_feature_engineering.py`, gồm làm tròn đặc trưng theo float32.
- Mẫu A: **497,68 giây**; mẫu B: **2.231,02 giây** (hiển thị làm tròn một chữ số).
- Đã so sánh **1.000 mẫu** giữa JavaScript và mô hình Python: **0/1.000 sai lệch khi làm tròn đến 3 chữ số thập phân**.
- Mô hình chạy **ngay trong trình duyệt**; nội dung dự đoán không gửi lên máy chủ. Tệp `assets/lightgbm_model.json` (khoảng 8,1 MB) được tải ở lần mở trang đầu tiên.
- Không gồm dataset Train/Test của cuộc thi và không dùng `trip_id` làm đầu vào.

## Cách đưa lên GitHub Pages (không cần biết lập trình)

1. Vào [https://github.com/new](https://github.com/new) và đăng nhập GitHub.
2. Tạo repository **Public**, tên ví dụ: `aix-uneti12-demo`, rồi chọn **Create repository**.
3. Giải nén ZIP website này. Trong repository, nhấn **Add file → Upload files** (hoặc liên kết *uploading an existing file*).
4. Kéo thả **toàn bộ nội dung bên trong thư mục đã giải nén** lên trang upload, sao cho trong gốc repository có `index.html` và thư mục `assets/` (chứa đủ 4 tệp `app.js`, `predictor.js`, `style.css`, `lightgbm_model.json`, cộng `favicon.svg`). Không tải file ZIP trực tiếp lên và mong GitHub tự giải nén. File `.nojekyll` có thể tải lên nhưng không bắt buộc.
5. Nhấn **Commit changes**.
6. Vào repository **Settings → Pages → Build and deployment**. Chọn **Source = Deploy from a branch**, **Branch = main**, **Folder = /(root)** rồi **Save**.
7. Khi GitHub thông báo website đã triển khai, mở link theo mẫu:
   `https://TEN-TAI-KHOAN.github.io/aix-uneti12-demo/`
   (thay `TEN-TAI-KHOAN` bằng username GitHub thật, và đường dẫn sau bằng tên repository thật).
8. Đợi trạng thái trên website hiển thị **Mô hình sẵn sàng**, thử **Mẫu A → Dự đoán**, sau đó **Mẫu B → Dự đoán**. Sao chép link website thực tế để nộp mục *Link web demo*.

**Lưu ý:** repo cần chứa các tệp website, không phải ZIP hồ sơ Vòng 2. Link `localhost:8501` không hoạt động với người khác.

## Chạy thử trên Windows trước khi đăng lên GitHub

1. Mở thư mục website (chứa `index.html`) trong VS Code.
2. Chọn **Terminal → New Terminal** rồi chạy:

```powershell
py -m http.server 8000
```

3. Mở **http://localhost:8000** bằng Chrome.
4. Không mở `index.html` trực tiếp bằng `file://`, vì trình duyệt có thể chặn việc tải tệp JSON mô hình.

Không cần cài `lightgbm`, `pandas` hoặc tái huấn luyện. Python ở đây chỉ dùng để mở một HTTP server tĩnh cho mục đích xem thử trên máy.

## Sơ đồ các tệp

```text
index.html                    - Trang giao diện
assets/style.css              - Màu sắc, bố cục, responsive
assets/app.js                 - Form, nút mẫu, hiển thị kết quả
assets/predictor.js           - 45 đặc trưng và suy luận cây LightGBM
assets/lightgbm_model.json   - Cây mô hình LightGBM đã chuyển đổi
assets/favicon.svg           - Biểu tượng AIX
.nojekyll                     - Tắt xử lý Jekyll trên GitHub Pages
README.md                     - Tài liệu này
```

## Chú ý về cuộc thi

GitHub Pages là một website tĩnh công khai. File mô hình JS/JSON có thể được người truy cập tải xuống; không nên đăng bí mật, token, dữ liệu cá nhân hoặc dữ liệu Test riêng lên repository. Khi cần giữ mô hình riêng tư, phải dùng backend riêng thay vì chỉ dùng GitHub Pages.

Chỉ số **RMSLE 0,338513** là kết quả Validation đã ghi nhận trên 240.000 chuyến, **không phải điểm Test ẩn của BTC**. Website demo không thay thế CSV `trip_id,trip_duration` cần nộp.

## Sửa lỗi thường gặp

- **Mô hình không tải được**: xem repository có `assets/lightgbm_model.json` hay không; không mở HTML qua `file://`.
- **Lỗi 404**: kiểm tra tên repository, nhánh `main`, thư mục `/(root)` và đường dẫn `index.html`.
- **Bấm nút không ra kết quả**: đợi trạng thái chuyển sang *Mô hình sẵn sàng*, kiểm tra Console (F12) và làm mới trang (`Ctrl+F5`).
- **Website vẫn phiên bản cũ**: chờ GitHub Pages hoàn thành deploy, sau đó tải lại trang bằng `Ctrl+F5`.
