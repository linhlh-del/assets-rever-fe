# Users Module Documentation

## Overview

Modul Quản lý nhân viên cung cấp giao diện đầy đủ để:
- Xem danh sách nhân viên với phân trang
- Tìm kiếm và lọc theo bộ phận, vai trò, trạng thái
- Thêm/Sửa/Xóa nhân viên
- Xem chi tiết nhân viên và lịch sử tài sản
- Hành động hàng loạt (bulk update, bulk delete, export)

## File Structure

```
src/components/users/
├── UserForm.jsx              # Form tái sử dụng (create/edit)
├── AddUserModal.jsx          # Modal thêm nhân viên
├── EditUserModal.jsx         # Modal sửa nhân viên
├── DeleteUserDialog.jsx      # Dialog xác nhận xóa
├── UserDetailModal.jsx       # Modal xem chi tiết
├── UserFilters.jsx           # Component lọc/tìm kiếm
├── BulkActionsBar.jsx        # Thanh hành động hàng loạt
├── UsersList.jsx             # Bảng danh sách nhân viên
└── index.js                  # Barrel export

src/pages/UsersPage.jsx       # Trang chính
```

## Components

### UserForm
**Props:**
- `initialData` (object, optional) - Dữ liệu người dùng (nếu editing)
- `onSubmit` (function) - Callback khi submit form
- `isLoading` (boolean) - Trạng thái loading

**Fields:**
- Họ và tên (required)
- Email (required, must end with @rever.vn)
- Mã nhân viên (required, read-only in edit)
- Điện thoại (optional)
- Bộ phận (required)
- Vai trò (required)
- Trạng thái (active/inactive/resigned)

**Validation:**
- Uses `zod` schema with `react-hook-form`
- Email domain restriction to @rever.vn
- Vietnamese error messages

### AddUserModal
Modal to create new user.

```jsx
<AddUserModal 
  isOpen={isOpen} 
  onClose={onClose} 
/>
```

### EditUserModal
Modal to edit existing user.

```jsx
<EditUserModal 
  isOpen={isOpen} 
  onClose={onClose}
  user={userObject}
/>
```

### DeleteUserDialog
Dialog to confirm user deletion (soft delete - sets status to 'resigned').

```jsx
<DeleteUserDialog 
  isOpen={isOpen} 
  onClose={onClose}
  user={userObject}
/>
```

### UserDetailModal
Shows full user details + asset assignment history.

```jsx
<UserDetailModal 
  isOpen={isOpen}
  onClose={onClose}
  user={userObject}
/>
```

**Displays:**
- Basic info (name, code, email, phone, department, role, status)
- Asset assignment history with dates

### UserFilters
Searchable filter component.

```jsx
<UserFilters 
  filters={filterState}
  onFiltersChange={setFilters}
/>
```

**Filter Options:**
- Search (name, email, employee code)
- Department dropdown
- Role dropdown
- Status dropdown
- Clear filters button

### BulkActionsBar
Shows when users are selected. Provides bulk operations.

```jsx
<BulkActionsBar 
  selectedUsers={[employeeCode1, employeeCode2]}
  onSelectionChange={setSelected}
  onExport={handleExport}
/>
```

**Actions:**
- Change department for all selected
- Change status for all selected
- Export selected users to Excel
- Delete all selected users
- Clear selection

### UsersList
Displays users in table format with inline actions.

```jsx
<UsersList 
  users={usersArray}
  isLoading={isLoading}
  selectedUsers={selectedIds}
  onSelectionChange={setSelected}
  onEdit={setEditingUser}
  onDelete={setDeletingUser}
  onView={setViewingUser}
/>
```

**Columns:**
- Checkbox (for selection)
- Employee Code
- Full Name
- Email
- Department
- Role (badge)
- Status (colored badge)
- Actions (View, Edit, Delete buttons)

**Features:**
- Checkbox to select/deselect all
- Click row actions
- Hover effects

## Data Flow

```
UsersPage (state management)
├── isAddModalOpen → AddUserModal
├── editingUser → EditUserModal
├── deletingUser → DeleteUserDialog
├── viewingUser → UserDetailModal
├── filters → UserFilters
├── users (from useUsers hook) → UsersList
└── selectedUsers → BulkActionsBar
```

## Hooks Usage

**Data Fetching:**
```jsx
const { data, isLoading, error } = useUsers({
  search: '',
  department: 'IT',
  role: 'user',
  status: 'active',
  page: 1,
  limit: 20,
})
```

