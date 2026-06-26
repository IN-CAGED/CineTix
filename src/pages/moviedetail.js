<link rel="stylesheet">
<html>
<head>
    <title>Movie Detail</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<header>
    <div class="logo">LOGO</div>
</header>

<div class="movie-container">

    <div class="poster">
        <img src="images/movie1.png">

        <h2>Synopsis</h2>

        <p>
            A young man on Earth discovers a fabulous secret legacy as the prince of an alien planet, and must recover a magic sword and return home to protect his kingdom.
        </p>
    </div>

    <div class="movie-info">

        <h1>Masters of the Universe</h1>

        <p><strong>Genre:</strong> Action, Adventure</p>
        <p><strong>Duration:</strong> 2H 20M</p>
        <p><strong>Rating:</strong> PG-13</p>
        <p><strong>Director:</strong> Travis Knight</p>

        <br>

        <h2>Schedule</h2>

        <div class="schedule-box">

            <button class="date-btn">
                APR 25
            </button>

            <button class="date-btn">
                APR 26
            </button>

            <button class="date-btn">
                APR 27
            </button>

        </div>

        <div class="schedule-box">

            <h2>Cinema 1</h2>

            <p>Price : Rp45.000</p>

            <button class="time-btn">
                11:00
            </button>

            <button class="time-btn">
                15:00
            </button>

            <button class="time-btn">
                18:30
            </button>

        </div>

        <div class="schedule-box">

            <h2>Cinema 2</h2>

            <p>Price : Rp45.000</p>

            <button class="time-btn">
                11:00
            </button>

            <button class="time-btn">
                15:00
            </button>

            <button class="time-btn">
                18:30
            </button>

        </div>

        <button class="proceed-btn">
            Select Seat
        </button>

    </div>

</div>

<script>

let selectedDate = "";
let selectedTime = "";
let selectedCinema = "";
let selectedPrice = 45000;

/* DATE BUTTONS */

document.querySelectorAll(".date-btn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll(".date-btn")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        selectedDate = btn.innerText;

    });

});

/* TIME BUTTONS */

document.querySelectorAll(".schedule-box").forEach(box=>{

    let cinemaName = box.querySelector("h2");

    if(!cinemaName) return;

    box.querySelectorAll(".time-btn").forEach(btn=>{

        btn.addEventListener("click",()=>{

            document.querySelectorAll(".time-btn")
            .forEach(b=>b.classList.remove("active"));

            btn.classList.add("active");

            selectedTime = btn.innerText;
            selectedCinema = cinemaName.innerText;

        });

    });

});

/* PROCEED */

document.querySelector(".proceed-btn")
.addEventListener("click",()=>{

    if(
        selectedDate === "" ||
        selectedTime === ""
    ){

        alert(
        "Please select date and time first."
        );

        return;
    }

    const movieData = {

        movie:
        "Masters of the Universe",

        date:
        selectedDate,

        time:
        selectedTime,

        cinema:
        selectedCinema,

        price:
        selectedPrice

    };

    localStorage.setItem(
        "booking",
        JSON.stringify(movieData)
    );

    window.location.href =
    "seating.html";

});

</script>

</body>
</html>