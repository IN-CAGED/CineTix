import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import MovieDetail from "./pages/moviedetail";
import MoviesList from "./pages/movieslist";
import Seating from "./pages/seating";
import Payment from "./pages/payment";
import Account from "./pages/account";
import TicketList from "./pages/ticketlist";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* without header */}

                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />


                {/* pages with header */}

                <Route path="/home" element={<Home />} />

                <Route
                    path="/movies"
                    element={<MoviesList />}
                />

                <Route
                    path="/movie-detail"
                    element={<MovieDetail />}
                />

                <Route
                    path="/seating"
                    element={<Seating />}
                />

                <Route
                    path="/payment"
                    element={<Payment />}
                />

                <Route
                    path="/tickets"
                    element={<TicketList />}
                />

                <Route
                    path="/account"
                    element={<Account />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;