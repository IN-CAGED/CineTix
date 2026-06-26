<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Cinetix Account</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Segoe UI',sans-serif;
}

body{
    background:#222;
    color:white;
}

/* HEADER */

header{
    background:#2b2b2b;
    padding:20px 60px;

    display:flex;
    justify-content:space-between;
    align-items:center;
}

.logo{
    font-size:2.8rem;
    font-weight:bold;
    color:#ff6600;
}

nav ul{
    list-style:none;
    display:flex;
    gap:40px;
}

nav a{
    text-decoration:none;
    color:white;
    font-size:1.2rem;
}

nav a:hover{
    color:#ff6600;
}

/* PROFILE */

.profile-container{

    max-width:1100px;

    margin:50px auto;

    padding:40px;

    background:#333;

    border-radius:15px;

    display:flex;

    gap:50px;

    flex-wrap:wrap;
}

/* LEFT */

.profile-left{

    flex:1;

    min-width:280px;

    text-align:center;
}

.profile-pic{

    width:220px;
    height:220px;

    border-radius:50%;

    object-fit:cover;

    border:5px solid #ff6600;

    margin-bottom:20px;
}

.upload-btn{

    background:#ff6600;

    border:none;

    color:white;

    padding:12px 20px;

    cursor:pointer;

    border-radius:8px;

    margin-top:10px;
}

input[type=file]{

    display:none;
}

/* RIGHT */

.profile-right{

    flex:2;

    min-width:300px;
}

.profile-right h1{

    margin-bottom:30px;

    color:#ff6600;
}

.info-card{

    background:#444;

    padding:20px;

    border-radius:10px;

    margin-bottom:20px;
}

.info-card h3{

    color:#ff6600;

    margin-bottom:10px;
}

.quick-actions{

    display:grid;

    grid-template-columns:
    repeat(auto-fit,minmax(180px,1fr));

    gap:20px;

    margin-top:30px;
}

.action-btn{

    background:#ff6600;

    color:white;

    padding:20px;

    text-align:center;

    border-radius:10px;

    text-decoration:none;

    font-weight:bold;

    transition:.3s;
}

.action-btn:hover{

    transform:translateY(-5px);

    background:#ff7b1a;
}

.logout-btn{

    width:100%;

    margin-top:30px;

    padding:15px;

    background:#d63031;

    border:none;

    color:white;

    font-size:1rem;

    cursor:pointer;

    border-radius:10px;
}

.logout-btn:hover{

    background:#e74c3c;
}

@media(max-width:800px){

    .profile-container{

        flex-direction:column;

        margin:20px;
    }

    header{

        flex-direction:column;

        gap:20px;
    }

}

</style>
</head>

<body>

<header>

<div class="logo">
CINETIX
</div>

<nav>

<ul>

<li><a href="index.html">Home</a></li>

<li><a href="movieslist.html">Movies</a></li>

<li><a href="ticketlist.html">Tickets</a></li>

<li><a href="account.html">Account</a></li>

</ul>

</nav>

</header>

<div class="profile-container">

    <!-- LEFT SIDE -->

    <div class="profile-left">

        <img
        src="https://via.placeholder.com/220"
        class="profile-pic"
        id="profileImage">

        <br>

        <label
        for="uploadPic"
        class="upload-btn">

        Change Picture

        </label>

        <input
        type="file"
        id="uploadPic"
        accept="image/*">

    </div>

    <!-- RIGHT SIDE -->

    <div class="profile-right">

        <h1>My Account</h1>

        <div class="info-card">

            <h3>Full Name</h3>

            <p id="fullname">
            John Doe
            </p>

        </div>

        <div class="info-card">

            <h3>Username</h3>

            <p id="username">
            User 1
            </p>

        </div>

        <div class="info-card">

            <h3>Email</h3>

            <p id="email">
            user1@gmail.com
            </p>

        </div>

        <div class="info-card">

            <h3>Tickets Owned</h3>

            <p id="ticketCount">
            0 Tickets
            </p>

        </div>

        <div class="quick-actions">

            <a
            href="ticketlist.html"
            class="action-btn">

            🎟 Tickets

            </a>
        </div>

        <button
        class="logout-btn"
        onclick="logout()">

        Logout

        </button>

    </div>

</div>

<script>

/* LOAD USER */

const user =
JSON.parse(
localStorage.getItem(
"cinetixUser"
)
);

if(user){

    document
    .getElementById("fullname")
    .innerText =
    user.fullname;

    document
    .getElementById("username")
    .innerText =
    user.username;

    document
    .getElementById("email")
    .innerText =
    user.email;
}

/* LOAD TICKETS */

const tickets =
JSON.parse(
localStorage.getItem(
"tickets"
)) || [];

document
.getElementById(
"ticketCount"
)
.innerText =
tickets.length +
" Ticket(s)";

/* PROFILE PICTURE */

const savedPic =
localStorage.getItem(
"profilePicture"
);

if(savedPic){

    document
    .getElementById(
    "profileImage"
    ).src = savedPic;
}

document
.getElementById("uploadPic")
.addEventListener(
"change",
function(){

const file =
this.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(e){

document
.getElementById(
"profileImage"
).src =
e.target.result;

localStorage.setItem(
"profilePicture",
e.target.result
);

};

reader.readAsDataURL(file);

});

/* LOGOUT */

function logout(){

localStorage.removeItem(
"loggedIn"
);

localStorage.removeItem(
"loggedUser"
);

window.location.href =
"login.html";

}

</script>

</body>
</html>