// FIXED: SLIP-02 (sai field names: created_date→created_at, asset_name→items[0],
//         assigned_to_name→to_user_name, assigned_to→to_employee_code,
//         assigned_date→slip_date, bỏ approved_date không tồn tại)
//        SLIP-03 (sai status values: pending/approved/rejected → draft/generated/signed)
import { Modal } from "@/components/common/Modal";
import { Badge } from "@/components/common/Badge";

// SLIP-03: Đúng theo schema BE: draft | generated | signed
const statusColors = {
  draft: "secondary",
  generated: "default",
  signed: "success",
};

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

export function SlipDetailModal({ isOpen, onClose, slip }) {
  if (!slip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Phiếu ${slipTypeLabels[slip.slip_type] || slip.slip_type} — ${slip.slip_number}`}
    >
      <div className="space-y-6">
        {/* Trạng thái */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Trạng thái</span>
          {/* SLIP-03: statusColors/statusLabels đúng */}
          <Badge variant={statusColors[slip.status]}>
            {statusLabels[slip.status] || slip.status}
          </Badge>
        </div>

        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Số phiếu</p>
            <p className="font-semibold">{slip.slip_number}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Loại phiếu</p>
            <p className="font-semibold">
              {slipTypeLabels[slip.slip_type] || slip.slip_type}
            </p>
          </div>

          {/* SLIP-02: created_at thay vì created_date */}
          <div>
            <p className="text-sm text-muted-foreground">Ngày tạo</p>
            <p className="font-semibold">
              {slip.created_at
                ? new Date(slip.created_at).toLocaleDateString("vi-VN")
                : "—"}
            </p>
          </div>

          {/* SLIP-02: slip_date thay vì assigned_date */}
          <div>
            <p className="text-sm text-muted-foreground">Ngày bàn giao</p>
            <p className="font-semibold">
              {slip.slip_date
                ? new Date(slip.slip_date).toLocaleDateString("vi-VN")
                : "—"}
            </p>
          </div>

          {/* SLIP-02: to_user_name / to_employee_code thay vì assigned_to_name / assigned_to */}
          <div>
            <p className="text-sm text-muted-foreground">Người nhận</p>
            <p className="font-semibold">
              {slip.to_user_name || slip.to_employee_code || "—"}
            </p>
          </div>

          {/* SLIP-02: Thêm from_user_name / from_employee_code (trước đây không có) */}
          <div>
            <p className="text-sm text-muted-foreground">Người bàn giao</p>
            <p className="font-semibold">
              {slip.from_user_name || slip.from_employee_code || "—"}
            </p>
          </div>

          {/* issued_by_name: người tạo phiếu — field tồn tại trong response BE */}
          <div>
            <p className="text-sm text-muted-foreground">Người tạo phiếu</p>
            <p className="font-semibold">
              {slip.issued_by_name || slip.issued_by || "—"}
            </p>
          </div>

          {/* Mã nhân viên nhận */}
          <div>
            <p className="text-sm text-muted-foreground">Mã NV nhận</p>
            <p className="font-semibold">{slip.to_employee_code || "—"}</p>
          </div>
        </div>

        {/* SLIP-02: Danh sách tài sản từ items[] thay vì asset_name/asset_code trực tiếp */}
        {slip.items && slip.items.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">
              Tài sản trong phiếu ({slip.items.length})
            </h4>
            <div className="space-y-2">
              {slip.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium">
                    {item.asset_code} – {item.product_name}
                  </p>
                  {item.serial_number && (
                    <p className="text-muted-foreground mt-0.5">
                      Serial: {item.serial_number}
                    </p>
                  )}
                  {item.model && (
                    <p className="text-muted-foreground mt-0.5">
                      Model: {item.model}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ghi chú */}
        {slip.notes && (
          <div>
            <p className="text-sm text-muted-foreground">Ghi chú</p>
            <p className="text-sm bg-muted p-3 rounded">{slip.notes}</p>
          </div>
        )}

        {/* NOTE: approved_date đã bị XÓA — field này không tồn tại trong schema BE */}
      </div>
    </Modal>
  );
}
