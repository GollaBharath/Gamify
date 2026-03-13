import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	RiGoogleLine,
	RiEyeLine,
	RiEyeOffLine,
	RiArrowRightLine,
	RiCheckLine,
	RiTrophyLine,
	RiTaskLine,
	RiStore2Line,
	RiBarChartLine,
} from "react-icons/ri";
import { useAuth } from "../Context/AuthContext.jsx";

const GOOGLE_API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Left branding panel ──────────────────────────────────────
const AuthLeft = () => (
	<div className="auth-left">
		<div className="auth-left-glow" />
		<div style={{ position: "relative", zIndex: 1 }}>
			<Link
				to="/"
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: "0.6rem",
					marginBottom: "3.5rem",
				}}>
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: 8,
						background:
							"linear-gradient(135deg, var(--purple), var(--cyan-mid))",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "1rem",
						fontWeight: 900,
						color: "#fff",
					}}>
					G
				</div>
				<span
					style={{
						fontWeight: 800,
						fontSize: "1.2rem",
						letterSpacing: "-0.03em",
					}}>
					Gamify
				</span>
			</Link>

			<h1
				style={{
					fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
					fontWeight: 800,
					letterSpacing: "-0.04em",
					lineHeight: 1.1,
					marginBottom: "1rem",
				}}>
				Engage. Compete.
				<br />
				<span
					style={{
						background:
							"linear-gradient(135deg, var(--purple-light), var(--cyan-light))",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
					}}>
					Earn rewards.
				</span>
			</h1>
			<p
				style={{
					fontSize: "0.9rem",
					color: "var(--text-2)",
					lineHeight: 1.75,
					marginBottom: "2rem",
					maxWidth: 360,
				}}>
				The gamification platform that turns participation into competition.
				Track points, climb leaderboards, and redeem exclusive rewards.
			</p>

			<div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
				{[
					{
						icon: RiTrophyLine,
						text: "Real-time leaderboards & rankings",
						color: "var(--amber-mid)",
					},
					{
						icon: RiTaskLine,
						text: "Task engine with automated point rewards",
						color: "var(--cyan-light)",
					},
					{
						icon: RiStore2Line,
						text: "Spend points in the rewards shop",
						color: "var(--green-light)",
					},
					{
						icon: RiBarChartLine,
						text: "Full analytics & transaction history",
						color: "var(--purple-light)",
					},
				].map(({ icon: Icon, text, color }) => (
					<div
						key={text}
						style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
						<div
							style={{
								width: 30,
								height: 30,
								borderRadius: 8,
								flexShrink: 0,
								background: "rgba(255,255,255,0.05)",
								border: "1px solid rgba(255,255,255,0.08)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
							<Icon style={{ color, fontSize: "0.9rem" }} />
						</div>
						<span style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
							{text}
						</span>
					</div>
				))}
			</div>
		</div>

		{/* Testimonial card */}
		<div
			style={{
				position: "relative",
				zIndex: 1,
				background: "rgba(255,255,255,0.04)",
				border: "1px solid rgba(255,255,255,0.08)",
				borderRadius: "var(--r-lg)",
				padding: "1rem 1.25rem",
				marginTop: "2rem",
			}}>
			<p
				style={{
					fontSize: "0.84rem",
					color: "var(--text-2)",
					lineHeight: 1.65,
					fontStyle: "italic",
					margin: 0,
				}}>
				"Gamify completely changed how our community engages — everyone is
				excited to contribute and earn."
			</p>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.55rem",
					marginTop: "0.75rem",
				}}>
				<div
					style={{
						width: 28,
						height: 28,
						borderRadius: "50%",
						background:
							"linear-gradient(135deg, var(--purple), var(--cyan-mid))",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "0.75rem",
						fontWeight: 700,
						color: "#fff",
					}}>
					A
				</div>
				<div>
					<p style={{ fontSize: "0.78rem", fontWeight: 600, margin: 0 }}>
						Alex M.
					</p>
					<p style={{ fontSize: "0.72rem", color: "var(--text-3)", margin: 0 }}>
						Community Manager
					</p>
				</div>
			</div>
		</div>
	</div>
);

