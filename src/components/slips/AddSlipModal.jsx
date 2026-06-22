// FIXED: SLIP-06 — Bỏ created_at khỏi payload submit
//   BE tự quản lý created_at (DEFAULT now()), gửi thêm là antipattern
//   và có thể gây lỗi nếu BE strict về unknown fields
import { Modal } from "@/components/common/Modal";
import { SlipForm } from "./SlipForm";
import { useCreateAssignmentSlip } from "@/hooks/useSlips";

export function AddSlipModal({ isOpen, onClose }) {
  const { mutate: createSlip, isPending } = useCreateAssignmentSlip();

  const handleSubmit = (data) => {
    // SLIP-06: Bỏ created_at — BE tự set
    // data từ SlipForm đã có đúng format: { to_employee_code, asset_ids, notes }
    createSlip(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo phiếu bàn giao"
      description="Bàn giao tài sản cho nhân viên"
    >
      <SlipForm onSubmit={handleSubmit} isLoading={isPending} />
    </Modal>
  );
}
