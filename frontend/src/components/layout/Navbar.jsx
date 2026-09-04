import { NavLink, useNavigate } from "react-router-dom";
import { Bug, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardPath = DASHBOARD_ROUTES[user?.user_type] || "/login";

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  }

  return (
    <nav className="bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <NavLink to={dashboardPath} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Bug size={18} />
            </span>

            <span className="font-heading text-body1 font-semibold text-gray-900">
              Manage<span className="text-primary">Bug</span>
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-4 sm:flex">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-body-small font-medium text-gray-500 hover:text-status-pending"
            >
              <LogOut size={16} />
              Logout
            </button>

            {user && <UserMenu user={user} />}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
       
        {isMenuOpen && (
          <div className="border-t border-gray-100 py-3 sm:hidden">
            <div className="flex flex-col gap-3">
              =
              {user && (
                <div className="px-1">
                  <UserMenu user={user} />
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-small font-medium text-gray-500 hover:bg-gray-50 hover:text-status-pending"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
