import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { Search, X } from "lucide-react";

const SLIP_STATUSES = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

export function SlipFilters({ filters, onFiltersChange }) {
  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value, page: 1 });
  };

  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value || null, page: 1 });
  };

  const handleDateFromChange = (value) => {
    onFiltersChange({ ...filters, dateFrom: value || null, page: 1 });
  };

  const handleDateToChange = (value) => {
    onFiltersChange({ ...filters, dateTo: value || null, page: 1 });
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      status: null,
      dateFrom: null,
      dateTo: null,
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.search || filters.status || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo số phiếu, tên tài sản..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Status Filter */}
        <Select
          value={filters.status || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {SLIP_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>

        {/* Date From */}
        <Input
          type="date"
          placeholder="Từ ngày"
          value={filters.dateFrom || ""}
          onChange={(e) => handleDateFromChange(e.target.value)}
        />

        {/* Date To */}
        <Input
          type="date"
          placeholder="Đến ngày"
          value={filters.dateTo || ""}
          onChange={(e) => handleDateToChange(e.target.value)}
        />

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
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
