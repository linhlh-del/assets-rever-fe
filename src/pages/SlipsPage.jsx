// FIXED:
//   SLIP-07: Xác nhận parse response đúng (data?.data và data?.total)
//   SLIP-08: Truyền slip_type filter xuống SlipFilters và service
//   SLIP-12: Thêm nút "Tạo phiếu thu hồi" và ReturnSlipModal
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { Modal } from "@/components/common/Modal";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { useAssignmentSlips, useCreateAssignmentSlip } from "@/hooks/useSlips";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReturnSlip } from "@/services/slipService";
import { SlipFilters } from "@/components/slips/SlipFilters";
import { SlipsList } from "@/components/slips/SlipsList";
import { AddSlipModal } from "@/components/slips/AddSlipModal";
import { EditSlipModal } from "@/components/slips/EditSlipModal";
import { SlipDetailModal } from "@/components/slips/SlipDetailModal";
import { usePermission } from "@/hooks/usePermission";
import { useAssets } from "@/hooks/useAssets";
import { Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// ─── SLIP-12: Return Slip Modal (tạo phiếu thu hồi độc lập) ──────────────────
function ReturnSlipModal({ isOpen, onClose }) {
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: assetsData } = useAssets({ status: "in_use", limit: 200 });
  const assets = assetsData?.assets || [];

  const { mutate: doReturn, isPending } = useMutation({
    mutationFn: () => createReturnSlip({ asset_ids: [selectedAssetId], notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slips"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Tạo phiếu thu hồi thành công");
      setSelectedAssetId("");
      setNotes("");
      onClose();
    },
    onError: (err) => toast.error(`Lỗi: ${err.message}`),
  });

  const handleSubmit = () => {
    if (!selectedAssetId) {
      toast.error("Vui lòng chọn tài sản cần thu hồi");
      return;
    }
    doReturn();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo phiếu thu hồi"
      description="Thu hồi tài sản từ nhân viên"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tài sản cần thu hồi <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            disabled={isPending}
          >
            <option value="">Chọn tài sản (đang sử dụng)</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.asset_code} – {asset.product_name}
                {asset.current_user_employee_code
                  ? ` (${asset.current_user_employee_code})`
                  : ""}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ghi chú</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Lý do thu hồi, tình trạng thiết bị..."
            rows={3}
            disabled={isPending}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} loading={isPending}>
            Tạo phiếu thu hồi
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SlipsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // SLIP-12: Thêm state cho Return Slip Modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [editingSlip, setEditingSlip] = useState(null);
  const [viewingSlip, setViewingSlip] = useState(null);

  // SLIP-08: Thêm slip_type vào filters state
  const [filters, setFilters] = useState({
    search: "",
    status: null,
    slip_type: null, // SLIP-08: filter mới khớp với BE
    page: 1,
    limit: 20,
  });

  const { canCreateSlip } = usePermission();

  // SLIP-07: data?.data và data?.total — đã đúng, slipService trả { data: [], total }
  const { data, isLoading } = useAssignmentSlips(filters);
  const slips = data?.data || [];
  const total = data?.total || 0;

  const handleNextPage = () => setFilters((f) => ({ ...f, page: f.page + 1 }));
  const handlePrevPage = () => {
    if (filters.page > 1) setFilters((f) => ({ ...f, page: f.page - 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phiếu Bàn Giao</h1>
          <p className="text-muted-foreground">
            Quản lý phiếu bàn giao và thu hồi tài sản
          </p>
        </div>

        {canCreateSlip && (
          <div className="flex gap-2">
            {/* SLIP-12: Nút tạo phiếu thu hồi */}
            <Button
              variant="outline"
              onClick={() => setIsReturnModalOpen(true)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Tạo phiếu thu hồi
            </Button>

            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo phiếu bàn giao
            </Button>
          </div>
        )}
      </div>

      {/* SLIP-08: SlipFilters nhận filters có slip_type */}
      <SlipFilters filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
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
      {/* SLIP-12: Return Slip Modal */}
      <ReturnSlipModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
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
