import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
    const respInterceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          logout(); // token invalid/expired
        }
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.response.eject(respInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user
  const loadUser = async (providedToken) => {
    try {
      const active = providedToken ?? token;
      if (!active) {
        setUser(null);
        return;
      }
      applyAuthHeader(active);
      const res = await api.get("/api/users/protected");
      setUser(res.data.user);
    } catch (e) {
      // Any failure → logout (clears token)
      logout(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on first load & whenever token changes
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Auth actions
  const register = async ({ username, email, password }) => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        username,
        email,
        password,
      });
      const nextToken = res.data.token;
      setToken(nextToken);
      applyAuthHeader(nextToken);
      await loadUser(nextToken);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const nextToken = res.data.token;
      setToken(nextToken);
      applyAuthHeader(nextToken);
      await loadUser(nextToken);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      return { success: false, message };
    } finally {
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
    () => ({ user, token, isLoading, register, login, logout, loadUser }),
    [user, token, isLoading]
  );
  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
