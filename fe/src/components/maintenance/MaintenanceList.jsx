import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AlertCircle, Eye, Clock } from 'lucide-react'

const statusColors = {
  open: 'default',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'secondary',
}

const statusLabels = {
  open: 'Đang mở',
  in_progress: 'Đang xử lý',
  resolved: 'Đã giải quyết',
  closed: 'Đóng',
}

const priorityColors = {
  low: 'outline',
  medium: 'secondary',
  high: 'warning',
  critical: 'destructive',
}

const priorityLabels = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Rất cao',
}

const issueTypeLabels = {
  hardware: 'Hardware',
  software: 'Software',
  network: 'Network',
  peripheral: 'Ngoại vi',
  other: 'Khác',
}

export function MaintenanceList({
  records,
  isLoading,
  onView,
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-semibold">Tài sản</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Loại sự cố</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Mô tả</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Độ ưu tiên</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Ngày tạo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold w-20">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              {/* Asset Code */}
              <td className="px-4 py-3 text-sm font-medium">
                {record.asset_code}
              </td>

              {/* Issue Type */}
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  {issueTypeLabels[record.issue_type] || record.issue_type}
                </div>
              </td>

              {/* Description */}
              <td className="px-4 py-3 text-sm truncate max-w-xs">
                {record.description}
              </td>

              {/* Priority */}
              <td className="px-4 py-3 text-sm">
                <Badge variant={priorityColors[record.priority]} size="sm">
                  {priorityLabels[record.priority]}
                </Badge>
              </td>

              {/* Status */}
              <td className="px-4 py-3 text-sm">
                <Badge variant={statusColors[record.status]} size="sm">
                  {statusLabels[record.status]}
                </Badge>
              </td>

              {/* Created Date */}
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {new Date(record.created_at).toLocaleDateString('vi-VN')}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(record)}
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {records.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy phiếu bảo trì nào</p>
        </div>
      )}
    </div>
  )
}
