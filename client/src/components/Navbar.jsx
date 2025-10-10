import { Link } from "react-router-dom";
import { FaGamepad, FaUser, FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext.jsx";
import { useTheme } from "../Context/ThemeContext.jsx";
import { motion } from "framer-motion";
import { useState } from "react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg fixed w-full z-50 transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaGamepad className="text-purple-500 text-2xl" />
            <Link to="/" className="font-bold text-xl">
              Gamify
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-purple-400 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-purple-400 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-purple-400 transition">
              Contact
            </Link>
            {user && (
              <Link
                to="/dashboard/profile"
                className={`flex items-center space-x-2 p-2 rounded transition ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <FaUser />
                <span>Profile</span>
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors shadow-md`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </motion.button>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded transition border border-purple-500 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className={`px-4 py-2 rounded transition border border-purple-500 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded hover:bg-purple-700 transition bg-purple-600 text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded transition border border-purple-500 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="hover:text-purple-400 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="hover:text-purple-400 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-purple-400 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Dark Mode Toggle for Mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors shadow-md flex items-center justify-center w-12`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </motion.button>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded transition border border-purple-500 text-center ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded transition border border-purple-500 text-center ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded hover:bg-purple-700 transition bg-purple-600 text-white text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded transition border border-purple-500 text-center ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};