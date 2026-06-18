import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { useApproveAssignmentSlip } from "@/hooks/useSlips";

export function EditSlipModal({ isOpen, onClose, slip }) {
  const { mutate: approveSlip, isPending } = useApproveAssignmentSlip();

  const handleApprove = () => {
    approveSlip(slip.slip_number, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!slip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Duyệt phiếu bàn giao"
      description={`Phiếu ${slip.slip_number} - ${slip.asset_name}`}
    >
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Chi tiết phiếu</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Tài sản:</strong> {slip.asset_name}
            </p>
            <p>
              <strong>Người nhận:</strong> {slip.assigned_to_name}
            </p>
            <p>
              <strong>Ngày bàn giao:</strong>{" "}
              {new Date(slip.assigned_date).toLocaleDateString("vi-VN")}
            </p>
            {slip.notes && (
              <p>
                <strong>Ghi chú:</strong> {slip.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleApprove} isLoading={isPending}>
            Duyệt phiếu
          </Button>
        </div>
      </div>
    </Modal>
  );
}
