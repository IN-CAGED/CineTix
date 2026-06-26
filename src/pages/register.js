<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Cinetix Register</title>

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
    margin-top:10px;
    text-align:center;
}

</style>
</head>
<body>

<div class="container">

<div class="logo">
CINETIX
</div>

<h2>Create Account</h2>

<input
type="text"
id="fullname"
placeholder="Full Name">

<input
type="email"
id="email"
placeholder="Email">

<input
type="text"
id="username"
placeholder="Username">

<input
type="password"
id="password"
placeholder="Password">

<input
type="password"
id="confirmPassword"
placeholder="Confirm Password">

<button onclick="register()">
Register
</button>

<div class="error" id="error"></div>

<p>
Already have an account?
<a href="login.html">Login</a>
</p>

</div>

<script>

function register(){

let fullname =
document.getElementById("fullname").value;

let email =
document.getElementById("email").value;

let username =
document.getElementById("username").value;

let password =
document.getElementById("password").value;

let confirmPassword =
document.getElementById("confirmPassword").value;

let error =
document.getElementById("error");

error.innerHTML="";

if(
fullname==="" ||
email==="" ||
username==="" ||
password===""
){
    error.innerHTML =
    "Please fill all fields.";
    return;
}

if(password !== confirmPassword){

    error.innerHTML =
    "Passwords do not match.";

    return;
}

let user = {

    fullname:fullname,
    email:email,
    username:username,
    password:password

};

localStorage.setItem(
    "cinetixUser",
    JSON.stringify(user)
);

alert(
"Registration successful!"
);

window.location.href =
"login.html";

}

</script>

</body>
</html>