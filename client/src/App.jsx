import { Link, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { Landing } from "./pages/Landing.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";

const ShellHeader = () => {
	const { user, logout } = useAuth();

	return (
		<header className="topbar">
			<Link className="brand" to="/">
				<span>G</span>amify
			</Link>
			<nav>
				<Link to="/">Home</Link>
				{user ? (
					<Link to="/dashboard">Dashboard</Link>
				) : (
					<Link to="/auth">Auth</Link>
				)}
				{user && (
					<button type="button" onClick={logout}>
						Logout
					</button>
				)}
			</nav>
		</header>
	);
};

const AppRoutes = () => (
	<>
		<ShellHeader />
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="/auth" element={<AuthPage />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/dashboard" element={<Dashboard />} />
			</Route>
			<Route path="*" element={<Landing />} />
		</Routes>
	</>
);

export default function App() {
	return (
		<AuthProvider>
			<AppRoutes />
		</AuthProvider>
	);
}
