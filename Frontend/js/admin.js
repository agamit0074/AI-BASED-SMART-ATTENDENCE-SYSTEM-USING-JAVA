/* ---------- AUTH ---------- */
if (!localStorage.getItem("token")) 
    location.href = "login.html";

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

//Button click
document.getElementById("addStudentBtn").addEventListener("click", sendInvite);

function sendInvite() {

  const name = document.getElementById("sName").value.trim();
  const email = document.getElementById("sEmail").value.trim();
  const mobile = document.getElementById("sMobile").value.trim();

  // Basic validation
  if (!name || !email || !mobile) {
    alert("Please fill all fields");
    return;
  }

  const payload = {
    name: name,
    email: email,
    mobile: mobile
  };

  // Disable button (UX)
  const btn = document.getElementById("addStudentBtn");
  btn.disabled = true;
  btn.innerText = "Sending...";

  fetch("http://localhost:8080/api/admin/students/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed");
      return res.text();
    })
    .then(msg => {
      alert("✅ Registration link sent successfully");

      // Clear form
      document.getElementById("sName").value = "";
      document.getElementById("sEmail").value = "";
      document.getElementById("sMobile").value = "";

    })
    .catch(err => {
      alert("❌ Failed to send registration link");
      console.error(err);
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerText = "Send Registration Link";
    });
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