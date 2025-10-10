import { useAuth } from "../Context/AuthContext.jsx";
import { useTheme } from "../Context/ThemeContext.jsx";
import {
  FaGamepad,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaTrophy,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" 
        : "bg-gradient-to-br from-gray-50 to-white text-gray-900"
    } mt-16 transition-colors duration-300`}>
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-72 ${
            darkMode 
              ? "bg-gray-800/50 border-gray-700/50" 
              : "bg-white/80 border-gray-200 shadow-xl"
          } backdrop-blur-lg min-h-screen p-6 fixed border-r transition-colors duration-300`}
        >
          <div className="flex items-center space-x-3 mb-10 p-2">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg"
            >
              <FaGamepad className="text-white text-xl" />
            </motion.div>
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Gamify
            </span>
          </div>

          <nav className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/dashboard"
                className={`flex items-center space-x-3 p-3 rounded-xl ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-900/50 to-indigo-900/20 border-purple-500/20 shadow-purple-500/10 text-purple-300"
                    : "bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-300/50 shadow-purple-200/50 text-purple-700"
                } border shadow-lg font-medium transition-colors duration-300`}
              >
                <FaHome className="text-lg" />
                <span>Dashboard</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/dashboard/profile"
                className={`flex items-center space-x-3 p-3 rounded-xl border border-transparent ${
                  darkMode
                    ? "hover:bg-gray-700/50 hover:border-gray-600 text-gray-300"
                    : "hover:bg-gray-100 hover:border-gray-300 text-gray-700"
                } transition-all duration-300`}
              >
                <FaUser className="text-lg" />
                <span>Profile</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => logout()}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl border border-transparent ${
                  darkMode
                    ? "hover:bg-red-900/30 hover:border-red-500/30 text-gray-300"
                    : "hover:bg-red-50 hover:border-red-300/50 text-gray-700"
                } transition-all duration-300`}
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </motion.div>
          </nav>

          {/* Sidebar footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className={`p-4 ${
              darkMode 
                ? "bg-gray-800/70 border-gray-700/50" 
                : "bg-purple-50 border-purple-200"
            } rounded-xl border transition-colors duration-300`}>
              <div className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Premium Member
              </div>
              <div className={`h-2 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full mb-2 overflow-hidden`}>
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className={`text-sm font-medium ${darkMode ? "text-purple-300" : "text-purple-600"}`}>
                65% to next level
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="ml-72 flex-1 p-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                Welcome back, {user?.username}
              </h1>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Here's what's happening in your gaming world
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`relative p-2 rounded-full ${
                darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
              } transition-all`}>
                <IoMdNotifications className="text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className={`flex items-center space-x-3 ${
                darkMode 
                  ? "bg-gray-800/70 border-gray-700/50 hover:bg-gray-700/80" 
                  : "bg-white border-gray-200 hover:bg-gray-50"
              } px-4 py-2 rounded-full border cursor-pointer transition-all`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user?.username}</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              variants={itemVariants}
              className={`${
                darkMode 
                  ? "bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30 hover:shadow-purple-500/10" 
                  : "bg-white border-purple-200 hover:border-purple-400/50 hover:shadow-purple-200/30"
              } p-6 rounded-2xl border transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={darkMode ? "text-gray-400" : "text-gray-600"}>Games Played</h3>
                <div className={`p-2 ${darkMode ? "bg-purple-500/10" : "bg-purple-100"} rounded-lg`}>
                  <FaGamepad className={darkMode ? "text-purple-400" : "text-purple-600"} />
                </div>
              </div>
              <p className="text-4xl font-bold mb-2">24</p>
              <div className="text-sm text-green-500 flex items-center">
                <span>↑ 12% from last week</span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`${
                darkMode 
                  ? "bg-gray-800/50 border-gray-700/50 hover:border-indigo-500/30 hover:shadow-indigo-500/10" 
                  : "bg-white border-indigo-200 hover:border-indigo-400/50 hover:shadow-indigo-200/30"
              } p-6 rounded-2xl border transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={darkMode ? "text-gray-400" : "text-gray-600"}>Achievements</h3>
                <div className={`p-2 ${darkMode ? "bg-indigo-500/10" : "bg-indigo-100"} rounded-lg`}>
                  <FaTrophy className={darkMode ? "text-indigo-400" : "text-indigo-600"} />
                </div>
              </div>
              <p className="text-4xl font-bold mb-2">5</p>
              <div className="text-sm text-yellow-500 flex items-center">
                <span>New achievement unlocked!</span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`${
                darkMode 
                  ? "bg-gray-800/50 border-gray-700/50 hover:border-blue-500/30 hover:shadow-blue-500/10" 
                  : "bg-white border-blue-200 hover:border-blue-400/50 hover:shadow-blue-200/30"
              } p-6 rounded-2xl border transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={darkMode ? "text-gray-400" : "text-gray-600"}>Friends Online</h3>
                <div className={`p-2 ${darkMode ? "bg-blue-500/10" : "bg-blue-100"} rounded-lg`}>
                  <FaUsers className={darkMode ? "text-blue-400" : "text-blue-600"} />
                </div>
              </div>
              <p className="text-4xl font-bold mb-2">12</p>
              <div className="text-sm text-blue-500 flex items-center">
                <span>3 playing together</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${
              darkMode 
                ? "bg-gray-800/50 border-gray-700/50" 
                : "bg-white border-gray-200"
            } p-6 rounded-2xl border mb-8 shadow-lg transition-colors duration-300`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                Recent Activity
              </h2>
              <button className={`text-sm ${
                darkMode ? "text-purple-300 hover:text-purple-200" : "text-purple-600 hover:text-purple-700"
              } transition-colors`}>
                View All
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  id: 1,
                  game: "Cloud Runner",
                  action: "completed level 5",
                  time: "2 hours ago",
                  icon: <FaGamepad className={darkMode ? "text-purple-400" : "text-purple-600"} />,
                  color: darkMode ? "bg-purple-500/20" : "bg-purple-100",
                },
                {
                  id: 2,
                  game: "Micro Quest",
                  action: "earned 100 points",
                  time: "5 hours ago",
                  icon: <FaChartLine className={darkMode ? "text-blue-400" : "text-blue-600"} />,
                  color: darkMode ? "bg-blue-500/20" : "bg-blue-100",
                },
                {
                  id: 3,
                  game: "Space Adventure",
                  action: "unlocked new character",
                  time: "1 day ago",
                  icon: <FaTrophy className={darkMode ? "text-yellow-400" : "text-yellow-600"} />,
                  color: darkMode ? "bg-yellow-500/20" : "bg-yellow-100",
                },
              ].map((a) => (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center space-x-4 p-4 ${
                    darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                  } rounded-xl transition-all cursor-pointer`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center`}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{a.game}</p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{a.action}</p>
                  </div>
                                    <div className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{a.time}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20 font-medium flex items-center space-x-2"
            >
              <FaGamepad />
              <span>Start New Game</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-3 ${
                darkMode 
                  ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/70 shadow-gray-500/10" 
                  : "bg-white border-gray-300 hover:bg-gray-50 shadow-gray-300/30"
              } border rounded-xl transition-all shadow-lg font-medium flex items-center space-x-2`}
            >
              <FaUsers />
              <span>Invite Friends</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-3 ${
                darkMode 
                  ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/70 shadow-gray-500/10" 
                  : "bg-white border-gray-300 hover:bg-gray-50 shadow-gray-300/30"
              } border rounded-xl transition-all shadow-lg font-medium flex items-center space-x-2`}
            >
              <FaTrophy />
              <span>View Leaderboard</span>
            </motion.button>
          </motion.div>

          {/* Featured Game */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-8 ${
              darkMode 
                ? "bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/20 shadow-purple-500/10" 
                : "bg-gradient-to-r from-purple-100/50 to-indigo-100/50 border-purple-300/30 shadow-purple-200/20"
            } p-6 rounded-2xl border shadow-lg transition-colors duration-300`}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FaGamepad className="text-4xl text-white" />
                </div>
              </div>
              <div className="md:w-2/3 md:pl-6">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Featured Game: Neon Rush
                </h3>
                <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Experience the thrill of high-speed racing in futuristic neon
                  cities. Unlock special rewards this week!
                </p>
                <button className={`px-6 py-2 ${
                  darkMode 
                    ? "bg-white text-gray-900 hover:bg-gray-200" 
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                } rounded-lg font-medium transition-all shadow-lg`}>
                  Play Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};