**Mutations:**
```jsx
// Create
const { mutate: createUser, isPending } = useCreateUser()
createUser(userData, { onSuccess: () => {...} })

// Update
const { mutate: updateUser } = useUpdateUser()
updateUser({ employeeCode, data: {...} })

// Delete
const { mutate: deleteUser } = useDeleteUser()
deleteUser(employeeCode)

// Bulk Update
const { mutate: bulkUpdate } = useBulkUpdateUsers()
bulkUpdate({ employeeIds: [...], data: {...} })

// Asset History
const { data: history } = useUserAssetHistory(employeeCode)
```

## Validation Rules

**Email:**
- Must be valid email format
- Must end with @rever.vn
- Used for Google OAuth login

**Employee Code:**
- Cannot contain spaces
- Unique in system
- Cannot be changed after creation

**Department:**
- Must be selected from predefined list
- Changes propagate to asset assignments

**Role:**
- admin_it: Full system access
- accountant: Can manage invoices & reports
- dev: Can create assets & manage maintenance
- user: Can view assets, report maintenance

**Status:**
- active: Can login and use system
- inactive: Temporarily disabled
- resigned: Soft deleted (kept for history)

## Features

### 1. Search
- Real-time search across:
  - Full name
  - Email
  - Employee code
- Resets pagination to page 1

### 2. Filtering
- By department
- By role
- By status
- Chainable (AND logic)
- Shows "Clear filters" when active

### 3. Sorting
- By clicking column headers (future enhancement)
- Default: by employee code ascending

### 4. Pagination
- 20 items per page (configurable)
- Previous/Next buttons
- Shows record count
- Disabled at boundaries

### 5. Bulk Operations
- **Multi-select** checkbox in header
- **Change Department** - bulk department transfer
- **Change Status** - bulk status update
- **Export** - selected users to Excel
- **Delete** - bulk soft delete with confirmation

### 6. Inline Actions
- **View** - opens UserDetailModal
- **Edit** - opens EditUserModal  
- **Delete** - opens DeleteUserDialog

### 7. Export
- Export selected users to Excel
- Format: Mã NV, Họ tên, Email, Bộ phận, Vai trò, Trạng thái, Điện thoại
- File: danh-sach-nhan-vien.xlsx

## Permissions

- **canCreateUser**: Shows "Add" button
- Uses `usePermission()` hook
- Based on user role from auth context

## Error Handling

All mutations include:
- Loading state with spinner
- Success toast notification (Vietnamese)
- Error toast with error message
- Automatic query invalidation

```jsx
// Example error handling
onError: (error) => {
  toast.error(`Lỗi: ${error.message}`)
}
```

## Responsive Design

- **Mobile** (<640px): Single column, vertical filters
- **Tablet** (640px-1024px): 2 columns
- **Desktop** (>1024px): Full table + actions

Table converts to card view on mobile (future enhancement).

## Accessibility

- Proper label associations
- ARIA labels on buttons
- Keyboard navigation
- Clear error messages
- Focus management in modals

## Performance

- **Caching**: 5 minutes (React Query)
- **Pagination**: 20 items per page
- **Debounced Search**: Reduces API calls
- **Lazy loading**: Asset history loads on demand

## Future Enhancements

1. **Sorting** - Click column headers to sort
2. **Advanced Export** - PDF, CSV formats
3. **Import** - Bulk import from Excel
4. **Email** - Send credentials to new users
5. **Departments** - Manage department list
6. **Roles** - Custom role editor
7. **Archive** - View archived users
8. **Audit Log** - Track user changes
9. **Mobile Cards** - Better mobile UX
10. **Bulk Assign Assets** - Assign assets to selected users

## Testing

```jsx
// Mock useUsers hook
vi.mock('@/hooks/useUsers', () => ({
  useUsers: () => ({
    data: {
      data: mockUsers,
      total: mockUsers.length,
    },
    isLoading: false,
  }),
}))

// Mock usePermission hook
vi.mock('@/hooks/usePermission', () => ({
  usePermission: () => ({
    canCreateUser: true,
    canEditUser: true,
    canDeleteUser: true,
  }),
}))
```

## Database Schema

**users table:**
- employee_code (PK)
- full_name
- email (unique, @rever.vn)
- phone (optional)
- department
- role
- status (active/inactive/resigned)
- created_at
- updated_at

**asset_history table:**
- id (PK)
- asset_code (FK)
- user_employee_code (FK)
- from_date
- to_date (nullable)
- department

---

**Last Updated:** Phase 4 - Users Module
**Status:** ✅ Complete
