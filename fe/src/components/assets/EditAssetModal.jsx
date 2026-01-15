import { Modal } from '@/components/common/Modal'
import { AssetForm } from './AssetForm'
import { useUpdateAsset } from '@/hooks/useAssets'

export function EditAssetModal({ isOpen, onClose, asset }) {
  const { mutate: updateAsset, isPending } = useUpdateAsset()

  if (!asset) return null

  const handleSubmit = (data) => {
    updateAsset(
      {
        assetCode: asset.asset_code,
        data: {
          ...data,
          updated_at: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cập nhật tài sản"
      description={`Chỉnh sửa ${asset.product_name}`}
    >
      <AssetForm
        initialData={asset}
        onSubmit={handleSubmit}
        isLoading={isPending}
        isEditing={true}
      />
    </Modal>
  )
}
