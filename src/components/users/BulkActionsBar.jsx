import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Trash2, Download } from "lucide-react";
import { useBulkUpdateUsers } from "@/hooks/useUsers";

export function BulkActionsBar({ selectedUsers, onSelectionChange, onExport }) {
  const { mutate: bulkUpdate, isPending } = useBulkUpdateUsers();

  if (selectedUsers.length === 0) return null;

  const handleBulkStatusChange = (status) => {
    if (!status) return;
    bulkUpdate(
      {
        employeeIds: selectedUsers,
        data: { status },
      },
      {
        onSuccess: () => onSelectionChange([]),
      },
    );
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} nhân viên?`)
    ) {
      bulkUpdate(
        {
          employeeIds: selectedUsers,
          data: { status: "resigned" },
        },
        {
          onSuccess: () => onSelectionChange([]),
        },
      );
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-blue-900">
        Đã chọn {selectedUsers.length} nhân viên
      </span>

      {/* Status bulk action */}
      <Select
        value=""
        onChange={(e) => handleBulkStatusChange(e.target.value)}
        disabled={isPending}
        className="text-sm w-44"
      >
        <option value="">Thay đổi trạng thái...</option>
        <option value="active">Đang làm việc</option>
        <option value="inactive">Tạm dừng</option>
        <option value="resigned">Nghỉ việc</option>
      </Select>

      <div className="ml-auto flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport(selectedUsers)}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Xuất
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={handleBulkDelete}
          loading={isPending}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectionChange([])}
          disabled={isPending}
        >
          Bỏ chọn
        </Button>
      </div>
    </div>
  );
}
