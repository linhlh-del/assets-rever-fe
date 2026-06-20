import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { useMaintenance, useReportMaintenanceIssue } from '@/hooks/useMaintenance'
import { usePermission } from '@/hooks/usePermission'
import { useToast } from '@/hooks/useToast'
import { useAssets } from '@/hooks/useAssets'
import { MaintenanceFilters } from '@/components/maintenance/MaintenanceFilters'
import { MaintenanceList } from '@/components/maintenance/MaintenanceList'
import { MaintenanceDetailModal } from '@/components/maintenance/MaintenanceDetailModal'
import { Plus } from 'lucide-react'

// Simple Create Modal for Maintenance
function CreateMaintenanceModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    asset_id: '',
    issue_type: 'hardware',
    description: '',
    priority: 'medium',
  })
  const { mutate: create, isPending } = useReportMaintenanceIssue()
  // Load assets for dropdown
  const { data: assetsData } = useAssets({ limit: 200 })
  const assets = assetsData?.assets || []

  const handleSubmit = (e) => {
    e.preventDefault()
    create({
      asset_id: formData.asset_id,
      issue_description: formData.description,
      priority: formData.priority,
    }, {
      onSuccess: () => {
        onClose()
        onSuccess?.()
      },
    })
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black/50`}>
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Tạo phiếu bảo trì mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tài sản</label>
            <select
              value={formData.asset_id}
              onChange={(e) => setFormData({ ...formData, asset_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
            >
              <option value="">Chọn tài sản</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  {a.asset_code} - {a.product_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Loại sự cố</label>
            <select
              value={formData.issue_type}
              onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Network</option>
              <option value="peripheral">Ngoại vi</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows="3"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Tạo
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MaintenancePage() {
  const { canCreateMaintenance } = usePermission()
  const { toast } = useToast()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    status: null,
    priority: null,
    page: 1,
    limit: 20,
  })

  const { data, isLoading } = useMaintenance({
    search: filters.search,
    status: filters.status,
    priority: filters.priority,
    limit: filters.limit,
    offset: (filters.page - 1) * filters.limit,
  })

  const handleViewRecord = (record) => {
    setSelectedRecord(record)
    setShowDetailModal(true)
  }

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    toast.success('Tạo phiếu bảo trì thành công')
  }

  const pageCount = Math.ceil((data?.total || 0) / filters.limit)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý bảo trì"
        description="Quản lý phiếu bảo trì, theo dõi tiến trình khắc phục"
        action={
          canCreateMaintenance && (
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Phiếu bảo trì mới
            </Button>
          )
        }
      />

      <MaintenanceFilters filters={filters} onFiltersChange={setFilters} />

      <MaintenanceList
        records={data?.data || []}
        isLoading={isLoading}
        onView={handleViewRecord}
      />

      {pageCount > 1 && (
        <Pagination
          currentPage={filters.page}
          pageCount={pageCount}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}

      <CreateMaintenanceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <MaintenanceDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        record={selectedRecord}
      />
    </div>
  )
}
