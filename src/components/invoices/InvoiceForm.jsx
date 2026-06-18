import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'

const invoiceSchema = z.object({
  invoice_number: z.string().min(1, 'Số hóa đơn không được để trống'),
  vendor_name: z.string().min(1, 'Tên nhà cung cấp không được để trống'),
  invoice_date: z.string().min(1, 'Ngày hóa đơn không được để trống'),
  total_amount: z.coerce.number().positive('Tổng tiền phải lớn hơn 0'),
  notes: z.string().optional(),
})

export function InvoiceForm({ initialData, onSubmit, isLoading, isEditing }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData || {
      invoice_number: '',
      vendor_name: '',
      invoice_date: '',
      total_amount: '',
      notes: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Invoice Number */}
      <div>
        <label className="block text-sm font-medium mb-1">Số hóa đơn *</label>
        <Input
          {...register('invoice_number')}
          placeholder="INV-2024-001"
          error={errors.invoice_number?.message}
          disabled={isLoading || isEditing}
          className={isEditing ? 'bg-muted cursor-not-allowed' : ''}
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground mt-1">
            Không thể thay đổi số hóa đơn
          </p>
        )}
      </div>

      {/* Vendor Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên nhà cung cấp *</label>
        <Input
          {...register('vendor_name')}
          placeholder="Apple Vietnam"
          error={errors.vendor_name?.message}
          disabled={isLoading}
        />
      </div>

      {/* Invoice Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Ngày hóa đơn *</label>
        <Input
          {...register('invoice_date')}
          type="date"
          error={errors.invoice_date?.message}
          disabled={isLoading}
        />
      </div>

      {/* Total Amount */}
      <div>
        <label className="block text-sm font-medium mb-1">Tổng tiền (VNĐ) *</label>
        <Input
          {...register('total_amount')}
          type="number"
          placeholder="100000000"
          error={errors.total_amount?.message}
          disabled={isLoading}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <textarea
          {...register('notes')}
          placeholder="Thông tin bổ sung..."
          rows="3"
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={isLoading}
      >
        {isEditing ? 'Cập nhật' : 'Tạo hóa đơn'}
      </Button>
    </form>
  )
}
