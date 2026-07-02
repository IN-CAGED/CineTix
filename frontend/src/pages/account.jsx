import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header/header.jsx";
import { api } from "../lib/api";

function Account() {
	const navigate = useNavigate();
	const [user, setUser] = useState(JSON.parse(localStorage.getItem("cinetix_user") || "null") || { name: "User", email: "user@example.com", role: "Customer" });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const data = await api.get("/me");
				const userData = data.user || data;
				setUser(userData);
				localStorage.setItem("cinetix_user", JSON.stringify(userData));
			} finally {
				setLoading(false);
			}
		};
		loadProfile();
	}, []);

	const handleLogout = async () => {
		try {
			await api.post("/logout");
		} finally {
			localStorage.clear();
			navigate("/login");
		}
	};

	return (
		<>
			<Header />

			<main className="page" style={{ maxWidth: "700px" }}>
				<div className="panel" style={{ padding: "36px" }}>
					<div className="account-header">
						<div className="account-avatar">
							{user.name ? user.name.charAt(0).toUpperCase() : "U"}
						</div>
						<div className="account-details">
							<h1>{user.name}</h1>
							<div className="email">{user.email}</div>
							<span className={`role-badge role-${(user.role || "Customer").toLowerCase()}`}>
								Role: {user.role || "Customer"}
							</span>
						</div>
					</div>

					<div className="stat-grid">
						<div className="stat-card">
							<div className="stat-value">Active</div>
							<div className="stat-label">Account Status</div>
						</div>
						<div className="stat-card">
							<div className="stat-value">TLS 1.3</div>
							<div className="stat-label">Security Protocol</div>
						</div>
					</div>

					<div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
						{(user.role === "Admin" || user.role === "Cashier") && (
							<button type="button" className="btn btn-primary" onClick={() => navigate("/admin")}>
								Enter Management Portal →
							</button>
						)}
						<button type="button" className="btn btn-danger" onClick={handleLogout}>
							Sign Out / Logout
						</button>
					</div>
				</div>
			</main>
		</>
	);
}

export default Account;
