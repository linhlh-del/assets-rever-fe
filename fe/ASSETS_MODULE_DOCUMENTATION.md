# Assets Module Documentation

## Overview

Modul Quản lý tài sản cung cấp giao diện đầy đủ để:
- Xem danh sách tài sản với phân trang
- Tìm kiếm và lọc theo loại, trạng thái, bộ phận
- Thêm/Sửa tài sản
- Xem chi tiết tài sản và lịch sử gán
- Phân công tài sản cho nhân viên (auto-generate PDF phiếu bàn giao)
- Thu hồi tài sản
- Quản lý ảnh tài sản

## File Structure

```
src/components/assets/
├── AssetForm.jsx              # Form tái sử dụng (create/edit)
├── AddAssetModal.jsx          # Modal thêm tài sản
├── EditAssetModal.jsx         # Modal sửa tài sản
├── AssetFilters.jsx           # Component lọc/tìm kiếm
├── AssetsList.jsx             # Bảng danh sách tài sản
├── AssignAssetModal.jsx       # Modal phân công + PDF generation
├── ReturnAssetModal.jsx       # Modal thu hồi tài sản
├── AssetImages.jsx            # Gallery + upload ảnh
└── index.js                   # Barrel export

src/pages/AssetsPage.jsx       # Trang danh sách
src/pages/AssetDetailPage.jsx  # Trang chi tiết
```

## Components

### AssetForm
**Props:**
- `initialData` (object, optional) - Dữ liệu tài sản (nếu editing)
- `onSubmit` (function) - Callback khi submit form
- `isLoading` (boolean) - Trạng thái loading
- `isEditing` (boolean) - Chế độ edit

**Fields:**
- Mã tài sản (required, read-only in edit)
- Tên sản phẩm (required)
- Loại (required): Máy tính, Điện thoại, Ngoại vi, Mạng, Tủ lạnh, Đồ nội thất, Khác
- Số seri (optional)
- Ngày mua (required)
- Giá mua VNĐ (required, > 0)
- Hết bảo hành (optional)
- Ghi chú (optional)

### AddAssetModal
Modal to create new asset.

```jsx
<AddAssetModal 
  isOpen={isOpen} 
  onClose={onClose}
  invoiceNumber={invoiceNumber} 
/>
```

**Note:** Assets are linked to invoices.

### EditAssetModal
Modal to edit existing asset.

```jsx
<EditAssetModal 
  isOpen={isOpen} 
  onClose={onClose}
  asset={assetObject}
/>
```

### AssetFilters
Searchable filter component.

```jsx
<AssetFilters 
  filters={filterState}
  onFiltersChange={setFilters}
/>
```

**Filter Options:**
- Search (code, name, serial)
- Category dropdown (7 types)
- Status dropdown (5 statuses)
- Department dropdown
- Clear filters button

### AssetsList
Displays assets in table format with inline actions.

```jsx
<AssetsList 
  assets={assetsArray}
  isLoading={isLoading}
  onView={openDetail}
  onEdit={setEditing}
  onAssign={setAssigning}
  onReturn={setReturning}
  onReport={reportIssue}
  onDispose={disposeAsset}
/>
```

**Columns:**
- Asset Code
- Product Name
- Category
- Status (colored badge)
- Department
- Purchase Price (formatted)
- Actions (View, Edit, Assign/Return buttons)

**Features:**
- Status-based action visibility
- Assign button only for "available" status
- Return button only for "in_use" status
- Hover effects

### AssignAssetModal
Modal to assign asset to user and generate phiếu bàn giao PDF.

```jsx
<AssignAssetModal 
  isOpen={isOpen}
  onClose={onClose}
  asset={assetObject}
/>
```

**Actions:**
1. Select employee (with email + current department display)
2. Select target department
3. Add notes (condition, etc.)
4. Click "Phân công"
5. PDF automatically generated and downloaded
6. Asset history created + status changed to "in_use"

**Generated PDF Contains:**
- Slip number (timestamp-based)
- Asset information
- From/To user details
- Department assignment
- Condition checklist
- Signature fields
- QR code

### ReturnAssetModal
Modal to return asset from user.

```jsx
<ReturnAssetModal 
  isOpen={isOpen}
  onClose={onClose}
  asset={assetObject}
/>
```

**Actions:**
1. Optionally select storage department
2. Add return notes
3. Click "Thu hồi"
4. Asset history closed + status changed to "available"

