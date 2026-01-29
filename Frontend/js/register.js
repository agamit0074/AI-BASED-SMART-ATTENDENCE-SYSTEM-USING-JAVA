document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Password Toggle Logic (Eye Icon)
    window.togglePass = function(fieldId, icon) {
        const input = document.getElementById(fieldId);
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove('bx-show');
            icon.classList.add('bx-hide');
        } else {
            input.type = "password";
            icon.classList.remove('bx-hide');
            icon.classList.add('bx-show');
        }
    }

    // 2. Profile Pic Preview
    const fileInput = document.getElementById('fileInput');
    const placeholder = document.getElementById('placeholderIcon');
    const preview = document.getElementById('avatarPreview');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                placeholder.classList.add('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    // 3. Load Email from URL
    const params = new URLSearchParams(window.location.search);
    if(params.get('email')) {
        document.getElementById('email').value = params.get('email');
    }

    // 4. Form Submission
    document.getElementById('regForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const p1 = document.getElementById('password').value;
        const p2 = document.getElementById('cPassword').value;

        if(p1 !== p2) return alert("Passwords do not match!");

        // Combine Name
        const fullName = [
            document.getElementById('title').value,
            document.getElementById('fName').value,
            document.getElementById('mName').value,
            document.getElementById('lName').value
        ].filter(Boolean).join(" ");

        // Combine Mobile with +91
        const mobileRaw = document.getElementById('mobile').value;
        const fullMobile = "+91" + mobileRaw;

        const payload = {
            fullName: fullName,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            mobile: fullMobile,
            rollNo: document.getElementById('rollNo').value,
            password: p1
        };

        alert("Data Ready! Mobile: " + fullMobile);
        console.log("Payload:", payload);
        
        // window.location.href = "login.html";
    });
});