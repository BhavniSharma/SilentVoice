const currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) {

    window.location.href = "login.html";

}

document.getElementById("name").value = currentUser.name;
document.getElementById("email").value = currentUser.email;
document.getElementById("age").value = currentUser.age;

document.getElementById("saveBtn").onclick = async () => {

    const updatedUser = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        password: currentUser.password || "",

        age: Number(document.getElementById("age").value)

    };

    const response = await fetch(

        `http://127.0.0.1:8000/users/${currentUser.id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(updatedUser)

        }

    );

    if (response.ok) {

        const newUser = {

            ...currentUser,

            ...updatedUser

        };

        localStorage.setItem(

            "user",

            JSON.stringify(newUser)

        );

        alert("Profile Updated Successfully!");

        window.location.href = "dashboard.html";

    }

    else {

        alert("Failed to update profile.");

    }

};

document.getElementById("logoutBtn").onclick = () => {

    localStorage.removeItem("user");

    window.location.href = "login.html";

};