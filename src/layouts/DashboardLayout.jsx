import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import React from "react";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />

      <main
        className={`min-h-screen transition-[margin] duration-300 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
