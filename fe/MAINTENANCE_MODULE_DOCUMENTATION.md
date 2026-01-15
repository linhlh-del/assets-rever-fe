# Maintenance Module Documentation

## Overview
Module quản lý bảo trì cung cấp chức năng:
- ✅ Tạo phiếu bảo trì cho tài sản
- ✅ Theo dõi tiến trình khắc phục sự cố
- ✅ Ghi nhận ghi chú giải quyết
- ✅ Xác định ưu tiên và thời gian dự kiến
- ✅ Lịch sử thay đổi trạng thái
- ✅ Giao công việc cho kỹ thuật viên

## Components

### MaintenanceForm
Biểu mẫu tạo/sửa phiếu bảo trì.

**Props:**
- `onSubmit`: (data) => void - Callback khi submit
- `isLoading`: boolean - Loading state
- `defaultValues`: object - Giá trị mặc định
- `assets`: array - Danh sách tài sản
- `technicians`: array - Danh sách kỹ thuật viên
- `isEditMode`: boolean - Chế độ edit (asset_code read-only)

**Fields:**
- `asset_code` - Tài sản (required, read-only in edit mode)
- `issue_type` - Loại sự cố: hardware, software, network, peripheral, other
- `description` - Mô tả sự cố (min 10 chars)
- `priority` - Độ ưu tiên: low, medium, high, critical
- `assigned_to` - Giao cho kỹ thuật viên (optional)
- `estimated_resolution_days` - Ngày dự kiến (1-30)

### MaintenanceFilters
Component lọc phiếu bảo trì.

**Props:**
- `filters`: object - State bộ lọc { search, status, priority, page }
- `onFiltersChange`: (filters) => void - Callback thay đổi

**Filters:**
- Search input (mã tài sản, mô tả)
- Status dropdown (Đang mở, Đang xử lý, Đã giải quyết, Đóng)
- Priority dropdown (Thấp, Trung bình, Cao, Rất cao)
- Reset button

### MaintenanceList
Bảng danh sách phiếu bảo trì.

**Props:**
- `records`: array - Danh sách phiếu
- `isLoading`: boolean - Loading state
- `onView`: (record) => void - Callback xem chi tiết

**Columns:**
1. Tài sản (asset_code)
2. Loại sự cố (issue_type)
3. Mô tả (description, truncated)
4. Độ ưu tiên (priority badge)
5. Trạng thái (status badge)
6. Ngày tạo (created_at)
7. Hành động (view button)

### MaintenanceDetailModal
Modal xem chi tiết & cập nhật phiếu.

**Props:**
- `isOpen`: boolean - Trạng thái modal
- `onClose`: () => void - Callback đóng
- `record`: object - Phiếu bảo trì

**Features:**
- Hiển thị chi tiết phiếu (asset, loại sự cố, ưu tiên, trạng thái)
- Ghi chú giải quyết nếu đã resolved
- Lịch sử thay đổi trạng thái
- Actions dựa trên status:
  - **open**: "Bắt đầu xử lý" button
  - **in_progress**: Textarea + "Đánh dấu đã giải quyết" button
  - **resolved**: "Đóng phiếu" button

## Pages

### MaintenancePage
Trang quản lý bảo trì chính.

**Features:**
- Tạo phiếu bảo trì (inline modal)
- Lọc theo search, status, priority
- Danh sách phiếu với pagination
- Xem chi tiết từng phiếu
- Cập nhật trạng thái trực tiếp từ detail modal

**Permissions:**
- `canCreateMaintenance` - Tạo phiếu mới

## Services & Hooks

### useMaintenance(filters)
Query hook lấy danh sách phiếu bảo trì.

```javascript
const { data, isLoading } = useMaintenance({
  search: 'AS-001',
  status: 'open',
  priority: 'high',
  limit: 20,
  offset: 0
})
// Returns: { records: [], total: 10, available_assets: [] }
```

### useUpdateMaintenance()
Mutation hook cập nhật phiếu.

```javascript
const { mutate } = useUpdateMaintenance()
mutate({ id, status, resolution_notes }, { onSuccess: () => {} })
```

### useCloseMaintenance()
Mutation hook đóng phiếu.

```javascript
const { mutate } = useCloseMaintenance()
mutate(id, { onSuccess: () => {} })
```

## Maintenance Status Flow

```
       create
         ↓
    ┌────────┐
    │  open  │
    └────────┘
        ↓ (start work)
    ┌────────────┐
    │ in_progress│
    └────────────┘
        ↓ (add notes & resolve)
    ┌──────────┐
    │ resolved │
    └──────────┘
        ↓ (close)
    ┌────────┐
    │ closed │
    └────────┘
```

