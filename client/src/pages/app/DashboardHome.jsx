import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	RiCoinsLine,
	RiTrophyLine,
	RiTaskLine,
	RiCalendarLine,
	RiArrowRightLine,
	RiFireLine,
	RiStore2Line,
	RiTimeLine,
	RiCheckLine,
	RiCloseCircleLine,
	RiHistoryLine,
} from "react-icons/ri";
import { api } from "../../api/client.js";
import { useAuth } from "../../Context/AuthContext.jsx";

const ROLE_CLASS = {
	Admin: "role-badge-Admin",
	Organisation: "role-badge-Organisation",
	Moderator: "role-badge-Moderator",
	"Event Staff": "role-badge-EventStaff",
	Member: "role-badge-Member",
};
const prettyDate = (v) =>
	v
		? new Date(v).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: "–";
const prettyTime = (v) =>
	v
		? new Date(v).toLocaleTimeString("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
			})
		: "–";

const txColor = (type) => {
	if (["earned", "awarded", "bonus", "refund"].includes(type))
		return "var(--green-mid)";
	if (["spent", "deducted"].includes(type)) return "var(--red-mid)";
	return "var(--text-2)";
};
const txSign = (type) => (["spent", "deducted"].includes(type) ? "−" : "+");

const LEVEL_CAP = 1000;

