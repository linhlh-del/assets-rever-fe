import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
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
