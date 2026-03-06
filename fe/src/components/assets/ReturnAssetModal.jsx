import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { useReturnAsset } from "@/hooks/useAssets";
import { DEPARTMENTS } from "@/utils/constants";

export function ReturnAssetModal({ isOpen, onClose, asset }) {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: returnAsset, isPending } = useReturnAsset();

  if (!asset) return null;

  const handleReturn = () => {
    console.log("🔍 asset object:", asset); // ← thêm dòng này
    returnAsset(
      {
        assetId: asset.id,
        returnNotes: notes,
      },
      {
        onSuccess: () => {
          setSelectedDepartment("");
          setNotes("");
          onClose();
        },
        onError: (error) => {
          console.error("❌ Return error:", error.message);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thu hồi tài sản"
      description={`Thu hồi ${asset.product_name} từ ${
        asset.current_user_employee_code || "người dùng"
      }`}
      className="max-w-md"
    >
      <div className="space-y-4">
        {/* Asset Info */}
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm">
            <strong>Mã:</strong> {asset.asset_code}
          </p>
          <p className="text-sm">
            <strong>Tên:</strong> {asset.product_name}
          </p>
          <p className="text-sm">
            <strong>Serial:</strong> {asset.serial_number || "-"}
          </p>
          <p className="text-sm">
            <strong>Người dùng hiện tại:</strong>{" "}
            {asset.current_user_employee_code || "-"}
          </p>
        </div>

        {/* Select Department */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Bộ phận lưu giữ
          </label>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            disabled={isPending}
          >
            <option value="">-- Chọn bộ phận --</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn bộ phận lưu giữ hoặc để trống nếu trả về kho
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Ghi chú thu hồi
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tình trạng khi trả lại..."
            rows="3"
            disabled={isPending}
            className="w-full px-3 py-2 border rounded-md text-sm disabled:opacity-50"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            loading={isPending}
            onClick={handleReturn}
          >
            Thu hồi
          </Button>
        </div>
      </div>
    </Modal>
  );
}
