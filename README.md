# REVER IT ASSET MANAGEMENT — SYSTEM DOCUMENT
> Cập nhật: 2026-03-07 | Dùng cho session tiếp theo

---

## 1. STACK & CẤU TRÚC PROJECT

```
web-manage-it-assets/
├── fe/                          # Frontend React + Vite
│   └── src/
│       ├── hooks/               # TanStack Query hooks
│       ├── services/            # API call functions (fetch thuần)
│       ├── components/
│       │   ├── assets/
│       │   ├── users/
│       │   └── dashboard/
│       ├── pages/
│       └── utils/constants.js
└── be/                          # Backend Express.js
    ├── routes/
    │   ├── users.js
    │   ├── assets.js
    │   ├── departments.js
    │   ├── job_titles.js
    │   ├── dashboard.js
    │   └── handovers.js
    ├── assets/
    │   └── rever_logo.png       # Logo dùng generate DOCX
    └── lib/supabase.js
```

**Ports:**
- Frontend: `http://localhost:5173`
- Backend:  `http://localhost:3004`
- Env:      `VITE_API_URL=http://localhost:3004`

**Tech stack:**
- FE: React + Vite + TanStack Query v5 + Tailwind CSS
- BE: Express.js (ES modules) + Supabase JS client
- DB: Supabase (PostgreSQL)
- File gen: `docx` npm package

---

## 2. DATABASE SCHEMA

### 2.1 Bảng `departments`
```sql
id          SERIAL PRIMARY KEY   -- số nguyên tự tăng (QUAN TRỌNG: không phải UUID)
name        TEXT NOT NULL UNIQUE
code        TEXT NOT NULL UNIQUE
parent_id   INT NULL REFERENCES departments(id)
level       INT DEFAULT 0        -- 0: công ty, 1: division, 2: phòng ban
is_active   BOOLEAN DEFAULT true
created_at  TIMESTAMPTZ
```

**Dữ liệu thực tế (SERIAL id):**
```
id=1   Rever (level 0, công ty)
id=10  Strategy Office (level 1)
id=20  Back Office Division (level 1)
id=30  Commercial Division (level 1)
id=21  HR Department (level 2, parent=20)
id=22  Finance & Accounting (level 2, parent=20)
id=23  Technology Department (level 2, parent=20)
id=24  Product Department (level 2, parent=20)
id=31  Sales & Trading Center (level 2, parent=30)
id=32  Agency & Affiliate Development (level 2, parent=30)
id=33  Commercial Operations (level 2, parent=30)
id=34  Project Department (level 2, parent=30)
id=35  Marketing Department (level 2, parent=30)
```

### 2.2 Bảng `job_titles`
```sql
id            SERIAL PRIMARY KEY
name          TEXT NOT NULL
code          TEXT NOT NULL UNIQUE
department_id INT NULL REFERENCES departments(id)  -- NULL = không thuộc phòng nào (CEO)
is_active     BOOLEAN DEFAULT true
created_at    TIMESTAMPTZ
```

**Lưu ý đặc biệt:**
- `CEO` → `department_id = NULL` (không thuộc phòng ban nào)
- `Deputy General Director` → `department_id = 30` (Commercial Division)
- `Strategic Advisor`, `Executive Assistant to CEO` → `department_id = 10` (Strategy Office)

### 2.3 Bảng `users`
```sql
id                          UUID PRIMARY KEY
employee_code               TEXT UNIQUE NOT NULL   -- RV00001
full_name                   TEXT NOT NULL
email                       TEXT UNIQUE NOT NULL
phone                       TEXT
department                  TEXT                   -- cột cũ (text), không dùng nữa
department_id               INT REFERENCES departments(id)   -- cột mới
job_title_id                INT REFERENCES job_titles(id)    -- cột mới
role                        TEXT CHECK IN ('admin_it','accountant','dev','user')
status                      TEXT CHECK IN ('active','inactive','resigned')
manager_name                TEXT
location                    TEXT
created_at                  TIMESTAMPTZ
updated_at                  TIMESTAMPTZ
```

