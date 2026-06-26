import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "../header/header";

import "./home.css";

function Home() {

    const slides = [

        "Movie Promotion 1",
        "Movie Promotion 2",
        "Movie Promotion 3"

    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrent(prev =>
                prev === slides.length - 1
                ? 0
                : prev + 1
            );

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    const nextSlide = () => {

        setCurrent(
            current === slides.length - 1
            ? 0
            : current + 1
        );

    };

    const prevSlide = () => {

        setCurrent(
            current === 0
            ? slides.length - 1
            : current - 1
        );

    };

    const movies = [

        {
            title:"Movie One",
            genre:"Action • 125 min"
        },

        {
            title:"Movie Two",
            genre:"Sci-Fi • 145 min"
        },

        {
            title:"Movie Three",
            genre:"Adventure • 135 min"
        },

        {
            title:"Movie Four",
            genre:"Fantasy • 120 min"
        }

    ];

    return (

        <>

            <Header />

            <section className="carousel-container">

                <div className="slide active">

                    {slides[current]}

                </div>

                <div
                    className="arrow left"
                    onClick={prevSlide}
                >
                    ❮
                </div>

                <div
                    className="arrow right"
                    onClick={nextSlide}
                >
                    ❯
                </div>

            </section>

            <h1 className="section-title">
                NOW SHOWING
            </h1>

            <section className="movies">

                {

                    movies.map((movie,index)=>(

                        <div
                            key={index}
                            className="movie-card"
                        >

                            <div className="poster"></div>

                            <h2 className="movie-title">

                                {movie.title}

                            </h2>

                            <p className="genre">

                                {movie.genre}

                            </p>

                            <Link
                                to="/movie-detail"
                                className="view-btn"
                            >

                                View Detail

                            </Link>

                        </div>

                    ))

                }

            </section>

            <footer>

                © 2026 Cinetix Cinema

            </footer>

        </>

    );
}

export default Home;