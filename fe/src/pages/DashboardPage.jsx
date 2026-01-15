import { Package, Users, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import CustomizableChart from '@/components/dashboard/CustomizableChart'
import ExpiringWarrantyWidget from '@/components/dashboard/ExpiringWarrantyWidget'
import BrokenAssetsWidget from '@/components/dashboard/BrokenAssetsWidget'
import { useDashboard } from '@/hooks/useDashboard'

const DashboardPage = () => {
  const {
    stats,
    charts,
    widgets,
    chartPreferences,
    updateChartPreference,
    isLoading,
  } = useDashboard()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Tổng quan quản lý tài sản IT</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Tổng Tài Sản"
          value={stats.totalAssets}
          icon={Package}
          color="primary"
          loading={isLoading}
        />
        <StatCard
          title="Đang Sử Dụng"
          value={stats.inUseAssets}
          icon={CheckCircle}
          color="blue"
          loading={isLoading}
        />
        <StatCard
          title="Có Sẵn"
          value={stats.availableAssets}
          icon={Package}
          color="green"
          loading={isLoading}
        />
        <StatCard
          title="Bảo Trì"
          value={stats.maintenanceAssets}
          icon={Clock}
          color="yellow"
          loading={isLoading}
        />
        <StatCard
          title="Hư Hỏng"
          value={stats.brokenAssets}
          icon={AlertCircle}
          color="red"
          loading={isLoading}
        />
        <StatCard
          title="Thanh Lý"
          value={stats.disposedAssets}
          icon={Trash2}
          color="red"
          loading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomizableChart
          title="Tài Sản Theo Phòng Ban"
          data={charts.assetsByDepartment}
          type={chartPreferences.assetsByDepartment}
          onTypeChange={(type) => updateChartPreference('assetsByDepartment', type)}
          dataKey="value"
          loading={isLoading}
        />

        <CustomizableChart
          title="Tài Sản Theo Trạng Thái"
          data={charts.assetsByStatus}
          type={chartPreferences.assetsByStatus}
          onTypeChange={(type) => updateChartPreference('assetsByStatus', type)}
          dataKey="value"
          loading={isLoading}
        />

        <CustomizableChart
          title="Tài Sản Theo Thời Gian"
          data={charts.assetsOverTime}
          type={chartPreferences.assetsOverTime}
          onTypeChange={(type) => updateChartPreference('assetsOverTime', type)}
          dataKey="value"
          loading={isLoading}
        />

        <CustomizableChart
          title="Tài Sản Theo Loại"
          data={charts.assetsByCategory}
          type={chartPreferences.assetsByCategory}
          onTypeChange={(type) => updateChartPreference('assetsByCategory', type)}
          dataKey="value"
          loading={isLoading}
        />
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpiringWarrantyWidget
          data={widgets.expiringWarranty}
          loading={isLoading}
        />

        <BrokenAssetsWidget
          data={widgets.brokenAssets}
          loading={isLoading}
        />
      </div>
    </div>
  )
}

export default DashboardPage
