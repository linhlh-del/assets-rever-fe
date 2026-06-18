import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { Search, X } from 'lucide-react'

const issueTypes = [
  { value: 'hardware', label: 'Phần cứng' },
  { value: 'software', label: 'Phần mềm' },
  { value: 'network', label: 'Mạng' },
  { value: 'peripheral', label: 'Ngoại vi' },
  { value: 'other', label: 'Khác' },
]

const statuses = [
  { value: 'open', label: 'Đang mở' },
  { value: 'in_progress', label: 'Đang xử lý' },
  { value: 'resolved', label: 'Đã giải quyết' },
  { value: 'closed', label: 'Đóng' },
]

const priorities = [
  { value: 'low', label: 'Thấp' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'high', label: 'Cao' },
  { value: 'critical', label: 'Rất cao' },
]

export function MaintenanceFilters({ filters, onFiltersChange }) {
  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value, page: 1 })
  }

  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value || null, page: 1 })
  }

  const handlePriorityChange = (value) => {
    onFiltersChange({ ...filters, priority: value || null, page: 1 })
  }

  const handleReset = () => {
    onFiltersChange({ search: '', status: null, priority: null, page: 1 })
  }

  const hasActiveFilters = filters.search || filters.status || filters.priority

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã tài sản hoặc mô tả..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {/* Status */}
        <Select
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>

        {/* Priority */}
        <Select
          value={filters.priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value)}
        >
          <option value="">Tất cả độ ưu tiên</option>
          {priorities.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </Select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2 justify-center"
          >
            <X className="w-4 h-4" />
            Xóa lọc
          </Button>
        )}
      </div>
    </div>
  )
}
