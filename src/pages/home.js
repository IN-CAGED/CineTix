<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Cinetix - Home</title>

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

/* ================= HEADER ================= */

header{
    background:#2b2b2b;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:20px 60px;
}

.logo{
    font-size:3rem;
    font-weight:bold;
    color:#ff6600;
}

nav ul{
    display:flex;
    gap:40px;
    list-style:none;
}

nav a{
    color:white;
    text-decoration:none;
    font-size:1.4rem;
    font-weight:600;
}

nav a:hover{
    color:#ff6600;
}

.header-right{
    display:flex;
    gap:10px;
}

.search{
    width:220px;
    padding:10px;
    border:none;
}

.login-btn{
    padding:10px 25px;
    border:2px solid white;
    background:transparent;
    color:white;
    cursor:pointer;
}

/* ================= CAROUSEL ================= */

.carousel-container{
    position:relative;
    overflow:hidden;
    height:500px;
}

.slide{
    display:none;
    height:500px;
    justify-content:center;
    align-items:center;
    font-size:5rem;
    font-weight:bold;
    background:#d35400;
}

.slide.active{
    display:flex;
}

.arrow{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    font-size:3rem;
    cursor:pointer;
    padding:10px;
}

.left{
    left:20px;
}

.right{
    right:20px;
}

/* ================= NOW SHOWING ================= */

.section-title{
    font-size:4rem;
    margin:40px 80px;
}

.movies{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:30px;
    padding:0 80px 80px;
}

.movie-card{
    background:#444;
    padding:15px;
    transition:0.3s;
}

.movie-card:hover{
    transform:translateY(-5px);
}

.poster{
    height:350px;
    background:#d35400;
}

.movie-title{
    margin-top:15px;
    font-size:1.4rem;
}

.genre{
    color:#ccc;
    margin-top:5px;
}

.view-btn{
    display:block;
    text-align:center;
    margin-top:15px;
    background:#ff6600;
    color:white;
    text-decoration:none;
    padding:10px;
}

footer{
    background:#111;
    text-align:center;
    padding:20px;
}

</style>
</head>
<body>

<header>

<div class="logo">LOGO</div>

<nav>
<ul>
<li><a href="index.html">Home</a></li>
<li><a href="movieslist.html">Movies</a></li>
<li><a href="ticketlist.html">Tickets</a></li>
</ul>
</nav>

<div class="header-right">

<input
type="text"
class="search"
placeholder="Search Movie">

<button class="login-btn">
Login
</button>

</div>

</header>

<!-- Carousel -->

<section class="carousel-container">

<div class="slide active">
Movie Promotion 1
</div>

<div class="slide">
Movie Promotion 2
</div>

<div class="slide">
Movie Promotion 3
</div>

<div class="arrow left" onclick="prevSlide()">
❮
</div>

<div class="arrow right" onclick="nextSlide()">
❯
</div>

</section>

<h1 class="section-title">
NOW SHOWING
</h1>

<section class="movies">

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-title">
Movie One
</h2>

<p class="genre">
Action • 125 min
</p>

<a href="moviedetail.html"
class="view-btn">
View Detail
</a>

</div>

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-title">
Movie Two
</h2>

<p class="genre">
Sci-Fi • 145 min
</p>

<a href="moviedetail.html"
class="view-btn">
View Detail
</a>

</div>

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-title">
Movie Three
</h2>

<p class="genre">
Adventure • 135 min
</p>

<a href="moviedetail.html"
class="view-btn">
View Detail
</a>

</div>

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-title">
Movie Four
</h2>

<p class="genre">
Fantasy • 120 min
</p>

<a href="moviedetail.html"
class="view-btn">
View Detail
</a>

</div>

</section>

<footer>
© 2026 Cinetix Cinema
</footer>

<script>

let slides=document.querySelectorAll(".slide");
let current=0;

function showSlide(index){

slides.forEach(slide=>{
slide.classList.remove("active");
});

slides[index].classList.add("active");

}

function nextSlide(){

current++;

if(current>=slides.length)
current=0;

showSlide(current);

}

function prevSlide(){

current--;

if(current<0)
current=slides.length-1;

showSlide(current);

}

setInterval(nextSlide,5000);

</script>

</body>
</html>