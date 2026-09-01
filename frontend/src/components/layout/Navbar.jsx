import { NavLink, useNavigate } from "react-router-dom";
import { Bug, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS } from "../../constants/navigation";
import { useAuth } from "../../context/auth";
import UserMenu from "./UserMenu";

export default function Navbar({ userMenuItems = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleLinks = NAV_LINKS.filter((link) =>
    link.roles.includes(user?.role)
  );

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className=" bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
         
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Bug size={18} />
            </span>

            <span className="font-heading text-body1 font-semibold text-gray-900">
              Manage<span className="text-primary">Bug</span>
            </span>
          </NavLink>

        
          <div className="hidden items-center gap-6 md:flex">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-body-small font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

         
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-body-small font-medium text-gray-500 hover:text-status-pending"
            >
              <LogOut size={16} />
              Logout
            </button>

            {user && <UserMenu user={user} items={userMenuItems} />}
          </div>

       
          <button
            type="button"
            className="text-gray-700 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      
        {mobileOpen && (
          <div className="flex flex-col gap-3 border-t border-gray-200 py-3 md:hidden">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-body-small font-medium ${
                    isActive ? "text-primary" : "text-gray-500"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-body-small font-medium text-status-pending"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}