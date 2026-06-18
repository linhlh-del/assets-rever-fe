import { useQuery } from '@tanstack/react-query'
import * as reportService from '@/services/reportService'

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => ({
      reports: [
        { id: 'asset-inventory', name: 'Asset Inventory' },
        { id: 'asset-status', name: 'Asset Status' },
        { id: 'asset-value', name: 'Asset Value' },
      ]
    }),
  })
}

export const useAssetListReport = (filters = {}) => {
  return useQuery({
    queryKey: ['reports', 'assetList', filters],
    queryFn: () => reportService.getAssetListReport(filters),
    staleTime: 10 * 60 * 1000,
  })
}

export const useAssetDepreciationReport = () => {
  return useQuery({
    queryKey: ['reports', 'depreciation'],
    queryFn: () => reportService.getAssetDepreciationReport(),
    staleTime: 30 * 60 * 1000,
  })
}

export const useAssetMaintenanceReport = () => {
  return useQuery({
    queryKey: ['reports', 'maintenance'],
    queryFn: () => reportService.getAssetMaintenanceReport(),
    staleTime: 10 * 60 * 1000,
  })
}

export const useAssetDisposalReport = () => {
  return useQuery({
    queryKey: ['reports', 'disposal'],
    queryFn: () => reportService.getAssetDisposalReport(),
    staleTime: 30 * 60 * 1000,
  })
}

export const useUserAssetAllocationReport = () => {
  return useQuery({
    queryKey: ['reports', 'userAllocation'],
    queryFn: () => reportService.getUserAssetAllocationReport(),
    staleTime: 10 * 60 * 1000,
  })
}

export const useDepartmentAssetReport = () => {
  return useQuery({
    queryKey: ['reports', 'departmentAssets'],
    queryFn: () => reportService.getDepartmentAssetReport(),
    staleTime: 10 * 60 * 1000,
  })
}

export const useInvoiceSummaryReport = () => {
  return useQuery({
    queryKey: ['reports', 'invoiceSummary'],
    queryFn: () => reportService.getInvoiceSummaryReport(),
    staleTime: 30 * 60 * 1000,
  })
}
