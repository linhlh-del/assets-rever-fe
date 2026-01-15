# Invoices Module Documentation

## Overview
Module quản lý hóa đơn cung cấp các chức năng:
- ✅ Tạo, sửa, xoá hóa đơn
- ✅ Upload và xem tài liệu (PDF, Excel, Word, Hình ảnh)
- ✅ Xác nhận hóa đơn
- ✅ Liên kết tài sản từ hóa đơn
- ✅ Tìm kiếm và lọc theo nhà cung cấp, trạng thái

## Components

### InvoiceForm
Biểu mẫu tạo/sửa hóa đơn.

**Props:**
- `onSubmit`: (data) => void - Callback khi submit form
- `isLoading`: boolean - Loading state
- `defaultValues`: object - Giá trị mặc định (cho edit mode)

**Fields:**
- `invoice_number` (string, required) - Số hóa đơn
- `vendor_name` (string, required) - Tên nhà cung cấp
- `invoice_date` (date, required) - Ngày hóa đơn
- `total_amount` (number, required) - Tổng tiền (phải > 0)
- `notes` (string) - Ghi chú

**Validation:**
- invoice_number: Không được để trống
- vendor_name: Không được để trống
- total_amount: Phải > 0
- invoice_date: Phải là ngày hợp lệ

**Usage:**
```jsx
import { InvoiceForm } from '@/components/invoices'

<InvoiceForm
  onSubmit={(data) => console.log(data)}
  isLoading={false}
/>
```

### FileViewer
Modal xem tập tin với hỗ trợ nhiều định dạng.

**Props:**
- `isOpen`: boolean - Trạng thái modal
- `onClose`: () => void - Callback đóng modal
- `file`: object - Đối tượng file { filename, file_url, file_size, file_type }

**Supported Formats:**
- **PDF**: Nhúng iframe (có toolbar)
- **Images**: Hiển thị trực tiếp (jpg, jpeg, png, gif, webp)
- **Office Files**: Download prompt (docx, xlsx, pptx)
- **Text Files**: Preview với download option (txt, csv, json)

**Features:**
- Full-screen viewing
- Download button
- File info display (size, type)
- File type icons
- Close button

**Usage:**
```jsx
import { FileViewer } from '@/components/invoices'

const [viewingFile, setViewingFile] = useState(null)

<FileViewer
  isOpen={!!viewingFile}
  onClose={() => setViewingFile(null)}
  file={viewingFile}
/>
```

### InvoiceFileUpload
Thành phần upload tập tin với drag-drop.

**Props:**
- `invoiceNumber`: string - Số hóa đơn (để upload)
- `invoiceFiles`: array - Danh sách file đã upload

**Features:**
- Drag-drop upload
- Max 5 files, 10MB per file
- Support: PDF, Excel (xlsx), Word (docx), Images (jpg, png, gif)
- File list với View/Download buttons
- Auto-open FileViewer khi click View

**Usage:**
```jsx
import { InvoiceFileUpload } from '@/components/invoices'

<InvoiceFileUpload
  invoiceNumber={invoice.invoice_number}
  invoiceFiles={invoice.invoice_files}
/>
```

### AddInvoiceModal
Modal tạo hóa đơn mới.

**Props:**
- `isOpen`: boolean - Trạng thái modal
- `onClose`: () => void - Callback đóng modal
- `onSuccess`: () => void - Callback khi tạo thành công (optional)

**Features:**
- Wraps InvoiceForm
- Auto-sets status='pending' và created_at
- Calls useCreateInvoice mutation

**Usage:**
```jsx
import { AddInvoiceModal } from '@/components/invoices'

const [showAdd, setShowAdd] = useState(false)

<AddInvoiceModal
  isOpen={showAdd}
  onClose={() => setShowAdd(false)}
  onSuccess={() => toast.success('Tạo thành công')}
/>
```

### InvoiceFilters
Thành phần lọc hóa đơn.

**Props:**
- `filters`: object - State bộ lọc { search, status, vendor, page }
- `onFiltersChange`: (filters) => void - Callback khi thay đổi filter

