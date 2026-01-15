import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { useAssignAsset } from '@/hooks/useAssets'
import { useUsers } from '@/hooks/useUsers'
import { generateAssetTransferSlip } from '@/utils/pdfGenerators'
import { DEPARTMENTS } from '@/utils/constants'

export function AssignAssetModal({ isOpen, onClose, asset }) {
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [notes, setNotes] = useState('')

  const { mutate: assignAsset, isPending } = useAssignAsset()
  const { data: usersData } = useUsers({ limit: 1000 })
  const users = usersData?.data || []

  if (!asset) return null

  const handleAssign = async () => {
    const user = users.find(u => u.employee_code === selectedUser)
    if (!user) return

    // Generate PDF
    try {
      const doc = await generateAssetTransferSlip({
        slipNumber: `${Date.now()}`,
        assetCode: asset.asset_code,
        assetName: asset.product_name,
        serialNumber: asset.serial_number || '-',
        category: asset.category,
        fromUserCode: '-',
        fromUserName: 'Kho',
        toUserCode: user.employee_code,
        toUserName: user.full_name,
        fromDepartment: 'Kho',
        toDepartment: selectedDepartment,
        transferredDate: new Date().toISOString(),
        notes,
      })

      // Download PDF
      doc.save(`phieu-ban-giao-${asset.asset_code}.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
    }

    // Assign asset
    assignAsset(
      {
        assetCode: asset.asset_code,
        data: {
          userEmployeeCode: selectedUser,
          department: selectedDepartment,
        },
      },
      {
        onSuccess: () => {
          setSelectedUser('')
          setSelectedDepartment('')
          setNotes('')
          onClose()
        },
      }
    )
  }

  const selectedUserData = users.find(u => u.employee_code === selectedUser)

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
          <p className="text-sm"><strong>Mã:</strong> {asset.asset_code}</p>
          <p className="text-sm"><strong>Tên:</strong> {asset.product_name}</p>
          <p className="text-sm"><strong>Serial:</strong> {asset.serial_number || '-'}</p>
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
            {users.map(user => (
              <option key={user.employee_code} value={user.employee_code}>
                {user.full_name} ({user.employee_code})
              </option>
            ))}
          </Select>
        </div>

        {/* User Info */}
        {selectedUserData && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm">
            <p><strong>Email:</strong> {selectedUserData.email}</p>
            <p><strong>Bộ phận hiện tại:</strong> {selectedUserData.department}</p>
          </div>
        )}

        {/* Select Department */}
        <div>
          <label className="block text-sm font-medium mb-1">Bộ phận *</label>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            disabled={isPending}
          >
            <option value="">-- Chọn bộ phận --</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </Select>
        </div>

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
            disabled={!selectedUser || !selectedDepartment}
          >
            Phân công
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Phiếu bàn giao sẽ được tạo và tải về
        </p>
      </div>
    </Modal>
  )
}
