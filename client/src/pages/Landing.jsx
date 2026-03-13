import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
	RiTrophyLine,
	RiTaskLine,
	RiStore2Line,
	RiTeamLine,
	RiBarChartLine,
	RiShieldCheckLine,
	RiArrowRightLine,
	RiStarLine,
	RiFireLine,
	RiRocketLine,
	RiGithubLine,
	RiTwitterLine,
	RiDiscordLine,
	RiMenuLine,
	RiCloseLine,
	RiCoinsLine,
	RiCalendarLine,
} from "react-icons/ri";
import { api } from "../api/client.js";
import { useAuth } from "../Context/AuthContext.jsx";

// ── Animated counter ─────────────────────────────────────────
const Counter = ({ end, suffix = "", duration = 1800 }) => {
	const [count, setCount] = useState(0);
	const ref = useRef(null);
	const inView = useInView(ref, { once: true });

	useEffect(() => {
		if (!inView) return;
		let cur = 0;
		const step = end / (duration / 16);
		const id = setInterval(() => {
			cur = Math.min(cur + step, end);
			setCount(Math.floor(cur));
			if (cur >= end) clearInterval(id);
		}, 16);
		return () => clearInterval(id);
	}, [inView, end, duration]);

	return (
		<span ref={ref}>
			{count.toLocaleString()}
			{suffix}
		</span>
	);
};

