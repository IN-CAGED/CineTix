import { useEffect, useState } from "react";
import { api } from "../../lib/api";

function AdminStudios() {
	const [studios, setStudios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [form, setForm] = useState({ name: "", capacity: 40 });

	const loadStudios = async () => {
		setLoading(true);
		try {
			const data = await api.get("/studios");
			setStudios(Array.isArray(data) ? data : []);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadStudios();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post("/studios", form);
			setModalOpen(false);
			loadStudios();
		} catch (err) {
			alert(err.message || "Failed to create studio.");
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Delete this studio?")) return;
		try {
			await api.del(`/studios/${id}`);
			loadStudios();
		} catch (err) {
			alert(err.message || "Delete failed.");
		}
	};

	return (
		<div>
			<div className="section-header">
				<h1>Studio & Hall Management</h1>
				<button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Add New Studio</button>
			</div>

			<div className="panel" style={{ padding: "24px" }}>
				{loading ? (
					<div className="loading-center"><div className="spinner" /></div>
				) : studios.length > 0 ? (
					<table className="data-table">
						<thead>
							<tr>
								<th>Studio ID</th>
								<th>Name</th>
								<th>Capacity</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{studios.map((s) => (
								<tr key={s.id}>
									<td>#{s.id}</td>
									<td style={{ fontWeight: 600, color: "var(--text-main)" }}>{s.name}</td>
									<td>{s.capacity} seats</td>
									<td>
										<button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className="empty-state">No studios created yet.</div>
				)}
			</div>

			{modalOpen && (
				<div className="modal-overlay">
					<div className="modal">
						<h2>Add New Studio</h2>
						<form onSubmit={handleSubmit}>
							<div className="field"><span>Studio Name</span><input placeholder="e.g. Studio 4 — Dolby Atmos" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
							<div className="field"><span>Seat Capacity</span><input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} required /></div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
								<button type="submit" className="btn btn-primary">Create Studio</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminStudios;
