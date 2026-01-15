import { cn } from '@/utils/cn'

const Tabs = ({ 
  tabs = [],
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}

export default Tabs
