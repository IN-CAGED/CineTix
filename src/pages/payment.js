
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Cinetix Payment</title>

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

.container{

display:flex;

gap:30px;

padding:30px;

flex-wrap:wrap;

}

.summary{

width:320px;

background:#3f3f3f;

padding:20px;

border-radius:10px;

}

.poster{

height:300px;

background:#d35400;

margin-bottom:20px;

}

.summary p{

margin:10px 0;

}

.payment-box{

flex:1;

background:#3f3f3f;

padding:25px;

border-radius:10px;

}

.tabs{

display:flex;

gap:10px;

margin-bottom:30px;

flex-wrap:wrap;

}

.tab{

padding:12px 25px;

border:none;

cursor:pointer;

font-weight:bold;

background:#666;

color:white;

}

.tab.active{

background:#d35400;

}

.payment-content{

display:none;

}

.payment-content.active{

display:block;

}

input,
select{

width:100%;

padding:12px;

margin-top:10px;

margin-bottom:20px;

font-size:1rem;

}

.row{

display:flex;

gap:15px;

}

.checkout-btn{

background:white;

color:black;

border:none;

padding:15px 25px;

font-weight:bold;

cursor:pointer;

margin-top:20px;

}

#qrisDisplay,
#retailDisplay{

margin-top:20px;

text-align:center;

}

.qr-box{

width:250px;

height:250px;

background:white;

margin:auto;

display:flex;

align-items:center;

justify-content:center;

color:black;

font-weight:bold;

}

.barcode{

font-family:monospace;

font-size:1.4rem;

letter-spacing:2px;

margin-top:15px;

}

@media(max-width:900px){

.container{

flex-direction:column;

}

.summary{

width:100%;

}

}

</style>

</head>

<body>

<header>

<div class="logo">LOGO</div>

</header>

<div class="container">

<div class="summary">

<div class="poster"></div>

<h2>Booking Summary</h2>

<p id="movie"></p>
<p id="date"></p>
<p id="time"></p>
<p id="cinema"></p>
<p id="seats"></p>
<p id="total"></p>

</div>

<div class="payment-box">

<div class="tabs">

<button
class="tab active"
onclick="switchTab('credit',this)">
Credit
</button>

<button
class="tab"
onclick="switchTab('qris',this)">
QRIS
</button>

<button
class="tab"
onclick="switchTab('retail',this)">
Pay At Retail
</button>

</div>

<!-- CREDIT -->

<div
id="credit"
class="payment-content active">

<h2>Payment Information</h2>

<label>Bank</label>

<select id="bank">

<option>Visa</option>
<option>MasterCard</option>
<option>Mandiri</option>

</select>

<label>Card Number</label>

<input
id="cardNumber"
placeholder="1234 5678 9012 3456">

<div class="row">

<div>

<label>Expiration</label>

<input
id="expiry"
placeholder="MM/YYYY">

</div>

<div>

<label>CVV</label>

<input
id="cvv"
maxlength="3">

</div>

</div>

<label>Name on Card</label>

<input
id="cardName"
placeholder="John Doe">

<button
class="checkout-btn"
onclick="checkoutCredit()">

Checkout

</button>

</div>

<!-- QRIS -->

<div
id="qris"
class="payment-content">

<h2>QRIS Payment</h2>

<p>
Click Generate QR and scan
using your e-wallet.
</p>

<button
class="checkout-btn"
onclick="generateQRIS()">

Generate QRIS

</button>

<div id="qrisDisplay"></div>

</div>

<!-- RETAIL -->

<div
id="retail"
class="payment-content">

<h2>Retail Payment</h2>

<select id="retailStore">

<option>Alfamart</option>
<option>Indomaret</option>

</select>

<button
class="checkout-btn"
onclick="generateRetail()">

Generate Payment Code

</button>

<div id="retailDisplay"></div>

</div>

</div>

</div>

<script>

/* BOOKING */

const booking =
JSON.parse(
localStorage.getItem("booking")
);

document.getElementById("movie")
.innerHTML =
"Movie : " +
booking.movie;

document.getElementById("date")
.innerHTML =
"Date : " +
booking.date;

document.getElementById("time")
.innerHTML =
"Time : " +
booking.time;

document.getElementById("cinema")
.innerHTML =
"Cinema : " +
booking.cinema;

document.getElementById("seats")
.innerHTML =
"Seats : " +
booking.seats.join(", ");

document.getElementById("total")
.innerHTML =
"Total : Rp" +
booking.total.toLocaleString("id-ID");

/* TAB */

function switchTab(id,button){

document
.querySelectorAll(".payment-content")
.forEach(content=>{

content.classList.remove("active");

});

document
.querySelectorAll(".tab")
.forEach(tab=>{

tab.classList.remove("active");

});

document
.getElementById(id)
.classList.add("active");

button.classList.add("active");

}

/* SAVE */

function saveTicket(method){

let tickets =
JSON.parse(
localStorage.getItem("tickets")
) || [];

tickets.push({

...booking,

paymentMethod:method,

purchaseDate:
new Date()
.toLocaleString()

});

localStorage.setItem(
"tickets",
JSON.stringify(tickets)
);

window.location.href =
"ticketlist.html";

}

/* CREDIT */

function checkoutCredit(){

let card =
document
.getElementById("cardNumber")
.value
.replace(/\s/g,'');

let cvv =
document
.getElementById("cvv")
.value;

let name =
document
.getElementById("cardName")
.value;

if(
card.length < 16 ||
cvv.length !== 3 ||
name === ""
){

alert(
"Please fill card information correctly."
);

return;

}

saveTicket("Credit Card");

}

/* QRIS */

function generateQRIS(){

document
.getElementById("qrisDisplay")
.innerHTML =

`

<div class="qr-box">

QR CODE

</div>

<br>

<button
class="checkout-btn"
onclick="saveTicket('QRIS')">

I've Paid

</button>

`;

}

/* RETAIL */

function generateRetail(){

let store =
document
.getElementById("retailStore")
.value;

let code =
Math.floor(
100000000 +
Math.random() * 900000000
);

document
.getElementById("retailDisplay")
.innerHTML =

`

<h3>${store}</h3>

<h2>${code}</h2>

<div class="barcode">

|||| |||| || |||| ||||

</div>

<br>

<button
class="checkout-btn"
onclick="saveTicket('${store}')">

Confirm Payment

</button>

`;

}

</script>

</body>
</html>