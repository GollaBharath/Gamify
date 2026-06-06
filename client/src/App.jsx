import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";

// Lazy loaded page components
const Landing = lazy(() => import("./pages/Landing.jsx").then((m) => ({ default: m.Landing })));
const AuthPage = lazy(() => import("./pages/AuthPage.jsx").then((m) => ({ default: m.AuthPage })));
const AppLayout = lazy(() => import("./pages/app/AppLayout.jsx").then((m) => ({ default: m.AppLayout })));
const DashboardHome = lazy(() => import("./pages/app/DashboardHome.jsx").then((m) => ({ default: m.DashboardHome })));
const EventsPage = lazy(() => import("./pages/app/EventsPage.jsx").then((m) => ({ default: m.EventsPage })));
const TasksPage = lazy(() => import("./pages/app/TasksPage.jsx").then((m) => ({ default: m.TasksPage })));
const ShopPage = lazy(() => import("./pages/app/ShopPage.jsx").then((m) => ({ default: m.ShopPage })));
const LeaderboardPage = lazy(() => import("./pages/app/LeaderboardPage.jsx").then((m) => ({ default: m.LeaderboardPage })));
const PointsPage = lazy(() => import("./pages/app/PointsPage.jsx").then((m) => ({ default: m.PointsPage })));
const ProfilePage = lazy(() => import("./pages/app/ProfilePage.jsx").then((m) => ({ default: m.ProfilePage })));
const ModerationPage = lazy(() => import("./pages/app/ModerationPage.jsx").then((m) => ({ default: m.ModerationPage })));
const UsersPage = lazy(() => import("./pages/app/UsersPage.jsx").then((m) => ({ default: m.UsersPage })));
const NewsletterPage = lazy(() => import("./pages/app/NewsletterPage.jsx").then((m) => ({ default: m.NewsletterPage })));

const LoadingFallback = () => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0d0e12",
    color: "#3b82f6",
    fontFamily: "system-ui, sans-serif"
  }}>
    <div style={{
      border: "4px solid rgba(59, 130, 246, 0.1)",
      borderLeftColor: "#3b82f6",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      marginBottom: "16px",
      animation: "spin 1s linear infinite"
    }}></div>
    <div>Loading Gamify...</div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<Suspense fallback={<LoadingFallback />}>
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
				</Suspense>
			</AuthProvider>
		</ThemeProvider>
	);
}
