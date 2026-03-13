import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	RiTrophyLine,
	RiMedalLine,
	RiCoinsLine,
	RiFireLine,
	RiArrowUpLine,
	RiMedal2Line,
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

const fade = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

const podiumConfig = [
	{
		medal: "🥇",
		label: "1st Place",
		bg: "linear-gradient(145deg, rgba(245,158,11,0.18), rgba(245,158,11,0.04))",
		border: "rgba(245,158,11,0.35)",
		textColor: "var(--amber-mid)",
	},
	{
		medal: "🥈",
		label: "2nd Place",
		bg: "linear-gradient(145deg, rgba(148,163,184,0.12), rgba(148,163,184,0.02))",
		border: "rgba(148,163,184,0.25)",
		textColor: "#94a3b8",
	},
	{
		medal: "🥉",
		label: "3rd Place",
		bg: "linear-gradient(145deg, rgba(180,83,9,0.14), rgba(180,83,9,0.02))",
		border: "rgba(180,83,9,0.28)",
		textColor: "var(--orange-mid)",
	},
];

export const LeaderboardPage = () => {
	const { user } = useAuth();
	const [board, setBoard] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await api.get("/api/leaderboard?limit=50");
				setBoard(res.data?.data || []);
			} catch {
				/* ignore */
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const myRank = board.find(
		(e) => e._id === user?._id || e.username === user?.username,
	);
	const topThree = board.slice(0, 3);
	const rest = board.slice(3);

	if (loading)
		return (
			<div
				style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
				<div className="spinner spinner-lg" />
			</div>
		);

	return (
		<div>
			{/* Header */}
			<div className="page-header">
				<div>
					<h1 className="page-title">Leaderboard</h1>
					<p className="page-subtitle">Top performers in the community</p>
				</div>
				{myRank && (
					<div
						style={{
							background: "rgba(124,58,237,0.12)",
							border: "1px solid rgba(124,58,237,0.25)",
							borderRadius: "var(--r-lg)",
							padding: "0.625rem 1rem",
							fontSize: "0.85rem",
						}}>
						<span style={{ color: "var(--text-2)" }}>Your rank: </span>
						<span
							style={{
								fontFamily: "var(--font-mono)",
								fontWeight: 700,
								color: "var(--purple-light)",
							}}>
							#{myRank.rank}
						</span>
						<span style={{ color: "var(--text-2)", marginLeft: "0.75rem" }}>
							Points:{" "}
						</span>
						<span
							style={{
								fontFamily: "var(--font-mono)",
								fontWeight: 700,
								color: "var(--amber-mid)",
							}}>
							{(myRank.points ?? 0).toLocaleString()}
						</span>
					</div>
				)}
			</div>

			{board.length === 0 ? (
				<div className="card">
					<div className="empty-state">
						<div className="empty-state-icon">
							<RiTrophyLine />
						</div>
						<h3>No entries yet</h3>
						<p>Complete tasks to earn points and appear here.</p>
					</div>
				</div>
			) : (
				<>
					{/* Podium (top 3) */}
					{topThree.length >= 3 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1.15fr 1fr",
								gap: "0.75rem",
								maxWidth: 480,
								margin: "0 auto 2rem",
								alignItems: "flex-end",
							}}>
							{/* 2nd */}
							<div
								className="podium-slot podium-second"
								style={{
									background: podiumConfig[1].bg,
									borderColor: podiumConfig[1].border,
									order: 0,
								}}>
								<div className="podium-medal">🥈</div>
								<div
									className="podium-name"
									style={{ color: podiumConfig[1].textColor }}>
									{topThree[1]?.username}
								</div>
								<div className="podium-pts">
									{(topThree[1]?.points ?? 0).toLocaleString()} pts
								</div>
								<div>Lv {topThree[1]?.level ?? 1}</div>
							</div>
							{/* 1st */}
							<div
								className="podium-slot podium-first"
								style={{
									background: podiumConfig[0].bg,
									borderColor: podiumConfig[0].border,
									paddingTop: "1.5rem",
									order: -1,
								}}>
								<div className="podium-medal" style={{ fontSize: "1.8rem" }}>
									🥇
								</div>
								<div
									className="podium-name"
									style={{ color: podiumConfig[0].textColor, fontWeight: 800 }}>
									{topThree[0]?.username}
								</div>
								<div
									className="podium-pts"
									style={{ color: "var(--amber-light)" }}>
									{(topThree[0]?.points ?? 0).toLocaleString()} pts
								</div>
								<div>Lv {topThree[0]?.level ?? 1}</div>
							</div>
							{/* 3rd */}
							<div
								className="podium-slot podium-third"
								style={{
									background: podiumConfig[2].bg,
									borderColor: podiumConfig[2].border,
									order: 1,
								}}>
								<div className="podium-medal">🥉</div>
								<div
									className="podium-name"
									style={{ color: podiumConfig[2].textColor }}>
									{topThree[2]?.username}
								</div>
								<div className="podium-pts">
									{(topThree[2]?.points ?? 0).toLocaleString()} pts
								</div>
								<div>Lv {topThree[2]?.level ?? 1}</div>
							</div>
						</motion.div>
					)}

					{/* Full table */}
					<motion.div
						className="card"
						style={{ padding: 0, overflow: "hidden" }}
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}>
						<table className="data-table">
							<thead>
								<tr>
									<th style={{ width: 60 }}>Rank</th>
									<th>Player</th>
									<th style={{ width: 80 }}>Level</th>
									<th>Role</th>
									<th style={{ textAlign: "right" }}>Points</th>
								</tr>
							</thead>
							<motion.tbody variants={stagger} initial="hidden" animate="show">
								{board.map((entry, i) => {
									const isMe =
										entry._id === user?._id ||
										entry.username === user?.username;
									return (
										<motion.tr
											key={entry._id}
											variants={fade}
											style={
												isMe ? { background: "rgba(124,58,237,0.06)" } : {}
											}>
											<td>
												<span
													style={{
														fontFamily: "var(--font-mono)",
														fontWeight: 700,
														color:
															i === 0
																? "var(--amber-mid)"
																: i === 1
																	? "#94a3b8"
																	: i === 2
																		? "var(--orange-mid)"
																		: "var(--text-3)",
													}}>
													{i === 0
														? "🥇"
														: i === 1
															? "🥈"
															: i === 2
																? "🥉"
																: `#${entry.rank}`}
												</span>
											</td>
											<td>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.625rem",
													}}>
													<div
														style={{
															width: 28,
															height: 28,
															borderRadius: "50%",
															flexShrink: 0,
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
														{(entry.username || "?")[0].toUpperCase()}
													</div>
													<span
														style={{
															fontWeight: isMe ? 700 : 500,
															color: isMe
																? "var(--purple-light)"
																: "var(--text-1)",
														}}>
														{entry.username}
														{isMe && (
															<span
																style={{
																	fontSize: "0.7rem",
																	marginLeft: "0.35rem",
																	color: "var(--purple-light)",
																	opacity: 0.7,
																}}>
																(you)
															</span>
														)}
													</span>
												</div>
											</td>
											<td>
												<span
													style={{
														fontFamily: "var(--font-mono)",
														fontWeight: 600,
														color: "var(--cyan-mid)",
														fontSize: "0.85rem",
													}}>
													Lv {entry.level ?? 1}
												</span>
											</td>
											<td>
												<span
													className={
														ROLE_CLASS[entry.role] || ROLE_CLASS.Member
													}>
													{entry.role}
												</span>
											</td>
											<td style={{ textAlign: "right" }}>
												<span
													style={{
														fontFamily: "var(--font-mono)",
														fontWeight: 700,
														color: "var(--amber-mid)",
													}}>
													{(entry.points ?? 0).toLocaleString()}
												</span>
											</td>
										</motion.tr>
									);
								})}
							</motion.tbody>
						</table>
					</motion.div>
				</>
			)}
		</div>
	);
};
