// ==============================
// Get Logged In User
// ==============================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

// ==============================
// Welcome Section
// ==============================

document.getElementById("username").innerText = user.name;

document.getElementById("welcome").innerText =
    `Welcome Back, ${user.name} 👋`;

document.getElementById("userAge").innerText =
    user.age;


// ==============================
// Load Users From FastAPI
// ==============================

async function loadUsers() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/users"
        );

        const users = await response.json();

        document.getElementById("totalUsers").innerText =
            users.length;

        const table =
            document.getElementById("usersTable");

        table.innerHTML = "";

        users.forEach((u) => {

            table.innerHTML += `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>${u.age}</td>
                </tr>
            `;

        });

    }

    catch (err) {

        console.error(err);

        alert("Cannot connect to backend.");

    }

}

loadUsers();


// ==============================
// Logout
// ==============================

document
.getElementById("logoutBtn")
.addEventListener("click", () => {

    localStorage.removeItem("user");

    window.location.href = "login.html";

});