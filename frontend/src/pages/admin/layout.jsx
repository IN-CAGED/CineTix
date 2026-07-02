import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { request } from "../../lib/api";

function AdminLayout() {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("cinetix_user") || "null") || {
		name: localStorage.getItem("loggedUser") || "Admin",
		role: "Admin",
	};

	const logout = async () => {
		try {
			await request("/logout", { method: "POST" });
		} catch {
			// ignore error
		} finally {
			localStorage.clear();
			navigate("/login");
		}
	};

	return (
		<div className="admin-layout">
			<aside className="admin-sidebar">
				<div className="sidebar-brand">CINETIX</div>
				<div className="sidebar-subtitle">Management Portal</div>

				<nav>
					<NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
						<span className="icon">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
						</span>
						<span>Dashboard</span>
					</NavLink>

					{user.role === "Admin" && (
						<>
							<NavLink to="/admin/movies" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
								<span className="icon">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></svg>
								</span>
								<span>Movies</span>
							</NavLink>
							<NavLink to="/admin/studios" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
								<span className="icon">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
								</span>
								<span>Studios</span>
							</NavLink>
							<NavLink to="/admin/schedules" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
								<span className="icon">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
								</span>
								<span>Schedules</span>
							</NavLink>
						</>
					)}

					<NavLink to="/admin/scanner" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
						<span className="icon">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
						</span>
						<span>Scanner (Kasir)</span>
					</NavLink>
				</nav>

				<div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid var(--border-main)" }}>
					<div style={{ padding: "0 12px 12px", fontSize: "0.8125rem" }}>
						<div style={{ fontWeight: 600 }}>{user.name}</div>
						<div className="muted" style={{ fontSize: "0.75rem" }}>Role: {user.role}</div>
					</div>
					<Link to="/home" className="sidebar-link">
						<span className="icon">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
						</span>
						<span>Back to App</span>
					</Link>
					<button type="button" onClick={logout} className="sidebar-link" style={{ width: "100%", border: 0, background: "transparent", cursor: "pointer", textAlign: "left" }}>
						<span className="icon">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
						</span>
						<span>Logout</span>
					</button>
				</div>
			</aside>

			<main className="admin-content">
				<Outlet />
			</main>
		</div>
	);
}

export default AdminLayout;
