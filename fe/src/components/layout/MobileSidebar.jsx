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
