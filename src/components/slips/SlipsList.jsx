// src/components/slips/SlipsList.jsx
// UPDATED: Thêm nút email (Module 2) vào cột Thao tác
// FIXED: SLIP-01, SLIP-03, SLIP-04, SLIP-13 (giữ nguyên từ lần fix trước)
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { useSendSlipEmail } from "@/hooks/useSlips";
import { Edit2, Eye, Mail, CheckCircle } from "lucide-react";

// SLIP-03: draft | generated | signed
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

// Row-level email button component — giữ state loading riêng mỗi row
function EmailButton({ slip }) {
  const { mutate: sendEmail, isPending } = useSendSlipEmail();

  // Chỉ hiển thị với handover slips
  if (slip.slip_type !== "handover") return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => sendEmail(slip.id)}
      loading={isPending}
      className="p-1"
      title={
        slip.email_sent_at
          ? `Gửi lại email (đã gửi ${new Date(slip.email_sent_at).toLocaleDateString("vi-VN")})`
          : "Gửi email thông báo cho nhân viên"
      }
    >
      {/* Hiển thị icon khác nhau nếu đã gửi email trước đó */}
      {slip.email_sent_at && !isPending ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Mail className="w-4 h-4" />
      )}
    </Button>
  );
}

export function SlipsList({ slips, isLoading, onEdit, onView }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Số phiếu
            </th>
            {/* SLIP-01: items[0] thay vì asset_name */}
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Tài sản
            </th>
            {/* SLIP-01: to_user_name thay vì assigned_to_name */}
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Người nhận
            </th>
            {/* SLIP-01: Cột loại phiếu */}
            <th className="px-4 py-3 text-left text-sm font-semibold">Loại</th>
            {/* SLIP-01: created_at thay vì created_date */}
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Ngày tạo
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Trạng thái
            </th>
            {/* Cột thao tác — rộng hơn để chứa 3 nút */}
            <th className="px-4 py-3 text-left text-sm font-semibold w-32">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {slips.map((slip) => (
            <tr
              key={slip.id}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              {/* Số phiếu */}
              <td className="px-4 py-3 text-sm font-medium text-primary">
                {slip.slip_number}
              </td>

              {/* SLIP-01: Tài sản từ items[] */}
              <td className="px-4 py-3 text-sm">
                {slip.items && slip.items.length > 0 ? (
                  <span>
                    {slip.items[0].asset_code} – {slip.items[0].product_name}
                    {slip.items.length > 1 && (
                      <span className="ml-1 text-muted-foreground text-xs">
                        (+{slip.items.length - 1})
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>

              {/* SLIP-01: to_user_name / to_employee_code */}
              <td className="px-4 py-3 text-sm">
                {slip.to_user_name || slip.to_employee_code || (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>

              {/* SLIP-01: Loại phiếu */}
              <td className="px-4 py-3 text-sm">
                {slipTypeLabels[slip.slip_type] || slip.slip_type}
              </td>

              {/* SLIP-01: created_at */}
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {slip.created_at
                  ? new Date(slip.created_at).toLocaleDateString("vi-VN")
                  : "—"}
              </td>

              {/* SLIP-03: statusColors đúng */}
              <td className="px-4 py-3 text-sm">
                <Badge variant={statusColors[slip.status]}>
                  {statusLabels[slip.status] || slip.status}
                </Badge>
              </td>

              {/* Thao tác: [👁 Xem] [✏ Ký] [📧 Email] */}
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-1">
                  {/* Xem chi tiết */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(slip)}
                    className="p-1"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {/* SLIP-04: Điều kiện "generated" — nút ký phiếu */}
                  {slip.status === "generated" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(slip)}
                      className="p-1"
                      title="Ký phiếu"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}

                  {/* MODULE 2: Email button — chỉ handover */}
                  <EmailButton slip={slip} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {slips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có phiếu bàn giao nào</p>
        </div>
      )}
    </div>
  );
}

export default SlipsList;
