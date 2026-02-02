/* ---------- AUTH ---------- */
if (!localStorage.getItem("token")) location.href = "login.html";

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    setInterval(updateClock, 1000);
});

function updateClock() {
    document.getElementById('liveClock').innerText = new Date().toLocaleTimeString();
}

// --- TAB NAVIGATION ---
document.querySelectorAll(".side-nav li").forEach(li => {
    li.onclick = () => {
        const target = li.dataset.tab;
        
        // UI Updates
        document.querySelectorAll(".side-nav li").forEach(x => x.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(x => x.classList.remove("active"));
        
        li.classList.add("active");
        document.getElementById(target).classList.add("active");
        document.getElementById('activeTabTitle').innerText = li.innerText.trim();
    };
});

// --- STUDENT MANAGEMENT ---
let students = [];

document.getElementById('addStudentBtn').onclick = () => {
    const name = document.getElementById('sName').value;
    const email = document.getElementById('sEmail').value;
    const sclass = document.getElementById('sClass').value;

    if(!name || !email) return alert("Please fill basic details!");

    // Backend API Call here: POST /api/admin/invite-student
    students.push({
        id: Date.now(),
        name,
        email,
        class: sclass,
        subjects: [],
        status: "INVITED"
    });
    
    renderStudents();
    clearInputs(['sName', 'sEmail', 'sMobile', 'sClass']);
    alert(`Invite link sent to ${email}`);
};

function renderStudents() {
    const container = document.getElementById('studentTable');
    container.innerHTML = students.map((s, i) => `
        <tr>
            <td><strong>${s.name}</strong><br><small>${s.email}</small></td>
            <td>${s.class}</td>
            <td>${s.subjects.join(", ") || '<span style="color:#cbd5e1">No subjects</span>'}</td>
            <td><span class="status-badge ${s.status === 'INVITED' ? 'invited' : 'active-status'}">${s.status}</span></td>
            <td>
                <button class="action-btn" onclick="assignSub(${i}, 'student')" title="Assign Subjects"><i class='bx bx-book-add'></i></button>
                <button class="action-btn delete-btn" onclick="deleteItem(${i}, 'student')"><i class='bx bx-trash'></i></button>
            </td>
        </tr>
    `).join('');
}

// --- FACULTY MANAGEMENT ---
let facultyList = [];

document.getElementById('addFacultyBtn').onclick = () => {
    const name = document.getElementById('fName').value;
    const email = document.getElementById('fEmail').value;

    facultyList.push({ name, email, subjects: [], class: "Not Assigned" });
    renderFaculty();
    clearInputs(['fName', 'fEmail']);
};

function renderFaculty() {
    document.getElementById('facultyTable').innerHTML = facultyList.map((f, i) => `
        <tr>
            <td><strong>${f.name}</strong></td>
            <td>${f.email}</td>
            <td>${f.subjects.join(", ") || "-"}</td>
            <td>${f.class}</td>
            <td>
                <button class="action-btn" onclick="assignSub(${i}, 'faculty')"><i class='bx bx-cog'></i></button>
                <button class="action-btn delete-btn" onclick="deleteItem(${i}, 'faculty')"><i class='bx bx-trash-alt'></i></button>
            </td>
        </tr>
    `).join('');
}

// --- SHARED FUNCTIONS ---
function assignSub(index, type) {
    const input = prompt("Enter Subjects (comma separated):");
    if (!input) return;

    if (type === 'student') {
        students[index].subjects = input.split(",").map(s => s.trim());
        renderStudents();
    } else {
        facultyList[index].subjects = input.split(",").map(s => s.trim());
        facultyList[index].class = prompt("Enter Assigned Class:");
        renderFaculty();
    }
}

function deleteItem(index, type) {
    if(!confirm("Bhai, are you sure?")) return;
    if(type === 'student') students.splice(index, 1), renderStudents();
    else facultyList.splice(index, 1), renderFaculty();
}

function clearInputs(ids) {
    ids.forEach(id => document.getElementById(id).value = "");
}