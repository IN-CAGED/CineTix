import { useEffect, useState } from "react";
import { api } from "../../lib/api";

function AdminMovies() {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [form, setForm] = useState({ title: "", genre: "", duration_minutes: 120, age_rating: "PG-13", synopsis: "", poster_url: "", status: "now_showing" });
	const [editingId, setEditingId] = useState(null);

	const loadMovies = async () => {
		setLoading(true);
		try {
			const data = await api.get("/movies");
			setMovies(Array.isArray(data) ? data : []);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMovies();
	}, []);

	const openCreate = () => {
		setEditingId(null);
		setForm({ title: "", genre: "Action", duration_minutes: 120, age_rating: "PG-13", synopsis: "", poster_url: "https://placehold.co/400x600/d35400/ffffff?text=New+Movie", status: "now_showing" });
		setModalOpen(true);
	};

	const openEdit = (m) => {
		setEditingId(m.id);
		setForm({ title: m.title, genre: m.genre, duration_minutes: m.duration_minutes, age_rating: m.age_rating, synopsis: m.synopsis || "", poster_url: m.poster_url || "", status: m.status || "now_showing" });
		setModalOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingId) {
				await api.put(`/movies/${editingId}`, form);
			} else {
				await api.post("/movies", form);
			}
			setModalOpen(false);
			loadMovies();
		} catch (err) {
			alert(err.message || "Failed to save movie.");
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this movie?")) return;
		try {
			await api.del(`/movies/${id}`);
			loadMovies();
		} catch (err) {
			alert(err.message || "Delete failed.");
		}
	};

	return (
		<div>
			<div className="section-header">
				<h1>Movie Master Management</h1>
				<button type="button" className="btn btn-primary" onClick={openCreate}>+ Add New Movie</button>
			</div>

			<div className="panel" style={{ padding: "24px" }}>
				{loading ? (
					<div className="loading-center"><div className="spinner" /></div>
				) : movies.length > 0 ? (
					<table className="data-table">
						<thead>
							<tr>
								<th>Poster</th>
								<th>Title</th>
								<th>Genre</th>
								<th>Duration</th>
								<th>Rating</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{movies.map((m) => (
								<tr key={m.id}>
									<td style={{ width: "60px" }}>
										<div style={{ width: "40px", height: "60px", background: "#333", borderRadius: "6px", overflow: "hidden" }}>
											{m.poster_url && <img src={m.poster_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
										</div>
									</td>
									<td style={{ fontWeight: 600, color: "var(--text-main)" }}>{m.title}</td>
									<td>{m.genre}</td>
									<td>{m.duration_minutes} min</td>
									<td>{m.age_rating}</td>
									<td>
										<span className={`tag ${m.status === "now_showing" ? "badge-showing" : "badge-coming"}`} style={{ padding: "4px 8px", fontSize: "0.7rem", borderRadius: "4px" }}>
											{m.status === "now_showing" ? "Showing" : "Coming Soon"}
										</span>
									</td>
									<td>
										<div className="table-actions">
											<button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>Edit</button>
											<button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Delete</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className="empty-state">No movies cataloged yet.</div>
				)}
			</div>

			{modalOpen && (
				<div className="modal-overlay">
					<div className="modal">
						<h2>{editingId ? "Edit Movie" : "Add New Movie"}</h2>
						<form onSubmit={handleSubmit}>
							<div className="field"><span>Title</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
								<div className="field"><span>Genre</span><input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required /></div>
								<div className="field"><span>Duration (min)</span><input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} required /></div>
							</div>
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
								<div className="field"><span>Age Rating</span><input value={form.age_rating} onChange={(e) => setForm({ ...form, age_rating: e.target.value })} required /></div>
								<div className="field">
									<span>Status</span>
									<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
										<option value="now_showing">Now Showing</option>
										<option value="coming_soon">Coming Soon</option>
									</select>
								</div>
							</div>
							<div className="field"><span>Poster Image URL</span><input value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} /></div>
							<div className="field"><span>Synopsis</span><textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} /></div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
								<button type="submit" className="btn btn-primary">Save Movie</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminMovies;