**Status Definitions:**
- **open** - Phiếu vừa tạo, chưa có ai tiếp nhận
- **in_progress** - Đang xử lý, có ghi chú tiến độ
- **resolved** - Đã giải quyết, nhưng chưa đóng chính thức
- **closed** - Đã hoàn tất hoàn toàn, không thể mở lại

## Priority Levels

| Level | Color | Description |
|-------|-------|-------------|
| **low** | outline | Không gấp, có thể xử lý tuần tới |
| **medium** | secondary | Bình thường, xử lý trong 3-5 ngày |
| **high** | warning | Gấp, xử lý trong 1-2 ngày |
| **critical** | destructive | Rất gấp, xử lý trong vài giờ |

## Issue Types

- **hardware** - Sự cố liên quan CPU, RAM, HDD, motherboard, etc.
- **software** - Sự cố OS, ứng dụng, driver
- **network** - Sự cố kết nối, WiFi, Ethernet
- **peripheral** - Sự cố keyboard, mouse, monitor, printer
- **other** - Sự cố khác không thuộc danh mục trên

## Database Schema

```sql
-- Table: maintenance_tickets
CREATE TABLE maintenance_tickets (
  id UUID PRIMARY KEY,
  asset_code VARCHAR(50) REFERENCES assets,
  issue_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  assigned_to UUID REFERENCES users,
  estimated_resolution_days INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  closed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: maintenance_notes
CREATE TABLE maintenance_notes (
  id UUID PRIMARY KEY,
  ticket_id UUID REFERENCES maintenance_tickets,
  note_text TEXT NOT NULL,
  status_before VARCHAR(20),
  status_after VARCHAR(20),
  changed_at TIMESTAMP DEFAULT NOW(),
  changed_by UUID REFERENCES users
);
```

## Permissions

### Maintenance Permissions
- `maintenance:create` - Tạo phiếu bảo trì
- `maintenance:read` - Xem danh sách, chi tiết
- `maintenance:update` - Cập nhật trạng thái, ghi chú
- `maintenance:close` - Đóng phiếu
- `maintenance:assign` - Giao công việc cho kỹ thuật viên

**Default Roles:**
- **admin_it** - Tất cả quyền
- **accountant** - Read, Create (limited)
- **dev** - Create, Read, Update, Close
- **user** - Read only

## Workflows

### Standard Repair Workflow
1. User tạo phiếu với loại sự cố + mô tả + ưu tiên
2. Quản trị viên review + giao cho kỹ thuật viên
3. Kỹ thuật viên bắt đầu xử lý → status = in_progress
4. Sau khi giải quyết, thêm ghi chú giải pháp → status = resolved
5. Quản lý confirm + đóng phiếu → status = closed

### Priority-based SLA
- **critical**: Mục tiêu 4 giờ
- **high**: Mục tiêu 1-2 ngày
- **medium**: Mục tiêu 3-5 ngày
- **low**: Mục tiêu 1-2 tuần

## Future Enhancements

1. **Automated Notifications**
   - Email kỹ thuật viên khi assign
   - Reminder khi vượt SLA
   - Notification user khi resolved

2. **Analytics & Reporting**
   - Average resolution time
   - Success rate by technician
   - Issue type frequency
   - Asset reliability scoring

3. **Escalation Rules**
   - Auto escalate if SLA breached
   - Auto assign to supervisor
   - Auto notify management

4. **Integration with Assets**
   - Link maintenance history to asset
   - Auto update asset status (in_maintenance)
   - Track warranty voiding

5. **Mobile Support**
   - Mobile form for field technicians
   - Offline note capability
   - Photo attachment for before/after

## Testing Scenarios

1. Create ticket for laptop → assign to technician → update status to in_progress → add notes → resolve → close
2. Filter by critical priority → verify only critical tickets shown
3. Search "network" → verify all network-related issues returned
4. Edit ticket description while in open status
5. View maintenance history for specific asset
6. Test SLA color coding (green=on-track, yellow=warning, red=overdue)

## Integration Points

### With Assets Module
- Get asset list for dropdown
- Update asset status when in_maintenance
- Create related maintenance history record

### With Users Module
- Get technician list for assignment
- Track technician workload
- Record who closed the ticket

### With Invoices Module
- Link to replacement parts invoice
- Track cost of repairs
- Link to vendor for spare parts
