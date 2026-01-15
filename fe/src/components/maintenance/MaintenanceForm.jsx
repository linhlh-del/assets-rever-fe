import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Textarea } from '@/components/common/Textarea'
import { Button } from '@/components/common/Button'

const maintenanceSchema = z.object({
  asset_code: z.string().min(1, 'Chọn tài sản'),
  issue_type: z.enum(['hardware', 'software', 'network', 'peripheral', 'other'], {
    errorMap: () => ({ message: 'Chọn loại sự cố' })
  }),
  description: z.string().min(10, 'Mô tả phải từ 10 ký tự'),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    errorMap: () => ({ message: 'Chọn độ ưu tiên' })
  }),
  assigned_to: z.string().optional(),
  estimated_resolution_days: z.number().min(1).max(30).optional(),
})

export function MaintenanceForm({
  onSubmit,
  isLoading,
  defaultValues,
  assets = [],
  technicians = [],
  isEditMode = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: defaultValues || {
      priority: 'medium',
      estimated_resolution_days: 5,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Asset Selection */}
      <div>
        <label className="text-sm font-medium">Tài sản</label>
        <Select {...register('asset_code')} disabled={isEditMode}>
          <option value="">Chọn tài sản</option>
          {assets.map(asset => (
            <option key={asset.asset_code} value={asset.asset_code}>
              {asset.asset_code} - {asset.product_name}
            </option>
          ))}
        </Select>
        {errors.asset_code && (
          <p className="text-xs text-destructive mt-1">{errors.asset_code.message}</p>
        )}
      </div>

      {/* Issue Type */}
      <div>
        <label className="text-sm font-medium">Loại sự cố</label>
        <Select {...register('issue_type')}>
          <option value="">Chọn loại sự cố</option>
          <option value="hardware">Phần cứng (Hardware)</option>
          <option value="software">Phần mềm (Software)</option>
          <option value="network">Mạng (Network)</option>
          <option value="peripheral">Ngoại vi (Peripheral)</option>
          <option value="other">Khác (Other)</option>
        </Select>
        {errors.issue_type && (
          <p className="text-xs text-destructive mt-1">{errors.issue_type.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Mô tả sự cố</label>
        <Textarea
          {...register('description')}
          placeholder="Mô tả chi tiết vấn đề cần khắc phục..."
          rows={4}
        />
        {errors.description && (
          <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Priority & Estimated Days */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Độ ưu tiên</label>
          <Select {...register('priority')}>
            <option value="low">Thấp (Low)</option>
            <option value="medium">Trung bình (Medium)</option>
            <option value="high">Cao (High)</option>
            <option value="critical">Rất cao (Critical)</option>
          </Select>
          {errors.priority && (
            <p className="text-xs text-destructive mt-1">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Ngày dự kiến (1-30)</label>
          <Input
            type="number"
            {...register('estimated_resolution_days', { valueAsNumber: true })}
            placeholder="5"
            min="1"
            max="30"
          />
          {errors.estimated_resolution_days && (
            <p className="text-xs text-destructive mt-1">{errors.estimated_resolution_days.message}</p>
          )}
        </div>
      </div>

      {/* Assign Technician */}
      <div>
        <label className="text-sm font-medium">Giao cho kỹ thuật viên (tùy chọn)</label>
        <Select {...register('assigned_to')}>
          <option value="">Chưa giao cho ai</option>
          {technicians.map(tech => (
            <option key={tech.id} value={tech.id}>
              {tech.full_name} ({tech.email})
            </option>
          ))}
        </Select>
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className="flex-1"
        >
          {isEditMode ? 'Cập nhật' : 'Tạo phiếu bảo trì'}
        </Button>
      </div>
    </form>
  )
}
