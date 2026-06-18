import { ResponsiveTable } from "@/components/common/ResponsiveTable";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Edit2, Eye } from "lucide-react";

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

export function SlipsList({ slips, isLoading, onEdit, onView }) {
  const columns = [
    {
      header: "Số phiếu",
      dataKey: "slip_number",
      width: "120px",
    },
    {
      header: "Tài sản",
      dataKey: "asset_name",
    },
    {
      header: "Người nhận",
      dataKey: "assigned_to_name",
    },
    {
      header: "Ngày tạo",
      dataKey: "created_date",
      width: "120px",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      header: "Trạng thái",
      dataKey: "status",
      width: "120px",
      render: (value) => (
        <Badge variant={statusColors[value]}>{statusLabels[value]}</Badge>
      ),
    },
    {
      header: "Thao tác",
      dataKey: "actions",
      width: "120px",
      render: (_, slip) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(slip)}
            className="p-1"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {slip.status === "pending" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(slip)}
              className="p-1"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      data={slips}
      isLoading={isLoading}
      emptyMessage="Không có phiếu bàn giao nào"
    />
  );
}
