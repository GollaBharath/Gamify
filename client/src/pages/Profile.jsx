import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext.jsx";
import {
  FaUser,
  FaEnvelope,
  FaKey,
  FaEdit,
  FaChartLine,
  FaShieldAlt,
  FaMoon,
  FaSun,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

export const Profile = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState(user?.username || "");
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const stats = {
    activity: 87,
    security: 95,
    completeness: 72,
  };

  const handleSave = () => setEditMode(false);
  const handleDeleteAccount = () => console.log("Account deletion requested");

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div
      className={`min-h-screen mt-16 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      {/* Gradient overlay with subtle animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`fixed inset-0 bg-gradient-to-br ${
          darkMode
            ? "from-purple-900/30 via-indigo-900/20 to-blue-900/20"
            : "from-purple-50/80 via-pink-50/80 to-blue-50/80"
        } -z-10`}
      />

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Header with smooth transitions */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1
              className={`text-3xl md:text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-1`}
            >
              Profile Dashboard
            </h1>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage your account and settings
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors shadow-md`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-red-400"
                  : "bg-white hover:bg-gray-100 text-red-600 border border-gray-300"
              } transition-colors shadow-md`}
            >
              <RiLogoutBoxLine />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs with animated indicator */}
        <div className="relative mb-8">
          <div className="flex space-x-1">
            {["profile", "security", "stats"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2.5 rounded-lg capitalize z-10 transition-colors ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } font-medium`}
              >
                <span className="relative z-10">{tab}</span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-lg ${
                      darkMode ? "bg-purple-600/90" : "bg-purple-100"
                    } -z-0`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          <div
            className={`absolute bottom-0 h-px w-full ${
              darkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Avatar Card */}
              <motion.div
                variants={cardVariants}
                className={`rounded-2xl p-6 ${
                  darkMode
                    ? "bg-gray-800/80 border-gray-700"
                    : "bg-white/90 border-gray-200 shadow-xl"
                } border backdrop-blur-lg`}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-32 h-32 rounded-full ${
                      darkMode
                        ? "bg-gradient-to-br from-purple-900 to-indigo-900"
                        : "bg-gradient-to-br from-purple-200 to-indigo-200"
                    } 
                      flex items-center justify-center text-5xl font-bold mb-4 shadow-lg ${
                        darkMode ? "text-white" : "text-purple-700"
                      }`}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </motion.div>
                  <h2
                    className={`text-xl font-bold mb-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user?.username}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        darkMode
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      Premium Member
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      Joined {new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                variants={cardVariants}
                className={`rounded-2xl p-6 ${
                  darkMode
                    ? "bg-gray-800/80 border-gray-700"
                    : "bg-white/90 border-gray-200 shadow-xl"
                } border backdrop-blur-lg lg:col-span-2`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Personal Information
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEditMode(!editMode)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    <FaEdit size={14} />
                    <span>{editMode ? "Cancel" : "Edit"}</span>
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Username Field */}
                  <motion.div
                    whileHover={{ scale: editMode ? 1 : 1.01 }}
                    className={`flex items-start space-x-4 p-3 rounded-lg ${
                      darkMode ? "hover:bg-gray-700/10" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        darkMode ? "bg-purple-900/30" : "bg-purple-100"
                      } shadow-sm`}
                    >
                      <FaUser
                        className={
                          darkMode ? "text-purple-400" : "text-purple-600"
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Username
                      </h3>
                      {editMode ? (
                        <input
                          type="text"
                          value={tempUsername}
                          onChange={(e) => setTempUsername(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg ${
                            darkMode
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-white text-gray-900 border-gray-300"
                          } 
                            border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                        />
                      ) : (
                        <p
                          className={
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {user?.username}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-start space-x-4 p-3 rounded-lg ${
                      darkMode ? "hover:bg-gray-700/10" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        darkMode ? "bg-blue-900/30" : "bg-blue-100"
                      } shadow-sm`}
                    >
                      <FaEnvelope
                        className={darkMode ? "text-blue-400" : "text-blue-600"}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email
                      </h3>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {user?.email}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        darkMode
                          ? "bg-green-900/30 text-green-400"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      Verified
                    </span>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-start space-x-4 p-3 rounded-lg ${
                      darkMode ? "hover:bg-gray-700/10" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        darkMode ? "bg-amber-900/30" : "bg-amber-100"
                      } shadow-sm`}
                    >
                      <FaKey
                        className={
                          darkMode ? "text-amber-400" : "text-amber-600"
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Password
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          ••••••••••
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            darkMode
                              ? "bg-green-900/30 text-green-400"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          Strong
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowSecurityModal(true)}
                                           className={`px-4 py-2 rounded-xl ${
                        darkMode
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-purple-500 hover:bg-purple-600"
                      } text-white transition-colors`}
                    >
                      Change
                    </motion.button>
                  </motion.div>

                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end space-x-3 pt-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setEditMode(false)}
                        className={`px-4 py-2 rounded-xl ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        } transition-colors`}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSave}
                        className={`px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-colors shadow-md`}
                      >
                        Save Changes
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              key="security"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`rounded-2xl p-6 ${
                darkMode
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-white/90 border-gray-200 shadow-xl"
              } border backdrop-blur-lg`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Security Center
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Security Status Card */}
                <motion.div
                  variants={cardVariants}
                  className={`p-6 rounded-xl ${
                    darkMode
                      ? "bg-gray-700/80 border-gray-600"
                      : "bg-gray-50 border-gray-200 shadow-lg"
                  } border backdrop-blur-sm`}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className={`p-3 rounded-xl ${
                        darkMode ? "bg-purple-900/30" : "bg-purple-100"
                      } shadow-sm`}
                    >
                      <FaShieldAlt
                        className={
                          darkMode ? "text-purple-400" : "text-purple-600"
                        }
                        size={20}
                      />
                    </div>
                    <h3
                      className={`font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Security Status
                    </h3>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Strength
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          stats.security > 80
                            ? "text-green-500"
                            : stats.security > 50
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {stats.security}%
                      </span>
                    </div>
                    <div
                      className={`w-full h-2.5 rounded-full ${
                        darkMode ? "bg-gray-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full ${
                          stats.security > 80
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : stats.security > 50
                            ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                            : "bg-gradient-to-r from-red-500 to-pink-500"
                        }`}
                        style={{ width: `${stats.security}%` }}
                      />
                    </div>
                  </div>
                  <ul
                    className={`space-y-3 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {[
                      { text: "Strong password", status: true },
                      { text: "Email verified", status: true },
                      { text: "Two-factor authentication", status: false },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div
                          className={`p-1 rounded-full ${
                            item.status 
                              ? darkMode ? "bg-green-500/20" : "bg-green-100"
                              : darkMode ? "bg-gray-500/20" : "bg-gray-200"
                          }`}
                        >
                          <FaCheck
                            className={`text-xs ${
                              item.status 
                                ? darkMode ? "text-green-500" : "text-green-600"
                                : darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          />
                        </div>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Security Actions Card */}
                <motion.div
                  variants={cardVariants}
                  className={`p-6 rounded-xl ${
                    darkMode
                      ? "bg-gray-700/80 border-gray-600"
                      : "bg-gray-50 border-gray-200 shadow-lg"
                  } border backdrop-blur-sm`}
                >
                  <h3
                    className={`font-bold mb-6 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Security Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSecurityModal(true)}
                      className={`p-4 rounded-xl flex flex-col items-center ${
                        darkMode
                          ? "bg-gray-600 hover:bg-gray-500 border-gray-500"
                          : "bg-white hover:bg-gray-100 border-gray-300"
                      } border transition-colors shadow-sm`}
                    >
                      <div
                        className={`p-3 rounded-xl mb-3 ${
                          darkMode ? "bg-purple-900/30" : "bg-purple-100"
                        } shadow-sm`}
                      >
                        <FaKey
                          className={
                            darkMode ? "text-purple-400" : "text-purple-600"
                          }
                          size={18}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Change Password
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeleteAccount}
                      className={`p-4 rounded-xl flex flex-col items-center ${
                        darkMode
                          ? "bg-red-900/30 hover:bg-red-800/30 border-red-800"
                          : "bg-red-50 hover:bg-red-100 border-red-200"
                      } border transition-colors shadow-sm`}
                    >
                      <div
                        className={`p-3 rounded-xl mb-3 ${
                          darkMode ? "bg-red-900/30" : "bg-red-200"
                        } shadow-sm`}
                      >
                        <FaTrash
                          className={darkMode ? "text-red-400" : "text-red-600"}
                          size={18}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-white" : "text-red-900"
                        }`}
                      >
                        Delete Account
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <motion.div
              key="stats"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`rounded-2xl p-6 ${
                darkMode
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-white/90 border-gray-200 shadow-xl"
              } border backdrop-blur-lg`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Your Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Activity Card */}
                <motion.div
                  variants={cardVariants}
                  className={`p-6 rounded-xl ${
                    darkMode
                      ? "bg-gray-700/80 border-gray-600"
                      : "bg-gray-50 border-gray-200 shadow-lg"
                  } border backdrop-blur-sm`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-1`}
                      >
                        Activity Level
                      </h3>
                      <p
                        className={`text-3xl font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.activity}%
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${
                        darkMode ? "bg-purple-900/30" : "bg-purple-100"
                      } shadow-sm`}
                    >
                      <FaChartLine
                        className={
                          darkMode ? "text-purple-400" : "text-purple-600"
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`w-full h-2.5 rounded-full ${
                      darkMode ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
                      style={{ width: `${stats.activity}%` }}
                    />
                  </div>
                </motion.div>

                {/* Profile Completeness Card */}
                <motion.div
                  variants={cardVariants}
                  className={`p-6 rounded-xl ${
                    darkMode
                      ? "bg-gray-700/80 border-gray-600"
                      : "bg-gray-50 border-gray-200 shadow-lg"
                  } border backdrop-blur-sm`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-1`}
                      >
                        Profile Complete
                      </h3>
                      <p
                        className={`text-3xl font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.completeness}%
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${
                        darkMode ? "bg-blue-900/30" : "bg-blue-100"
                      } shadow-sm`}
                    >
                      <FaUser
                        className={darkMode ? "text-blue-400" : "text-blue-600"}
                      />
                    </div>
                  </div>
                  <div
                    className={`w-full h-2.5 rounded-full ${
                      darkMode ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"
                      style={{ width: `${stats.completeness}%` }}
                    />
                  </div>
                </motion.div>

                {/* Security Score Card */}
                <motion.div
                  variants={cardVariants}
                  className={`p-6 rounded-xl ${
                    darkMode
                      ? "bg-gray-700/80 border-gray-600"
                      : "bg-gray-50 border-gray-200 shadow-lg"
                  } border backdrop-blur-sm`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-1`}
                      >
                        Security Score
                      </h3>
                      <p
                        className={`text-3xl font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stats.security}%
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${
                        darkMode ? "bg-green-900/30" : "bg-green-100"
                      } shadow-sm`}
                    >
                                            <FaShieldAlt
                        className={
                          darkMode ? "text-green-400" : "text-green-600"
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`w-full h-2.5 rounded-full ${
                      darkMode ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500"
                      style={{ width: `${stats.security}%` }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Additional Stats Section */}
              <motion.div
                variants={cardVariants}
                className={`p-6 rounded-xl ${
                  darkMode
                    ? "bg-gray-700/80 border-gray-600"
                    : "bg-gray-50 border-gray-200 shadow-lg"
                } border backdrop-blur-sm`}
              >
                <h3
                  className={`font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      action: "Profile updated",
                      time: "2 hours ago",
                      icon: <FaUser className={darkMode ? "text-purple-400" : "text-purple-600"} />,
                      color: darkMode ? "bg-purple-900/30" : "bg-purple-100",
                    },
                    {
                      action: "Password changed",
                      time: "1 day ago",
                      icon: <FaKey className={darkMode ? "text-amber-400" : "text-amber-600"} />,
                      color: darkMode ? "bg-amber-900/30" : "bg-amber-100",
                    },
                    {
                      action: "Email verified",
                      time: "3 days ago",
                      icon: <FaEnvelope className={darkMode ? "text-blue-400" : "text-blue-600"} />,
                      color: darkMode ? "bg-blue-900/30" : "bg-blue-100",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        darkMode ? "hover:bg-gray-600/50" : "hover:bg-gray-100"
                      } transition-colors`}
                    >
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {activity.action}
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Change Password Modal */}
        <AnimatePresence>
          {showSecurityModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowSecurityModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`rounded-2xl p-6 w-full max-w-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border shadow-2xl`}
              >
                <h3
                  className={`text-xl font-bold mb-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Change Password
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      className={`block mb-2 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className={`w-full px-4 py-3 rounded-xl ${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600 placeholder-gray-500"
                          : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
                      } 
                        border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-2 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className={`w-full px-4 py-3 rounded-xl ${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600 placeholder-gray-500"
                          : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
                      } 
                        border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-2 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className={`w-full px-4 py-3 rounded-xl ${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600 placeholder-gray-500"
                          : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
                      } 
                        border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  <div className={`p-3 rounded-lg ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}>
                    <p className={`text-xs font-medium mb-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Password must contain:
                    </p>
                    <ul className={`text-xs space-y-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>At least 8 characters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className={darkMode ? "text-gray-600" : "text-gray-400"}>○</span>
                        <span>One uppercase letter</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className={darkMode ? "text-gray-600" : "text-gray-400"}>○</span>
                        <span>One number</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className={darkMode ? "text-gray-600" : "text-gray-400"}>○</span>
                        <span>One special character</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowSecurityModal(false)}
                    className={`px-5 py-2.5 rounded-xl ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    } transition-colors font-medium`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      // Add password update logic here
                      setShowSecurityModal(false);
                    }}
                    className={`px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-colors shadow-md font-medium`}
                  >
                    Update Password
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};