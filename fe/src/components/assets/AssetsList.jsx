import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { usePermission } from '@/hooks/usePermission'
import { Edit2, Trash2, Eye, Send, RotateCcw } from 'lucide-react'
import { ASSET_STATUS_COLORS } from '@/utils/constants'

const statusLabels = {
  available: 'Khả dụng',
  in_use: 'Đang sử dụng',
  maintenance: 'Bảo trì',
  broken: 'Hỏng hóc',
  disposed: 'Đã thanh lý',
}

const statusColors = {
  available: 'success',
  in_use: 'primary',
  maintenance: 'default',
  broken: 'secondary',
  disposed: 'secondary',
}

export function AssetsList({
  assets,
  isLoading,
  onView,
  onEdit,
  onAssign,
  onReturn,
  onReport,
  onDispose,
}) {
  const { role } = usePermission()
  const isRegularUser = role === 'user'

  let columns = [
    {
      header: 'Mã tài sản',
      dataKey: 'asset_code',
      width: '120px',
    },
    {
      header: 'Tên sản phẩm',
      dataKey: 'product_name',
    },
    {
      header: 'Loại',
      dataKey: 'category',
      width: '100px',
    },
    {
      header: 'Trạng thái',
      dataKey: 'status',
      width: '120px',
      render: (status) => (
        <Badge variant={statusColors[status]} size="sm">
          {statusLabels[status] || status}
        </Badge>
      ),
    },
  ]

  // Admin & Dev see full details
  if (!isRegularUser) {
    columns.push(
      {
        header: 'Bộ phận',
        dataKey: 'current_department',
        width: '120px',
      },
      {
        header: 'Giá (VNĐ)',
        dataKey: 'purchase_price',
        width: '120px',
        render: (price) => (
          <span>{price?.toLocaleString('vi-VN') || '-'}</span>
        ),
      }
    )
  }

  columns.push({
    header: 'Hành động',
    dataKey: 'actions',
    width: '200px',
  })

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
            {columns.map((col) => (
              <th
                key={col.dataKey}
                className="px-4 py-3 text-left text-sm font-semibold text-foreground"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr
              key={asset.asset_code}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.dataKey}
                  className="px-4 py-3 text-sm"
                  style={{ width: col.width }}
                >
                  {col.dataKey === 'actions' ? (
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(asset)}
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(asset)}
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {asset.status === 'available' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAssign(asset)}
                          title="Phân công"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      {asset.status === 'in_use' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReturn(asset)}
                          title="Thu hồi"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : col.render ? (
                    col.render(asset[col.dataKey], asset)
                  ) : (
                    asset[col.dataKey]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {assets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy tài sản nào</p>
        </div>
      )}
    </div>
  )
}
