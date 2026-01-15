import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as slipService from '@/services/slipService'
import { toast } from 'sonner'

export const useAssignmentSlips = (filters = {}) => {
  return useQuery({
    queryKey: ['slips', filters],
    queryFn: () => slipService.getAssignmentSlips(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAssignmentSlip = (slipNumber) => {
  return useQuery({
    queryKey: ['slips', slipNumber],
    queryFn: () => slipService.getAssignmentSlip(slipNumber),
    enabled: !!slipNumber,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateAssignmentSlip = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slipData) => slipService.createAssignmentSlip(slipData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slips'] })
      toast.success('Tạo phiếu bàn giao thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useApproveAssignmentSlip = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slipNumber) => slipService.approveAssignmentSlip(slipNumber),
    onSuccess: (_, slipNumber) => {
      queryClient.invalidateQueries({ queryKey: ['slips'] })
      queryClient.invalidateQueries({ queryKey: ['slips', slipNumber] })
      toast.success('Duyệt phiếu bàn giao thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useConfirmSlipReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slipNumber, data }) => 
      slipService.confirmSlipReceipt(slipNumber, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['slips'] })
      queryClient.invalidateQueries({ queryKey: ['slips', variables.slipNumber] })
      toast.success('Xác nhận nhận phiếu bàn giao thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}
