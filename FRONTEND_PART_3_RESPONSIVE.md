# REVER IT ASSET MANAGEMENT - RESPONSIVE DESIGN
## HƯỚNG DẪN THIẾT KẾ RESPONSIVE CHO TẤT CẢ MÀN HÌNH

**Project**: rever-website-manage-asset-it  
**Responsive**: Mobile First Approach  
**Breakpoints**: 5 levels (xs, sm, md, lg, xl, 2xl)

---

## 📋 MỤC LỤC

1. [Breakpoints Strategy](#1-breakpoints-strategy)
2. [Layout Responsive](#2-layout-responsive)
3. [Components Responsive](#3-components-responsive)
4. [Tables Responsive](#4-tables-responsive)
5. [Forms Responsive](#5-forms-responsive)
6. [Modals Responsive](#6-modals-responsive)
7. [Navigation Responsive](#7-navigation-responsive)
8. [Best Practices](#8-best-practices)

---

## 1. BREAKPOINTS STRATEGY

### 1.1. Updated Tailwind Config

**File**: `tailwind.config.js` (UPDATE)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',    // Extra small devices
      'sm': '640px',    // Small devices (phones landscape)
      'md': '768px',    // Medium devices (tablets)
      'lg': '1024px',   // Large devices (desktops)
      'xl': '1280px',   // Extra large devices
      '2xl': '1536px',  // 2X Extra large
    },
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        status: {
          available: '#10b981',
          'in-use': '#3b82f6',
          maintenance: '#f59e0b',
          broken: '#ef4444',
          disposed: '#78716c',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}
```

### 1.2. Responsive Utilities

**File**: `src/utils/responsive.js` (NEW)

```javascript
// Breakpoint values
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Get current breakpoint
export const getCurrentBreakpoint = () => {
  const width = window.innerWidth
  
  if (width < breakpoints.xs) return 'mobile'
  if (width < breakpoints.sm) return 'xs'
  if (width < breakpoints.md) return 'sm'
  if (width < breakpoints.lg) return 'md'
  if (width < breakpoints.xl) return 'lg'
  if (width < breakpoints['2xl']) return 'xl'
  return '2xl'
}

// Check if mobile
export const isMobile = () => {
  return window.innerWidth < breakpoints.md
}

// Check if tablet
export const isTablet = () => {
  const width = window.innerWidth
  return width >= breakpoints.md && width < breakpoints.lg
}

// Check if desktop
export const isDesktop = () => {
  return window.innerWidth >= breakpoints.lg
}
```

### 1.3. useResponsive Hook

**File**: `src/hooks/useResponsive.js` (NEW)

```javascript
import { useState, useEffect } from 'react'
import { getCurrentBreakpoint, isMobile, isTablet, isDesktop } from '@/utils/responsive'

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint())
  const [mobile, setMobile] = useState(isMobile())
  const [tablet, setTablet] = useState(isTablet())
  const [desktop, setDesktop] = useState(isDesktop())

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint())
      setMobile(isMobile())
      setTablet(isTablet())
      setDesktop(isDesktop())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    breakpoint,
    isMobile: mobile,
    isTablet: tablet,
    isDesktop: desktop,
    isSmallScreen: mobile || tablet,
  }
}
```

---

## 2. LAYOUT RESPONSIVE

### 2.1. Responsive Layout Component

**File**: `src/components/layout/Layout.jsx` (UPDATE)

```jsx
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'
import { Outlet } from 'react-router-dom'
import { useResponsive } from '@/hooks/useResponsive'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isMobile } = useResponsive()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar />}
        
        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <div className="mx-auto max-w-8xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
```

### 2.2. Responsive Header

**File**: `src/components/layout/Header.jsx` (UPDATE)

```jsx
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useResponsive } from '@/hooks/useResponsive'

