import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { Outlet } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";

// Layout cho routes (sử dụng Outlet)
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useResponsive();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar />}

        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <div className="mx-auto max-w-8xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
export { Layout };
