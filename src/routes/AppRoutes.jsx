import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import RootRedirect from "../routes/RouteRedirect"; // 

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import Profiles from "../pages/profiles/Profiles";
import Analytics from "../pages/analytics/Analytics";
import Calender from "../pages/calender/Calender";
import AICoach from "../pages/ai-coach/AICoach";
import Settings from "../pages/settings/Settings";

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Routes (no login required) */}
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/ai-coach" element={<AICoach />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;