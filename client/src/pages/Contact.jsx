import { useState, useRef, useEffect } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGithub,
  FaDiscord,
  FaTwitter,
  FaLinkedin,
  FaPaperPlane,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Context/ThemeContext.jsx";

export const Contact = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const formRef = useRef();

  // 3D shape variants
  const shapes = [
    { color: "#8B5CF6", position: [0, 0, 0], size: [1, 1, 1] },
    { color: "#EC4899", position: [2, 1, -1], size: [0.8, 0.8, 0.8] },
    { color: "#3B82F6", position: [-2, -1, 1], size: [0.6, 0.6, 0.6] },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Using EmailJS for actual email sending
      await emailjs.sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY"
      );

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrors({ submit: "Failed to send message. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const fieldVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    focus: { scale: 1.02, boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.5)" },
  };

  return (
    <section className={`min-h-screen ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" 
        : "bg-gradient-to-br from-gray-50 to-white text-gray-900"
    } pt-24 pb-20 px-4 overflow-hidden transition-colors duration-300`}>
      {/* 3D Background */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${darkMode ? 'opacity-70' : 'opacity-100'}`}>
        <Canvas>
          <ambientLight intensity={darkMode ? 0.5 : 2.0} />
          <pointLight position={[10, 10, 10]} intensity={darkMode ? 1 : 3.0} />
          <pointLight position={[-10, -10, -10]} intensity={darkMode ? 0.5 : 2.5} />
          <pointLight position={[0, 5, 5]} intensity={darkMode ? 0.5 : 2.0} color="#8b5cf6" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={darkMode ? 0.5 : 1.5}
          />
          <Stars
            radius={100}
            depth={50}
            count={darkMode ? 5000 : 10000}
            factor={darkMode ? 4 : 8}
            saturation={darkMode ? 0 : 0.4}
            fade
            speed={darkMode ? 1 : 2.5}
          />
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-pink-50/15 pointer-events-none z-0" />
      )}

      <div className="container mx-auto max-w-6xl relative z-10">
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
            Let's Connect
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}
          >
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            className={`${
              darkMode 
                ? "bg-gray-800/80 border-gray-700/50" 
                : "bg-white/80 border-purple-200 shadow-2xl shadow-purple-100/50"
            } backdrop-blur-md p-8 rounded-2xl border transition-colors duration-300`}
          >
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Send Us a Message
            </h2>

            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-6 p-4 ${
                    darkMode 
                      ? "bg-green-900/50 border-green-500" 
                      : "bg-green-100 border-green-400"
                  } border rounded-lg flex items-center transition-colors duration-300`}
                >
                  <FaCheckCircle className={`${darkMode ? "text-green-400" : "text-green-600"} mr-3 text-xl`} />
                  <div>
                    <h3 className={`font-semibold ${darkMode ? "text-green-100" : "text-green-800"}`}>
                      Message Sent!
                    </h3>
                    <p className={`text-sm ${darkMode ? "text-green-200" : "text-green-700"}`}>
                      We'll get back to you soon.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={fieldVariants}
                animate={hoveredField === "name" ? "hover" : "rest"}
                onHoverStart={() => setHoveredField("name")}
                onHoverEnd={() => setHoveredField(null)}
              >
                <label
                  htmlFor="name"
                  className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 ${
                    darkMode 
                      ? "bg-gray-700/50 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  } border ${
                    errors.name ? "border-red-500" : ""
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
                )}
              </motion.div>

              <motion.div
                variants={fieldVariants}
                animate={hoveredField === "email" ? "hover" : "rest"}
                onHoverStart={() => setHoveredField("email")}
                onHoverEnd={() => setHoveredField(null)}
              >
                <label
                  htmlFor="email"
                  className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 ${
                    darkMode 
                      ? "bg-gray-700/50 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  } border ${
                    errors.email ? "border-red-500" : ""
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
                )}
              </motion.div>

              <motion.div
                variants={fieldVariants}
                animate={hoveredField === "message" ? "hover" : "rest"}
                onHoverStart={() => setHoveredField("message")}
                onHoverEnd={() => setHoveredField(null)}
              >
                <label
                  htmlFor="message"
                  className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 ${
                    darkMode 
                      ? "bg-gray-700/50 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  } border ${
                    errors.message ? "border-red-500" : ""
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                  placeholder="What would you like to say?"
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-red-400 text-sm">{errors.message}</p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 text-white ${
                  isSubmitting
                    ? "bg-purple-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>

              {errors.submit && (
                <p className="text-red-400 text-center">{errors.submit}</p>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            className={`${
              darkMode 
                ? "bg-gray-800/80 border-gray-700/50" 
                : "bg-white/80 border-purple-200 shadow-2xl shadow-purple-100/50"
            } backdrop-blur-md p-8 rounded-2xl border transition-colors duration-300`}
          >
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Contact Information
            </h2>

            <div className="space-y-8">
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-start space-x-6 p-4 ${
                  darkMode 
                    ? "bg-gray-700/30 hover:bg-gray-700/50" 
                    : "bg-purple-50/50 hover:bg-purple-100/50"
                } rounded-xl transition-all duration-300`}
              >
                <div className={`p-3 ${
                  darkMode ? "bg-purple-500/10" : "bg-purple-100"
                } rounded-lg`}>
                  <FaEnvelope className={`text-2xl ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    Email Us
                  </h3>
                  <a
                    href="mailto:contact@gamify.example"
                    className={`${
                      darkMode 
                        ? "text-purple-300 hover:text-purple-200" 
                        : "text-purple-600 hover:text-purple-700"
                    } transition-colors duration-300`}
                  >
                    contact@gamify.example
                  </a>
                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Typically respond within 24 hours
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-start space-x-6 p-4 ${
                  darkMode 
                    ? "bg-gray-700/30 hover:bg-gray-700/50" 
                    : "bg-pink-50/50 hover:bg-pink-100/50"
                } rounded-xl transition-all duration-300`}
              >
                <div className={`p-3 ${
                  darkMode ? "bg-pink-500/10" : "bg-pink-100"
                } rounded-lg`}>
                  <FaMapMarkerAlt className={`text-2xl ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    Our Location
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    Remote-first team with contributors worldwide
                  </p>
                  <button className={`mt-3 text-sm ${
                    darkMode 
                      ? "text-purple-300 hover:text-purple-200" 
                      : "text-purple-600 hover:text-purple-700"
                  } transition-colors duration-300 flex items-center`}>
                    View on map <span className="ml-1">→</span>
                  </button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-start space-x-6 p-4 ${
                  darkMode 
                    ? "bg-gray-700/30 hover:bg-gray-700/50" 
                    : "bg-blue-50/50 hover:bg-blue-100/50"
                } rounded-xl transition-all duration-300`}
              >
                <div className={`p-3 ${
                  darkMode ? "bg-blue-500/10" : "bg-blue-100"
                } rounded-lg`}>
                  <FaDiscord className={`text-2xl ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    Community Support
                  </h3>
                  <p className={`mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Join our active community for real-time support and
                    discussions
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                  >
                    <FaDiscord className="mr-2" /> Join Discord
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Social Media Links */}
            <div className="mt-12">
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 ${
                    darkMode 
                      ? "bg-gray-700/50 hover:bg-purple-600" 
                      : "bg-purple-100 hover:bg-purple-200"
                  } rounded-lg transition-all duration-300`}
                >
                  <FaGithub className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 ${
                    darkMode 
                      ? "bg-gray-700/50 hover:bg-blue-600" 
                      : "bg-blue-100 hover:bg-blue-200"
                  } rounded-lg transition-all duration-300`}
                >
                  <FaTwitter className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 ${
                    darkMode 
                      ? "bg-gray-700/50 hover:bg-indigo-600" 
                      : "bg-indigo-100 hover:bg-indigo-200"
                  } rounded-lg transition-all duration-300`}
                >
                  <FaDiscord className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 ${
                    darkMode 
                      ? "bg-gray-700/50 hover:bg-blue-700" 
                      : "bg-blue-100 hover:bg-blue-200"
                  } rounded-lg transition-all duration-300`}
                >
                  <FaLinkedin className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
                </motion.a>
              </div>
            </div>

            {/* Additional Info */}
            <div className={`mt-8 p-4 ${
              darkMode 
                ? "bg-purple-900/20 border-purple-500/30" 
                : "bg-purple-50 border-purple-200"
            } border rounded-lg`}>
              <h4 className={`font-semibold mb-2 ${darkMode ? "text-purple-300" : "text-purple-800"}`}>
                💡 Quick Tip
              </h4>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                For urgent technical issues, please use our GitHub Issues page
                or join our Discord community for immediate assistance.
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          variants={itemVariants}
          className={`mt-16 ${
            darkMode 
              ? "bg-gray-800/80 border-gray-700/50" 
              : "bg-white/80 border-purple-200 shadow-2xl shadow-purple-100/50"
          } backdrop-blur-md p-8 rounded-2xl border transition-colors duration-300`}
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                How quickly do you respond?
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                We typically respond to all inquiries within 24-48 hours during
                business days.
              </p>
            </div>
            <div>
              <h3 className={`font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                Do you offer support?
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Yes! We offer community support via Discord and email support
                for all users.
              </p>
            </div>
            <div>
              <h3 className={`font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                Can I contribute to the project?
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Absolutely! Visit our GitHub repository to get started with
                contributions.
              </p>
            </div>
            <div>
              <h3 className={`font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                Is Gamify really free?
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Yes! Gamify is 100% free and open-source under the MIT license.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};