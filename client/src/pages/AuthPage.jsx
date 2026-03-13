import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

const initialForm = {
	username: "",
	email: "",
	password: "",
};

export const AuthPage = () => {
	const navigate = useNavigate();
	const { user, login, register, isAuthenticating } = useAuth();
	const [mode, setMode] = useState("login");
	const [form, setForm] = useState(initialForm);
	const [error, setError] = useState("");

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	const onSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (
			!form.email ||
			!form.password ||
			(mode === "register" && !form.username)
		) {
			setError("Please fill all required fields.");
			return;
		}

		const action = mode === "login" ? login : register;
		const payload =
			mode === "login"
				? { email: form.email, password: form.password }
				: {
						username: form.username,
						email: form.email,
						password: form.password,
					};

		const result = await action(payload);
		if (!result.success) {
			setError(result.message || "Request failed");
			return;
		}

		navigate("/dashboard");
	};

	const startGoogle = () => {
		const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
		window.location.href = `${apiUrl}/api/auth/google`;
	};

	return (
		<section className="auth-wrap">
			<div className="auth-card">
				<div className="auth-head">
					<p>Gamify Access</p>
					<h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
				</div>

				<div className="auth-toggle">
					<button
						className={mode === "login" ? "active" : ""}
						onClick={() => setMode("login")}
						type="button">
						Login
					</button>
					<button
						className={mode === "register" ? "active" : ""}
						onClick={() => setMode("register")}
						type="button">
						Register
					</button>
				</div>

				<form onSubmit={onSubmit} className="form-grid">
					{mode === "register" && (
						<label>
							Username
							<input
								value={form.username}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, username: event.target.value }))
								}
								placeholder="captain_arc"
							/>
						</label>
					)}

					<label>
						Email
						<input
							type="email"
							value={form.email}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, email: event.target.value }))
							}
							placeholder="you@org.com"
						/>
					</label>

					<label>
						Password
						<input
							type="password"
							value={form.password}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, password: event.target.value }))
							}
							placeholder="at least 6 chars"
						/>
					</label>

					{error && <p className="status status-error">{error}</p>}

					<button
						className="btn btn-primary"
						disabled={isAuthenticating}
						type="submit">
						{isAuthenticating
							? "Working..."
							: mode === "login"
								? "Login"
								: "Create Account"}
					</button>
				</form>

				<button
					className="btn btn-secondary"
					onClick={startGoogle}
					type="button">
					Continue with Google
				</button>
			</div>
		</section>
	);
};
