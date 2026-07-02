import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header/header.jsx";
import { api } from "../lib/api";

function MoviesList() {
	const navigate = useNavigate();
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState("now_showing");
	const [search, setSearch] = useState("");
	const [genre, setGenre] = useState("ALL");

	useEffect(() => {
		const loadMovies = async () => {
			setLoading(true);
			try {
				const data = await api.get("/movies");
				setMovies(Array.isArray(data) ? data : []);
			} finally {
				setLoading(false);
			}
		};
		loadMovies();
	}, []);

	const genres = ["ALL", ...new Set(movies.map((m) => m.genre).filter(Boolean))];

	const filteredMovies = movies.filter((m) => {
		const matchTab = tab === "ALL" || m.status === tab;
		const matchSearch = !search || m.title?.toLowerCase().includes(search.toLowerCase());
		const matchGenre = genre === "ALL" || m.genre === genre;
		return matchTab && matchSearch && matchGenre;
	});

	return (
		<>
			<Header />

			<main className="page">
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
					<h1>Movie Catalog & Schedules</h1>

					<div className="tabs">
						<button type="button" className={`tab ${tab === "now_showing" ? "active" : ""}`} onClick={() => setTab("now_showing")}>
							Now Showing
						</button>
						<button type="button" className={`tab ${tab === "coming_soon" ? "active" : ""}`} onClick={() => setTab("coming_soon")}>
							Coming Soon
						</button>
						<button type="button" className={`tab ${tab === "ALL" ? "active" : ""}`} onClick={() => setTab("ALL")}>
							All Movies
						</button>
					</div>
				</div>

				<div className="panel" style={{ padding: "18px 24px", marginBottom: "32px" }}>
					<div className="search-bar">
						<input
							type="text"
							placeholder="Search movie title..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<select value={genre} onChange={(e) => setGenre(e.target.value)}>
							{genres.map((g) => (
								<option key={g} value={g}>{g === "ALL" ? "All Genres" : g}</option>
							))}
						</select>
					</div>
				</div>

				{loading ? (
					<div className="loading-center"><div className="spinner" /></div>
				) : filteredMovies.length > 0 ? (
					<section className="movie-grid">
						{filteredMovies.map((m) => (
							<div
								key={m.id}
								className="card movie-card"
								onClick={() => navigate("/movie-detail", { state: { movie: m } })}
							>
								<div className="poster">
									{m.poster_url && <img src={m.poster_url} alt={m.title} />}
									<span className={`badge ${m.status === "now_showing" ? "badge-showing" : "badge-coming"}`}>
										{m.status === "now_showing" ? "Showing" : "Coming Soon"}
									</span>
								</div>
								<div className="info">
									<h3>{m.title}</h3>
									<div className="meta">{m.genre} · {m.age_rating} · {m.duration_minutes}m</div>
								</div>
							</div>
						))}
					</section>
				) : (
					<div className="empty-state">No movies found matching your search criteria.</div>
				)}
			</main>
		</>
	);
}

export default MoviesList;
