import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as maintenanceService from '@/services/maintenanceService'
import { toast } from 'sonner'

export const useMaintenance = (filters = {}) => {
  return useQuery({
    queryKey: ['maintenance', filters],
    queryFn: () => maintenanceService.getMaintenanceTickets(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useMaintenanceTicket = (ticketId) => {
  return useQuery({
    queryKey: ['maintenance', ticketId],
    queryFn: () => maintenanceService.getMaintenanceTicket(ticketId),
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useMaintenanceSummary = () => {
  return useQuery({
    queryKey: ['maintenance', 'summary'],
    queryFn: () => maintenanceService.getMaintenanceSummary(),
    staleTime: 10 * 60 * 1000,
  })
}

export const useReportMaintenanceIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (maintenanceData) => 
      maintenanceService.reportMaintenanceIssue(maintenanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Báo cáo bảo trì thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }) => 
      maintenanceService.updateMaintenanceTicket(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      queryClient.invalidateQueries({ queryKey: ['maintenance', variables.id] })
      toast.success('Cập nhật phiếu bảo trì thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useCloseMaintenance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ticketId) => 
      maintenanceService.closeMaintenanceTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      toast.success('Đóng phiếu bảo trì thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}
