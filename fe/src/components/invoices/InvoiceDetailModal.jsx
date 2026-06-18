import { Modal } from '@/components/common/Modal'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { InvoiceFileUpload } from './InvoiceFileUpload'
import { useConfirmInvoice } from '@/hooks/useInvoices'
import { FileText, Calendar, DollarSign, Building2 } from 'lucide-react'

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

export function InvoiceDetailModal({ isOpen, onClose, invoice }) {
  const { mutate: confirmInvoice, isPending } = useConfirmInvoice()

  if (!invoice) return null

  const handleConfirm = () => {
    confirmInvoice(invoice.invoice_number, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết hóa đơn"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{invoice.invoice_number}</h3>
              <p className="text-sm text-muted-foreground">{invoice.vendor_name}</p>
            </div>
            <Badge variant={statusColors[invoice.status]}>
              {statusLabels[invoice.status]}
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Invoice Date */}
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Ngày hóa đơn</p>
                <p className="text-sm font-medium">
                  {new Date(invoice.invoice_date).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Tổng tiền</p>
                <p className="text-sm font-medium">
                  {invoice.total_amount?.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div>

            {/* Vendor */}
            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Nhà cung cấp</p>
                <p className="text-sm font-medium">{invoice.vendor_name}</p>
              </div>
            </div>

            {/* Created Date */}
            {invoice.created_at && (
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Ngày tạo</p>
                  <p className="text-sm font-medium">
                    {new Date(invoice.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-1">Ghi chú</p>
              <p className="text-sm">{invoice.notes}</p>
            </div>
          )}
        </Card>

        {/* Files */}
        <InvoiceFileUpload
          invoiceNumber={invoice.invoice_number}
          invoiceFiles={invoice.invoice_files}
        />

        {/* Assets (if any) */}
        {invoice.assets && invoice.assets.length > 0 && (
          <Card>
            <h4 className="font-semibold mb-3">Tài sản từ hóa đơn ({invoice.assets.length})</h4>
            <div className="space-y-2">
              {invoice.assets.map((asset, idx) => (
                <div key={idx} className="p-2 bg-muted rounded text-sm">
                  <p className="font-medium">{asset.product_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {asset.asset_code} • {asset.quantity} cái
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        {invoice.status === 'pending' && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              loading={isPending}
              onClick={handleConfirm}
            >
              Xác nhận hóa đơn
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
