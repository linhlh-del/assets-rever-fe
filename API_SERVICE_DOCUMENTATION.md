# API Service Layer Documentation

## Overview
Tầng Service cung cấp các hook tương tác với API thông qua Supabase. Sử dụng React Query để quản lý server state, cache data, và handle loading/error states.

## Architecture

```
Pages (React components)
    ↓
Hooks (useUsers, useAssets, etc)
    ↓
Services (userService, assetService, etc)
    ↓
Supabase API
    ↓
Database
```

## Service Modules

### 1. Users Service (`src/services/userService.js` + `src/hooks/useUsers.js`)

**Queries:**
- `useUsers(filters)` - Get all users with pagination & filters
- `useUser(employeeCode)` - Get single user
- `useUserAssetHistory(employeeCode)` - Get user's asset assignment history

**Mutations:**
- `useCreateUser()` - Create new user
- `useUpdateUser()` - Update user info
- `useDeleteUser()` - Soft delete user (set status to 'resigned')
- `useBulkUpdateUsers()` - Update multiple users at once

**Usage Example:**
```jsx
import { useUsers, useCreateUser } from '@/hooks/useUsers'

export function UsersPage() {
  // Fetch users with filters
  const { data, isLoading, error } = useUsers({
    department: 'IT',
    role: 'user',
    search: 'john',
    page: 1,
    limit: 20,
  })

  // Create new user
  const { mutate: createUser } = useCreateUser()
  
  const handleCreate = (userData) => {
    createUser(userData)
  }

  return (
    <div>
      {isLoading && <Loading />}
      {data?.data.map(user => (
        <div key={user.employee_code}>{user.full_name}</div>
      ))}
    </div>
  )
}
```

---

### 2. Assets Service (`src/services/assetService.js` + `src/hooks/useAssets.js`)

**Queries:**
- `useAssets(filters)` - Get all assets with images & history
- `useAsset(assetCode)` - Get single asset with full details
- `useAssetAuditTrail(assetCode)` - Get asset history (all assignments)

**Mutations:**
- `useCreateAsset()` - Create new asset (must link to invoice)
- `useUpdateAsset()` - Update asset info
- `useAssignAsset()` - Assign to user (creates history record + updates status)
- `useReturnAsset()` - Return from user (closes history + sets to available)
- `useReportMaintenance()` - Report issue (changes status to 'maintenance')
- `useDisposeAsset()` - Dispose asset (sets status to 'disposed')
- `useUploadAssetImages()` - Upload asset photos to storage

**Usage Example:**
```jsx
import { useAsset, useAssignAsset } from '@/hooks/useAssets'

export function AssetDetailPage({ assetCode }) {
  // Get asset with history
  const { data: asset, isLoading } = useAsset(assetCode)
  const { mutate: assignAsset } = useAssignAsset()

  const handleAssign = (employeeCode, department) => {
    assignAsset({
      assetCode,
      data: {
        userEmployeeCode: employeeCode,
        department,
      },
    })
  }

  return (
    <div>
      <h1>{asset?.product_name}</h1>
      <button onClick={() => handleAssign('EMP001', 'IT')}>
        Gán cho nhân viên
      </button>
    </div>
  )
}
```

---

### 3. Invoices Service (`src/services/invoiceService.js` + `src/hooks/useInvoices.js`)

**Queries:**
- `useInvoices(filters)` - Get all invoices with files
- `useInvoice(invoiceNumber)` - Get single invoice with assets
- `useInvoiceSummary()` - Get total amount & status breakdown

**Mutations:**
- `useCreateInvoice()` - Create invoice record
- `useUpdateInvoice()` - Update invoice info
- `useConfirmInvoice()` - Confirm invoice (status = 'confirmed')
- `useUploadInvoiceFile()` - Upload invoice file (PDF, Excel, Images)

**File Formats Supported:**
- PDF documents
- Excel sheets (calculate asset prices from file)
- Word documents
- Images (JPG, PNG)

**Usage Example:**
```jsx
import { useInvoices, useCreateInvoice } from '@/hooks/useInvoices'

export function InvoicesPage() {
  const { data: invoices } = useInvoices({ status: 'pending' })
  const { mutate: createInvoice } = useCreateInvoice()

  const handleCreate = (formData) => {
    createInvoice({
      invoice_number: formData.invoiceNumber,
      vendor_name: formData.vendor,
      total_amount: formData.amount,
      invoice_date: new Date().toISOString(),
    })
  }

  return (
    <div>
      {invoices?.data.map(invoice => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  )
}
```

---

### 4. Maintenance Service (`src/services/maintenanceService.js` + `src/hooks/useMaintenance.js`)

**Queries:**
- `useMaintenanceTickets(filters)` - Get all maintenance tickets
- `useMaintenanceTicket(ticketId)` - Get single ticket
- `useMaintenanceSummary()` - Get summary (open, in-progress, closed, high-priority)

**Mutations:**
- `useReportMaintenanceIssue()` - Create maintenance ticket (requires photo)
- `useUpdateMaintenanceTicket()` - Update ticket (assign to technician, change priority)
- `useCloseMaintenanceTicket()` - Close ticket with resolution notes

**Workflow:**
1. User reports issue (photo required) → status = 'open'
2. Admin assigns to technician → status = 'in_progress'
3. Technician resolves → status = 'closed'

**Usage Example:**
```jsx
import { useReportMaintenanceIssue } from '@/hooks/useMaintenance'

export function ReportIssuePage({ assetCode }) {
  const { mutate: reportIssue } = useReportMaintenanceIssue()

  const handleReport = async (description, photo) => {
    reportIssue({
      assetCode,
      reportedBy: currentUser.employee_code,
      description,
      photoUrl: photo,
      priority: 'high',
    })
  }

  return <form onSubmit={handleReport}>...</form>
}
```

