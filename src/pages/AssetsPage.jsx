import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { useAssets, useDeleteAsset } from "@/hooks/useAssets";
import { AssetFilters } from "@/components/assets/AssetFilters";
import { AssetsList } from "@/components/assets/AssetsList";
import { AddAssetModal } from "@/components/assets/AddAssetModal";
import { EditAssetModal } from "@/components/assets/EditAssetModal";
import { AssignAssetModal } from "@/components/assets/AssignAssetModal";
import { ReturnAssetModal } from "@/components/assets/ReturnAssetModal";
import { useCanCreateAsset, usePermission } from "@/hooks/usePermission";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AssetsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const canCreate = useCanCreateAsset();
  const { role } = usePermission();

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assigningAsset, setAssigningAsset] = useState(null);
  const [returningAsset, setReturningAsset] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    category: null,
    status: null,
    department: null,
    page: 1,
    limit: 20,
  });

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const { data, error, isLoading } = useAssets({
    category: filters.category,
    department: filters.department,
    limit: filters.limit,
    page: filters.page,
    search: filters.search,
    status: filters.status,
  });

  const { mutate: deleteAsset } = useDeleteAsset();

  const handleDelete = (asset) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa tài sản ${asset.asset_code}? Hành động này không thể hoàn tác.`,
      )
    ) {
      return;
    }
    deleteAsset(asset.id, {
      onSuccess: () => {
        toast.success(`Đã xóa tài sản ${asset.asset_code}`);
      },
      onError: (err) => {
        toast.error(`Lỗi xóa tài sản: ${err.message}`);
      },
    });
  };

  // ─── Parse response ───────────────────────────────────────────────────────
  // getAssets() (sau Fix 1) return { assets: [...], pagination: { total, page, limit } }
  // data ở đây = return value của getAssets(), KHÔNG phải axios response
  const rawAssets = data?.assets || [];
  const pagination = data?.pagination || { total: 0 };
  const total = pagination.total || 0;

  // Role "user" chỉ thấy tài sản đang dùng của mình
  // Lý tưởng nhất là filter ở BE (gửi thêm param employee_code),
  // nhưng hiện tại BE chưa support → filter ở FE tạm thời
  const assets =
    role === "user" && user
      ? rawAssets.filter(
          (a) => a.current_user_employee_code === user.employee_code,
        )
      : rawAssets;

  // Nếu filter FE thì total sẽ sai so với số thật trên DB,
  // nhưng chấp nhận được cho đến khi BE hỗ trợ filter theo employee
  const displayTotal = role === "user" ? assets.length : total;
  const totalPages = Math.max(1, Math.ceil(displayTotal / filters.limit));

  // ─── Auth guard ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  if (!user) return null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="font-bold text-red-800">❌ Lỗi tải dữ liệu</p>
          <p className="text-sm text-red-700 mt-1">{error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Tải lại
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý tài sản</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? "Đang tải..."
              : displayTotal > 0
                ? `${displayTotal} tài sản`
                : "Chưa có tài sản nào"}
          </p>
        </div>
        {canCreate && (
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm tài sản
          </Button>
        )}
      </div>

      {/* Filters */}
      <AssetFilters filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
      {isLoading ? (
        <Loading />
      ) : assets.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <p className="text-gray-500 text-lg">Không tìm thấy tài sản nào</p>
          <p className="text-gray-400 text-sm mt-2">
            Hãy thêm tài sản mới hoặc thay đổi bộ lọc tìm kiếm
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <AssetsList
            assets={assets}
            isLoading={isLoading}
            onView={(asset) => navigate(`/assets/${asset.id}`)}
            onEdit={setEditingAsset}
            onAssign={setAssigningAsset}
            onReturn={setReturningAsset}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Pagination — chỉ hiện khi không filter theo role user */}
      {displayTotal > 0 && role !== "user" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị{" "}
            {Math.min((filters.page - 1) * filters.limit + 1, displayTotal)}–
            {Math.min(filters.page * filters.limit, displayTotal)} /{" "}
            {displayTotal} tài sản
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              disabled={filters.page <= 1}
            >
              Trang trước
            </Button>
            <span className="px-3 py-1 text-sm text-muted-foreground">
              {filters.page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              disabled={filters.page >= totalPages}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditAssetModal
        isOpen={!!editingAsset}
        onClose={() => setEditingAsset(null)}
        asset={editingAsset}
      />
      <AssignAssetModal
        isOpen={!!assigningAsset}
        onClose={() => setAssigningAsset(null)}
        asset={assigningAsset}
      />
      <ReturnAssetModal
        isOpen={!!returningAsset}
        onClose={() => setReturningAsset(null)}
        asset={returningAsset}
      />
    </div>
  );
}
