import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../Context/AuthContext.jsx";

const tabs = [
	"overview",
	"events",
	"tasks",
	"moderation",
	"shop",
	"leaderboard",
	"points",
	"users",
	"newsletter",
];

const roles = {
	canCreateEvents: ["Admin", "Organisation"],
	canCreateTasks: ["Event Staff", "Admin", "Organisation"],
	canReview: ["Moderator", "Admin", "Organisation"],
	canAward: ["Moderator", "Admin", "Organisation"],
	canManageShop: ["Admin", "Organisation"],
	canManageUsers: ["Admin", "Organisation"],
};

const prettyDate = (value) => {
	if (!value) return "-";
	return new Date(value).toLocaleString();
};

export const Dashboard = () => {
	const { user, refreshProfile } = useAuth();
	const [activeTab, setActiveTab] = useState("overview");
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");

	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState("");
	const [tasks, setTasks] = useState([]);
	const [taskSubmissions, setTaskSubmissions] = useState([]);
	const [mySubmissions, setMySubmissions] = useState([]);

	const [shopItems, setShopItems] = useState([]);
	const [purchases, setPurchases] = useState([]);
	const [leaderboard, setLeaderboard] = useState([]);
	const [pointHistory, setPointHistory] = useState([]);
	const [users, setUsers] = useState([]);
	const [subscriberCount, setSubscriberCount] = useState(0);

	const [eventForm, setEventForm] = useState({
		title: "",
		description: "",
		startDate: "",
		endDate: "",
	});

	const [taskForm, setTaskForm] = useState({
		eventId: "",
		title: "",
		description: "",
		points: 25,
		status: "active",
	});

	const [submitForm, setSubmitForm] = useState({
		taskId: "",
		content: "",
	});

	const [reviewForm, setReviewForm] = useState({
		submissionId: "",
		status: "approved",
		pointsAwarded: "",
		reviewNotes: "",
	});

	const [shopForm, setShopForm] = useState({
		name: "",
		description: "",
		price: 50,
		category: "virtual",
		stock: -1,
	});

	const [awardForm, setAwardForm] = useState({
		userId: "",
		points: "",
		reason: "",
	});

	const [roleForm, setRoleForm] = useState({
		userId: "",
		role: "Member",
	});

	const [newsletterForm, setNewsletterForm] = useState({
		email: "",
		subject: "",
		content: "",
	});

	const can = useMemo(() => {
		const currentRole = user?.role || "Member";
		return {
			createEvents: roles.canCreateEvents.includes(currentRole),
			createTasks: roles.canCreateTasks.includes(currentRole),
			review: roles.canReview.includes(currentRole),
			award: roles.canAward.includes(currentRole),
			manageShop: roles.canManageShop.includes(currentRole),
			manageUsers: roles.canManageUsers.includes(currentRole),
		};
	}, [user]);

	const safeRun = async (action, successMessage = "Done") => {
		setError("");
		setStatus("");
		try {
			await action();
			setStatus(successMessage);
		} catch (requestError) {
			setError(
				requestError?.response?.data?.message ||
					requestError?.response?.data?.error ||
					"Request failed",
			);
		}
	};

	const loadEvents = async () => {
		const response = await api.get("/api/events?includePrivate=true");
		const rows = response.data?.data || [];
		setEvents(rows);
		if (rows.length && !selectedEvent) {
			setSelectedEvent(rows[0]._id);
			setTaskForm((prev) => ({ ...prev, eventId: rows[0]._id }));
		}
	};

	const loadTasks = async (eventId) => {
		if (!eventId) return;
		const response = await api.get(`/api/tasks?eventId=${eventId}`);
		setTasks(response.data?.data || []);
	};

	const loadMySubmissions = async () => {
		const response = await api.get("/api/tasks/submissions/me");
		setMySubmissions(response.data?.data || []);
	};

	const loadShopItems = async () => {
		const response = await api.get("/api/shop/items");
		setShopItems(response.data?.data || []);
	};

	const loadPurchases = async () => {
		const response = await api.get("/api/shop/purchases/me");
		setPurchases(response.data?.data || []);
	};

	const loadLeaderboard = async () => {
		const response = await api.get("/api/leaderboard?limit=25");
		setLeaderboard(response.data?.data || []);
	};

	const loadPointHistory = async () => {
		const response = await api.get("/api/points/history");
		setPointHistory(response.data?.data || []);
	};

	const loadUsers = async () => {
		if (!can.manageUsers && !can.award) return;
		const response = await api.get("/api/users");
		setUsers(response.data?.data || []);
	};

	const loadSubscriberCount = async () => {
		const response = await api.get("/api/newsletter/count");
		setSubscriberCount(response.data?.count || 0);
	};

	const boot = async () => {
		await safeRun(async () => {
			await Promise.all([
				refreshProfile(),
				loadEvents(),
				loadShopItems(),
				loadPurchases(),
				loadLeaderboard(),
				loadPointHistory(),
				loadMySubmissions(),
				loadSubscriberCount(),
			]);
			await loadUsers();
		}, "Data synchronized");
	};

	useEffect(() => {
		boot();
	}, []);

	useEffect(() => {
		if (selectedEvent) {
			safeRun(() => loadTasks(selectedEvent), "Tasks refreshed");
		}
	}, [selectedEvent]);

	const requestTaskSubmissions = async (taskId) => {
		await safeRun(async () => {
			const response = await api.get(`/api/tasks/${taskId}/submissions`);
			setTaskSubmissions(response.data?.data || []);
		}, "Fetched submissions");
	};

	const createEvent = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			await api.post("/api/events", eventForm);
			setEventForm({ title: "", description: "", startDate: "", endDate: "" });
			await loadEvents();
		}, "Event created");
	};

	const createTask = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			await api.post("/api/tasks", {
				...taskForm,
				points: parseInt(taskForm.points, 10),
			});
			setTaskForm((prev) => ({
				...prev,
				title: "",
				description: "",
				points: 25,
			}));
			await loadTasks(taskForm.eventId);
		}, "Task created");
	};

	const submitTask = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			await api.post(`/api/tasks/${submitForm.taskId}/submissions`, {
				content: submitForm.content,
			});
			setSubmitForm({ taskId: "", content: "" });
			await loadMySubmissions();
		}, "Task submitted");
	};

	const reviewSubmission = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			const payload = {
				status: reviewForm.status,
				reviewNotes: reviewForm.reviewNotes,
			};
			if (reviewForm.pointsAwarded) {
				payload.pointsAwarded = parseInt(reviewForm.pointsAwarded, 10);
			}

			await api.patch(
				`/api/tasks/submissions/${reviewForm.submissionId}/review`,
				payload,
			);
			setReviewForm({
				submissionId: "",
				status: "approved",
				pointsAwarded: "",
				reviewNotes: "",
			});
			await loadMySubmissions();
			await loadPointHistory();
		}, "Submission reviewed");
	};

	const createShopItem = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			await api.post("/api/shop/items", {
				...shopForm,
				price: parseInt(shopForm.price, 10),
				stock: parseInt(shopForm.stock, 10),
			});
			setShopForm({
				name: "",
				description: "",
				price: 50,
				category: "virtual",
				stock: -1,
			});
			await loadShopItems();
		}, "Shop item created");
	};

	const purchaseItem = async (itemId) => {
		await safeRun(async () => {
			await api.post(`/api/shop/items/${itemId}/purchase`);
			await Promise.all([
				loadPurchases(),
				loadShopItems(),
				loadPointHistory(),
				refreshProfile(),
			]);
		}, "Item purchased");
	};

	const awardPoints = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			await api.post("/api/points/award", {
				userId: awardForm.userId,
				points: parseInt(awardForm.points, 10),
				reason: awardForm.reason,
			});
			setAwardForm({ userId: "", points: "", reason: "" });
			await Promise.all([loadPointHistory(), loadLeaderboard()]);
		}, "Points awarded");
	};

	const updateRole = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			await api.patch(`/api/users/${roleForm.userId}/role`, {
				role: roleForm.role,
			});
			await loadUsers();
		}, "Role updated");
	};

	const subscribeNewsletter = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			await api.post("/api/newsletter/subscribe", {
				email: newsletterForm.email,
			});
			await loadSubscriberCount();
		}, "Subscribed to newsletter");
	};

	const sendNewsletter = async (event) => {
		event.preventDefault();
		await safeRun(async () => {
			await api.post("/api/newsletter/send", {
				subject: newsletterForm.subject,
				content: newsletterForm.content,
			});
			await loadSubscriberCount();
		}, "Newsletter sent");
	};

	const renderOverview = () => (
		<section className="panel-grid three">
			<article className="panel card-stat">
				<p>Role</p>
				<h3>{user?.role}</h3>
			</article>
			<article className="panel card-stat">
				<p>Current Points</p>
				<h3>{user?.points || 0}</h3>
			</article>
			<article className="panel card-stat">
				<p>Level</p>
				<h3>{user?.level || 1}</h3>
			</article>
			<article className="panel">
				<h4>Events</h4>
				<p>{events.length} total events loaded</p>
			</article>
			<article className="panel">
				<h4>Shop</h4>
				<p>{shopItems.length} listed items</p>
			</article>
			<article className="panel">
				<h4>Subscribers</h4>
				<p>{subscriberCount} active newsletter members</p>
			</article>
		</section>
	);

	const renderEvents = () => (
		<section className="panel-grid two">
			<article className="panel">
				<h3>Event Feed</h3>
				<ul className="list">
					{events.map((eventItem) => (
						<li key={eventItem._id}>
							<button
								type="button"
								className={selectedEvent === eventItem._id ? "active" : ""}
								onClick={() => setSelectedEvent(eventItem._id)}>
								<strong>{eventItem.title}</strong>
								<span>{eventItem.status}</span>
								<small>{prettyDate(eventItem.startDate)}</small>
							</button>
						</li>
					))}
				</ul>
			</article>

			{can.createEvents && (
				<article className="panel">
					<h3>Create Event</h3>
					<form className="form-grid" onSubmit={createEvent}>
						<label>
							Title
							<input
								value={eventForm.title}
								onChange={(event) =>
									setEventForm((prev) => ({
										...prev,
										title: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Description
							<textarea
								value={eventForm.description}
								onChange={(event) =>
									setEventForm((prev) => ({
										...prev,
										description: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Start Date
							<input
								type="datetime-local"
								value={eventForm.startDate}
								onChange={(event) =>
									setEventForm((prev) => ({
										...prev,
										startDate: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							End Date
							<input
								type="datetime-local"
								value={eventForm.endDate}
								onChange={(event) =>
									setEventForm((prev) => ({
										...prev,
										endDate: event.target.value,
									}))
								}
							/>
						</label>
						<button className="btn btn-primary" type="submit">
							Create Event
						</button>
					</form>
				</article>
			)}
		</section>
	);

	const renderTasks = () => (
		<section className="panel-grid two">
			<article className="panel">
				<h3>Tasks</h3>
				<ul className="list">
					{tasks.map((task) => (
						<li key={task._id}>
							<div>
								<strong>{task.title}</strong>
								<span>{task.points} points</span>
								<small>{task.status}</small>
							</div>
							{can.review && (
								<button
									className="btn btn-secondary"
									onClick={() => requestTaskSubmissions(task._id)}
									type="button">
									View Submissions
								</button>
							)}
						</li>
					))}
				</ul>
			</article>

			<article className="panel">
				<h3>Submit Task</h3>
				<form className="form-grid" onSubmit={submitTask}>
					<label>
						Task
						<select
							value={submitForm.taskId}
							onChange={(event) =>
								setSubmitForm((prev) => ({
									...prev,
									taskId: event.target.value,
								}))
							}>
							<option value="">Select task</option>
							{tasks.map((task) => (
								<option key={task._id} value={task._id}>
									{task.title}
								</option>
							))}
						</select>
					</label>
					<label>
						Submission Content
						<textarea
							value={submitForm.content}
							onChange={(event) =>
								setSubmitForm((prev) => ({
									...prev,
									content: event.target.value,
								}))
							}
						/>
					</label>
					<button className="btn btn-primary" type="submit">
						Submit
					</button>
				</form>
			</article>

			{can.createTasks && (
				<article className="panel">
					<h3>Create Task</h3>
					<form className="form-grid" onSubmit={createTask}>
						<label>
							Event
							<select
								value={taskForm.eventId}
								onChange={(event) =>
									setTaskForm((prev) => ({
										...prev,
										eventId: event.target.value,
									}))
								}>
								<option value="">Select event</option>
								{events.map((eventItem) => (
									<option key={eventItem._id} value={eventItem._id}>
										{eventItem.title}
									</option>
								))}
							</select>
						</label>
						<label>
							Task Title
							<input
								value={taskForm.title}
								onChange={(event) =>
									setTaskForm((prev) => ({
										...prev,
										title: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Description
							<textarea
								value={taskForm.description}
								onChange={(event) =>
									setTaskForm((prev) => ({
										...prev,
										description: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Points
							<input
								type="number"
								value={taskForm.points}
								onChange={(event) =>
									setTaskForm((prev) => ({
										...prev,
										points: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Status
							<select
								value={taskForm.status}
								onChange={(event) =>
									setTaskForm((prev) => ({
										...prev,
										status: event.target.value,
									}))
								}>
								<option value="active">active</option>
								<option value="draft">draft</option>
								<option value="inactive">inactive</option>
							</select>
						</label>
						<button className="btn btn-primary" type="submit">
							Create Task
						</button>
					</form>
				</article>
			)}

			<article className="panel">
				<h3>My Submissions</h3>
				<ul className="list">
					{mySubmissions.map((submission) => (
						<li key={submission._id}>
							<strong>{submission.task?.title || "Task"}</strong>
							<span>{submission.status}</span>
							<small>{submission.pointsAwarded || 0} pts</small>
						</li>
					))}
				</ul>
			</article>
		</section>
	);

	const renderModeration = () => (
		<section className="panel-grid two">
			<article className="panel">
				<h3>Task Submissions</h3>
				<ul className="list">
					{taskSubmissions.map((submission) => (
						<li key={submission._id}>
							<div>
								<strong>{submission.user?.username || "Member"}</strong>
								<span>{submission.status}</span>
								<small>{submission.content?.slice(0, 80)}</small>
							</div>
							{can.review && (
								<button
									className="btn btn-secondary"
									type="button"
									onClick={() =>
										setReviewForm((prev) => ({
											...prev,
											submissionId: submission._id,
										}))
									}>
									Prepare Review
								</button>
							)}
						</li>
					))}
				</ul>
			</article>

			{can.review && (
				<article className="panel">
					<h3>Review Submission</h3>
					<form className="form-grid" onSubmit={reviewSubmission}>
						<label>
							Submission ID
							<input
								value={reviewForm.submissionId}
								onChange={(event) =>
									setReviewForm((prev) => ({
										...prev,
										submissionId: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Decision
							<select
								value={reviewForm.status}
								onChange={(event) =>
									setReviewForm((prev) => ({
										...prev,
										status: event.target.value,
									}))
								}>
								<option value="approved">approved</option>
								<option value="rejected">rejected</option>
							</select>
						</label>
						<label>
							Points Awarded (optional)
							<input
								type="number"
								value={reviewForm.pointsAwarded}
								onChange={(event) =>
									setReviewForm((prev) => ({
										...prev,
										pointsAwarded: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Review Notes
							<textarea
								value={reviewForm.reviewNotes}
								onChange={(event) =>
									setReviewForm((prev) => ({
										...prev,
										reviewNotes: event.target.value,
									}))
								}
							/>
						</label>
						<button className="btn btn-primary" type="submit">
							Submit Review
						</button>
					</form>
				</article>
			)}
		</section>
	);

	const renderShop = () => (
		<section className="panel-grid two">
			<article className="panel">
				<h3>Catalog</h3>
				<ul className="list">
					{shopItems.map((item) => (
						<li key={item._id}>
							<div>
								<strong>{item.name}</strong>
								<span>{item.price} points</span>
								<small>{item.category}</small>
							</div>
							<button
								className="btn btn-secondary"
								type="button"
								onClick={() => purchaseItem(item._id)}>
								Purchase
							</button>
						</li>
					))}
				</ul>
			</article>

			<article className="panel">
				<h3>My Purchases</h3>
				<ul className="list">
					{purchases.map((purchase) => (
						<li key={purchase._id}>
							<strong>{purchase.item?.name || "Item"}</strong>
							<span>{purchase.status}</span>
							<small>{purchase.pointsSpent} points</small>
						</li>
					))}
				</ul>
			</article>

			{can.manageShop && (
				<article className="panel">
					<h3>Create Shop Item</h3>
					<form className="form-grid" onSubmit={createShopItem}>
						<label>
							Name
							<input
								value={shopForm.name}
								onChange={(event) =>
									setShopForm((prev) => ({ ...prev, name: event.target.value }))
								}
							/>
						</label>
						<label>
							Description
							<textarea
								value={shopForm.description}
								onChange={(event) =>
									setShopForm((prev) => ({
										...prev,
										description: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Price
							<input
								type="number"
								value={shopForm.price}
								onChange={(event) =>
									setShopForm((prev) => ({
										...prev,
										price: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Category
							<select
								value={shopForm.category}
								onChange={(event) =>
									setShopForm((prev) => ({
										...prev,
										category: event.target.value,
									}))
								}>
								<option value="virtual">virtual</option>
								<option value="badge">badge</option>
								<option value="feature">feature</option>
								<option value="physical">physical</option>
							</select>
						</label>
						<label>
							Stock
							<input
								type="number"
								value={shopForm.stock}
								onChange={(event) =>
									setShopForm((prev) => ({
										...prev,
										stock: event.target.value,
									}))
								}
							/>
						</label>
						<button className="btn btn-primary" type="submit">
							Publish Item
						</button>
					</form>
				</article>
			)}
		</section>
	);

	const renderLeaderboard = () => (
		<section className="panel">
			<h3>Leaderboard</h3>
			<ol className="rank-list">
				{leaderboard.map((entry) => (
					<li key={entry._id}>
						<span>#{entry.rank}</span>
						<strong>{entry.username}</strong>
						<small>{entry.role}</small>
						<b>{entry.points} pts</b>
					</li>
				))}
			</ol>
		</section>
	);

	const renderPoints = () => (
		<section className="panel-grid two">
			<article className="panel">
				<h3>Point Ledger</h3>
				<ul className="list">
					{pointHistory.map((transaction) => (
						<li key={transaction._id}>
							<div>
								<strong>{transaction.type}</strong>
								<span>{transaction.source}</span>
								<small>{prettyDate(transaction.createdAt)}</small>
							</div>
							<b>{transaction.amount}</b>
						</li>
					))}
				</ul>
			</article>

			{can.award && (
				<article className="panel">
					<h3>Award Points</h3>
					<form className="form-grid" onSubmit={awardPoints}>
						<label>
							User
							<select
								value={awardForm.userId}
								onChange={(event) =>
									setAwardForm((prev) => ({
										...prev,
										userId: event.target.value,
									}))
								}>
								<option value="">Select user</option>
								{users.map((u) => (
									<option key={u._id} value={u._id}>
										{u.username} ({u.role})
									</option>
								))}
							</select>
						</label>
						<label>
							Points
							<input
								type="number"
								value={awardForm.points}
								onChange={(event) =>
									setAwardForm((prev) => ({
										...prev,
										points: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							Reason
							<textarea
								value={awardForm.reason}
								onChange={(event) =>
									setAwardForm((prev) => ({
										...prev,
										reason: event.target.value,
									}))
								}
							/>
						</label>
						<button className="btn btn-primary" type="submit">
							Award
						</button>
					</form>
				</article>
			)}
		</section>
	);

	const renderUsers = () => (
		<section className="panel-grid two">
			<article className="panel">
				<h3>User Roster</h3>
				<ul className="list">
					{users.map((u) => (
						<li key={u._id}>
							<div>
								<strong>{u.username}</strong>
								<span>{u.role}</span>
								<small>{u.points} pts</small>
							</div>
							<code>{u.email}</code>
						</li>
					))}
				</ul>
			</article>

			{can.manageUsers && (
				<article className="panel">
					<h3>Update Role</h3>
					<form className="form-grid" onSubmit={updateRole}>
						<label>
							User
							<select
								value={roleForm.userId}
								onChange={(event) =>
									setRoleForm((prev) => ({
										...prev,
										userId: event.target.value,
									}))
								}>
								<option value="">Select user</option>
								{users.map((u) => (
									<option key={u._id} value={u._id}>
										{u.username}
									</option>
								))}
							</select>
						</label>
						<label>
							Role
							<select
								value={roleForm.role}
								onChange={(event) =>
									setRoleForm((prev) => ({ ...prev, role: event.target.value }))
								}>
								<option value="Member">Member</option>
								<option value="Moderator">Moderator</option>
								<option value="Event Staff">Event Staff</option>
								<option value="Admin">Admin</option>
							</select>
						</label>
						<button className="btn btn-primary" type="submit">
							Update
						</button>
					</form>
				</article>
			)}
		</section>
	);

	const renderNewsletter = () => (
		<section className="panel-grid two">
			<article className="panel">
				<h3>Subscribe</h3>
				<form className="form-grid" onSubmit={subscribeNewsletter}>
					<label>
						Email
						<input
							type="email"
							value={newsletterForm.email}
							onChange={(event) =>
								setNewsletterForm((prev) => ({
									...prev,
									email: event.target.value,
								}))
							}
						/>
					</label>
					<button className="btn btn-primary" type="submit">
						Subscribe
					</button>
				</form>
				<p className="meta">Current subscribers: {subscriberCount}</p>
			</article>

			<article className="panel">
				<h3>Send Newsletter</h3>
				<form className="form-grid" onSubmit={sendNewsletter}>
					<label>
						Subject
						<input
							value={newsletterForm.subject}
							onChange={(event) =>
								setNewsletterForm((prev) => ({
									...prev,
									subject: event.target.value,
								}))
							}
						/>
					</label>
					<label>
						Content
						<textarea
							value={newsletterForm.content}
							onChange={(event) =>
								setNewsletterForm((prev) => ({
									...prev,
									content: event.target.value,
								}))
							}
						/>
					</label>
					<button className="btn btn-secondary" type="submit">
						Send
					</button>
				</form>
			</article>
		</section>
	);

	const tabContent = {
		overview: renderOverview(),
		events: renderEvents(),
		tasks: renderTasks(),
		moderation: renderModeration(),
		shop: renderShop(),
		leaderboard: renderLeaderboard(),
		points: renderPoints(),
		users: renderUsers(),
		newsletter: renderNewsletter(),
	};

	return (
		<main className="dashboard-wrap">
			<header className="dashboard-head">
				<div>
					<p className="hero-kicker">Ops Console</p>
					<h1>Welcome, {user?.username}</h1>
				</div>
				<div className="pill-stack">
					<span>Role: {user?.role}</span>
					<span>Points: {user?.points || 0}</span>
				</div>
			</header>

			<section className="tab-strip">
				{tabs.map((tab) => (
					<button
						className={activeTab === tab ? "active" : ""}
						key={tab}
						onClick={() => setActiveTab(tab)}
						type="button">
						{tab}
					</button>
				))}
			</section>

			{status && <p className="status status-ok">{status}</p>}
			{error && <p className="status status-error">{error}</p>}

			{tabContent[activeTab]}
		</main>
	);
};
