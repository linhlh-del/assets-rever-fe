import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { useDeleteUser } from '@/hooks/useUsers'
import { AlertCircle } from 'lucide-react'

export function DeleteUserDialog({ isOpen, onClose, user }) {
  const [password, setPassword] = useState('')
  const { mutate: deleteUser, isPending } = useDeleteUser()

  if (!user) return null

  const handleDelete = () => {
    deleteUser(user.employee_code, {
      onSuccess: () => {
        setPassword('')
        onClose()
      },
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xóa nhân viên"
      className="max-w-md"
    >
      <div className="space-y-4">
        {/* Warning message */}
        <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Cảnh báo</p>
            <p className="text-sm text-red-800 mt-1">
              Bạn sắp xóa nhân viên <strong>{user.full_name}</strong>. Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Confirmation text */}
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm">
            Loại bỏ nhân viên sẽ đặt trạng thái thành "Nghỉ việc". Tất cả tài sản của nhân viên sẽ được đánh dấu là "Khả dụng".
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={isPending}
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </div>
      </div>
    </Modal>
  )
}
