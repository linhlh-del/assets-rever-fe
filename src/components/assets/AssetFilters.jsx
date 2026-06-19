import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { Search, X } from "lucide-react";
import {
  ASSET_CATEGORIES,
  ASSET_STATUS_LABELS,
  ASSET_STATUS,
} from "@/utils/constants";
import { useDepartments } from "@/hooks/useDepartments";

// statuses build từ constants — không hardcode
const statuses = Object.entries(ASSET_STATUS).map(([, value]) => ({
  value,
  label: ASSET_STATUS_LABELS[value],
}));

export function AssetFilters({ filters, onFiltersChange }) {
  // Department filter dùng API thật — giống UserFilters
  const { departments = [], isLoading: deptLoading } = useDepartments();

  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value, page: 1 });
  };

  const handleCategoryChange = (value) => {
    onFiltersChange({ ...filters, category: value || null, page: 1 });
  };

  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value || null, page: 1 });
  };

  const handleDepartmentChange = (value) => {
    // Gửi department_id (UUID) lên BE, không phải tên text
    onFiltersChange({ ...filters, department: value || null, page: 1 });
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      category: null,
      status: null,
      department: null,
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.search || filters.category || filters.status || filters.department;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã, tên, serial..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Category — 13 giá trị từ constants, khớp CHECK constraint VPS */}
        <Select
          value={filters.category || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Tất cả loại</option>
          {ASSET_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </Select>

        {/* Status — từ constants */}
        <Select
          value={filters.status || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>

        {/* Department — UUID từ API, giống UserFilters */}
        <Select
          value={filters.department || ""}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          disabled={deptLoading}
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