const Header = ({ onMenuClick }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { isMobile } = useResponsive()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
            
            {/* Logo */}
            <img 
              src="/logo.png" 
              alt="Rever" 
              className="h-6 sm:h-8 w-auto"
            />
            
            {/* Title - Hidden on mobile */}
            <h1 className="hidden sm:block text-lg sm:text-xl font-semibold text-gray-900">
              IT Asset Management
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications - Hidden on small mobile */}
            <button className="hidden xs:block relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {/* User info - Hidden on mobile */}
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.user_metadata?.role || 'User'}
                  </p>
                </div>
                
                {/* Avatar */}
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm sm:text-base font-medium">
                  {user?.user_metadata?.full_name?.[0] || 'U'}
                </div>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {/* User info - Show on mobile in dropdown */}
                    <div className="md:hidden px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.user_metadata?.full_name || user?.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.user_metadata?.role || 'User'}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setShowDropdown(false)
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4" />
                      <span>Hồ sơ</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings')
                        setShowDropdown(false)
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Cài đặt</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
```

### 2.3. Mobile Sidebar Component

**File**: `src/components/layout/MobileSidebar.jsx` (NEW)

```jsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { X } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Wrench,
  ClipboardList,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useEffect } from 'react'

const MobileSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const role = user?.user_metadata?.role || 'user'

  // Lock body scroll when sidebar is open
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

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin_it', 'accountant', 'dev', 'user'],
    },
    {
      label: 'Người dùng',
      icon: Users,
      path: '/users',
      roles: ['admin_it', 'accountant', 'dev'],
    },
    {
      label: 'Tài sản',
      icon: Package,
      path: '/assets',
      roles: ['admin_it', 'accountant', 'dev', 'user'],
    },
    {
      label: 'Hóa đơn',
      icon: FileText,
      path: '/invoices',
      roles: ['admin_it', 'accountant'],
    },
    {
      label: 'Bảo trì',
      icon: Wrench,
      path: '/maintenance',
      roles: ['admin_it', 'accountant', 'dev', 'user'],
    },
    {
      label: 'Phiếu bàn giao',
      icon: ClipboardList,
      path: '/slips',
      roles: ['admin_it', 'accountant', 'dev', 'user'],
    },
    {
      label: 'Báo cáo',
      icon: BarChart3,
      path: '/reports',
      roles: ['admin_it', 'accountant', 'dev'],
    },
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(role)
  )

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50',
          'transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Rever" className="h-8 w-auto" />
            <span className="font-semibold text-gray-900">Menu</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-73px)]">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default MobileSidebar
