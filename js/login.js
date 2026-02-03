const form = document.getElementById("form");
const userName = document.getElementById("userName");
const userPass = document.getElementById("password");

form.addEventListener("submit", loginUser);

async function loginUser(e){
    e.preventDefault();

    const name = userName.value.trim().toLowerCase();
    const pass = userPass.value.trim();

    if(!name || !pass){
        alert("Empty fields");
        return;
    }

    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    const userFound = users.find(u => u.email === name);

    if(!userFound){
        alert("User not found");
        return;
    }

    if(userFound.password !== pass){
        alert("Wrong password");
        return;
    }

    // ⭐ GUARDAR SESIÓN
    sessionStorage.setItem("currentUser", JSON.stringify(userFound));

    redirectByRole(userFound.role);
}

function redirectByRole(role){
    if(role === "admin"){
        window.location.href = "pages/admin.html";
    } else {
        window.location.href = "pages/user.html";
    }
}
