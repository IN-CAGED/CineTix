import { useEffect, useState } from "react";
import { request } from "../../lib/api";

function formatIDR(amount) {
	return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);
}

function AdminDashboard() {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await request("/admin/dashboard");
				setStats(data);
			} catch (err) {
				setError(err.message || "Failed to load dashboard statistics.");
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	if (loading) {
		return <div className="loading-center"><div className="spinner" /></div>;
	}

	if (error) {
		return <div className="banner error-banner">{error}</div>;
	}

	return (
		<div>
			<h1>Financial & Operational Dashboard</h1>

			<div className="dashboard-stats">
				<div className="dashboard-stat-card">
					<div className="stat-title">Total Revenue</div>
					<div className="stat-value revenue">{formatIDR(stats?.total_revenue)}</div>
				</div>
				<div className="dashboard-stat-card">
					<div className="stat-title">Today's Revenue</div>
					<div className="stat-value revenue">{formatIDR(stats?.today_revenue)}</div>
				</div>
				<div className="dashboard-stat-card">
					<div className="stat-title">Tickets Sold</div>
					<div className="stat-value">{stats?.total_tickets_sold || 0}</div>
				</div>
				<div className="dashboard-stat-card">
					<div className="stat-title">Total Transactions</div>
					<div className="stat-value">{stats?.total_transactions || 0}</div>
				</div>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
				<div className="panel" style={{ padding: "24px" }}>
					<h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Popular Movies</h2>
					{stats?.popular_movies?.length > 0 ? (
						<table className="data-table">
							<thead>
								<tr>
									<th>Movie Title</th>
									<th>Genre</th>
									<th>Tickets Sold</th>
								</tr>
							</thead>
							<tbody>
								{stats.popular_movies.map((movie) => (
									<tr key={movie.id}>
										<td style={{ fontWeight: 600, color: "var(--text-main)" }}>{movie.title}</td>
										<td>{movie.genre}</td>
										<td><strong style={{ color: "var(--primary)" }}>{movie.tickets_sold}</strong></td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="empty-state">No ticket sales recorded yet.</div>
					)}
				</div>

				<div className="panel" style={{ padding: "24px" }}>
					<h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Recent Paid Transactions</h2>
					{stats?.recent_transactions?.length > 0 ? (
						<table className="data-table">
							<thead>
								<tr>
									<th>Ref ID</th>
									<th>Customer</th>
									<th>Amount</th>
								</tr>
							</thead>
							<tbody>
								{stats.recent_transactions.map((trx) => (
									<tr key={trx.id}>
										<td style={{ fontFamily: "monospace", color: "var(--text-main)" }}>{trx.payment_ref_id || `#${trx.id}`}</td>
										<td>{trx.user?.name || "Customer"}</td>
										<td style={{ fontWeight: 600, color: "var(--success)" }}>{formatIDR(trx.total_amount)}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="empty-state">No recent transactions found.</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;
