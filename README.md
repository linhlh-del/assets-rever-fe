# Rever IT Asset Management — Frontend

> **Project:** rever-website-manage-asset-it  
> **Stack:** React 18 + Vite 5 + TailwindCSS 3.4  
> **Backend:** Express.js (VPS) + Supabase (Auth & Storage)  
> **Last updated:** 19/06/2026

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc](#2-kiến-trúc)
3. [Cài đặt & chạy dự án](#3-cài-đặt--chạy-dự-án)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [Công nghệ sử dụng](#5-công-nghệ-sử-dụng)
6. [Phân quyền](#6-phân-quyền)
7. [Modules & tính năng](#7-modules--tính-năng)
8. [API Service Layer](#8-api-service-layer)
9. [Responsive Design](#9-responsive-design)
10. [Trạng thái hiện tại & lộ trình](#10-trạng-thái-hiện-tại--lộ-trình)
11. [Triển khai](#11-triển-khai)

---

## 1. Tổng quan hệ thống

Hệ thống quản lý tài sản IT nội bộ của Rever, hỗ trợ:

- Quản lý người dùng (CRUD, phân quyền, bulk actions)
- Quản lý thiết bị IT (laptop, màn hình, phụ kiện…)
- Quản lý hóa đơn (PDF, Excel, Word, Images)
- Phiếu bàn giao thiết bị tự động (sinh PDF có QR code)
- Theo dõi lịch sử sử dụng đầy đủ
- Bảo trì và sửa chữa
- Thanh lý thiết bị
- Dashboard thống kê & báo cáo xuất Excel/PDF

**Đối tượng sử dụng:** Nhân viên Rever đăng nhập bằng Google OAuth (`@rever.vn`).

---

## 2. Kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER / FE                             │
│              React + Vite (Vercel)                          │
└──────────┬──────────────────────────┬───────────────────────┘
           │                          │
           │ Google OAuth             │ API calls (Bearer JWT)
           │ (login only)             │
           ▼                          ▼
┌─────────────────────┐   ┌──────────────────────────────────┐
│   SUPABASE (Free)   │   │     EXPRESS BE (VPS :3000)       │
│                     │   │                                  │
│  ✅ Auth            │   │  1. Verify JWT → Supabase        │
│  ✅ Google OAuth    │   │  2. Lookup user → VPS Postgres   │
│  ✅ Storage buckets │   │  3. Business logic               │
│  ✅ JWT issuance    │   │  4. Upload files → Supabase      │
│                     │   │     Storage                      │
│  ❌ Business DB     │   │                                  │
└─────────────────────┘   └──────────────┬───────────────────┘
                                         │
                                         ▼
                          ┌──────────────────────────────────┐
                          │   VPS POSTGRESQL (localhost:5432) │
                          │   db: rever_assets               │
                          │  ✅ Tất cả business tables       │
                          └──────────────────────────────────┘
```

**Lưu ý quan trọng:**
- Supabase chỉ dùng cho **Auth + Storage** — không có business tables ở đây.
- Toàn bộ dữ liệu nghiệp vụ nằm trên **VPS Postgres**, chỉ truy cập được qua Express BE.
- FE **không bao giờ** gọi `supabase.from(...)` cho dữ liệu nghiệp vụ — luôn dùng `apiClient` → Express BE.

---

## 3. Cài đặt & chạy dự án

### Yêu cầu

- Node.js >= 18
- npm >= 9

### Cài đặt

```bash
cd fe
npm install

# Nếu thiếu packages cho PDF & Excel:
npm install xlsx qrcode html2canvas jspdf-autotable
```

### Biến môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Nội dung `.env`:

```bash
# Supabase (chỉ dùng cho Auth & Storage)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Backend Express trên VPS
VITE_API_URL=http://localhost:3000

# App
VITE_APP_NAME=Rever IT Assets
```

### Chạy development

```bash
npm run dev
# http://localhost:5173
```

### Build production

```bash
npm run build
npm run preview
```

---

## 4. Cấu trúc thư mục

```
fe/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── common/                 # Base components tái sử dụng
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Empty.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── ResponsiveTable.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MobileSidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Breadcrumb.jsx
│   │   ├── users/                  # 8 components
│   │   │   ├── UserForm.jsx
│   │   │   ├── UsersList.jsx
│   │   │   ├── UserFilters.jsx
│   │   │   ├── BulkActionsBar.jsx
│   │   │   ├── UserDetailModal.jsx
│   │   │   ├── AddUserModal.jsx
│   │   │   ├── EditUserModal.jsx
│   │   │   ├── DeleteUserDialog.jsx
│   │   │   └── index.js
│   │   ├── assets/                 # 8 components
│   │   │   ├── AssetForm.jsx
│   │   │   ├── AssetsList.jsx
│   │   │   ├── AssetFilters.jsx
│   │   │   ├── AssignAssetModal.jsx
│   │   │   ├── ReturnAssetModal.jsx
│   │   │   ├── AssetImages.jsx
│   │   │   ├── AddAssetModal.jsx
│   │   │   ├── EditAssetModal.jsx
│   │   │   └── index.js
│   │   ├── invoices/               # 7 components
│   │   │   ├── InvoiceForm.jsx
│   │   │   ├── InvoiceFilters.jsx
│   │   │   ├── InvoicesList.jsx
│   │   │   ├── InvoiceDetailModal.jsx
│   │   │   ├── FileViewer.jsx
│   │   │   ├── InvoiceFileUpload.jsx
│   │   │   ├── AddInvoiceModal.jsx
│   │   │   └── index.js
│   │   ├── maintenance/            # 4 components
│   │   │   ├── MaintenanceForm.jsx
│   │   │   ├── MaintenanceFilters.jsx
│   │   │   ├── MaintenanceList.jsx
│   │   │   ├── MaintenanceDetailModal.jsx
│   │   │   └── index.js
│   │   └── dashboard/
│   │       ├── StatCard.jsx
│   │       └── CustomizableChart.jsx
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx         # Google OAuth + BE sync + cache 5 phút
│   │
│   ├── hooks/                      # 30+ custom hooks
│   │   ├── useAuth.js
│   │   ├── useAssets.js            # ✅ Gọi đúng Express BE
│   │   ├── useUsers.js             # ⚠️ Cần rewrite → apiClient
│   │   ├── useInvoices.js          # ⚠️ Cần rewrite → apiClient
│   │   ├── useMaintenance.js       # ⚠️ Cần rewrite → apiClient
│   │   ├── useReports.js           # ⚠️ Cần rewrite → apiClient
│   │   ├── usePermission.js
│   │   ├── useResponsive.js
│   │   ├── useDebounce.js
│   │   └── usePagination.js
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UsersPage.jsx
│   │   ├── AssetsPage.jsx
│   │   ├── AssetDetailPage.jsx
│   │   ├── InvoicesPage.jsx
│   │   ├── MaintenancePage.jsx
│   │   ├── ReportsPage.jsx         # ⚠️ Hiện là mockup tĩnh
│   │   ├── ProfilePage.jsx         # ⚠️ Chưa implement
│   │   └── SettingsPage.jsx
│   │
│   ├── services/
│   │   ├── api.js                  # apiClient với Bearer JWT + retry-once
│   │   ├── userService.js          # ⚠️ Đang gọi Supabase trực tiếp
│   │   ├── assetService.js         # Có 2 phiên bản — dùng hooks/useAssets.js
│   │   ├── invoiceService.js       # ⚠️ Đang gọi Supabase trực tiếp
│   │   ├── maintenanceService.js   # ⚠️ Đang gọi Supabase trực tiếp
│   │   ├── reportService.js        # ⚠️ Đang gọi Supabase trực tiếp
│   │   └── slipService.js          # ⚠️ Gọi bảng không tồn tại
│   │
│   ├── stores/
│   │   └── index.js                # Zustand: auth, ui, preferences
│   │
│   ├── utils/
│   │   ├── cn.js                   # clsx + tailwind-merge
│   │   ├── formatters.js           # Currency, date, filesize, phone
│   │   ├── constants.js            # ⚠️ ROLES cần đồng bộ với VPS schema
│   │   ├── permissions.js          # ⚠️ Phụ thuộc vào ROLES cũ
│   │   ├── exportUtils.js          # Excel, CSV, PDF export
│   │   ├── pdfGenerators.js        # ⚠️ Lỗi require() trong 2 hàm
│   │   └── responsive.js
│   │
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx                  # ⚠️ roles[] dùng tên cũ
│
├── .env.example
├── .gitignore                      # ⚠️ Có git conflict chưa resolve
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 5. Công nghệ sử dụng

| Thành phần | Thư viện | Phiên bản |
|---|---|---|
| UI framework | React | 18.2 |
| Build tool | Vite | 5.0 |
| Styling | TailwindCSS | 3.4 |
| Routing | React Router | v6 |
| Server state | TanStack React Query | v5 |
| Client state | Zustand | 4 |
| Forms | React Hook Form + Zod | 7 + 3 |
| HTTP client | Supabase JS (Auth only) + fetch | 2.39 |
| Icons | lucide-react | latest |
| Toast | Sonner | latest |
| Charts | Recharts | 2.10 |
| File upload | react-dropzone | 14 |
| Date utility | date-fns | 3 |
| PDF generation | jsPDF + jsPDF-autotable | 2.5 |
| Excel export | XLSX (SheetJS) | latest |
| QR code | qrcode | latest |
| Class utility | clsx + tailwind-merge | latest |

---

## 6. Phân quyền

### Roles thực tế trên VPS (nguồn đúng)

```
super_admin  →  Toàn quyền hệ thống
it_admin     →  Quản lý assets, users, maintenance, invoices
manager      →  Xem reports, approve handover
user         →  Xem assets của mình, tạo maintenance ticket
```

> ⚠️ **Quan trọng:** File `src/utils/constants.js` hiện đang dùng tên roles cũ (`admin_it`, `accountant`, `dev`, `user`). Cần đồng bộ ngay với tên thật trên VPS trước khi tiếp tục phát triển.

### Ma trận quyền

| Tính năng | super_admin | it_admin | manager | user |
|---|---|---|---|---|
| CRUD users | ✅ | ✅ | ❌ | ❌ |
| Xem assets | ✅ | ✅ | ✅ | Chỉ của mình |
| CRUD assets | ✅ | ✅ | ❌ | ❌ |
| Gán/thu hồi tài sản | ✅ | ✅ | ❌ | ❌ |
| Tạo phiếu bàn giao | ✅ | ✅ | ❌ | ❌ |
| CRUD invoices | ✅ | ✅ | ❌ | ❌ |
| Xem invoices | ✅ | ✅ | ✅ | ❌ |
| Tạo maintenance ticket | ✅ | ✅ | ✅ | ✅ |
| Cập nhật maintenance | ✅ | ✅ | ✅ | ❌ |
| Xem reports | ✅ | ✅ | ✅ | Giới hạn |
| Xuất reports | ✅ | ✅ | ✅ | ❌ |

### Authentication flow

```
1. User click "Đăng nhập với Google"
2. Supabase Google OAuth (@rever.vn only)
3. Supabase cấp JWT
4. FE gọi GET /api/auth/me với Bearer JWT
5. BE verify JWT → lookup user trong VPS Postgres
6. BE trả về profile (employee_code, role, department_id…)
7. FE cache profile vào sessionStorage (5 phút)
```

---

## 7. Modules & tính năng

### 7.1 Dashboard

**File:** `src/pages/DashboardPage.jsx`

**Tính năng:**
- 6 stat cards: tổng assets, đang sử dụng, có sẵn, bảo trì, hư hỏng, thanh lý
- 4 charts tùy chỉnh (Pie/Bar/Line) qua Recharts
- Widget: assets sắp hết bảo hành (30 ngày tới)
- Widget: assets hư hỏng cần xử lý
- Lưu preferences vào Zustand + localStorage
- Role `user` chỉ thấy tài sản cá nhân

**Bug hiện tại:** `dashboardService.js` thiếu prefix `/api` → API call luôn thất bại.

---

### 7.2 Users — Quản lý người dùng

**Pages:** `src/pages/UsersPage.jsx`

**Tính năng:**
- Danh sách users với search, filter (department, role, status), pagination
- Thêm/sửa/xoá user (soft delete → status `resigned`)
- Bulk actions: đổi department, đổi status, export Excel, xoá hàng loạt
- Xem lịch sử tài sản của từng user
- Form validation với Zod

**API endpoints sử dụng:**

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/users` | Danh sách, filter + pagination |
| GET | `/api/users/:employeeCode` | Chi tiết user |
| POST | `/api/users` | Tạo user mới |
| PUT | `/api/users/:employeeCode` | Cập nhật |
| DELETE | `/api/users/:employeeCode` | Soft delete |
| GET | `/api/users/:employeeCode/assets` | Assets đang dùng |

**Lưu ý schema:**
- `department` là `department_id` (UUID FK) — không phải text
- `job_title_id` (UUID FK) — cần dropdown từ `/api/job-titles`
- Không có cột `team`, `location` riêng

---

### 7.3 Assets — Quản lý tài sản

**Pages:** `src/pages/AssetsPage.jsx`, `src/pages/AssetDetailPage.jsx`

**Tính năng:**
- Danh sách assets: search, filter (category, status, department), pagination
- Thêm/sửa/xoá asset (phải link với invoice)
- Gán tài sản → tự động sinh phiếu bàn giao PDF có QR code
- Thu hồi tài sản → đóng asset_history
- Gallery ảnh: drag-drop upload, preview, download (Supabase Storage)
- Audit trail: toàn bộ lịch sử bàn giao/thu hồi
- Warranty tracking + cảnh báo hết hạn (30 ngày)
- Thanh lý tài sản

**Asset categories (13 giá trị CHECK constraint VPS):**

```
laptop, desktop, monitor, keyboard, mouse,
headphone, webcam, phone, tablet, printer,
network, server, other
```

**Asset statuses:**

| Status | Label | Màu |
|---|---|---|
| `available` | Có sẵn | Xanh lá |
| `in_use` | Đang sử dụng | Xanh dương |
| `maintenance` | Đang bảo trì | Vàng |
| `broken` | Hư hỏng | Đỏ |
| `disposed` | Đã thanh lý | Xám |

**Handover slip (phiếu bàn giao):**
- Bảng `handover_slips` + `handover_slip_items` (nhiều asset/phiếu)
- `slip_type`: `handover` | `return` | `transfer`
- `status`: `draft` | `generated` | `signed`
- Sinh DOCX/PDF với logo Rever, thông tin bên giao/nhận, bảng tài sản, QR code, chữ ký

---

### 7.4 Invoices — Quản lý hóa đơn

**Pages:** `src/pages/InvoicesPage.jsx`

**Tính năng:**
- Danh sách hóa đơn với search, filter
- Tạo/sửa hóa đơn
- Upload nhiều file: PDF, Excel, Word, Images (max 5 file, 10MB/file)
- Xem file: PDF (iframe), Images (trực tiếp), Office (download)
- 1 hóa đơn → nhiều tài sản; 1 tài sản → 1 hóa đơn

**Lưu ý:** DB thực tế không có cột `status` trong `invoices`. Cần xác nhận với BE trước khi dùng các status `pending/confirmed/processed`.

---

### 7.5 Maintenance — Bảo trì

**Pages:** `src/pages/MaintenancePage.jsx`

**Tính năng:**
- Tạo ticket bảo trì (mọi role đều có thể)
- Priority: `low` | `medium` | `high` | `critical`
- Status flow: `pending` → `in_progress` → `completed` | `cannot_fix`
- Giao cho kỹ thuật viên, ghi chú giải quyết
- Upload ảnh trước/sau sửa chữa (`file_phase`: `before` | `after`)

**Bảng DB:** `maintenance_tickets` + `maintenance_evidence_files`

---

### 7.6 Reports — Báo cáo

**Pages:** `src/pages/ReportsPage.jsx`

Hiện tại là **mockup tĩnh** — chưa nối API.

**API endpoints cần nối:**

| Endpoint | Mô tả |
|---|---|
| POST `/api/reports/assets` | Báo cáo tài sản |
| POST `/api/reports/maintenance` | Báo cáo bảo trì |
| POST `/api/reports/users` | Báo cáo người dùng |

**Export:** Excel (`.xlsx`), CSV, PDF

---

### 7.7 Settings & Profile

- `SettingsPage.jsx`: Theme toggle, notification preferences, đổi password (qua Supabase Auth)
- `ProfilePage.jsx`: Chưa implement (placeholder)
- Bảng `user_preferences` trên VPS: `theme` (`light`/`dark`)

---

## 8. API Service Layer

### Pattern chuẩn (dùng apiClient)

```js
// src/services/api.js
const apiClient = async (url, options = {}) => {
  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token

  const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (response.status === 401) {
    // retry-once sau khi refresh token
    await supabase.auth.refreshSession()
    // ... retry
  }

  if (!response.ok) throw new Error(await response.text())
  return response.json()
}
```

### Hooks đã đúng kiến trúc

```js
// hooks/useAssets.js — pattern chuẩn
const { data } = useQuery({
  queryKey: ['assets', filters],
  queryFn: () => apiClient(`/api/assets?${new URLSearchParams(filters)}`),
})
```

### React Query configuration

```js
// App.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 phút
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

**Stale times:**
- Users, Assets, Invoices: 5 phút
- Maintenance: 5 phút
- Reports, Summary: 10–30 phút

### Export utilities

```js
// utils/exportUtils.js
exportToExcel(data, fileName, sheetName)
exportToCSV(data, fileName)
exportToPDF(data, columns, fileName, title)
exportMultiSheetExcel(sheets, fileName)

// utils/pdfGenerators.js
generateAssetTransferSlip(slipData)  // Phiếu bàn giao với QR code
generateDisposalReport(assets)        // ⚠️ Dùng require() — cần fix → import()
generateMaintenanceCertificate(ticket)// ⚠️ Dùng require() — cần fix → import()
```

---

## 9. Responsive Design

**Mobile-first approach** với 6 breakpoints:

| Breakpoint | Kích thước | Mô tả |
|---|---|---|
| default | < 475px | Mobile nhỏ |
| `xs` | 475px | Extra small |
| `sm` | 640px | Phones landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | 2X large |

**Responsive patterns:**
- Desktop: Sidebar cố định + main content
- Mobile: Drawer sidebar (toggle bằng hamburger menu)
- Tables → Card/Accordion view trên mobile (ResponsiveTable component)
- Modals → Fullscreen trên mobile
- Buttons → Full width trên mobile

**Hook:**

```js
const { isMobile, isTablet, isDesktop } = useResponsive()
```

---

## 10. Trạng thái hiện tại & lộ trình

### Trạng thái module

| Module | Trạng thái | Ghi chú |
|---|---|---|
| Design system / UI | ✅ Hoàn thiện | Tái sử dụng tốt, responsive |
| Auth (Google OAuth) | ✅ Tốt | Cache, refresh token, retry-once |
| Assets (CRUD) | 🟡 Gần đúng | Đúng kiến trúc, còn vài sai field nhỏ |
| Dashboard | 🟡 Bug nhỏ | Sai URL prefix `/api` |
| Maintenance | 🔴 Hỏng | Sai schema + gọi Supabase trực tiếp |
| Users | 🔴 Hỏng | Sai role, sai field, gọi Supabase trực tiếp |
| Handover (phiếu bàn giao) | 🔴 Hỏng | Bảng `assignment_slips` không tồn tại |
| Invoices | 🔴 Hỏng | Cột/status giả định không có trong DB |
| Reports | 🔴 Mockup | Hard-coded, chưa nối API |
| Settings / Profile | 🟡 Khung UI | Chưa nối logic thật |

### Vấn đề cần fix ngay (P0)

**1. Bảo mật — JWT token bị log ra console production:**

```js
// src/services/api.js — XOÁ HOẶC bọc trong điều kiện dev
if (import.meta.env.DEV) {
  console.log('Token info:', { access_token, user })
}
```

**2. Bảo mật — DatabaseSetup.jsx render trên Dashboard mọi role:**

Gỡ `<DatabaseSetup />` và `<TestSupabase />` khỏi `DashboardPage.jsx` trước khi deploy production.

**3. Blocker — ROLES không khớp với VPS schema:**

```js
// src/utils/constants.js — CẦN SỬA NGAY
// Sai (hiện tại):
export const ROLES = {
  ADMIN_IT: 'admin_it',
  ACCOUNTANT: 'accountant',
  DEV: 'dev',
  USER: 'user',
}

// Đúng (theo VPS schema):
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  IT_ADMIN: 'it_admin',
  MANAGER: 'manager',
  USER: 'user',
}

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  it_admin: 'IT Admin',
  manager: 'Manager',
  user: 'Người dùng',
}
```

Sau khi sửa `constants.js`, cập nhật toàn bộ `roles: [...]` trong:
- `src/router.jsx`
- `src/components/layout/Sidebar.jsx`
- `src/components/layout/MobileSidebar.jsx`
- `src/utils/permissions.js`

**4. Blocker — 5 service files gọi Supabase trực tiếp:**

Viết lại các file sau để gọi qua `apiClient` thay vì `supabase.from(...)`:
- `src/services/userService.js`
- `src/services/maintenanceService.js`
- `src/services/invoiceService.js`
- `src/services/reportService.js`
- `src/services/slipService.js`

**5. Git conflict chưa resolve:**

```bash
# README.md và .gitignore đang có conflict markers
# Cần resolve và xoá phần "System Document" schema cũ
git checkout fe/README.md   # hoặc resolve thủ công
git checkout fe/.gitignore
```

**6. File rác cần xoá:**

```bash
rm src/services/assetService_old.js   # Lỗi syntax, có duplicate declarations
```

### P1 — Rewrite service layer (tuần 2–3)

- Viết lại `userService.js`, `maintenanceService.js`, `invoiceService.js`, `reportService.js` theo `apiClient` pattern
- Fix `useMaintenance()` bị dùng nhầm làm mutation trong `MaintenancePage.jsx`
- Fix `data.records` → `data.data` ở response từ BE
- Chuẩn hoá 13 asset categories khớp với CHECK constraint VPS
- Fix `logout` → `signOut` ở `SettingsPage.jsx`

### P2 — Rewrite modules phụ thuộc schema mới (tuần 3–5)

- Viết lại module phiếu bàn giao theo `handover_slips` + `handover_slip_items`
- Clarify invoice status với BE (hiện DB không có cột `status`)
- Bổ sung trang CRUD Departments + dropdown Job Titles trong `UserForm`
- Nối `ReportsPage.jsx` với API thật, thêm pagination thật
- Bổ sung `GET /api/departments` + `GET /api/job-titles` hooks

### P3 — Dọn dẹp & hoàn thiện (song song)

- Fix `pdfGenerators.js`: đổi `require()` → `await import()` trong 2 hàm
- Gom 1 hằng số `API_BASE_URL` duy nhất (hiện có ít nhất 3 định nghĩa)
- Chuẩn hoá route chi tiết asset dùng `id` (UUID) xuyên suốt thay vì lẫn lộn `asset_code`
- Dọn `console.log` debug trước khi build production
- Hoàn thiện `ProfilePage.jsx`
- Nối logic thật cho `SettingsPage.jsx` (đổi password, lưu preference)

---

## 11. Triển khai

### Vercel (khuyến nghị)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Production
vercel --prod
```

**Environment variables cần set trên Vercel:**
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_URL   (URL của Express BE trên VPS)
```

### Docker (self-hosted)

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Kiểm tra trước khi deploy production

```bash
# Build thành công
npm run build

# Kiểm tra bundle size
npm run build -- --report

# Preview
npm run preview
```

**Checklist:**
- [ ] `.env` production đã set đúng
- [ ] `console.log` token đã xoá hoặc guard bằng `import.meta.env.DEV`
- [ ] `DatabaseSetup.jsx` đã gỡ khỏi Dashboard
- [ ] ROLES đã đồng bộ với VPS schema
- [ ] Build thành công không có lỗi

---

## Liên kết tài liệu

| Tài liệu | Mô tả |
|---|---|
| `BE_ANALYSIS_REFACTOR_v2.md` | Trạng thái BE sau refactor, API endpoints |
| `VPS_POSTGRES_SCHEMA.md` | Schema DB thực tế (source of truth) |
| `00_ARCHITECTURE.md` | Kiến trúc tổng quan hệ thống |
| `PHAN_TICH_TIEN_DO_FRONTEND.md` | Phân tích chi tiết lỗi FE |
| `REQUIREMENTS_FINAL.md` | Tài liệu yêu cầu hệ thống |
| `ROADMAP_FINAL.md` | Kế hoạch triển khai |

---

*README này được tổng hợp từ 14 tài liệu dự án — ngày 19/06/2026.*
