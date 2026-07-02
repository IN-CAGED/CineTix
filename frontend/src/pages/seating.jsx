import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header/header.jsx";
import { api } from "../lib/api";

function formatIDR(amount) {
	return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);
}

function Seating() {
	const location = useLocation();
	const navigate = useNavigate();
	const scheduleParam = location.state?.schedule;
	const movieParam = location.state?.movie;

	const [schedule, setSchedule] = useState(scheduleParam || null);
	const [seats, setSeats] = useState([]);
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [locking, setLocking] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadSeats = async () => {
			setLoading(true);
			try {
				let targetScheduleId = schedule?.id || 1;
				if (!schedule) {
					// Fallback: fetch first available schedule
					const sList = await api.get("/schedules");
					if (sList.length > 0) targetScheduleId = sList[0].id;
				}

				const res = await api.get(`/schedules/${targetScheduleId}/seats`);
				setSchedule(res.schedule || schedule);
				setSeats(res.seats || []);
			} catch (err) {
				setError(err.message || "Unable to load studio seat map.");
			} finally {
				setLoading(false);
			}
		};
		loadSeats();
	}, [schedule?.id]);

	const toggleSeat = (seat) => {
		if (seat.status === "taken") return;
		setSelectedSeats((prev) =>
			prev.some((s) => s.id === seat.id)
				? prev.filter((s) => s.id !== seat.id)
				: [...prev, seat]
		);
	};

	const handleCheckout = async () => {
		if (selectedSeats.length === 0) return;
		const isLoggedIn = localStorage.getItem("loggedIn") === "true" || !!localStorage.getItem("cinetix_token");
		if (!isLoggedIn) {
			alert("Please log in first to proceed with ticket booking.");
			return navigate("/login");
		}

		setLocking(true);
		setError("");

		try {
			const res = await api.post("/bookings/lock-seats", {
				schedule_id: schedule.id,
				seat_ids: selectedSeats.map((s) => s.id),
			});

			navigate("/payment", {
				state: {
					transaction: res.transaction,
					expires_at: res.expires_at,
					selectedSeats,
					schedule,
				},
			});
		} catch (err) {
			setError(err.message || "Failed to lock selected seats. They might have just been booked by someone else.");
			// Refresh seat map
			const refreshed = await api.get(`/schedules/${schedule.id}/seats`);
			setSeats(refreshed.seats || []);
			setSelectedSeats([]);
		} finally {
			setLocking(false);
		}
	};

	// Group seats by row_label (A, B, C...)
	const rows = Object.entries(
		seats.reduce((acc, seat) => {
			acc[seat.row_label] = acc[seat.row_label] || [];
			acc[seat.row_label].push(seat);
			return acc;
		}, {})
	).sort(([rowA], [rowB]) => rowA.localeCompare(rowB));

	const totalAmount = (schedule?.ticket_price || 0) * selectedSeats.length;

	return (
		<>
			<Header />

			<main className="page">
				<div style={{ marginBottom: "28px" }}>
					<h1>Studio Seat Layout & Selection (Real-Time)</h1>
					<p className="muted">
						{schedule?.movie?.title || movieParam?.title || "Movie"} · {schedule?.studio?.name || "Studio"} · Show:{" "}
						{schedule?.start_time ? new Date(schedule.start_time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "Scheduled"}
					</p>
				</div>

				{error && <div className="banner error-banner">{error}</div>}

				<div className="panel" style={{ padding: "36px 24px" }}>
					<div className="screen-indicator">
						<div className="screen-line" />
						<span>Cinema Screen Direction</span>
					</div>

					{loading ? (
						<div className="loading-center"><div className="spinner" /></div>
					) : seats.length > 0 ? (
						<>
							<div className="seat-grid-container">
								{rows.map(([rowLabel, rowSeats]) => (
									<div key={rowLabel} className="seat-row">
										<div className="seat-row-label">{rowLabel}</div>
										{rowSeats.sort((a, b) => a.column_number - b.column_number).map((seat) => {
											const isSelected = selectedSeats.some((s) => s.id === seat.id);
											return (
												<button
													key={seat.id}
													type="button"
													disabled={seat.status === "taken"}
													className={`seat ${seat.status === "taken" ? "taken" : isSelected ? "selected" : ""}`}
													onClick={() => toggleSeat(seat)}
													title={`Seat ${seat.seat_number} — ${seat.status === "taken" ? "Booked/Locked" : "Available"}`}
												>
													{seat.column_number}
												</button>
											);
										})}
									</div>
								))}
							</div>

							<div className="seat-legend">
								<div className="seat-legend-item"><span className="dot dot-available" /> Available</div>
								<div className="seat-legend-item"><span className="dot dot-selected" /> Selected</div>
								<div className="seat-legend-item"><span className="dot dot-taken" /> Booked / Locked</div>
							</div>
						</>
					) : (
						<div className="empty-state">Seat layout not generated for this studio yet.</div>
					)}
				</div>

				<div className="checkout-bar">
					<div className="summary">
						<span className="seats-info">
							{selectedSeats.length > 0
								? `Selected (${selectedSeats.length}): ${selectedSeats.map((s) => s.seat_number).join(", ")}`
								: "No seats selected"}
						</span>
						<span className="price-info">{formatIDR(totalAmount)}</span>
					</div>

					<button
						type="button"
						className="btn btn-primary"
						disabled={selectedSeats.length === 0 || locking}
						onClick={handleCheckout}
					>
						{locking ? "Locking Seats..." : "Proceed to Payment (Lock 5 Mins) →"}
					</button>
				</div>
			</main>
		</>
	);
}

export default Seating;
