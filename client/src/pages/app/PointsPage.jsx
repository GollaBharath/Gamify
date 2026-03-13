import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	RiCoinsLine,
	RiArrowUpLine,
	RiArrowDownLine,
	RiHistoryLine,
	RiFilterLine,
} from "react-icons/ri";
import { api } from "../../api/client.js";
import { useAuth } from "../../Context/AuthContext.jsx";

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

const TX_TYPES = [
	"all",
	"earned",
	"spent",
	"awarded",
	"deducted",
	"bonus",
	"refund",
];

const isPositive = (t) => ["earned", "awarded", "bonus", "refund"].includes(t);

const TypeBadge = ({ type }) => {
	const pos = isPositive(type);
	return (
		<span
			style={{
				background: pos ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
				color: pos ? "var(--green-light)" : "#fca5a5",
				border: `1px solid ${pos ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
				borderRadius: "9999px",
				padding: "0.2rem 0.6rem",
				fontSize: "0.72rem",
				fontWeight: 700,
				textTransform: "capitalize",
			}}>
			{type}
		</span>
	);
};

const SourceBadge = ({ source }) => (
	<span
		style={{
			background: "var(--bg-4)",
			border: "1px solid var(--border)",
			borderRadius: "9999px",
			padding: "0.18rem 0.55rem",
			fontSize: "0.7rem",
			color: "var(--text-3)",
			textTransform: "capitalize",
		}}>
		{source?.replace(/_/g, " ")}
	</span>
);

const fade = {
	hidden: { opacity: 0, y: 10 },
	show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

const LEVEL_CAP = 1000;

export const PointsPage = () => {
	const { user } = useAuth();
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [typeFilter, setType] = useState("all");

	useEffect(() => {
		const load = async () => {
			try {
				const res = await api.get("/api/points/history");
				setHistory(res.data?.data || []);
			} catch {
				/* ignore */
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const visible =
		typeFilter === "all"
			? history
			: history.filter((t) => t.type === typeFilter);

	const totalEarned = history
		.filter((t) => isPositive(t.type))
		.reduce((s, t) => s + t.amount, 0);
	const totalSpent = history
		.filter((t) => !isPositive(t.type))
		.reduce((s, t) => s + Math.abs(t.amount), 0);
	const balance = user?.points ?? 0;
	const level = user?.level ?? 1;
	const levelPts = (user?.totalPointsEarned ?? 0) % LEVEL_CAP;
	const levelPct = Math.min((levelPts / LEVEL_CAP) * 100, 100);

	return (
		<div>
			{/* Header */}
			<div className="page-header">
				<div>
					<h1 className="page-title">Points</h1>
					<p className="page-subtitle">
						Your full transaction history and balance
					</p>
				</div>
			</div>

			{/* Stats row */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
					gap: "0.875rem",
					marginBottom: "1.5rem",
				}}>
				<div className="stat-card">
					<div className="stat-icon stat-icon-amber">
						<RiCoinsLine />
					</div>
					<div className="stat-value">{balance.toLocaleString()}</div>
					<div className="stat-label">Available</div>
				</div>
				<div className="stat-card">
					<div className="stat-icon stat-icon-green">
						<RiArrowUpLine />
					</div>
					<div className="stat-value">{totalEarned.toLocaleString()}</div>
					<div className="stat-label">Total earned (session)</div>
				</div>
				<div className="stat-card">
					<div
						className="stat-icon stat-icon-red"
						style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
						<RiArrowDownLine />
					</div>
					<div className="stat-value">{totalSpent.toLocaleString()}</div>
					<div className="stat-label">Total spent (session)</div>
				</div>
				<div className="stat-card">
					<div className="stat-icon stat-icon-purple">
						<RiCoinsLine />
					</div>
					<div className="stat-value">Lv {level}</div>
					<div className="stat-label">Current Level</div>
				</div>
			</div>

			{/* Level progress */}
			<div className="card" style={{ marginBottom: "1.5rem" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "baseline",
						marginBottom: "0.5rem",
					}}>
					<span style={{ fontWeight: 700 }}>
						Level {level} → {level + 1}
					</span>
					<span
						style={{
							fontFamily: "var(--font-mono)",
							fontSize: "0.82rem",
							color: "var(--text-3)",
						}}>
						{levelPts.toLocaleString()} / {LEVEL_CAP.toLocaleString()} XP
					</span>
				</div>
				<div className="progress-bar" style={{ height: 8 }}>
					<motion.div
						className="progress-fill"
						initial={{ width: 0 }}
						animate={{ width: `${levelPct}%` }}
						transition={{ duration: 1.2, ease: "easeOut" }}
					/>
				</div>
				<p
					style={{
						fontSize: "0.78rem",
						color: "var(--text-3)",
						marginTop: "0.375rem",
					}}>
					{(LEVEL_CAP - levelPts).toLocaleString()} XP until level {level + 1}
				</p>
			</div>

			{/* Transaction list */}
			<div
				className="card"
				style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
				{/* Filter bar */}
				<div
					style={{
						display: "flex",
						gap: "0.35rem",
						flexWrap: "wrap",
						alignItems: "center",
					}}>
					<RiFilterLine
						style={{ color: "var(--text-3)", marginRight: "0.25rem" }}
					/>
					{TX_TYPES.map((t) => (
						<button
							key={t}
							className={`btn btn-sm ${typeFilter === t ? "btn-primary" : "btn-ghost"}`}
							onClick={() => setType(t)}
							style={{ textTransform: "capitalize" }}>
							{t}
						</button>
					))}
				</div>

				<p style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
					{visible.length} transaction{visible.length !== 1 ? "s" : ""}
				</p>

				{loading ? (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							padding: "2rem",
						}}>
						<div className="spinner spinner-lg" />
					</div>
				) : visible.length === 0 ? (
					<div className="empty-state">
						<div className="empty-state-icon">
							<RiHistoryLine />
						</div>
						<h3>No transactions</h3>
						<p>
							{typeFilter !== "all"
								? "None of this type yet."
								: "Complete tasks to start earning points."}
						</p>
					</div>
				) : (
					<motion.div
						className="data-list"
						variants={stagger}
						initial="hidden"
						animate="show">
						{visible.map((tx) => (
							<motion.div key={tx._id} className="data-item" variants={fade}>
								<div style={{ flex: 1, minWidth: 0 }}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.5rem",
											flexWrap: "wrap",
											marginBottom: "0.2rem",
										}}>
										<span
											style={{
												fontWeight: 600,
												fontSize: "0.88rem",
												color: "var(--text-1)",
											}}>
											{tx.description ||
												tx.metadata?.reason ||
												(tx.metadata?.taskTitle
													? `Task: ${tx.metadata.taskTitle}`
													: tx.source)}
										</span>
										<TypeBadge type={tx.type} />
										<SourceBadge source={tx.source} />
									</div>
									<span style={{ fontSize: "0.74rem", color: "var(--text-3)" }}>
										{prettyDate(tx.createdAt)} at {prettyTime(tx.createdAt)}
										{tx.metadata?.eventTitle && ` · ${tx.metadata.eventTitle}`}
									</span>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-end",
										gap: "0.15rem",
										flexShrink: 0,
									}}>
									<span
										style={{
											fontFamily: "var(--font-mono)",
											fontWeight: 700,
											fontSize: "0.95rem",
											color: isPositive(tx.type)
												? "var(--green-mid)"
												: "var(--red-mid)",
										}}>
										{isPositive(tx.type) ? "+" : "−"}
										{Math.abs(tx.amount).toLocaleString()}
									</span>
									<span
										style={{
											fontSize: "0.72rem",
											color: "var(--text-3)",
											fontFamily: "var(--font-mono)",
										}}>
										bal: {tx.balance?.toLocaleString() ?? "–"}
									</span>
								</div>
							</motion.div>
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
};
