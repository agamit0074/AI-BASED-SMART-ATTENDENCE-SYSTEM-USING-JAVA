document.addEventListener("DOMContentLoaded", async () => {

    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("avatarPreview");
    const placeholder = document.getElementById("placeholderIcon");
    const password = document.getElementById("password");
    const confirmPass = document.getElementById("cPassword");
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");
    const matchText = document.getElementById("matchText");
    const termsCheck = document.getElementById("termsCheck");
    const registerBtn = document.getElementById("registerBtn");
    const form = document.getElementById("regForm");
    const statusContainer = document.getElementById("statusContainer");
    const emailField = document.getElementById("email");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    let recaptchaVerified = false;

    /* ===========================
       TOKEN VALIDATION ON LOAD
    =========================== */

    if (!token) {
        showErrorCard("Invalid registration link.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/auth/faculty/validate?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
            showErrorCard(data.message || "Invalid or expired link");
            return;
        }

        // Valid token → Auto fill email
        emailField.value = data.email;
        emailField.readOnly = true;
        emailField.classList.add("locked-input");

    } catch (error) {
        showErrorCard("Server error. Please try again later.");
        return;
    }

    /* ===========================
       PROFILE PREVIEW
    =========================== */
    document.querySelector(".circle-wrapper").addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.classList.remove("hidden");
                placeholder.classList.add("hidden");
            };
            reader.readAsDataURL(file);
        }
        validateForm();
    });

    /* ===========================
       PASSWORD STRENGTH
    =========================== */
    password.addEventListener("input", () => {

        const val = password.value;
        let strength = 0;

        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        if (val.length < 8) {
            updateStrength("Minimum 8 characters required", "red", "30%");
        } else if (strength <= 2) {
            updateStrength("Weak", "red", "40%");
        } else if (strength === 3) {
            updateStrength("Medium", "orange", "70%");
        } else {
            updateStrength("Strong", "green", "100%");
        }

        checkMatch();
        validateForm();
    });

    function updateStrength(text, color, width) {
        strengthText.innerText = text;
        strengthText.style.color = color;
        strengthBar.style.width = width;
        strengthBar.style.background = color;
    }

    /* ===========================
       PASSWORD MATCH
    =========================== */
    confirmPass.addEventListener("input", checkMatch);

    function checkMatch() {
        if (!confirmPass.value) {
            matchText.innerText = "";
        } else if (confirmPass.value !== password.value) {
            matchText.innerText = "Passwords do not match";
            matchText.style.color = "red";
        } else {
            matchText.innerText = "Passwords match";
            matchText.style.color = "green";
        }
        validateForm();
    }

    /* ===========================
       RECAPTCHA
    =========================== */
    window.recaptchaCallback = function () {
        recaptchaVerified = true;
        validateForm();
    }

    termsCheck.addEventListener("change", validateForm);

    /* ===========================
       VALIDATE FORM
    =========================== */
    function validateForm() {

        const valid = Boolean(
            document.getElementById("fName").value.trim() &&
            document.getElementById("lName").value.trim() &&
            document.getElementById("dob").value &&
            document.getElementById("gender").value &&
            document.getElementById("mobile").value.length === 10 &&
            document.getElementById("employeeId").value.trim() &&
            document.getElementById("department").value &&
            document.getElementById("designation").value &&
            document.getElementById("qualification").value.trim() &&
            fileInput.files.length > 0 &&
            password.value.length >= 8 &&
            password.value === confirmPass.value &&
            strengthText.innerText === "Strong" &&
            termsCheck.checked &&
            recaptchaVerified
        );

        registerBtn.disabled = !valid;
        registerBtn.classList.toggle("disabled-btn", !valid);
    }

    /* ===========================
       FORM SUBMIT
    =========================== */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        registerBtn.innerText = "Registering...";
        registerBtn.disabled = true;

        const formData = new FormData();

        const payload = {
            token: token,
            title: document.getElementById("title").value,
            firstName: document.getElementById("fName").value,
            middleName: document.getElementById("mName").value,
            lastName: document.getElementById("lName").value,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            mobile: "+91" + document.getElementById("mobile").value,
            employeeId: document.getElementById("employeeId").value,
            department: document.getElementById("department").value,
            designation: document.getElementById("designation").value,
            qualification: document.getElementById("qualification").value,
            password: password.value,
            recaptchaToken: grecaptcha.getResponse()
        };

        formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
        formData.append("profilePic", fileInput.files[0]);

        try {
            const response = await fetch("http://localhost:8080/api/auth/faculty/register", {
                method: "POST",
                body: formData
            });

            const text = await response.text();

            if (response.ok) {

                form.style.display = "none";

                statusContainer.innerHTML = `
                <div class="status-card">
                    <h2 style="color:green;">🎉 Registration Successful</h2>
                    <p>You are successfully registered.</p>
                    <br>
                    <a href="login.html">
                        <button class="submit-btn">Go to Login</button>
                    </a>
                </div>
                `;
            } else {
                showErrorCard(text);
                resetFormState();
            }

        } catch (err) {
            showErrorCard("Server error. Please try again.");
            resetFormState();
        }
    });

    function resetFormState() {
        registerBtn.innerText = "Complete Registration";
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
        recaptchaVerified = false;
        validateForm();
    }

    function showErrorCard(message) {
        form.style.display = "none";
        statusContainer.innerHTML = `
        <div class="status-card">
            <h3 style="color:red;">❌ ${message}</h3>
            <br>
            <a href="login.html">
                <button class="submit-btn">Go to Login</button>
            </a>
        </div>
        `;
    }

});

/* ===========================
   GLOBAL HELPERS
=========================== */

function togglePass(inputId, icon) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("bx-show");
    icon.classList.toggle("bx-hide");
}

function openModal() {
    document.getElementById("termsModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("termsModal").style.display = "none";
}
