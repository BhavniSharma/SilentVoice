// ==============================
// Dashboard JavaScript
// SilentVoice AI
// ==============================

// ---------- Greeting ----------

const greeting = document.getElementById("greeting");

if (greeting) {

    const hour = new Date().getHours();

    let message = "";

    if (hour < 12) {

        message = "☀️ Good Morning";

    }

    else if (hour < 17) {

        message = "🌤️ Good Afternoon";

    }

    else {

        message = "🌙 Good Evening";

    }

    greeting.textContent = message;

}

// ---------- Fade Animation ----------

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform = "translateY(0)";

        }

    });

}, {

    threshold: 0.15

});

sections.forEach(section => {

    section.style.opacity = "0";

    section.style.transform = "translateY(40px)";

    section.style.transition = "0.7s ease";

    observer.observe(section);

});

// ---------- Card Hover ----------

const cards = document.querySelectorAll(".action-card,.tech-card,.hero-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transition = ".3s";

    });

});



// ---------- Logout ----------

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm("Do you want to logout?");

        if (!confirmLogout) return;

        localStorage.removeItem("user");

        window.location.href = "/login";

    });

}

// ---------- Navbar Shadow ----------

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > 20) {

        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

    }

    else {

        navbar.style.boxShadow = "none";

    }

});

// ---------- Page Loaded ----------

window.addEventListener("load", () => {

    document.body.style.opacity = "1";

});