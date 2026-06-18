import { AlertCircle, Wrench } from 'lucide-react'
import { formatDate } from '@/utils/formatters'

const BrokenAssetsWidget = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-red-200 bg-red-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Thiết Bị Hư Hỏng Chờ Xử Lý
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-600 text-sm">Không có thiết bị hư hỏng đang chờ xử lý</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="p-3 bg-white rounded-md border border-red-100">
              <p className="font-medium text-sm text-gray-900">{item.asset_name}</p>
              <p className="text-xs text-gray-600 mt-1">
                Mã: {item.asset_code}
              </p>
              <p className="text-xs text-red-600 font-medium mt-1">
                {item.issue_description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Báo cáo: {formatDate(item.reported_date)}
              </p>
            </div>
          ))}
          {data.length > 5 && (
            <p className="text-xs text-gray-600 text-center pt-2">
              +{data.length - 5} thiết bị khác
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default BrokenAssetsWidget