**ROLES constants:**
```js
ADMIN_IT = 'admin_it'
ACCOUNTANT = 'accountant'
DEV = 'dev'
USER = 'user'
```

**User status:**
- `active` → hiển thị badge "Active" (xanh lá)
- `inactive` → hiển thị badge "Inactive" (vàng)
- `resigned` → hiển thị badge "Inactive" (hồng) — soft delete khi xóa user

### 2.4 Bảng `assets`
```sql
id                          UUID PRIMARY KEY
asset_code                  TEXT UNIQUE NOT NULL   -- RV-LAP-001
product_name                TEXT NOT NULL
category                    TEXT                   -- laptop, desktop, man hinh...
model                       TEXT
serial_number               TEXT
purchase_price              NUMERIC
purchase_date               DATE
warranty_end_date           DATE
status                      TEXT CHECK IN ('available','in_use','maintenance','broken','disposed')
current_user_employee_code  TEXT REFERENCES users(employee_code)  -- FK quan trọng để JOIN
location                    TEXT
notes                       TEXT
created_at                  TIMESTAMPTZ
updated_at                  TIMESTAMPTZ
```

**Lưu ý:** KHÔNG có cột `current_department` — department lấy qua JOIN users.

### 2.5 Bảng `asset_assignments`
```sql
id             UUID PRIMARY KEY
asset_id       UUID REFERENCES assets(id)
employee_code  TEXT REFERENCES users(employee_code)
full_name      TEXT
department     TEXT
from_date      TIMESTAMPTZ NOT NULL
to_date        TIMESTAMPTZ NULL        -- NULL = đang sử dụng
assigned_by    TEXT
notes          TEXT
```

### 2.6 Bảng `asset_handovers` (Phiếu bàn giao/thu hồi)
```sql
id              UUID PRIMARY KEY
handover_code   TEXT UNIQUE         -- PBGTS-2026-001 | PTTS-2026-001
type            TEXT CHECK IN ('handover','return')
employee_code   TEXT REFERENCES users(employee_code)   -- người nhận/trả
handover_by     TEXT REFERENCES users(employee_code)   -- người giao (IT admin)
handover_date   DATE
note            TEXT
signed_file_url TEXT                -- URL file đã ký trên Supabase Storage
status          TEXT CHECK IN ('draft','signed')
created_by      TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### 2.7 Bảng `asset_handover_items` (Chi tiết tài sản trong phiếu)
```sql
id           UUID PRIMARY KEY
handover_id  UUID REFERENCES asset_handovers(id) ON DELETE CASCADE
asset_id     UUID REFERENCES assets(id)
condition    TEXT DEFAULT '100%'
note         TEXT
created_at   TIMESTAMPTZ
```

### 2.8 Supabase Storage Buckets
```
handovers     (public) — lưu file phiếu bàn giao đã ký (JPG/PDF)
asset-images  (public) — lưu ảnh tài sản
```

### 2.9 Functions & Sequences
```sql
-- Tự tăng mã phiếu
CREATE SEQUENCE handover_seq START 1;
CREATE SEQUENCE return_seq   START 1;

