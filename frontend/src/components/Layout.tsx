import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // ✅ Routes where footer should be hidden
  const hideFooterRoutes = ["/ask-question"];

  // ✅ Routes where sidebar should be hidden
  const hideSidebarRoutes = ["/", "/login", "/signup"];

  const isSidebarHidden = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-16 lg:flex-row-reverse">
        {/* Sidebar (show only if not hidden) */}
        {!isSidebarHidden && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header bhi optional ban sakta hai */}
          {!isSidebarHidden && <Header />}

          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>

          {/* ✅ Show footer only if route not in hideFooterRoutes */}
          {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
