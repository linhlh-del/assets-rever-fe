import { useState } from 'react'
import { cn } from '@/utils/cn'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useResponsive } from '@/hooks/useResponsive'

const ResponsiveTable = ({ 
  columns, 
  data, 
  onRowClick, 
  loading,
  mobileCard,
}) => {
  const { isMobile } = useResponsive()

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-10 bg-gray-200 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Không có dữ liệu</p>
      </div>
    )
  }

  // Mobile Card View
  if (isMobile && mobileCard) {
    return (
      <div className="space-y-3">
        {data.map((row, index) => (
          <div
            key={index}
            onClick={() => onRowClick?.(row)}
            className={cn(
              'bg-white rounded-lg border border-gray-200 p-4',
              onRowClick && 'cursor-pointer active:bg-gray-50'
            )}
          >
            {mobileCard(row)}
          </div>
        ))}
      </div>
    )
  }

  // Mobile Accordion View (default)
  if (isMobile) {
    return (
      <div className="space-y-2">
        {data.map((row, rowIndex) => (
          <MobileTableRow 
            key={rowIndex}
            row={row}
            columns={columns}
            onRowClick={onRowClick}
          />
        ))}
      </div>
    )
  }

  // Desktop Table View
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.hideOnMobile && 'hidden sm:table-cell'
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-gray-50',
                  'transition-colors'
                )}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      'px-3 sm:px-6 py-4 text-sm text-gray-900',
                      column.hideOnMobile && 'hidden sm:table-cell'
                    )}
                  >
                    {column.cell 
                      ? column.cell(row) 
                      : row[column.accessor]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Mobile Row Component with Accordion
const MobileTableRow = ({ row, columns, onRowClick }) => {
  const [expanded, setExpanded] = useState(false)

  const primaryColumns = columns.slice(0, 3)
  const secondaryColumns = columns.slice(3)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div
        onClick={() => onRowClick?.(row)}
        className="p-4 space-y-2"
      >
        {primaryColumns.map((column, index) => (
          <div key={index} className="flex justify-between items-start">
            <span className="text-xs text-gray-500 font-medium">
              {column.header}:
            </span>
            <span className="text-sm text-gray-900 text-right ml-2">
              {column.cell ? column.cell(row) : row[column.accessor]}
            </span>
          </div>
        ))}
      </div>

      {secondaryColumns.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-center text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Xem thêm
              </>
            )}
          </button>

          {expanded && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-2">
              {secondaryColumns.map((column, index) => (
                <div key={index} className="flex justify-between items-start">
                  <span className="text-xs text-gray-500 font-medium">
                    {column.header}:
                  </span>
                  <span className="text-sm text-gray-900 text-right ml-2">
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { ResponsiveTable }
export default ResponsiveTable