const fade = {
	hidden: { opacity: 0, y: 14 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export const DashboardHome = () => {
	const { user, refreshProfile } = useAuth();
	const [events, setEvents] = useState([]);
	const [points, setPoints] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const [evRes, ptRes] = await Promise.all([
					api.get("/api/events?includePrivate=false"),
					api.get("/api/points/history"),
				]);
				const evts = evRes.data?.data || [];
				setEvents(evts.slice(0, 4));

				const txs = ptRes.data?.data || [];
				setPoints(txs.slice(0, 8));

				// Load tasks from first active event
				const activeEv = evts.find((e) => e.status === "active");
				if (activeEv) {
					const tkRes = await api.get(`/api/tasks?eventId=${activeEv._id}`);
					setTasks((tkRes.data?.data || []).slice(0, 5));
				}
				await refreshProfile();
			} catch {
				/* silently fail */
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const level = user?.level ?? 1;
	const pts = user?.points ?? 0;
	const totalPts = user?.totalPointsEarned ?? 0;
	const levelPts = totalPts % LEVEL_CAP;
	const levelPct = Math.min((levelPts / LEVEL_CAP) * 100, 100);

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "50vh",
				}}>
				<div className="spinner spinner-lg" />
			</div>
		);
	}

	return (
		<motion.div
			variants={stagger}
			initial="hidden"
			animate="show"
			style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
			{/* ── WELCOME BANNER ── */}
			<motion.div
				variants={fade}
				style={{
					background:
						"linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.08) 100%)",
					border: "1px solid rgba(124,58,237,0.25)",
					borderRadius: "var(--r-xl)",
					padding: "1.5rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "1rem",
				}}>
				<div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
							marginBottom: "0.25rem",
						}}>
						<RiFireLine style={{ color: "var(--amber-mid)" }} />
						<span
							style={{
								fontSize: "0.8rem",
								color: "var(--text-2)",
								fontWeight: 500,
							}}>
							Welcome back
						</span>
					</div>
					<h1
						style={{
							fontSize: "1.6rem",
							fontWeight: 800,
							letterSpacing: "-0.03em",
							lineHeight: 1.1,
							marginBottom: "0.35rem",
						}}>
						{user?.username}
					</h1>
					<span className={ROLE_CLASS[user?.role] || ROLE_CLASS.Member}>
						{user?.role}
					</span>
				</div>
				{/* Level progress */}
				<div style={{ minWidth: 200 }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "baseline",
							marginBottom: "0.4rem",
						}}>
						<span
							style={{
								fontSize: "0.78rem",
								color: "var(--text-2)",
								fontWeight: 600,
							}}>
							Level {level}
						</span>
						<span
							style={{
								fontSize: "0.72rem",
								fontFamily: "var(--font-mono)",
								color: "var(--text-3)",
							}}>
							{levelPts.toLocaleString()} / {LEVEL_CAP.toLocaleString()} XP
						</span>
					</div>
					<div className="progress-bar">
						<motion.div
							className="progress-fill"
							initial={{ width: 0 }}
							animate={{ width: `${levelPct}%` }}
							transition={{ duration: 1, ease: "easeOut" }}
						/>
					</div>
					<p
						style={{
							fontSize: "0.72rem",
							color: "var(--text-3)",
							marginTop: "0.3rem",
						}}>
						{(LEVEL_CAP - levelPts).toLocaleString()} XP until Level {level + 1}
					</p>
				</div>
			</motion.div>

			{/* ── STAT CARDS ── */}
			<motion.div
				variants={fade}
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
					gap: "0.875rem",
				}}>
				{[
					{
						icon: RiCoinsLine,
						iconClass: "stat-icon-amber",
						value: pts.toLocaleString(),
						label: "Available Points",
						to: "/app/points",
					},
					{
						icon: RiFireLine,
						iconClass: "stat-icon-purple",
						value: totalPts.toLocaleString(),
						label: "Total Earned",
						to: "/app/points",
					},
					{
						icon: RiTrophyLine,
						iconClass: "stat-icon-cyan",
						value: `Lv ${level}`,
						label: "Current Level",
						to: "/app/leaderboard",
					},
					{
						icon: RiCalendarLine,
						iconClass: "stat-icon-green",
						value: events.length,
						label: "Events Available",
						to: "/app/events",
					},
				].map(({ icon: Icon, iconClass, value, label, to }) => (
					<Link
						key={label}
						to={to}
						className="stat-card"
						style={{ textDecoration: "none" }}>
						<div className={`stat-icon ${iconClass}`}>
							<Icon />
						</div>
						<div className="stat-value">{value}</div>
						<div className="stat-label">{label}</div>
					</Link>
				))}
			</motion.div>

			{/* ── TWO COLUMNS ── */}
			<motion.div
				variants={fade}
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
					gap: "1rem",
				}}>
				{/* Recent transactions */}
				<div
					className="card"
					style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<h3
							style={{
								fontWeight: 700,
								fontSize: "0.95rem",
								display: "flex",
								alignItems: "center",
								gap: "0.4rem",
							}}>
							<RiHistoryLine style={{ color: "var(--cyan-mid)" }} /> Recent
							Activity
						</h3>
						<Link
							to="/app/points"
							style={{
								fontSize: "0.78rem",
								color: "var(--purple-light)",
								display: "flex",
								alignItems: "center",
								gap: "0.2rem",
							}}>
							View all <RiArrowRightLine />
						</Link>
					</div>
					{points.length === 0 ? (
						<div className="empty-state" style={{ padding: "2rem 1rem" }}>
							<div className="empty-state-icon">
								<RiCoinsLine />
							</div>
							<h3>No transactions yet</h3>
							<p>Complete tasks to start earning points.</p>
						</div>
					) : (
						<div className="data-list">
							{points.map((tx) => (
								<div
									key={tx._id}
									className="data-item"
									style={{ padding: "0.6rem 0.75rem" }}>
									<div>
										<p
											style={{
												fontSize: "0.84rem",
												fontWeight: 500,
												color: "var(--text-1)",
												margin: 0,
											}}>
											{tx.description || tx.metadata?.reason || tx.source}
										</p>
										<p
											style={{
												fontSize: "0.74rem",
												color: "var(--text-3)",
												margin: 0,
											}}>
											{prettyDate(tx.createdAt)} · {prettyTime(tx.createdAt)}
										</p>
									</div>
									<span
										style={{
											fontFamily: "var(--font-mono)",
											fontWeight: 700,
											fontSize: "0.9rem",
											color: txColor(tx.type),
										}}>
										{txSign(tx.type)}
										{Math.abs(tx.amount)}
									</span>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Active tasks */}
				<div
					className="card"
					style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<h3
							style={{
								fontWeight: 700,
								fontSize: "0.95rem",
								display: "flex",
								alignItems: "center",
								gap: "0.4rem",
							}}>
							<RiTaskLine style={{ color: "var(--purple-light)" }} /> Active
							Tasks
						</h3>
						<Link
							to="/app/tasks"
							style={{
								fontSize: "0.78rem",
								color: "var(--purple-light)",
								display: "flex",
								alignItems: "center",
								gap: "0.2rem",
							}}>
							View all <RiArrowRightLine />
						</Link>
					</div>
					{tasks.length === 0 ? (
						<div className="empty-state" style={{ padding: "2rem 1rem" }}>
							<div className="empty-state-icon">
								<RiTaskLine />
							</div>
							<h3>No active tasks</h3>
							<p>Check back when events are running.</p>
						</div>
					) : (
						<div className="data-list">
							{tasks.map((task) => (
								<div
									key={task._id}
									className="data-item"
									style={{ padding: "0.6rem 0.75rem" }}>
									<div>
										<p
											style={{
												fontSize: "0.84rem",
												fontWeight: 500,
												color: "var(--text-1)",
												margin: 0,
											}}>
											{task.title}
										</p>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "0.4rem",
												marginTop: "0.2rem",
											}}>
											<span
												className={`status-badge-${task.difficulty}`}
												style={{ textTransform: "capitalize" }}>
												{task.difficulty}
											</span>
										</div>
									</div>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.3rem",
											flexShrink: 0,
										}}>
										<RiCoinsLine
											style={{ color: "var(--amber-mid)", fontSize: "0.85rem" }}
										/>
										<span
											style={{
												fontFamily: "var(--font-mono)",
												fontWeight: 700,
												fontSize: "0.85rem",
												color: "var(--amber-light)",
											}}>
											{task.points}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</motion.div>

			{/* ── EVENTS ── */}
			{events.length > 0 && (
				<motion.div
					variants={fade}
					className="card"
					style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<h3
							style={{
								fontWeight: 700,
								fontSize: "0.95rem",
								display: "flex",
								alignItems: "center",
								gap: "0.4rem",
							}}>
							<RiCalendarLine style={{ color: "var(--green-mid)" }} /> Upcoming
							Events
						</h3>
						<Link
							to="/app/events"
							style={{
								fontSize: "0.78rem",
								color: "var(--purple-light)",
								display: "flex",
								alignItems: "center",
								gap: "0.2rem",
							}}>
							View all <RiArrowRightLine />
						</Link>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
							gap: "0.75rem",
						}}>
						{events.map((ev) => (
							<div
								key={ev._id}
								style={{
									background: "var(--bg-base)",
									border: "1px solid var(--border)",
									borderRadius: "var(--r-lg)",
									padding: "1rem",
								}}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "flex-start",
										marginBottom: "0.5rem",
									}}>
									<h4
										style={{
											fontWeight: 600,
											fontSize: "0.88rem",
											flex: 1,
											marginRight: "0.5rem",
										}}>
										{ev.title}
									</h4>
									<span
										className={`status-badge-${ev.status}`}
										style={{ textTransform: "capitalize", flexShrink: 0 }}>
										{ev.status}
									</span>
								</div>
								<p
									style={{
										fontSize: "0.78rem",
										color: "var(--text-3)",
										display: "flex",
										alignItems: "center",
										gap: "0.3rem",
									}}>
									<RiTimeLine /> {prettyDate(ev.startDate)} –{" "}
									{prettyDate(ev.endDate)}
								</p>
							</div>
						))}
					</div>
				</motion.div>
			)}

			{/* ── QUICK ACTIONS ── */}
			<motion.div
				variants={fade}
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
					gap: "0.75rem",
				}}>
				{[
					{
						to: "/app/events",
						icon: RiCalendarLine,
						label: "Browse Events",
						color: "var(--green-mid)",
						bg: "rgba(16,185,129,0.1)",
					},
					{
						to: "/app/tasks",
						icon: RiTaskLine,
						label: "View Tasks",
						color: "var(--purple-light)",
						bg: "rgba(124,58,237,0.1)",
					},
					{
						to: "/app/shop",
						icon: RiStore2Line,
						label: "Visit Shop",
						color: "var(--cyan-light)",
						bg: "rgba(6,182,212,0.1)",
					},
					{
						to: "/app/leaderboard",
						icon: RiTrophyLine,
						label: "Leaderboard",
						color: "var(--amber-mid)",
						bg: "rgba(245,158,11,0.1)",
					},
				].map(({ to, icon: Icon, label, color, bg }) => (
					<Link
						key={label}
						to={to}
						style={{
							background: bg,
							border: `1px solid ${bg.replace("0.1", "0.25")}`,
							borderRadius: "var(--r-lg)",
							padding: "1rem",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "0.5rem",
							textAlign: "center",
							textDecoration: "none",
							transition: "transform 0.15s, box-shadow 0.15s",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "translateY(-2px)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "none";
						}}>
						<Icon style={{ fontSize: "1.3rem", color }} />
						<span
							style={{
								fontSize: "0.8rem",
								fontWeight: 600,
								color: "var(--text-2)",
							}}>
							{label}
						</span>
					</Link>
				))}
			</motion.div>
		</motion.div>
	);
};
