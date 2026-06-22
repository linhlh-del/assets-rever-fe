// FIXED: SLIP-01 (sai field names), SLIP-03 (sai status), SLIP-04 (điều kiện nút Edit),
//        SLIP-13 (bỏ ResponsiveTable, dùng <table> HTML thủ công nhất quán với MaintenanceList)
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Edit2, Eye } from "lucide-react";

// SLIP-03: Đổi từ pending/approved/rejected → draft/generated/signed
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

// SLIP-01: Thêm label loại phiếu
const slipTypeLabels = {
  handover: "Bàn giao",
  return: "Thu hồi",
  transfer: "Chuyển giao",
};

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
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Số phiếu
            </th>
            {/* SLIP-01: Hiển thị items[0] thay vì asset_name không tồn tại */}
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Tài sản
            </th>
            {/* SLIP-01: to_user_name thay vì assigned_to_name */}
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Người nhận
            </th>
            {/* SLIP-01: Thêm cột loại phiếu */}
            <th className="px-4 py-3 text-left text-sm font-semibold">Loại</th>
            {/* SLIP-01: created_at thay vì created_date */}
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Ngày tạo
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold w-28">
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
              <td className="px-4 py-3 text-sm font-medium">
                {slip.slip_number}
              </td>

              {/* SLIP-01: Tài sản từ items[] thay vì asset_name */}
              <td className="px-4 py-3 text-sm">
                {slip.items && slip.items.length > 0 ? (
                  <span>
                    {slip.items[0].asset_code} – {slip.items[0].product_name}
                    {slip.items.length > 1 && (
                      <span className="ml-1 text-muted-foreground">
                        (+{slip.items.length - 1})
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>

              {/* SLIP-01: to_user_name / to_employee_code thay vì assigned_to_name */}
              <td className="px-4 py-3 text-sm">
                {slip.to_user_name || slip.to_employee_code || (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>

              {/* SLIP-01: Loại phiếu từ slip_type */}
              <td className="px-4 py-3 text-sm">
                {slipTypeLabels[slip.slip_type] || slip.slip_type}
              </td>

              {/* SLIP-01: created_at thay vì created_date */}
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {slip.created_at
                  ? new Date(slip.created_at).toLocaleDateString("vi-VN")
                  : "—"}
              </td>

              {/* SLIP-03: statusColors/statusLabels đúng theo draft/generated/signed */}
              <td className="px-4 py-3 text-sm">
                <Badge variant={statusColors[slip.status]}>
                  {statusLabels[slip.status] || slip.status}
                </Badge>
              </td>

              {/* Thao tác */}
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(slip)}
                    className="p-1"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {/* SLIP-04: Điều kiện đúng — "generated" thay vì "pending" (không tồn tại) */}
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
