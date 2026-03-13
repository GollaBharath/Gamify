import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

export const ProtectedRoute = () => {
	const { isLoading, user } = useAuth();

	if (isLoading) {
		return (
			<div className="loading-page">
				<div className="spinner spinner-lg" />
				<span>Loading Gamify...</span>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/auth" replace />;
	}

	return <Outlet />;
};
