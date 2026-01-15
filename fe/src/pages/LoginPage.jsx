import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
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
