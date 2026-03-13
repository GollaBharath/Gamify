import { NavLink, useNavigate } from "react-router-dom";
import {
	RiDashboardLine,
	RiCalendarEventLine,
	RiTaskLine,
	RiStore2Line,
	RiTrophyLine,
	RiCoinLine,
	RiUserLine,
	RiShieldCheckLine,
	RiTeamLine,
	RiMailLine,
	RiLogoutBoxLine,
	RiMenuFoldLine,
	RiMenuUnfoldLine,
} from "react-icons/ri";
import { useAuth } from "../Context/AuthContext.jsx";

const ELEVATED = ["Moderator", "Admin", "Organisation"];
const ADMIN_ORG = ["Admin", "Organisation"];

const navItems = [
	{ to: "/app", icon: RiDashboardLine, label: "Dashboard", end: true },
	{ to: "/app/events", icon: RiCalendarEventLine, label: "Events" },
	{ to: "/app/tasks", icon: RiTaskLine, label: "Tasks" },
	{ to: "/app/shop", icon: RiStore2Line, label: "Shop" },
	{ to: "/app/leaderboard", icon: RiTrophyLine, label: "Leaderboard" },
	{ to: "/app/points", icon: RiCoinLine, label: "Points" },
	{ to: "/app/profile", icon: RiUserLine, label: "Profile" },
];

const elevatedItems = [
	{ to: "/app/moderation", icon: RiShieldCheckLine, label: "Moderation" },
];

const adminItems = [
	{ to: "/app/users", icon: RiTeamLine, label: "Users" },
	{ to: "/app/newsletter", icon: RiMailLine, label: "Newsletter" },
];

const ROLE_CLASS = {
	Admin: "role-badge-Admin",
	Organisation: "role-badge-Organisation",
	Moderator: "role-badge-Moderator",
	"Event Staff": "role-badge-EventStaff",
	Member: "role-badge-Member",
};

export const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const role = user?.role || "Member";
	const showElevated = ELEVATED.includes(role);
	const showAdmin = ADMIN_ORG.includes(role);

	const initial = (user?.username || "?")[0].toUpperCase();

	const handleLogout = () => {
		logout();
		navigate("/auth");
	};

	const sidebarClass = [
		"sidebar",
		collapsed ? "collapsed" : "",
		mobileOpen ? "mobile-open" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<>
			{/* Mobile overlay */}
			<div
				className={`sidebar-overlay${mobileOpen ? " visible" : ""}`}
				onClick={onMobileClose}
			/>

			<aside className={sidebarClass} aria-label="App navigation">
				{/* Header */}
				<div className="sidebar-header">
					<div className="sidebar-logo">
						<div className="sidebar-logo-icon">G</div>
						<span className="sidebar-logo-text">Gamify</span>
					</div>
					<button
						className="sidebar-toggle"
						onClick={onToggle}
						title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
						{collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
					</button>
				</div>

				{/* Navigation */}
				<nav className="sidebar-nav">
					{/* General */}
					<div className="sidebar-section">
						<div className="sidebar-section-title">General</div>
						{navItems.map(({ to, icon: Icon, label, end }) => (
							<NavLink
								key={to}
								to={to}
								end={end}
								className={({ isActive }) =>
									`sidebar-link${isActive ? " active" : ""}`
								}
								onClick={onMobileClose}
								title={collapsed ? label : undefined}>
								<span className="sidebar-link-icon">
									<Icon />
								</span>
								<span className="sidebar-link-label">{label}</span>
							</NavLink>
						))}
					</div>

					{/* Moderation */}
					{showElevated && (
						<div className="sidebar-section">
							<div className="sidebar-section-title">Moderation</div>
							{elevatedItems.map(({ to, icon: Icon, label }) => (
								<NavLink
									key={to}
									to={to}
									className={({ isActive }) =>
										`sidebar-link${isActive ? " active" : ""}`
									}
									onClick={onMobileClose}
									title={collapsed ? label : undefined}>
									<span className="sidebar-link-icon">
										<Icon />
									</span>
									<span className="sidebar-link-label">{label}</span>
								</NavLink>
							))}
						</div>
					)}

					{/* Admin */}
					{showAdmin && (
						<div className="sidebar-section">
							<div className="sidebar-section-title">Admin</div>
							{adminItems.map(({ to, icon: Icon, label }) => (
								<NavLink
									key={to}
									to={to}
									className={({ isActive }) =>
										`sidebar-link${isActive ? " active" : ""}`
									}
									onClick={onMobileClose}
									title={collapsed ? label : undefined}>
									<span className="sidebar-link-icon">
										<Icon />
									</span>
									<span className="sidebar-link-label">{label}</span>
								</NavLink>
							))}
						</div>
					)}

					{/* Logout (always last) */}
					<div className="sidebar-section" style={{ marginTop: "auto" }}>
						<button
							className="sidebar-link"
							onClick={handleLogout}
							style={{ width: "100%", marginTop: "0.25rem" }}
							title={collapsed ? "Log out" : undefined}>
							<span
								className="sidebar-link-icon"
								style={{ color: "var(--red-mid)" }}>
								<RiLogoutBoxLine />
							</span>
							<span
								className="sidebar-link-label"
								style={{ color: "var(--red-mid)" }}>
								Log out
							</span>
						</button>
					</div>
				</nav>

				{/* Footer / user */}
				<div className="sidebar-footer">
					<div
						className="sidebar-user-card"
						title={collapsed ? user?.username : undefined}>
						<div className="sidebar-avatar">{initial}</div>
						<div className="sidebar-user-info">
							<div className="sidebar-user-name">{user?.username}</div>
							<div className="sidebar-user-role">
								<span className={ROLE_CLASS[role] || ROLE_CLASS.Member}>
									{role}
								</span>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
};
