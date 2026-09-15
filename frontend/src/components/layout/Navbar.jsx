import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import Avatar from "../ui/Avatar";

const DASHBOARD_ROUTES = {
  manager: "/manager",
  qa: "/qa",
  developer: "/developer",
};

function buildHandle(name) {
  if (!name) return "";
  const firstName = name.trim().split(/\s+/)[0].toLowerCase();
  return `${firstName}.`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardPath = DASHBOARD_ROUTES[user?.user_type] || "/login";

  const isOnProjects = location.pathname === dashboardPath;
  const isOnBugs = location.pathname.includes("/bugs");

  const NAV_LINKS = [
    {
      label: "Projects",
      path: dashboardPath,
      active: isOnProjects,
      iconSrc: "/Navbar/project.svg",
      iconActiveSrc: "/Navbar/project-active.svg",
    },
    {
      label: "Bugs",
      path: "/bugs",
      active: isOnBugs,
      iconSrc: "/Navbar/bug.svg",
      iconActiveSrc: "/Navbar/bug-active.svg",
    },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const handle = buildHandle(user?.name);

  const UserCapsule = ({ className = "" }) => (
    <NavLink
      to="/profile"
      className={`flex items-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 ${className}`}
    >
      <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />

      <span className="font-heading text-sm font-medium leading-none tracking-normal text-[#3B3F70]">
        {handle || "User"}
      </span>
    </NavLink>
  );

  return (
    <div className="sticky top-0 z-20">
      <nav className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <NavLink to={dashboardPath} className="flex items-center gap-2">
              <img src="/Navbar/logo.svg" alt="ManageBug" className="h-8 w-8" />

              <span className="logoHeading">
                Manage<span className="logosmHeading">Bug</span>
              </span>
            </NavLink>

            <div className="hidden items-center gap-6 sm:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className={`flex items-center gap-1.5 ${
                    link.active
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <img
                    src={link.active ? link.iconActiveSrc : link.iconSrc}
                    alt=""
                    className="h-4 w-4"
                  />

                  <span className="font-heading text-xs font-semibold leading-none tracking-normal">
                    {link.label}
                  </span>
                </NavLink>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                className="flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Notifications"
              >
                <img
                  src="/Navbar/Notification.svg"
                  alt=""
                  className="h-5 w-5"
                />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-status-pending"
                aria-label="Logout"
              >
                <span>Logout</span>
                <LogOut size={18} className="ml-2" />
              </button>

              {user && <UserCapsule className="py-1.5 pr-4 pl-1.5" />}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="py-3 sm:hidden">
              <div className="flex flex-col gap-3">
                {/* Mobile Navigation */}
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-1.5 text-body-small font-medium ${
                      link.active ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    <img
                      src={link.active ? link.iconActiveSrc : link.iconSrc}
                      alt=""
                      className="h-4 w-4"
                    />

                    <span>{link.label}</span>
                  </NavLink>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center text-body-small font-medium text-status-pending hover:text-red-700"
                >
                  <span>Logout</span>
                  <LogOut size={16} className="ml-2" />
                </button>

                {user && <UserCapsule className="py-1.5 pr-4 pl-1.5" />}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
