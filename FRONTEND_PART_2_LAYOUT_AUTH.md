# REVER IT ASSET MANAGEMENT - FRONTEND PART 2
## LAYOUT, AUTHENTICATION & CORE FEATURES

**Tiếp tục từ Part 1**

---

## 6. LAYOUT COMPONENTS

### 6.1. Header Component

**File**: `src/components/layout/Header.jsx`

```jsx
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings, LogOut, User } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png" 
              alt="Rever" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-semibold text-gray-900">
              IT Asset Management
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.user_metadata?.role || 'User'}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
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

### 6.2. Sidebar Component

**File**: `src/components/layout/Sidebar.jsx`

```jsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Wrench,
  Trash2,
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
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)] sticky top-[73px]">
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
              <span className="font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
```

### 6.3. Layout Component

**File**: `src/components/layout/Layout.jsx`

```jsx
import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
```

---

## 7. AUTHENTICATION

### 7.1. Supabase Client

**File**: `src/services/api.js`

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
```

### 7.2. Auth Context

**File**: `src/contexts/AuthContext.jsx`

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/services/api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          navigate('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          navigate('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [navigate])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          hd: 'rever.vn', // Restrict to rever.vn domain
        },
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 7.3. Protected Route

**File**: `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/common/Loading'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading fullScreen text="Đang kiểm tra quyền truy cập..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.user_metadata?.role || 'user'
  
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
```

### 7.4. Login Page

**File**: `src/pages/LoginPage.jsx`

```jsx
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/common/Button'
import { Chrome } from 'lucide-react'
import { toast } from 'sonner'

const LoginPage = () => {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Rever Logo" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            IT Asset Management
          </h1>
          <p className="text-gray-600 mt-2">
            Đăng nhập để tiếp tục
          </p>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleGoogleLogin}
          loading={loading}
          icon={Chrome}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Đăng nhập với Google
        </Button>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Lưu ý:</strong> Chỉ tài khoản @rever.vn mới có thể đăng nhập
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          © 2026 Rever. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
```

---

## 8. ROUTING

### 8.1. Router Configuration

**File**: `src/router.jsx`

```jsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

// Pages
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import UsersPage from '@/pages/UsersPage'
import AssetsPage from '@/pages/AssetsPage'
import AssetDetailPage from '@/pages/AssetDetailPage'
import InvoicesPage from '@/pages/InvoicesPage'
import MaintenancePage from '@/pages/MaintenancePage'
import SlipsPage from '@/pages/SlipsPage'
import ReportsPage from '@/pages/ReportsPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute roles={['admin_it', 'accountant', 'dev']}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'assets',
        element: <AssetsPage />,
      },
      {
        path: 'assets/:assetCode',
        element: <AssetDetailPage />,
      },
      {
        path: 'invoices',
        element: (
          <ProtectedRoute roles={['admin_it', 'accountant']}>
            <InvoicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'maintenance',
        element: <MaintenancePage />,
      },
      {
        path: 'slips',
        element: <SlipsPage />,
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute roles={['admin_it', 'accountant', 'dev']}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
```

### 8.2. Main App Component

**File**: `src/App.jsx`

```jsx
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
```

### 8.3. Entry Point

**File**: `src/main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 8.4. Global Styles

**File**: `src/styles/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', sans-serif;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 9. UTILITY FUNCTIONS

### 9.1. CN Utility

**File**: `src/utils/cn.js`

```javascript
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

### 9.2. Formatters

**File**: `src/utils/formatters.js`

```javascript
import { format } from 'date-fns'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '-'
  return format(new Date(date), formatStr)
}

export const formatDateTime = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const formatEmployeeCode = (code) => {
  if (!code) return '-'
  return code.toUpperCase()
}

export const formatPhone = (phone) => {
  if (!phone) return '-'
  // Format: 0912 345 678
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}
```

### 9.3. Constants

**File**: `src/utils/constants.js`

```javascript
export const ROLES = {
  ADMIN_IT: 'admin_it',
  ACCOUNTANT: 'accountant',
  DEV: 'dev',
  USER: 'user',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN_IT]: 'Admin/IT',
  [ROLES.ACCOUNTANT]: 'Kế toán',
  [ROLES.DEV]: 'Developer',
  [ROLES.USER]: 'Người dùng',
}

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RESIGNED: 'resigned',
}

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Đang làm việc',
  [USER_STATUS.INACTIVE]: 'Tạm nghỉ',
  [USER_STATUS.RESIGNED]: 'Đã nghỉ việc',
}

export const ASSET_STATUS = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  BROKEN: 'broken',
  DISPOSED: 'disposed',
}

export const ASSET_STATUS_LABELS = {
  [ASSET_STATUS.AVAILABLE]: 'Có sẵn',
  [ASSET_STATUS.IN_USE]: 'Đang sử dụng',
  [ASSET_STATUS.MAINTENANCE]: 'Đang bảo trì',
  [ASSET_STATUS.BROKEN]: 'Hư hỏng',
  [ASSET_STATUS.DISPOSED]: 'Đã thanh lý',
}

