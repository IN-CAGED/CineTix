import { Link, useNavigate } from "react-router-dom";
import "./header.css";

function Header() {

    const navigate = useNavigate();

    const loggedIn =
        localStorage.getItem("loggedIn");

    const logout = () => {

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loggedUser");

        navigate("/login");
    };

    return (

        <header className="header">

            <div className="logo">
                CINETIX
            </div>

            <nav>

                <ul>

                    <li>
                        <Link to="/home">
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/movies">
                            Movies
                        </Link>
                    </li>

                    <li>
                        <Link to="/tickets">
                            Tickets
                        </Link>
                    </li>

                    <li>
                        <Link to="/account">
                            Account
                        </Link>
                    </li>

                </ul>

            </nav>

            <button
                className="login-btn"
                onClick={() =>
                    loggedIn
                    ? logout()
                    : navigate("/login")
                }
            >

                {
                    loggedIn
                    ? "Logout"
                    : "Login"
                }

            </button>

        </header>

    );
}

export default Header;