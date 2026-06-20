import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/common/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun, LogOut, Lock, Bell, Eye } from 'lucide-react'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    email_notifications: true,
    system_alerts: true,
    two_factor_auth: false,
    export_history: true,
  })

  const [editPassword, setEditPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleSettingChange = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Mật khẩu không khớp')
      return
    }
    // Call API to change password
    alert('Mật khẩu đã được cập nhật')
    setEditPassword(false)
    setPasswordForm({ current: '', new: '', confirm: '' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài đặt"
        description="Quản lý tài khoản, bảo mật, và tùy chọn hệ thống"
      />

      {/* User Profile */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Thông tin tài khoản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Tên</p>
            <p className="text-base font-medium">{user?.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-base font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Chức vụ</p>
            <p className="text-base font-medium">{user?.role || 'User'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phòng ban</p>
            <p className="text-base font-medium">{user?.department || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Bảo mật
        </h2>

        {/* Change Password */}
        <div className="space-y-4">
          {!editPassword ? (
            <Button
              variant="secondary"
              onClick={() => setEditPassword(true)}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Đổi mật khẩu
            </Button>
          ) : (
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <input
                type="password"
                placeholder="Mật khẩu hiện tại"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handlePasswordChange}
                >
                  Cập nhật
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setEditPassword(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}

          {/* Two Factor Auth */}
          <div className="mt-6 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Xác thực hai yếu tố (2FA)</p>
                <p className="text-sm text-muted-foreground">Bảo vệ tài khoản bằng mã xác minh</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.two_factor_auth}
                  onChange={() => handleSettingChange('two_factor_auth')}
                  className="w-4 h-4"
                />
                {settings.two_factor_auth ? 'Bật' : 'Tắt'}
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Thông báo
        </h2>

        <div className="space-y-4">
          {[
            { key: 'email_notifications', label: 'Thông báo qua email', desc: 'Nhận email cho các sự kiện quan trọng' },
            { key: 'system_alerts', label: 'Cảnh báo hệ thống', desc: 'Nhận thông báo lỗi và cảnh báo bảo mật' },
            { key: 'export_history', label: 'Lịch sử xuất dữ liệu', desc: 'Lưu lịch sử các lần xuất dữ liệu' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={() => handleSettingChange(key)}
                  className="w-4 h-4"
                />
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Giao diện</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
              theme === 'light'
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50'
            }`}
          >
            <Sun className="w-4 h-4" />
            Sáng
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
              theme === 'dark'
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50'
            }`}
          >
            <Moon className="w-4 h-4" />
            Tối
          </button>
        </div>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Quyền riêng tư
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Dữ liệu của bạn được bảo vệ theo chính sách bảo mật của công ty. Bạn có thể yêu cầu xoá dữ liệu cá nhân.
        </p>
        <div className="space-y-2">
          <Button variant="secondary" className="w-full">
            Tải xuống dữ liệu của tôi
          </Button>
          <Button variant="destructive" className="w-full">
            Xoá tài khoản (yêu cầu admin)
          </Button>
        </div>
      </Card>

      {/* Logout */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Đăng xuất</h3>
            <p className="text-sm text-muted-foreground">Thoát khỏi phiên làm việc hiện tại</p>
          </div>
          <Button
            variant="destructive"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
      </Card>
    </div>
  )
}