export const ASSET_STATUS_COLORS = {
  [ASSET_STATUS.AVAILABLE]: 'bg-green-100 text-green-800',
  [ASSET_STATUS.IN_USE]: 'bg-blue-100 text-blue-800',
  [ASSET_STATUS.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
  [ASSET_STATUS.BROKEN]: 'bg-red-100 text-red-800',
  [ASSET_STATUS.DISPOSED]: 'bg-gray-100 text-gray-800',
}

export const ASSET_CATEGORIES = [
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Monitor', label: 'Màn hình' },
  { value: 'Keyboard', label: 'Bàn phím' },
  { value: 'Mouse', label: 'Chuột' },
  { value: 'Headset', label: 'Tai nghe' },
  { value: 'Webcam', label: 'Webcam' },
  { value: 'Other', label: 'Khác' },
]

export const DEPARTMENTS = [
  { value: 'Sales', label: 'Sales' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'IT', label: 'IT' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'HR' },
  { value: 'Project Management', label: 'Project Management' },
  { value: 'General', label: 'General' },
]

export const MAINTENANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANNOT_FIX: 'cannot_fix',
}

export const MAINTENANCE_STATUS_LABELS = {
  [MAINTENANCE_STATUS.PENDING]: 'Chờ xử lý',
  [MAINTENANCE_STATUS.IN_PROGRESS]: 'Đang sửa',
  [MAINTENANCE_STATUS.COMPLETED]: 'Hoàn thành',
  [MAINTENANCE_STATUS.CANNOT_FIX]: 'Không sửa được',
}

export const FILE_TYPES = {
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  IMAGE: 'image/*',
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_FILES = 5
```

### 9.4. Permissions Helper

**File**: `src/utils/permissions.js`

```javascript
import { ROLES } from './constants'

export const canCreateUser = (role) => {
  return role === ROLES.ADMIN_IT
}

export const canEditUser = (role) => {
  return role === ROLES.ADMIN_IT
}

export const canDeleteUser = (role) => {
  return role === ROLES.ADMIN_IT
}

export const canCreateAsset = (role) => {
  return role === ROLES.ADMIN_IT
}

export const canEditAsset = (role) => {
  return role === ROLES.ADMIN_IT
}

export const canAssignAsset = (role) => {
  return role === ROLES.ADMIN_IT
}

export const canDisposeAsset = (role) => {
  return role === ROLES.ADMIN_IT
}

export const canViewAssetPrice = (role) => {
  return [ROLES.ADMIN_IT, ROLES.ACCOUNTANT].includes(role)
}

export const canManageInvoice = (role) => {
  return [ROLES.ADMIN_IT, ROLES.ACCOUNTANT].includes(role)
}

export const canUpdateMaintenance = (role) => {
  return role === ROLES.ADMIN_IT
}

export const canReportMaintenance = () => {
  return true // All users can report
}

export const canGenerateReport = (role) => {
  return [ROLES.ADMIN_IT, ROLES.ACCOUNTANT, ROLES.DEV].includes(role)
}
```

---

## 10. CUSTOM HOOKS

### 10.1. useAuth Hook

**File**: `src/hooks/useAuth.js`

```javascript
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 10.2. useDebounce Hook

**File**: `src/hooks/useDebounce.js`

```javascript
import { useState, useEffect } from 'react'

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

### 10.3. usePermission Hook

**File**: `src/hooks/usePermission.js`

```javascript
import { useAuth } from './useAuth'
import * as permissions from '@/utils/permissions'

export const usePermission = () => {
  const { user } = useAuth()
  const role = user?.user_metadata?.role || 'user'

  return {
    canCreateUser: permissions.canCreateUser(role),
    canEditUser: permissions.canEditUser(role),
    canDeleteUser: permissions.canDeleteUser(role),
    canCreateAsset: permissions.canCreateAsset(role),
    canEditAsset: permissions.canEditAsset(role),
    canAssignAsset: permissions.canAssignAsset(role),
    canDisposeAsset: permissions.canDisposeAsset(role),
    canViewAssetPrice: permissions.canViewAssetPrice(role),
    canManageInvoice: permissions.canManageInvoice(role),
    canUpdateMaintenance: permissions.canUpdateMaintenance(role),
    canReportMaintenance: permissions.canReportMaintenance(),
    canGenerateReport: permissions.canGenerateReport(role),
    role,
  }
}
```

---

## 11. HTML TEMPLATE

**File**: `index.html`

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Rever IT Asset Management System" />
    <title>Rever IT Assets</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

**Phần này bao gồm:**
✅ Layout Components (Header, Sidebar, Layout)
✅ Authentication (Supabase, Context, Protected Routes)
✅ Routing (Router config, App component)
✅ Utility Functions (cn, formatters, constants, permissions)
✅ Custom Hooks (useAuth, useDebounce, usePermission)
✅ HTML Template

**Tiếp theo tôi sẽ tạo Part 3:**
- Service Layer (API calls)
- State Management (Zustand stores)
- Dashboard Page
- Users Page với CRUD operations

Bạn có muốn tôi tiếp tục không?
