import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { Search, X } from 'lucide-react'

const statuses = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'processed', label: 'Đã xử lý' },
]

export function InvoiceFilters({ filters, onFiltersChange }) {
  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value, page: 1 })
  }

  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value || null, page: 1 })
  }

  const handleVendorChange = (value) => {
    onFiltersChange({ ...filters, vendor: value || null, page: 1 })
  }

  const handleReset = () => {
    onFiltersChange({ search: '', status: null, vendor: null, page: 1 })
  }

  const hasActiveFilters = filters.search || filters.status || filters.vendor

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo số hóa đơn hoặc nhà cung cấp..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Status Filter */}
        <Select
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  )
}
