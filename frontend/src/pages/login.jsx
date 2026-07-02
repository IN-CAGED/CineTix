import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { request } from "../lib/api";

function Login() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async (event) => {
		event.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await request("/login", {
				method: "POST",
				body: form,
			});

			localStorage.setItem("cinetix_token", response.token || "");
			localStorage.setItem("cinetix_user", JSON.stringify(response.user || {}));
			localStorage.setItem("loggedIn", "true");
			localStorage.setItem("loggedUser", response.user?.name || "User");

			navigate("/home");
		} catch (requestError) {
			setError(requestError.message || "Unable to log in.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page auth-page">
			<form className="panel auth-card" onSubmit={submit}>
				<div className="brand-mark">CINETIX</div>
				<h1>Login</h1>

				<label className="field">
					<span>Email</span>
					<input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
				</label>

				<label className="field">
					<span>Password</span>
					<input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required />
				</label>

				{error ? <div className="banner error-banner">{error}</div> : null}

				<button className="btn btn-primary btn-block" type="submit" disabled={loading}>
					{loading ? "Signing in..." : "Login"}
				</button>

				<p className="muted center-text" style={{ marginTop: "16px" }}>
					Don&apos;t have an account? <Link to="/register">Register</Link>
				</p>
			</form>
		</div>
	);
}

export default Login;
