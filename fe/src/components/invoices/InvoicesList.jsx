import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Eye, FileText, CheckCircle } from 'lucide-react'

const statusColors = {
  pending: 'default',
  confirmed: 'success',
  processed: 'secondary',
}

const statusLabels = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  processed: 'Đã xử lý',
}

export function InvoicesList({
  invoices,
  isLoading,
  onView,
  onConfirm,
}) {
  const columns = [
    {
      header: 'Số hóa đơn',
      dataKey: 'invoice_number',
      width: '140px',
    },
    {
      header: 'Nhà cung cấp',
      dataKey: 'vendor_name',
    },
    {
      header: 'Ngày hóa đơn',
      dataKey: 'invoice_date',
      width: '120px',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Tổng tiền',
      dataKey: 'total_amount',
      width: '140px',
      render: (amount) => (
        <span>{amount?.toLocaleString('vi-VN')} VNĐ</span>
      ),
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
    {
      header: 'Tài liệu',
      dataKey: 'files_count',
      width: '100px',
      render: (_, row) => (
        <Badge variant="outline" size="sm">
          {row.invoice_files?.length || 0} file
        </Badge>
      ),
    },
    {
      header: 'Hành động',
      dataKey: 'actions',
      width: '150px',
    },
  ]

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
          {invoices.map((invoice) => (
            <tr
              key={invoice.invoice_number}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.dataKey}
                  className="px-4 py-3 text-sm"
                  style={{ width: col.width }}
                >
                  {col.dataKey === 'actions' ? (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(invoice)}
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {invoice.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onConfirm(invoice)}
                          title="Xác nhận"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : col.render ? (
                    col.render(invoice[col.dataKey], invoice)
                  ) : (
                    invoice[col.dataKey]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {invoices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy hóa đơn nào</p>
        </div>
      )}
    </div>
  )
}
