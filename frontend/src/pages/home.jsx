import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header/header.jsx";
import { api } from "../lib/api";

function Home() {
	const navigate = useNavigate();
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const loadMovies = async () => {
			try {
				const data = await api.get("/movies");
				setMovies(Array.isArray(data) ? data : []);
			} catch {
				setMovies([]);
			} finally {
				setLoading(false);
			}
		};
		loadMovies();
	}, []);

	const showingMovies = movies.filter((m) => m.status === "now_showing");
	const comingMovies = movies.filter((m) => m.status === "coming_soon");
	const heroMovies = showingMovies.slice(0, 4);

	useEffect(() => {
		if (heroMovies.length <= 1) return;
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev === heroMovies.length - 1 ? 0 : prev + 1));
		}, 6000);
		return () => clearInterval(timer);
	}, [heroMovies.length]);

	return (
		<>
			<Header />

			<main className="page">
				{heroMovies.length > 0 && (
					<section className="hero">
						{heroMovies.map((movie, idx) => (
							<div
								key={movie.id}
								className={`hero-slide ${idx === currentSlide ? "active" : ""}`}
								style={{
									backgroundImage: `url(${movie.poster_url || "https://placehold.co/1200x500/d35400/ffffff?text=" + encodeURIComponent(movie.title)})`,
								}}
							>
								<div className="hero-content">
									<span className="tag badge-showing" style={{ marginBottom: "12px", display: "inline-block" }}>
										Featured Movie
									</span>
									<h2>{movie.title}</h2>
									<p>{movie.synopsis}</p>
									<div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
										<button
											type="button"
											className="btn btn-primary"
											onClick={() => navigate("/movie-detail", { state: { movie } })}
										>
											Book Tickets Now
										</button>
										<button
											type="button"
											className="btn btn-secondary"
											onClick={() => navigate("/movie-detail", { state: { movie } })}
										>
											View Detail
										</button>
									</div>
								</div>
							</div>
						))}

						<div className="hero-arrows">
							<button type="button" onClick={() => setCurrentSlide(currentSlide === 0 ? heroMovies.length - 1 : currentSlide - 1)} aria-label="Previous slide">&#8249;</button>
							<button type="button" onClick={() => setCurrentSlide(currentSlide === heroMovies.length - 1 ? 0 : currentSlide + 1)} aria-label="Next slide">&#8250;</button>
						</div>

						<div className="hero-dots">
							{heroMovies.map((_, idx) => (
								<span
									key={idx}
									className={idx === currentSlide ? "active" : ""}
									onClick={() => setCurrentSlide(idx)}
								/>
							))}
						</div>
					</section>
				)}

				<div className="section-header">
					<h2>Now Showing in Theaters</h2>
					<Link to="/movies" className="text-brand" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
						View All Showing →
					</Link>
				</div>

				{loading ? (
					<div className="loading-center"><div className="spinner" /></div>
				) : showingMovies.length > 0 ? (
					<section className="movie-grid">
						{showingMovies.map((m) => (
							<div
								key={m.id}
								className="card movie-card"
								onClick={() => navigate("/movie-detail", { state: { movie: m } })}
							>
								<div className="poster">
									{m.poster_url && <img src={m.poster_url} alt={m.title} />}
									<span className="badge badge-showing">Showing</span>
								</div>
								<div className="info">
									<h3>{m.title}</h3>
									<div className="meta">{m.genre} · {m.duration_minutes} min</div>
								</div>
							</div>
						))}
					</section>
				) : (
					<div className="empty-state">No movies currently playing.</div>
				)}

				{comingMovies.length > 0 && (
					<>
						<div className="section-header" style={{ marginTop: "56px" }}>
							<h2>Coming Soon</h2>
							<Link to="/movies" className="text-brand" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
								Explore All →
							</Link>
						</div>

						<section className="movie-grid">
							{comingMovies.map((m) => (
								<div
									key={m.id}
									className="card movie-card"
									onClick={() => navigate("/movie-detail", { state: { movie: m } })}
								>
									<div className="poster">
										{m.poster_url && <img src={m.poster_url} alt={m.title} />}
										<span className="badge badge-coming">Coming Soon</span>
									</div>
									<div className="info">
										<h3>{m.title}</h3>
										<div className="meta">{m.genre} · {m.age_rating}</div>
									</div>
								</div>
							))}
						</section>
					</>
				)}
			</main>

			<footer>© 2026 Cinetix Cinema Portal</footer>
		</>
	);
}

export default Home;
