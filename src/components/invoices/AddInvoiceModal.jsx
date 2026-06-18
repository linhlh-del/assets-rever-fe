import { Modal } from '@/components/common/Modal'
import { InvoiceForm } from './InvoiceForm'
import { useCreateInvoice } from '@/hooks/useInvoices'

export function AddInvoiceModal({ isOpen, onClose, onSuccess }) {
  const { mutate: createInvoice, isPending } = useCreateInvoice()

  const handleSubmit = (data) => {
    createInvoice(
      {
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          onClose()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo hóa đơn mới"
      description="Nhập thông tin hóa đơn để tạo bản ghi mới"
    >
      <InvoiceForm onSubmit={handleSubmit} isLoading={isPending} />
    </Modal>
  )
}
