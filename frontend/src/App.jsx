import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PlannerPage from "./pages/PlannerPage";
import SettingsPage from "./pages/SettingsPage";
import Navbar from "./components/common/Navbar";
import InstallBanner from "./components/common/InstallBanner";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useAuthStore } from "./store/authStore";

function AppLayout({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return (
    <div className="min-h-screen">
      {isAuthenticated && <Navbar />}
      {isAuthenticated && <InstallBanner />}
      <main>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <PlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
  );
}
