import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className,
  icon: Icon,
  hideTextOnMobile = false,
  fullWidthOnMobile = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary-500',
  }
  
  const sizes = {
    sm: 'px-2 sm:px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-2 text-sm sm:text-base',
    lg: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg',
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidthOnMobile && 'w-full sm:w-auto',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && Icon && (
        <Icon className={cn(
          'h-4 w-4',
          !hideTextOnMobile && 'mr-2',
          hideTextOnMobile && 'sm:mr-2'
        )} />
      )}
      <span className={cn(hideTextOnMobile && 'hidden sm:inline')}>
        {children}
      </span>
    </button>
  )
}

export { Button }
export default Button
