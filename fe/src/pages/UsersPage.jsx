import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/common/Button'
import { Loading } from '@/components/common/Loading'
import { useUsers } from '@/hooks/useUsers'
import { UserFilters } from '@/components/users/UserFilters'
import { BulkActionsBar } from '@/components/users/BulkActionsBar'
import { UsersList } from '@/components/users/UsersList'
import { AddUserModal } from '@/components/users/AddUserModal'
import { EditUserModal } from '@/components/users/EditUserModal'
import { DeleteUserDialog } from '@/components/users/DeleteUserDialog'
import { UserDetailModal } from '@/components/users/UserDetailModal'
import { usePermission } from '@/hooks/usePermission'
import { exportToExcel } from '@/utils/exportUtils'
import { Plus } from 'lucide-react'

export default function UsersPage() {
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)

  // Selection & filters
  const [selectedUsers, setSelectedUsers] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    department: null,
    role: null,
    status: null,
    page: 1,
    limit: 20,
  })

  // Permissions
  const { canCreateUser } = usePermission()

  // Data
  const { data, isLoading } = useUsers(filters)
  const users = data?.data || []
  const total = data?.total || 0

  // Export selected users
  const handleExportSelected = (employeeIds) => {
    const selectedUsersData = users.filter(u => employeeIds.includes(u.employee_code))
    const exportData = selectedUsersData.map(u => ({
      'Mã nhân viên': u.employee_code,
      'Họ và tên': u.full_name,
      'Email': u.email,
      'Bộ phận': u.department,
      'Vai trò': u.role,
      'Trạng thái': u.status,
      'Điện thoại': u.phone || '',
    }))
    exportToExcel(exportData, 'danh-sach-nhan-vien')
  }

  // Pagination
  const handleNextPage = () => {
    setFilters(f => ({ ...f, page: f.page + 1 }))
  }

  const handlePrevPage = () => {
    if (filters.page > 1) {
      setFilters(f => ({ ...f, page: f.page - 1 }))
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
            <p className="text-muted-foreground">
              Quản lý danh sách nhân viên, phân quyền, và lịch sử tài sản
            </p>
          </div>
          {canCreateUser && (
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm nhân viên
            </Button>
          )}
        </div>

        {/* Filters */}
        <UserFilters filters={filters} onFiltersChange={setFilters} />

        {/* Bulk Actions */}
        <BulkActionsBar
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          onExport={handleExportSelected}
        />

        {/* Users Table */}
        {isLoading ? (
          <Loading />
        ) : (
          <div className="bg-white rounded-lg border">
            <UsersList
              users={users}
              isLoading={isLoading}
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              onEdit={setEditingUser}
              onDelete={setDeletingUser}
              onView={setViewingUser}
            />
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {(filters.page - 1) * filters.limit + 1} đến{' '}
              {Math.min(filters.page * filters.limit, total)} của {total} nhân viên
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={filters.page === 1}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={filters.page * filters.limit >= total}
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />
      <DeleteUserDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        user={deletingUser}
      />
      <UserDetailModal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
      />
    </Layout>
  )
}
