import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";

import { Landing } from "./pages/Landing.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { AppLayout } from "./pages/app/AppLayout.jsx";
import { DashboardHome } from "./pages/app/DashboardHome.jsx";
import { EventsPage } from "./pages/app/EventsPage.jsx";
import { TasksPage } from "./pages/app/TasksPage.jsx";
import { ShopPage } from "./pages/app/ShopPage.jsx";
import { LeaderboardPage } from "./pages/app/LeaderboardPage.jsx";
import { PointsPage } from "./pages/app/PointsPage.jsx";
import { ProfilePage } from "./pages/app/ProfilePage.jsx";
import { ModerationPage } from "./pages/app/ModerationPage.jsx";
import { UsersPage } from "./pages/app/UsersPage.jsx";
import { NewsletterPage } from "./pages/app/NewsletterPage.jsx";

export default function App() {
	return (
		<AuthProvider>
			<Routes>
				{/* Public */}
				<Route path="/" element={<Landing />} />
				<Route path="/auth" element={<AuthPage />} />

				{/* Legacy redirect: /dashboard → /app */}
				<Route path="/dashboard" element={<Navigate to="/app" replace />} />

				{/* Protected App */}
				<Route element={<ProtectedRoute />}>
					<Route path="/app" element={<AppLayout />}>
						<Route index element={<DashboardHome />} />
						<Route path="events" element={<EventsPage />} />
						<Route path="tasks" element={<TasksPage />} />
						<Route path="shop" element={<ShopPage />} />
						<Route path="leaderboard" element={<LeaderboardPage />} />
						<Route path="points" element={<PointsPage />} />
						<Route path="profile" element={<ProfilePage />} />
						{/* Moderator+ */}
						<Route path="moderation" element={<ModerationPage />} />
						{/* Admin / Organisation */}
						<Route path="users" element={<UsersPage />} />
						<Route path="newsletter" element={<NewsletterPage />} />
					</Route>
				</Route>

				{/* 404 fallback */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</AuthProvider>
	);
}
