import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import Loading from "@/components/common/Loading";

// Lazy load pages
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const AssetsPage = lazy(() => import("@/pages/AssetsPage"));
const AssetDetailPage = lazy(() => import("@/pages/AssetDetailPage"));
const InvoicesPage = lazy(() => import("@/pages/InvoicesPage"));
const MaintenancePage = lazy(() => import("@/pages/MaintenancePage"));
const SlipsPage = lazy(() => import("@/pages/SlipsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const AssetHistoryPage = lazy(() => import("@/pages/AssetHistoryPage"));
const UserHistoryPage = lazy(() => import("@/pages/UserHistoryPage"));

// Root layout — AuthProvider mount 1 lần duy nhất ở đây
const RootLayout = ({ children }) => (
  <AuthProvider>
    <Suspense fallback={<Loading fullScreen text="Đang tải..." />}>
      {children}
    </Suspense>
  </AuthProvider>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <RootLayout>
        <LoginPage />
      </RootLayout>
    ),
  },
  {
    path: "/",
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
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: (
          <ProtectedRoute roles={["super_admin", "it_admin", "manager"]}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "assets",
        element: <AssetsPage />,
      },
      {
        path: "assets/:assetId",
        element: <AssetDetailPage />,
      },
      {
        path: "invoices",
        element: (
          <ProtectedRoute roles={["super_admin", "it_admin", "manager"]}>
            <InvoicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "maintenance",
        element: <MaintenancePage />,
      },
      {
        path: "slips",
        element: <SlipsPage />,
      },
      {
        path: "asset-history",
        element: <AssetHistoryPage />,
      },
      {
        path: "user-history",
        element: <UserHistoryPage />,
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute roles={["super_admin", "it_admin", "manager"]}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <div className="text-center p-8">401 - Unauthorized</div>,
  },
  {
    path: "*",
    element: <div className="text-center p-8">404 - Page Not Found</div>,
  },
]);
