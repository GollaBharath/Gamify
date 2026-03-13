import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
	RiCalendarLine,
	RiAddLine,
	RiCloseLine,
	RiTimeLine,
	RiTeamLine,
	RiTrophyLine,
	RiSearchLine,
	RiMapPinLine,
	RiCheckLine,
	RiFilter3Line,
} from "react-icons/ri";
import { toast } from "react-toastify";
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
const STATUSES = ["all", "active", "draft", "paused", "completed", "cancelled"];

const statusBadge = (s) => (
	<span className={`status-badge-${s}`} style={{ textTransform: "capitalize" }}>
		{s}
	</span>
);

const DEFAULT_FORM = {
	title: "",
	description: "",
	startDate: "",
	endDate: "",
	maxParticipants: "",
	isPublic: true,
	tags: "",
};

const fade = {
	hidden: { opacity: 0, y: 14 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

// ── Create Event Modal ────────────────────────────────────────────────────────
const CreateEventModal = ({ onClose, onCreated }) => {
	const [form, setForm] = useState(DEFAULT_FORM);
	const [loading, setLoading] = useState(false);
	const update = (f) => (e) =>
		setForm((p) => ({
			...p,
			[f]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
		}));

	const submit = async (e) => {
		e.preventDefault();
		if (!form.title || !form.startDate || !form.endDate) {
			toast.error("Title and dates are required.");
			return;
		}
		setLoading(true);
		try {
			await api.post("/api/events", {
				title: form.title,
				description: form.description,
				startDate: form.startDate,
				endDate: form.endDate,
				maxParticipants: form.maxParticipants
					? parseInt(form.maxParticipants, 10)
					: undefined,
				isPublic: form.isPublic,
				tags: form.tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
			});
			toast.success("Event created!");
			onCreated();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to create event.");
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
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}>
				<div className="modal-header">
					<h2 className="modal-title">Create Event</h2>
					<button className="btn btn-ghost btn-sm" onClick={onClose}>
						<RiCloseLine />
					</button>
				</div>
				<form onSubmit={submit} className="form-section">
					<div className="form-group">
						<label className="form-label">Title *</label>
						<input
							className="form-input"
							value={form.title}
							onChange={update("title")}
							placeholder="Hackathon Spring 2025"
							required
						/>
					</div>
					<div className="form-group">
						<label className="form-label">Description</label>
						<textarea
							className="form-textarea"
							value={form.description}
							onChange={update("description")}
							placeholder="Describe the event…"
							style={{ minHeight: 80 }}
						/>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Start Date *</label>
							<input
								className="form-input"
								type="datetime-local"
								value={form.startDate}
								onChange={update("startDate")}
								required
							/>
						</div>
						<div className="form-group">
							<label className="form-label">End Date *</label>
							<input
								className="form-input"
								type="datetime-local"
								value={form.endDate}
								onChange={update("endDate")}
								required
							/>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Max Participants (optional)</label>
							<input
								className="form-input"
								type="number"
								value={form.maxParticipants}
								onChange={update("maxParticipants")}
								placeholder="Unlimited"
								min={1}
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Tags (comma-separated)</label>
							<input
								className="form-input"
								value={form.tags}
								onChange={update("tags")}
								placeholder="coding, design, fun"
							/>
						</div>
					</div>
					<label
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.6rem",
							cursor: "pointer",
							fontSize: "0.88rem",
						}}>
						<input
							type="checkbox"
							checked={form.isPublic}
							onChange={update("isPublic")}
							style={{ width: 16, height: 16, accentColor: "var(--purple)" }}
						/>
						<span>Public event (visible to all members)</span>
					</label>
					<div
						style={{
							display: "flex",
							gap: "0.75rem",
							justifyContent: "flex-end",
							marginTop: "0.25rem",
						}}>
						<button className="btn btn-ghost" type="button" onClick={onClose}>
							Cancel
						</button>
						<button
							className="btn btn-primary"
							type="submit"
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
									<RiCheckLine /> Create Event
								</>
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

// ── Event Card ────────────────────────────────────────────────────────────────
const EventCard = ({ event, canEdit }) => {
	const [editing, setEditing] = useState(false);
	const [patchForm, setPatch] = useState({ status: event.status });
	const [saving, setSaving] = useState(false);

	const saveStatus = async () => {
		setSaving(true);
		try {
			await api.patch(`/api/events/${event._id}`, { status: patchForm.status });
			toast.success("Event updated.");
			setEditing(false);
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to update event.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<motion.div className="event-card" variants={fade}>
			<div className="event-card-header">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						gap: "0.75rem",
						marginBottom: "0.5rem",
					}}>
					<h3 style={{ fontWeight: 700, fontSize: "1rem", flex: 1 }}>
						{event.title}
					</h3>
					{statusBadge(event.status)}
				</div>
				{event.tags?.length > 0 && (
					<div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
						{event.tags.map((t) => (
							<span
								key={t}
								className="badge badge-gray"
								style={{ fontSize: "0.7rem" }}>
								{t}
							</span>
						))}
					</div>
				)}
			</div>
			<div className="event-card-body">
				{event.description && (
					<p
						style={{
							fontSize: "0.84rem",
							color: "var(--text-2)",
							lineHeight: 1.65,
							marginBottom: "0.75rem",
						}}>
						{event.description}
					</p>
				)}
				<div
					style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.4rem",
							fontSize: "0.78rem",
							color: "var(--text-3)",
						}}>
						<RiTimeLine /> {prettyDate(event.startDate)} →{" "}
						{prettyDate(event.endDate)}
					</div>
					{event.maxParticipants && (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.4rem",
								fontSize: "0.78rem",
								color: "var(--text-3)",
							}}>
							<RiTeamLine /> {event.currentParticipants ?? 0} /{" "}
							{event.maxParticipants} participants
						</div>
					)}
					{event.rewards?.firstPlace > 0 && (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.4rem",
								fontSize: "0.78rem",
								color: "var(--amber-mid)",
							}}>
							<RiTrophyLine /> 1st: {event.rewards.firstPlace} pts &nbsp;·&nbsp;
							2nd: {event.rewards.secondPlace} pts
						</div>
					)}
				</div>
			</div>
			{canEdit && (
				<div className="event-card-footer">
					{editing ? (
						<>
							<select
								className="form-select"
								style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
								value={patchForm.status}
								onChange={(e) => setPatch({ status: e.target.value })}>
								{["draft", "active", "paused", "completed", "cancelled"].map(
									(s) => (
										<option key={s} value={s}>
											{s}
										</option>
									),
								)}
							</select>
							<div style={{ display: "flex", gap: "0.4rem" }}>
								<button
									className="btn btn-sm btn-primary"
									onClick={saveStatus}
									disabled={saving}>
									{saving ? "…" : "Save"}
								</button>
								<button
									className="btn btn-sm btn-ghost"
									onClick={() => setEditing(false)}>
									Cancel
								</button>
							</div>
						</>
					) : (
						<button
							className="btn btn-sm btn-ghost"
							onClick={() => setEditing(true)}>
							Edit Status
						</button>
					)}
				</div>
			)}
		</motion.div>
	);
};

