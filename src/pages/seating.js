<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Seat Selection</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Segoe UI,sans-serif;
}

body{
background:#222;
color:white;
}

/* HEADER */

header{

background:#2b2b2b;

padding:20px 50px;

display:flex;

justify-content:space-between;

align-items:center;

}

.logo{

font-size:2.5rem;

font-weight:bold;

color:#ff6600;

}

/* MAIN */

.seating-layout{

display:flex;

gap:30px;

padding:30px;

flex-wrap:wrap;

}

/* CINEMA */

.cinema{

flex:3;

min-width:700px;

background:#3d3d3d;

padding:30px;

border-radius:10px;

}

/* SCREEN */

.screen{

width:100%;

height:50px;

background:white;

border-radius:50px;

margin-bottom:40px;

color:black;

display:flex;

align-items:center;

justify-content:center;

font-weight:bold;

}

/* SEATS */

.seat-map{

display:flex;

flex-direction:column;

gap:12px;

align-items:center;

}

.row{

display:flex;

gap:10px;

}

.row-label{

width:30px;

font-weight:bold;

display:flex;

justify-content:center;

align-items:center;

}

.seat{

width:40px;

height:40px;

border-radius:6px;

cursor:pointer;

font-size:.75rem;

display:flex;

justify-content:center;

align-items:center;

}

.available{

background:#d1d1d1;

color:black;

}

.taken{

background:#d35400;

cursor:not-allowed;

}

.selected{

background:gold;

color:black;

}

/* LEGEND */

.legend{

display:flex;

justify-content:center;

gap:20px;

margin-top:30px;

flex-wrap:wrap;

}

.legend-item{

display:flex;

align-items:center;

gap:10px;

}

.box{

width:20px;

height:20px;

}

/* SUMMARY */

.summary{

flex:1;

min-width:300px;

background:#3d3d3d;

padding:20px;

border-radius:10px;

}

.poster{

height:250px;

background:#d35400;

margin-bottom:20px;

}

.summary h2{

margin-bottom:20px;

}

.summary p{

margin-bottom:10px;

}

.proceed-btn{

width:100%;

padding:15px;

margin-top:20px;

border:none;

font-size:1rem;

font-weight:bold;

cursor:pointer;

}

/* RESPONSIVE */

@media(max-width:1200px){

.cinema{

min-width:100%;

}

.summary{

width:100%;

}

}

</style>

</head>

<body>

<header>

<div class="logo">
LOGO
</div>

</header>

<div class="seating-layout">

<div class="cinema">

<div class="screen">

SCREEN

</div>

<div class="seat-map"
id="seatMap">

</div>

<div class="legend">

<div class="legend-item">

<div class="box available"></div>

Available

</div>

<div class="legend-item">

<div class="box taken"></div>

Taken

</div>

<div class="legend-item">

<div class="box selected"></div>

Selected

</div>

</div>

</div>

<div class="summary">

<div class="poster"></div>

<h2>
Booking Summary
</h2>

<p id="movieName"></p>

<p id="date"></p>

<p id="time"></p>

<p id="cinema"></p>

<p id="selectedSeats">
Seats: -
</p>

<p id="total">
Total: Rp0
</p>

<button
class="proceed-btn"
onclick="goPayment()">

Proceed

</button>

</div>

</div>

<script>

/* BOOKING DATA */

const booking =
JSON.parse(
localStorage.getItem("booking")
);

document.getElementById(
"movieName"
).innerHTML =
"Movie : " +
booking.movie;

document.getElementById(
"date"
).innerHTML =
"Date : " +
booking.date;

document.getElementById(
"time"
).innerHTML =
"Time : " +
booking.time;

document.getElementById(
"cinema"
).innerHTML =
"Cinema : " +
booking.cinema;

/* GENERATE SEATS */

const rows =
["A","B","C","D","E","F","G","H"];

const seatMap =
document.getElementById(
"seatMap"
);

const takenSeats =
[
"A3","A4","B5","B6",
"C2","D8","F7",
"G3","H5"
];

let selectedSeats = [];

rows.forEach(row=>{

    let rowDiv =
    document.createElement("div");

    rowDiv.className = "row";

    let label =
    document.createElement("div");

    label.className =
    "row-label";

    label.innerText = row;

    rowDiv.appendChild(label);

    for(let i=1;i<=10;i++){

        let seatCode =
        row+i;

        let seat =
        document.createElement("div");

        seat.innerText=i;

        seat.className="seat";

        if(
            takenSeats.includes(
            seatCode
            )
        ){

            seat.classList.add(
            "taken"
            );

        }
        else{

            seat.classList.add(
            "available"
            );

            seat.addEventListener(
            "click",
            ()=>toggleSeat(
            seat,
            seatCode
            )
            );

        }

        rowDiv.appendChild(
        seat
        );

    }

    seatMap.appendChild(
    rowDiv
    );

});

/* TOGGLE */

function toggleSeat(
element,
seatCode
){

if(
selectedSeats.includes(
seatCode
)
){

selectedSeats =
selectedSeats.filter(
s=>s!==seatCode
);

element.classList.remove(
"selected"
);

element.classList.add(
"available"
);

}
else{

if(
selectedSeats.length>=8
){

alert(
"Maximum 8 seats."
);

return;

}

selectedSeats.push(
seatCode
);

element.classList.remove(
"available"
);

element.classList.add(
"selected"
);

}

updateSummary();

}

function updateSummary(){

document.getElementById(
"selectedSeats"
).innerHTML=

"Seats : " +

(
selectedSeats.length
?
selectedSeats.join(", ")
:
"-"
);

const total =
selectedSeats.length *
booking.price;

document.getElementById(
"total"
).innerHTML=

"Total : Rp" +

total.toLocaleString(
"id-ID"
);

}

/* PAYMENT */

function goPayment(){

if(
selectedSeats.length===0
){

alert(
"Select at least 1 seat."
);

return;

}

booking.seats =
selectedSeats;

booking.total =
selectedSeats.length *
booking.price;

localStorage.setItem(
"booking",
JSON.stringify(
booking
)
);

window.location.href =
"payment.html";

}

</script>

</body>
</html>