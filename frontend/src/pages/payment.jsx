import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header/header.jsx";
import { api } from "../lib/api";

function formatIDR(amount) {
	return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);
}

function Payment() {
	const location = useLocation();
	const navigate = useNavigate();
	const stateData = location.state || {};

	const [tx, setTx] = useState(stateData.transaction || null);
	const [expiresAt, setExpiresAt] = useState(stateData.expires_at || null);
	const [selectedSeats, setSelectedSeats] = useState(stateData.selectedSeats || []);
	const [schedule, setSchedule] = useState(stateData.schedule || null);
	const [loadingRestored, setLoadingRestored] = useState(!stateData.transaction);

	const [method, setMethod] = useState("card");
	const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (tx) return;
		const restorePending = async () => {
			try {
				const pending = await api.get("/bookings/my-pending");
				if (Array.isArray(pending) && pending.length > 0) {
					const active = pending[0];
					setTx(active);
					setExpiresAt(active.expires_at);
					setSelectedSeats(active.tickets?.map((t) => t.seat).filter(Boolean) || []);
					setSchedule(active.schedule || null);
				}
			} catch (e) {
				console.error("Failed restoring pending tx:", e);
			} finally {
				setLoadingRestored(false);
			}
		};
		restorePending();
	}, [tx]);

	useEffect(() => {
		if (!expiresAt) return;

		const updateTimer = () => {
			const target = new Date(expiresAt).getTime();
			const now = new Date().getTime();
			const diff = Math.max(0, Math.floor((target - now) / 1000));
			setTimeLeft(diff);

			if (diff === 0) {
				alert("Payment time expired! Your seat reservation has been released.");
				navigate("/seating");
			}
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, [expiresAt, navigate]);

	if (loadingRestored) {
		return (
			<>
				<Header />
				<main className="page">
					<div className="loading-center"><div className="spinner" /></div>
				</main>
			</>
		);
	}

	if (!tx) {
		return (
			<>
				<Header />
				<main className="page">
					<div className="empty-state" style={{ padding: "64px 20px" }}>
						<p style={{ marginBottom: "16px" }}>No active pending transaction found.</p>
						<button type="button" className="btn btn-primary" onClick={() => navigate("/movies")}>
							Browse Movies & Book Seats
						</button>
					</div>
				</main>
			</>
		);
	}

	const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
	const seconds = String(timeLeft % 60).padStart(2, "0");

	const handleConfirm = async () => {
		setSubmitting(true);
		setError("");

		try {
			await api.post("/bookings/confirm-payment", {
				transaction_id: tx.id,
				payment_method: method,
			});

			navigate("/tickets");
		} catch (err) {
			setError(err.message || "Payment processing failed.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Header />

			<main className="page">
				<h1 style={{ marginBottom: "28px" }}>Secure Checkout & Payment</h1>

				{error && <div className="banner error-banner">{error}</div>}

				<div className="payment-layout">
					<div>
						<div className={`countdown-timer ${timeLeft < 60 ? "urgent" : ""}`}>
							<div className="timer-label">Time Remaining to Complete Payment</div>
							<div className="timer-value">{minutes}:{seconds}</div>
							<div className="muted" style={{ fontSize: "0.75rem", marginTop: "4px" }}>
								Seats are locked. If time runs out, seats will automatically return to Available status.
							</div>
						</div>

						<div className="panel" style={{ padding: "24px" }}>
							<h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Select Payment Option</h2>

							<div className="payment-methods">
								<div
									className={`payment-method ${method === "card" ? "active" : ""}`}
									onClick={() => setMethod("card")}
								>
									<div className="method-icon">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
									</div>
									<div>
										<div className="method-name">Virtual Credit / Debit Card (Midtrans Simulation)</div>
										<div className="muted" style={{ fontSize: "0.75rem" }}>Instant verification via Visa / Mastercard VA</div>
									</div>
								</div>

								<div
									className={`payment-method ${method === "e-wallet" ? "active" : ""}`}
									onClick={() => setMethod("e-wallet")}
								>
									<div className="method-icon">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
									</div>
									<div>
										<div className="method-name">QRIS / E-Wallet (GoPay, OVO, Dana)</div>
										<div className="muted" style={{ fontSize: "0.75rem" }}>Scan QR code from mobile banking apps</div>
									</div>
								</div>

								<div
									className={`payment-method ${method === "cash" ? "active" : ""}`}
									onClick={() => setMethod("cash")}
								>
									<div className="method-icon">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
									</div>
									<div>
										<div className="method-name">Retail / Cinema Counter Cash Pay</div>
										<div className="muted" style={{ fontSize: "0.75rem" }}>Pay at Cinetix ticketing booth</div>
									</div>
								</div>
							</div>

							<button
								type="button"
								className="btn btn-primary btn-block"
								disabled={submitting || timeLeft === 0}
								onClick={handleConfirm}
							>
								{submitting ? "Processing Transaction..." : `Pay Now ${formatIDR(tx.total_amount)}`}
							</button>
						</div>
					</div>

					<div className="panel payment-summary">
						<h2>Order Summary</h2>
						<div className="summary-row">
							<span className="label">Movie Title</span>
							<span>{schedule?.movie?.title || "Movie"}</span>
						</div>
						<div className="summary-row">
							<span className="label">Studio Hall</span>
							<span>{schedule?.studio?.name || "Studio"}</span>
						</div>
						<div className="summary-row">
							<span className="label">Showtime</span>
							<span>{schedule?.start_time ? new Date(schedule.start_time).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "Scheduled"}</span>
						</div>
						<div className="summary-row">
							<span className="label">Seats ({selectedSeats?.length || 0})</span>
							<span style={{ fontWeight: 700, color: "var(--primary)" }}>
								{selectedSeats?.map((s) => s.seat_number).join(", ") || "Assigned"}
							</span>
						</div>
						<div className="summary-row">
							<span className="label">Price / Seat</span>
							<span>{formatIDR(schedule?.ticket_price)}</span>
						</div>
						<div className="summary-row total">
							<span>Total Tagihan</span>
							<span className="value">{formatIDR(tx.total_amount)}</span>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

export default Payment;