CREATE FUNCTION generate_handover_code(p_type TEXT) RETURNS TEXT
-- 'handover' → PBGTS-2026-001
-- 'return'   → PTTS-2026-001
```

---

## 3. BACKEND API

### 3.1 Pattern chung
- ES modules (`import/export`)
- Supabase client từ `../lib/supabase.js`
- Không có auth middleware (Supabase xử lý ở FE)
- JOIN dùng syntax Supabase: `users!assets_current_user_employee_code_fkey`

### 3.2 Users API — `GET /api/users`
```
GET    /api/users                    — list, filters: search, department_id, role, status, page, limit
GET    /api/users/:employeeCode      — single user (JOIN departments, job_titles)
GET    /api/users/:employeeCode/assets        — tài sản đang dùng (status=in_use)
GET    /api/users/:employeeCode/asset-history — lịch sử từ asset_assignments
POST   /api/users                    — tạo mới (validate: employee_code, email, full_name)
PUT    /api/users/bulk               — bulk update (body: {employeeIds, data})
PUT    /api/users/:employeeCode      — update (không được đổi employee_code)
DELETE /api/users/:employeeCode      — soft delete (status → 'resigned')
```

**Response user object có các field flatten:**
```json
{
  "department_name": "Technology Department",
  "job_title_name": "Backend Developer",
  "department_id": 23,
  "job_title_id": 18
}
```

### 3.3 Assets API — `GET /api/assets`
```
GET  /api/assets                — list, filters: category, department_id, status, search, page, limit
GET  /api/assets/:id            — single asset
GET  /api/assets/:id/audit-trail — lịch sử từ asset_assignments
POST /api/assets                — tạo mới
PUT  /api/assets/:id            — update
DELETE /api/assets/:id          — xóa hẳn
POST /api/assets/:id/assign     — body: {employeeCode, fullName, department, assignedBy}
POST /api/assets/:id/return     — body: {returnNotes}
```

**Response asset object có các field flatten (JOIN qua users):**
```json
{
  "current_user_full_name": "Nguyễn Văn A",
  "current_department_name": "Sales & Trading Center",
  "current_department_id": 31
}
```

**JOIN syntax quan trọng:**
```js
supabase.from("assets").select(`
  *,
  users!assets_current_user_employee_code_fkey (
    full_name,
    department_id,
    departments ( id, name )
  )
`)
```

### 3.4 Departments API — `GET /api/departments`
```
GET  /api/departments           — list (filters: level, parent_id)
GET  /api/departments/tree      — cấu trúc cây
GET  /api/departments/:id       — single
GET  /api/departments/:id/users — nhân viên trong phòng
GET  /api/departments/:id/assets — tài sản trong phòng
POST /api/departments           — tạo mới
PUT  /api/departments/:id       — update
DELETE /api/departments/:id     — soft delete (is_active=false)
```

### 3.5 Job Titles API — `GET /api/job-titles`
```
GET /api/job-titles?department_id=23  — filter theo phòng ban
```

### 3.6 Dashboard API — `GET /api/dashboard`
```
GET /api/dashboard
```
**Response:**
```json
{
  "summary": { "totalAssets": 0, "availableAssets": 0, "assignedAssets": 0 },
  "statusStats":     [{ "status": "in_use", "label": "Đang sử dụng", "count": 5 }],
  "categoryStats":   [{ "category": "laptop", "count": 10 }],
  "departmentStats": [{ "department": "Technology Department", "count": 8 }],
  "assetsOverTime":  [{ "date": "2026-03-07", "count": 2 }],
  "widgets": {
    "expiringWarranty": [...],
    "brokenAssets": [...]
  }
}
```
**Lưu ý:** `departmentStats` JOIN qua `users!assets_current_user_employee_code_fkey → departments` — KHÔNG dùng cột `department` text cũ.

### 3.7 Handovers API — `GET /api/handovers`
```
GET  /api/handovers                     — list (filters: type, status, employee_code)
GET  /api/handovers/:id                 — single
POST /api/handovers                     — tạo phiếu + update assets + ghi assignments
GET  /api/handovers/:id/download        — generate & download DOCX
POST /api/handovers/:id/upload-signed   — upload file đã ký lên Supabase Storage
```

**POST /api/handovers body:**
```json
{
  "type": "handover",
  "employee_code": "RV001",
  "handover_by": "RV002",
  "asset_ids": ["uuid1", "uuid2"],
  "handover_date": "2026-03-07",
  "note": "ghi chú"
}
```

**Generate DOCX:**
- Dùng npm package `docx`
- Logo: `be/assets/rever_logo.png`
- Font: Times New Roman
- Cấu trúc: Header table (logo + tiêu đề + mã phiếu) → Thông tin bên giao/nhận → Bảng tài sản → Bảng ký (Bên A / Bên B)
- "Ngày phát hành: 7/7/22" — cố định, không tự động
- Mã phiếu tự động: PBGTS-2026-001 (bàn giao), PTTS-2026-001 (thu hồi)

**server.js registrations:**
```js
app.use("/api/users",       usersRouter);
app.use("/api/assets",      assetsRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/job-titles",  jobTitlesRouter);
app.use("/api/dashboard",   dashboardRouter);
app.use("/api/handovers",   handoversRouter);
```

---

## 4. FRONTEND

### 4.1 API call pattern
Project dùng `fetch` thuần — KHÔNG dùng axios hay apiClient trong hooks mới:
```js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3004";

const handleResponse = async (response) => {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${response.status}`);
  }
  return response.json();
};
```
Ngoại lệ: `dashboardService.js` dùng `apiClient` từ `@/services/api`.

### 4.2 Hooks
```
src/hooks/
├── useUsers.js         — useUsers, useUser, useUserAssets, useUserAssetHistory,
│                         useCreateUser, useUpdateUser, useDeleteUser, useBulkUpdateUsers
├── useAssets.js        — useAssets, useAsset, useAssetAuditTrail,
│                         useAssignAsset, useReturnAsset, useCreateAsset, useUpdateAsset
├── useDepartments.js   — useDepartments, useDepartmentTree
├── useJobTitles.js     — useJobTitles(departmentId)
├── useDashboard.js     — useDashboard (wrap dashboardService)
└── useHandovers.js     — useHandovers, useHandover, useCreateHandover,
                          useUploadSignedFile, downloadHandoverDoc (function, không phải hook)
```

### 4.3 Components quan trọng

**Users:**
```
UsersList.jsx       — bảng nhân viên, badge status: Active/Inactive/Resigned
UserFilters.jsx     — filter: search, department_id, role, status
UserForm.jsx        — form thêm/sửa (react-hook-form + zod)
                      department_id dropdown → load job_title_id động
EditUserModal.jsx   — modal sửa
DeleteUserDialog.jsx — soft delete → status='resigned'
UserDetailModal.jsx  — chi tiết + thiết bị đang dùng + lịch sử
```

**Assets:**
```
AssetsList.jsx       — bảng tài sản, badge status có màu nền
AssetFilters.jsx     — filter: category, status, department_id (từ API)
AssetDetailPage.jsx  — trang chi tiết, hiện tên nhân viên thay mã
AssignAssetModal.jsx — phân công + tự tạo phiếu PBGTS + download DOCX
```

**Dashboard:**
```
DashboardPage.jsx    — stat cards + 4 charts + 2 widgets
CustomizableChart.jsx — pie/bar/line chart
```

### 4.4 Status badge style
Tất cả dùng inline `<span>` với Tailwind (KHÔNG dùng Badge component) để đảm bảo hiển thị đúng:
```js
// Assets
available:   "bg-green-100 text-green-800 border border-green-200"
in_use:      "bg-blue-100 text-blue-800 border border-blue-200"
maintenance: "bg-yellow-100 text-yellow-800 border border-yellow-200"
broken:      "bg-red-100 text-red-800 border border-red-200"
disposed:    "bg-gray-100 text-gray-600 border border-gray-200"

// Users
active:   "bg-emerald-50 text-emerald-700 border border-emerald-300"
inactive: "bg-amber-50 text-amber-700 border border-amber-300"
resigned: "bg-rose-50 text-rose-600 border border-rose-300"

// Tất cả dùng rounded (không phải rounded-full)
```

### 4.5 Department dropdown rule
```js
// Form thêm/sửa user — hiển thị tất cả level >= 1
const deptOptions = departments.filter(d => d.level >= 1);

// Filter assets — tương tự
const deptOptions = departments.filter(d => d.level >= 1);
```

---

## 5. FLOW NGHIỆP VỤ QUAN TRỌNG

### 5.1 Phân công tài sản (AssignAssetModal)
```
1. Chọn nhân viên + tình trạng + ghi chú
2. POST /api/assets/:id/assign → cập nhật assets.status='in_use', current_user_employee_code
3. POST /api/handovers → tạo phiếu PBGTS-xxx, ghi asset_handover_items, ghi asset_assignments
4. Hiển thị màn hình success + nút download DOCX
5. GET /api/handovers/:id/download → trả về binary DOCX
6. FE dùng arraybuffer → Blob → download
```

### 5.2 Thu hồi tài sản
```
1. POST /api/assets/:id/return → status='available', current_user_employee_code=null
2. Cập nhật asset_assignments.to_date = now()
```

### 5.3 Upload file đã ký
```
1. Sau khi in & ký phiếu, upload ảnh/PDF lên
2. FE compress ảnh (max 1MB, max 1920px) trước khi upload
3. POST /api/handovers/:id/upload-signed (base64)
4. Backend upload lên Supabase Storage bucket 'handovers'
5. Cập nhật handovers.signed_file_url + status='signed'
```

---

## 6. NHỮNG VIỆC CÒN LẠI (TODO)

- [ ] **ReturnAssetModal** — tương tự AssignAssetModal, tạo phiếu PTTS + download
- [ ] **HandoversPage** — trang quản lý tất cả phiếu bàn giao/thu hồi, upload file đã ký
- [ ] **AddAssetModal / EditAssetModal** — cập nhật dropdown category (dùng ASSET_CATEGORIES từ constants)
- [ ] **Ảnh tài sản** — upload lên Supabase Storage bucket 'asset-images', hiển thị trong AssetDetailPage
- [ ] **Trang quản lý Phòng ban** — CRUD departments
- [ ] **UsersPage filter** — đang mặc định `status: "active"`, có thể filter để xem resigned

---

## 7. LỖI THƯỜNG GẶP & CÁCH FIX

| Lỗi | Nguyên nhân | Fix |
|-----|-------------|-----|
| `Could not find column 'current_department'` | assets table không có cột này | Bỏ field khỏi UPDATE query |
| `users_role_check constraint` | Gửi role chữ hoa (USER) | Dùng ROLE_LABELS thay ROLES để lấy value |
| Download DOCX bị lỗi font/XML | `res.send()` trả text thay binary | Dùng `res.end(buffer, 'binary')` + FE dùng `responseType: 'arraybuffer'` |
| `Failed to resolve import "@/lib/apiClient"` | Hooks mới dùng sai import path | Dùng `fetch` thuần với API_BASE_URL |
| Department filter không hiện Strategy Office | Filter `level === 2` bỏ mất level 1 | Filter `level >= 1` |
| Sequence lỗi sau insert manual id | Sequence chưa được reset | `SELECT setval('departments_id_seq', MAX(id) FROM departments)` |

---

## 8. ENV & CONSTANTS

```js
// .env (frontend)
VITE_API_URL=http://localhost:3004

// constants.js
ROLES = { ADMIN_IT: 'admin_it', ACCOUNTANT: 'accountant', DEV: 'dev', USER: 'user' }
ROLE_LABELS = { admin_it: 'Admin/IT', accountant: 'Kế toán', dev: 'Developer', user: 'Người dùng' }
USER_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive', RESIGNED: 'resigned' }
ASSET_STATUS = { AVAILABLE: 'available', IN_USE: 'in_use', MAINTENANCE: 'maintenance', BROKEN: 'broken', DISPOSED: 'disposed' }
ASSET_CATEGORIES = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'man hinh', label: 'Màn hình' },
  { value: 'keyboard', label: 'Bàn phím' },
  { value: 'mouse', label: 'Chuột' },
  { value: 'headset', label: 'Tai nghe' },
  { value: 'webcam', label: 'Webcam' },
  { value: 'other', label: 'Khác' },
]
```
