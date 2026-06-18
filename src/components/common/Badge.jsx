import { cn } from '@/utils/cn'

const Badge = ({ 
  label, 
  variant = 'primary',
  size = 'md'
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  }

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full whitespace-nowrap',
      variants[variant],
      sizes[size]
    )}>
      {label}
    </span>
  )
}

export { Badge }
export default Badge

