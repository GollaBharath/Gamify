import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	RiShieldCheckLine,
	RiCheckLine,
	RiCloseCircleLine,
	RiCoinsLine,
	RiCloseLine,
	RiUserLine,
	RiRefreshLine,
	RiFileTextLine,
	RiExternalLinkLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAuth } from "../../Context/AuthContext.jsx";

const ELEVATED = ["Moderator", "Admin", "Organisation"];
const CAN_AWARD = ["Moderator", "Admin", "Organisation"];

const prettyDate = (v) =>
	v
		? new Date(v).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: "–";

const fade = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

// ── Review Modal ──────────────────────────────────────────────
const ReviewModal = ({ submission, onClose, onDone }) => {
	const [form, setForm] = useState({
		status: "approved",
		pointsAwarded: "",
		reviewNotes: "",
		feedback: "",
	});
	const [loading, setLoading] = useState(false);
	const update = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const payload = {
				status: form.status,
				reviewNotes: form.reviewNotes,
				feedback: form.feedback,
			};
			if (form.pointsAwarded)
				payload.pointsAwarded = parseInt(form.pointsAwarded, 10);
			await api.patch(
				`/api/tasks/submissions/${submission._id}/review`,
				payload,
			);
			toast.success(`Submission ${form.status}.`);
			onDone();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Review failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="modal-overlay"
			onClick={(e) => e.target === e.currentTarget && onClose()}>
			<motion.div
				className="modal"
				style={{ maxWidth: 520 }}
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}>
				<div className="modal-header">
					<div>
						<h2 className="modal-title">Review Submission</h2>
						<p
							style={{
								fontSize: "0.82rem",
								color: "var(--text-2)",
								marginTop: "0.15rem",
							}}>
							by <strong>{submission.user?.username}</strong> —{" "}
							{submission.task?.title}
						</p>
					</div>
					<button className="btn btn-ghost btn-sm" onClick={onClose}>
						<RiCloseLine />
					</button>
				</div>

				{/* Content preview */}
				<div
					style={{
						background: "var(--bg-base)",
						border: "1px solid var(--border)",
						borderRadius: "var(--r-md)",
						padding: "0.875rem",
						marginBottom: "1.25rem",
						fontSize: "0.84rem",
						color: "var(--text-2)",
						lineHeight: 1.65,
						maxHeight: 140,
						overflowY: "auto",
					}}>
					{submission.content || "(no text content)"}
				</div>

				<form onSubmit={submit} className="form-section">
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Decision *</label>
							<select
								className="form-select"
								value={form.status}
								onChange={update("status")}>
								<option value="approved">Approve</option>
								<option value="rejected">Reject</option>
							</select>
						</div>
						<div className="form-group">
							<label className="form-label">Points Awarded (override)</label>
							<input
								className="form-input"
								type="number"
								min={0}
								max={1000}
								placeholder="Leave blank = task default"
								value={form.pointsAwarded}
								onChange={update("pointsAwarded")}
							/>
						</div>
					</div>
					<div className="form-group">
						<label className="form-label">Review Notes (internal)</label>
						<textarea
							className="form-textarea"
							value={form.reviewNotes}
							onChange={update("reviewNotes")}
							placeholder="Internal notes about this review…"
							style={{ minHeight: 70 }}
						/>
					</div>
					<div className="form-group">
						<label className="form-label">Feedback (shown to member)</label>
						<textarea
							className="form-textarea"
							value={form.feedback}
							onChange={update("feedback")}
							placeholder="Feedback for the member…"
							style={{ minHeight: 70 }}
						/>
					</div>
					<div
						style={{
							display: "flex",
							gap: "0.75rem",
							justifyContent: "flex-end",
						}}>
						<button type="button" className="btn btn-ghost" onClick={onClose}>
							Cancel
						</button>
						<button
							type="submit"
							className={`btn ${form.status === "approved" ? "btn-green" : "btn-red"}`}
							disabled={loading}>
							{loading ? (
								<>
									<div
										className="spinner"
										style={{ width: 14, height: 14, borderWidth: 2 }}
									/>{" "}
									Working…
								</>
							) : form.status === "approved" ? (
								<>
									<RiCheckLine /> Approve
								</>
							) : (
								<>
									<RiCloseCircleLine /> Reject
								</>
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

// ── Moderation Page ───────────────────────────────────────────
export const ModerationPage = () => {
	const { user } = useAuth();

	if (!ELEVATED.includes(user?.role)) return <Navigate to="/app" replace />;

	const [events, setEvents] = useState([]);
	const [users, setUsers] = useState([]);
	const [subs, setSubs] = useState([]);
	const [tab, setTab] = useState("review");
	const [selEvId, setSelEvId] = useState("");
	const [selTask, setSelTask] = useState("");
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [reviewTarget, setReviewTarget] = useState(null);

	// Award state
	const [awardForm, setAwardForm] = useState({
		userId: "",
		points: "",
		reason: "",
	});
	const [awarding, setAwarding] = useState(false);

	const canAward = CAN_AWARD.includes(user?.role);

	const loadMeta = async () => {
		try {
			const [evRes, usRes] = await Promise.all([
				api.get("/api/events?includePrivate=true"),
				canAward
					? api.get("/api/users")
					: Promise.resolve({ data: { data: [] } }),
			]);
			setEvents(evRes.data?.data || []);
			setUsers(usRes.data?.data || []);
		} catch {
			/* ignore */
		}
	};

	const loadTasks = async (evId) => {
		if (!evId) return;
		try {
			const res = await api.get(`/api/tasks?eventId=${evId}`);
			setTasks(res.data?.data || []);
		} catch {
			/* ignore */
		}
	};

	const loadSubs = async (taskId) => {
		if (!taskId) {
			setSubs([]);
			return;
		}
		setLoading(true);
		try {
			const res = await api.get(`/api/tasks/${taskId}/submissions`);
			setSubs(res.data?.data || []);
		} catch {
			toast.error("Failed to load submissions.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMeta();
	}, []);
	useEffect(() => {
		loadTasks(selEvId);
		setSelTask("");
		setSubs([]);
	}, [selEvId]);
	useEffect(() => {
		loadSubs(selTask);
	}, [selTask]);

	const submitAward = async (e) => {
		e.preventDefault();
		if (!awardForm.userId || !awardForm.points || !awardForm.reason) {
			toast.error("All award fields are required.");
			return;
		}
		setAwarding(true);
		try {
			await api.post("/api/points/award", {
				userId: awardForm.userId,
				points: parseInt(awardForm.points, 10),
				reason: awardForm.reason,
			});
			toast.success("Points awarded!");
			setAwardForm({ userId: "", points: "", reason: "" });
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to award points.");
		} finally {
			setAwarding(false);
		}
	};

	const pendingSubs = subs.filter((s) => s.status === "pending");
	const allSubs = subs;

	return (
		<>
			{reviewTarget && (
				<ReviewModal
					submission={reviewTarget}
					onClose={() => setReviewTarget(null)}
					onDone={() => {
						loadSubs(selTask);
						setReviewTarget(null);
					}}
				/>
			)}

			<div>
				<div className="page-header">
					<div>
						<h1 className="page-title">Moderation</h1>
						<p className="page-subtitle">
							Review task submissions and award points
						</p>
					</div>
				</div>

				<div
					className="tab-bar"
					style={{ maxWidth: 380, marginBottom: "1.25rem" }}>
					<button
						className={`tab-btn${tab === "review" ? " active" : ""}`}
						onClick={() => setTab("review")}>
						<RiFileTextLine /> Submissions
					</button>
					{canAward && (
						<button
							className={`tab-btn${tab === "award" ? " active" : ""}`}
							onClick={() => setTab("award")}>
							<RiCoinsLine /> Award Points
						</button>
					)}
				</div>

				<AnimatePresence mode="wait">
					{tab === "review" && (
						<motion.div
							key="review"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}>
							{/* Picker row */}
							<div
								style={{
									display: "flex",
									gap: "0.75rem",
									flexWrap: "wrap",
									marginBottom: "1.25rem",
								}}>
								<div className="form-group" style={{ minWidth: 200, flex: 1 }}>
									<label className="form-label">Event</label>
									<select
										className="form-select"
										value={selEvId}
										onChange={(e) => setSelEvId(e.target.value)}>
										<option value="">Select event…</option>
										{events.map((ev) => (
											<option key={ev._id} value={ev._id}>
												{ev.title}
											</option>
										))}
									</select>
								</div>
								{tasks.length > 0 && (
									<div
										className="form-group"
										style={{ minWidth: 200, flex: 1 }}>
										<label className="form-label">Task</label>
										<select
											className="form-select"
											value={selTask}
											onChange={(e) => setSelTask(e.target.value)}>
											<option value="">Select task…</option>
											{tasks.map((t) => (
												<option key={t._id} value={t._id}>
													{t.title}
												</option>
											))}
										</select>
									</div>
								)}
								{selTask && (
									<div className="form-group" style={{ alignSelf: "flex-end" }}>
										<label className="form-label">&nbsp;</label>
										<button
											className="btn btn-ghost"
											onClick={() => loadSubs(selTask)}>
											<RiRefreshLine /> Refresh
										</button>
									</div>
								)}
							</div>

							{!selEvId ? (
								<div className="card">
									<div className="empty-state">
										<div className="empty-state-icon">
											<RiShieldCheckLine />
										</div>
										<h3>Select an event</h3>
										<p>Choose an event and task to view submissions.</p>
									</div>
								</div>
							) : !selTask ? (
								<div className="card">
									<div className="empty-state">
										<div className="empty-state-icon">
											<RiFileTextLine />
										</div>
										<h3>Select a task</h3>
										<p>Choose a task to view its submissions.</p>
									</div>
								</div>
							) : loading ? (
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										padding: "3rem",
									}}>
									<div className="spinner spinner-lg" />
								</div>
							) : allSubs.length === 0 ? (
								<div className="card">
									<div className="empty-state">
										<div className="empty-state-icon">
											<RiFileTextLine />
										</div>
										<h3>No submissions</h3>
										<p>No one has submitted to this task yet.</p>
									</div>
								</div>
							) : (
								<div className="card" style={{ padding: 0 }}>
									{/* Stats header */}
									<div
										style={{
											padding: "0.875rem 1.25rem",
											borderBottom: "1px solid var(--border)",
											display: "flex",
											gap: "1.5rem",
											flexWrap: "wrap",
										}}>
										{[
											{
												label: "Total",
												val: allSubs.length,
												color: "var(--text-1)",
											},
											{
												label: "Pending",
												val: allSubs.filter((s) => s.status === "pending")
													.length,
												color: "var(--amber-mid)",
											},
											{
												label: "Approved",
												val: allSubs.filter((s) => s.status === "approved")
													.length,
												color: "var(--green-mid)",
											},
											{
												label: "Rejected",
												val: allSubs.filter((s) => s.status === "rejected")
													.length,
												color: "var(--red-mid)",
											},
										].map(({ label, val, color }) => (
											<div key={label}>
												<span
													style={{
														fontFamily: "var(--font-mono)",
														fontWeight: 700,
														color,
														marginRight: "0.35rem",
													}}>
													{val}
												</span>
												<span
													style={{
														fontSize: "0.78rem",
														color: "var(--text-3)",
													}}>
													{label}
												</span>
											</div>
										))}
									</div>

									<table className="data-table">
										<thead>
											<tr>
												<th>Member</th>
												<th>Submitted</th>
												<th>Status</th>
												<th>Points</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{allSubs.map((sub) => (
												<tr key={sub._id}>
													<td>
														<div
															style={{
																display: "flex",
																alignItems: "center",
																gap: "0.5rem",
															}}>
															<div
																style={{
																	width: 26,
																	height: 26,
																	borderRadius: "50%",
																	background: "var(--bg-4)",
																	display: "flex",
																	alignItems: "center",
																	justifyContent: "center",
																	fontSize: "0.72rem",
																	fontWeight: 700,
																}}>
																{(sub.user?.username || "?")[0].toUpperCase()}
															</div>
															<span
																style={{
																	fontWeight: 600,
																	color: "var(--text-1)",
																	fontSize: "0.88rem",
																}}>
																{sub.user?.username || "Member"}
															</span>
														</div>
													</td>
													<td style={{ fontSize: "0.8rem" }}>
														{prettyDate(sub.submittedAt)}
													</td>
													<td>
														<span
															className={`status-badge-${sub.status}`}
															style={{ textTransform: "capitalize" }}>
															{sub.status}
														</span>
													</td>
													<td>
														{sub.pointsAwarded > 0 ? (
															<span
																style={{
																	fontFamily: "var(--font-mono)",
																	color: "var(--amber-mid)",
																	fontWeight: 700,
																}}>
																+{sub.pointsAwarded}
															</span>
														) : (
															<span style={{ color: "var(--text-3)" }}>–</span>
														)}
													</td>
													<td>
														{sub.status === "pending" ? (
															<button
																className="btn btn-sm btn-primary"
																onClick={() => setReviewTarget(sub)}>
																<RiShieldCheckLine /> Review
															</button>
														) : (
															<button
																className="btn btn-sm btn-ghost"
																onClick={() => setReviewTarget(sub)}>
																View
															</button>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</motion.div>
					)}

					{tab === "award" && canAward && (
						<motion.div
							key="award"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
									gap: "1rem",
								}}>
								<div className="card">
									<h3
										style={{
											fontWeight: 700,
											fontSize: "1rem",
											marginBottom: "1.25rem",
											display: "flex",
											alignItems: "center",
											gap: "0.4rem",
										}}>
										<RiCoinsLine style={{ color: "var(--amber-mid)" }} /> Award
										Points
									</h3>
									<form onSubmit={submitAward} className="form-section">
										<div className="form-group">
											<label className="form-label">Member *</label>
											<select
												className="form-select"
												value={awardForm.userId}
												onChange={(e) =>
													setAwardForm((p) => ({
														...p,
														userId: e.target.value,
													}))
												}>
												<option value="">Select member…</option>
												{users.map((u) => (
													<option key={u._id} value={u._id}>
														{u.username} ({u.role}) — {u.points} pts
													</option>
												))}
											</select>
										</div>
										<div className="form-group">
											<label className="form-label">Points Amount *</label>
											<input
												className="form-input"
												type="number"
												min={1}
												placeholder="e.g. 100"
												value={awardForm.points}
												onChange={(e) =>
													setAwardForm((p) => ({
														...p,
														points: e.target.value,
													}))
												}
											/>
										</div>
										<div className="form-group">
											<label className="form-label">Reason *</label>
											<textarea
												className="form-textarea"
												placeholder="Why are you awarding these points?"
												value={awardForm.reason}
												onChange={(e) =>
													setAwardForm((p) => ({
														...p,
														reason: e.target.value,
													}))
												}
												style={{ minHeight: 75 }}
											/>
										</div>
										<button
											className="btn btn-amber"
											type="submit"
											disabled={awarding}
											style={{ alignSelf: "flex-start" }}>
											{awarding ? (
												<>
													<div
														className="spinner"
														style={{ width: 14, height: 14, borderWidth: 2 }}
													/>{" "}
													Awarding…
												</>
											) : (
												<>
													<RiCoinsLine /> Award Points
												</>
											)}
										</button>
									</form>
								</div>

								<div className="card">
									<h3
										style={{
											fontWeight: 700,
											fontSize: "1rem",
											marginBottom: "1rem",
										}}>
										Guidelines
									</h3>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "0.625rem",
										}}>
										{[
											"Award points for exceptional contributions not covered by tasks.",
											"All awards are logged in the member's transaction history.",
											"Provide a clear reason — it will be visible to the member.",
											"Points awarded count toward the member's level progression.",
											"Excessive manual awards may flag for admin review.",
										].map((t, i) => (
											<div
												key={i}
												style={{
													display: "flex",
													gap: "0.5rem",
													fontSize: "0.84rem",
													color: "var(--text-2)",
													lineHeight: 1.6,
												}}>
												<RiCheckLine
													style={{
														color: "var(--green-mid)",
														flexShrink: 0,
														marginTop: 2,
													}}
												/>
												{t}
											</div>
										))}
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};
