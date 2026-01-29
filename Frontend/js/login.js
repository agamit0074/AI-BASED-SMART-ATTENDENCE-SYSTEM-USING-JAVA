const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMsg");

// 1. Better Password Toggle
togglePassword.addEventListener("click", function() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    // Change icon
    this.classList.toggle("bxs-show");
    this.classList.toggle("bxs-hide");
});

// 2. Form Submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // UI Loading State
    const originalBtnText = loginBtn.innerHTML;
    loginBtn.innerHTML = "Logging in...";
    loginBtn.disabled = true;
    errorMsg.innerText = "";

    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("username").value,
                password: passwordInput.value
            })
        });

        const data = await response.json();

        console.log(data);
        


        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "admin.html";
        } else {
            throw new Error(data.message || "Invalid credentials");
        }
    } catch (err) {
        errorMsg.innerText = "❌ " + err.message;
        loginBtn.innerHTML = originalBtnText;
        loginBtn.disabled = false;
    }
});