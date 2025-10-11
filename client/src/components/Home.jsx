import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import { useTheme } from "../Context/ThemeContext.jsx";
import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  FaGamepad,
  FaTrophy,
  FaUsers,
  FaStar,
  FaDiscord,
  FaGithub,
  FaArrowRight,
} from "react-icons/fa";
import { SiOpensourceinitiative } from "react-icons/si";
import { BsShieldLock, BsLightningCharge } from "react-icons/bs";
import { FiCodesandbox } from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";

// Particle background component
const Particles = ({ darkMode }) => {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            darkMode ? "bg-purple-500" : "bg-purple-400"
          } opacity-20`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ y: 0 }}
          animate={{
            y: [0, 50, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const animate = async () => {
      await controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 },
      });
    };

    const timer = setInterval(() => {
      if (count < value) {
        setCount((prev) => {
          const newCount = prev + Math.ceil(value / (duration * 30));
          return newCount > value ? value : newCount;
        });
        animate();
      }
    }, 1000 / 30);

    return () => clearInterval(timer);
  }, [count, value, controls]);

  return (
    <motion.span animate={controls} className="inline-block">
      {count.toLocaleString()}+
    </motion.span>
  );
};

export const Home = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("productivity");
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const featuresRef = useRef(null);

  const stats = {
    activeUsers: 12543,
    gamesPlayed: 89256,
    achievements: 34210,
    communities: 543,
  };

  const featuredGames = [
    {
      id: 1,
      name: "Productivity Quest",
      description: "Level up your work with RPG-style tasks and achievements",
      icon: "📊",
      rating: 4.8,
      tags: ["Work", "Tasks", "RPG"],
      color: "bg-indigo-500",
    },
    {
      id: 2,
      name: "Study Warriors",
      description: "Turn learning into an epic adventure with your classmates",
      icon: "📚",
      rating: 4.6,
      tags: ["Education", "Study", "Adventure"],
      color: "bg-emerald-500",
    },
    {
      id: 3,
      name: "Team Legends",
      description: "Collaborate and conquer challenges together as a team",
      icon: "👥",
      rating: 4.9,
      tags: ["Teamwork", "Collaboration", "Challenges"],
      color: "bg-amber-500",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah K.",
      role: "Product Manager at TechCorp",
      text: "Our team's productivity increased by 40% after implementing Gamify. The achievement system keeps everyone motivated.",
      avatar: "👩‍💼",
      rating: 5,
    },
    {
      id: 2,
      name: "Mark T.",
      role: "Computer Science Student",
      text: "Made studying fun and competitive with my classmates. We track our progress and reward top performers each week.",
      avatar: "👨‍🎓",
      rating: 4,
    },
    {
      id: 3,
      name: "Open Source Team",
      role: "Community Contributors",
      text: "The modular architecture makes it easy to extend for our needs. We've built custom plugins for our community.",
      avatar: "👩‍💻",
      rating: 5,
    },
  ];

  const useCases = {
    productivity: [
      "Task completion tracking with XP rewards",
      "Team leaderboards and weekly challenges",
      "Badges for milestone achievements",
      "Integration with project management tools",
    ],
    education: [
      "Gamified learning paths",
      "Knowledge checkpoints with rewards",
      "Classroom competition modes",
      "Progress visualization dashboards",
    ],
    community: [
      "Member engagement scoring",
      "Contribution reward systems",
      "Special roles for top contributors",
      "Interactive community challenges",
    ],
  };

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0 }, { duration: 0.5 });
    };
    sequence();
  }, [controls]);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} overflow-hidden transition-colors duration-300`}>
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        <Particles darkMode={darkMode} />
        <div className={`absolute inset-0 ${darkMode ? "bg-gradient-to-b from-purple-900/20 to-gray-900" : "bg-gradient-to-b from-purple-100/40 to-gray-50"} z-0`} />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.2 }}
            className={`inline-block px-4 py-2 ${darkMode ? "bg-gray-800 border-purple-500/30" : "bg-white border-purple-300"} rounded-full mb-6 border`}
          >
            <span className="text-purple-400">v2.0 Now Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Transform Your Workflow
            </span>
            <br />
            <span>With Gamification</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.6 }}
            className={`text-xl md:text-2xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto mb-10`}
          >
            An open-source platform that supercharges productivity,
            collaboration, and community engagement through game mechanics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-xl hover:bg-purple-700 transition-all bg-purple-600 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 text-white"
              >
                Go to Dashboard <FaArrowRight />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-xl hover:bg-purple-700 transition-all bg-purple-600 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 text-white"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className={`px-8 py-4 rounded-xl transition-all border border-purple-500 font-semibold text-lg flex items-center justify-center gap-2 ${
                    darkMode ? "hover:bg-gray-800" : "hover:bg-purple-50"
                  }`}
                >
                  Demo Dashboard
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className={`${
                  darkMode ? "bg-gray-800/50 border-gray-700 hover:border-purple-500" : "bg-white border-gray-200 hover:border-purple-400"
                } backdrop-blur-sm p-6 rounded-xl border transition`}
              >
                <div className="flex items-center justify-center mb-4">
                  {key === "activeUsers" && (
                    <FaUsers className="text-purple-400 text-3xl mr-3" />
                  )}
                  {key === "gamesPlayed" && (
                    <FaGamepad className="text-purple-400 text-3xl mr-3" />
                  )}
                  {key === "achievements" && (
                    <FaTrophy className="text-purple-400 text-3xl mr-3" />
                  )}
                  {key === "communities" && (
                    <RiTeamLine className="text-purple-400 text-3xl mr-3" />
                  )}
                  <span className="text-3xl font-bold">
                    <AnimatedCounter value={value} />
                  </span>
                </div>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} capitalize`}>
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className={`py-12 ${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} border-y`}>
        <div className="container mx-auto px-4">
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-8`}>Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-80">
            {["TechCorp", "UniStack", "DevHub", "OpenSource", "EduNet"].map(
              (company, i) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`text-2xl font-bold ${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  {company}
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-20" ref={featuresRef}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why <span className="text-purple-500">Gamify</span> Stands Out
            </h2>
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
              A platform designed for maximum flexibility and engagement with
              cutting-edge features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-800 p-1 rounded-2xl inline-block mb-6">
                <div className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} px-4 py-2 rounded-xl text-purple-400 flex items-center gap-2`}>
                  <SiOpensourceinitiative className="text-xl" />
                  <span>Open Source Advantage</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Complete Control Over Your Experience
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-lg mb-6`}>
                With our MIT license, you're free to customize, extend, and
                deploy Gamify however you need. No vendor lock-in, no hidden
                limitations.
                            </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Full access to source code",
                  "Community-driven development",
                  "Self-host on your infrastructure",
                  "Enterprise-ready architecture",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/your-gamify-repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition flex items-center gap-2`}
                >
                  <FaGithub /> View on GitHub
                </a>
                <Link
                  to="/about"
                  className={`px-6 py-3 rounded-lg border border-purple-500 ${darkMode ? "hover:bg-purple-500/10" : "hover:bg-purple-50"} transition flex items-center gap-2`}
                >
                  Learn More <FaArrowRight />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative"
            >
              <div className={`bg-gradient-to-br from-purple-500/10 ${darkMode ? "to-gray-800/50 border-gray-700" : "to-gray-100/50 border-gray-300"} p-6 rounded-2xl border`}>
                <div className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-xl overflow-hidden`}>
                  <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"} flex items-center gap-2`}>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} ml-2`}>
                      gamify-config.yaml
                    </div>
                  </div>
                  <div className="p-6 font-mono text-sm">
                    <div className="text-purple-400">
                      # MIT Licensed - Free Forever
                    </div>
                    <div className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>modules:</div>
                    <div className="ml-4 text-emerald-400">
                      - name: achievements
                    </div>
                    <div className={darkMode ? "ml-8 text-gray-300" : "ml-8 text-gray-700"}>enabled: true</div>
                    <div className="ml-4 text-emerald-400">
                      - name: leaderboards
                    </div>
                    <div className={darkMode ? "ml-8 text-gray-300" : "ml-8 text-gray-700"}>enabled: true</div>
                    <div className="ml-4 text-emerald-400">- name: discord</div>
                    <div className={darkMode ? "ml-8 text-gray-300" : "ml-8 text-gray-700"}>enabled: false</div>
                    <div className="text-purple-400 mt-4">
                      # Add your custom modules
                    </div>
                    <div className="ml-4 text-emerald-400">
                      - name: custom-rewards
                    </div>
                    <div className={darkMode ? "ml-8 text-gray-300" : "ml-8 text-gray-700"}>
                      path: ./plugins/rewards.js
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiCodesandbox className="text-4xl" />,
                title: "Modular Architecture",
                description:
                  "Plug-and-play components that you can mix and match for your specific needs",
                color: "text-purple-400",
              },
              {
                icon: <BsShieldLock className="text-4xl" />,
                title: "Data Privacy",
                description:
                  "Self-host with full control over your data. No tracking, no analytics, no BS",
                color: "text-emerald-400",
              },
              {
                icon: <BsLightningCharge className="text-4xl" />,
                title: "Real-time Updates",
                description:
                  "Instant feedback and notifications keep users engaged and motivated",
                color: "text-amber-400",
              },
              {
                icon: <RiTeamLine className="text-4xl" />,
                title: "Team Focused",
                description:
                  "Built-in collaboration features with role-based permissions",
                color: "text-blue-400",
              },
              {
                icon: <FaDiscord className="text-4xl" />,
                title: "Discord Integration",
                description:
                  "Bring gamification directly to your community's favorite platform",
                color: "text-indigo-400",
              },
              {
                icon: <FaGithub className="text-4xl" />,
                title: "API First",
                description:
                  "RESTful API and webhooks for seamless integration with your stack",
                color: "text-gray-400",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`${
                  darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                } backdrop-blur-sm p-8 rounded-2xl border hover:border-purple-500 transition hover:-translate-y-2`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className={`${feature.color} mb-6`}>{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className={`py-20 ${darkMode ? "bg-gray-800/30 border-gray-700" : "bg-gray-100 border-gray-200"} px-4 border-y`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-purple-500">Gamify</span> Anything
            </h2>
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
              From study groups to corporate teams, our platform adapts to your
              needs.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["productivity", "education", "community"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full capitalize transition ${
                    activeTab === tab
                      ? "bg-purple-600 text-white"
                      : darkMode 
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} backdrop-blur-sm p-8 rounded-2xl border`}
            >
              <h3 className="text-2xl font-bold mb-6 capitalize">
                {activeTab} Use Cases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {useCases[activeTab].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-purple-500/10 p-2 rounded-lg mt-1">
                      <div className="bg-purple-500 w-8 h-8 rounded flex items-center justify-center">
                        <span className="text-lg">{i + 1}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">
                        {item.split(" with")[0]}
                      </h4>
                      <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                        {item.includes(" with")
                          ? `with${item.split(" with")[1]}`
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-20 px-4 md:px-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Featured <span className="text-purple-500">Templates</span>
            </h2>
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
              Jumpstart your gamification journey with these pre-built
              templates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`${game.color}/10 backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? "border-gray-700" : "border-gray-200"} hover:shadow-xl transition hover:-translate-y-2`}
              >
                <div
                  className={`${game.color} w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6`}
                >
                  {game.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{game.name}</h3>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>{game.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {game.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full text-sm`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < Math.floor(game.rating)
                            ? "text-yellow-400"
                            : "text-gray-500"
                        } mr-1`}
                      />
                    ))}
                    <span className={`ml-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{game.rating}</span>
                  </div>
                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className="text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
                  >
                    Try template <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              to={user ? "/dashboard" : "/register"}
              className="inline-flex px-8 py-4 rounded-xl hover:bg-purple-700 transition-all bg-purple-600 font-semibold text-lg items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 text-white"
            >
              Explore All Templates <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 ${darkMode ? "bg-gray-800/30 border-gray-700" : "bg-gray-100 border-gray-200"} px-4 border-y`}>
        <div className="container mx-auto">
          <motion.div
                        initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Loved by <span className="text-purple-500">Teams</span>
            </h2>
            <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
              Don't just take our word for it. Here's what our community says.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} backdrop-blur-sm p-8 rounded-2xl border`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>{testimonial.role}</p>
                  </div>
                </div>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} italic mb-6`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-500"
                      } mr-1`}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className={`absolute inset-0 ${darkMode ? "bg-gradient-to-br from-purple-900/20 to-gray-900" : "bg-gradient-to-br from-purple-100/40 to-gray-50"} z-0`} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0" />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`inline-block px-6 py-3 ${darkMode ? "bg-gray-800 border-purple-500/30" : "bg-white border-purple-300"} rounded-full mb-6 border`}
          >
            <span className="text-purple-400">Ready to get started?</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8"
          >
            Transform Your <span className="text-purple-500">Community</span>{" "}
            Today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto mb-12`}
          >
            Join thousands of teams and communities boosting engagement through
            gamification.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-xl hover:bg-purple-700 transition-all bg-purple-600 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 text-white"
              >
                Go to Dashboard <FaArrowRight />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-xl hover:bg-purple-700 transition-all bg-purple-600 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 text-white"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/about"
                  className={`px-8 py-4 rounded-xl transition-all border border-purple-500 font-semibold text-lg flex items-center justify-center gap-2 ${
                    darkMode ? "hover:bg-gray-800" : "hover:bg-purple-50"
                  }`}
                >
                  Learn More
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};