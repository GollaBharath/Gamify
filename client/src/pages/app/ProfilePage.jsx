import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	RiUserLine,
	RiEditLine,
	RiCheckLine,
	RiCloseLine,
	RiShieldLine,
	RiCoinsLine,
	RiTrophyLine,
	RiKeyLine,
	RiCalendarLine,
	RiMailLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { api } from "../../api/client.js";
import { useAuth } from "../../Context/AuthContext.jsx";

const ROLE_CLASS = {
	Admin: "role-badge-Admin",
	Organisation: "role-badge-Organisation",
	Moderator: "role-badge-Moderator",
	"Event Staff": "role-badge-EventStaff",
	Member: "role-badge-Member",
};
const LEVEL_CAP = 1000;
const prettyDate = (v) =>
	v
		? new Date(v).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: "–";

export const ProfilePage = () => {
	const { user, refreshProfile } = useAuth();
	const [tab, setTab] = useState("info");

	// Edit profile state
	const [editing, setEditing] = useState(false);
	const [editForm, setEditForm] = useState({ bio: user?.profile?.bio || "" });
	const [saving, setSaving] = useState(false);

	// Change password state
	const [pwdForm, setPwdForm] = useState({
		current: "",
		next: "",
		confirm: "",
	});
	const [pwdLoading, setPwdLoading] = useState(false);
	const [showPwd, setShowPwd] = useState(false);

	const level = user?.level ?? 1;
	const pts = user?.points ?? 0;
	const totalPts = user?.totalPointsEarned ?? 0;
	const levelPts = totalPts % LEVEL_CAP;
	const levelPct = Math.min((levelPts / LEVEL_CAP) * 100, 100);
	const initial = (user?.username || "?")[0].toUpperCase();

	const saveProfile = async () => {
		setSaving(true);
		try {
			// Currently the API doesn't expose a profile update endpoint beyond what's available.
			// We'll show success feedback.
			toast.info("Profile update endpoint not yet available.");
			setEditing(false);
		} catch (err) {
			toast.error("Failed to update profile.");
		} finally {
			setSaving(false);
		}
	};

	const changePassword = async (e) => {
		e.preventDefault();
		if (!pwdForm.current || !pwdForm.next) {
			toast.error("Fill in all fields.");
			return;
		}
		if (pwdForm.next.length < 6) {
			toast.error("New password must be at least 6 characters.");
			return;
		}
		if (pwdForm.next !== pwdForm.confirm) {
			toast.error("Passwords don't match.");
			return;
		}
		setPwdLoading(true);
		try {
			toast.info("Password change endpoint not yet available.");
			setPwdForm({ current: "", next: "", confirm: "" });
		} catch (err) {
			toast.error("Failed to change password.");
		} finally {
			setPwdLoading(false);
		}
	};

	return (
		<div>
			{/* Header */}
			<div className="page-header">
				<h1 className="page-title">Profile</h1>
			</div>

			{/* Profile card */}
			<div className="card" style={{ marginBottom: "1.5rem" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "1.25rem",
						flexWrap: "wrap",
					}}>
					{/* Avatar */}
					<div
						style={{
							width: 72,
							height: 72,
							borderRadius: "50%",
							flexShrink: 0,
							background:
								"linear-gradient(135deg, var(--purple), var(--cyan-mid))",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "1.8rem",
							fontWeight: 700,
							color: "#fff",
							border: "3px solid rgba(124,58,237,0.3)",
							boxShadow: "0 0 24px rgba(124,58,237,0.3)",
						}}>
						{initial}
					</div>

					<div style={{ flex: 1, minWidth: 0 }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.6rem",
								flexWrap: "wrap",
								marginBottom: "0.3rem",
							}}>
							<h2
								style={{
									fontWeight: 800,
									fontSize: "1.3rem",
									letterSpacing: "-0.02em",
								}}>
								{user?.username}
							</h2>
							<span className={ROLE_CLASS[user?.role] || ROLE_CLASS.Member}>
								{user?.role}
							</span>
						</div>
						<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
							<span
								style={{
									fontSize: "0.82rem",
									color: "var(--text-2)",
									display: "flex",
									alignItems: "center",
									gap: "0.3rem",
								}}>
								<RiMailLine style={{ fontSize: "0.9rem" }} /> {user?.email}
							</span>
							<span
								style={{
									fontSize: "0.82rem",
									color: "var(--text-2)",
									display: "flex",
									alignItems: "center",
									gap: "0.3rem",
								}}>
								<RiCalendarLine style={{ fontSize: "0.9rem" }} /> Joined{" "}
								{prettyDate(user?.profile?.joinDate || user?.createdAt)}
							</span>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "1rem",
							flexWrap: "wrap",
						}}>
						{[
							{
								label: "Points",
								value: pts.toLocaleString(),
								color: "var(--amber-mid)",
							},
							{
								label: "Level",
								value: `Lv ${level}`,
								color: "var(--purple-light)",
							},
							{
								label: "Total",
								value: totalPts.toLocaleString(),
								color: "var(--cyan-light)",
							},
						].map(({ label, value, color }) => (
							<div key={label} style={{ textAlign: "center" }}>
								<div
									style={{
										fontFamily: "var(--font-mono)",
										fontWeight: 800,
										fontSize: "1.1rem",
										color,
									}}>
									{value}
								</div>
								<div
									style={{
										fontSize: "0.72rem",
										color: "var(--text-3)",
										fontWeight: 600,
										textTransform: "uppercase",
										letterSpacing: "0.07em",
									}}>
									{label}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Level progress */}
				<div style={{ marginTop: "1.25rem" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: "0.3rem",
						}}>
						<span
							style={{
								fontSize: "0.78rem",
								color: "var(--text-2)",
								fontWeight: 600,
							}}>
							Level {level} Progress
						</span>
						<span
							style={{
								fontFamily: "var(--font-mono)",
								fontSize: "0.75rem",
								color: "var(--text-3)",
							}}>
							{levelPts.toLocaleString()} / {LEVEL_CAP.toLocaleString()} XP
						</span>
					</div>
					<div className="progress-bar" style={{ height: 7 }}>
						<motion.div
							className="progress-fill"
							initial={{ width: 0 }}
							animate={{ width: `${levelPct}%` }}
							transition={{ duration: 1.2, ease: "easeOut" }}
						/>
					</div>
				</div>

				{/* Badges */}
				{user?.badges?.length > 0 && (
					<div style={{ marginTop: "1rem" }}>
						<p
							style={{
								fontSize: "0.78rem",
								color: "var(--text-3)",
								marginBottom: "0.4rem",
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.07em",
							}}>
							Badges
						</p>
						<div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
							{user.badges.map((b) => (
								<span key={b} className="badge badge-amber">
									{b}
								</span>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Tabs */}
			<div
				className="tab-bar"
				style={{ maxWidth: 380, marginBottom: "1.25rem" }}>
				<button
					className={`tab-btn${tab === "info" ? " active" : ""}`}
					onClick={() => setTab("info")}>
					<RiUserLine /> Info
				</button>
				<button
					className={`tab-btn${tab === "security" ? " active" : ""}`}
					onClick={() => setTab("security")}>
					<RiShieldLine /> Security
				</button>
				<button
					className={`tab-btn${tab === "perms" ? " active" : ""}`}
					onClick={() => setTab("perms")}>
					<RiKeyLine /> Permissions
				</button>
			</div>

			<AnimatePresence mode="wait">
				{/* Info tab */}
				{tab === "info" && (
					<motion.div
						key="info"
						className="card"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "1.25rem",
							}}>
							<h3 style={{ fontWeight: 700, fontSize: "1rem" }}>
								Account Information
							</h3>
							{!editing && (
								<button
									className="btn btn-ghost btn-sm"
									onClick={() => setEditing(true)}>
									<RiEditLine /> Edit
								</button>
							)}
						</div>
						<div style={{ display: "grid", gap: "0.875rem" }}>
							{[
								{ label: "Username", value: user?.username },
								{ label: "Email", value: user?.email },
								{ label: "Role", value: user?.role },
								{
									label: "Join Date",
									value: prettyDate(user?.profile?.joinDate || user?.createdAt),
								},
								{
									label: "Account Active",
									value: user?.isActive ? "Yes" : "No",
								},
							].map(({ label, value }) => (
								<div
									key={label}
									style={{
										display: "flex",
										gap: "1rem",
										borderBottom: "1px solid var(--border)",
										paddingBottom: "0.75rem",
									}}>
									<span
										style={{
											fontSize: "0.8rem",
											color: "var(--text-3)",
											fontWeight: 600,
											textTransform: "uppercase",
											letterSpacing: "0.06em",
											minWidth: 120,
										}}>
										{label}
									</span>
									<span style={{ fontSize: "0.9rem", color: "var(--text-1)" }}>
										{value}
									</span>
								</div>
							))}

							{/* Bio */}
							<div>
								<p
									style={{
										fontSize: "0.8rem",
										color: "var(--text-3)",
										fontWeight: 600,
										textTransform: "uppercase",
										letterSpacing: "0.06em",
										marginBottom: "0.5rem",
									}}>
									Bio
								</p>
								{editing ? (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "0.75rem",
										}}>
										<textarea
											className="form-textarea"
											value={editForm.bio}
											onChange={(e) => setEditForm({ bio: e.target.value })}
											placeholder="Tell us about yourself…"
											maxLength={500}
											style={{ minHeight: 80 }}
										/>
										<div style={{ display: "flex", gap: "0.5rem" }}>
											<button
												className="btn btn-primary btn-sm"
												onClick={saveProfile}
												disabled={saving}>
												{saving ? (
													"Saving…"
												) : (
													<>
														<RiCheckLine /> Save
													</>
												)}
											</button>
											<button
												className="btn btn-ghost btn-sm"
												onClick={() => setEditing(false)}>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<p
										style={{
											fontSize: "0.9rem",
											color: user?.profile?.bio
												? "var(--text-1)"
												: "var(--text-3)",
										}}>
										{user?.profile?.bio || "No bio set."}
									</p>
								)}
							</div>
						</div>
					</motion.div>
				)}

				{/* Security tab */}
				{tab === "security" && (
					<motion.div
						key="security"
						className="card"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}>
						<h3
							style={{
								fontWeight: 700,
								fontSize: "1rem",
								marginBottom: "1.25rem",
							}}>
							Change Password
						</h3>
						{user?.googleId && !user?.password ? (
							<div className="alert alert-info">
								Your account uses Google Sign-In. Password management is handled
								by Google.
							</div>
						) : (
							<form
								onSubmit={changePassword}
								className="form-section"
								style={{ maxWidth: 400 }}>
								<div className="form-group">
									<label className="form-label">Current Password</label>
									<input
										className="form-input"
										type={showPwd ? "text" : "password"}
										value={pwdForm.current}
										onChange={(e) =>
											setPwdForm((p) => ({ ...p, current: e.target.value }))
										}
										placeholder="Your current password"
										autoComplete="current-password"
									/>
								</div>
								<div className="form-group">
									<label className="form-label">New Password</label>
									<input
										className="form-input"
										type={showPwd ? "text" : "password"}
										value={pwdForm.next}
										onChange={(e) =>
											setPwdForm((p) => ({ ...p, next: e.target.value }))
										}
										placeholder="At least 6 characters"
										autoComplete="new-password"
									/>
								</div>
								<div className="form-group">
									<label className="form-label">Confirm New Password</label>
									<input
										className="form-input"
										type={showPwd ? "text" : "password"}
										value={pwdForm.confirm}
										onChange={(e) =>
											setPwdForm((p) => ({ ...p, confirm: e.target.value }))
										}
										placeholder="Repeat new password"
										autoComplete="new-password"
									/>
								</div>
								<label
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
										fontSize: "0.85rem",
										cursor: "pointer",
									}}>
									<input
										type="checkbox"
										checked={showPwd}
										onChange={() => setShowPwd((s) => !s)}
										style={{
											width: 14,
											height: 14,
											accentColor: "var(--purple)",
										}}
									/>
									Show passwords
								</label>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={pwdLoading}
									style={{ alignSelf: "flex-start" }}>
									{pwdLoading ? (
										"Updating…"
									) : (
										<>
											<RiCheckLine /> Update Password
										</>
									)}
								</button>
							</form>
						)}
					</motion.div>
				)}

				{/* Permissions tab */}
				{tab === "perms" && (
					<motion.div
						key="perms"
						className="card"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}>
						<h3
							style={{
								fontWeight: 700,
								fontSize: "1rem",
								marginBottom: "1.25rem",
							}}>
							Your Permissions
						</h3>
						<div style={{ display: "grid", gap: "0.6rem" }}>
							{user?.permissions &&
								Object.entries(user.permissions).map(([key, val]) => (
									<div
										key={key}
										className="data-item"
										style={{ padding: "0.625rem 0.875rem" }}>
										<span
											style={{
												fontSize: "0.88rem",
												fontWeight: 500,
												textTransform: "capitalize",
											}}>
											{key.replace(/([A-Z])/g, " $1").replace(/^can /, "Can ")}
										</span>
										<span
											className={
												val ? "badge badge-green" : "badge badge-gray"
											}>
											{val ? "✓ Granted" : "✗ Denied"}
										</span>
									</div>
								))}
							{(!user?.permissions ||
								Object.keys(user.permissions).length === 0) && (
								<p style={{ color: "var(--text-3)", fontSize: "0.88rem" }}>
									No permissions data available.
								</p>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
