import { Modal } from "@/components/common/Modal";
import { UserForm } from "./UserForm";
import { useCreateUser } from "@/hooks/useUsers";

export function AddUserModal({ isOpen, onClose }) {
  const { mutate: createUser, isPending } = useCreateUser();

  const handleSubmit = (data) => {
    createUser(
      data, // bỏ created_at — DB tự set DEFAULT now()
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm nhân viên mới"
      description="Điền thông tin để thêm nhân viên mới vào hệ thống"
    >
      <UserForm onSubmit={handleSubmit} isLoading={isPending} />
    </Modal>
  );
}
