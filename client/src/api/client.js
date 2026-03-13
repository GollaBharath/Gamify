import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: false,
});

export const setAuthToken = (token) => {
	if (token) {
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
		localStorage.setItem("token", token);
	} else {
		delete api.defaults.headers.common.Authorization;
		localStorage.removeItem("token");
	}
};

export const authHeader = (token) => ({
	headers: {
		Authorization: `Bearer ${token}`,
	},
});
