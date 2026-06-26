<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Cinetix Login</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Segoe UI,sans-serif;
}

body{
    background:#222;
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
}

.container{
    width:420px;
    background:#2b2b2b;
    padding:40px;
    border-radius:15px;
    box-shadow:0 0 15px rgba(0,0,0,.4);
}

.logo{
    text-align:center;
    font-size:3rem;
    font-weight:bold;
    color:#ff6600;
    margin-bottom:30px;
}

h2{
    text-align:center;
    color:white;
    margin-bottom:25px;
}

input{
    width:100%;
    padding:14px;
    margin-bottom:20px;
    border:none;
    border-radius:8px;
    font-size:1rem;
}

button{
    width:100%;
    padding:14px;
    border:none;
    border-radius:8px;
    background:#ff6600;
    color:white;
    font-size:1rem;
    cursor:pointer;
    font-weight:bold;
}

button:hover{
    background:#ff7b1a;
}

p{
    color:white;
    text-align:center;
    margin-top:20px;
}

a{
    color:#ff6600;
    text-decoration:none;
}

.error{
    color:#ff4d4d;
    text-align:center;
    margin-top:10px;
}

</style>
</head>
<body>

<div class="container">

<div class="logo">
CINETIX
</div>

<h2>Login</h2>

<input
type="text"
id="username"
placeholder="Username">

<input
type="password"
id="password"
placeholder="Password">

<button onclick="login()">
Login
</button>

<div class="error" id="error"></div>

<p>
Don't have an account?
<a href="register.html">
Register
</a>
</p>

</div>

<script>

function login(){

let username =
document.getElementById("username").value;

let password =
document.getElementById("password").value;

let savedUser =
JSON.parse(
localStorage.getItem("cinetixUser")
);

let error =
document.getElementById("error");

error.innerHTML = "";

if(!savedUser){

    error.innerHTML =
    "No registered account found.";

    return;
}

if(
username === savedUser.username &&
password === savedUser.password
){

    localStorage.setItem(
        "loggedIn",
        true
    );

    localStorage.setItem(
        "loggedUser",
        savedUser.fullname
    );

    alert(
    "Login successful!"
    );

    window.location.href =
    "index.html";

}
else{

    error.innerHTML =
    "Invalid username or password.";

}

}

</script>

</body>
</html>