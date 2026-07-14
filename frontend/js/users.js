console.log("Users JS Loaded");
const user = JSON.parse(localStorage.getItem("user"));

if(!user){

    window.location.href="login.html";

}

const table=document.getElementById("usersTable");

let allUsers=[];

async function loadUsers() {

    try {

        console.log("Fetching users...");

        const response = await fetch("http://127.0.0.1:8000/users");

        console.log("Status:", response.status);

        const users = await response.json();

        console.log("Users:", users);

        allUsers = users;

        showUsers(allUsers);

    } catch (error) {

        console.error("Fetch Error:", error);

        alert("Cannot fetch users. Check console.");

    }

}
function showUsers(users){

    table.innerHTML="";

    users.forEach(user=>{

        table.innerHTML+=`

        <tr>

        <td>${user.id}</td>

        <td>${user.name}</td>

        <td>${user.email}</td>

        <td>${user.age}</td>

       <td>
    <div class="action-buttons">

        <button
            class="action-btn edit"
            onclick="editUser(${user.id})">
            Edit
        </button>

        <button
            class="action-btn delete"
            onclick="deleteUser(${user.id})">
            Delete
        </button>

    </div>
</td>
        </tr>

        `;

    });

}

document.getElementById("searchInput")

.addEventListener("keyup",(e)=>{

    const value=e.target.value.toLowerCase();

    const filtered=allUsers.filter(user=>

    user.name.toLowerCase().includes(value) ||

    user.email.toLowerCase().includes(value)

    );

    showUsers(filtered);

});


async function deleteUser(id){

    if(!confirm("Delete this user?")) return;

    await fetch(

    `http://127.0.0.1:8000/users/${id}`,

    {

        method:"DELETE"

    }

    );

    loadUsers();

}

function editUser(id){

    localStorage.setItem("editUser",id);

    window.location.href="profile.html";

}

document

.getElementById("logoutBtn")

.onclick=()=>{

    localStorage.removeItem("user");

    window.location.href="login.html";

};

loadUsers();