import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

const DASHBOARD_ROUTES = {
  manager: "/manager",
  qa: "/qa",
  developer: "/developer",
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner, to avoid flashing content while auth loads

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    return (
      <Navigate to={DASHBOARD_ROUTES[user.user_type] || "/login"} replace />
    );
  }

  return children;
}