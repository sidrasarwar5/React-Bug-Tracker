import { NavLink, useNavigate } from "react-router-dom";
import { Bug, LogOut } from "lucide-react";
import { useAuth } from "../../context/auth";
import UserMenu from "./UserMenu";

const DASHBOARD_ROUTES = {
  manager: "/manager",
  qa: "/qa",
  developer: "/developer",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = DASHBOARD_ROUTES[user?.user_type] || "/login";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <NavLink to={dashboardPath} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Bug size={18} />
            </span>

            <span className="font-heading text-body1 font-semibold text-gray-900">
              Manage<span className="text-primary">Bug</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-body-small font-medium text-gray-500 hover:text-status-pending"
            >
              <LogOut size={16} />
              Logout
            </button>

            {user && <UserMenu user={user} />}
          </div>
        </div>
      </div>
    </nav>
  );
}
