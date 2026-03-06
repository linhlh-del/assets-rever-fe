import { Modal } from "@/components/common/Modal";
import { Badge } from "@/components/common/Badge";

const statusColors = {
  pending: "default",
  approved: "success",
  rejected: "secondary",
};

const statusLabels = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

export function SlipDetailModal({ isOpen, onClose, slip }) {
  if (!slip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Phiếu bàn giao ${slip.slip_number}`}
      description="Chi tiết phiếu bàn giao tài sản"
    >
      <div className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Trạng thái:</span>
          <Badge variant={statusColors[slip.status]}>
            {statusLabels[slip.status]}
          </Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Số phiếu</p>
            <p className="font-semibold">{slip.slip_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày tạo</p>
            <p className="font-semibold">
              {new Date(slip.created_date).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tài sản</p>
            <p className="font-semibold">{slip.asset_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mã tài sản</p>
            <p className="font-semibold">{slip.asset_code}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Người nhận</p>
            <p className="font-semibold">{slip.assigned_to_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mã nhân viên</p>
            <p className="font-semibold">{slip.assigned_to}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày bàn giao</p>
            <p className="font-semibold">
              {new Date(slip.assigned_date).toLocaleDateString("vi-VN")}
            </p>
          </div>
          {slip.approved_date && (
            <div>
              <p className="text-sm text-muted-foreground">Ngày duyệt</p>
              <p className="font-semibold">
                {new Date(slip.approved_date).toLocaleDateString("vi-VN")}
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        {slip.notes && (
          <div>
            <p className="text-sm text-muted-foreground">Ghi chú</p>
            <p className="text-sm bg-gray-50 p-3 rounded">{slip.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
