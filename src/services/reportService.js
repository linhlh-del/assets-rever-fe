import { apiClient } from '@/services/api'

// Generate asset list report
export const getAssetListReport = async (filters = {}) => {
  const res = await apiClient.post('/api/reports/assets', {
    ...filters,
    reportType: filters.reportType || 'detail',
  })
  const reportData = res?.data?.reportData || {}
  return {
    data: reportData.assets || [],
    total: reportData.assets?.length || reportData.totalAssets || 0,
    summary: {
      totalAssets: reportData.totalAssets,
      byStatus: reportData.byStatus,
      byCategory: reportData.byCategory,
      totalValue: reportData.totalValue,
    },
  }
}

// Generate asset depreciation report (computed client-side from asset list)
export const getAssetDepreciationReport = async () => {
  const { data: assets } = await getAssetListReport({ status: 'in_use', reportType: 'detail' })

  return (assets || []).map(asset => {
    const purchaseDate = new Date(asset.purchase_date)
    const today = new Date()
    const yearsDiff = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365)
    const depreciationRate = {
      'computer': 0.25,
      'phone': 0.3,
      'furniture': 0.1,
      'other': 0.15,
    }[asset.category] || 0.15

    const purchasePrice = parseFloat(asset.purchase_price) || 0
    const currentValue = purchasePrice * Math.pow(1 - depreciationRate, yearsDiff)
    const totalDepreciation = purchasePrice - currentValue

    return {
      ...asset,
      currentValue: Math.max(0, currentValue),
      totalDepreciation,
      depreciationPercent: purchasePrice > 0
        ? (totalDepreciation / purchasePrice * 100).toFixed(2)
        : '0.00',
    }
  })
}

// Generate asset maintenance report
export const getAssetMaintenanceReport = async (filters = {}) => {
  const res = await apiClient.post('/api/reports/maintenance', filters)
  return res?.data?.reportData || {}
}

// Generate asset disposal report (filter assets with status 'disposed')
export const getAssetDisposalReport = async () => {
  const { data: assets } = await getAssetListReport({ status: 'disposed', reportType: 'detail' })
  return assets || []
}

// Generate user asset allocation report
export const getUserAssetAllocationReport = async (filters = {}) => {
  const res = await apiClient.post('/api/reports/users', filters)
  return { data: res?.data?.reportData || {} }
}

// Generate department asset report (from asset summary)
export const getDepartmentAssetReport = async () => {
  const res = await apiClient.post('/api/reports/assets', { reportType: 'summary' })
  return res?.data?.reportData || {}
}

// Generate invoice summary report
export const getInvoiceSummaryReport = async () => {
  // Invoices don't have a dedicated report endpoint, use invoice list
  const { apiClient: client } = await import('@/services/api')
  const res = await client.get('/api/invoices?limit=1000')
  const invoices = res?.data?.invoices || []

  return {
    invoices,
    totalAmount: invoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0),
  }
}
