import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { useUserAssetAllocationReport } from "@/hooks/useReports";
import { UserFilters } from "@/components/users/UserFilters";
import { UsersList } from "@/components/users/UsersList";
import { exportToExcel } from "@/utils/exportUtils";

export default function UserHistoryPage() {
  // Filters
  const [filters, setFilters] = useState({
    search: "",
    department: null,
    role: null,
    status: null,
    page: 1,
    limit: 20,
  });

  // Data
  const { data, isLoading } = useUserAssetAllocationReport(filters);
  const users = data?.data || [];
  const total = data?.total || 0;

  // Export
  const handleExport = () => {
    const exportData = users.map((user) => ({
      "Mã nhân viên": user.employee_code,
      "Họ và tên": user.full_name,
      Email: user.email,
      "Bộ phận": user.department,
      "Số tài sản đang sử dụng": user.asset_count || 0,
      "Tổng giá trị tài sản": user.total_asset_value || 0,
    }));
    exportToExcel(exportData, "lich-su-nguoi-dung");
  };

  // Pagination
  const handleNextPage = () => {
    setFilters((f) => ({ ...f, page: f.page + 1 }));
  };

  const handlePrevPage = () => {
    if (filters.page > 1) {
      setFilters((f) => ({ ...f, page: f.page - 1 }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lịch Sử Người Dùng</h1>
          <p className="text-muted-foreground">
            Xem lịch sử phân công tài sản cho nhân viên
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          Xuất Excel
        </Button>
      </div>

      {/* Filters */}
      <UserFilters filters={filters} onFiltersChange={setFilters} />

      {/* Users Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg border">
          <UsersList
            users={users}
            isLoading={isLoading}
            onView={() => {}} // No action for now
          />
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(filters.page - 1) * filters.limit + 1} đến{" "}
            {Math.min(filters.page * filters.limit, total)} của {total} nhân
            viên
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={filters.page === 1}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={filters.page * filters.limit >= total}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
