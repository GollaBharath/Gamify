import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	RiTaskLine,
	RiAddLine,
	RiCloseLine,
	RiCheckLine,
	RiSendPlaneLine,
	RiCoinsLine,
	RiFilter3Line,
	RiFileTextLine,
	RiTimeLine,
	RiEyeLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { api } from "../../api/client.js";
import { useAuth } from "../../Context/AuthContext.jsx";

const CAN_CREATE = ["Event Staff", "Admin", "Organisation"];
const prettyDate = (v) =>
	v
		? new Date(v).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: "–";

const diffColor = {
	easy: "var(--green-mid)",
	medium: "var(--amber-mid)",
	hard: "var(--orange-mid)",
	expert: "var(--red-mid)",
};
const diffBg = {
	easy: "rgba(16,185,129,0.12)",
	medium: "rgba(245,158,11,0.12)",
	hard: "rgba(249,115,22,0.12)",
	expert: "rgba(239,68,68,0.12)",
};

const DiffBadge = ({ diff }) => (
	<span
		style={{
			background: diffBg[diff] || "var(--bg-3)",
			color: diffColor[diff] || "var(--text-2)",
			border: `1px solid ${(diffBg[diff] || "var(--bg-3)").replace("0.12", "0.3")}`,
			borderRadius: "9999px",
			padding: "0.18rem 0.6rem",
			fontSize: "0.72rem",
			fontWeight: 700,
			textTransform: "capitalize",
		}}>
		{diff}
	</span>
);

const fade = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

