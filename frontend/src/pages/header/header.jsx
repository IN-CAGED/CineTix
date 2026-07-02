import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { request } from "../../lib/api";

function Header() {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("cinetix_user") || "null") || {
		name: localStorage.getItem("loggedUser") || "Guest",
		role: "Guest",
	};
	const isLoggedIn = localStorage.getItem("loggedIn") === "true" || !!localStorage.getItem("cinetix_token");
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleLogout = async () => {
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
		<>
			<header className={`header ${scrolled ? "header--scrolled" : ""}`}>
				<Link to="/home" className="logo">
					CINETIX
				</Link>

				<nav aria-label="Primary navigation">
					<ul>
						<li>
							<NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
								Movies
							</NavLink>
						</li>
						{isLoggedIn && (
							<li>
								<NavLink to="/tickets" className={({ isActive }) => (isActive ? "active" : "")}>
									My Tickets
								</NavLink>
							</li>
						)}
						{(user.role === "Admin" || user.role === "Cashier") && (
							<li>
								<NavLink to="/admin" style={{ color: "var(--primary)", fontWeight: 700 }}>
									Management
								</NavLink>
							</li>
						)}
					</ul>
				</nav>

				<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
					{isLoggedIn ? (
						<>
							<Link to="/account" className="user-badge">
								<div className="avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
								<span>{user.name}</span>
							</Link>
							<button type="button" onClick={handleLogout} className="btn btn-secondary btn-sm">
								Logout
							</button>
						</>
					) : (
						<Link to="/login" className="btn btn-primary btn-sm">
							Sign In
						</Link>
					)}
				</div>
			</header>

			{/* Mobile Bottom Navigation */}
			<nav className="mobile-bottom-nav" aria-label="Mobile navigation">
				<NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
					<span className="nav-icon">
						<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
					</span>
					<span>Home</span>
				</NavLink>
				<NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
					<span className="nav-icon">
						<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" /></svg>
					</span>
					<span>Movies</span>
				</NavLink>
				{isLoggedIn && (
					<NavLink to="/tickets" className={({ isActive }) => (isActive ? "active" : "")}>
						<span className="nav-icon">
							<svg viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
						</span>
						<span>Tickets</span>
					</NavLink>
				)}
				<NavLink to="/account" className={({ isActive }) => (isActive ? "active" : "")}>
					<span className="nav-icon">
						<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
					</span>
					<span>Profile</span>
				</NavLink>
			</nav>
		</>
	);
}

export default Header;
