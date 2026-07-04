import { useEffect, useState, useRef, useCallback } from "react";
import Header from "./header/header.jsx";
import { api } from "../lib/api";
import { QRCodeSVG } from "qrcode.react";

function TicketList() {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedTicket, setSelectedTicket] = useState(null);
	const [modalState, setModalState] = useState("closed"); // closed | opening | open | closing
	const [cardRect, setCardRect] = useState(null);
	const cardRefs = useRef({});

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

	const openTicketModal = useCallback((ticket, ticketId) => {
		const cardEl = cardRefs.current[ticketId];
		if (cardEl) {
			const rect = cardEl.getBoundingClientRect();
			setCardRect({
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			});
		}
		setSelectedTicket(ticket);
		setModalState("opening");
		// Trigger the 'open' state after a brief delay to allow CSS transition
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setModalState("open");
			});
		});
	}, []);

	const closeTicketModal = useCallback(() => {
		setModalState("closing");
		setTimeout(() => {
			setModalState("closed");
			setSelectedTicket(null);
			setCardRect(null);
		}, 500);
	}, []);

	// Close on Escape key
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && modalState === "open") {
				closeTicketModal();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [modalState, closeTicketModal]);

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
							<article
								className="ticket-card ticket-card--clickable"
								key={t.id}
								ref={(el) => { cardRefs.current[t.id] = el; }}
								onClick={() => openTicketModal(t, t.id)}
								tabIndex={0}
								onKeyDown={(e) => { if (e.key === "Enter") openTicketModal(t, t.id); }}
								role="button"
								aria-label={`View ticket for ${t.schedule?.movie?.title || "Movie"}`}
							>
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

								<div className="ticket-card-hover-hint">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="15 3 21 3 21 9" /><path d="M21 3 14 10" />
										<polyline points="9 21 3 21 3 15" /><path d="M3 21l7-7" />
									</svg>
									<span>Tap to expand</span>
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

			{/* ── Ticket Detail Modal Overlay ── */}
			{selectedTicket && modalState !== "closed" && (
				<div
					className={`ticket-modal-overlay ${modalState === "open" ? "ticket-modal-overlay--visible" : ""} ${modalState === "closing" ? "ticket-modal-overlay--closing" : ""}`}
					onClick={closeTicketModal}
				>
					<div
						className={`ticket-modal-card ${modalState === "open" ? "ticket-modal-card--visible" : ""} ${modalState === "closing" ? "ticket-modal-card--closing" : ""}`}
						onClick={(e) => e.stopPropagation()}
						style={
							modalState === "opening" && cardRect
								? {
									"--origin-top": `${cardRect.top}px`,
									"--origin-left": `${cardRect.left}px`,
									"--origin-width": `${cardRect.width}px`,
									"--origin-height": `${cardRect.height}px`,
								  }
								: undefined
						}
					>
						{/* Close button */}
						<button className="ticket-modal-close" onClick={closeTicketModal} aria-label="Close ticket detail">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>

						{/* Movie poster banner */}
						<div className="ticket-modal-banner">
							{selectedTicket.schedule?.movie?.poster_url ? (
								<img src={selectedTicket.schedule.movie.poster_url} alt="" />
							) : (
								<div className="ticket-modal-banner-placeholder">
									<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
										<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
										<line x1="7" y1="2" x2="7" y2="22" />
										<line x1="17" y1="2" x2="17" y2="22" />
										<line x1="2" y1="12" x2="22" y2="12" />
										<line x1="2" y1="7" x2="7" y2="7" />
										<line x1="2" y1="17" x2="7" y2="17" />
										<line x1="17" y1="7" x2="22" y2="7" />
										<line x1="17" y1="17" x2="22" y2="17" />
									</svg>
								</div>
							)}
							<div className="ticket-modal-banner-gradient" />
							<div className="ticket-modal-movie-title">
								{selectedTicket.schedule?.movie?.title || "Movie Ticket"}
							</div>
						</div>

						{/* Ticket details */}
						<div className="ticket-modal-body">
							<div className="ticket-modal-details-grid">
								<div className="ticket-modal-detail">
									<span className="ticket-modal-label">Studio</span>
									<span className="ticket-modal-value">{selectedTicket.schedule?.studio?.name || "—"}</span>
								</div>
								<div className="ticket-modal-detail">
									<span className="ticket-modal-label">Seat</span>
									<span className="ticket-modal-value ticket-modal-value--highlight">{selectedTicket.seat?.seat_number || "—"}</span>
								</div>
								<div className="ticket-modal-detail">
									<span className="ticket-modal-label">Showtime</span>
									<span className="ticket-modal-value">
										{selectedTicket.schedule?.start_time
											? new Date(selectedTicket.schedule.start_time).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })
											: "Scheduled"}
									</span>
								</div>
								<div className="ticket-modal-detail">
									<span className="ticket-modal-label">Genre</span>
									<span className="ticket-modal-value">{selectedTicket.schedule?.movie?.genre || "—"}</span>
								</div>
								<div className="ticket-modal-detail">
									<span className="ticket-modal-label">Duration</span>
									<span className="ticket-modal-value">{selectedTicket.schedule?.movie?.duration_minutes ? `${selectedTicket.schedule.movie.duration_minutes} min` : "—"}</span>
								</div>
								<div className="ticket-modal-detail">
									<span className="ticket-modal-label">Rating</span>
									<span className="ticket-modal-value">{selectedTicket.schedule?.movie?.age_rating || "—"}</span>
								</div>
							</div>

							{/* Dashed separator like a real ticket */}
							<div className="ticket-modal-tear" />

							{/* QR Code section */}
							<div className="ticket-modal-qr-section">
								<div className="ticket-modal-qr-wrapper">
									<QRCodeSVG
										value={selectedTicket.qr_token || `CTX-${selectedTicket.id}`}
										size={180}
										bgColor="#ffffff"
										fgColor="#000000"
										level="H"
										includeMargin={true}
									/>
								</div>
								<div className="ticket-modal-token">
									<span className="ticket-modal-label">Token ID</span>
									<span className="ticket-modal-token-value">{selectedTicket.qr_token || `CTX-${selectedTicket.id}`}</span>
								</div>
								<p className="ticket-modal-scan-hint">Present this QR code at the cinema entrance gate</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default TicketList;
