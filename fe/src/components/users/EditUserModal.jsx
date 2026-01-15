import { Modal } from '@/components/common/Modal'
import { UserForm } from './UserForm'
import { useUpdateUser } from '@/hooks/useUsers'

export function EditUserModal({ isOpen, onClose, user }) {
  const { mutate: updateUser, isPending } = useUpdateUser()

  if (!user) return null

  const handleSubmit = (data) => {
    updateUser(
      {
        employeeCode: user.employee_code,
        data: {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          department: data.department,
          role: data.role,
          status: data.status,
          updated_at: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cập nhật nhân viên"
      description={`Chỉnh sửa thông tin của ${user.full_name}`}
    >
      <UserForm
        initialData={user}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </Modal>
  )
}
