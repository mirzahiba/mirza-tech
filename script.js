/* ==========================================
   MIRZA TECH NOVA - script.js
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggle();
    initLoginForm();
    initActiveNav();
    initTopLoginButton();
    initRevealOnScroll();
    initSocialLinks();
});


/* ---------- 1. SHOW / HIDE PASSWORD ---------- */
function initPasswordToggle() {
    const eye = document.querySelector(".input-box .fa-eye");
    const passwordInput = document.querySelector('.input-box input[type="password"]');

    if (!eye || !passwordInput) return;

    eye.style.cursor = "pointer";
    eye.setAttribute("role", "button");
    eye.setAttribute("aria-label", "Show or hide password");

    eye.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";
        eye.classList.toggle("fa-eye", !isHidden);
        eye.classList.toggle("fa-eye-slash", isHidden);
    });
}


/* ---------- 2. LOGIN FORM (validation + remember me) ---------- */
function initLoginForm() {
    const form = document.querySelector(".login-card form");
    if (!form) return;

    const userInput = form.querySelector('input[type="text"]');
    const passInput = form.querySelector('input[type="password"]');
    const rememberBox = form.querySelector('.remember input[type="checkbox"]');
    const submitBtn = form.querySelector(".login-submit");

    // message area above the login button
    const message = document.createElement("p");
    message.className = "form-message";
    message.setAttribute("aria-live", "polite");
    form.insertBefore(message, submitBtn);

    // fill saved username (never save the password!)
    try {
        const savedUser = localStorage.getItem("mtn_remember_user");
        if (savedUser) {
            userInput.value = savedUser;
            rememberBox.checked = true;
        }
    } catch (e) { /* storage blocked, ignore */ }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "form-message " + type;
    }

    function setError(input, hasError) {
        input.closest(".input-box").classList.toggle("error", hasError);
    }

    // clear error while typing
    [userInput, passInput].forEach((input) => {
        input.addEventListener("input", () => {
            setError(input, false);
            showMessage("", "");
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = userInput.value.trim();
        const password = passInput.value;

        // validation
        const isEmail = username.includes("@");
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);

        if (username.length < 3 || (isEmail && !emailOk)) {
            setError(userInput, true);
            showMessage("Please enter a valid email or username.", "error");
            userInput.focus();
            return;
        }

        if (password.length < 6) {
            setError(passInput, true);
            showMessage("Password must be at least 6 characters.", "error");
            passInput.focus();
            return;
        }

        // remember me
        try {
            if (rememberBox.checked) {
                localStorage.setItem("mtn_remember_user", username);
            } else {
                localStorage.removeItem("mtn_remember_user");
            }
        } catch (e) { /* ignore */ }

        // loading state
        submitBtn.disabled = true;
        showMessage("Logging in...", "info");

        /* ------------------------------------------
           BACKEND GOES HERE (next step).
           Example later:

           const res = await fetch("/api/login", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ username, password })
           });
           const data = await res.json();
           ------------------------------------------ */

        // temporary fake delay until backend is ready
        await new Promise((resolve) => setTimeout(resolve, 900));

        showMessage("Frontend is ready. Backend connection coming soon!", "success");
        submitBtn.disabled = false;
    });
}


/* ---------- 3. ACTIVE NAV LINK ON SCROLL ---------- */
function initActiveNav() {
    const links = document.querySelectorAll(".navbar a");
    const sectionIds = ["home", "about", "services", "portfolio", "contact"];

    function update() {
        const scrollPos = window.scrollY + 40;
        let current = "home";

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrollPos) current = id;
        });

        // at the very bottom of the page, highlight Contact
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
            current = "contact";
        }

        links.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
}


/* ---------- 4. HEADER LOGIN BUTTON -> FOCUS LOGIN FORM ---------- */
function initTopLoginButton() {
    const topLogin = document.querySelector(".top-login");
    const firstInput = document.querySelector(".login-card input");
    if (!topLogin || !firstInput) return;

    topLogin.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("login").scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => firstInput.focus({ preventScroll: true }), 500);
    });
}


/* ---------- 5. FADE-IN ANIMATION ON SCROLL ---------- */
function initRevealOnScroll() {
    const items = document.querySelectorAll(".feature-card, .portfolio > *, .login-card, .hero-content");

    // if browser is old, just show everything
    if (!("IntersectionObserver" in window)) return;

    items.forEach((item, index) => {
        item.classList.add("reveal");
        item.style.transitionDelay = (index % 4) * 80 + "ms";
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach((item) => observer.observe(item));
}


/* ---------- 6. SOCIAL LINKS OPEN IN NEW TAB ---------- */
function initSocialLinks() {
    document.querySelectorAll(".social-links a").forEach((link) => {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}