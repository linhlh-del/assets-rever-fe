// FIXED: SLIP-04 (3 vấn đề):
//   1. approveSlip nhận slip.id (UUID) thay vì slip.slip_number
//   2. Đổi nhãn "Duyệt phiếu" → "Ký phiếu" cho đúng nghiệp vụ (status → 'signed')
//   3. Điều kiện hiển thị nút Edit trong SlipsList đã được fix ở SlipsList.jsx
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { useApproveAssignmentSlip } from "@/hooks/useSlips";

const statusLabels = {
  draft: "Bản nháp",
  generated: "Đã tạo",
  signed: "Đã ký",
};

const slipTypeLabels = {
  handover: "Bàn giao",
  return: "Thu hồi",
  transfer: "Chuyển giao",
};

export function EditSlipModal({ isOpen, onClose, slip }) {
  // SLIP-09: useApproveAssignmentSlip đã được fix để invalidate đúng cache key
  const { mutate: approveSlip, isPending } = useApproveAssignmentSlip();

  const handleApprove = () => {
    // SLIP-04: Truyền slip.id (UUID) thay vì slip.slip_number
    approveSlip(slip.id, {
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
      // SLIP-04: Đổi tiêu đề thành "Ký phiếu" thay vì "Duyệt phiếu"
      title={`Ký phiếu — ${slip.slip_number}`}
    >
      <div className="space-y-4">
        {/* Thông tin phiếu */}
        <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Số phiếu</span>
            <span className="font-medium">{slip.slip_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Loại</span>
            <span className="font-medium">
              {slipTypeLabels[slip.slip_type] || slip.slip_type}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Người nhận</span>
            <span className="font-medium">
              {slip.to_user_name || slip.to_employee_code || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ngày bàn giao</span>
            <span className="font-medium">
              {slip.slip_date
                ? new Date(slip.slip_date).toLocaleDateString("vi-VN")
                : "—"}
            </span>
          </div>
          {slip.notes && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ghi chú</span>
              <span className="font-medium">{slip.notes}</span>
            </div>
          )}
        </div>

        {/* Danh sách tài sản */}
        {slip.items && slip.items.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">
              Tài sản trong phiếu ({slip.items.length})
            </p>
            <div className="space-y-1">
              {slip.items.map((item, idx) => (
                <div key={idx} className="text-sm p-2 bg-muted/50 rounded">
                  {item.asset_code} – {item.product_name}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Xác nhận ký phiếu sẽ đổi trạng thái sang <strong>Đã ký</strong> và
          hoàn tất luồng bàn giao.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          {/* SLIP-04: Đổi nhãn "Duyệt phiếu" → "Ký phiếu" */}
          <Button onClick={handleApprove} loading={isPending}>
            Ký phiếu
          </Button>
        </div>
      </div>
    </Modal>
  );
}