**Filter Fields:**
- Search input (số hóa đơn, tên nhà cung cấp)
- Status dropdown (Chờ xử lý, Đã xác nhận, Đã xử lý)
- Reset button (hiển thị khi có filter active)

**Usage:**
```jsx
import { InvoiceFilters } from '@/components/invoices'

const [filters, setFilters] = useState({ search: '', status: null })

<InvoiceFilters filters={filters} onFiltersChange={setFilters} />
```

### InvoicesList
Bảng danh sách hóa đơn.

**Props:**
- `invoices`: array - Danh sách hóa đơn
- `isLoading`: boolean - Loading state
- `onView`: (invoice) => void - Callback xem chi tiết
- `onConfirm`: (invoice) => void - Callback xác nhận

**Columns:**
1. **Số hóa đơn** - invoice_number
2. **Nhà cung cấp** - vendor_name
3. **Ngày hóa đơn** - invoice_date (định dạng vi-VN)
4. **Tổng tiền** - total_amount (formatted currency)
5. **Trạng thái** - status badge
6. **Tài liệu** - file count badge
7. **Hành động** - View, Confirm (if pending)

**Usage:**
```jsx
import { InvoicesList } from '@/components/invoices'

<InvoicesList
  invoices={data.invoices}
  isLoading={isLoading}
  onView={(invoice) => console.log(invoice)}
  onConfirm={(invoice) => console.log(invoice)}
/>
```

### InvoiceDetailModal
Modal xem chi tiết hóa đơn.

**Props:**
- `isOpen`: boolean - Trạng thái modal
- `onClose`: () => void - Callback đóng modal
- `invoice`: object - Dữ liệu hóa đơn

**Displays:**
- Invoice number, vendor, status badge
- Invoice date, total amount, created date
- Notes (if any)
- File upload section
- Assets created from invoice (if any)
- Confirm button (if status = pending)

**Usage:**
```jsx
import { InvoiceDetailModal } from '@/components/invoices'

const [selected, setSelected] = useState(null)

<InvoiceDetailModal
  isOpen={!!selected}
  onClose={() => setSelected(null)}
  invoice={selected}
/>
```

## Pages

### InvoicesPage
Trang quản lý hóa đơn chính.

**Features:**
- Lọc hóa đơn (search, status)
- Danh sách hóa đơn với pagination
- Tạo hóa đơn mới (nếu có quyền)
- Xem chi tiết hóa đơn
- Xác nhận hóa đơn

**State Management:**
```jsx
const [showAddModal, setShowAddModal] = useState(false)
const [showDetailModal, setShowDetailModal] = useState(false)
const [selectedInvoice, setSelectedInvoice] = useState(null)
const [filters, setFilters] = useState({
  search: '',
  status: null,
  page: 1,
  limit: 20,
})
```

**Permissions:**
- `canCreateInvoice` - Tạo hóa đơn mới

**API Calls:**
- `useInvoices` - Lấy danh sách hóa đơn (với filter)
- `useConfirmInvoice` - Xác nhận hóa đơn

## Services

### invoiceService.js

**Functions:**

#### uploadInvoiceFile(invoiceNumber, file)
Upload tập tin cho hóa đơn.
```javascript
const { data } = await uploadInvoiceFile('INV-001', file)
```

#### createInvoice(invoiceData)
Tạo hóa đơn mới.
```javascript
const { data } = await createInvoice({
  invoice_number: 'INV-001',
  vendor_name: 'ABC Corp',
  invoice_date: '2024-01-15',
  total_amount: 5000000,
  notes: 'Hóa đơn mua sắm',
  status: 'pending'
})
```

#### getInvoices(filters)
Lấy danh sách hóa đơn.
```javascript
const { data } = await getInvoices({
  search: 'INV',
  status: 'pending',
  limit: 20,
  offset: 0
})
```

#### getInvoice(invoiceNumber)
Lấy chi tiết hóa đơn.
```javascript
const { data } = await getInvoice('INV-001')
```

#### updateInvoice(invoiceNumber, updates)
Cập nhật hóa đơn.
```javascript
const { data } = await updateInvoice('INV-001', {
  vendor_name: 'XYZ Corp',
  total_amount: 6000000
})
```