### AssetImages
Gallery component with drag-drop upload.

```jsx
<AssetImages 
  assetCode={assetCode}
  images={imagesArray}
/>
```

**Features:**
- Drag-drop upload (max 5 files, 10MB each)
- Image grid display
- Image preview modal with download
- Supports JPG, PNG, WebP formats
- Auto-upload to Supabase storage

### AssetDetailPage
Full detail page for single asset.

**URL:** `/assets/:assetCode`

**Sections:**
1. Header with asset name, code, and status badge
2. Basic info (code, serial, category, department)
3. Financial info (purchase price, date)
4. Warranty info (end date, expiring alert)
5. Notes
6. Images gallery
7. Assignment history (audit trail)
8. Sidebar with:
   - Action buttons (Edit, Assign, Return, Dispose)
   - Status info card
   - Info box

**Features:**
- Back navigation
- Status-based button visibility
- Warranty expiry warning (yellow highlight)
- Complete assignment history
- Image management

### AssetsPage
Main list page for all assets.

**URL:** `/assets`

**Features:**
- Filter & search
- Pagination (20 items/page)
- Bulk actions (future)
- Add button (if canCreateAsset)
- Navigate to detail on "View"

## Data Flow

```
AssetsPage (state management)
├── isAddModalOpen → AddAssetModal
├── editingAsset → EditAssetModal
├── assigningAsset → AssignAssetModal
├── returningAsset → ReturnAssetModal
├── filters → AssetFilters
└── assets (from useAssets hook) → AssetsList
         ↓
   onClick View → Navigate to AssetDetailPage
   AssetDetailPage (calls useAsset + useAssetAuditTrail)
   ├── AssetImages
   └── Audit trail section
```

## Hooks Usage

**Data Fetching:**
```jsx
const { data, isLoading } = useAssets({
  search: '',
  category: 'Máy tính',
  status: 'in_use',
  department: 'IT',
  page: 1,
  limit: 20,
})

const { data: asset } = useAsset(assetCode)
const { data: auditTrail } = useAssetAuditTrail(assetCode)
```

**Mutations:**
```jsx
// Create
const { mutate: createAsset } = useCreateAsset()
createAsset({ ...assetData, status: 'available' })

// Update
const { mutate: updateAsset } = useUpdateAsset()
updateAsset({ assetCode, data: {...} })

// Assign
const { mutate: assignAsset } = useAssignAsset()
assignAsset({ 
  assetCode, 
  data: { userEmployeeCode, department } 
})

// Return
const { mutate: returnAsset } = useReturnAsset()
returnAsset({ assetCode, data: { department } })

// Upload Images
const { mutate: uploadImages } = useUploadAssetImages()
uploadImages({ assetCode, files: [...] })

// Report Maintenance
const { mutate: reportMaintenance } = useReportMaintenance()
reportMaintenance({ 
  assetCode,
  data: { reportedBy, description, photoUrl, priority }
})

// Dispose
const { mutate: disposeAsset } = useDisposeAsset()
disposeAsset({ assetCode, data: { reason } })
```

## Asset Statuses

| Status | Label | Meaning | Next Actions |
|--------|-------|---------|--------------|
| `available` | Khả dụng | Not assigned | Assign, Edit, Delete |
| `in_use` | Đang sử dụng | Assigned to user | Return, Edit, Report Maintenance |
| `maintenance` | Bảo trì | Under repair | Return to in_use, Dispose |
| `broken` | Hỏng hóc | Non-functional | Dispose, Repair |
| `disposed` | Đã thanh lý | Removed from system | View only |

## Categories

```js
const categories = [
  'Máy tính',         // Computers
  'Điện thoại',       // Phones
  'Ngoại vi',         // Peripherals
  'Mạng',             // Network equipment
  'Tủ lạnh',          // Appliances
  'Đồ nội thất',      // Furniture
  'Khác',             // Other
]
```

## PDF Generation

**Asset Transfer Slip (Phiếu bàn giao)**

Uses `generateAssetTransferSlip()` from `pdfGenerators.js`:
- Auto-generated when assigning asset
- Contains all required legal information
- Includes QR code for tracking
- Signature fields for both parties
- Automatically downloaded to user's computer

