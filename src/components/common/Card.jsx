import { cn } from '@/utils/cn'

const Card = ({ children, className, title, actions, noPadding = false }) => {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-custom border border-gray-200',
      'w-full',
      className
    )}>
      {(title || actions) && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          {title && (
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {actions && (
            <div className="flex items-center space-x-2 flex-wrap">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={cn(!noPadding && 'p-4 sm:p-6')}>
        {children}
      </div>
    </div>
  )
}

export { Card }
export default Card

