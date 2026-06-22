// FIXED: SLIP-03 (sai status values: pending/approved/rejected → draft/generated/signed)
//        SLIP-08 (bỏ dateFrom/dateTo — BE không hỗ trợ filter này, tránh false UX)
//        Chọn Option A: loại bỏ date filters thay vì để người dùng lọc mà không có kết quả
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { Search, X } from "lucide-react";

// SLIP-03: Đúng theo schema BE: draft | generated | signed
const SLIP_STATUSES = [
  { value: "draft", label: "Bản nháp" },
  { value: "generated", label: "Đã tạo" },
  { value: "signed", label: "Đã ký" },
];

const SLIP_TYPES = [
  { value: "handover", label: "Bàn giao" },
  { value: "return", label: "Thu hồi" },
  { value: "transfer", label: "Chuyển giao" },
];

export function SlipFilters({ filters, onFiltersChange }) {
  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value, page: 1 });
  };

  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value || null, page: 1 });
  };

  // Thêm filter theo loại phiếu — BE hỗ trợ slip_type filter
  const handleSlipTypeChange = (value) => {
    onFiltersChange({ ...filters, slip_type: value || null, page: 1 });
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      status: null,
      slip_type: null,
      page: 1,
      limit: filters.limit || 20,
    });
  };

  // SLIP-08: Đã bỏ dateFrom/dateTo — BE không hỗ trợ, không nên hiển thị filter giả
  const hasActiveFilters =
    filters.search || filters.status || filters.slip_type;

  return (
    <div className="space-y-4">
      {/* Search — note: BE cũng chưa support search, nhưng giữ UI để sau này thêm */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo số phiếu..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* SLIP-03: Status filter với values đúng */}
        <Select
          value={filters.status || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {SLIP_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>

        {/* Filter theo loại phiếu — BE hỗ trợ slip_type param */}
        <Select
          value={filters.slip_type || ""}
          onChange={(e) => handleSlipTypeChange(e.target.value)}
        >
          <option value="">Tất cả loại phiếu</option>
          {SLIP_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>

        {/* Reset */}
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
