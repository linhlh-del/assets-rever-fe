// components/assets/AssignAssetModal.jsx
import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { useAssignAsset } from "@/hooks/useAssets";
import { useUsers } from "@/hooks/useUsers";
import { DEPARTMENTS } from "@/utils/constants";

export function AssignAssetModal({ isOpen, onClose, asset }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: assignAsset, isPending } = useAssignAsset();
  const { data: usersData } = useUsers({ limit: 1000 });

  // ✅ useUsers có thể trả về nhiều format khác nhau — handle hết
  const users =
    usersData?.users ||
    usersData?.data?.users ||
    usersData?.data ||
    usersData ||
    [];

  if (!asset) return null;

  const handleAssign = async () => {
    if (!selectedUser) return;

    // ✅ FIX: dùng asset.id (UUID) thay vì asset.asset_code
    assignAsset(
      {
        assetId: asset.id,
        employeeCode: selectedUser,
      },
      {
        onSuccess: () => {
          setSelectedUser("");
          setSelectedDepartment("");
          setNotes("");
          onClose();
        },
        onError: (error) => {
          console.error("❌ Assign error:", error.message);
        },
      },
    );
  };

  const selectedUserData = Array.isArray(users)
    ? users.find((u) => u.employee_code === selectedUser)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Phân công tài sản"
      description={`Gán ${asset.product_name} cho nhân viên`}
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
        </div>

        {/* Select User */}
        <div>
          <label className="block text-sm font-medium mb-1">Nhân viên *</label>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={isPending}
          >
            <option value="">-- Chọn nhân viên --</option>
            {Array.isArray(users) &&
              users.map((user) => (
                <option key={user.employee_code} value={user.employee_code}>
                  {user.full_name} ({user.employee_code})
                </option>
              ))}
          </Select>
        </div>

        {/* User Info */}
        {selectedUserData && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm">
            <p>
              <strong>Email:</strong> {selectedUserData.email}
            </p>
            <p>
              <strong>Bộ phận:</strong> {selectedUserData.department}
            </p>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Ghi chú</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tình trạng, điều kiện..."
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
