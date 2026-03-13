import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { RiMenuLine, RiCoinsLine, RiNotification3Line } from "react-icons/ri";
import { Sidebar } from "../../components/Sidebar.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";

const PAGE_TITLES = {
	"/app": { title: "Dashboard", sub: "Your activity overview" },
	"/app/events": { title: "Events", sub: "Browse and manage events" },
	"/app/tasks": { title: "Tasks", sub: "Complete tasks to earn points" },
	"/app/shop": { title: "Shop", sub: "Spend your points on rewards" },
	"/app/leaderboard": {
		title: "Leaderboard",
		sub: "Top performers in the community",
	},
	"/app/points": { title: "Points", sub: "Your point history and balance" },
	"/app/profile": { title: "Profile", sub: "Manage your account" },
	"/app/moderation": {
		title: "Moderation",
		sub: "Review submissions & award points",
	},
	"/app/users": { title: "Users", sub: "Manage member roles" },
	"/app/newsletter": {
		title: "Newsletter",
		sub: "Manage subscribers and broadcasts",
	},
};

export const AppLayout = () => {
	const { user } = useAuth();
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const pageInfo = PAGE_TITLES[location.pathname] || {
		title: "Gamify",
		sub: "",
	};

	return (
		<div className="app-shell">
			<Sidebar
				collapsed={collapsed}
				onToggle={() => setCollapsed((c) => !c)}
				mobileOpen={mobileOpen}
				onMobileClose={() => setMobileOpen(false)}
			/>

			<div className={`app-main${collapsed ? " sidebar-collapsed" : ""}`}>
				{/* Top bar */}
				<header className="app-topbar">
					<div className="app-topbar-left">
						<button
							className="mobile-hamburger"
							onClick={() => setMobileOpen(true)}
							aria-label="Open menu">
							<RiMenuLine />
						</button>
						<div>
							<div
								style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2 }}>
								{pageInfo.title}
							</div>
							{pageInfo.sub && (
								<div
									style={{
										fontSize: "0.75rem",
										color: "var(--text-3)",
										lineHeight: 1,
									}}>
									{pageInfo.sub}
								</div>
							)}
						</div>
					</div>
					<div className="app-topbar-right">
						{/* Points pill */}
						<div className="topbar-points-pill">
							<RiCoinsLine />
							<span>{(user?.points ?? 0).toLocaleString()}</span>
							<span style={{ color: "var(--amber-mid)", opacity: 0.6 }}>
								pts
							</span>
						</div>
						{/* Level pill */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.35rem",
								background: "rgba(124,58,237,0.12)",
								border: "1px solid rgba(124,58,237,0.25)",
								borderRadius: "9999px",
								padding: "0.3rem 0.7rem",
								fontSize: "0.78rem",
								fontWeight: 700,
								fontFamily: "var(--font-mono)",
								color: "var(--purple-light)",
							}}>
							Lv {user?.level ?? 1}
						</div>
					</div>
				</header>

				{/* Page content */}
				<main className="app-content">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
