import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public & Customer Pages
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import MovieDetail from "./pages/moviedetail.jsx";
import MoviesList from "./pages/movieslist.jsx";
import Seating from "./pages/seating.jsx";
import Payment from "./pages/payment.jsx";
import Account from "./pages/account.jsx";
import TicketList from "./pages/ticketlist.jsx";

// Admin & Cashier Portal Pages
import AdminLayout from "./pages/admin/layout.jsx";
import AdminDashboard from "./pages/admin/dashboard.jsx";
import AdminMovies from "./pages/admin/movies.jsx";
import AdminStudios from "./pages/admin/studios.jsx";
import AdminSchedules from "./pages/admin/schedules.jsx";
import AdminScanner from "./pages/admin/scanner.jsx";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Auth Routes */}
				<Route path="/" element={<Navigate to="/home" replace />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Main Customer / Public Routes */}
				<Route path="/home" element={<Home />} />
				<Route path="/movies" element={<MoviesList />} />
				<Route path="/movie-detail" element={<MovieDetail />} />
				<Route path="/seating" element={<Seating />} />
				<Route path="/payment" element={<Payment />} />
				<Route path="/tickets" element={<TicketList />} />
				<Route path="/account" element={<Account />} />

				{/* Admin & Cashier Portal Routes */}
				<Route path="/admin" element={<AdminLayout />}>
					<Route index element={<AdminDashboard />} />
					<Route path="movies" element={<AdminMovies />} />
					<Route path="studios" element={<AdminStudios />} />
					<Route path="schedules" element={<AdminSchedules />} />
					<Route path="scanner" element={<AdminScanner />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;