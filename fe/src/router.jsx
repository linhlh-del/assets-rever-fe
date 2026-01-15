import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'

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

// Root layout wrapper
const RootLayout = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <RootLayout>
        <LoginPage />
      </RootLayout>
    ),
  },
  {
    path: '/',
    element: (
      <RootLayout>
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </RootLayout>
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
    element: <div className="text-center p-8">401 - Unauthorized</div>,
  },
  {
    path: '*',
    element: <div className="text-center p-8">404 - Page Not Found</div>,
  },
])
