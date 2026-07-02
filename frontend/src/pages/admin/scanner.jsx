import { useState } from "react";
import { request } from "../../lib/api";

function AdminScanner() {
	const [tokenInput, setTokenInput] = useState("");
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleValidate = async (event) => {
		event.preventDefault();
		if (!tokenInput.trim()) return;

		setLoading(true);
		setResult(null);

		try {
			const res = await request("/bookings/validate-ticket", {
				method: "POST",
				body: { qr_token: tokenInput.trim() },
			});
			setResult({ success: res.valid, data: res });
		} catch (err) {
			setResult({ success: false, message: err.message || "Validation failed or ticket invalid." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ maxWidth: "600px" }}>
			<h1>Ticket Scanner & Validator (Kasir)</h1>
			<p className="muted" style={{ marginBottom: "24px" }}>
				Enter or scan the customer's E-Ticket QR token at the studio entrance gate.
			</p>

			<form onSubmit={handleValidate} className="panel" style={{ padding: "24px", marginBottom: "24px" }}>
				<div className="field">
					<span>QR Code Token</span>
					<input
						type="text"
						placeholder="Paste or scan UUID code..."
						value={tokenInput}
						onChange={(e) => setTokenInput(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary" disabled={loading}>
					{loading ? "Checking Manifest..." : "Validate Ticket"}
				</button>
			</form>

			{result && (
				<div className={`panel ${result.success ? "success-banner" : "error-banner"}`} style={{ padding: "24px", borderLeft: `6px solid ${result.success ? "var(--success)" : "var(--error)"}` }}>
					<h2 style={{ fontSize: "1.25rem", marginBottom: "12px", color: result.success ? "var(--success)" : "var(--error)" }}>
						{result.success ? "VALID TICKET — ALLOW ENTRY" : "INVALID TICKET"}
					</h2>

					{result.success && result.data?.ticket ? (
						<div style={{ lineHeight: 1.8, fontSize: "0.9375rem", color: "var(--text-main)" }}>
							<div><strong>Movie:</strong> {result.data.ticket.schedule?.movie?.title}</div>
							<div><strong>Studio:</strong> {result.data.ticket.schedule?.studio?.name}</div>
							<div><strong>Seat Number:</strong> <span style={{ fontSize: "1.25rem", color: "var(--primary)", fontWeight: 700 }}>{result.data.ticket.seat?.seat_number}</span></div>
							<div><strong>Customer Name:</strong> {result.data.ticket.transaction?.user?.name}</div>
							<div><strong>Showtime:</strong> {new Date(result.data.ticket.schedule?.start_time).toLocaleString("id-ID")}</div>
						</div>
					) : (
						<div>{result.message || result.data?.message || "Ticket is cancelled, expired, or unrecognized."}</div>
					)}
				</div>
			)}
		</div>
	);
}

export default AdminScanner;
