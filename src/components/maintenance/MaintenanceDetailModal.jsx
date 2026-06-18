import { Modal } from '@/components/common/Modal'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Textarea } from '@/components/common/Textarea'
import { useUpdateMaintenance, useCloseMaintenance } from '@/hooks/useMaintenance'
import { useState } from 'react'
import { AlertCircle, Calendar, User, Clock, Check } from 'lucide-react'

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

export function MaintenanceDetailModal({ isOpen, onClose, record }) {
  const [resolution, setResolution] = useState('')
  const { mutate: updateMaintenance, isPending: isUpdating } = useUpdateMaintenance()
  const { mutate: closeMaintenance, isPending: isClosing } = useCloseMaintenance()

  if (!record) return null

  const handleResolve = () => {
    updateMaintenance(
      { id: record.id, status: 'resolved', resolution_notes: resolution },
      {
        onSuccess: () => {
          setResolution('')
        },
      }
    )
  }

  const handleClose = () => {
    closeMaintenance(record.id, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const handleMarkInProgress = () => {
    updateMaintenance(
      { id: record.id, status: 'in_progress' },
      { onSuccess: () => {} }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết phiếu bảo trì"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{record.asset_code}</h3>
              <p className="text-sm text-muted-foreground">{record.issue_type}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={priorityColors[record.priority]}>
                {priorityLabels[record.priority]}
              </Badge>
              <Badge variant={statusColors[record.status]}>
                {statusLabels[record.status]}
              </Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Created Date */}
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Ngày tạo</p>
                <p className="text-sm font-medium">
                  {new Date(record.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Estimated Days */}
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Ngày dự kiến giải quyết</p>
                <p className="text-sm font-medium">{record.estimated_resolution_days} ngày</p>
              </div>
            </div>

            {/* Assigned To */}
            {record.assigned_to && (
              <div className="flex gap-3">
                <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Giao cho</p>
                  <p className="text-sm font-medium">{record.assigned_to}</p>
                </div>
              </div>
            )}

            {/* Resolution Date */}
            {record.resolved_at && (
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Ngày giải quyết</p>
                  <p className="text-sm font-medium">
                    {new Date(record.resolved_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Mô tả vấn đề</p>
            <p className="text-sm">{record.description}</p>
          </div>
        </Card>

        {/* Resolution Notes (if exists) */}
        {record.resolution_notes && (
          <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900">
            <p className="text-xs text-green-600 dark:text-green-400 mb-2 font-semibold">Ghi chú giải quyết</p>
            <p className="text-sm">{record.resolution_notes}</p>
          </Card>
        )}

        {/* Maintenance History */}
        {record.maintenance_history && record.maintenance_history.length > 0 && (
          <Card>
            <h4 className="font-semibold mb-3">Lịch sử thay đổi</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {record.maintenance_history.map((entry, idx) => (
                <div key={idx} className="p-2 bg-muted rounded text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium">{statusLabels[entry.status]}</span>
                    <span className="text-muted-foreground">
                      {new Date(entry.changed_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  {entry.notes && <p className="text-muted-foreground mt-1">{entry.notes}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-4 border-t">
          {record.status === 'open' && (
            <Button
              variant="warning"
              className="w-full"
              onClick={handleMarkInProgress}
              loading={isUpdating}
            >
              Bắt đầu xử lý
            </Button>
          )}

          {record.status === 'in_progress' && (
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Ghi chú giải quyết</label>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Mô tả cách đã khắc phục vấn đề..."
                  rows={3}
                />
              </div>
              <Button
                variant="success"
                className="w-full"
                onClick={handleResolve}
                loading={isUpdating}
                disabled={!resolution.trim()}
              >
                Đánh dấu đã giải quyết
              </Button>
            </div>
          )}

          {record.status === 'resolved' && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleClose}
              loading={isClosing}
            >
              Đóng phiếu bảo trì
            </Button>
          )}

          {record.status !== 'closed' && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={onClose}
            >
              Hủy
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