---

### 5. Assignment Slips Service (`src/services/slipService.js` + `src/hooks/useSlips.js`)

**Queries:**
- `useAssignmentSlips(filters)` - Get all slips
- `useAssignmentSlip(slipNumber)` - Get single slip

**Mutations:**
- `useCreateAssignmentSlip()` - Create slip (generates PDF automatically)
- `useApproveAssignmentSlip()` - Manager approves
- `useConfirmSlipReceipt()` - Recipient confirms receipt

**Slip Workflow:**
1. Create slip (status = 'pending') → Auto-generate PDF with QR code
2. Manager approves (status = 'approved')
3. Recipient confirms (status = 'received')

**Generated Documents:**
- PDF phiếu bàn giao with:
  - Transfer details (from/to user)
  - Asset information
  - QR code (for scanning)
  - Signature fields

---

### 6. Reports Service (`src/services/reportService.js` + `src/hooks/useReports.js`)

**Report Types:**
1. `useAssetListReport(filters)` - List all assets with status
2. `useAssetDepreciationReport()` - Calculate asset depreciation
3. `useAssetMaintenanceReport()` - Maintenance history
4. `useAssetDisposalReport()` - Disposed assets
5. `useUserAssetAllocationReport()` - Assets per user
6. `useDepartmentAssetReport()` - Assets per department
7. `useInvoiceSummaryReport()` - Invoice totals by status

**Export Utilities:**
- `exportToExcel()` - Export to .xlsx
- `exportToCSV()` - Export to .csv
- `exportToPDF()` - Export to .pdf with formatting
- `exportMultiSheetExcel()` - Multiple sheets in one file

**Usage Example:**
```jsx
import { useAssetListReport } from '@/hooks/useReports'
import { exportToExcel } from '@/utils/exportUtils'

export function ReportsPage() {
  const { data: assets } = useAssetListReport({ 
    category: 'computer',
    status: 'in_use',
  })

  const handleExport = () => {
    const exportData = assets.map(a => ({
      'Mã': a.asset_code,
      'Tên': a.product_name,
      'Bộ phận': a.current_department,
      'Trạng thái': a.status,
      'Giá': a.purchase_price,
    }))
    exportToExcel(exportData, 'danh-sach-tai-san')
  }

  return <button onClick={handleExport}>Tải xuống Excel</button>
}
```

---

## Export Utilities

### File: `src/utils/exportUtils.js`

**Functions:**
```js
exportToExcel(data, fileName, sheetName)
exportToCSV(data, fileName)
exportToPDF(data, columns, fileName, title)
exportMultiSheetExcel(sheets, fileName)
formatCurrencyForExport(value)
formatDateForExport(date)
```

### File: `src/utils/pdfGenerators.js`

**Functions:**
```js
generateAssetTransferSlip(slipData) // Generates phiếu bàn giao PDF
generateDisposalReport(assets) // Generates disposal report PDF
generateMaintenanceCertificate(ticket) // Generates maintenance cert PDF
```

---

## React Query Configuration

**Stale Times:**
- Users, Assets, Invoices: 5 minutes
- Maintenance, Slips: 5 minutes
- Reports, Summary: 10-30 minutes

**Invalidation Strategy:**
- After mutation success → invalidate related queries
- Example: After creating user → invalidate `useUsers` query

**Example:**
```jsx
const queryClient = useQueryClient()

// Automatic invalidation on success
const { mutate } = useCreateUser()
// mutationFn succeeds → onSuccess fires
// → queryClient.invalidateQueries(['users'])
// → useUsers query refetches automatically
```

---

## Error Handling

All mutations include automatic toast notifications:

```jsx
// Success toast (Vietnamese)
toast.success('Thêm người dùng thành công')

// Error toast
toast.error(`Lỗi: ${error.message}`)
```

Custom error handling:
```jsx
const { mutate, error } = useCreateUser()

mutate(userData, {
  onError: (err) => {
    // Custom error handling
    if (err.code === 'PGRST116') {
      toast.error('Mã nhân viên đã tồn tại')
    }
  },
})
```

---

## Database Schema Notes

**Key Tables:**
- `users` - Employee records
- `assets` - Asset records  
- `asset_history` - Asset assignments (tracks who has what, when)
- `asset_images` - Asset photos (stored in Supabase storage)
- `maintenance_tickets` - Maintenance issues
- `assignment_slips` - Asset transfer records
- `invoices` - Purchase invoices
- `invoice_files` - Invoice documents (PDF, Excel, etc)

**Key Relationships:**
- Asset has many asset_history records
- User has many assets (current)
- Invoice has many assets (from purchase)
- Asset has many maintenance_tickets

---

## Future Enhancements

1. **Real-time Updates** - Use Supabase realtime subscriptions
2. **Offline Support** - Store data locally with sync
3. **Advanced Analytics** - Dashboard metrics + trends
4. **Automated Reports** - Scheduled email reports
5. **Mobile App** - React Native version
6. **Barcode Scanning** - QR code reader for assets
7. **API Rate Limiting** - Handle Supabase rate limits gracefully

---

## Testing Services

```jsx
// Mock data for testing
const mockUsers = [
  {
    employee_code: 'EMP001',
    full_name: 'Nguyen Van A',
    email: 'a@rever.vn',
    department: 'IT',
    role: 'user',
  },
]

// Mock useUsers hook
vi.mock('@/hooks/useUsers', () => ({
  useUsers: () => ({
    data: { data: mockUsers, total: 1 },
    isLoading: false,
    error: null,
  }),
}))
```

---

**Last Updated:** Phase 3 - API Service Layer
**Status:** ✅ Complete with all 6 modules
