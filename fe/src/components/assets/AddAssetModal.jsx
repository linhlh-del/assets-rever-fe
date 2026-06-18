import { Modal } from '@/components/common/Modal'
import { AssetForm } from './AssetForm'
import { useCreateAsset } from '@/hooks/useAssets'

export function AddAssetModal({ isOpen, onClose, invoiceNumber }) {
  const { mutate: createAsset, isPending } = useCreateAsset()

  const handleSubmit = (data) => {
    createAsset(
      {
        ...data,
        invoice_number: invoiceNumber,
        status: 'available',
        created_at: new Date().toISOString(),
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
      title="Thêm tài sản mới"
      description={`Thêm tài sản từ hóa đơn ${invoiceNumber || ''}`}
    >
      <AssetForm onSubmit={handleSubmit} isLoading={isPending} />
    </Modal>
  )
}
