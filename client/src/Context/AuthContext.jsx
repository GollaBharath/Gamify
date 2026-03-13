import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(() => localStorage.getItem("token") || "");
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	const loadProfile = async (nextToken) => {
		if (!nextToken) {
			setUser(null);
			return { success: false };
		}

		try {
			setAuthToken(nextToken);
			const response = await api.get("/api/users/profile");
			setUser(response.data?.user || null);
			return { success: true };
		} catch (error) {
			setUser(null);
			setAuthToken(null);
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to load profile",
			};
		}
	};

	const login = async ({ email, password }) => {
		setIsAuthenticating(true);
		try {
			const response = await api.post("/api/auth/login", { email, password });
			const nextToken = response.data?.token;
			setToken(nextToken);
			const result = await loadProfile(nextToken);
			return result.success ? { success: true } : result;
		} catch (error) {
			return {
				success: false,
				message: error?.response?.data?.message || "Login failed",
			};
		} finally {
			setIsAuthenticating(false);
		}
	};

	const register = async ({ username, email, password }) => {
		setIsAuthenticating(true);
		try {
			const response = await api.post("/api/auth/register", {
				username,
				email,
				password,
			});
			const nextToken = response.data?.token;
			setToken(nextToken);
			const result = await loadProfile(nextToken);
			return result.success ? { success: true } : result;
		} catch (error) {
			return {
				success: false,
				message: error?.response?.data?.message || "Registration failed",
			};
		} finally {
			setIsAuthenticating(false);
		}
	};

	const logout = () => {
		setToken("");
		setUser(null);
		setAuthToken(null);
	};

	useEffect(() => {
		let mounted = true;

		const bootstrapAuth = async () => {
			const params = new URLSearchParams(window.location.search);
			const oauthToken = params.get("token");
			const tokenToUse = oauthToken || token;

			if (!tokenToUse) {
				setIsLoading(false);
				return;
			}

			const result = await loadProfile(tokenToUse);
			if (mounted && result.success) {
				setToken(tokenToUse);
				if (oauthToken) {
					window.history.replaceState(
						{},
						document.title,
						window.location.pathname,
					);
				}
			}

			if (mounted) {
				setIsLoading(false);
			}
		};

		bootstrapAuth();

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		setAuthToken(token);
	}, [token]);

	const value = useMemo(
		() => ({
			token,
			user,
			isLoading,
			isAuthenticating,
			login,
			register,
			logout,
			refreshProfile: () => loadProfile(token),
		}),
		[token, user, isLoading, isAuthenticating],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used inside AuthProvider");
	}
	return context;
};
