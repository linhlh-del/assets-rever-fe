import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

const SearchInput = ({ 
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className,
  ...props 
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm',
          'placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      />
    </div>
  )
}

export default SearchInput
