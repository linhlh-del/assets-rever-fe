import { Modal } from "@/components/common/Modal";
import { SlipForm } from "./SlipForm";
import { useCreateAssignmentSlip } from "@/hooks/useSlips";

export function AddSlipModal({ isOpen, onClose }) {
  const { mutate: createSlip, isPending } = useCreateAssignmentSlip();

  const handleSubmit = (data) => {
    createSlip(
      {
        ...data,
        created_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo phiếu bàn giao"
      description="Tạo phiếu bàn giao tài sản cho nhân viên"
    >
      <SlipForm onSubmit={handleSubmit} isLoading={isPending} />
    </Modal>
  );
}
