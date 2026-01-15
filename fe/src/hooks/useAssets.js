import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as assetService from '@/services/assetService'
import { toast } from 'sonner'

export const useAssets = (filters = {}) => {
  return useQuery({
    queryKey: ['assets', filters],
    queryFn: () => assetService.getAssets(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAsset = (assetCode) => {
  return useQuery({
    queryKey: ['assets', assetCode],
    queryFn: () => assetService.getAsset(assetCode),
    enabled: !!assetCode,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAssetAuditTrail = (assetCode) => {
  return useQuery({
    queryKey: ['assets', assetCode, 'auditTrail'],
    queryFn: () => assetService.getAssetAuditTrail(assetCode),
    enabled: !!assetCode,
  })
}

export const useCreateAsset = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (assetData) => assetService.createAsset(assetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Thêm tài sản thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useUpdateAsset = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assetCode, data }) => assetService.updateAsset(assetCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets', variables.assetCode] })
      toast.success('Cập nhật tài sản thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useAssignAsset = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assetCode, data }) => assetService.assignAsset(assetCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets', variables.assetCode] })
      toast.success('Phân công tài sản thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useReturnAsset = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assetCode, data }) => assetService.returnAsset(assetCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets', variables.assetCode] })
      toast.success('Thu hồi tài sản thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useReportMaintenance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assetCode, data }) => assetService.reportMaintenance(assetCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Báo cáo bảo trì thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useDisposeAsset = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assetCode, data }) => assetService.disposeAsset(assetCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets', variables.assetCode] })
      toast.success('Thanh lý tài sản thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

export const useUploadAssetImages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assetCode, files }) => assetService.uploadAssetImages(assetCode, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets', variables.assetCode] })
      toast.success('Tải ảnh thành công')
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}
