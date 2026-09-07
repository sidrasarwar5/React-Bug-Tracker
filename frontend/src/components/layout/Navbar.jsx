import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/auth";

const DASHBOARD_ROUTES = {
  manager: "/manager",
  qa: "/qa",
  developer: "/developer",
};

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardPath = DASHBOARD_ROUTES[user?.user_type] || "/login";

  const isOnProjects = location.pathname === dashboardPath;
  const isOnBugs = location.pathname.includes("/bugs");

  const NAV_LINKS = [
    {
      label: "Projects",
      active: isOnProjects,
      iconSrc: "/project.svg",
      iconActiveSrc: "/project-active.svg",
    },
    {
      label: "Bugs",
      active: isOnBugs,
      iconSrc: "/bug.svg",
      iconActiveSrc: "/bug-active.svg",
    },
  ];

  const UserCapsule = ({ className = "" }) => (
    <NavLink
      to="/profile"
      className={`flex items-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
      </span>
      <span className="font-heading text-sm font-medium leading-none tracking-normal align-middle text-[#3B3F70]">
        {user.name || "User"}
      </span>
    </NavLink>
  );

  return (
    <nav className="bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <NavLink to={dashboardPath} className="flex items-center gap-2">
            <img src="/logo.svg" alt="ManageBug" className="h-8 w-8" />
            <span className="logoHeading">
              Manage<span className="logosmHeading">Bug</span>
            </span>
          </NavLink>

          {/* Center Status Indicators (not clickable) */}
          <div className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className={`flex items-center gap-1.5 ${
                  link.active ? "text-gray-900" : "text-gray-500"
                }`}
              >
                <img
                  src={link.active ? link.iconActiveSrc : link.iconSrc}
                  alt=""
                  className="h-4 w-4"
                />
                <span className="font-heading text-xs  font-semibold leading-none tracking-normal align-middle">
                  {link.label}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              className="flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Notifications"
            >
              <img src="/Notification.svg" alt="" className="h-5 w-5" />
            </button>

            {user && <UserCapsule className="py-1.5 pr-4 pl-1.5" />}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 py-3 sm:hidden">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className={`flex items-center gap-1.5 text-body-small font-medium ${
                    link.active ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  <img
                    src={link.active ? link.iconActiveSrc : link.iconSrc}
                    alt=""
                    className="h-4 w-4"
                  />
                  {link.label}
                </div>
              ))}

              {user && <UserCapsule className="py-1.5 pr-4 pl-1.5" />}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
