import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

export const ProtectedRoute = () => {
	const { isLoading, user } = useAuth();

	if (isLoading) {
		return (
			<div className="loading-screen">
				<h2>Syncing command center...</h2>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/auth" replace />;
	}

	return <Outlet />;
};
