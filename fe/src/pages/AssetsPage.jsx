import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/common/Button'
import { Loading } from '@/components/common/Loading'
import { useAssets } from '@/hooks/useAssets'
import { AssetFilters } from '@/components/assets/AssetFilters'
import { AssetsList } from '@/components/assets/AssetsList'
import { AddAssetModal } from '@/components/assets/AddAssetModal'
import { EditAssetModal } from '@/components/assets/EditAssetModal'
import { AssignAssetModal } from '@/components/assets/AssignAssetModal'
import { ReturnAssetModal } from '@/components/assets/ReturnAssetModal'
import { useCanCreateAsset } from '@/hooks/usePermission'
import { Plus } from 'lucide-react'

export default function AssetsPage() {
  const navigate = useNavigate()

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)
  const [assigningAsset, setAssigningAsset] = useState(null)
  const [returningAsset, setReturningAsset] = useState(null)

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: null,
    status: null,
    department: null,
    page: 1,
    limit: 20,
  })

  // Permissions
  const canCreate = useCanCreateAsset()

  // Data
  const { data, isLoading } = useAssets(filters)
  const assets = data?.data || []
  const total = data?.total || 0

  // Pagination
  const handleNextPage = () => {
    setFilters(f => ({ ...f, page: f.page + 1 }))
  }

  const handlePrevPage = () => {
    if (filters.page > 1) {
      setFilters(f => ({ ...f, page: f.page - 1 }))
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý tài sản</h1>
            <p className="text-muted-foreground">
              Quản lý danh sách tài sản, phân công, thu hồi và bảo trì
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

        {/* Assets Table */}
        {isLoading ? (
          <Loading />
        ) : (
          <div className="bg-white rounded-lg border">
            <AssetsList
              assets={assets}
              isLoading={isLoading}
              onView={(asset) => navigate(`/assets/${asset.asset_code}`)}
              onEdit={setEditingAsset}
              onAssign={setAssigningAsset}
              onReturn={setReturningAsset}
              onReport={() => {}}
              onDispose={() => {}}
            />
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {(filters.page - 1) * filters.limit + 1} đến{' '}
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

      {/* Modals */}
      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
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
    </Layout>
  )
}
