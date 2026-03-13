import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	RiMailLine,
	RiSendPlaneLine,
	RiUserAddLine,
	RiCheckLine,
	RiGroupLine,
	RiRefreshLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../Context/AuthContext.jsx";

const ADMIN_ORG = ["Admin", "Organisation"];

export const NewsletterPage = () => {
	const { user } = useAuth();

	if (!ADMIN_ORG.includes(user?.role)) return <Navigate to="/app" replace />;

	const [count, setCount] = useState(0);
	const [countLoad, setCountLoad] = useState(true);

	// Subscribe form
	const [subEmail, setSubEmail] = useState("");
	const [subLoading, setSubLoad] = useState(false);

	// Broadcast form
	const [mailForm, setMailForm] = useState({ subject: "", content: "" });
	const [mailLoad, setMailLoad] = useState(false);
	const [previewMode, setPreview] = useState(false);

	const loadCount = async () => {
		setCountLoad(true);
		try {
			const res = await api.get("/api/newsletter/count");
			setCount(res.data?.count ?? 0);
		} catch {
			/* silently */
		} finally {
			setCountLoad(false);
		}
	};

	useEffect(() => {
		loadCount();
	}, []);

	const subscribe = async (e) => {
		e.preventDefault();
		if (!subEmail) {
			toast.error("Email is required.");
			return;
		}
		setSubLoad(true);
		try {
			await api.post("/api/newsletter/subscribe", { email: subEmail });
			toast.success(`${subEmail} subscribed!`);
			setSubEmail("");
			await loadCount();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to subscribe.");
		} finally {
			setSubLoad(false);
		}
	};

	const send = async (e) => {
		e.preventDefault();
		if (!mailForm.subject || !mailForm.content) {
			toast.error("Subject and content are required.");
			return;
		}
		setMailLoad(true);
		try {
			await api.post("/api/newsletter/send", {
				subject: mailForm.subject,
				content: mailForm.content,
			});
			toast.success(`Newsletter sent to ${count} subscribers!`);
			setMailForm({ subject: "", content: "" });
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to send newsletter.");
		} finally {
			setMailLoad(false);
		}
	};

	return (
		<div>
			{/* Header */}
			<div className="page-header">
				<div>
					<h1 className="page-title">Newsletter</h1>
					<p className="page-subtitle">
						Manage subscribers and send broadcasts
					</p>
				</div>
				<button className="btn btn-ghost" onClick={loadCount}>
					<RiRefreshLine /> Refresh
				</button>
			</div>

			{/* Stats */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
					gap: "0.875rem",
					marginBottom: "1.5rem",
				}}>
				<div className="stat-card">
					<div className="stat-icon stat-icon-cyan">
						<RiGroupLine />
					</div>
					<div className="stat-value">
						{countLoad ? "…" : count.toLocaleString()}
					</div>
					<div className="stat-label">Active Subscribers</div>
				</div>
				<div className="stat-card">
					<div className="stat-icon stat-icon-purple">
						<RiMailLine />
					</div>
					<div className="stat-value">–</div>
					<div className="stat-label">Emails Sent (lifetime)</div>
				</div>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
					gap: "1rem",
				}}>
				{/* Subscribe a new email */}
				<motion.div
					className="card"
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}>
					<h3
						style={{
							fontWeight: 700,
							fontSize: "1rem",
							marginBottom: "1.25rem",
							display: "flex",
							alignItems: "center",
							gap: "0.4rem",
						}}>
						<RiUserAddLine style={{ color: "var(--cyan-light)" }} /> Add
						Subscriber
					</h3>
					<form onSubmit={subscribe} className="form-section">
						<div className="form-group">
							<label className="form-label">Email Address</label>
							<input
								className="form-input"
								type="email"
								placeholder="member@example.com"
								value={subEmail}
								onChange={(e) => setSubEmail(e.target.value)}
							/>
						</div>
						<button
							className="btn btn-cyan"
							type="submit"
							disabled={subLoading}
							style={{ alignSelf: "flex-start" }}>
							{subLoading ? (
								<>
									<div
										className="spinner"
										style={{ width: 14, height: 14, borderWidth: 2 }}
									/>{" "}
									Adding…
								</>
							) : (
								<>
									<RiCheckLine /> Subscribe Email
								</>
							)}
						</button>
					</form>

					{/* Info box */}
					<div
						className="alert alert-info"
						style={{ marginTop: "1rem", fontSize: "0.82rem" }}>
						Adding a subscriber here will send them future broadcasts. Members
						can self-subscribe via the public newsletter form on the landing
						page.
					</div>
				</motion.div>

				{/* Send broadcast */}
				<motion.div
					className="card"
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "1.25rem",
						}}>
						<h3
							style={{
								fontWeight: 700,
								fontSize: "1rem",
								display: "flex",
								alignItems: "center",
								gap: "0.4rem",
							}}>
							<RiSendPlaneLine style={{ color: "var(--purple-light)" }} /> Send
							Broadcast
						</h3>
						<button
							className="btn btn-ghost btn-sm"
							onClick={() => setPreview((p) => !p)}>
							{previewMode ? "Edit" : "Preview"}
						</button>
					</div>

					{previewMode ? (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "0.875rem",
							}}>
							<div
								style={{
									background: "var(--bg-base)",
									border: "1px solid var(--border)",
									borderRadius: "var(--r-lg)",
									padding: "1.25rem",
								}}>
								<p
									style={{
										fontSize: "0.78rem",
										color: "var(--text-3)",
										marginBottom: "0.5rem",
										fontWeight: 700,
										textTransform: "uppercase",
										letterSpacing: "0.06em",
									}}>
									Subject
								</p>
								<h3
									style={{
										fontWeight: 700,
										fontSize: "1rem",
										marginBottom: "1rem",
									}}>
									{mailForm.subject || "(no subject)"}
								</h3>
								<div
									style={{
										borderTop: "1px solid var(--border)",
										paddingTop: "0.875rem",
									}}>
									<p
										style={{
											fontSize: "0.78rem",
											color: "var(--text-3)",
											marginBottom: "0.5rem",
											fontWeight: 700,
											textTransform: "uppercase",
											letterSpacing: "0.06em",
										}}>
										Body
									</p>
									<p
										style={{
											fontSize: "0.88rem",
											color: "var(--text-2)",
											lineHeight: 1.7,
											whiteSpace: "pre-wrap",
										}}>
										{mailForm.content || "(no content)"}
									</p>
								</div>
							</div>
							<div
								className="alert alert-warning"
								style={{ fontSize: "0.82rem" }}>
								This will be sent to <strong>{count}</strong> active subscriber
								{count !== 1 ? "s" : ""}.
							</div>
							<div style={{ display: "flex", gap: "0.75rem" }}>
								<button
									className="btn btn-ghost"
									onClick={() => setPreview(false)}>
									Back to Edit
								</button>
								<button
									className="btn btn-primary"
									onClick={send}
									disabled={mailLoad || count === 0}>
									{mailLoad ? (
										<>
											<div
												className="spinner"
												style={{ width: 14, height: 14, borderWidth: 2 }}
											/>{" "}
											Sending…
										</>
									) : (
										<>
											<RiSendPlaneLine /> Send to {count} subscribers
										</>
									)}
								</button>
							</div>
						</div>
					) : (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								setPreview(true);
							}}
							className="form-section">
							<div className="form-group">
								<label className="form-label">Subject *</label>
								<input
									className="form-input"
									value={mailForm.subject}
									onChange={(e) =>
										setMailForm((p) => ({ ...p, subject: e.target.value }))
									}
									placeholder="June Roundup: New Events & Rewards"
									required
								/>
							</div>
							<div className="form-group">
								<label className="form-label">Content (plain text) *</label>
								<textarea
									className="form-textarea"
									value={mailForm.content}
									onChange={(e) =>
										setMailForm((p) => ({ ...p, content: e.target.value }))
									}
									placeholder="Write your newsletter content here…&#10;&#10;This will be sent as plain text to all subscribers."
									style={{ minHeight: 140 }}
									required
								/>
								<span style={{ fontSize: "0.73rem", color: "var(--text-3)" }}>
									{mailForm.content.length} characters
								</span>
							</div>
							<div
								style={{
									display: "flex",
									gap: "0.75rem",
									alignItems: "center",
								}}>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={count === 0}>
									<RiSendPlaneLine />
									{count === 0 ? "No subscribers" : `Preview & Send →`}
								</button>
								{count === 0 && (
									<span style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
										Add subscribers first.
									</span>
								)}
							</div>
						</form>
					)}
				</motion.div>
			</div>
		</div>
	);
};