// ── Public Navbar ─────────────────────────────────────────────
const PubNav = () => {
	const { user } = useAuth();
	const [open, setOpen] = useState(false);

	return (
		<nav className="pub-nav">
			<Link to="/" className="pub-nav-brand">
				<div className="logo-icon">G</div>
				Gamify
			</Link>

			<div className="pub-nav-links">
				<a href="#features" className="pub-nav-link">
					Features
				</a>
				<a href="#how" className="pub-nav-link">
					How it works
				</a>
				<a href="#footer" className="pub-nav-link">
					Contact
				</a>
			</div>

			<div className="pub-nav-actions">
				{user ? (
					<Link to="/app" className="btn btn-primary btn-sm">
						Dashboard <RiArrowRightLine />
					</Link>
				) : (
					<>
						<Link to="/auth" className="btn btn-ghost btn-sm">
							Sign in
						</Link>
						<Link to="/auth" className="btn btn-primary btn-sm">
							Get started
						</Link>
					</>
				)}
			</div>

			{/* Mobile toggle */}
			<button
				style={{
					display: "none",
					width: 36,
					height: 36,
					borderRadius: "var(--r-md)",
					background: "var(--bg-3)",
					border: "1px solid var(--border)",
					alignItems: "center",
					justifyContent: "center",
					color: "var(--text-2)",
					fontSize: "1.1rem",
					"@media(maxWidth:768px)": { display: "flex" },
				}}
				className="mobile-hamburger"
				onClick={() => setOpen((o) => !o)}>
				{open ? <RiCloseLine /> : <RiMenuLine />}
			</button>

			{open && (
				<div
					style={{
						position: "fixed",
						top: 64,
						left: 0,
						right: 0,
						zIndex: 99,
						background: "var(--bg-base)",
						borderBottom: "1px solid var(--border)",
						padding: "1.25rem 1.5rem",
						display: "flex",
						flexDirection: "column",
						gap: "0.4rem",
					}}>
					<a
						href="#features"
						className="pub-nav-link"
						onClick={() => setOpen(false)}>
						Features
					</a>
					<a
						href="#how"
						className="pub-nav-link"
						onClick={() => setOpen(false)}>
						How it works
					</a>
					<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
						{user ? (
							<Link
								to="/app"
								className="btn btn-primary"
								style={{ flex: 1 }}
								onClick={() => setOpen(false)}>
								Dashboard
							</Link>
						) : (
							<>
								<Link
									to="/auth"
									className="btn btn-ghost"
									style={{ flex: 1 }}
									onClick={() => setOpen(false)}>
									Sign in
								</Link>
								<Link
									to="/auth"
									className="btn btn-primary"
									style={{ flex: 1 }}
									onClick={() => setOpen(false)}>
									Get started
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

// ── Footer ────────────────────────────────────────────────────
const PubFooter = () => {
	const [email, setEmail] = useState("");
	const [subState, setSubState] = useState("idle"); // idle | loading | done | error

	const subscribe = async (e) => {
		e.preventDefault();
		if (!email) return;
		setSubState("loading");
		try {
			await api.post("/api/newsletter/subscribe", { email });
			setSubState("done");
			setEmail("");
		} catch {
			setSubState("error");
		}
	};

	return (
		<footer className="pub-footer" id="footer">
			<div className="pub-footer-grid">
				<div>
					<div
						className="pub-footer-brand-name"
						style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
						<div
							style={{
								width: 28,
								height: 28,
								borderRadius: 6,
								background:
									"linear-gradient(135deg, var(--purple), var(--cyan-mid))",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "0.8rem",
								fontWeight: 900,
								color: "#fff",
							}}>
							G
						</div>
						Gamify
					</div>
					<p className="pub-footer-desc">
						A modern gamification platform that powers engagement in
						organizations, communities, and teams.
					</p>
					<div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>
						{[RiGithubLine, RiTwitterLine, RiDiscordLine].map((Icon, i) => (
							<button
								key={i}
								className="btn btn-ghost btn-sm"
								style={{ padding: "0.5rem" }}>
								<Icon style={{ fontSize: "1rem" }} />
							</button>
						))}
					</div>
				</div>
				<div>
					<p className="pub-footer-col-title">Product</p>
					<a href="#features" className="pub-footer-link">
						Features
					</a>
					<a href="#how" className="pub-footer-link">
						How it works
					</a>
					<Link to="/auth" className="pub-footer-link">
						Get started
					</Link>
					<Link to="/auth" className="pub-footer-link">
						Sign in
					</Link>
				</div>
				<div>
					<p className="pub-footer-col-title">Newsletter</p>
					<p
						style={{
							fontSize: "0.83rem",
							color: "var(--text-2)",
							marginBottom: "0.875rem",
							lineHeight: 1.6,
						}}>
						Get notified about new features and updates.
					</p>
					{subState === "done" ? (
						<div
							className="alert alert-success"
							style={{ fontSize: "0.82rem", padding: "0.6rem 0.875rem" }}>
							You're subscribed!
						</div>
					) : (
						<form
							onSubmit={subscribe}
							style={{ display: "flex", gap: "0.4rem" }}>
							<input
								className="form-input"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								style={{
									flex: 1,
									fontSize: "0.82rem",
									padding: "0.5rem 0.7rem",
								}}
							/>
							<button
								className="btn btn-primary btn-sm"
								type="submit"
								disabled={subState === "loading"}>
								{subState === "loading" ? "..." : "Join"}
							</button>
						</form>
					)}
					{subState === "error" && (
						<p
							style={{
								fontSize: "0.78rem",
								color: "var(--red-mid)",
								marginTop: "0.4rem",
							}}>
							Failed. Try again.
						</p>
					)}
				</div>
			</div>
			<div className="pub-footer-bottom">
				<span>© {new Date().getFullYear()} Gamify. All rights reserved.</span>
				<span>Built for engaged communities.</span>
			</div>
		</footer>
	);
};

// ── Landing Page ──────────────────────────────────────────────
const features = [
	{
		icon: RiTrophyLine,
		label: "Leaderboards",
		desc: "Real-time rankings fuel healthy competition. Top performers earn recognition and special rewards.",
		color: "var(--amber-mid)",
		bg: "rgba(245,158,11,0.12)",
	},
	{
		icon: RiTaskLine,
		label: "Task Engine",
		desc: "Create tasks with deadlines, point values, and review workflows. Auto-approve or moderate manually.",
		color: "var(--cyan-light)",
		bg: "rgba(6,182,212,0.12)",
	},
	{
		icon: RiStore2Line,
		label: "Points Shop",
		desc: "Let members redeem points for badges, role upgrades, physical items, or fully custom perks.",
		color: "var(--green-light)",
		bg: "rgba(16,185,129,0.12)",
	},
	{
		icon: RiCalendarLine,
		label: "Events",
		desc: "Organize time-bounded competitions with participant caps, reward tiers, and public/private toggles.",
		color: "var(--purple-light)",
		bg: "rgba(124,58,237,0.12)",
	},
	{
		icon: RiShieldCheckLine,
		label: "Roles & Permissions",
		desc: "Fine-grained roles — Member, Moderator, Event Staff, Admin — with auto-computed permission sets.",
		color: "var(--orange-mid)",
		bg: "rgba(249,115,22,0.12)",
	},
	{
		icon: RiBarChartLine,
		label: "Points Analytics",
		desc: "Track full transaction history, spending, task completions, and progression levels in real time.",
		color: "var(--cyan-mid)",
		bg: "rgba(6,182,212,0.1)",
	},
];

const steps = [
	{
		n: "01",
		icon: RiRocketLine,
		title: "Create an Account",
		desc: "Sign up with email or Google in seconds. Your profile starts at Level 1 with 0 points.",
	},
	{
		n: "02",
		icon: RiTaskLine,
		title: "Complete Tasks",
		desc: "Join events, pick up tasks, and submit your work. Earn points instantly on approval.",
	},
	{
		n: "03",
		icon: RiTrophyLine,
		title: "Climb the Leaderboard",
		desc: "Every point counts. Hit milestones for level-ups, special badges, and rank rewards.",
	},
	{
		n: "04",
		icon: RiCoinsLine,
		title: "Spend Your Points",
		desc: "Redeem in the shop for badges, role upgrades, physical items, or exclusive perks.",
	},
];

const fade = {
	hidden: { opacity: 0, y: 18 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

export const Landing = () => {
	const featRef = useRef(null);
	const statsRef = useRef(null);
	const stepsRef = useRef(null);
	const featInView = useInView(featRef, { once: true, margin: "-60px" });
	const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
	const stepsInView = useInView(stepsRef, { once: true, margin: "-60px" });

	return (
		<>
			<PubNav />

			{/* ── HERO ── */}
			<section className="hero-section">
				<div className="hero-grid-bg" />
				<div className="hero-glow" />
				<div
					style={{
						position: "relative",
						zIndex: 1,
						maxWidth: 840,
						width: "100%",
					}}>
					<motion.div
						initial={{ opacity: 0, y: 28 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65 }}>
						<div className="hero-eyebrow">
							<RiFireLine />
							Gamification Platform
						</div>
						<h1 className="hero-title">
							<span className="grad">Level Up</span> Your
							<br />
							Community Engagement
						</h1>
						<p className="hero-desc">
							Turn everyday participation into an exciting competition. Award
							points, run events, manage tasks, and let your community thrive
							with real, meaningful rewards.
						</p>
						<div className="hero-cta">
							<Link to="/auth" className="btn btn-primary btn-lg">
								Get started free <RiArrowRightLine />
							</Link>
							<a href="#features" className="btn btn-ghost btn-lg">
								Explore features
							</a>
						</div>
					</motion.div>

					{/* Floating stat strip */}
					<motion.div
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.45, duration: 0.5 }}
						style={{
							display: "flex",
							justifyContent: "center",
							flexWrap: "wrap",
							gap: "1.5rem 2.5rem",
							marginTop: "3.5rem",
						}}>
						{[
							{
								label: "Points distributed",
								val: "100K+",
								color: "var(--amber-light)",
							},
							{
								label: "Tasks completed",
								val: "50K+",
								color: "var(--cyan-light)",
							},
							{
								label: "Active members",
								val: "5K+",
								color: "var(--purple-light)",
							},
						].map(({ label, val, color }) => (
							<div
								key={label}
								style={{
									display: "flex",
									alignItems: "baseline",
									gap: "0.45rem",
								}}>
								<span
									style={{
										fontWeight: 800,
										fontFamily: "var(--font-mono)",
										fontSize: "1.1rem",
										color,
									}}>
									{val}
								</span>
								<span style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
									{label}
								</span>
							</div>
						))}
					</motion.div>
				</div>
			</section>

			{/* ── FEATURES ── */}
			<section className="features-section" id="features" ref={featRef}>
				<div className="section-header">
					<span className="section-eyebrow">Everything you need</span>
					<h2 className="section-title">A complete gamification toolkit</h2>
					<p className="section-desc">
						From leaderboards to reward shops, every feature is crafted to keep
						your community engaged and motivated.
					</p>
				</div>
				<motion.div
					className="feature-grid"
					variants={stagger}
					initial="hidden"
					animate={featInView ? "show" : "hidden"}>
					{features.map(({ icon: Icon, label, desc, color, bg }) => (
						<motion.article
							key={label}
							className="feature-card"
							variants={fade}>
							<div className="feature-icon" style={{ background: bg }}>
								<Icon style={{ color, fontSize: "1.35rem" }} />
							</div>
							<h3
								style={{
									fontWeight: 700,
									fontSize: "1rem",
									marginBottom: "0.45rem",
								}}>
								{label}
							</h3>
							<p
								style={{
									fontSize: "0.86rem",
									color: "var(--text-2)",
									lineHeight: 1.7,
									margin: 0,
								}}>
								{desc}
							</p>
						</motion.article>
					))}
				</motion.div>
			</section>

			{/* ── STATS BANNER ── */}
			<section className="stats-banner" ref={statsRef}>
				<motion.div
					className="stats-grid"
					variants={stagger}
					initial="hidden"
					animate={statsInView ? "show" : "hidden"}>
					{[
						{ n: 100, suffix: "K+", label: "Points distributed" },
						{ n: 500, suffix: "+", label: "Events hosted" },
						{ n: 50, suffix: "K+", label: "Tasks completed" },
						{ n: 99, suffix: "%", label: "Uptime" },
					].map(({ n, suffix, label }) => (
						<motion.div key={label} variants={fade}>
							<div className="stats-number">
								{statsInView ? (
									<Counter end={n} suffix={suffix} />
								) : (
									`0${suffix}`
								)}
							</div>
							<div className="stats-label">{label}</div>
						</motion.div>
					))}
				</motion.div>
			</section>

			{/* ── HOW IT WORKS ── */}
			<section className="features-section" id="how" ref={stepsRef}>
				<div className="section-header">
					<span className="section-eyebrow">Simple by design</span>
					<h2 className="section-title">How Gamify works</h2>
					<p className="section-desc">
						Set up in minutes. Intuitive for admins, motivating for members.
					</p>
				</div>
				<motion.div
					style={{
						maxWidth: 960,
						margin: "0 auto",
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
						gap: "1rem",
					}}
					variants={stagger}
					initial="hidden"
					animate={stepsInView ? "show" : "hidden"}>
					{steps.map(({ n, icon: Icon, title, desc }) => (
						<motion.div
							key={n}
							className="card"
							variants={fade}
							style={{
								gap: "0.875rem",
								display: "flex",
								flexDirection: "column",
							}}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.75rem",
								}}>
								<span
									style={{
										fontFamily: "var(--font-mono)",
										fontSize: "0.68rem",
										fontWeight: 700,
										color: "var(--purple-light)",
										background: "rgba(124,58,237,0.12)",
										border: "1px solid rgba(124,58,237,0.2)",
										borderRadius: "var(--r-sm)",
										padding: "0.2rem 0.45rem",
									}}>
									{n}
								</span>
								<div
									style={{
										width: 32,
										height: 32,
										borderRadius: "var(--r-sm)",
										background: "rgba(124,58,237,0.12)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<Icon
										style={{ color: "var(--purple-light)", fontSize: "1rem" }}
									/>
								</div>
							</div>
							<div>
								<h3
									style={{
										fontWeight: 700,
										fontSize: "0.95rem",
										marginBottom: "0.4rem",
									}}>
									{title}
								</h3>
								<p
									style={{
										fontSize: "0.83rem",
										color: "var(--text-2)",
										lineHeight: 1.7,
										margin: 0,
									}}>
									{desc}
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</section>

			{/* ── CTA SECTION ── */}
			<motion.section
				initial={{ opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				style={{
					padding: "5.5rem 1.5rem",
					textAlign: "center",
					background:
						"linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.06))",
					borderTop: "1px solid var(--border)",
				}}>
				<div style={{ maxWidth: 600, margin: "0 auto" }}>
					<div className="hero-eyebrow" style={{ margin: "0 auto 1.25rem" }}>
						<RiStarLine /> Start for free
					</div>
					<h2 className="section-title" style={{ marginBottom: "0.875rem" }}>
						Ready to engage your community?
					</h2>
					<p
						style={{
							color: "var(--text-2)",
							lineHeight: 1.75,
							marginBottom: "2rem",
							fontSize: "0.95rem",
						}}>
						Create your account in seconds. No credit card required. Start
						rewarding your members today.
					</p>
					<div className="hero-cta">
						<Link to="/auth" className="btn btn-primary btn-lg">
							Create free account <RiArrowRightLine />
						</Link>
					</div>
				</div>
			</motion.section>

			<PubFooter />
		</>
	);
};
