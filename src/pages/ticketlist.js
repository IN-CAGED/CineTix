
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>My Tickets</title>

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

nav ul{

display:flex;

list-style:none;

gap:40px;

}

nav a{

text-decoration:none;

color:white;

font-size:1.2rem;

}

.page-title{

padding:30px 50px;

font-size:2rem;

}

.ticket-list{

padding:0 50px 50px;

display:flex;

flex-direction:column;

gap:25px;

}

.ticket{

background:#3f3f3f;

padding:20px;

display:flex;

gap:25px;

align-items:center;

flex-wrap:wrap;

}

.poster{

width:120px;

height:160px;

background:#d35400;

}

.ticket-info{

flex:1;

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(150px,1fr));

gap:15px;

}

.ticket-info div{

text-align:center;

}

.ticket-info h3{

margin-bottom:5px;

}

.empty{

text-align:center;

padding:100px;

font-size:1.3rem;

}

.clear-btn{

margin:20px 50px;

padding:12px 20px;

cursor:pointer;

font-weight:bold;

}

</style>

</head>

<body>

<header>

<div class="logo">
LOGO
</div>

<nav>

<ul>

<li>
<a href="index.html">
Home
</a>
</li>

<li>
<a href="movieslist.html">
Movies
</a>
</li>

<li>
<a href="ticketlist.html">
Tickets
</a>
</li>

</ul>

</nav>

</header>

<h1 class="page-title">
My Tickets
</h1>

<button
class="clear-btn"
onclick="clearTickets()">

Clear All Tickets

</button>

<div
class="ticket-list"
id="ticketList">

</div>

<script>

const ticketList =
document.getElementById(
"ticketList"
);

const tickets =
JSON.parse(
localStorage.getItem("tickets")
) || [];

if(
tickets.length === 0
){

ticketList.innerHTML =

`

<div class="empty">

No tickets purchased yet.

</div>

`;

}
else{

tickets.forEach(ticket=>{

ticketList.innerHTML +=

`

<div class="ticket">

<div class="poster"></div>

<div class="ticket-info">

<div>

<h3>Movie</h3>

<p>
${ticket.movie}
</p>

</div>

<div>

<h3>Date</h3>

<p>
${ticket.date}
</p>

</div>

<div>

<h3>Time</h3>

<p>
${ticket.time}
</p>

</div>

<div>

<h3>Seats</h3>

<p>
${ticket.seats.join(", ")}
</p>

</div>

<div>

<h3>Total</h3>

<p>

Rp${ticket.total
.toLocaleString("id-ID")}

</p>

</div>

<div>

<h3>Payment</h3>

<p>
${ticket.paymentMethod}
</p>

</div>

</div>

</div>

`;

});

}

function clearTickets(){

if(
confirm(
"Delete all tickets?"
)
){

localStorage.removeItem(
"tickets"
);

location.reload();

}

}

</script>

</body>
</html>