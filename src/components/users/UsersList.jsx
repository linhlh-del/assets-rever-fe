import { useState } from "react";
import { ResponsiveTable } from "@/components/common/ResponsiveTable";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Edit2, Trash2, Eye } from "lucide-react";
import { ROLES, ROLE_LABELS } from "@/utils/constants";

const statusColors = {
  active: "success",
  inactive: "default",
  resigned: "secondary",
};

const statusLabels = {
  active: "Đang làm việc",
  inactive: "Tạm dừng",
  resigned: "Nghỉ việc",
};

export function UsersList({
  users,
  isLoading,
  selectedUsers,
  onSelectionChange,
  onEdit,
  onDelete,
  onView,
}) {
  const columns = [
    {
      header: "Mã nhân viên",
      dataKey: "employee_code",
      width: "120px",
    },
    {
      header: "Họ và tên",
      dataKey: "full_name",
    },
    {
      header: "Email",
      dataKey: "email",
    },
    {
      header: "Bộ phận",
      dataKey: "department",
      width: "140px",
    },
    {
      header: "Vai trò",
      dataKey: "role",
      width: "120px",
      render: (role) => (
        <Badge variant="secondary" size="sm">
          {ROLE_LABELS[role] || role} {/* dùng ROLE_LABELS thay vì ROLES */}
        </Badge>
      ),
    },
    {
      header: "Trạng thái",
      dataKey: "status",
      width: "120px",
      render: (status) => (
        <Badge variant={statusColors[status]} size="sm">
          {statusLabels[status] || status}
        </Badge>
      ),
    },
    {
      header: "Hành động",
      dataKey: "actions",
      width: "150px",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row)}
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row)}
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(users.map((u) => u.employee_code));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectUser = (employeeCode, checked) => {
    if (checked) {
      onSelectionChange([...selectedUsers, employeeCode]);
    } else {
      onSelectionChange(selectedUsers.filter((id) => id !== employeeCode));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={
                  selectedUsers.length === users.length && users.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.dataKey}
                className="px-4 py-3 text-left text-sm font-semibold text-foreground"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.employee_code}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.employee_code)}
                  onChange={(e) =>
                    handleSelectUser(user.employee_code, e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
              </td>
              {columns.map((col) => (
                <td
                  key={col.dataKey}
                  className="px-4 py-3 text-sm"
                  style={{ width: col.width }}
                >
                  {col.render
                    ? col.render(user[col.dataKey], user)
                    : user[col.dataKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy nhân viên nào</p>
        </div>
      )}
    </div>
  );
}
