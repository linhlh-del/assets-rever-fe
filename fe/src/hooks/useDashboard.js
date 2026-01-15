import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/services/api'

// Mock data for development
const MOCK_DASHBOARD_DATA = {
  stats: {
    totalAssets: 150,
    inUseAssets: 120,
    availableAssets: 20,
    maintenanceAssets: 8,
    brokenAssets: 5,
    disposedAssets: 3,
  },
  assetsByDepartment: [
    { name: 'IT', value: 45 },
    { name: 'Sales', value: 30 },
    { name: 'Marketing', value: 20 },
    { name: 'Finance', value: 25 },
    { name: 'HR', value: 15 },
  ],
  assetsByStatus: [
    { name: 'Có sẵn', value: 20 },
    { name: 'Đang sử dụng', value: 120 },
    { name: 'Đang bảo trì', value: 8 },
    { name: 'Hư hỏng', value: 5 },
    { name: 'Đã thanh lý', value: 3 },
  ],
  assetsOverTime: [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 132 },
    { name: 'Mar', value: 140 },
    { name: 'Apr', value: 145 },
    { name: 'May', value: 148 },
    { name: 'Jun', value: 150 },
  ],
  assetsByCategory: [
    { name: 'Laptop', value: 45 },
    { name: 'Monitor', value: 50 },
    { name: 'Keyboard', value: 35 },
    { name: 'Mouse', value: 40 },
  ],
  expiringWarranty: [
    {
      asset_code: 'IT-LAP-001',
      asset_name: 'MacBook Pro 14"',
      warranty_expiry_date: '2026-02-15',
    },
    {
      asset_code: 'IT-LAP-002',
      asset_name: 'MacBook Pro 16"',
      warranty_expiry_date: '2026-02-20',
    },
    {
      asset_code: 'IT-MON-001',
      asset_name: 'Dell Ultrasharp 27"',
      warranty_expiry_date: '2026-03-10',
    },
  ],
  brokenAssets: [
    {
      asset_code: 'IT-LAP-045',
      asset_name: 'Dell Latitude 5440',
      issue_description: 'Màn hình vỡ',
      reported_date: '2026-01-10',
    },
    {
      asset_code: 'IT-KEY-023',
      asset_name: 'Mechanical Keyboard',
      issue_description: 'Phím bị hỏng',
      reported_date: '2026-01-08',
    },
  ],
}

export const useDashboard = () => {
  const [chartPreferences, setChartPreferences] = useState({
    assetsByDepartment: 'pie',
    assetsByStatus: 'bar',
    assetsOverTime: 'line',
    assetsByCategory: 'pie',
  })

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chartPreferences')
    if (saved) {
      try {
        setChartPreferences(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load chart preferences:', e)
      }
    }
  }, [])

  // Save preferences to localStorage
  const updateChartPreference = (chartName, type) => {
    const updated = {
      ...chartPreferences,
      [chartName]: type,
    }
    setChartPreferences(updated)
    localStorage.setItem('chartPreferences', JSON.stringify(updated))
  }

  // Fetch dashboard data (mock for now)
  const {
    data: dashboardData = MOCK_DASHBOARD_DATA,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // In production, this would call your actual API
      // const { data, error } = await supabase.rpc('get_dashboard_stats')
      // if (error) throw error
      // return data
      
      // Mock: simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return MOCK_DASHBOARD_DATA
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    stats: dashboardData.stats,
    charts: {
      assetsByDepartment: dashboardData.assetsByDepartment,
      assetsByStatus: dashboardData.assetsByStatus,
      assetsOverTime: dashboardData.assetsOverTime,
      assetsByCategory: dashboardData.assetsByCategory,
    },
    widgets: {
      expiringWarranty: dashboardData.expiringWarranty,
      brokenAssets: dashboardData.brokenAssets,
    },
    chartPreferences,
    updateChartPreference,
    isLoading,
    error,
  }
}
