# Asset Management System - Bug Analysis Report

## Tổng quan
Nguồn dữ liệu: bug-tracker.xlsx

Tổng số vấn đề ghi nhận: **10 bug / improvement items** liên quan đến module **Assets**.

---

## BUG-001: Upload hình ảnh tài sản thất bại

### Module
Assets → Xem chi tiết tài sản → Upload hình ảnh

### Hiện trạng
Người dùng không thể upload hình ảnh cho tài sản.

### Log lỗi
```text
POST http://localhost:3004/api/assets/mac01/images
404 (Not Found)
```

### Phân tích kỹ thuật
- API upload image không tồn tại hoặc sai endpoint.
- Frontend đang gọi:
  `/api/assets/{assetCode}/images`
- Backend có thể:
  - Chưa implement API.
  - Sai route.
  - Sai asset identifier.
  - Sai cấu hình reverse proxy.

### Mức độ ưu tiên
🔴 Critical

### Kỳ vọng
Upload thành công các định dạng:
- PNG
- JPG/JPEG
- WEBP
- PDF

---

## BUG-002: Không thể chỉnh sửa tài sản

### Module
Assets → Xem chi tiết tài sản

### Hiện trạng
CTA "Chỉnh sửa" không hoạt động.

### Phân tích kỹ thuật
Khả năng cao:
- Button chưa bind event.
- Điều kiện permission sai.
- Modal Edit chưa được render.
- Route edit chưa được cấu hình.

### Mức độ ưu tiên
🔴 High

### Kỳ vọng
Click vào CTA phải mở:
- Popup chỉnh sửa
hoặc
- Trang chỉnh sửa tài sản

---

## BUG-003: Không thể phân công tài sản

### Module
Assets → Xem chi tiết tài sản

### Hiện trạng
CTA "Phân công" không hoạt động.

### Phân tích kỹ thuật
Khả năng:
- Chưa gắn sự kiện onClick.
- API assign asset chưa được gọi.
- Modal Assign chưa được tích hợp.

### Mức độ ưu tiên
🔴 High

### Kỳ vọng
Hiển thị popup phân công cho nhân viên.

---

## BUG-004: Không thể thanh lý tài sản

### Module
Assets → Xem chi tiết tài sản

### Hiện trạng
CTA "Thanh lý" không hoạt động.

### Phân tích kỹ thuật
Khả năng:
- Thiếu workflow disposal.
- Thiếu API cập nhật trạng thái.
- Thiếu modal xác nhận.

### Mức độ ưu tiên
🔴 High

### Kỳ vọng
Hiển thị popup thanh lý và cập nhật trạng thái tài sản.

---

## BUG-005: Không có chức năng xóa tài sản

### Module
Assets → Danh sách tài sản

### Hiện trạng
Không có CTA xóa trong cột Hành động.

### Phân tích
Đây là thiếu chức năng nghiệp vụ quan trọng.

### Rủi ro
- Không xử lý được dữ liệu nhập sai.
- Tăng dữ liệu rác.

### Mức độ ưu tiên
🟡 Medium

### Đề xuất
- Soft Delete.
- Ghi audit log.
- Chỉ Admin được phép xóa.

---

## BUG-006: Thiếu gợi ý định dạng tiền khi nhập

### Module
Assets → Tạo mới tài sản

### Hiện trạng
Khi nhập:
```text
20000000
```

Người dùng không biết định dạng tiền thực tế.

### Đề xuất UX
Hiển thị:
```text
20.000.000 VNĐ
```

### Mức độ ưu tiên
🟡 Medium

---

## BUG-007: Hiển thị tiền sai định dạng

### Module
Assets

### Hiện trạng
Hiển thị:
```text
20000000.00
```

### Vấn đề
Định dạng theo kiểu số thập phân quốc tế, không phù hợp VNĐ.

### Đề xuất
Sử dụng:
```javascript
Intl.NumberFormat('vi-VN')
```

Ví dụ:
```text
20.000.000 VNĐ
```

### Mức độ ưu tiên
🟡 Medium

---

## BUG-008: Popup tạo tài sản không có upload hình ảnh

### Module
Assets → Tạo mới tài sản

### Hiện trạng
Không có trường upload ảnh.

### Tác động
- Người dùng phải tạo xong rồi mới upload.
- Trải nghiệm không tối ưu.

### Mức độ ưu tiên
🟡 Medium

### Kỳ vọng
Cho phép upload ảnh ngay trong popup tạo mới.

---

## BUG-009: Popup tạo tài sản không có trường chọn hóa đơn

### Module
Assets → Tạo mới tài sản

### Hiện trạng
Không có trường liên kết hóa đơn.

### Tác động nghiệp vụ
Đây là nghiệp vụ cốt lõi giữa:
- IT
- Kế toán

Một hóa đơn có thể chứa nhiều tài sản.

### Mức độ ưu tiên
🔴 Critical

### Kỳ vọng
Cho phép chọn hóa đơn ngay khi tạo tài sản.

---

## BUG-010: Hiển thị UUID thay vì tên phòng ban

### Module
Assets → Phân công tài sản

### Hiện trạng
Sau khi chọn nhân viên:

Hiển thị:
```text
Department: 8c5a52f1-xxxx-xxxx
```

Thay vì:

```text
Department: Information Technology
```

### Phân tích kỹ thuật
Frontend đang render:
```javascript
departmentId
```

thay vì:

```javascript
department.name
```

### Mức độ ưu tiên
🟡 Medium

### Kỳ vọng
Hiển thị tên phòng ban thay vì UUID.

---


## BUG-011: Không thể phân công tài sản do lỗi database

### Module

Assets → Phân công tài sản

### Bước thực hiện

1. Mở chi tiết tài sản.
2. Click CTA "Phân công".
3. Chọn nhân viên.
4. Click CTA "Phân công".

### Hiện trạng

Hệ thống hiển thị lỗi:

```text
Error: column "asset_id" of relation "handover_slips" does not exist
```

### Phân tích kỹ thuật

Lỗi phát sinh từ tầng Database hoặc Backend API.

Khả năng cao:

* Bảng `handover_slips` không tồn tại cột `asset_id`.
* Entity Model và Database Schema không đồng bộ.
* Migration chưa được chạy.
* Backend đang insert dữ liệu theo schema cũ.

Ví dụ:

```sql
INSERT INTO handover_slips (
    asset_id,
    employee_id
)
```

Trong khi bảng thực tế không có cột `asset_id`.

### Mức độ ưu tiên

🔴 Critical

### Tác động nghiệp vụ

* Không thể phân công tài sản.
* Không thể sinh phiếu bàn giao.
* Luồng quản lý tài sản bị gián đoạn hoàn toàn.

### Kỳ vọng

* Phân công thành công.
* Tự động sinh Phiếu Bàn Giao.
* Cập nhật trạng thái tài sản sang "Đang sử dụng" hoặc trạng thái tương ứng.

---

## BUG-012: Thẻ trạng thái không hiển thị nội dung

### Module

Assets → Danh sách tài sản
Assets → Chi tiết tài sản

### Hiện trạng

Cột Trạng thái chỉ hiển thị màu nền.

Ví dụ:

🟢

Người dùng không biết trạng thái là gì.

### Phân tích kỹ thuật

Khả năng cao frontend chỉ render:

```html
<span class="status-badge success"></span>
```

thay vì:

```html
<span class="status-badge success">
  Available
</span>
```

### Mức độ ưu tiên

🟡 Medium

### Tác động

* Khó đọc dữ liệu.
* Phải suy đoán trạng thái theo màu.
* Không thân thiện với người dùng mới.

### Kỳ vọng

Hiển thị:

```text
🟢 Available
🟡 Assigned
🔴 Disposed
```

hoặc

```text
Sẵn sàng
Đang sử dụng
Thanh lý
```

---

## BUG-013: Tài sản thanh lý vẫn xuất hiện trong danh sách tài sản đang hoạt động

### Module

Assets → Danh sách tài sản

### Hiện trạng

Sau khi tài sản được thanh lý, tài sản vẫn hiển thị trong bảng "Tất cả tài sản".

### Phân tích nghiệp vụ

Theo nghiệp vụ quản lý tài sản thông thường:

* Tài sản đang hoạt động.
* Tài sản thanh lý.

Nên được quản lý riêng.

### Đề xuất UX/UI

Thêm tab:

```text
[Tất cả]
[Đang sử dụng]
[Sẵn sàng]
[Thanh lý]
```

hoặc

```text
CTA: Thiết bị thanh lý
```

để mở danh sách riêng.

### Mức độ ưu tiên

🟡 Medium

### Tác động

* Danh sách tài sản bị nhiễu.
* Khó quản lý vòng đời tài sản.
* Báo cáo tổng hợp dễ sai lệch.

### Kỳ vọng

Tài sản thanh lý được:

* Chuyển sang danh sách riêng.
* Không xuất hiện mặc định trong danh sách hoạt động.

---

## BUG-014: Input Giá mua hiển thị nút tăng giảm giá trị không phù hợp

### Module

Assets → Tạo mới tài sản

### Trường dữ liệu

Giá mua

### Hiện trạng

Input hiển thị:

```html
<input type="number" />
```

kèm hai nút:

```text
▲
▼
```

### Vấn đề

Khi người dùng lăn chuột:

* Giá trị tự động tăng.
* Giá trị tự động giảm.

Dẫn đến sai lệch giá trị tiền tệ.

Ví dụ:

```text
20.000.000
```

vô tình thành:

```text
20.000.001
```

hoặc

```text
19.999.999
```

### Phân tích UX

Đối với dữ liệu tiền tệ:

* Người dùng thường nhập trực tiếp.
* Không sử dụng step increment.

### Mức độ ưu tiên

🟡 Medium

### Kỳ vọng

Ẩn spinner:

```css
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    display: none;
}
```

hoặc chuyển sang:

```html
<input type="text" />
```

kết hợp format tiền tệ.

Ví dụ:

```text
20.000.000 VNĐ
```


# Tổng kết

| Mức độ | Số lượng |
|---------|----------|
| Critical | 2 |
| High | 3 |
| Medium | 5 |

## Ưu tiên xử lý

1. BUG-001 Upload hình ảnh thất bại
2. BUG-009 Thiếu liên kết hóa đơn
3. BUG-002 Chỉnh sửa tài sản
4. BUG-003 Phân công tài sản
5. BUG-004 Thanh lý tài sản