#### confirmInvoice(invoiceNumber)
Xác nhận hóa đơn.
```javascript
const { data } = await confirmInvoice('INV-001')
// Sets confirmed_date = now()
// Changes status = 'confirmed'
```

## Hooks

### useInvoices(filters)
Query hook lấy danh sách hóa đơn.

**Returns:**
```javascript
{
  data: { invoices: [], total: 100 },
  isLoading: false,
  error: null
}
```

### useInvoice(invoiceNumber)
Query hook lấy chi tiết hóa đơn.

### useUploadInvoiceFile()
Mutation hook upload tập tin.

**Usage:**
```javascript
const { mutate: upload, isPending } = useUploadInvoiceFile()

upload({ invoiceNumber: 'INV-001', file }, {
  onSuccess: () => toast.success('Upload thành công')
})
```

### useCreateInvoice()
Mutation hook tạo hóa đơn.

### useUpdateInvoice()
Mutation hook cập nhật hóa đơn.

### useConfirmInvoice()
Mutation hook xác nhận hóa đơn.

## Invoice Status Flow

```
┌─────────┐     confirm()      ┌───────────┐     process()     ┌──────────┐
│ Pending │──────────────────→ │ Confirmed │──────────────────→ │Processed│
└─────────┘                    └───────────┘                    └──────────┘
     │
     └──── Delete (soft) ──→ Cancelled
```

**Statuses:**
- **pending** - Chờ xử lý (mới tạo)
- **confirmed** - Đã xác nhận (sẵn sàng xử lý)
- **processed** - Đã xử lý (hoàn tất)
- **cancelled** - Bị hủy (soft delete)

## Database Schema

```sql
-- Table: invoices
CREATE TABLE invoices (
  invoice_number VARCHAR(50) PRIMARY KEY,
  vendor_name VARCHAR(255) NOT NULL,
  invoice_date DATE NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  confirmed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Table: invoice_files
CREATE TABLE invoice_files (
  id UUID PRIMARY KEY,
  invoice_number VARCHAR(50) REFERENCES invoices,
  filename VARCHAR(255),
  file_path VARCHAR(500),
  file_url VARCHAR(1000),
  file_size INT,
  file_type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Table: invoice_assets
CREATE TABLE invoice_assets (
  id UUID PRIMARY KEY,
  invoice_number VARCHAR(50) REFERENCES invoices,
  asset_code VARCHAR(50) REFERENCES assets,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(15,2),
  notes TEXT
);
```

## Permissions

### Invoice Permissions
- `invoices:create` - Tạo hóa đơn
- `invoices:read` - Xem danh sách, chi tiết
- `invoices:update` - Sửa hóa đơn
- `invoices:delete` - Xoá hóa đơn (soft)
- `invoices:confirm` - Xác nhận hóa đơn
- `invoices:export` - Xuất dữ liệu

**Default Roles:**
- **admin_it** - Tất cả quyền
- **accountant** - Create, Read, Update, Confirm, Export
- **dev** - Create, Read, Export
- **user** - Read only

## Future Enhancements

1. **Auto Asset Creation**
   - Auto tạo tài sản từ invoice items
   - QR code liên kết invoice ↔ assets

2. **Batch Operations**
   - Confirm nhiều invoices cùng lúc
   - Bulk delete

3. **Receipt Integration**
   - Link với phiếu bàn giao tài sản
   - Track asset receipt from invoice

4. **Report & Analytics**
   - Invoice summary by vendor, month
   - Total spending analytics
   - Asset cost tracking from invoices

5. **Email Integration**
   - Auto email vendor invoices
   - Reminder for pending confirmation

## Testing Notes

**Test Scenarios:**
1. Create invoice without files → confirm → check status change
2. Upload PDF, image, Excel → verify in detail modal
3. Filter by vendor → verify correct invoices shown
4. Bulk confirm 5 invoices → verify all status changed
5. Search "INV" → verify all matching invoices returned
6. Delete invoice → verify soft delete (not removed from list)

**Edge Cases:**
- Upload same filename twice (should create new version)
- Large file upload (test max 10MB limit)
- Special characters in vendor name
- Future dates in invoice_date field
- Zero or negative amounts (should be rejected by validation)
