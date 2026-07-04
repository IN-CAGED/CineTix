import { useEffect, useState, useRef } from "react";
import { api } from "../../lib/api";

function AdminMovies() {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [form, setForm] = useState({ title: "", genre: "", duration_minutes: 120, age_rating: "PG-13", synopsis: "", poster_url: "", status: "now_showing" });
	const [editingId, setEditingId] = useState(null);
	const [posterFile, setPosterFile] = useState(null);
	const [posterPreview, setPosterPreview] = useState("");
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef(null);

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
		setForm({ title: "", genre: "Action", duration_minutes: 120, age_rating: "PG-13", synopsis: "", poster_url: "", status: "now_showing" });
		setPosterFile(null);
		setPosterPreview("");
		setModalOpen(true);
	};

	const openEdit = (m) => {
		setEditingId(m.id);
		setForm({ title: m.title, genre: m.genre, duration_minutes: m.duration_minutes, age_rating: m.age_rating, synopsis: m.synopsis || "", poster_url: m.poster_url || "", status: m.status || "now_showing" });
		setPosterFile(null);
		setPosterPreview(m.poster_url || "");
		setModalOpen(true);
	};

	const handleFileSelect = (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			alert("Please select an image file (JPEG, PNG, WebP, GIF).");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			alert("File size must not exceed 5MB.");
			return;
		}
		setPosterFile(file);
		const reader = new FileReader();
		reader.onload = (e) => setPosterPreview(e.target.result);
		reader.readAsDataURL(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.classList.remove("upload-zone--dragover");
		const file = e.dataTransfer.files?.[0];
		handleFileSelect(file);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.classList.add("upload-zone--dragover");
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.classList.remove("upload-zone--dragover");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUploading(true);
		try {
			let finalPosterUrl = form.poster_url;

			// If a file was selected, upload it first
			if (posterFile) {
				const formData = new FormData();
				formData.append("poster", posterFile);
				const uploadResult = await api.upload("/movies/upload-poster", formData);
				finalPosterUrl = uploadResult.url;
			}

			const payload = { ...form, poster_url: finalPosterUrl };

			if (editingId) {
				await api.put(`/movies/${editingId}`, payload);
			} else {
				await api.post("/movies", payload);
			}
			setModalOpen(false);
			loadMovies();
		} catch (err) {
			alert(err.message || "Failed to save movie.");
		} finally {
			setUploading(false);
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

	const removePoster = () => {
		setPosterFile(null);
		setPosterPreview("");
		setForm({ ...form, poster_url: "" });
		if (fileInputRef.current) fileInputRef.current.value = "";
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

							{/* Poster Upload Zone */}
							<div className="field">
								<span>Poster Image</span>
								{posterPreview ? (
									<div className="upload-preview">
										<img src={posterPreview} alt="Poster preview" />
										<div className="upload-preview-actions">
											<button type="button" className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}>
												Change Image
											</button>
											<button type="button" className="btn btn-danger btn-sm" onClick={removePoster}>
												Remove
											</button>
										</div>
									</div>
								) : (
									<div
										className="upload-zone"
										onClick={() => fileInputRef.current?.click()}
										onDrop={handleDrop}
										onDragOver={handleDragOver}
										onDragLeave={handleDragLeave}
									>
										<div className="upload-zone-icon">
											<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
												<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
												<polyline points="17 8 12 3 7 8" />
												<line x1="12" y1="3" x2="12" y2="15" />
											</svg>
										</div>
										<div className="upload-zone-text">
											<span className="upload-zone-primary">Click to upload or drag & drop</span>
											<span className="upload-zone-hint">JPEG, PNG, WebP, GIF · Max 5 MB</span>
										</div>
									</div>
								)}
								<input
									ref={fileInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp,image/gif"
									style={{ display: "none" }}
									onChange={(e) => handleFileSelect(e.target.files?.[0])}
								/>
							</div>

							{/* Fallback manual URL */}
							{!posterFile && !posterPreview && (
								<div className="field">
									<span className="muted" style={{ fontSize: "0.75rem" }}>Or paste image URL manually</span>
									<input
										placeholder="https://example.com/poster.jpg"
										value={form.poster_url}
										onChange={(e) => {
											setForm({ ...form, poster_url: e.target.value });
											if (e.target.value) setPosterPreview(e.target.value);
										}}
									/>
								</div>
							)}

							<div className="field"><span>Synopsis</span><textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} /></div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
								<button type="submit" className="btn btn-primary" disabled={uploading}>
									{uploading ? "Uploading..." : "Save Movie"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminMovies;
