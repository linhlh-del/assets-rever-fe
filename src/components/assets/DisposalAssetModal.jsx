import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { useDisposeAsset } from "@/hooks/useAssets";
import { toast } from "sonner";

const DISPOSAL_REASON_TYPES = [
  { value: "irreparable", label: "Không thể sửa chữa" },
  { value: "obsolete", label: "Lỗi thời / hết hạn sử dụng" },
  { value: "cost_exceeds_value", label: "Chi phí sửa > giá trị thiết bị" },
  { value: "upgrade", label: "Nâng cấp thay thế" },
  { value: "other", label: "Khác" },
];

export function DisposalAssetModal({ isOpen, onClose, asset }) {
  const [disposalDate, setDisposalDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [reasonType, setReasonType] = useState("");
  const [reason, setReason] = useState("");
  const [disposalPrice, setDisposalPrice] = useState("");

  const { mutate: disposeAsset, isPending } = useDisposeAsset();

  if (!asset) return null;

  const handleDispose = () => {
    if (!reasonType) {
      toast.error("Vui lòng chọn loại lý do thanh lý");
      return;
    }
    if (!reason.trim() || reason.trim().length < 10) {
      toast.error("Lý do thanh lý phải có ít nhất 10 ký tự");
      return;
    }

    disposeAsset(
      {
        assetId: asset.id,
        data: {
          status: "disposed",
          disposal_date: disposalDate,
          disposal_reason_type: reasonType,
          disposal_reason: reason.trim(),
          disposal_price: disposalPrice ? Number(disposalPrice) : null,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Đã thanh lý tài sản ${asset.asset_code}`);
          setReasonType("");
          setReason("");
          setDisposalPrice("");
          onClose();
        },
        onError: (error) => {
          toast.error(`Lỗi thanh lý: ${error.message}`);
        },
      },
    );
  };

  const handleClose = () => {
    setReasonType("");
    setReason("");
    setDisposalPrice("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Thanh lý tài sản"
      description={`Xác nhận thanh lý ${asset.product_name}`}
      className="max-w-md"
    >
      <div className="space-y-4">
        <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
          <p>
            <strong>Mã:</strong> {asset.asset_code}
          </p>
          <p>
            <strong>Tên:</strong> {asset.product_name}
          </p>
          <p>
            <strong>Trạng thái hiện tại:</strong> {asset.status}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày thanh lý <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={disposalDate}
            onChange={(e) => setDisposalDate(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Loại lý do <span className="text-red-500">*</span>
          </label>
          <Select
            value={reasonType}
            onChange={(e) => setReasonType(e.target.value)}
            disabled={isPending}
          >
            <option value="">-- Chọn loại lý do --</option>
            {DISPOSAL_REASON_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Lý do chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Mô tả lý do thanh lý (tối thiểu 10 ký tự)..."
            rows={3}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                       focus:outline-none focus:ring-primary-500 focus:border-primary-500
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Giá thanh lý (VNĐ)
          </label>
          <Input
            type="number"
            min="0"
            value={disposalPrice}
            onChange={(e) => setDisposalPrice(e.target.value)}
            placeholder="500000"
            disabled={isPending}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={handleClose}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={isPending}
            onClick={handleDispose}
            disabled={isPending}
          >
            Xác nhận thanh lý
          </Button>
        </div>
      </div>
    </Modal>
  );
}
