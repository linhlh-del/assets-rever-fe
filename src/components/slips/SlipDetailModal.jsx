// src/components/slips/SlipDetailModal.jsx
// UPDATED: Thêm section file upload (Module 1) + nút gửi email (Module 2)
import { Modal } from "@/components/common/Modal";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { SlipFileUpload } from "./SlipFileUpload";
import { useSlipFiles, useSendSlipEmail } from "@/hooks/useSlips";
import { usePermission } from "@/hooks/usePermission";
import { Mail, CheckCircle } from "lucide-react";

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
  const { role } = usePermission();
  const canManage = ["super_admin", "it_admin"].includes(role);

  // Lấy files của slip
  const { data: filesData, refetch: refetchFiles } = useSlipFiles(
    isOpen && slip?.id ? slip.id : null,
  );
  const files = filesData?.files || [];

  // Email mutation
  const { mutate: sendEmail, isPending: isSending } = useSendSlipEmail();

  if (!slip) return null;

  const isHandover = slip.slip_type === "handover";
  const emailSentAt = slip.email_sent_at;

  const handleSendEmail = () => {
    sendEmail(slip.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Phiếu ${slipTypeLabels[slip.slip_type] || slip.slip_type} — ${slip.slip_number}`}
      size="md"
    >
      <div className="space-y-6 pb-2">
        {/* ── Trạng thái ── */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Trạng thái</span>
          <Badge variant={statusColors[slip.status]}>
            {statusLabels[slip.status] || slip.status}
          </Badge>
        </div>

        {/* ── Thông tin cơ bản ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Số phiếu</p>
            <p className="font-semibold text-sm">{slip.slip_number}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Loại phiếu</p>
            <p className="font-semibold text-sm">
              {slipTypeLabels[slip.slip_type] || slip.slip_type}
            </p>
          </div>

          {/* SLIP-02: created_at thay vì created_date */}
          <div>
            <p className="text-xs text-muted-foreground">Ngày tạo</p>
            <p className="font-semibold text-sm">
              {slip.created_at
                ? new Date(slip.created_at).toLocaleDateString("vi-VN")
                : "—"}
            </p>
          </div>

          {/* SLIP-02: slip_date thay vì assigned_date */}
          <div>
            <p className="text-xs text-muted-foreground">Ngày bàn giao</p>
            <p className="font-semibold text-sm">
              {slip.slip_date
                ? new Date(slip.slip_date).toLocaleDateString("vi-VN")
                : "—"}
            </p>
          </div>

          {/* SLIP-02: to_user_name / to_employee_code */}
          <div>
            <p className="text-xs text-muted-foreground">Người nhận</p>
            <p className="font-semibold text-sm">
              {slip.to_user_name || slip.to_employee_code || "—"}
            </p>
          </div>

          {/* SLIP-02: from_user_name */}
          <div>
            <p className="text-xs text-muted-foreground">Người bàn giao</p>
            <p className="font-semibold text-sm">
              {slip.from_user_name || slip.from_employee_code || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Người tạo phiếu</p>
            <p className="font-semibold text-sm">
              {slip.issued_by_name || slip.issued_by || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Mã NV nhận</p>
            <p className="font-semibold text-sm">
              {slip.to_employee_code || "—"}
            </p>
          </div>
        </div>

        {/* ── Danh sách tài sản ── */}
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
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Serial: {item.serial_number}
                    </p>
                  )}
                  {item.model && (
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Model: {item.model}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Ghi chú ── */}
        {slip.notes && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Ghi chú</p>
            <p className="text-sm bg-muted p-3 rounded">{slip.notes}</p>
          </div>
        )}

        {/* ── Divider ── */}
        <div className="border-t" />

        {/* ── MODULE 1: File section ── */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            📄 File phiếu bàn giao
            {files.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({files.length} file)
              </span>
            )}
          </h4>
          <SlipFileUpload
            slipId={slip.id}
            files={files}
            onUploadSuccess={refetchFiles}
            canManage={canManage}
          />
        </div>

        {/* ── Divider ── */}
        <div className="border-t" />

        {/* ── MODULE 2: Action bar ── */}
        <div className="flex items-center justify-between gap-3">
          {/* Email status indicator */}
          {emailSentAt && (
            <div className="flex items-center gap-1.5 text-xs text-green-700">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                Đã gửi {new Date(emailSentAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
          {!emailSentAt && <div />}

          <div className="flex items-center gap-2">
            {/* Nút gửi email — chỉ hiển thị với phiếu bàn giao */}
            {isHandover && canManage && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendEmail}
                loading={isSending}
                className="flex items-center gap-1.5"
                title="Gửi email thông báo cho nhân viên nhận tài sản"
              >
                <Mail className="w-4 h-4" />
                {emailSentAt ? "Gửi lại email" : "Gửi email"}
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>

        {/* NOTE: approved_date đã bị XÓA — field này không tồn tại trong schema BE */}
      </div>
    </Modal>
  );
}
