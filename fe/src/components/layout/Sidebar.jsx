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
