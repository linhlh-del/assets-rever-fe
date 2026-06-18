import { AlertTriangle, Clock } from 'lucide-react'
import { formatDate } from '@/utils/formatters'

const ExpiringWarrantyWidget = ({ data = [], loading = false }) => {
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
    <div className="bg-white rounded-lg border border-yellow-200 bg-yellow-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Sắp Hết Bảo Hành (30 ngày)
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-600 text-sm">Không có thiết bị sắp hết bảo hành</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="p-3 bg-white rounded-md border border-yellow-100">
              <p className="font-medium text-sm text-gray-900">{item.asset_name}</p>
              <p className="text-xs text-gray-600 mt-1">
                Mã: {item.asset_code}
              </p>
              <p className="text-xs text-yellow-600 font-medium mt-1">
                Hết: {formatDate(item.warranty_expiry_date)}
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

export default ExpiringWarrantyWidget
