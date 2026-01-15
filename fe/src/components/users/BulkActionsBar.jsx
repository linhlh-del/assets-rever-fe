import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { Trash2, Download } from 'lucide-react'
import { useBulkUpdateUsers } from '@/hooks/useUsers'
import { DEPARTMENTS } from '@/utils/constants'

export function BulkActionsBar({ selectedUsers, onSelectionChange, onExport }) {
  const { mutate: bulkUpdate, isPending } = useBulkUpdateUsers()

  if (selectedUsers.length === 0) return null

  const handleBulkDepartmentChange = (department) => {
    bulkUpdate(
      {
        employeeIds: selectedUsers,
        data: { department },
      },
      {
        onSuccess: () => {
          onSelectionChange([])
        },
      }
    )
  }

  const handleBulkStatusChange = (status) => {
    bulkUpdate(
      {
        employeeIds: selectedUsers,
        data: { status },
      },
      {
        onSuccess: () => {
          onSelectionChange([])
        },
      }
    )
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} nhân viên?`)) {
      bulkUpdate(
        {
          employeeIds: selectedUsers,
          data: { status: 'resigned' },
        },
        {
          onSuccess: () => {
            onSelectionChange([])
          },
        }
      )
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-blue-900">
        Đã chọn {selectedUsers.length} nhân viên
      </span>

      {/* Department bulk action */}
      <Select
        value=""
        onChange={(e) => handleBulkDepartmentChange(e.target.value)}
        disabled={isPending}
        className="text-sm w-40"
      >
        <option value="">Thay đổi bộ phận...</option>
        {DEPARTMENTS.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </Select>

      {/* Status bulk action */}
      <Select
        value=""
        onChange={(e) => handleBulkStatusChange(e.target.value)}
        disabled={isPending}
        className="text-sm w-40"
      >
        <option value="">Thay đổi trạng thái...</option>
        <option value="active">Đang làm việc</option>
        <option value="inactive">Tạm dừng</option>
        <option value="resigned">Nghỉ việc</option>
      </Select>

      <div className="ml-auto flex gap-2">
        {/* Export button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport(selectedUsers)}
          className="flex items-center gap-2"
          disabled={isPending}
        >
          <Download className="w-4 h-4" />
          Xuất
        </Button>

        {/* Delete button */}
        <Button
          variant="danger"
          size="sm"
          onClick={handleBulkDelete}
          loading={isPending}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </Button>

        {/* Clear selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectionChange([])}
          disabled={isPending}
        >
          Bỏ chọn
        </Button>
      </div>
    </div>
  )
}
