import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header/header.jsx";
import { api } from "../lib/api";

function formatIDR(amount) {
	return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);
}

function MovieDetail() {
	const location = useLocation();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(location.state?.movie || null);
	const [schedules, setSchedules] = useState([]);
	const [loading, setLoading] = useState(!movie);

	useEffect(() => {
		const loadDetail = async () => {
			if (!movie?.id) return;
			let hasSchedules = false;
			try {
				const data = await api.get(`/movies/${movie.id}`);
				setMovie(data);
				if (data.schedules && data.schedules.length > 0) {
					setSchedules(data.schedules);
					hasSchedules = true;
				}
			} finally {
				setLoading(false);
			}

			// Only fetch schedules separately if movie detail didn't include them
			if (!hasSchedules) {
				try {
					const allScheds = await api.get("/schedules");
					if (Array.isArray(allScheds)) {
						setSchedules(allScheds.filter((s) => s.movie_id === movie.id));
					}
				} catch {
					// ignore
				}
			}
		};

		loadDetail();
	}, [movie?.id]);

	if (!movie && !loading) {
		return (
			<>
				<Header />
				<main className="page"><div className="empty-state">Movie details not available. Please return to Movies catalog.</div></main>
			</>
		);
	}

	return (
		<>
			<Header />

			<main className="page">
				<section className="panel detail-layout">
					<div className="detail-poster">
						{movie?.poster_url && <img src={movie.poster_url} alt={movie?.title} />}
					</div>

					<div className="detail-info">
						<span className={`tag ${movie?.status === "now_showing" ? "badge-showing" : "badge-coming"}`} style={{ display: "inline-block", marginBottom: "12px" }}>
							{movie?.status === "now_showing" ? "Now Showing" : "Coming Soon"}
						</span>
						<h1>{movie?.title || "Loading Movie..."}</h1>

						<div className="detail-meta">
							<span className="tag">{movie?.genre}</span>
							<span className="tag">{movie?.duration_minutes} Minutes</span>
							<span className="tag">Rating: {movie?.age_rating}</span>
						</div>

						<p className="detail-synopsis">{movie?.synopsis || "No synopsis provided."}</p>

						<h2 style={{ fontSize: "1.25rem", marginBottom: "16px", marginTop: "32px", borderTop: "1px solid var(--border-main)", paddingTop: "24px" }}>
							Available Showtimes & Studios
						</h2>

						{schedules.length > 0 ? (
							<div className="schedule-list">
								{schedules.map((sc) => (
									<div key={sc.id} className="schedule-card">
										<div className="schedule-info">
											<span className="schedule-time">
												{new Date(sc.start_time).toLocaleString("id-ID", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
											</span>
											<span className="schedule-studio">{sc.studio?.name || `Studio #${sc.studio_id}`}</span>
										</div>
										<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
											<span className="schedule-price">{formatIDR(sc.ticket_price)}</span>
											<button
												type="button"
												className="btn btn-primary btn-sm"
												onClick={() => navigate("/seating", { state: { schedule: sc, movie } })}
											>
												Select Seats →
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="empty-state" style={{ padding: "24px 0", textAlign: "left" }}>
								No showtimes scheduled for this movie yet. Check back soon!
							</div>
						)}
					</div>
				</section>
			</main>
		</>
	);
}

export default MovieDetail;
