import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
	RiTeamLine,
	RiSearchLine,
	RiUserLine,
	RiCheckLine,
	RiRefreshLine,
	RiShieldLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../Context/AuthContext.jsx";

const ADMIN_ORG = ["Admin", "Organisation"];
const prettyDate = (v) =>
	v
		? new Date(v).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: "–";

const ROLE_CLASS = {
	Admin: "role-badge-Admin",
	Organisation: "role-badge-Organisation",
	Moderator: "role-badge-Moderator",
	"Event Staff": "role-badge-EventStaff",
	Member: "role-badge-Member",
};
const ROLES = ["Member", "Moderator", "Event Staff", "Admin"];

const fade = {
	hidden: { opacity: 0, y: 10 },
	show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export const UsersPage = () => {
	const { user: me } = useAuth();

	if (!ADMIN_ORG.includes(me?.role)) return <Navigate to="/app" replace />;

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [roleFilter, setRole] = useState("all");
	const [editing, setEditing] = useState(null); // { userId, role }
	const [saving, setSaving] = useState(false);

	const load = async () => {
		setLoading(true);
		try {
			const res = await api.get("/api/users");
			setUsers(res.data?.data || []);
		} catch {
			toast.error("Failed to load users.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const visible = useMemo(
		() =>
			users.filter((u) => {
				const matchSearch =
					!search ||
					u.username?.toLowerCase().includes(search.toLowerCase()) ||
					u.email?.toLowerCase().includes(search.toLowerCase());
				const matchRole = roleFilter === "all" || u.role === roleFilter;
				return matchSearch && matchRole;
			}),
		[users, search, roleFilter],
	);

	const saveRole = async () => {
		if (!editing) return;
		setSaving(true);
		try {
			await api.patch(`/api/users/${editing.userId}/role`, {
				role: editing.role,
			});
			toast.success("Role updated.");
			setEditing(null);
			await load();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to update role.");
		} finally {
			setSaving(false);
		}
	};

	const counts = useMemo(() => {
		const c = { total: users.length };
		ROLES.forEach((r) => {
			c[r] = users.filter((u) => u.role === r).length;
		});
		return c;
	}, [users]);

	return (
		<div>
			{/* Header */}
			<div className="page-header">
				<div>
					<h1 className="page-title">Users</h1>
					<p className="page-subtitle">Manage member accounts and roles</p>
				</div>
				<button className="btn btn-ghost" onClick={load}>
					<RiRefreshLine /> Refresh
				</button>
			</div>

			{/* Summary cards */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
					gap: "0.75rem",
					marginBottom: "1.5rem",
				}}>
				{[
					{
						label: "Total",
						val: counts.total,
						bg: "rgba(124,58,237,0.12)",
						color: "var(--purple-light)",
					},
					{
						label: "Members",
						val: counts["Member"] ?? 0,
						bg: "rgba(100,116,139,0.12)",
						color: "#94a3b8",
					},
					{
						label: "Moderators",
						val: counts["Moderator"] ?? 0,
						bg: "rgba(124,58,237,0.12)",
						color: "var(--purple-light)",
					},
					{
						label: "Event Staff",
						val: counts["Event Staff"] ?? 0,
						bg: "rgba(6,182,212,0.1)",
						color: "var(--cyan-light)",
					},
					{
						label: "Admins",
						val: counts["Admin"] ?? 0,
						bg: "rgba(245,158,11,0.12)",
						color: "var(--amber-mid)",
					},
				].map(({ label, val, bg, color }) => (
					<div
						key={label}
						style={{
							background: bg,
							border: `1px solid ${bg.replace("0.12", "0.3").replace("0.1", "0.25")}`,
							borderRadius: "var(--r-lg)",
							padding: "0.875rem",
							textAlign: "center",
						}}>
						<div
							style={{
								fontFamily: "var(--font-mono)",
								fontWeight: 800,
								fontSize: "1.3rem",
								color,
							}}>
							{val}
						</div>
						<div
							style={{
								fontSize: "0.72rem",
								color: "var(--text-3)",
								fontWeight: 600,
								textTransform: "uppercase",
								letterSpacing: "0.06em",
							}}>
							{label}
						</div>
					</div>
				))}
			</div>

			{/* Filters */}
			<div
				style={{
					display: "flex",
					gap: "0.75rem",
					flexWrap: "wrap",
					marginBottom: "1.25rem",
					alignItems: "center",
				}}>
				<div style={{ position: "relative", flex: "0 0 220px" }}>
					<RiSearchLine
						style={{
							position: "absolute",
							left: "0.75rem",
							top: "50%",
							transform: "translateY(-50%)",
							color: "var(--text-3)",
						}}
					/>
					<input
						className="form-input"
						placeholder="Search by username or email…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{ paddingLeft: "2.25rem" }}
					/>
				</div>
				<div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
					{["all", ...ROLES, "Organisation"].map((r) => (
						<button
							key={r}
							className={`btn btn-sm ${roleFilter === r ? "btn-primary" : "btn-ghost"}`}
							onClick={() => setRole(r)}>
							{r}
						</button>
					))}
				</div>
			</div>

			<p
				style={{
					fontSize: "0.78rem",
					color: "var(--text-3)",
					marginBottom: "0.875rem",
				}}>
				{visible.length} user{visible.length !== 1 ? "s" : ""} displayed
			</p>

			{loading ? (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						padding: "4rem",
					}}>
					<div className="spinner spinner-lg" />
				</div>
			) : visible.length === 0 ? (
				<div className="card">
					<div className="empty-state">
						<div className="empty-state-icon">
							<RiTeamLine />
						</div>
						<h3>No users found</h3>
						<p>Try adjusting your search or filter.</p>
					</div>
				</div>
			) : (
				<motion.div
					className="card"
					style={{ padding: 0, overflow: "hidden" }}
					variants={stagger}
					initial="hidden"
					animate="show">
					<table className="data-table">
						<thead>
							<tr>
								<th>User</th>
								<th>Email</th>
								<th>Role</th>
								<th>Points</th>
								<th>Level</th>
								<th>Joined</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{visible.map((u) => {
								const isEditing = editing?.userId === u._id;
								const isMe = u._id === me?._id;
								return (
									<motion.tr
										key={u._id}
										variants={fade}
										style={isMe ? { background: "rgba(124,58,237,0.04)" } : {}}>
										<td>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "0.6rem",
												}}>
												<div
													style={{
														width: 28,
														height: 28,
														borderRadius: "50%",
														background: isMe
															? "linear-gradient(135deg, var(--purple), var(--cyan-mid))"
															: "var(--bg-4)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														fontSize: "0.75rem",
														fontWeight: 700,
														color: isMe ? "#fff" : "var(--text-2)",
													}}>
													{(u.username || "?")[0].toUpperCase()}
												</div>
												<span
													style={{
														fontWeight: 600,
														color: "var(--text-1)",
														fontSize: "0.88rem",
													}}>
													{u.username}
													{isMe && (
														<span
															style={{
																fontSize: "0.68rem",
																opacity: 0.6,
																marginLeft: "0.3rem",
															}}>
															(you)
														</span>
													)}
												</span>
											</div>
										</td>
										<td style={{ fontSize: "0.82rem" }}>{u.email}</td>
										<td>
											{isEditing ? (
												<div
													style={{
														display: "flex",
														gap: "0.35rem",
														alignItems: "center",
													}}>
													<select
														className="form-select"
														style={{
															fontSize: "0.78rem",
															padding: "0.28rem 0.5rem",
															paddingRight: "1.8rem",
															maxWidth: 140,
														}}
														value={editing.role}
														onChange={(e) =>
															setEditing((p) => ({
																...p,
																role: e.target.value,
															}))
														}>
														{[...ROLES, "Organisation"].map((r) => (
															<option key={r} value={r}>
																{r}
															</option>
														))}
													</select>
													<button
														className="btn btn-sm btn-green"
														onClick={saveRole}
														disabled={saving}
														title="Save">
														{saving ? "…" : <RiCheckLine />}
													</button>
													<button
														className="btn btn-sm btn-ghost"
														onClick={() => setEditing(null)}
														title="Cancel">
														✕
													</button>
												</div>
											) : (
												<span
													className={ROLE_CLASS[u.role] || ROLE_CLASS.Member}>
													{u.role}
												</span>
											)}
										</td>
										<td
											style={{
												fontFamily: "var(--font-mono)",
												fontWeight: 600,
												color: "var(--amber-mid)",
											}}>
											{(u.points ?? 0).toLocaleString()}
										</td>
										<td
											style={{
												fontFamily: "var(--font-mono)",
												color: "var(--cyan-mid)",
											}}>
											Lv {u.level ?? 1}
										</td>
										<td style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
											{prettyDate(u.profile?.joinDate || u.createdAt)}
										</td>
										<td>
											{!isEditing && !isMe && (
												<button
													className="btn btn-sm btn-ghost"
													onClick={() =>
														setEditing({ userId: u._id, role: u.role })
													}>
													<RiShieldLine /> Role
												</button>
											)}
										</td>
									</motion.tr>
								);
							})}
						</tbody>
					</table>
				</motion.div>
			)}
		</div>
	);
};
