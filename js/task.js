const form = document.getElementById('myform');
const titleTask = document.getElementById("title");
const descriTask = document.getElementById("description");
const stateTask = document.getElementById("status");
const taskList = document.getElementById("taskList");
const nameUser = document.getElementById("nameUserlogged")

const urlTask = "http://localhost:3000/task";



const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
//console.log(currentUser)

let temporaryTask = [];

form.addEventListener("submit",registerTask);

async function chargeUser(){
    const res = await fetch("http://localhost:3000/users");
    const user = await res.json()
    
    nameUser.innerHTML = ""
    
    user.forEach(p => {
        const parra = document.createElement("p");
        
        parra.innerHTML = `
            <p> Welcome ${p.name} !!</p>
        `;
        if(currentUser.name === p.name){
            nameUser.appendChild(parra)
        }
           
    });
}   

async function registerTask(e) {
     e.preventDefault();
     const name = titleTask.value.trim().toLowerCase();
     const description = descriTask.value.trim();
     const state = stateTask.value;
    
    if(!name || !description || !state){
        alert("Complete all fields");
        return;
    }
    const res = await fetch(urlTask);
    const task = await res.json();

     await fetch(urlTask, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ name, description, state })
    });

    alert("Task save!");
    form.reset();
}

async function loadTasks() {

    const res = await fetch("http://localhost:3000/task");
    const task = await res.json();

    taskList.innerHTML = "";

    task.forEach(p => {

        const li = document.createElement("li");

        // 🔥 SOLO ESTILOS (no lógica)
        li.className = `
            bg-white rounded-2xl shadow-md p-4
            hover:shadow-xl transition
            flex flex-col gap-3
        `;

        li.innerHTML = `
            <div class="font-semibold text-lg">
                ${p.name}
            </div>

            <div class="text-gray-500">
                ${p.description}
            </div>
             <div class="text-gray-500">
                ${p.state}
            </div>

          

             <button
                class="bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-xl transition"
                onclick="deleteTask(${p.id})">
                    delete Task
            </button>
        `;

        taskList.appendChild(li);
    });
}

async function deleteTask(id){
    const res = await fetch("http://localhost:3000/task",{

    
        method: "DELETE",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify(order)
    });
    const task = await res.json()

    console.log(task)

    console.log(task.slice(id,1 ))
}


async function saveOrder() {

    if (cart.length === 0){
        alert("cart empty");
        return;
    }

    const order ={
        userId : currentUser.id,
        item : cart,        
        date: new Date().toDateString()
    };

    await fetch("http://localhost:3000/orders",{
        method: "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify(order)
    });

    alert("save Order...");

    cart = [];
    renderCart();
}

const btn = document.createElement("button");

btn.textContent = "Buy";

btn.className = `
    fixed bottom-6 right-6
    bg-green-500 hover:bg-green-600
    text-white px-6 py-3
    rounded-2xl shadow-xl
    transition
`;

btn.onclick = saveOrder;

document.body.appendChild(btn);







loadTasks();
chargeUser();