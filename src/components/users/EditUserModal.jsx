import { Modal } from "@/components/common/Modal";
import { UserForm } from "./UserForm";
import { useUpdateUser } from "@/hooks/useUsers";

export function EditUserModal({ isOpen, onClose, user }) {
  const { mutate: updateUser, isPending } = useUpdateUser();

  if (!user) return null;

  const handleSubmit = (data) => {
    // Chỉ gửi các field userUpdateSchema cho phép
    // department_id và job_title_id phải là UUID từ dropdown động
    const payload = {
      full_name: data.full_name,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      phone: data.phone || null,
      department_id: data.department_id || null, // UUID, không phải text
      job_title_id: data.job_title_id || null, // UUID, không phải text
      report_to: data.report_to || null,
      role: data.role,
      status: data.status,
    };

    updateUser(
      { employeeCode: user.employee_code, data: payload },
      { onSuccess: () => onClose() },
    );
  };

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
  );
}
