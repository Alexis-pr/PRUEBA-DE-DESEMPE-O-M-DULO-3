const container = document.getElementById("userCards");
const searchInput = document.getElementById("search");

let users = [];
let orders = [];



// cargar datos

async function loadData(){

    const usersRes = await fetch("http://localhost:3000/users");
    users = await usersRes.json();

    const ordersRes = await fetch("http://localhost:3000/orders");
    orders = await ordersRes.json();

    renderCards(users);
}



// agrupar pedidos por usuario

function getOrdersByUser(userId){
    return orders.filter(o => o.userId === userId);
}



// render tarjetas

function renderCards(list){

    container.innerHTML = "";

    list.forEach(user => {

        const userOrders = getOrdersByUser(user.id);

        if(userOrders.length === 0) return;

        const card = document.createElement("div");

        card.className = `
            bg-white rounded-2xl shadow-lg p-5 cursor-pointer
            hover:shadow-xl transition
        `;

        card.innerHTML = `
            <h2 class="text-xl font-bold mb-2">${user.name}</h2>
            <p class="text-gray-500 mb-2">Role: ${user.role}</p>
            <p class="text-sm mb-2">Orders: ${userOrders.length}</p>

            <div class="hidden mt-4 border-t pt-3 details"></div>
        `;

        const detailsDiv = card.querySelector(".details");

        card.addEventListener("click", () => {
            toggleDetails(detailsDiv, userOrders);
        });

        container.appendChild(card);
    });
}



// mostrar/ocultar detalles

function toggleDetails(div, userOrders){

    if(!div.classList.contains("hidden")){
        div.classList.add("hidden");
        div.innerHTML = "";
        return;
    }

    div.classList.remove("hidden");

    div.innerHTML = userOrders.map(order => {

        const itemsHTML = (order.items || [] ).map(i =>
            `<li>${i.name} - $${i.price}</li>`
        ).join("");

        const date = new Date(order.date).toLocaleString();

        return `
            <div class="mb-4 bg-gray-50 p-3 rounded-lg">
                <p class="text-sm font-semibold">Date: ${date}</p>
                <ul class="ml-4 list-disc">${itemsHTML}</ul>
                <p class="font-bold mt-2">Total: $${order.total}</p>
            </div>
        `;
    }).join("");
}



// filtro por nombre

searchInput.addEventListener("input", () => {

    const text = searchInput.value.toLowerCase();

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(text)
    );

    renderCards(filtered);
});


// iniciar
loadData();