**Example:**
```jsx
const doc = await generateAssetTransferSlip({
  slipNumber: `${Date.now()}`,
  assetCode: 'AS001',
  assetName: 'MacBook Pro',
  serialNumber: 'C02R3...',
  category: 'Máy tính',
  fromUserCode: 'EMP001',
  fromUserName: 'Kho',
  toUserCode: 'EMP002',
  toUserName: 'Nguyen Van A',
  fromDepartment: 'Kho',
  toDepartment: 'IT',
  transferredDate: new Date().toISOString(),
  notes: 'Tình trạng: tốt',
})

doc.save('phieu-ban-giao-AS001.pdf')
```

## Features

### 1. Search
- Real-time search across:
  - Asset code
  - Product name
  - Serial number
- Resets pagination to page 1

### 2. Filtering
- By category (7 types)
- By status (5 statuses)
- By department
- Chainable (AND logic)
- Shows "Clear filters" when active

### 3. Pagination
- 20 items per page
- Previous/Next buttons
- Shows record count
- Disabled at boundaries

### 4. Asset Assignment Workflow
1. Click "Phân công" button on available asset
2. Select employee from dropdown
3. Select target department
4. Optionally add notes
5. Click "Phân công"
6. PDF phiếu bàn giao auto-generated + downloaded
7. Asset status changes to "in_use"
8. Asset history record created

### 5. Asset Return Workflow
1. Click "Thu hồi" button on in-use asset
2. Optionally select storage department
3. Optionally add return notes
4. Click "Thu hồi"
5. Asset status changes to "available"
6. Asset history record closed
7. User reference cleared

### 6. Image Management
- Drag-drop upload (max 5 files)
- Supports: JPG, PNG, WebP
- Max 10MB per file
- Stored in Supabase storage
- Image preview modal
- Download individual images

### 7. Detail Page
- Comprehensive asset information
- Financial details (price, depreciation potential)
- Warranty tracking with expiry alerts
- Complete assignment history (audit trail)
- Status-based available actions
- Image gallery

### 8. Warranty Tracking
- Shows warranty end date
- Yellow alert if expiring within 30 days
- Visible on detail page

## Permissions

- **canCreateAsset**: Shows "Add" button
- **canAssignAsset**: Can assign assets to users
- **canEditAsset**: Can edit asset information
- Uses `usePermission()` hook

## Error Handling

All mutations include:
- Loading state with spinner
- Success toast notification (Vietnamese)
- Error toast with error message
- Automatic query invalidation

## Responsive Design

- Mobile: Single column, vertical filters
- Tablet: 2 columns
- Desktop: Full table + sidebar (detail page)

## Performance

- **Caching**: 5 minutes (React Query)
- **Pagination**: 20 items per page
- **Debounced Search**: Reduces API calls
- **Lazy loading**: Audit trail loads on demand

## Validation

**AssetForm:**
- Asset code: Required, unique
- Product name: Required, 1+ characters
- Category: Required
- Purchase date: Required
- Purchase price: Required, > 0
- Warranty date: Optional
- Serial number: Optional
- Notes: Optional

## Database Tables

**assets**
- asset_code (PK)
- product_name
- category
- serial_number
- purchase_date
- purchase_price
- warranty_end_date
- current_department
- current_user_employee_code (FK users)
- status
- assigned_date
- disposal_date
- disposal_reason
- created_at

**asset_history**
- id (PK)
- asset_code (FK)
- user_employee_code (FK)
- from_date
- to_date (nullable)
- department

**asset_images**
- id (PK)
- asset_code (FK)
- image_url (Supabase storage)

**assignment_slips**
- slip_number (PK)
- asset_code (FK)
- from_user_employee_code
- to_user_employee_code
- from_department
- to_department
- transferred_date
- status (pending/approved/received)

## Future Enhancements

1. **Bulk Assign** - Assign multiple assets at once
2. **Bulk Return** - Return multiple assets
3. **QR Code Scanning** - Scan asset codes
4. **Batch Import** - Import assets from Excel
5. **Asset Tracking** - Real-time location
6. **Custom Fields** - Add custom properties
7. **Depreciation Report** - Calculate asset value over time
8. **Condition Tracking** - Track asset condition over time
9. **Maintenance Schedule** - Auto-generate maintenance reminders
10. **Mobile App** - Mobile asset scanner

---

**Last Updated:** Phase 5 - Assets Module
**Status:** ✅ Complete with PDF generation
