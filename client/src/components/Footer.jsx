import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../Context/ThemeContext.jsx";

export const Footer = () => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ API base URL (fallback to localhost)
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !email.includes("@")) {
      setMessage("❌ Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "✅ Success! Please check your email to confirm subscription."
        );
        setEmail("");
      } else {
        setMessage(
          `❌ ${data.error || "Something went wrong. Please try again."}`
        );
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("❌ Failed to connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} py-12 px-4 z-40 transition-colors duration-300`}>
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">Gamify</span>
            </div>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              An open-source platform to gamify productivity, collaboration, and
              community engagement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/GollaBharath/Gamify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  Community Forum
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-500"} transition`}
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-purple-500"} transition`}
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/GollaBharath/Gamify"
                target="_blank"
                rel="noopener noreferrer"
                className={`${darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-purple-500"} transition`}
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-purple-500"} transition`}
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-2`}>
              Subscribe to our newsletter for updates
            </p>
            <form onSubmit={handleSubmit} className="mt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`px-3 py-2 ${
                    darkMode 
                      ? "bg-gray-700 text-white border-gray-600" 
                      : "bg-white text-gray-900 border-gray-300"
                  } border rounded-l focus:outline-none focus:ring-1 focus:ring-purple-500 w-full transition-colors`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "..." : "Subscribe"}
                </button>
              </div>
            </form>
            {message && (
              <p
                className={`mt-2 text-sm ${
                  message.includes("Success") || message.includes("✅")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-300"} mt-8 pt-8 text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p>
            &copy; {new Date().getFullYear()} Gamify Platform. Open-source under
            MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
};