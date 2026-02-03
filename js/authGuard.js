function requireAuth(allowedRoles = []){

    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    if(!user){
        window.location.href = "../index.html";
        return;
    }

    if(allowedRoles.length && !allowedRoles.includes(user.role)){
        window.location.href = "../index.html";
        return;
    }
}

function logout(){
    sessionStorage.removeItem("currentUser");
    window.location.href = "../index.html";
}

function goBackToUser(){
    sessionStorage.getItem("currentUser");
    window.location.href = "user.html"
}