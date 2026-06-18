import { Modal } from '@/components/common/Modal'
import { Badge } from '@/components/common/Badge'
import { Card } from '@/components/common/Card'
import { useUserAssetHistory } from '@/hooks/useUsers'
import { ROLES } from '@/utils/constants'
import { Mail, Phone, Building2, Calendar } from 'lucide-react'

export function UserDetailModal({ isOpen, onClose, user }) {
  const { data: assetHistory, isLoading } = useUserAssetHistory(user?.employee_code)

  if (!user) return null

  const statusColors = {
    active: 'success',
    inactive: 'default',
    resigned: 'secondary',
  }

  const statusLabels = {
    active: 'Đang làm việc',
    inactive: 'Tạm dừng',
    resigned: 'Nghỉ việc',
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết nhân viên"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{user.full_name}</h3>
                <p className="text-sm text-muted-foreground">{user.employee_code}</p>
              </div>
              <Badge variant={statusColors[user.status]}>
                {statusLabels[user.status]}
              </Badge>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {/* Email */}
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium break-all">{user.email}</p>
                </div>
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Điện thoại</p>
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              {/* Department */}
              <div className="flex gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Bộ phận</p>
                  <p className="text-sm font-medium">{user.department}</p>
                </div>
              </div>

              {/* Role */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Vai trò</p>
                <Badge variant="secondary" size="sm">
                  {ROLES[user.role] || user.role}
                </Badge>
              </div>

              {/* Created Date */}
              {user.created_at && (
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tham gia</p>
                    <p className="text-sm font-medium">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Asset History */}
        <div>
          <h4 className="font-semibold mb-3">Lịch sử tài sản</h4>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : assetHistory && assetHistory.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {assetHistory.map((item, idx) => (
                <Card key={idx} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {item.assets?.product_name || item.asset_code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.asset_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.from_date).toLocaleDateString('vi-VN')}
                        {item.to_date && ` - ${new Date(item.to_date).toLocaleDateString('vi-VN')}`}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có lịch sử tài sản
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}
