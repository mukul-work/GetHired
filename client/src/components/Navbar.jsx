// client/src/components/Navbar.jsx
// UPDATED: Added dark mode toggle + Calendar & Skills nav links
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Recruiters", to: "/recruiters" },
  { label: "Blogs", to: "/blogs" },
  { label: "Calendar", to: "/calendar" },
  { label: "Trending Skills", to: "/skills" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-yellow-500 font-extrabold text-xl tracking-tight">
            Get
          </span>
          <span className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight">
            Hired
          </span>
          <span className="ml-1 text-xs text-gray-400 font-normal hidden sm:block">
            | KIET Placements
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-red-500 transition px-2"
            >
              Logout
            </button>
          )}
          <button
            onClick={handleAdminClick}
            className="bg-yellow-400 text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            {isAdmin ? "Admin Panel" : "Login"}
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                pathname === l.to
                  ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => { handleAdminClick(); setMenuOpen(false); }}
            className="w-full text-left px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-500"
          >
            {isAdmin ? "Admin Panel" : "Login"}
          </button>
          {isAdmin && (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
