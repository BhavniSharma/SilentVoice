console.log("Register JS Loaded");

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    console.log("Submit Event Fired");

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: password,
        age: Number(document.getElementById("age").value)
    };

    console.log(user);

    try {

        const response = await fetch("http://127.0.0.1:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        console.log("Status:", response.status);

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            alert("Registration Successful!");
            window.location.href = "login.html";
        } else {
            alert(data.detail || data.error || "Registration Failed");
        }

    } catch (err) {
        console.error(err);
        alert("Cannot connect to server.");
    }

});