<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Cinetix - Movies</title>

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
list-style:none;
gap:40px;
}

nav a{
text-decoration:none;
color:white;
font-size:1.4rem;
font-weight:600;
}

.page-title{
font-size:3rem;
padding:40px 80px 20px;
}

.movie-wrapper{
padding:20px 80px 80px;
background:#3f3f3f;
margin:0 80px 80px;
}

.movie-grid{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(250px,1fr));

gap:40px;

}

.movie-card{
text-align:center;
}

.poster{
height:350px;
background:#d35400;
}

.movie-name{
margin-top:15px;
font-size:2rem;
}

.movie-info{
margin-top:10px;
color:#ddd;
}

.btn{

display:block;

margin-top:15px;

padding:12px;

background:#ff6600;

color:white;

text-decoration:none;

font-weight:bold;

}

.btn:hover{
background:#ff7d1a;
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
Now Showing
</h1>

<section class="movie-wrapper">

<div class="movie-grid">

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-name">
Movie 1
</h2>

<p class="movie-info">
Action • PG-13 • 125 min
</p>

<a href="moviedetail.html"
class="btn">

View Detail

</a>

</div>

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-name">
Movie 2
</h2>

<p class="movie-info">
Sci-Fi • PG-13 • 140 min
</p>

<a href="moviedetail.html"
class="btn">

View Detail

</a>

</div>

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-name">
Movie 3
</h2>

<p class="movie-info">
Adventure • PG • 115 min
</p>

<a href="moviedetail.html"
class="btn">

View Detail

</a>

</div>

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-name">
Movie 4
</h2>

<p class="movie-info">
Fantasy • PG-13 • 135 min
</p>

<a href="moviedetail.html"
class="btn">

View Detail

</a>

</div>

<div class="movie-card">

<div class="poster"></div>

<h2 class="movie-name">
Movie 5
</h2>

<p class="movie-info">
Thriller • R • 120 min
</p>

<a href="moviedetail.html"
class="btn">

View Detail

</a>

</div>

</div>

</section>

</body>
</html>