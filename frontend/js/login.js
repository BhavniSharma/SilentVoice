const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    message.innerHTML = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {

        message.innerHTML =
            `<div class="error">Please fill all fields.</div>`;

        return;
    }

    loginBtn.innerHTML = "Logging In...";
    loginBtn.disabled = true;

    const user = {

        email: email,
        password: password

    };

    try {

        const response = await fetch("http://127.0.0.1:8001/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        const data = await response.json();

        if (response.ok) {

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

    window.location.href = "/";

} else {

    message.innerHTML =
        `<div class="error">${data.detail}</div>`;
} 
    }

    catch (error) {

        console.error(error);

        message.innerHTML =
            `<div class="error">Unable to connect to FastAPI Server.</div>`;

    }

    loginBtn.innerHTML = "Login";
    loginBtn.disabled = false;

});

