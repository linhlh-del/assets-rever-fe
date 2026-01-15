# REVER IT ASSET MANAGEMENT SYSTEM
## TÀI LIỆU PHÂN TÍCH YÊU CẦU HỆ THỐNG

**Project Name**: rever-website-manage-asset-it  
**Version**: 1.0  
**Date**: 13/01/2026  
**Status**: Final Specification

---

## 📋 MỤC LỤC

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Phân Quyền](#2-phân-quyền)
3. [Module 1: Quản Lý Users](#3-module-1-quản-lý-users)
4. [Module 2: Quản Lý Tài Sản](#4-module-2-quản-lý-tài-sản)
5. [Module 3: Quản Lý Hóa Đơn](#5-module-3-quản-lý-hóa-đơn)
6. [Module 4: Bảo Trì & Sửa Chữa](#6-module-4-bảo-trì--sửa-chữa)
7. [Module 5: Thanh Lý Thiết Bị](#7-module-5-thanh-lý-thiết-bị)
8. [Module 6: Phiếu Bàn Giao](#8-module-6-phiếu-bàn-giao)
9. [Module 7: Báo Cáo & Dashboard](#9-module-7-báo-cáo--dashboard)
10. [Database Schema](#10-database-schema)
11. [API Endpoints](#11-api-endpoints)
12. [UI/UX Guidelines](#12-uiux-guidelines)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Giới Thiệu

**Mục đích**: Hệ thống quản lý tài sản IT nội bộ của Rever, bao gồm:
- Quản lý người dùng (CRUD users)
- Quản lý thiết bị IT (laptop, màn hình, phụ kiện...)
- Quản lý hóa đơn (nhiều định dạng file)
- Phiếu bàn giao thiết bị tự động
- Theo dõi lịch sử sử dụng
- Bảo trì và sửa chữa
- Thanh lý thiết bị
- Dashboard và báo cáo

### 1.2. Tech Stack

```
Frontend:       React.js 18 + Vite + TailwindCSS
State:          Zustand (global) + React Query (server state)
Backend:        Node.js + Express (optional) hoặc chỉ Supabase
Database:       Supabase (PostgreSQL 15)
Authentication: Google OAuth (@rever.vn only)
Storage:        Supabase Storage (files & images)
PDF Generation: pdfkit (backend) hoặc jsPDF (frontend)
Charts:         Recharts
Deployment:     Vercel (Frontend) + Supabase (Backend)
```

### 1.3. User Roles

| Role | Quyền hạn |
|------|-----------|
| **admin_it** | Full access - CRUD tất cả (users, assets, invoices, maintenance, disposal) |
| **accountant** | Read assets + CRUD invoices |
| **dev** | Read assets (không thấy giá) + Report issues |
| **user** | Read own assets + Report issues |

---

## 2. PHÂN QUYỀN

### 2.1. Permission Matrix

| Chức năng | Admin/IT | Accountant | Dev | User |
|-----------|----------|------------|-----|------|
| **USERS MANAGEMENT** |
| Xem danh sách users | ✅ Full | ✅ Read | ✅ Read | ✅ Self |
| CRUD users | ✅ | ❌ | ❌ | ❌ |
| Đổi role users | ✅ | ❌ | ❌ | ❌ |
| **ASSETS MANAGEMENT** |
| Xem tài sản | ✅ Full | ✅ Full | ✅ No price | ✅ Own |
| CRUD tài sản | ✅ | ❌ | ❌ | ❌ |
| Upload ảnh tài sản | ✅ | ✅ | ❌ | ❌ |
| Gán/Thu hồi/Chuyển giao | ✅ | ❌ | ❌ | ❌ |
| Thanh lý | ✅ | ❌ | ❌ | ❌ |
| **INVOICES** |
| Xem hóa đơn | ✅ | ✅ | ❌ | ❌ |
| Upload hóa đơn | ✅ | ✅ | ❌ | ❌ |
| CRUD hóa đơn | ✅ | ✅ | ❌ | ❌ |
| **HANDOVER SLIPS (Phiếu bàn giao)** |
| Tạo phiếu tự động | ✅ | ❌ | ❌ | ❌ |
| Xem phiếu (own) | ✅ | ✅ | ✅ | ✅ |
| Xem tất cả phiếu | ✅ | ✅ | ❌ | ❌ |
| Export PDF | ✅ | ✅ | ✅ | ✅ |
| **MAINTENANCE** |
| Báo cáo hư hỏng | ✅ | ✅ | ✅ | ✅ |
| Upload ảnh hư hỏng | ✅ | ✅ | ✅ | ✅ |
| Cập nhật trạng thái | ✅ | ❌ | ❌ | ❌ |
| **REPORTS** |
| Dashboard | ✅ | ✅ | ✅ Limited | ✅ Own |
| Tùy chỉnh charts | ✅ | ✅ | ✅ | ✅ |
| Export reports | ✅ | ✅ | ✅ | ❌ |

---

## 3. MODULE 1: QUẢN LÝ USERS

### 3.1. Danh Sách Users

**UI Components:**
```
┌──────────────────────────────────────────────────────────────┐
│ 👥 QUẢN LÝ NGƯỜI DÙNG                    [+ Thêm User Mới]  │
├──────────────────────────────────────────────────────────────┤
│ 🔍 Tìm kiếm: [________________]  Phòng ban: [All ▼]         │
│     Role: [All ▼]  Status: [All ▼]                          │
├──────────────────────────────────────────────────────────────┤
│ ☑ Mã NV      Họ tên           Email           Phòng   Role  │
│ ────────────────────────────────────────────────────────────│
│ □ RV000330   Trần Thị Nhung   nhungttn@      Project admin │
│ □ RVA02259   Nguyễn Ngọc Anh  anhnn1@        Sales   user  │
│ □ RV000420   Phan Thị Huyền   huyenptn@      Finance user  │
│                                                              │
│ Hiển thị 1-20 của 59 users          [← 1 2 3 4 →]         │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Search (mã NV, tên, email)
- ✅ Filter (department, team, role, status)
- ✅ Sort (name, department, date)
- ✅ Pagination
- ✅ Bulk actions (Admin only)

### 3.2. Thêm User Mới

**Form Fields:**
```
THÔNG TIN CƠ BẢN:
- Mã nhân viên * (RV + 8 số hoặc RVA + 5 số)
- Email * (@rever.vn)
- Họ tên đầy đủ *
- Tên, Họ
- Số điện thoại

THÔNG TIN TỔ CHỨC:
- Phòng ban *
- Team
- Vị trí
- Báo cáo cho

PHÂN QUYỀN:
- Role * (user, dev, accountant, admin_it)
- Status * (active, inactive)
```

**Validation:**
- Mã NV unique, format chuẩn
- Email unique, @rever.vn
- Tên >= 3 ký tự

### 3.3. Sửa & Xóa User

**Sửa:**
- Không cho sửa employee_code và email
- Confirm khi thay đổi role
- Track changes trong audit_log

**Xóa (Soft Delete):**
- Set status = 'resigned'
- Check assets đang sử dụng
- Không xóa chính mình
- Không xóa admin cuối cùng

### 3.4. Lịch Sử Người Dùng

**Xem lịch sử tài sản của 1 user:**
```
RV000330 - Trần Thị Ngọc Nhung
Đã sử dụng:

● 15/01/2024 - nay (1 năm)
  IT-LAP-001 - MacBook Pro 14"
  Trạng thái: Đang sử dụng 🟢
  
● 01/12/2023 - 14/01/2024 (45 ngày)
  IT-LAP-045 - Dell Latitude
  Trạng thái: Đã thanh lý 🟤
  Lý do: Màn hình vỡ
  
Thống kê:
- Tổng: 2 thiết bị
- Đang dùng: 1
- Đã thanh lý: 1
```

---

## 4. MODULE 2: QUẢN LÝ TÀI SẢN

### 4.1. Dashboard Tài Sản

**Stat Cards:**
```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ 150      │  │ 120      │  │ 20       │  │ 8        │
│ Tổng TS  │  │ Đang SD  │  │ Có sẵn   │  │ Bảo trì  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

┌──────────┐  ┌──────────┐
│ 5        │  │ 3        │
│ Hư hỏng  │  │ Thanh lý │
└──────────┘  └──────────┘
```

**Charts tùy chỉnh:**
- User chọn kiểu: Bar / Pie / Line
- Charts: Theo phòng ban, theo trạng thái, theo loại, theo thời gian
- Lưu preferences per user

**Widgets:**
- Sắp hết bảo hành (30 ngày)
- Tài sản hư hỏng cần xử lý

### 4.2. Danh Sách Tài Sản

**Trạng thái:**
- Available (Có sẵn) 🟢
- In Use (Đang sử dụng) 🔵
- Maintenance (Đang bảo trì) 🟡
- Broken (Hư hỏng) 🔴
- Disposed (Đã thanh lý) 🟤

**Features:**
- Search + Multi-filter
- List/Grid view
- Infinite scroll
- Export Excel/PDF

### 4.3. Chi Tiết Tài Sản

**Sections:**
```
THÔNG TIN CƠ BẢN:
- Mã tài sản, Tên, Loại, Model
- Màu sắc, Serial number
- Trạng thái

THÔNG TIN SỬ DỤNG:
- Người dùng hiện tại
- Phòng ban, Team
- Từ ngày

THÔNG TIN MUA HÀNG:
- Giá mua
- Ngày mua
- Nhà cung cấp
- Hóa đơn (link)

BẢO HÀNH:
- Thời hạn
- Ngày hết hạn
- Còn X ngày

HÌNH ẢNH:
- Gallery ảnh tài sản
- Upload từ máy/Google Drive/iPhone
- Support: JPG, PNG, WEBP, HEIC

LỊCH SỬ SỬ DỤNG:
- Timeline người dùng
- Bao gồm cả user đã nghỉ việc

LỊCH SỬ BẢO TRÌ:
- Danh sách bảo trì
- Trước/sau ảnh

THÔNG TIN THANH LÝ (nếu có):
- Ngày thanh lý
- Lý do
- Giá thanh lý
```

### 4.4. Thêm Tài Sản Mới

**Workflow:**
```
Bước 1: Thêm hóa đơn (nếu chưa có)
    ↓
Bước 2: Thêm tài sản
    - Chọn hóa đơn từ dropdown
    - Upload ảnh tài sản
    - Điền thông tin
    ↓
Bước 3: Lưu tài sản
```

**Form:**
```
THÔNG TIN CƠ BẢN:
- Mã tài sản * (auto-generate hoặc manual)
- Tên tài sản *
- Loại * (Laptop, Monitor, Keyboard, Mouse, etc.)
- Model, Màu sắc, Serial number

THÔNG TIN MUA HÀNG:
- Hóa đơn * (dropdown chọn từ danh sách)
- Giá mua *
- Ngày mua * (auto-fill từ hóa đơn)
- Nhà cung cấp (auto-fill từ hóa đơn)

BẢO HÀNH:
- Thời hạn bảo hành (tháng)
- Ngày hết hạn (auto-calculate)

HÌNH ẢNH:
- Upload ảnh (multiple)
- Drag & drop
- Preview thumbnails

GHI CHÚ:
- Notes
```

**Validation:**
- 1 tài sản phải có 1 hóa đơn
- Hóa đơn phải tồn tại
- Giá mua <= tổng tiền hóa đơn

### 4.5. Gán Tài Sản

**Form:**
```
Tài sản: IT-LAP-001 - MacBook Pro 14"

Người nhận *: [Search user ▼]
  → RV000330 - Trần Thị Ngọc Nhung
     Email: nhungttn@rever.vn
     Phòng ban: Project Management
     Tài sản hiện có: 2

Ngày bàn giao *: [15/01/2026]

Ghi chú: [_______________]

Upload ảnh bàn giao (optional):
[Upload images...]

[Hủy]  [Xác Nhận Gán]
```

**Actions:**
1. Validate: Asset available và không được gán cho user khác
2. Update asset: status = 'in_use', current_user = employee_code
3. Insert asset_history
4. **Tạo Phiếu Bàn Giao tự động** (PDF)
5. Upload evidence photos
6. Send email notification

**Error Handling:**
```
❌ Không thể gán tài sản

Thiết bị IT-LAP-001 đang được sử dụng bởi:
RV000330 - Trần Thị Ngọc Nhung
Từ ngày: 15/01/2024

Vui lòng thu hồi trước khi gán cho người khác.

[Thu hồi tài sản]  [Hủy]
```

### 4.6. Thu Hồi Tài Sản

**2 Options:**

**Option 1: Thủ công**
```
Form thu hồi:
- Ngày thu hồi *
- Tình trạng * (Tốt, Bình thường, Cần bảo trì, Hư hỏng)
- Ghi chú
- Upload ảnh tình trạng
```

**Option 2: Import phiếu thu hồi**
```
Upload file phiếu:
- PDF, Word, Excel, Images
- Parse thông tin (manual confirmation)
- Xác nhận và thu hồi
```

**Actions:**
1. Update asset: status = 'available' (hoặc 'broken'), current_user = NULL
2. Update asset_history: set to_date
3. Insert return_slip record
4. Upload evidence photos
5. Generate PDF phiếu thu hồi

### 4.7. Chuyển Giao Tài Sản

```
Từ user: RV000330 - Trần Thị Nhung (hiện tại)
Đến user: [Search ▼]
Ngày chuyển: [15/01/2026]
Lý do: [________________]
Upload ảnh bàn giao: [Upload...]
```

**Actions:**
1. Close old asset_history
2. Update asset.current_user
3. Insert new asset_history
4. Tạo phiếu bàn giao mới
5. Email cả 2 users

### 4.8. Lịch Sử Thiết Bị

**Xem lịch sử người dùng của 1 asset:**
```
IT-LAP-001 - MacBook Pro 14"
Đã được sử dụng bởi:

● 15/01/2024 - nay (1 năm)
  RV000330 - Trần Thị Ngọc Nhung
  Phòng ban: Project Management
  Status: Active ✅
  Phiếu: CPP-20240115-001
  
● 01/06/2023 - 14/01/2024 (228 ngày)
  RVA02259 - Nguyễn Ngọc Anh
  Phòng ban: Sales
  Status: Resigned ⚠️ (15/12/2024)
  Phiếu: CPP-20230601-015
  
Thống kê:
- Tổng: 2 người
- Tổng thời gian: 1 năm 7 tháng
```

---

## 5. MODULE 3: QUẢN LÝ HÓA ĐƠN

### 5.1. Workflow

**Quy trình:**
```
1. Thêm hóa đơn trước
   ↓
2. Upload files hóa đơn (PDF, Excel, Word, Images)
   ↓
3. Sau đó thêm tài sản
   ↓
4. Chọn hóa đơn từ dropdown

Rules:
- 1 hóa đơn → nhiều tài sản ✅
- 1 tài sản → 1 hóa đơn ✅
```

### 5.2. Thêm Hóa Đơn

**Form:**
```
┌────────────────────────────────────────────────┐
│ 📄 THÊM HÓA ĐƠN                                │
├────────────────────────────────────────────────┤
│ Số hóa đơn *      [HD____________]             │
│ Ngày hóa đơn *    [15/01/2026]                 │
│ Nhà cung cấp      [Apple Vietnam]              │
│ Tổng tiền         [100,000,000 VNĐ]            │
│ Mô tả             [____________]                │
│                                                │
│ UPLOAD FILE HÓA ĐƠN:                           │
│ ┌──────────────────────────────────────────┐  │
│ │ 📁 Kéo thả file hoặc click               │  │
│ │ Support: PDF, Excel, Word, Images        │  │
│ │ Max: 10MB/file, tối đa 5 files          │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Preview:                                       │
│ ✓ invoice.pdf (2.3 MB)         [✕]           │
│ ✓ receipt.jpg (1.1 MB)         [✕]           │
│ ✓ po.xlsx (450 KB)             [✕]           │
│                                                │
│                    [Hủy]  [Lưu Hóa Đơn]       │
└────────────────────────────────────────────────┘
```

**File Types Supported:**
- ✅ PDF (.pdf)
- ✅ Excel (.xlsx, .xls)
- ✅ Word (.docx, .doc)
- ✅ Images (.png, .jpg, .jpeg, .webp, .gif)

### 5.3. Danh Sách Hóa Đơn

```
┌──────────────────────────────────────────────────────────┐
│ 📄 QUẢN LÝ HÓA ĐƠN                     [+ Thêm Hóa Đơn] │
├──────────────────────────────────────────────────────────┤
│ 🔍 [______]  Từ: [___] Đến: [___]  NCC: [All ▼] [Tìm] │
│                                                          │
│ Số HĐ    Ngày       NCC          Tổng tiền   Files  TS │
│ ──────────────────────────────────────────────────────  │
│ HD001    10/01/26   Apple VN     100M        📎 3   2  │
│ HD002    11/01/26   Dell VN      50M         📎 2   3  │
│ HD003    12/01/26   Kingston     5M          📎 1   5  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 5.4. Chi Tiết Hóa Đơn

```
┌────────────────────────────────────────────────┐
│ 📄 HÓA ĐƠN HD001                               │
├────────────────────────────────────────────────┤
│ Số HĐ:        HD001                            │
│ Ngày:         15/01/2026                       │
│ NCC:          Apple Vietnam                    │
│ Tổng tiền:    100,000,000 VNĐ                  │
│                                                │
│ FILE ĐÍNH KÈM (3):                             │
│ 📎 invoice.pdf (2.3 MB)    [Xem] [Tải]       │
│ 📎 receipt.jpg (1.1 MB)    [Xem] [Tải]       │
│ 📎 po.xlsx (450 KB)        [Xem] [Tải]       │
│                                                │
│ TÀI SẢN LIÊN QUAN (2):                         │
│ • IT-LAP-001 - MacBook Pro 14" (50M)          │
│ • IT-LAP-002 - MacBook Pro 14" (50M)          │
│                                                │
│                      [Sửa]  [Xóa]             │
└────────────────────────────────────────────────┘
```

---

## 6. MODULE 4: BẢO TRÌ & SỬA CHỮA

### 6.1. Báo Cáo Hư Hỏng

**Form (Tất cả users):**
```
┌────────────────────────────────────────────────┐
│ 🔧 BÁO CÁO TÀI SẢN HƯ HỎNG                     │
├────────────────────────────────────────────────┤
│ Tài sản *         [IT-LAP-001 ▼]              │
│                   MacBook Pro 14"              │
│                                                │
│ Vấn đề *                                       │
│ ┌──────────────────────────────────────────┐  │
│ │ Màn hình bị vỡ khi vô tình làm rơi       │  │
│ │ Không hiển thị được gì                   │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Mức độ *          ○ Thấp  ○ TB  ⦿ Cao        │
│                                                │
│ Upload ảnh hư hỏng (required):                 │
│ [Upload images...] Max 5 ảnh                  │
│                                                │
│ Preview:                                       │
│ ┌────┐ ┌────┐                                 │
│ │img │ │img │  [+ Thêm]                       │
│ └────┘ └────┘                                  │
│                                                │
│                      [Gửi Báo Cáo]            │
└────────────────────────────────────────────────┘
```

**Actions:**
1. Create maintenance_history
2. Set asset.status = 'broken' (if priority high)
3. Upload evidence photos
4. Send notification to Admin/IT

### 6.2. Quản Lý Bảo Trì (Admin)

```
┌──────────────────────────────────────────────────────────┐
│ 🔧 DANH SÁCH BẢO TRÌ                                     │
├──────────────────────────────────────────────────────────┤
│ 🔍 [____]  Trạng thái: [Pending ▼]  Ưu tiên: [All ▼]   │
│                                                          │
│ Tài sản      Vấn đề         Người báo   Trạng thái  Ảnh│
│ ──────────────────────────────────────────────────────  │
│ IT-LAP-001   Screen broken   RV000330    Pending    📷 │
│ IT-MOU-023   Not working     RVA02259    In Progress📷 │
│ IT-KEY-015   Keys stuck      RVA02228    Completed  📷 │
└──────────────────────────────────────────────────────────┘
```

### 6.3. Cập Nhật Bảo Trì

```
┌────────────────────────────────────────────────┐
│ 🔧 CẬP NHẬT BẢO TRÌ                            │
├────────────────────────────────────────────────┤
│ Tài sản: IT-LAP-001                            │
│ Vấn đề: Screen broken                         │
│                                                │
│ Xem ảnh hư hỏng:                               │
│ ┌────┐ ┌────┐                                 │
│ │img │ │img │  [Xem full]                     │
│ └────┘ └────┘                                  │
│                                                │
│ Trạng thái *                                   │
│ ⦿ In Progress (Đang sửa)                      │
│ ○ Completed (Hoàn thành)                      │
│ ○ Cannot Fix (Không sửa được → Thanh lý)     │
│                                                │
│ Giải pháp                                      │
│ ┌──────────────────────────────────────────┐  │
│ │ Đã thay màn hình mới                     │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Upload ảnh sau sửa:                            │
│ [Upload images...]                             │
│                                                │
│ Chi phí (optional)  [2,000,000 VNĐ]           │
│                                                │
│           [Hủy]  [Cập Nhật]                   │
└────────────────────────────────────────────────┘
```

**Logic:**
- Completed → asset.status = 'available'
- Cannot Fix → Suggest thanh lý

---

## 7. MODULE 5: THANH LÝ THIẾT BỊ

### 7.1. Quy Trình Thanh Lý

**Trigger:**
- Tài sản hư hỏng không sửa được
- Tài sản quá cũ, lỗi thời
- Chi phí sửa > giá trị thiết bị

**Form:**
```
┌────────────────────────────────────────────────┐
│ 🗑️ THANH LÝ TÀI SẢN                           │
├────────────────────────────────────────────────┤
│ Tài sản: IT-LAP-045 - Dell Latitude           │
│ Trạng thái hiện tại: Broken 🔴                 │
│                                                │
│ Ngày thanh lý *   [15/01/2026]                │
│                                                │
│ Lý do thanh lý *                               │
│ ⦿ Hư hỏng không sửa được                       │
│ ○ Quá cũ, lỗi thời                            │
│ ○ Chi phí sửa > giá trị thiết bị              │
│ ○ Nâng cấp thiết bị mới                       │
│ ○ Khác                                         │
│                                                │
│ Mô tả chi tiết                                 │
│ ┌──────────────────────────────────────────┐  │
│ │ Màn hình vỡ hoàn toàn, bo mạch hư         │  │
│ │ Chi phí sửa 15M > giá trị còn lại        │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Giá thanh lý (nếu bán) [500,000 VNĐ]         │
│                                                │
│ Người phụ trách   [RV000001 ▼]                │
│                                                │
│ Upload chứng từ thanh lý (required):           │
│ [Upload files/images...]                       │
│                                                │
│ ⚠️ LƯU Ý:                                      │
│ • Không thể hoàn tác                           │
│ • Lịch sử vẫn được lưu                         │
│                                                │
│           [Hủy]  [Xác Nhận Thanh Lý]          │
└────────────────────────────────────────────────┘
```

**Actions:**
1. Update asset.status = 'disposed'
2. Set disposal_date, disposal_reason, disposal_price
3. Set disposed_by = current_admin
4. Upload disposal documents
5. current_user_employee_code = NULL
6. Insert asset_history (action = 'disposed')
7. Log to audit_log

---

## 8. MODULE 6: PHIẾU BÀN GIAO

### 8.1. Template Phiếu Bàn Giao

**Based on:** `/mnt/user-data/uploads/BB_BAN_GIAO_THIET_BI_2025.docx`

**Template Structure:**
```
┌─────────────────────────────────────────────────────────┐
│              CÔNG TY CỔ PHẦN REVER                      │
│                                                         │
│         PHIẾU BÀN GIAO TRANG THIẾT BỊ                   │
│                                                         │
│ Số hiệu: HCNS/FORM                                      │
│ Lần thứ: [Auto]                                        │
│ Ngày phát hành: [Auto - dd/mm/yyyy]                    │
│                                                         │
│ Hôm nay Ngày [dd] Tháng [mm] Năm [yyyy]               │
│                                                         │
│ Bên giao:                                               │
│ Họ và tên:  [Admin Full Name]                          │
│ Bộ phận:    [Admin Department]                         │
│                                                         │
│ Bên nhận:                                               │
│ Họ và tên:  [User Full Name]                           │
│ Bộ phận:    [User Department]                          │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ TÊN THIẾT BỊ | CHI TIẾT/CẤU HÌNH | TÌNH TRẠNG   │  │
│ ├───────────────────────────────────────────────────┤  │
│ │ 1/ Laptop    | MacBook Pro 14"    | New box      │  │
│ │              | M3 Pro, 32GB RAM   |              │  │
│ │              | Serial: FVFHG3456  |              │  │
│ │              |                    |              │  │
│ │ Ghi chú: [Notes]                                │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│                                                         │
│ Ký nhận bên giao              Ký nhận bên nhận          │
│                                                         │
│ _________________            _________________          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 8.2. Tự Động Tạo Phiếu

**Trigger:** Khi gán tài sản cho user

**Process:**
```
1. User click "Gán tài sản"
   ↓
2. Fill form gán tài sản
   ↓
3. Submit
   ↓
4. Backend:
   - Create allocation_slip record
   - Generate PDF từ template
   - Fill data:
     * Bên giao: Admin info
     * Bên nhận: User info
     * Tài sản: Asset details
     * Ngày: allocation_date
   - Upload PDF to Storage
   - Save PDF URL to DB
   ↓
5. Response to frontend:
   {
     success: true,
     allocation_slip: {
       slip_number: "CPP-20260115-001",
       pdf_url: "https://...pdf"
     }
   }
   ↓
6. Frontend show success:
   "✅ Gán tài sản thành công!
    Phiếu bàn giao: CPP-20260115-001
    [📄 Tải phiếu] [📧 Gửi email]"
```

### 8.3. Xem Danh Sách Phiếu

```
┌──────────────────────────────────────────────────────────┐
│ 📋 DANH SÁCH PHIẾU BÀN GIAO                              │
├──────────────────────────────────────────────────────────┤
│ 🔍 [____]  Từ: [___] Đến: [___]  User: [All ▼] [Tìm]  │
│                                                          │
│ Số phiếu         Ngày      Người nhận      Tài sản      │
│ ──────────────────────────────────────────────────────  │
│ CPP-20260115-001 15/01/26  RV000330       IT-LAP-001   │
│                            Trần Thị Nhung  [Xem] [PDF] │
│                                                          │
│ CPP-20260114-002 14/01/26  RVA02259       IT-LAP-002   │
│                            Nguyễn Anh     [Xem] [PDF]  │
└──────────────────────────────────────────────────────────┘
```

### 8.4. Chi Tiết Phiếu

```
┌────────────────────────────────────────────────┐
│ 📋 PHIẾU BÀN GIAO CPP-20260115-001             │
├────────────────────────────────────────────────┤
│ Ngày bàn giao: 15/01/2026                      │
│                                                │
│ BÊN GIAO:                                      │
│ Lê Hồng Lĩnh (RV000001)                       │
│ IT Support Executive                           │
│                                                │
│ BÊN NHẬN:                                      │
│ Trần Thị Ngọc Nhung (RV000330)                │
│ Project Management                             │
│                                                │
│ TÀI SẢN:                                       │
│ IT-LAP-001 - MacBook Pro 14"                   │
│ M3 Pro, 32GB RAM, 1TB SSD                      │
│ Serial: FVFHG3456                              │
│ Tình trạng: New box                            │
│                                                │
│ ẢNH BÀN GIAO (3):                              │
│ ┌────┐ ┌────┐ ┌────┐                          │
│ │img │ │img │ │img │  [Xem tất cả]            │
│ └────┘ └────┘ └────┘                          │
│                                                │
│                 [Tải PDF]  [In]  [Email]      │
└────────────────────────────────────────────────┘
```

---

## 9. MODULE 7: BÁO CÁO & DASHBOARD

### 9.1. Dashboard Tùy Chỉnh

**Charts Available:**

1. **Tài sản theo phòng ban**
   - Type: Bar / Pie / Line
   - Data: Count by department
   
2. **Tài sản theo trạng thái**
   - Type: Bar / Pie
   - Data: Count by status
   
3. **Tài sản theo thời gian**
   - Type: Line / Bar
   - Data: Assets added over months
   
4. **Tài sản theo loại**
   - Type: Pie / Bar
   - Data: Count by category

**Tùy chỉnh:**
- Click vào chart type selector
- Chọn: ○ Bar  ○ Pie  ○ Line
- Auto-save preference per user
- Responsive & interactive

### 9.2. Báo Cáo

**Danh sách báo cáo:**

1. ✅ Báo cáo tài sản theo phòng ban
2. ✅ Báo cáo tài sản theo người dùng
3. ✅ Báo cáo tình trạng tài sản
4. ✅ Báo cáo tài sản sắp hết bảo hành
5. ✅ Báo cáo tài sản hư hỏng
6. ✅ Báo cáo tài sản đã thanh lý
7. ✅ Báo cáo lịch sử bảo trì
8. ✅ Báo cáo phiếu bàn giao

**Export formats:** Excel, PDF, CSV

---

## 10. DATABASE SCHEMA

### 10.1. Core Tables

```sql
-- 1. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone VARCHAR(20),
  department VARCHAR(100) DEFAULT 'General',
  team VARCHAR(100) DEFAULT 'Unassigned',
  location VARCHAR(50),
  report_to VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' 
    CHECK (role IN ('admin_it', 'accountant', 'dev', 'user')),
  status VARCHAR(20) DEFAULT 'active' 
    CHECK (status IN ('active', 'inactive', 'resigned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INVOICES
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  supplier VARCHAR(200),
  total_amount NUMERIC(15, 2),
  description TEXT,
  file_urls TEXT[], -- Array of file URLs from Storage
  created_by VARCHAR(20) REFERENCES users(employee_code),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSETS
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_code VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  model VARCHAR(100),
  color VARCHAR(50),
  serial_number VARCHAR(100),
  
  -- Purchase info
  invoice_id UUID REFERENCES invoices(id), -- Link to invoice
  purchase_price NUMERIC(15, 2),
  purchase_date DATE,
  
  -- Warranty
  warranty_period INTEGER, -- months
  warranty_expiry_date DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'available' 
    CHECK (status IN ('available', 'in_use', 'maintenance', 'broken', 'disposed')),
  current_user_employee_code VARCHAR(20) REFERENCES users(employee_code),
  
  -- Images
  image_urls TEXT[], -- Array of image URLs
  
  -- Disposal info
  disposal_date DATE,
  disposal_reason TEXT,
  disposal_price NUMERIC(15, 2),
  disposed_by VARCHAR(20) REFERENCES users(employee_code),
  disposal_documents TEXT[], -- Array of document URLs
  
  -- Metadata
  location VARCHAR(100),
  notes TEXT,
  created_by VARCHAR(20) REFERENCES users(employee_code),
  updated_by VARCHAR(20) REFERENCES users(employee_code),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_one_user_per_asset CHECK (
    (status = 'in_use' AND current_user_employee_code IS NOT NULL) OR
    (status != 'in_use')
  )
);

-- 4. ASSET_HISTORY
CREATE TABLE asset_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  user_employee_code VARCHAR(20) REFERENCES users(employee_code),
  action_type VARCHAR(20) NOT NULL 
    CHECK (action_type IN ('assigned', 'returned', 'transferred', 'maintenance', 'disposed')),
  from_date DATE NOT NULL,
  to_date DATE,
  notes TEXT,
  created_by VARCHAR(20) REFERENCES users(employee_code),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ALLOCATION_SLIPS (Phiếu bàn giao)
CREATE TABLE allocation_slips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slip_number VARCHAR(50) UNIQUE NOT NULL, -- CPP-YYYYMMDD-XXX
  asset_id UUID REFERENCES assets(id),
  employee_code VARCHAR(20) REFERENCES users(employee_code),
  allocation_date DATE NOT NULL,
  issued_by VARCHAR(20) REFERENCES users(employee_code), -- Admin
  pdf_url TEXT, -- Generated PDF URL
  evidence_urls TEXT[], -- Photos of handover
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RETURN_SLIPS (Phiếu thu hồi)
CREATE TABLE return_slips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slip_number VARCHAR(50) UNIQUE NOT NULL, -- PTH-YYYYMMDD-XXX
  asset_id UUID REFERENCES assets(id),
  employee_code VARCHAR(20) REFERENCES users(employee_code),
  return_date DATE NOT NULL,
  condition VARCHAR(50), -- Tình trạng khi thu hồi
  notes TEXT,
  received_by VARCHAR(20) REFERENCES users(employee_code), -- Admin
  file_url TEXT, -- Imported file
  evidence_urls TEXT[], -- Photos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MAINTENANCE_HISTORY
CREATE TABLE maintenance_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  reported_by_employee_code VARCHAR(20) REFERENCES users(employee_code),
  maintenance_date DATE NOT NULL,
  issue_description TEXT NOT NULL,
  solution TEXT,
  cost NUMERIC(15, 2),
  technician_employee_code VARCHAR(20) REFERENCES users(employee_code),
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'in_progress', 'completed', 'cannot_fix')),
  evidence_urls TEXT[], -- Photos of issue and after fix
  created_by VARCHAR(20) REFERENCES users(employee_code),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. USER_PREFERENCES
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code VARCHAR(20) UNIQUE REFERENCES users(employee_code),
  chart_preferences JSONB DEFAULT '{
    "assets_by_department": {"type": "pie"},
    "assets_by_status": {"type": "bar"},
    "assets_over_time": {"type": "line"},
    "assets_by_category": {"type": "pie"}
  }',
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'vi',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT_LOG
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name VARCHAR(50) NOT NULL,
  record_id VARCHAR(50) NOT NULL,
  action_type VARCHAR(20) NOT NULL 
    CHECK (action_type IN ('insert', 'update', 'delete')),
  actor_employee_code VARCHAR(20) REFERENCES users(employee_code),
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10.2. Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_code ON users(employee_code);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_status ON users(status);

-- Invoices
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);

-- Assets
CREATE INDEX idx_assets_code ON assets(asset_code);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_current_user ON assets(current_user_employee_code);
CREATE INDEX idx_assets_invoice ON assets(invoice_id);
CREATE INDEX idx_assets_disposal_date ON assets(disposal_date) 
  WHERE disposal_date IS NOT NULL;

-- Asset History
CREATE INDEX idx_asset_history_asset ON asset_history(asset_id);
CREATE INDEX idx_asset_history_user ON asset_history(user_employee_code);
CREATE INDEX idx_asset_history_dates ON asset_history(from_date, to_date);

-- Allocation & Return Slips
CREATE INDEX idx_allocation_slips_number ON allocation_slips(slip_number);
CREATE INDEX idx_allocation_slips_employee ON allocation_slips(employee_code);
CREATE INDEX idx_return_slips_number ON return_slips(slip_number);
CREATE INDEX idx_return_slips_employee ON return_slips(employee_code);

-- Maintenance
CREATE INDEX idx_maintenance_asset ON maintenance_history(asset_id);
CREATE INDEX idx_maintenance_status ON maintenance_history(status);

-- Audit Log
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_employee_code);
CREATE INDEX idx_audit_log_date ON audit_log(created_at);
```

### 10.3. Views

```sql
-- View: Assets with user info
CREATE OR REPLACE VIEW v_assets_with_users AS
SELECT 
  a.*,
  u.full_name as current_user_name,
  u.email as current_user_email,
  u.department as current_user_department,
  u.status as current_user_status,
  i.invoice_number,
  i.supplier
FROM assets a
LEFT JOIN users u ON a.current_user_employee_code = u.employee_code
LEFT JOIN invoices i ON a.invoice_id = i.id;

-- View: Asset history with user names
CREATE OR REPLACE VIEW v_asset_history_with_users AS
SELECT 
  ah.*,
  u.full_name as user_full_name,
  u.email as user_email,
  u.department as user_department,
  u.status as user_status,
  a.asset_code,
  a.product_name,
  a.status as asset_status
FROM asset_history ah
LEFT JOIN users u ON ah.user_employee_code = u.employee_code
LEFT JOIN assets a ON ah.asset_id = a.id;

-- View: Assets expiring warranty
CREATE OR REPLACE VIEW v_assets_expiring_warranty AS
SELECT 
  a.*,
  u.full_name as current_user_name,
  u.email as current_user_email,
  a.warranty_expiry_date - CURRENT_DATE as days_until_expiry
FROM assets a
LEFT JOIN users u ON a.current_user_employee_code = u.employee_code
WHERE a.warranty_expiry_date IS NOT NULL
  AND a.warranty_expiry_date <= CURRENT_DATE + INTERVAL '30 days'
  AND a.warranty_expiry_date > CURRENT_DATE
  AND a.status IN ('available', 'in_use');

-- View: Broken assets needing action
CREATE OR REPLACE VIEW v_broken_assets_pending AS
SELECT 
  a.*,
  m.issue_description,
  m.reported_by_employee_code,
  u.full_name as reported_by_name,
  m.created_at as reported_date
FROM assets a
JOIN maintenance_history m ON a.id = m.asset_id
LEFT JOIN users u ON m.reported_by_employee_code = u.employee_code
WHERE a.status = 'broken'
  AND m.status = 'pending'
ORDER BY m.created_at ASC;
```

### 10.4. Functions

```sql
-- Auto-generate allocation slip number
CREATE OR REPLACE FUNCTION generate_allocation_slip_number()
RETURNS VARCHAR AS $$
DECLARE
  date_prefix VARCHAR;
  next_number INTEGER;
  new_code VARCHAR;
BEGIN
  date_prefix := 'CPP-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-';
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(slip_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM allocation_slips
  WHERE slip_number LIKE date_prefix || '%';
  
  new_code := date_prefix || LPAD(next_number::TEXT, 3, '0');
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate return slip number
CREATE OR REPLACE FUNCTION generate_return_slip_number()
RETURNS VARCHAR AS $$
DECLARE
  date_prefix VARCHAR;
  next_number INTEGER;
  new_code VARCHAR;
BEGIN
  date_prefix := 'PTH-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-';
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(slip_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM return_slips
  WHERE slip_number LIKE date_prefix || '%';
  
  new_code := date_prefix || LPAD(next_number::TEXT, 3, '0');
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;
```

---

## 11. API ENDPOINTS

### 11.1. Authentication

```javascript
POST /api/auth/google         // Google OAuth login
GET  /api/auth/session        // Get current session
POST /api/auth/logout         // Logout
```

### 11.2. Users

```javascript
GET    /api/users                       // List with filters
GET    /api/users/:employee_code        // Get single
POST   /api/users                       // Create
PUT    /api/users/:employee_code        // Update
DELETE /api/users/:employee_code        // Delete (soft)
POST   /api/users/bulk-update           // Bulk actions

// History
GET    /api/users/:code/asset-history   // User's asset timeline
GET    /api/users/:code/preferences     // Get preferences
PUT    /api/users/:code/preferences     // Update preferences
```

### 11.3. Invoices

```javascript
GET    /api/invoices                    // List with filters
GET    /api/invoices/:invoice_number    // Get single
POST   /api/invoices                    // Create with files upload
PUT    /api/invoices/:invoice_number    // Update
DELETE /api/invoices/:invoice_number    // Delete

// Files
GET    /api/invoices/:number/files/:filename  // Download file

// For dropdown in asset form
GET    /api/invoices?format=dropdown    // Simplified list
```

### 11.4. Assets

```javascript
GET    /api/assets                      // List with filters
GET    /api/assets/:asset_code          // Get single
POST   /api/assets                      // Create (requires invoice_id)
PUT    /api/assets/:asset_code          // Update
DELETE /api/assets/:asset_code          // Delete

// Assignment
POST   /api/assets/:code/assign         // Assign (+ auto slip)
POST   /api/assets/:code/return         // Return
POST   /api/assets/:code/transfer       // Transfer
POST   /api/assets/:code/dispose        // Dispose

// Images
POST   /api/assets/:code/images         // Upload images
GET    /api/assets/:code/images         // List images
DELETE /api/assets/:code/images/:id     // Delete image

// History
GET    /api/assets/:code/history        // Usage history
GET    /api/assets/:code/user-history   // User timeline
```

### 11.5. Allocation Slips (Phiếu Bàn Giao)

```javascript
GET    /api/allocation-slips            // List with filters
GET    /api/allocation-slips/:number    // Get single
GET    /api/allocation-slips/:number/download  // Download PDF
POST   /api/allocation-slips/:number/evidence  // Upload photos
```

### 11.6. Return Slips (Phiếu Thu Hồi)

```javascript
GET    /api/return-slips                // List
GET    /api/return-slips/:number        // Get single
POST   /api/return-slips/import         // Import file
GET    /api/return-slips/:number/download  // Download PDF
```

### 11.7. Maintenance

```javascript
GET    /api/maintenance                 // List with filters
POST   /api/maintenance                 // Report issue
PUT    /api/maintenance/:id             // Update
PATCH  /api/maintenance/:id/status      // Update status only
POST   /api/maintenance/:id/evidence    // Upload photos
```

### 11.8. Dashboard & Reports

```javascript
GET    /api/dashboard                   // Dashboard data
POST   /api/reports/generate            // Generate report
GET    /api/reports/:id/download        // Download report
```

---

## 12. UI/UX GUIDELINES

### 12.1. Color Scheme

```css
/* Status Colors */
--available: #10b981;      /* Green */
--in-use: #3b82f6;         /* Blue */
--maintenance: #f59e0b;    /* Orange */
--broken: #ef4444;         /* Red */
--disposed: #78716c;       /* Brown/Gray */

/* Primary */
--primary: #2563eb;
--primary-dark: #1e40af;
--primary-light: #dbeafe;

/* Chart Colors */
--chart-1: #3b82f6;
--chart-2: #10b981;
--chart-3: #f59e0b;
--chart-4: #8b5cf6;
--chart-5: #ec4899;
```

### 12.2. Typography

```css
font-family: 'Inter', sans-serif;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

### 12.3. Components

**Button Sizes:**
- Small: 32px height
- Medium: 40px height
- Large: 48px height

**Input Fields:**
- Height: 40px
- Border-radius: 6px
- Focus ring: 2px primary color

**Cards:**
- Border-radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 20px

### 12.4. Responsive Breakpoints

```css
--sm: 640px;
--md: 768px;
--lg: 1024px;
--xl: 1280px;
--2xl: 1536px;
```

---

## 13. SUPABASE STORAGE STRUCTURE

```
Buckets:

1. invoice-files/           (Public)
   ├── HD001/
   │   ├── invoice.pdf
   │   ├── receipt.jpg
   │   └── po.xlsx
   └── HD002/

2. asset-images/            (Public)
   ├── IT-LAP-001/
   │   ├── photo_front.jpg
   │   ├── photo_back.jpg
   │   └── serial.jpg
   └── IT-LAP-002/

3. allocation-slips/        (Private)
   ├── CPP-20260115-001.pdf
   └── CPP-20260115-002.pdf

4. return-slips/            (Private)
   ├── PTH-20260115-001.pdf
   └── imported_slip.pdf

5. disposal-documents/      (Private)
   ├── IT-LAP-045/
   │   ├── disposal_form.pdf
   │   └── photo.jpg
   └── IT-LAP-046/

6. evidence-photos/         (Private)
   ├── allocation/
   │   └── CPP-20260115-001/
   │       ├── handover_1.jpg
   │       └── handover_2.jpg
   ├── return/
   │   └── PTH-20260115-001/
   │       └── condition.jpg
   └── maintenance/
       └── MAINT-001/
           ├── before_1.jpg
           ├── before_2.jpg
           └── after_1.jpg
```

---

## 14. SECURITY & PERFORMANCE

### 14.1. Security

**Authentication:**
- Google OAuth only (@rever.vn)
- JWT with custom claims (role, employee_code)
- Session timeout: 8 hours

**Authorization:**
- Row Level Security (RLS) policies
- Role-based access control
- API endpoint permissions

**Data Protection:**
- HTTPS only
- Input sanitization
- SQL injection prevention
- XSS prevention
- CSRF tokens

### 14.2. Performance

**Frontend:**
- Code splitting
- Lazy loading
- Image optimization
- Bundle size < 500KB (gzipped)

**Backend:**
- Database indexes
- Query optimization
- Caching (React Query)
- Rate limiting

**Targets:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- API response < 200ms (P95)

---

## 15. DEPLOYMENT

### 15.1. Environments

```
Development → Staging → Production

Dev:     Local (localhost:5173)
Staging: staging.rever-assets.vercel.app
Prod:    assets.rever.vn
```

### 15.2. CI/CD

```
GitHub → GitHub Actions → Vercel

On push to main:
  - Run tests
  - Build
  - Deploy to staging

On release tag:
  - Deploy to production
```

---

**END OF REQUIREMENTS DOCUMENT**

Version: 1.0 Final  
Date: 13/01/2026  
Pages: 80+  
Status: Ready for Development
