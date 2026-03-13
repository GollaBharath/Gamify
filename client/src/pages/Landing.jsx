import { Link } from "react-router-dom";

export const Landing = () => {
	return (
		<section className="hero-wrap">
			<div className="hero-grid" />
			<div className="hero-content">
				<p className="hero-kicker">Community engagement engine</p>
				<h1>Gamify Your Organization With Live Events, Tasks, and Points.</h1>
				<p>
					Run role-based campaigns where admins create events, event staff
					design tasks, moderators validate submissions, and members climb the
					leaderboard with real progression.
				</p>
				<div className="hero-actions">
					<Link className="btn btn-primary" to="/auth">
						Enter Command Center
					</Link>
					<a className="btn btn-secondary" href="#features">
						Explore Features
					</a>
				</div>
			</div>

			<div className="feature-strip" id="features">
				<article>
					<h3>Role System</h3>
					<p>
						Organisation, Admin, Event Staff, Moderator, Member permissions.
					</p>
				</article>
				<article>
					<h3>Task Pipeline</h3>
					<p>Create tasks, submit work, moderate approvals, award points.</p>
				</article>
				<article>
					<h3>Reward Economy</h3>
					<p>Shop catalog, point spending, history ledger, leaderboard.</p>
				</article>
			</div>
		</section>
	);
};
