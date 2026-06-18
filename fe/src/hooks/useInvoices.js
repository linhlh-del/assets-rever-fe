import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as invoiceService from '@/services/invoiceService'
import { toast } from 'sonner'

export const useInvoices = (filters = {}) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoiceService.getInvoices(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useInvoice = (invoiceNumber) => {
  return useQuery({
    queryKey: ['invoices', invoiceNumber],
    queryFn: () => invoiceService.getInvoice(invoiceNumber),
    enabled: !!invoiceNumber,
    staleTime: 5 * 60 * 1000,
  })
}

export const useInvoiceSummary = () => {
  return useQuery({
    queryKey: ['invoices', 'summary'],
    queryFn: () => invoiceService.getInvoiceSummary(),
    staleTime: 10 * 60 * 1000,
  })
}

export const useUploadInvoiceFile = () => {
  return useMutation({
    mutationFn: ({ file, invoiceNumber }) => 
      invoiceService.uploadInvoiceFile(file, invoiceNumber),
    onError: (error) => {
      toast.error(`Lỗi tải file: ${error.message}`)
    },
  })
}

export const useCreateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invoiceData) => invoiceService.createInvoice(invoiceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Thêm hóa đơn thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ invoiceNumber, data }) => 
      invoiceService.updateInvoice(invoiceNumber, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.invoiceNumber] })
      toast.success('Cập nhật hóa đơn thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useConfirmInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invoiceNumber) => invoiceService.confirmInvoice(invoiceNumber),
    onSuccess: (_, invoiceNumber) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['invoices', invoiceNumber] })
      toast.success('Xác nhận hóa đơn thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}
