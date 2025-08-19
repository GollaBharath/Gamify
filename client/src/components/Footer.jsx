import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Footer = () => {
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
    <footer className="bg-gray-800 text-white py-12 px-4 z-40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">Gamify</span>
            </div>
            <p className="text-gray-400">
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
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-purple-400 transition"
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
                  href="#"
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  Community Forum
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-purple-400 transition"
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
                className="text-gray-400 hover:text-purple-400 transition"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mb-2">
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
                  className="px-3 py-2 bg-gray-700 text-white rounded-l focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r transition disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Gamify Platform. Open-source under
            MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
};
