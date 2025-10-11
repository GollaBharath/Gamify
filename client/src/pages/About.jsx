import { Link } from "react-router-dom";
import {
  FaGithub,
  FaDiscord,
  FaStar,
  FaCodeBranch,
  FaUsers,
  FaShieldAlt,
  FaPuzzlePiece,
} from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Context/ThemeContext.jsx";

export const About = () => {
  const { darkMode } = useTheme();

  const features = [
    {
      icon: <FaStar className="text-2xl" />,
      title: "Free & Open-Source",
      description:
        "MIT licensed and community-driven with transparent development",
      color: "text-yellow-400",
    },
    {
      icon: <FaPuzzlePiece className="text-2xl" />,
      title: "Multi-Platform",
      description: "Web dashboard, mobile-friendly, and Discord integration",
      color: "text-blue-400",
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Built for Teams",
      description: "Role-based collaboration and community features built-in",
      color: "text-pink-400",
    },
  ];

  const stats = [
    { value: "100%", label: "Open Source" },
    { value: "24/7", label: "Community Support" },
    { value: "1K+", label: "Active Users" },
    { value: "50+", label: "Contributors" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
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

  const cardVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <section className={`min-h-screen ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" 
        : "bg-gradient-to-br from-gray-50 to-white text-gray-900"
    } pt-24 pb-20 px-4 overflow-hidden transition-colors duration-300`}>
      {/* 3D Background - Enhanced for Light Mode */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${darkMode ? 'opacity-70' : 'opacity-100'}`}>
        <Canvas>
          {/* Enhanced lighting for light mode */}
          <ambientLight intensity={darkMode ? 0.5 : 2.0} />
          
          {/* Multiple point lights - stronger in light mode */}
          <pointLight position={[10, 10, 10]} intensity={darkMode ? 1 : 3.0} />
          <pointLight position={[-10, -10, -10]} intensity={darkMode ? 0.5 : 2.5} />
          <pointLight position={[0, 5, 5]} intensity={darkMode ? 0.5 : 2.0} color="#8b5cf6" />
          <pointLight position={[5, -5, 0]} intensity={darkMode ? 0.3 : 1.8} color="#ec4899" />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={darkMode ? 0.5 : 1.5} // Faster in light mode
          />
          
          {/* More visible stars in light mode */}
          <Stars
            radius={100}
            depth={50}
            count={darkMode ? 5000 : 10000} // Double stars in light mode
            factor={darkMode ? 4 : 8} // Bigger stars in light mode
            saturation={darkMode ? 0 : 0.4} // More colorful in light mode
            fade
            speed={darkMode ? 1 : 2.5} // Faster movement in light mode
          />
          
          {/* Additional star layer for light mode only */}
          {!darkMode && (
            <Stars
              radius={80}
              depth={40}
              count={5000}
              factor={5}
              saturation={0.6}
              fade
              speed={2}
            />
          )}
        </Canvas>
      </div>

      {/* Additional floating particles - More visible in light mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: darkMode ? 30 : 60 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              darkMode ? "bg-purple-500" : "bg-gradient-to-br from-purple-400 to-pink-400"
            }`}
            style={{
              width: darkMode ? `${Math.random() * 5 + 2}px` : `${Math.random() * 8 + 3}px`,
              height: darkMode ? `${Math.random() * 5 + 2}px` : `${Math.random() * 8 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: darkMode ? [0.2, 0.8, 0.2] : [0.4, 1, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Gradient overlay for light mode */}
      {!darkMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-transparent to-pink-205/300 pointer-events-none z-0" />
      )}

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
          >
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Gamify
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } max-w-3xl mx-auto`}
          >
            Transforming productivity through the power of gamification
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className={`${
                darkMode 
                  ? "bg-gray-800/50 border-gray-700/50" 
                  : "bg-white/80 border-purple-200 shadow-xl shadow-purple-100/50"
              } backdrop-blur-sm p-6 rounded-xl border text-center transition-all duration-300 hover:shadow-purple-200/80`}
            >
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                {stat.value}
              </div>
              <div className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-2`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className={`${
            darkMode 
              ? "bg-gray-800/80 border-gray-700/50" 
              : "bg-white/80 border-purple-200 shadow-2xl shadow-purple-100/50"
          } backdrop-blur-md p-8 rounded-2xl border mb-12 transition-all duration-300 hover:shadow-purple-200/80`}
        >
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Our Mission
          </h2>
          <div className={`space-y-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <p>
              Gamify is revolutionizing how we approach productivity,
              collaboration, and community engagement through the power of
              gamification. We believe that by applying game mechanics to
              everyday activities, we can make them more engaging, rewarding,
              and ultimately more effective.
            </p>
            <p>
              Our platform is built on principles of transparency, community,
              and innovation. We're committed to creating tools that empower
              individuals and teams to achieve their goals while having fun in
              the process.
            </p>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div variants={containerVariants} className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Why Choose Gamify?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                className={`${
                  darkMode 
                    ? "bg-gray-800/80 border-gray-700/50 hover:border-purple-500/30" 
                    : "bg-white/80 border-purple-200 hover:border-purple-400/60 shadow-xl shadow-purple-100/50 hover:shadow-purple-200/80"
                } backdrop-blur-sm p-6 rounded-xl border transition-all duration-300`}
              >
                <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}>
                  {feature.title}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};