// ── Main Auth Page ────────────────────────────────────────────
export const AuthPage = () => {
	const navigate = useNavigate();
	const { user, login, register, isAuthenticating } = useAuth();
	const [mode, setMode] = useState("login");
	const [showPwd, setShowPwd] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({ username: "", email: "", password: "" });

	if (user) return <Navigate to="/app" replace />;

	const update = (field) => (e) =>
		setForm((p) => ({ ...p, [field]: e.target.value }));
	const switchMode = (m) => {
		setMode(m);
		setError("");
		setForm({ username: "", email: "", password: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!form.email || !form.password) {
			setError("Email and password are required.");
			return;
		}
		if (mode === "register" && !form.username) {
			setError("Username is required.");
			return;
		}
		if (form.password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}

		const action = mode === "login" ? login : register;
		const payload =
			mode === "login"
				? { email: form.email, password: form.password }
				: {
						username: form.username,
						email: form.email,
						password: form.password,
					};

		const result = await action(payload);
		if (!result.success) {
			setError(result.message || "Authentication failed.");
			return;
		}
		navigate("/app");
	};

	return (
		<div className="auth-page">
			<AuthLeft />

			{/* Right – form */}
			<div className="auth-right">
				<div className="auth-card">
					{/* Header */}
					<div className="auth-card-header">
						<h2 className="auth-card-title">
							{mode === "login" ? "Welcome back" : "Create account"}
						</h2>
						<p className="auth-card-sub">
							{mode === "login"
								? "Sign in to your Gamify account"
								: "Join the community and start earning points"}
						</p>
					</div>

					{/* Mode tabs */}
					<div className="tab-bar" style={{ marginBottom: "1.5rem" }}>
						<button
							className={`tab-btn${mode === "login" ? " active" : ""}`}
							onClick={() => switchMode("login")}>
							Sign in
						</button>
						<button
							className={`tab-btn${mode === "register" ? " active" : ""}`}
							onClick={() => switchMode("register")}>
							Sign up
						</button>
					</div>

					{/* Google */}
					<button
						className="btn btn-ghost"
						style={{ width: "100%", marginBottom: "1rem", gap: "0.5rem" }}
						onClick={() => {
							window.location.href = `${GOOGLE_API}/api/auth/google`;
						}}>
						<RiGoogleLine style={{ fontSize: "1.1rem" }} />
						Continue with Google
					</button>

					<div className="divider-label">or continue with email</div>

					{/* Form */}
					<AnimatePresence mode="wait">
						<motion.form
							key={mode}
							onSubmit={handleSubmit}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.2 }}
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "0.875rem",
							}}
							noValidate>
							{mode === "register" && (
								<div className="form-group">
									<label className="form-label">Username</label>
									<input
										className="form-input"
										type="text"
										placeholder="e.g. cool_gamer_42"
										value={form.username}
										onChange={update("username")}
										minLength={3}
										maxLength={30}
										autoComplete="username"
									/>
								</div>
							)}

							<div className="form-group">
								<label className="form-label">Email address</label>
								<input
									className="form-input"
									type="email"
									placeholder="you@example.com"
									value={form.email}
									onChange={update("email")}
									autoComplete="email"
								/>
							</div>

							<div className="form-group">
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}>
									<label className="form-label">Password</label>
								</div>
								<div style={{ position: "relative" }}>
									<input
										className="form-input"
										type={showPwd ? "text" : "password"}
										placeholder="At least 6 characters"
										value={form.password}
										onChange={update("password")}
										style={{ paddingRight: "2.75rem" }}
										autoComplete={
											mode === "login" ? "current-password" : "new-password"
										}
									/>
									<button
										type="button"
										onClick={() => setShowPwd((s) => !s)}
										style={{
											position: "absolute",
											right: "0.75rem",
											top: "50%",
											transform: "translateY(-50%)",
											color: "var(--text-3)",
											fontSize: "1rem",
										}}>
										{showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
									</button>
								</div>
							</div>

							{error && (
								<motion.div
									className="alert alert-error"
									initial={{ opacity: 0, scale: 0.97 }}
									animate={{ opacity: 1, scale: 1 }}
									style={{ fontSize: "0.84rem" }}>
									{error}
								</motion.div>
							)}

							<button
								className="btn btn-primary"
								type="submit"
								disabled={isAuthenticating}
								style={{
									width: "100%",
									marginTop: "0.1rem",
									padding: "0.72rem",
									fontSize: "0.92rem",
								}}>
								{isAuthenticating ? (
									<>
										<div
											className="spinner"
											style={{ width: 16, height: 16, borderWidth: 2 }}
										/>{" "}
										Working...
									</>
								) : mode === "login" ? (
									<>
										Sign in <RiArrowRightLine />
									</>
								) : (
									<>
										Create account <RiCheckLine />
									</>
								)}
							</button>
						</motion.form>
					</AnimatePresence>

					<p
						style={{
							fontSize: "0.76rem",
							color: "var(--text-3)",
							textAlign: "center",
							marginTop: "1.25rem",
							lineHeight: 1.6,
						}}>
						By continuing you agree to our{" "}
						<span style={{ color: "var(--purple-light)", cursor: "pointer" }}>
							Terms of Service
						</span>{" "}
						and{" "}
						<span style={{ color: "var(--purple-light)", cursor: "pointer" }}>
							Privacy Policy
						</span>
						.
					</p>

					<Link
						to="/"
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "0.3rem",
							fontSize: "0.8rem",
							color: "var(--text-3)",
							marginTop: "1rem",
							transition: "color 0.15s",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.color = "var(--text-2)")
						}
						onMouseLeave={(e) =>
							(e.currentTarget.style.color = "var(--text-3)")
						}>
						← Back to Gamify
					</Link>
				</div>
			</div>
		</div>
	);
};
