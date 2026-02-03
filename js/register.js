const form = document.getElementById("form");
const userName = document.getElementById("userName");
const emails= document.getElementById("email")
const password = document.getElementById("password");
const confirmpass = document.getElementById("confirmPass")


form.addEventListener("submit", registerUser);

async function registerUser(e){
    e.preventDefault();

    const name = userName.value.trim().toLowerCase();
    const pass = password.value.trim();
    const email = emails.value.trim();
    const confPass = confirmpass.value.trim()
    const role = "user";

    if(!name || !pass || !email || !confPass){
        alert("Complete all fields");
        return;
    }

    if(pass !== confPass){
        alert("passwords incorrect")
        return;
    }

    urlUser = "http://localhost:3000/users"
    // get users
    const res = await fetch(urlUser);
    const users = await res.json();

    // validar duplicado
    if(users.find(u => u.name === name)){
        alert("User already exists");
        return;
    }

    // guardar en db.json
    await fetch(urlUser, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ name, password: pass, email, role })
    });

    alert("User registered!");

    form.reset();
}
