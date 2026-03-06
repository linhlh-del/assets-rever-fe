import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { useAssetListReport } from "@/hooks/useReports";
import { AssetFilters } from "@/components/assets/AssetFilters";
import { AssetsList } from "@/components/assets/AssetsList";
import { exportToExcel } from "@/utils/exportUtils";

export default function AssetHistoryPage() {
  const navigate = useNavigate();

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    category: null,
    status: null,
    department: null,
    page: 1,
    limit: 20,
  });

  // Data
  const { data, isLoading } = useAssetListReport(filters);
  const assets = data?.data || [];
  const total = data?.total || 0;

  // Export
  const handleExport = () => {
    const exportData = assets.map((asset) => ({
      "Mã tài sản": asset.asset_code,
      "Tên sản phẩm": asset.product_name,
      "Danh mục": asset.category,
      "Trạng thái": asset.status,
      "Bộ phận": asset.department,
      "Người sử dụng": asset.current_user_name || "-",
      "Ngày mua": asset.purchase_date
        ? new Date(asset.purchase_date).toLocaleDateString("vi-VN")
        : "-",
    }));
    exportToExcel(exportData, "lich-su-tai-san");
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
          <h1 className="text-3xl font-bold">Lịch Sử Tài Sản</h1>
          <p className="text-muted-foreground">
            Xem lịch sử và trạng thái của tất cả tài sản
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
      <AssetFilters filters={filters} onFiltersChange={setFilters} />

      {/* Assets Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg border">
          <AssetsList
            assets={assets}
            isLoading={isLoading}
            onView={(asset) => navigate(`/assets/${asset.asset_code}`)}
          />
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(filters.page - 1) * filters.limit + 1} đến{" "}
            {Math.min(filters.page * filters.limit, total)} của {total} tài sản
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
