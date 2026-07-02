import { useEffect, useState } from "react";
import Header from "./header/header.jsx";
import { api } from "../lib/api";
import { QRCodeSVG } from "qrcode.react";

function TicketList() {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadTickets = async () => {
			try {
				const data = await api.get("/bookings/my-tickets");
				setTickets(Array.isArray(data) ? data : []);
			} catch (err) {
				setError(err.message || "Failed to retrieve your e-tickets.");
			} finally {
				setLoading(false);
			}
		};
		loadTickets();
	}, []);

	return (
		<>
			<Header />

			<main className="page">
				<h1 style={{ marginBottom: "8px" }}>Your Active E-Tickets (QR Encrypted)</h1>
				<p className="muted" style={{ marginBottom: "28px" }}>
					Show these QR tokens at the cinema entrance gate for cashier scanner verification.
				</p>

				{error && <div className="banner error-banner">{error}</div>}

				{loading ? (
					<div className="loading-center"><div className="spinner" /></div>
				) : tickets.length > 0 ? (
					<section className="ticket-grid">
						{tickets.map((t) => (
							<article className="ticket-card" key={t.id}>
								<div className="ticket-poster">
									{t.schedule?.movie?.poster_url && <img src={t.schedule.movie.poster_url} alt="" />}
								</div>

								<div className="ticket-info">
									<h3>{t.schedule?.movie?.title || "Movie Ticket"}</h3>
									<div className="ticket-meta">
										<div><strong>Studio:</strong> {t.schedule?.studio?.name} · Seat: <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1.1rem" }}>{t.seat?.seat_number}</span></div>
										<div><strong>Showtime:</strong> {t.schedule?.start_time ? new Date(t.schedule.start_time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "Scheduled"}</div>
										<div><strong>Token ID:</strong> <span style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{t.qr_token || `CTX-${t.id}`}</span></div>
									</div>
								</div>

								<div style={{ textAlign: "center" }}>
									<div className="ticket-qr">
										<QRCodeSVG
											value={t.qr_token || `CTX-${t.id}`}
											size={120}
											bgColor="#ffffff"
											fgColor="#000000"
											level="M"
											includeMargin={true}
										/>
									</div>
									<div className="muted" style={{ fontSize: "0.6875rem", marginTop: "4px" }}>Scan at Gate</div>
								</div>
							</article>
						))}
					</section>
				) : (
					<div className="panel empty-state">
						<div className="empty-icon" style={{ fontSize: "3rem", opacity: 0.3 }}>
							<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
						</div>
						<p>You have no active e-tickets yet. Browse movies and book your seats!</p>
					</div>
				)}
			</main>
		</>
	);
}

export default TicketList;
