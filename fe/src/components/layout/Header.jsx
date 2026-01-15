import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings, LogOut, User, Menu } from 'lucide-react'
import { useState } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import RedLogo from '@/assets/images/Rever-Redlogo.png'

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
                className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
            
            {/* Logo */}
            <img 
              src={RedLogo}
              alt="Rever" 
              className="h-12 sm:h-12 w-auto"
            />
            
            {/* Title - Hidden on mobile */}
            <h1 className="hidden sm:block text-lg sm:text-xl font-semibold text-gray-900">
              IT Asset Management
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
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
