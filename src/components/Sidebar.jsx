import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  BarChart3,
  Calendar,
  Cpu,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
} from "lucide-react";
import api from "../api/axios";

const navItems = [
  { name: "Dashboard", to: "/dashboard", icon: Home },
  { name: "Profiles", to: "/profiles", icon: Users },
  { name: "Analytics", to: "/analytics", icon: BarChart3 },
  { name: "Calender", to: "/calender", icon: Calendar },
  { name: "AI Coach", to: "/ai-coach", icon: Cpu },
  { name: "Settings", to: "/settings", icon: Settings },
];

function Sidebar({ collapsed = false, onToggle }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/user/me");
        const name = response.data.displayName || response.data.email || "User";
        setUserName(name);
      } catch (error) {
        console.error("Failed to load sidebar user:", error);
      }
    };

    fetchUser();
  }, []);

  const initials = userName
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "U";

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col overflow-hidden border-r border-slate-200 bg-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-65"
      }`}
    >
      {/* ================= Header ================= */}

      <div
        className={`border-b border-slate-200 p-5 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "" : "gap-3"
          }`}
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-[#485E73]/10
              text-[#485E73]
              font-bold
              text-lg
            "
          >
            {initials}
          </div>

          {!collapsed && (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Welcome
                </p>

                <h2 className="text-xl font-bold text-slate-900 capitalize">
                  {userName || "User"}
                </h2>
              </div>

              <button
                type="button"
                onClick={onToggle}
                className="inline-flex gap-20 ml-auto rounded-2xl border border-[#485E73]/10 bg-[#485E73]/5 px-3 py-2 text-sm font-medium text-[#485E73] transition-all duration-200 hover:bg-[#485E73]/10 hover:shadow-sm"
                >
                <ChevronsLeft size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= Navigation ================= */}

      <nav className="flex-1 px-4 py-5 space-y-2">

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex items-center ${
                  collapsed ? "justify-center" : "gap-3"
                } rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#485E73]/10 text-[#485E73] border border-[#485E73]/10 shadow-sm"
                    : "text-slate-600 hover:bg-[#485E73]/5 hover:text-[#485E73]"
                }`
              }
            >
              <Icon size={19} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}

        {/* Collapse Button */}

        {collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="
              mt-3
              flex
              w-full
              justify-center
              rounded-2xl
              px-4
              py-3
              text-sm
              font-medium
              text-slate-600
              transition-colors
              duration-200
              hover:bg-[#485E73]/5
              hover:text-[#485E73]
            "
          >
            <ChevronsRight size={19} />
          </button>
        )}
      </nav>

      {/* ================= Help Card ================= */}

      {!collapsed && (
        <div className="m-4">
          <div
            className="
              rounded-3xl
              border
              border-[#485E73]/10
              bg-[#485E73]/5
              p-5
            "
          >
            <div className="flex gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                "
              >
                <HelpCircle
                  size={20}
                  className="text-[#485E73]"
                />
              </div>

              <div>

                <h3 className="font-semibold text-slate-900">
                  Need Help?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  contact us at <a href="mailto:algonest.dev@gmail.com" className="text-blue-500 underline">
                    E-mail
                  </a>
                </p>

              </div>

            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;