```

### 2.4. Responsive Sidebar (Desktop)

**File**: `src/components/layout/Sidebar.jsx` (UPDATE)

```jsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Wrench,
  ClipboardList,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const Sidebar = () => {
  const { user } = useAuth()
  const role = user?.user_metadata?.role || 'user'

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin_it', 'accountant', 'dev', 'user'],
    },
    {
      label: 'Người dùng',
      icon: Users,
      path: '/users',
      roles: ['admin_it', 'accountant', 'dev'],
    },
    {
      label: 'Tài sản',
      icon: Package,
      path: '/assets',
      roles: ['admin_it', 'accountant', 'dev', 'user'],
    },
    {
      label: 'Hóa đơn',
      icon: FileText,
      path: '/invoices',
      roles: ['admin_it', 'accountant'],
    },
    {
      label: 'Bảo trì',
      icon: Wrench,
      path: '/maintenance',
      roles: ['admin_it', 'accountant', 'dev', 'user'],
    },
    {
      label: 'Phiếu bàn giao',
      icon: ClipboardList,
      path: '/slips',
      roles: ['admin_it', 'accountant', 'dev', 'user'],
    },
    {
      label: 'Báo cáo',
      icon: BarChart3,
      path: '/reports',
      roles: ['admin_it', 'accountant', 'dev'],
    },
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(role)
  )

  return (
    <aside className="hidden lg:block w-64 xl:w-72 bg-white border-r border-gray-200 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <nav className="p-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm xl:text-base">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
```

---

## 3. COMPONENTS RESPONSIVE

### 3.1. Responsive Button

**File**: `src/components/common/Button.jsx` (UPDATE)

```jsx
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
  hideTextOnMobile = false, // NEW
  fullWidthOnMobile = false, // NEW
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

export default Button
```

### 3.2. Responsive Card

**File**: `src/components/common/Card.jsx` (UPDATE)

```jsx
import { cn } from '@/utils/cn'

const Card = ({ children, className, title, actions, noPadding = false }) => {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-custom border border-gray-200',
      'w-full', // Full width on mobile
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

export default Card
```

### 3.3. Responsive Modal

**File**: `src/components/common/Modal.jsx` (UPDATE)

```jsx
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
  fullScreenOnMobile = true, // NEW
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

export default Modal
```

---

## 4. TABLES RESPONSIVE

### 4.1. Responsive Table Component

**File**: `src/components/common/ResponsiveTable.jsx` (NEW)

```jsx
import { useState } from 'react'
import { cn } from '@/utils/cn'
import { useResponsive } from '@/hooks/useResponsive'
import { ChevronDown, ChevronUp } from 'lucide-react'

const ResponsiveTable = ({ 
  columns, 
  data, 
  onRowClick, 
  loading,
  mobileCard, // Custom mobile card renderer
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

  // Show first 2-3 important columns
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
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
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

export default ResponsiveTable
```

### 4.2. Usage Example

```jsx
// Usage in UsersPage.jsx
import ResponsiveTable from '@/components/common/ResponsiveTable'

const UsersPage = () => {
  const columns = [
    { header: 'Mã NV', accessor: 'employee_code' },
    { header: 'Họ tên', accessor: 'full_name' },
    { 
      header: 'Email', 
      accessor: 'email',
      hideOnMobile: true // Hide on mobile
    },
    { 
      header: 'Phòng ban', 
      accessor: 'department',
      hideOnMobile: true
    },
    { header: 'Role', accessor: 'role' },
  ]

  // Custom mobile card renderer
  const renderMobileCard = (user) => (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-900">{user.full_name}</p>
          <p className="text-sm text-gray-500">{user.employee_code}</p>
        </div>
        <Badge variant={user.role}>{user.role}</Badge>
      </div>
      <div className="text-sm text-gray-600">
        <p>{user.department}</p>
        <p>{user.email}</p>
      </div>
    </div>
  )

  return (
    <ResponsiveTable
      columns={columns}
      data={users}
      onRowClick={handleRowClick}
      mobileCard={renderMobileCard}
    />
  )
}
```

---

## 5. FORMS RESPONSIVE

### 5.1. Responsive Form Layout

**File**: `src/components/common/FormGroup.jsx` (NEW)

```jsx
import { cn } from '@/utils/cn'

const FormGroup = ({ children, columns = 1, className }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn(
      'grid gap-4 sm:gap-6',
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  )
}

export default FormGroup
```

### 5.2. Example: Add User Form (Responsive)

```jsx
// In AddUserModal.jsx
<Modal isOpen={isOpen} onClose={onClose} title="Thêm người dùng mới" size="lg">
  <form onSubmit={handleSubmit}>
    {/* Section: Basic Info */}
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">
        Thông tin cơ bản
      </h4>
      <FormGroup columns={2}>
        <Input
          label="Mã nhân viên"
          required
          {...register('employee_code')}
        />
        <Input
          label="Email"
          type="email"
          required
          {...register('email')}
        />
        <Input
          label="Họ tên"
          required
          {...register('full_name')}
          className="sm:col-span-2" // Full width on desktop
        />
        <Input
          label="Số điện thoại"
          {...register('phone')}
        />
      </FormGroup>
    </div>

    {/* Section: Organization */}
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">
        Thông tin tổ chức
      </h4>
      <FormGroup columns={2}>
        <Select
          label="Phòng ban"
          required
          {...register('department')}
        />
        <Select
          label="Team"
          {...register('team')}
        />
      </FormGroup>
    </div>

    {/* Actions */}
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        fullWidthOnMobile
      >
        Hủy
      </Button>
      <Button
        type="submit"
        loading={loading}
        fullWidthOnMobile
      >
        Lưu
      </Button>
    </div>
  </form>
</Modal>
```

---

## 6. DASHBOARD RESPONSIVE

### 6.1. Responsive Stat Cards

**File**: `src/components/dashboard/StatCard.jsx` (UPDATE)

```jsx
import { cn } from '@/utils/cn'

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-50 text-gray-600',
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
            {value}
          </p>
          {trend && (
            <p className="text-2xs sm:text-xs text-gray-500 mt-1">
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'p-2 sm:p-3 rounded-lg flex-shrink-0 ml-3',
            colors[color]
          )}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
```

### 6.2. Responsive Charts

**File**: `src/components/dashboard/CustomizableChart.jsx` (UPDATE)

```jsx
import { useState } from 'react'
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useResponsive } from '@/hooks/useResponsive'

const CustomizableChart = ({ data, type = 'bar', title }) => {
  const { isMobile } = useResponsive()
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  // Responsive dimensions
  const height = isMobile ? 250 : 350
  const fontSize = isMobile ? 10 : 12

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        {type === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize, fill: '#6b7280' }}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 60 : 30}
            />
            <YAxis tick={{ fontSize, fill: '#6b7280' }} />
            <Tooltip />
            {!isMobile && <Legend />}
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        )}

        {type === 'pie' && (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={!isMobile}
              label={!isMobile}
              outerRadius={isMobile ? 80 : 120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            {!isMobile && <Legend />}
          </PieChart>
        )}

        {type === 'line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize, fill: '#6b7280' }}
            />
            <YAxis tick={{ fontSize, fill: '#6b7280' }} />
            <Tooltip />
            {!isMobile && <Legend />}
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default CustomizableChart
```

---

## 7. NAVIGATION RESPONSIVE

### 7.1. Breadcrumb Component

**File**: `src/components/layout/Breadcrumb.jsx` (NEW)

```jsx
import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm overflow-x-auto scrollbar-hide pb-2">
      <Link
        to="/dashboard"
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Dashboard</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={index} className="flex items-center space-x-1 flex-shrink-0">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-gray-500 hover:text-gray-700 transition-colors truncate max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
```

---

## 8. BEST PRACTICES

### 8.1. Responsive Images

```jsx
// Always use responsive images
<img
  src="/logo.png"
  alt="Logo"
  className="h-6 sm:h-8 w-auto" // Responsive height
/>

// Or with aspect ratio
<div className="aspect-video w-full">
  <img src={image} alt="" className="w-full h-full object-cover" />
</div>
```

### 8.2. Responsive Spacing

```jsx
// Use responsive padding/margin
<div className="p-4 sm:p-6 lg:p-8">
  <div className="space-y-4 sm:space-y-6">
    {/* Content */}
  </div>
</div>

// Responsive gaps
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {/* Items */}
</div>
```

### 8.3. Responsive Typography

```jsx
// Headings
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Title
</h1>

// Body text
<p className="text-sm sm:text-base lg:text-lg">
  Content
</p>
```

### 8.4. Touch-Friendly Targets

```jsx
// Minimum 44x44px touch targets on mobile
<button className="p-3 sm:p-2"> // Larger padding on mobile
  <Icon className="h-6 w-6 sm:h-5 sm:w-5" />
</button>
```

### 8.5. Responsive Actions

```jsx
// Stack buttons vertically on mobile
<div className="flex flex-col sm:flex-row gap-3">
  <Button fullWidthOnMobile>Save</Button>
  <Button variant="secondary" fullWidthOnMobile>Cancel</Button>
</div>
```

### 8.6. Hide/Show Elements

```jsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">
  Desktop only content
</div>

// Show on mobile, hide on desktop
<div className="lg:hidden">
  Mobile only content
</div>

// Show on tablet and up
<div className="hidden md:block">
  Tablet and desktop
</div>
```

### 8.7. Responsive Containers

```jsx
// Use container with responsive padding
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Max width with responsive
<div className="max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
  {/* Content */}
</div>
```

---

## 9. TESTING CHECKLIST

### 9.1. Devices to Test

- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] Samsung Galaxy S20 (360px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px)
- [ ] Large Desktop (1920px)

### 9.2. Responsive Checks

- [ ] All text readable without zooming
- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scrolling
- [ ] Images scale properly
- [ ] Forms usable on mobile
- [ ] Tables display correctly (card view)
- [ ] Modals work on all sizes
- [ ] Navigation accessible
- [ ] Charts render correctly
- [ ] Buttons not cut off

---

**File này bao gồm:**
✅ Breakpoints strategy đầy đủ (6 levels)
✅ useResponsive hook
✅ Layout responsive (Header, Sidebar, Mobile Menu)
✅ All components responsive
✅ Responsive tables (với mobile card view)
✅ Responsive forms
✅ Responsive dashboard
✅ Best practices chi tiết
✅ Testing checklist

**Website giờ sẽ hoàn toàn responsive trên TẤT CẢ màn hình!** 📱💻🖥️
