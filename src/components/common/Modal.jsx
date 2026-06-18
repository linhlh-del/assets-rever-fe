import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useResponsive } from '@/hooks/useResponsive'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  fullScreenOnMobile = true,
}) => {
  const { isMobile } = useResponsive()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-2xl',
    lg: 'sm:max-w-4xl',
    xl: 'sm:max-w-6xl',
  }

  const modalClasses = cn(
    'relative bg-white shadow-xl w-full',
    fullScreenOnMobile && isMobile 
      ? 'h-full rounded-none' 
      : 'rounded-lg',
    !fullScreenOnMobile && 'rounded-lg',
    sizes[size]
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={cn(
        'flex min-h-full items-start sm:items-center justify-center',
        fullScreenOnMobile && isMobile ? 'p-0' : 'p-4'
      )}>
        <div 
          className={modalClasses}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b sticky top-0 bg-white z-10">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-4">
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className={cn(
            'px-4 sm:px-6 py-4 overflow-y-auto',
            fullScreenOnMobile && isMobile 
              ? 'h-[calc(100vh-57px)]' 
              : 'max-h-[calc(100vh-200px)]'
          )}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export { Modal }
export default Modal

