import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { usePermission } from "@/hooks/usePermission";
import { Edit2, Eye, Send, RotateCcw } from "lucide-react";

const statusLabels = {
  available: "Khả dụng",
  in_use: "Đang sử dụng",
  maintenance: "Bảo trì",
  broken: "Hỏng hóc",
  disposed: "Đã thanh lý",
};

const statusColors = {
  available: "success",
  in_use: "primary",
  maintenance: "default",
  broken: "secondary",
  disposed: "secondary",
};

export function AssetsList({
  assets,
  isLoading,
  onView,
  onEdit,
  onAssign,
  onReturn,
}) {
  const { role } = usePermission();
  const isRegularUser = role === "user";

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
            <th className="px-4 py-3 text-left text-sm font-semibold w-32">
              Mã tài sản
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Tên sản phẩm
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold w-28">
              Loại
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold w-32">
              Trạng thái
            </th>
            {/* ✅ FIX 2: Cột "Người sử dụng" dùng đúng field */}
            <th className="px-4 py-3 text-left text-sm font-semibold w-36">
              Người sử dụng
            </th>
            {/* Giá chỉ hiện với admin/dev */}
            {!isRegularUser && (
              <th className="px-4 py-3 text-left text-sm font-semibold w-32">
                Giá (VNĐ)
              </th>
            )}
            <th className="px-4 py-3 text-left text-sm font-semibold w-40">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr
              key={asset.id}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              {/* Mã tài sản */}
              <td className="px-4 py-3 text-sm font-medium text-primary">
                {asset.asset_code}
              </td>

              {/* Tên sản phẩm */}
              <td className="px-4 py-3 text-sm">
                <div className="font-medium">{asset.product_name}</div>
                {asset.model && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {asset.model}
                  </div>
                )}
              </td>

              {/* Loại */}
              <td className="px-4 py-3 text-sm capitalize">{asset.category}</td>

              {/* Trạng thái */}
              <td className="px-4 py-3 text-sm">
                <Badge variant={statusColors[asset.status]} size="sm">
                  {statusLabels[asset.status] || asset.status}
                </Badge>
              </td>

              {/* ✅ Người sử dụng — dùng current_user_employee_code */}
              <td className="px-4 py-3 text-sm">
                {asset.current_user_employee_code ? (
                  <span className="font-medium">
                    {asset.current_user_employee_code}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>

              {/* Giá */}
              {!isRegularUser && (
                <td className="px-4 py-3 text-sm">
                  {asset.purchase_price
                    ? asset.purchase_price.toLocaleString("vi-VN")
                    : "—"}
                </td>
              )}

              {/* Hành động */}
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(asset)}
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {!isRegularUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(asset)}
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}

                  {asset.status === "available" && !isRegularUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAssign(asset)}
                      title="Phân công"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  )}

                  {asset.status === "in_use" && !isRegularUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReturn(asset)}
                      title="Thu hồi"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy tài sản nào</p>
        </div>
      )}
    </div>
  );
}