// ── Events Page ────────────────────────────────────────────────────────────────
export const EventsPage = () => {
	const { user } = useAuth();
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showCreate, setShowCreate] = useState(false);
	const [filter, setFilter] = useState("all");
	const [search, setSearch] = useState("");

	const canCreate = ADMIN_ORG.includes(user?.role);
	const canEdit = ADMIN_ORG.includes(user?.role);

	const load = async () => {
		setLoading(true);
		try {
			const res = await api.get("/api/events?includePrivate=true");
			setEvents(res.data?.data || []);
		} catch {
			toast.error("Failed to load events.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const visible = useMemo(
		() =>
			events.filter((e) => {
				const matchStatus = filter === "all" || e.status === filter;
				const matchSearch =
					!search || e.title.toLowerCase().includes(search.toLowerCase());
				return matchStatus && matchSearch;
			}),
		[events, filter, search],
	);

	return (
		<>
			{showCreate && (
				<CreateEventModal
					onClose={() => setShowCreate(false)}
					onCreated={() => {
						load();
						setShowCreate(false);
					}}
				/>
			)}

			<div>
				{/* Page header */}
				<div className="page-header">
					<div>
						<h1 className="page-title">Events</h1>
						<p className="page-subtitle">Browse ongoing and upcoming events</p>
					</div>
					{canCreate && (
						<button
							className="btn btn-primary"
							onClick={() => setShowCreate(true)}>
							<RiAddLine /> Create Event
						</button>
					)}
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
								fontSize: "0.95rem",
							}}
						/>
						<input
							className="form-input"
							placeholder="Search events…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							style={{ paddingLeft: "2.25rem" }}
						/>
					</div>
					<div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
						{STATUSES.map((s) => (
							<button
								key={s}
								className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-ghost"}`}
								onClick={() => setFilter(s)}
								style={{ textTransform: "capitalize" }}>
								{s}
							</button>
						))}
					</div>
				</div>

				{/* Count */}
				<p
					style={{
						fontSize: "0.8rem",
						color: "var(--text-3)",
						marginBottom: "0.875rem",
					}}>
					{visible.length} event{visible.length !== 1 ? "s" : ""} found
				</p>

				{/* Events grid */}
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
								<RiCalendarLine />
							</div>
							<h3>No events found</h3>
							<p>
								{search || filter !== "all"
									? "Try adjusting your filters."
									: "No events have been created yet."}
							</p>
						</div>
					</div>
				) : (
					<motion.div
						className="events-grid"
						variants={stagger}
						initial="hidden"
						animate="show">
						{visible.map((ev) => (
							<EventCard key={ev._id} event={ev} canEdit={canEdit} />
						))}
					</motion.div>
				)}
			</div>
		</>
	);
};
