import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { Search, X } from "lucide-react";
import { DEPARTMENTS } from "@/utils/constants";

const categories = [
  "Máy tính",
  "Điện thoại",
  "Ngoại vi",
  "Mạng",
  "Tủ lạnh",
  "Đồ nội thất",
  "Khác",
];

const statuses = [
  { value: "available", label: "Khả dụng" },
  { value: "in_use", label: "Đang sử dụng" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "broken", label: "Hỏng hóc" },
  { value: "disposed", label: "Đã thanh lý" },
];

export function AssetFilters({ filters, onFiltersChange }) {
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
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã, tên, serial..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Category Filter */}
        <Select
          value={filters.category || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Tất cả loại</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>

        {/* Status Filter */}
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

        {/* Department Filter */}
        <Select
          value={filters.department || ""}
          onChange={(e) => handleDepartmentChange(e.target.value)}
        >
          <option value="">Tất cả bộ phận</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </Select>

        {/* Reset Button */}
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
