import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/common/Button";
import { toast } from "sonner";
import RedLogo from "@/assets/images/Rever-Redlogo.png";
import GoogleLogo from "@/assets/images/google-icon.png";

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-12">
        {/* Logo */}
        <div className="text-left mb-8">
          <img src={RedLogo} alt="Rever" className="h-12 sm:h-12 w-auto" />

          <p className="text-gray-500 mt-8 font-semibold text-[1.2rem] opacity-85">
            Đăng nhập để truy cập Hệ thống
          </p>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleGoogleLogin}
          loading={loading}
          variant="primary"
          size="md"
          style={{ padding: "0px", border: "1px solid #3b82f6" }}
          className="w-full h-12 p-0  overflow-hidden hover:shadow-lg transition-shadow duration-300 flex border-3 border-blue-00"
        >
          <div className="h-full w-full  flex items-center">
            <div className="h-full aspect-square flex items-center justify-center bg-white border-1  flex-shrink-0">
              <img src={GoogleLogo} alt="Google" className="w-6 h-6" />
            </div>

            <span className="flex-1 text-center font-medium tracking-[1px]">
              Sign in with Google
            </span>
          </div>
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
  );
};

export default LoginPage;
