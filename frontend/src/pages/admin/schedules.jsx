import { useEffect, useState } from "react";
import { api } from "../../lib/api";

function formatIDR(amount) {
	return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);
}

function AdminSchedules() {
	const [schedules, setSchedules] = useState([]);
	const [movies, setMovies] = useState([]);
	const [studios, setStudios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [form, setForm] = useState({ movie_id: "", studio_id: "", start_time: "", end_time: "", ticket_price: 45000 });

	const loadAll = async () => {
		setLoading(true);
		try {
			const [sData, mData, stData] = await Promise.all([
				api.get("/schedules"),
				api.get("/movies"),
				api.get("/studios"),
			]);
			setSchedules(Array.isArray(sData) ? sData : []);
			setMovies(Array.isArray(mData) ? mData : []);
			setStudios(Array.isArray(stData) ? stData : []);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAll();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post("/schedules", form);
			setModalOpen(false);
			loadAll();
		} catch (err) {
			alert(err.message || "Failed to create schedule.");
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Delete schedule?")) return;
		try {
			await api.del(`/schedules/${id}`);
			loadAll();
		} catch (err) {
			alert(err.message || "Delete failed.");
		}
	};

	return (
		<div>
			<div className="section-header">
				<h1>Showtime & Schedule Management</h1>
				<button type="button" className="btn btn-primary" onClick={() => {
					if (!movies.length || !studios.length) return alert("Please create at least 1 movie and 1 studio first.");
					setForm({ movie_id: movies[0].id, studio_id: studios[0].id, start_time: "", end_time: "", ticket_price: 45000 });
					setModalOpen(true);
				}}>+ Add Showtime</button>
			</div>

			<div className="panel" style={{ padding: "24px" }}>
				{loading ? (
					<div className="loading-center"><div className="spinner" /></div>
				) : schedules.length > 0 ? (
					<table className="data-table">
						<thead>
							<tr>
								<th>Movie Title</th>
								<th>Studio</th>
								<th>Start Time</th>
								<th>Price</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{schedules.map((sc) => (
								<tr key={sc.id}>
									<td style={{ fontWeight: 600, color: "var(--text-main)" }}>{sc.movie?.title || `#${sc.movie_id}`}</td>
									<td>{sc.studio?.name || `#${sc.studio_id}`}</td>
									<td>{new Date(sc.start_time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</td>
									<td style={{ fontWeight: 600, color: "var(--primary)" }}>{formatIDR(sc.ticket_price)}</td>
									<td>
										<button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(sc.id)}>Delete</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className="empty-state">No showtimes scheduled yet.</div>
				)}
			</div>

			{modalOpen && (
				<div className="modal-overlay">
					<div className="modal">
						<h2>Schedule New Showtime</h2>
						<form onSubmit={handleSubmit}>
							<div className="field">
								<span>Select Movie</span>
								<select value={form.movie_id} onChange={(e) => setForm({ ...form, movie_id: e.target.value })}>
									{movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
								</select>
							</div>
							<div className="field">
								<span>Select Studio</span>
								<select value={form.studio_id} onChange={(e) => setForm({ ...form, studio_id: e.target.value })}>
									{studios.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
								</select>
							</div>
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
								<div className="field"><span>Start Time</span><input type="datetime-local" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required /></div>
								<div className="field"><span>End Time</span><input type="datetime-local" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required /></div>
							</div>
							<div className="field"><span>Ticket Price (IDR)</span><input type="number" value={form.ticket_price} onChange={(e) => setForm({ ...form, ticket_price: Number(e.target.value) })} required /></div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
								<button type="submit" className="btn btn-primary">Save Showtime</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminSchedules;
