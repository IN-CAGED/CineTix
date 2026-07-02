import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { request } from "../lib/api";

function Register() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async (event) => {
		event.preventDefault();
		setError("");

		if (form.password !== form.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);

		try {
			const response = await request("/register", {
				method: "POST",
				body: {
					name: form.name,
					email: form.email,
					password: form.password,
				},
			});

			localStorage.setItem("cinetix_token", response.token || "");
			localStorage.setItem("cinetix_user", JSON.stringify(response.user || {}));
			localStorage.setItem("loggedIn", "true");
			localStorage.setItem("loggedUser", response.user?.name || "User");

			navigate("/home");
		} catch (requestError) {
			setError(requestError.message || "Unable to register.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page auth-page">
			<form className="panel auth-card" onSubmit={submit}>
				<div className="brand-mark">CINETIX</div>
				<h1>Create Account</h1>

				<label className="field">
					<span>Name</span>
					<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} type="text" required />
				</label>

				<label className="field">
					<span>Email</span>
					<input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
				</label>

				<label className="field">
					<span>Password</span>
					<input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" minLength={8} required />
				</label>

				<label className="field">
					<span>Confirm password</span>
					<input value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} type="password" minLength={8} required />
				</label>

				{error ? <div className="banner error-banner">{error}</div> : null}

				<button className="btn btn-primary btn-block" type="submit" disabled={loading}>
					{loading ? "Creating account..." : "Register"}
				</button>

				<p className="muted center-text" style={{ marginTop: "16px" }}>
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</form>
		</div>
	);
}

export default Register;