// ── Create Task Modal ─────────────────────────────────────────
const CreateTaskModal = ({ events, onClose, onCreated }) => {
	const [form, setForm] = useState({
		eventId: events[0]?._id || "",
		title: "",
		description: "",
		points: 25,
		difficulty: "medium",
		type: "submission",
		submissionFormat: "text",
		status: "active",
		deadline: "",
	});
	const [loading, setLoading] = useState(false);
	const update = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

	const submit = async (e) => {
		e.preventDefault();
		if (!form.eventId || !form.title || !form.points) {
			toast.error("Event, title and points are required.");
			return;
		}
		setLoading(true);
		try {
			await api.post("/api/tasks", {
				...form,
				points: parseInt(form.points, 10),
			});
			toast.success("Task created!");
			onCreated();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to create task.");
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
				style={{ maxWidth: 560 }}
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}>
				<div className="modal-header">
					<h2 className="modal-title">Create Task</h2>
					<button className="btn btn-ghost btn-sm" onClick={onClose}>
						<RiCloseLine />
					</button>
				</div>
				<form onSubmit={submit} className="form-section">
					<div className="form-group">
						<label className="form-label">Event *</label>
						<select
							className="form-select"
							value={form.eventId}
							onChange={update("eventId")}>
							<option value="">Select event</option>
							{events.map((ev) => (
								<option key={ev._id} value={ev._id}>
									{ev.title}
								</option>
							))}
						</select>
					</div>
					<div className="form-group">
						<label className="form-label">Task Title *</label>
						<input
							className="form-input"
							value={form.title}
							onChange={update("title")}
							placeholder="Build a landing page"
							required
						/>
					</div>
					<div className="form-group">
						<label className="form-label">Description</label>
						<textarea
							className="form-textarea"
							value={form.description}
							onChange={update("description")}
							placeholder="Detailed description…"
							style={{ minHeight: 80 }}
						/>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Points (1–1000) *</label>
							<input
								className="form-input"
								type="number"
								min={1}
								max={1000}
								value={form.points}
								onChange={update("points")}
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Difficulty</label>
							<select
								className="form-select"
								value={form.difficulty}
								onChange={update("difficulty")}>
								{["easy", "medium", "hard", "expert"].map((d) => (
									<option
										key={d}
										value={d}
										style={{ textTransform: "capitalize" }}>
										{d}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Task Type</label>
							<select
								className="form-select"
								value={form.type}
								onChange={update("type")}>
								{[
									"submission",
									"quiz",
									"participation",
									"creative",
									"survey",
								].map((t) => (
									<option
										key={t}
										value={t}
										style={{ textTransform: "capitalize" }}>
										{t}
									</option>
								))}
							</select>
						</div>
						<div className="form-group">
							<label className="form-label">Submission Format</label>
							<select
								className="form-select"
								value={form.submissionFormat}
								onChange={update("submissionFormat")}>
								{["text", "file", "link", "image", "video", "multiple"].map(
									(f) => (
										<option
											key={f}
											value={f}
											style={{ textTransform: "capitalize" }}>
											{f}
										</option>
									),
								)}
							</select>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Status</label>
							<select
								className="form-select"
								value={form.status}
								onChange={update("status")}>
								{["active", "draft", "inactive"].map((s) => (
									<option
										key={s}
										value={s}
										style={{ textTransform: "capitalize" }}>
										{s}
									</option>
								))}
							</select>
						</div>
						<div className="form-group">
							<label className="form-label">Deadline (optional)</label>
							<input
								className="form-input"
								type="datetime-local"
								value={form.deadline}
								onChange={update("deadline")}
							/>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							gap: "0.75rem",
							justifyContent: "flex-end",
							marginTop: "0.25rem",
						}}>
						<button type="button" className="btn btn-ghost" onClick={onClose}>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading}>
							{loading ? (
								<>
									<div
										className="spinner"
										style={{ width: 14, height: 14, borderWidth: 2 }}
									/>{" "}
									Creating…
								</>
							) : (
								<>
									<RiCheckLine /> Create Task
								</>
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

// ── Submit Task Modal ─────────────────────────────────────────
const SubmitTaskModal = ({ task, onClose, onSubmitted }) => {
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		if (!content.trim()) {
			toast.error("Submission content is required.");
			return;
		}
		setLoading(true);
		try {
			await api.post(`/api/tasks/${task._id}/submissions`, { content });
			toast.success("Submission sent for review!");
			onSubmitted();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to submit.");
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
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}>
				<div className="modal-header">
					<div>
						<h2 className="modal-title">Submit Task</h2>
						<p
							style={{
								fontSize: "0.82rem",
								color: "var(--text-2)",
								marginTop: "0.2rem",
							}}>
							{task.title}
						</p>
					</div>
					<button className="btn btn-ghost btn-sm" onClick={onClose}>
						<RiCloseLine />
					</button>
				</div>
				<div
					style={{
						display: "flex",
						gap: "0.75rem",
						marginBottom: "1.25rem",
						flexWrap: "wrap",
					}}>
					<DiffBadge diff={task.difficulty} />
					<span
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.3rem",
							fontSize: "0.8rem",
							color: "var(--amber-mid)",
							fontWeight: 700,
						}}>
						<RiCoinsLine /> {task.points} points
					</span>
					{task.deadline && (
						<span
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.3rem",
								fontSize: "0.78rem",
								color: "var(--text-3)",
							}}>
							<RiTimeLine /> Due {prettyDate(task.deadline)}
						</span>
					)}
				</div>
				{task.description && (
					<div
						className="alert alert-info"
						style={{ marginBottom: "1rem", fontSize: "0.84rem" }}>
						{task.description}
					</div>
				)}
				<form onSubmit={submit} className="form-section">
					<div className="form-group">
						<label className="form-label">
							Your Submission
							{task.submissionFormat && (
								<span
									style={{
										marginLeft: "0.4rem",
										fontWeight: 400,
										textTransform: "none",
										color: "var(--text-3)",
									}}>
									(format: {task.submissionFormat})
								</span>
							)}
						</label>
						<textarea
							className="form-textarea"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Enter your submission here…"
							style={{ minHeight: 130 }}
							required
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
							className="btn btn-primary"
							disabled={loading}>
							{loading ? (
								<>
									<div
										className="spinner"
										style={{ width: 14, height: 14, borderWidth: 2 }}
									/>{" "}
									Submitting…
								</>
							) : (
								<>
									<RiSendPlaneLine /> Submit
								</>
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

// ── Tasks Page ────────────────────────────────────────────────
export const TasksPage = () => {
	const { user } = useAuth();
	const [events, setEvents] = useState([]);
	const [selectedEvId, setSelectedEvId] = useState("");
	const [tasks, setTasks] = useState([]);
	const [mySubs, setMySubs] = useState([]);
	const [tab, setTab] = useState("browse");
	const [loading, setLoading] = useState(true);
	const [showCreate, setShowCreate] = useState(false);
	const [submitTarget, setSubmitTarget] = useState(null);

	const canCreate = CAN_CREATE.includes(user?.role);

	const loadData = async () => {
		setLoading(true);
		try {
			const [evRes, subRes] = await Promise.all([
				api.get("/api/events?includePrivate=true"),
				api.get("/api/tasks/submissions/me"),
			]);
			const evts = evRes.data?.data || [];
			setEvents(evts);
			setMySubs(subRes.data?.data || []);
			if (evts.length && !selectedEvId) {
				setSelectedEvId(evts[0]._id);
			}
		} catch {
			toast.error("Failed to load data.");
		} finally {
			setLoading(false);
		}
	};

	const loadTasks = async (evId) => {
		if (!evId) return;
		try {
			const res = await api.get(`/api/tasks?eventId=${evId}`);
			setTasks(res.data?.data || []);
		} catch {
			toast.error("Failed to load tasks.");
		}
	};

	useEffect(() => {
		loadData();
	}, []);
	useEffect(() => {
		if (selectedEvId) loadTasks(selectedEvId);
	}, [selectedEvId]);

	const activeTasks = useMemo(
		() => tasks.filter((t) => t.status === "active"),
		[tasks],
	);

	const subStatusMap = useMemo(() => {
		const map = {};
		mySubs.forEach((s) => {
			if (s.task?._id) map[s.task._id] = s.status;
		});
		return map;
	}, [mySubs]);

	if (loading)
		return (
			<div
				style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
				<div className="spinner spinner-lg" />
			</div>
		);

	return (
		<>
			{showCreate && (
				<CreateTaskModal
					events={events}
					onClose={() => setShowCreate(false)}
					onCreated={() => {
						loadTasks(selectedEvId);
						setShowCreate(false);
					}}
				/>
			)}
			{submitTarget && (
				<SubmitTaskModal
					task={submitTarget}
					onClose={() => setSubmitTarget(null)}
					onSubmitted={() => {
						loadData();
						setSubmitTarget(null);
					}}
				/>
			)}

			<div>
				{/* Header */}
				<div className="page-header">
					<div>
						<h1 className="page-title">Tasks</h1>
						<p className="page-subtitle">
							Complete tasks to earn points and climb the leaderboard
						</p>
					</div>
					{canCreate && (
						<button
							className="btn btn-primary"
							onClick={() => setShowCreate(true)}>
							<RiAddLine /> Create Task
						</button>
					)}
				</div>

				{/* Tabs */}
				<div
					className="tab-bar"
					style={{ marginBottom: "1.25rem", maxWidth: 380 }}>
					<button
						className={`tab-btn${tab === "browse" ? " active" : ""}`}
						onClick={() => setTab("browse")}>
						Browse Tasks
					</button>
					<button
						className={`tab-btn${tab === "mine" ? " active" : ""}`}
						onClick={() => setTab("mine")}>
						My Submissions
						{mySubs.length > 0 && (
							<span
								className="badge badge-purple"
								style={{ marginLeft: "0.4rem", fontSize: "0.68rem" }}>
								{mySubs.length}
							</span>
						)}
					</button>
				</div>

				<AnimatePresence mode="wait">
					{tab === "browse" ? (
						<motion.div
							key="browse"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}>
							{/* Event selector */}
							{events.length > 0 && (
								<div style={{ marginBottom: "1.25rem" }}>
									<label
										className="form-label"
										style={{ marginBottom: "0.4rem", display: "block" }}>
										Select Event
									</label>
									<div
										style={{
											display: "flex",
											gap: "0.4rem",
											flexWrap: "wrap",
										}}>
										{events.map((ev) => (
											<button
												key={ev._id}
												className={`btn btn-sm ${selectedEvId === ev._id ? "btn-primary" : "btn-ghost"}`}
												onClick={() => setSelectedEvId(ev._id)}>
												{ev.title}
												<span
													className={`status-badge-${ev.status}`}
													style={{
														marginLeft: "0.35rem",
														fontSize: "0.65rem",
													}}>
													{ev.status}
												</span>
											</button>
										))}
									</div>
								</div>
							)}

							{/* Tasks */}
							{activeTasks.length === 0 ? (
								<div className="card">
									<div className="empty-state">
										<div className="empty-state-icon">
											<RiTaskLine />
										</div>
										<h3>No active tasks</h3>
										<p>Tasks for this event haven't been published yet.</p>
									</div>
								</div>
							) : (
								<motion.div
									style={{
										display: "grid",
										gridTemplateColumns:
											"repeat(auto-fill, minmax(280px, 1fr))",
										gap: "0.875rem",
									}}
									variants={stagger}
									initial="hidden"
									animate="show">
									{tasks.map((task) => (
										<motion.div
											key={task._id}
											className="card"
											variants={fade}
											style={{
												display: "flex",
												flexDirection: "column",
												gap: "0.75rem",
											}}>
											<div
												style={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "flex-start",
													gap: "0.5rem",
												}}>
												<h3
													style={{
														fontWeight: 700,
														fontSize: "0.95rem",
														flex: 1,
													}}>
													{task.title}
												</h3>
												<DiffBadge diff={task.difficulty} />
											</div>
											{task.description && (
												<p
													style={{
														fontSize: "0.83rem",
														color: "var(--text-2)",
														lineHeight: 1.6,
														margin: 0,
													}}>
													{task.description.length > 120
														? task.description.slice(0, 120) + "…"
														: task.description}
												</p>
											)}
											<div
												style={{
													display: "flex",
													gap: "0.5rem",
													flexWrap: "wrap",
													alignItems: "center",
												}}>
												<span
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.3rem",
														fontSize: "0.82rem",
														color: "var(--amber-mid)",
														fontWeight: 700,
														fontFamily: "var(--font-mono)",
													}}>
													<RiCoinsLine /> {task.points} pts
												</span>
												{task.deadline && (
													<span
														style={{
															fontSize: "0.74rem",
															color: "var(--text-3)",
															display: "flex",
															alignItems: "center",
															gap: "0.25rem",
														}}>
														<RiTimeLine /> {prettyDate(task.deadline)}
													</span>
												)}
												<span
													className={`status-badge-${task.status}`}
													style={{ textTransform: "capitalize" }}>
													{task.status}
												</span>
											</div>
											<div style={{ marginTop: "auto" }}>
												{subStatusMap[task._id] ? (
													<span
														className={`status-badge-${subStatusMap[task._id]}`}
														style={{ textTransform: "capitalize" }}>
														Submitted: {subStatusMap[task._id]}
													</span>
												) : task.status === "active" ? (
													<button
														className="btn btn-primary btn-sm"
														style={{ width: "100%" }}
														onClick={() => setSubmitTarget(task)}>
														<RiSendPlaneLine /> Submit Work
													</button>
												) : (
													<span
														style={{
															fontSize: "0.78rem",
															color: "var(--text-3)",
														}}>
														Not accepting submissions
													</span>
												)}
											</div>
										</motion.div>
									))}
								</motion.div>
							)}
						</motion.div>
					) : (
						<motion.div
							key="mine"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}>
							{mySubs.length === 0 ? (
								<div className="card">
									<div className="empty-state">
										<div className="empty-state-icon">
											<RiFileTextLine />
										</div>
										<h3>No submissions yet</h3>
										<p>
											Complete and submit tasks to see your submission history
											here.
										</p>
									</div>
								</div>
							) : (
								<motion.div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr",
										gap: "0.5rem",
									}}
									variants={stagger}
									initial="hidden"
									animate="show">
									{mySubs.map((sub) => (
										<motion.div
											key={sub._id}
											className="data-item"
											variants={fade}>
											<div style={{ flex: 1, minWidth: 0 }}>
												<p
													style={{
														fontWeight: 600,
														fontSize: "0.9rem",
														margin: 0,
														overflow: "hidden",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap",
													}}>
													{sub.task?.title || "Task"}
												</p>
												<p
													style={{
														fontSize: "0.78rem",
														color: "var(--text-3)",
														margin: "0.18rem 0 0",
													}}>
													Submitted {prettyDate(sub.submittedAt)}
													{sub.reviewNotes &&
														` · Note: ${sub.reviewNotes.slice(0, 60)}`}
												</p>
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "0.75rem",
													flexShrink: 0,
												}}>
												{sub.pointsAwarded > 0 && (
													<span
														style={{
															fontFamily: "var(--font-mono)",
															fontWeight: 700,
															fontSize: "0.88rem",
															color: "var(--amber-mid)",
															display: "flex",
															alignItems: "center",
															gap: "0.25rem",
														}}>
														<RiCoinsLine /> +{sub.pointsAwarded}
													</span>
												)}
												<span
													className={`status-badge-${sub.status}`}
													style={{ textTransform: "capitalize" }}>
													{sub.status}
												</span>
											</div>
										</motion.div>
									))}
								</motion.div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};
