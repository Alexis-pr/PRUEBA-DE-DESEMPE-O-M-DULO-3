const form = document.getElementById('myform');
const titleTask = document.getElementById("title");
const descriTask = document.getElementById("description");
const stateTask = document.getElementById("status");
const taskList = document.getElementById("taskList");
const nameUser = document.getElementById("nameUserlogged");

const urlTask = "http://localhost:3000/task";

const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

let temporaryTask = [];
let cart = []; 
let editingId = null; // 🔥 para saber si estamos editando



/* =========================
   REGISTER
========================= */
form.addEventListener("submit", registerTask);


/* =========================
   USER
========================= */



async function chargeUser(){

    const res = await fetch("http://localhost:3000/users");
    const user = await res.json();

    nameUser.innerHTML = "";

    user.forEach(p => {

        if(currentUser.name === p.name){

            const parra = document.createElement("p");
            parra.textContent = `Welcome ${p.name} !!`;

            nameUser.appendChild(parra);
        }
    });
}   


/* =========================
   CREATE or UPDATE TASK
========================= */
async function registerTask(e) {

    e.preventDefault();

    const name = titleTask.value.trim().toLowerCase();
    const description = descriTask.value.trim();
    const state = stateTask.value;

    if(!name || !description || !state){
        alert("Complete all fields");
        return;
    }

    const data = {
        name,
        description,
        state,
        userId: currentUser.id
    };

    cart.push(data)

    /* 🔥 SI EDITANDO → PATCH */
    if(editingId){

        await fetch(`${urlTask}/${editingId}`, {
            method: "PATCH",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });

        alert("Task updated!");
        editingId = null;

    }
    /* 🔥 SI NUEVO → POST */
    else{

        await fetch(urlTask, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });

        alert("Task saved!");
    }

    form.reset();
    loadTasks();
}


/* =========================
   LOAD TASKS
========================= */
async function loadTasks() {

    const res = await fetch(urlTask);
    const task = await res.json();

    taskList.innerHTML = "";

    task.forEach(p => {

        const li = document.createElement("li");

        li.className = `
            bg-white rounded-2xl shadow-md p-4
            hover:shadow-xl transition
            flex flex-col gap-3
        `;

        li.innerHTML = `
            <div class="font-semibold text-lg">${p.name}</div>
            <div class="text-gray-500">${p.description}</div>
            <div class="text-gray-500">${p.state}</div>

            <div class="flex gap-2">

                <button
                    class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded-xl transition"
                    onclick="editTask('${p.id}','${p.name}','${p.description}','${p.state}')">
                    update
                </button>

                <button
                    class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-xl transition"
                    onclick="deleteTask('${p.id}')">
                    delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}

async function deleteTask(id){

    await fetch(`${urlTask}/${id}`, {
        method: "DELETE"
    });
    alert("Task deleted");
    loadTasks();
}


function editTask(id, name, description, state){

    titleTask.value = name;
    descriTask.value = description;
    stateTask.value = state;

    editingId = id; // 🔥 activar modo edición

    titleTask.focus();
}

 async function saveOrder() {

    if (cart.length === 0){
        alert("cart empty");
        return;
    }

    const order ={
        userId : currentUser.id,
        item : cart,
        date: new Date().toISOString()
    };

    await fetch("http://localhost:3000/task",{
        method: "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify(order)
    });

    alert("save Order...");


}
 




/* INIT */
loadTasks();
chargeUser();