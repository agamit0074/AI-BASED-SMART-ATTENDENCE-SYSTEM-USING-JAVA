/* ---------- AUTH ---------- */
if (!localStorage.getItem("token")) 
    location.href = "login.html";

/* ============================================================
   INITIALIZATION
============================================================ */

let currentPage = 0;
let currentSearch = "";

document.addEventListener("DOMContentLoaded", () => {

    updateClock();
    setInterval(updateClock, 1000);

    loadDashboardStats();
    loadStudents();

    // 🔥 Live refresh every 30 sec
    setInterval(() => {
        loadDashboardStats();
        loadStudents(currentPage);
    }, 30000);
});

function updateClock() {
    document.getElementById('liveClock').innerText =
        new Date().toLocaleTimeString();
}

/* ============================================================
   TAB NAVIGATION
============================================================ */

document.querySelectorAll(".side-nav li").forEach(li => {
    li.onclick = () => {
        const target = li.dataset.tab;

        document.querySelectorAll(".side-nav li")
            .forEach(x => x.classList.remove("active"));

        document.querySelectorAll(".tab-pane")
            .forEach(x => x.classList.remove("active"));

        li.classList.add("active");
        document.getElementById(target).classList.add("active");
        document.getElementById('activeTabTitle')
            .innerText = li.innerText.trim();
    };
});

/* ============================================================
   DASHBOARD STATS
============================================================ */

function loadDashboardStats() {

    fetch("http://localhost:8080/api/admin/students/dashboard", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("totalCount").innerText = data.total;
        document.getElementById("invitedCount").innerText = data.invited;
        document.getElementById("activeCount").innerText = data.active;
    })
    .catch(err => console.error("Dashboard load failed", err));
}

/* ============================================================
   STUDENT LIST (Pagination + Search)
============================================================ */

function loadStudents(page = 0) {

    fetch(`http://localhost:8080/api/admin/students?page=${page}&search=${currentSearch}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {

        currentPage = data.currentPage;

        document.getElementById("studentTable").innerHTML =
            data.content.map(student => `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.className || "No Class Assigned"}</td>
                    <td>${student.subjects ? student.subjects.join(", ") : "-"}</td>
                    <td>${formatStatus(student.status)}</td>
                    <td>
                        <button class="action-btn"
                            onclick="confirmDelete('${student.email}')">
                            <i class='bx bx-trash'></i>
                        </button>

                        <button class="action-btn"
                            onclick="confirmEdit('${student.email}')">
                            <i class='bx bx-edit'></i>
                        </button>

                        <button class="action-btn"
                            onclick="assignSubject('${student.email}')">
                            <i class='bx bx-book'></i>
                        </button>
                    </td>
                </tr>
            `).join("");

        renderPagination(data.totalPages);
    });
}

/* ============================================================
   SEARCH
============================================================ */

document.querySelector(".search-bar input")
    .addEventListener("input", e => {

        currentSearch = e.target.value;
        loadStudents(0);
});

/* ============================================================
   STATUS FORMATTER
============================================================ */

function formatStatus(status) {

    if(status === "INVITED")
        return "<span class='status-badge invited'>Invited</span>";

    if(status === "ACTIVE")
        return "<span class='status-badge active-status'>Active</span>";

    if(status === "EXPIRED")
        return "<span class='status-badge expired'>Registration Link Expired</span>";

    return status;
}

/* ============================================================
   DELETE STUDENT
============================================================ */

function confirmDelete(email) {

    if(!confirm("Are you sure you want to delete this student?"))
        return;

    fetch(`http://localhost:8080/api/admin/students/${email}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(() => {
        loadStudents(currentPage);
        loadDashboardStats();
    });
}

/* ============================================================
   EDIT EMAIL
============================================================ */

function confirmEdit(oldEmail) {

    const newEmail = prompt("Enter new email:");

    if(!newEmail) return;

    if(!confirm("Are you sure you want to update email?"))
        return;

    fetch(`http://localhost:8080/api/admin/students/update-email?oldEmail=${oldEmail}&newEmail=${newEmail}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(() => loadStudents(currentPage));
}

/* ============================================================
   ASSIGN SUBJECT (Placeholder)
============================================================ */

function assignSubject(email) {
    alert("Assign subject logic will be added later for: " + email);
}

/* ============================================================
   PAGINATION
============================================================ */

function renderPagination(totalPages) {

    let html = "";

    if(totalPages > 1) {

        html += `<button onclick="loadStudents(${currentPage-1})"
                    ${currentPage === 0 ? "disabled" : ""}>
                    Prev
                 </button>`;

        for(let i=0;i<totalPages;i++) {
            html += `<button onclick="loadStudents(${i})"
                        ${i===currentPage ? "style='font-weight:bold'" : ""}>
                        ${i+1}
                     </button>`;
        }

        html += `<button onclick="loadStudents(${currentPage+1})"
                    ${currentPage === totalPages-1 ? "disabled" : ""}>
                    Next
                 </button>`;
    }

    document.getElementById("pagination").innerHTML = html;
}

/* ============================================================
   INVITE STUDENT
============================================================ */

document.getElementById("addStudentBtn")
    .addEventListener("click", sendInvite);

function sendInvite() {

    const name = document.getElementById("sName").value.trim();
    const email = document.getElementById("sEmail").value.trim();
    const mobile = document.getElementById("sMobile").value.trim();

    if (!name || !email || !mobile) {
        alert("Please fill all fields");
        return;
    }

    const btn = document.getElementById("addStudentBtn");
    btn.disabled = true;
    btn.innerText = "Sending...";

    fetch("http://localhost:8080/api/admin/students/invite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ name, email, mobile })
    })
    .then(res => res.text())
    .then(() => {
        alert("✅ Registration link sent successfully");
        clearInputs(['sName','sEmail','sMobile']);
        loadDashboardStats();
        loadStudents(0);
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "Send Registration Link";
    });
}

/* ============================================================
   HELPER
============================================================ */

function clearInputs(ids) {
    ids.forEach(id =>
        document.getElementById(id).value = ""
    );
}



// --- FACULTY MANAGEMENT ---
let facultyList = [];

/* ===============================
   FACULTY INVITE
================================ */

document.getElementById("addFacultyBtn")
        .addEventListener("click", sendFacultyInvite);

async function sendFacultyInvite() {

    const name = document.getElementById("fName").value.trim();
    const email = document.getElementById("fEmail").value.trim();
    const btn = document.getElementById("addFacultyBtn");

    // ✅ Basic Validation
    if (!name || !email) {
        alert("Please fill all fields");
        return;
    }

    if (!validateEmail(email)) {
        alert("Invalid email format");
        return;
    }

    const payload = {
        name: name,
        email: email
    };

    try {

        btn.disabled = true;
        btn.innerText = "Sending...";

        const response = await fetch(
            "http://localhost:8080/api/admin/faculty/invite",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(payload)
            }
        );

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text);
        }

        alert("✅ Faculty registration link sent successfully!");

        // Clear inputs
        document.getElementById("fName").value = "";
        document.getElementById("fEmail").value = "";

    } catch (error) {

        alert("❌ " + error.message);

    } finally {

        btn.disabled = false;
        btn.innerText = "Send Invite";
    }
}

/* ===============================
   EMAIL VALIDATION
================================ */

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

