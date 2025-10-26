import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Attach token to axios
  function applyAuthHeader(nextToken) {
    if (nextToken) {
      api.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
      localStorage.setItem("token", nextToken);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem("token");
    }
  }


  // Handle OAuth token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    if (oauthToken) {
      const handleOAuth = async () => {
        setToken(oauthToken);
        applyAuthHeader(oauthToken);
        await loadUser(oauthToken);
        navigate("/dashboard", { replace: true });
      };
      handleOAuth();
    }
  }, [navigate]);



  // Set up axios once
  useEffect(() => {
    applyAuthHeader(token);

    // 401 → auto logout
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error?.response?.data?.message || "An error occurred";
        toast.error(message, { position: "top-right" });
        return Promise.reject(error);
      }
    );
    // Enhance login error handling
    const login = async ({ email, password }) => {
      setIsAuthenticating(true);
      try {
        const res = await api.post("/api/auth/login", { email, password });
        const nextToken = res.data.token;
        setToken(nextToken);
        applyAuthHeader(nextToken);
        await loadUser(nextToken);
        toast.success("Login successful!", { position: "top-right" });
        return { success: true };
      } catch (error) {
        const message = error?.response?.data?.message || "Login failed";
        toast.error(message, { position: "top-right" });
        return { success: false, message };
      } finally {
        setIsAuthenticating(false);
        setIsLoading(false);
      }
    };

  const logout = (redirect = true) => {
    setUser(null);
    setToken(null);
    applyAuthHeader(null);
    if (redirect) navigate("/login");
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticating,
      login,
      register,
      logout,
      refreshToken
    }),
    [user, isLoading, isAuthenticating]
  );
  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;


  const refreshToken = async () => {
    try {
      const res = await api.post("/api/auth/refresh", {
        token: localStorage.getItem("token")
      });
      const nextToken = res.data.token;
      setToken(nextToken);
      applyAuthHeader(nextToken);
      return nextToken;
    } catch (error) {
      logout(true);
      return null;
    }
  };

  // Add axios interceptor for token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout(true);
        }
      } catch (error) {
        logout(true);
      }
    }
  };

  // Add token expiration check on mount and periodically
  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);
}

// Export useAuth hook

export const useAuth = () => useContext(AuthContext);
