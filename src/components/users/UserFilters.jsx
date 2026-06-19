import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { Search, X } from "lucide-react";
import { ROLES, ROLE_LABELS } from "@/utils/constants";
import { useDepartments } from "@/hooks/useDepartments";

export function UserFilters({ filters, onFiltersChange }) {
  const { departments = [] } = useDepartments();

  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value, page: 1 });
  };

  const handleDepartmentChange = (value) => {
    onFiltersChange({ ...filters, department: value || null, page: 1 });
  };

  const handleRoleChange = (value) => {
    onFiltersChange({ ...filters, role: value || null, page: 1 });
  };

  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value || "active", page: 1 });
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      department: null,
      role: null,
      status: "active",
      page: 1,
      limit: filters.limit || 20,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.department ||
    filters.role ||
    (filters.status && filters.status !== "active");

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên, email, hoặc mã nhân viên..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Department Filter — UUID từ API */}
        <Select
          value={filters.department || ""}
          onChange={(e) => handleDepartmentChange(e.target.value)}
        >
          <option value="">Tất cả bộ phận</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.parent_name
                ? `${dept.parent_name} › ${dept.name}`
                : dept.name}
            </option>
          ))}
        </Select>

        {/* Role Filter */}
        <Select
          value={filters.role || ""}
          onChange={(e) => handleRoleChange(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          {Object.entries(ROLES).map(([key, value]) => (
            <option key={key} value={value}>
              {ROLE_LABELS[value]}
            </option>
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang làm việc</option>
          <option value="inactive">Tạm dừng</option>
          <option value="resigned">Nghỉ việc</option>
        </Select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
