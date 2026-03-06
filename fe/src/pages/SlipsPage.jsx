import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { useAssignmentSlips } from "@/hooks/useSlips";
import { SlipFilters } from "@/components/slips/SlipFilters";
import { SlipsList } from "@/components/slips/SlipsList";
import { AddSlipModal } from "@/components/slips/AddSlipModal";
import { EditSlipModal } from "@/components/slips/EditSlipModal";
import { SlipDetailModal } from "@/components/slips/SlipDetailModal";
import { usePermission } from "@/hooks/usePermission";
import { Plus } from "lucide-react";

export default function SlipsPage() {
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSlip, setEditingSlip] = useState(null);
  const [viewingSlip, setViewingSlip] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: null,
    dateFrom: null,
    dateTo: null,
    page: 1,
    limit: 20,
  });

  // Permissions
  const { canCreateSlip } = usePermission();

  // Data
  const { data, isLoading } = useAssignmentSlips(filters);
  const slips = data?.data || [];
  const total = data?.total || 0;

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
          <h1 className="text-3xl font-bold">Phiếu Bàn Giao</h1>
          <p className="text-muted-foreground">
            Quản lý phiếu bàn giao tài sản cho nhân viên
          </p>
        </div>
        {canCreateSlip && (
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo phiếu mới
          </Button>
        )}
      </div>

      {/* Filters */}
      <SlipFilters filters={filters} onFiltersChange={setFilters} />

      {/* Slips Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg border">
          <SlipsList
            slips={slips}
            isLoading={isLoading}
            onEdit={setEditingSlip}
            onView={setViewingSlip}
          />
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(filters.page - 1) * filters.limit + 1} đến{" "}
            {Math.min(filters.page * filters.limit, total)} của {total} phiếu
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

      {/* Modals */}
      <AddSlipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditSlipModal
        isOpen={!!editingSlip}
        onClose={() => setEditingSlip(null)}
        slip={editingSlip}
      />
      <SlipDetailModal
        isOpen={!!viewingSlip}
        onClose={() => setViewingSlip(null)}
        slip={viewingSlip}
      />
    </div>
  );
}
