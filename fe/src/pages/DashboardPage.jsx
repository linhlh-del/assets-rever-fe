import { Package, Users, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import CustomizableChart from '@/components/dashboard/CustomizableChart'
import ExpiringWarrantyWidget from '@/components/dashboard/ExpiringWarrantyWidget'
import BrokenAssetsWidget from '@/components/dashboard/BrokenAssetsWidget'
import { useDashboard } from '@/hooks/useDashboard'
import { usePermission } from '@/hooks/usePermission'
import { useAuth } from '@/hooks/useAuth'

const DashboardPage = () => {
  const {
    stats,
    charts,
    widgets,
    chartPreferences,
    updateChartPreference,
    isLoading,
  } = useDashboard()
  const { role } = usePermission()
  const { user } = useAuth()

  // For regular users, show only their personal stats
  const isRegularUser = role === 'user'
  const displayStats = isRegularUser ? {
    totalAssets: stats.userAssets || 0,
    inUseAssets: stats.inUseAssets || 0,
    availableAssets: 0,
    maintenanceAssets: 0,
    brokenAssets: 0,
    disposedAssets: 0,
  } : stats

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          {isRegularUser ? `Tài Sản Của ${user?.user_metadata?.full_name || 'Bạn'}` : 'Dashboard'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isRegularUser ? 'Quản lý tài sản cá nhân' : 'Tổng quan quản lý tài sản IT'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Tổng Tài Sản"
          value={displayStats.totalAssets}
          icon={Package}
          color="primary"
          loading={isLoading}
        />
        <StatCard
          title="Đang Sử Dụng"
          value={displayStats.inUseAssets}
          icon={CheckCircle}
          color="blue"
          loading={isLoading}
        />
        {!isRegularUser && (
          <>
            <StatCard
              title="Có Sẵn"
              value={displayStats.availableAssets}
              icon={Package}
              color="green"
              loading={isLoading}
            />
            <StatCard
              title="Bảo Trì"
              value={displayStats.maintenanceAssets}
              icon={Clock}
              color="yellow"
              loading={isLoading}
            />
            <StatCard
              title="Hư Hỏng"
              value={displayStats.brokenAssets}
              icon={AlertCircle}
              color="red"
              loading={isLoading}
            />
            <StatCard
              title="Thanh Lý"
              value={displayStats.disposedAssets}
              icon={Trash2}
              color="red"
              loading={isLoading}
            />
          </>
        )}
      </div>

      {/* Charts Grid - Only for Admin/Dev */}
      {!isRegularUser && (
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
      )}

      {/* Widgets - Only for Admin/Dev */}
      {!isRegularUser && (
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
      )}
    </div>
  )
}

export default DashboardPage
