import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      return setError("Please fill in all fields");
    }

    try {
      setIsLoadingLocal(true);
      const { success, message } = await login(formData);
      if (success) navigate("/home");
      else setError(message || "Login failed");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoadingLocal(false);
    }
  };

   const handleGoogleLogin = () => {
    console.log("Google OAuth initiated");
    console.log("API URL:", import.meta.env.VITE_API_URL);
    
    if (!import.meta.env.VITE_API_URL) {
      alert("Configuration error: API URL not set. Please check your .env file.");
      return;
    }
    
   
    const googleOAuthUrl =window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    console.log("Redirecting to:", googleOAuthUrl);
    window.location.href = googleOAuthUrl;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-500 mb-2">Gamify</h1>
          <h2 className="text-2xl font-bold">Login</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="flex items-center text-gray-400">
              <FaEnvelope className="mr-2" /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-gray-400">
              <FaLock className="mr-2" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoadingLocal}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
              isLoadingLocal
                ? "bg-purple-700 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isLoadingLocal ? "Logging in..." : "Login"}
          </button>
           <button
           type="button"
          onClick={handleGoogleLogin}
          className="w-full mb-3 bg-black-600 hover:bg-purple-700 dark:bg-red-700 dark:hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg className="h-5 w-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 31.7 29.4 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 2.9l5.7-5.7C34 5.6 29.3 3.6 24 3.6 12.5 3.6 3.6 12.5 3.6 24S12.5 44.4 24 44.4 44.4 35.5 44.4 24c0-1.1-.1-2.3-.3-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.7 1.1 7.7 2.9l5.7-5.7C34 5.6 29.3 3.6 24 3.6 16.3 3.6 9.6 7.8 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44.4c5.3 0 10.1-2 13.6-5.3l-6.3-5.2c-2 1.4-4.6 2.2-7.3 2.2-5.4 0-9.8-3.3-11.4-8l-6.6 5.1C9.3 40.2 16 44.4 24 44.4z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.5 5.3-6.6 5.9l6.3 5.2c-.4.3 9.4-6.6 8.6-19.6z"/>
          </svg>
          Continue with Google
        </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setError("All fields are required");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setIsLoadingLocal(true);
      const { success, message } = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (success) navigate("/home");
      else setError(message || "Registration failed");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoadingLocal(false);
    }
  };
   const handleGoogleLogin = () => {
    console.log("Google OAuth initiated");
    console.log("API URL:", import.meta.env.VITE_API_URL);
    
    if (!import.meta.env.VITE_API_URL) {
      alert("Configuration error: API URL not set. Please check your .env file.");
      return;
    }
    
   
    const googleOAuthUrl =window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    console.log("Redirecting to:", googleOAuthUrl);
    window.location.href = googleOAuthUrl;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-500 mb-2">Gamify</h1>
          <h2 className="text-2xl font-bold">Register</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="flex items-center text-gray-400">
              <FaUser className="mr-2" /> Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-gray-400">
              <FaEnvelope className="mr-2" /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-gray-400">
              <FaLock className="mr-2" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-gray-400">
              <FaLock className="mr-2" /> Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoadingLocal}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
              isLoadingLocal
                ? "bg-purple-700 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isLoadingLocal ? "Registering..." : "Register"}
          </button>
            <button
            type="button"
          onClick={handleGoogleLogin}
          className="w-full mb-3 bg-black-600 hover:bg-purple-700 dark:bg-red-700 dark:hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg className="h-5 w-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 31.7 29.4 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 2.9l5.7-5.7C34 5.6 29.3 3.6 24 3.6 12.5 3.6 3.6 12.5 3.6 24S12.5 44.4 24 44.4 44.4 35.5 44.4 24c0-1.1-.1-2.3-.3-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.7 1.1 7.7 2.9l5.7-5.7C34 5.6 29.3 3.6 24 3.6 16.3 3.6 9.6 7.8 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44.4c5.3 0 10.1-2 13.6-5.3l-6.3-5.2c-2 1.4-4.6 2.2-7.3 2.2-5.4 0-9.8-3.3-11.4-8l-6.6 5.1C9.3 40.2 16 44.4 24 44.4z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.5 5.3-6.6 5.9l6.3 5.2c-.4.3 9.4-6.6 8.6-19.6z"/>
          </svg>
          Sign up with Google
        </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
