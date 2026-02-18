document.addEventListener("DOMContentLoaded", () => {

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

const params = new URLSearchParams(window.location.search);
const token = params.get("token");

let recaptchaVerified = false;

/* ===========================
   PROFILE PREVIEW
=========================== */
document.querySelector(".circle-wrapper").addEventListener("click",()=>{
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
   PASSWORD STRENGTH CHECK
=========================== */
password.addEventListener("input", () => {

    const val = password.value;
    let strength = 0;

    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    if (val.length < 8) {
        strengthText.innerText = "Minimum 8 characters required";
        strengthText.style.color = "red";
        strengthBar.style.width="30%";
        strengthBar.style.background="red";
    }
    else if (strength <=2){
        strengthText.innerText="Weak";
        strengthText.style.color="red";
        strengthBar.style.width="40%";
        strengthBar.style.background="red";
    }
    else if(strength===3){
        strengthText.innerText="Medium";
        strengthText.style.color="orange";
        strengthBar.style.width="70%";
        strengthBar.style.background="orange";
    }
    else{
        strengthText.innerText="Strong";
        strengthText.style.color="green";
        strengthBar.style.width="100%";
        strengthBar.style.background="green";
    }

    validateForm();
});

/* ===========================
   CONFIRM PASSWORD CHECK
=========================== */
confirmPass.addEventListener("input",()=>{
    if(confirmPass.value!==password.value){
        matchText.innerText="Passwords do not match";
        matchText.style.color="red";
    }else{
        matchText.innerText="Passwords match";
        matchText.style.color="green";
    }
    validateForm();
});

/* ===========================
   TERMS CHECK
=========================== */
termsCheck.addEventListener("change", validateForm);

/* ===========================
   RECAPTCHA CALLBACK
=========================== */
window.recaptchaCallback=function(){
    recaptchaVerified=true;
    validateForm();
}

/* ===========================
   ENABLE / DISABLE BUTTON
=========================== */
function validateForm(){

const valid=
document.getElementById("fName").value.trim() &&
document.getElementById("lName").value.trim() &&
document.getElementById("dob").value &&
document.getElementById("gender").value &&
document.getElementById("mobile").value.length===10 &&
document.getElementById("rollNo").value.trim() &&
fileInput.files.length>0 &&
password.value.length>=8 &&
password.value===confirmPass.value &&
strengthText.innerText==="Strong" &&
termsCheck.checked &&
recaptchaVerified;

if(valid){
    registerBtn.disabled=false;
    registerBtn.classList.remove("disabled-btn");
}else{
    registerBtn.disabled=true;
    registerBtn.classList.add("disabled-btn");
}
}

/* ===========================
   FORM SUBMIT
=========================== */
form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    registerBtn.innerText="Registering...";
    registerBtn.disabled=true;

    const formData = new FormData();

    const data = {
        token: token,
        title: document.getElementById("title").value,
        firstName: document.getElementById("fName").value,
        middleName: document.getElementById("mName").value,
        lastName: document.getElementById("lName").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        mobile: "+91" + document.getElementById("mobile").value,
        rollNo: document.getElementById("rollNo").value,
        password: password.value,
        recaptchaToken: grecaptcha.getResponse()
    };

    formData.append("data", new Blob([JSON.stringify(data)], {type:"application/json"}));
    formData.append("profilePic", fileInput.files[0]);

    try{

        const response = await fetch("http://localhost:8080/api/auth/register-student",{
            method:"POST",
            body:formData
        });

        const message = await response.text();

        if(response.ok){

            // SUCCESS CARD
            form.style.display="none";

            statusContainer.innerHTML=`
            <div class="status-card">
                <h2 style="color:green;">🎉 You are Successfully Registered</h2>
                <p>Your account has been created successfully.</p>
                <br>
                <a href="login.html">
                    <button class="submit-btn">Go to Login</button>
                </a>
            </div>
            `;

        }else{

            statusContainer.innerHTML=`
            <div class="status-card">
                <h3 style="color:red;">❌ ${message}</h3>
            </div>
            `;

            registerBtn.innerText="Complete Registration";
            validateForm();
            grecaptcha.reset();
            recaptchaVerified=false;
        }

    }catch(error){

        statusContainer.innerHTML=`
        <div class="status-card">
            <h3 style="color:red;">Server Error. Please try again.</h3>
        </div>
        `;

        registerBtn.innerText="Complete Registration";
        validateForm();
        grecaptcha.reset();
        recaptchaVerified=false;
    }

});

});
