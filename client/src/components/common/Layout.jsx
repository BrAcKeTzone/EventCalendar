import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const Layout = ({ children }) => {
  const location = useLocation();

  const shouldShowSidebar = !["/", "/sig", "/for"].includes(location.pathname);

  return (
    <div className="flex">
      {/* Conditional rendering of Sidebar */}
      {shouldShowSidebar && (
        <div className="min-h-screen z-10">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default Layout;
