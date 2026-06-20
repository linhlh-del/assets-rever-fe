// components/assets/AssignAssetModal.jsx
import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { useAssignAsset } from "@/hooks/useAssets";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";

export function AssignAssetModal({ isOpen, onClose, asset }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: assignAsset, isPending } = useAssignAsset();

  // Chỉ lấy user active — không cần limit 1000
  // userService.getUsers() return { data: users[], total }
  const { data: usersData, isLoading: usersLoading } = useUsers({
    status: "active",
    limit: 200,
  });

  // userService đã chuẩn hóa: return { data: [...], total }
  const users = usersData?.data || [];

  const selectedUserData =
    users.find((u) => u.employee_code === selectedUser) ?? null;

  if (!asset) return null;

  const handleAssign = () => {
    if (!selectedUser) {
      toast.error("Vui lòng chọn nhân viên");
      return;
    }

    assignAsset(
      { assetId: asset.id, employeeCode: selectedUser },
      {
        onSuccess: () => {
          toast.success(
            `Đã gán ${asset.asset_code} cho ${selectedUserData?.full_name}`,
          );
          setSelectedUser("");
          setNotes("");
          onClose();
        },
        onError: (error) => {
          toast.error(`Lỗi phân công: ${error.message}`);
        },
      },
    );
  };

  const handleClose = () => {
    setSelectedUser("");
    setNotes("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Phân công tài sản"
      description={`Gán ${asset.product_name} cho nhân viên`}
      className="max-w-md"
    >
      <div className="space-y-4">
        {/* Asset Info */}
        <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
          <p>
            <strong>Mã:</strong> {asset.asset_code}
          </p>
          <p>
            <strong>Tên:</strong> {asset.product_name}
          </p>
          <p>
            <strong>Serial:</strong> {asset.serial_number || "—"}
          </p>
        </div>

        {/* Select User */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nhân viên <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={isPending || usersLoading}
          >
            <option value="">
              {usersLoading ? "Đang tải..." : "-- Chọn nhân viên --"}
            </option>
            {users.map((user) => (
              <option key={user.employee_code} value={user.employee_code}>
                {user.full_name} ({user.employee_code})
              </option>
            ))}
          </Select>
        </div>

        {/* Selected User Info */}
        {selectedUserData && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm space-y-1">
            <p>
              <strong>Email:</strong> {selectedUserData.email}
            </p>
            {/* department từ BE join — fallback department_name nếu có */}
            <p>
              <strong>Bộ phận:</strong>{" "}
              {selectedUserData.department ||
                selectedUserData.department_name ||
                "—"}
            </p>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Ghi chú</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tình trạng thiết bị khi bàn giao..."
            rows={3}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                       focus:outline-none focus:ring-primary-500 focus:border-primary-500
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Actions */}
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
            variant="primary"
            className="flex-1"
            loading={isPending}
            onClick={handleAssign}
            disabled={!selectedUser || isPending}
          >
            Phân công
          </Button>
        </div>
      </div>
    </Modal>
  );
}
