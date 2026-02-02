/* =====================================================
   FACULTY DASHBOARD LOGIC – AttendX
   Frontend First | Backend Ready
   ===================================================== */

/* ---------------- AUTH GUARD ---------------- */
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

/**
 * Faculty Dashboard Logic - SmartAttendance
 */

let isSessionLive = false;
const mockData = [
    { id: "2024CS01", name: "Aman Gupta", time: "10:02 AM" },
    { id: "2024CS05", name: "Isha Sharma", time: "10:05 AM" },
    { id: "2024CS12", name: "Raj Malhotra", time: "10:08 AM" },
    { id: "2024CS22", name: "Sneha Kapoor", time: "10:12 AM" }
];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Clock Initialization
    setInterval(() => {
        document.getElementById('liveClock').innerText = new Date().toLocaleTimeString();
    }, 1000);

    // 2. Load Assigned Lecture
    renderLectureDetails();

    // 3. Control Logic
    handleSessionControls();
});

function renderLectureDetails() {
    document.getElementById('facultyName').innerText = "Dr. Rakesh Sharma";
    document.getElementById('subjectDisplay').innerText = "Database Systems (Theory)";
    document.getElementById('timeRange').innerText = "10:00 AM - 10:50 AM";
    document.getElementById('periodNum').innerText = "2";
    
    // Initial Empty State
    document.getElementById('attendanceTableBody').innerHTML = `
        <tr><td colspan="4" style="text-align:center; padding:40px; color:#94a3b8;">
        Attendance will appear here once the session starts.</td></tr>
    `;
}

function handleSessionControls() {
    const startBtn = document.getElementById('startBtn');
    const endBtn = document.getElementById('endBtn');
    const statusText = document.getElementById('sessionStatus');
    const badge = document.getElementById('lectureBadge');
    const heroCard = document.getElementById('heroCard');

    // START SESSION
    startBtn.addEventListener('click', () => {
        isSessionLive = true;
        
        // Button Swap
        startBtn.classList.add('hidden');
        endBtn.classList.remove('hidden');

        // UI Feedback
        statusText.innerText = "Live: Students are scanning now...";
        heroCard.classList.add('active');
        badge.innerText = "LIVE SESSION";
        badge.style.background = "#ef4444";

        startRealTimeFeed();
    });

    // END SESSION
    endBtn.addEventListener('click', () => {
        if (confirm("End session and generate attendance report?")) {
            isSessionLive = false;
            
            // Button Swap Back
            endBtn.classList.add('hidden');
            startBtn.classList.remove('hidden');
            startBtn.innerHTML = "<i class='bx bx-refresh'></i> Restart Session";

            statusText.innerText = "Session ended. Data saved successfully.";
            heroCard.classList.remove('active');
            badge.innerText = "Completed";
            badge.style.background = "#22c55e";
        }
    });
}

function startRealTimeFeed() {
    const tableBody = document.getElementById('attendanceTableBody');
    tableBody.innerHTML = ""; // Clear wait message
    
    let presentCount = 0;
    
    mockData.forEach((student, index) => {
        setTimeout(() => {
            if (!isSessionLive) return;

            presentCount++;
            document.getElementById('presentCount').innerText = presentCount;
            document.getElementById('absentCount').innerText = mockData.length - presentCount;

            const row = `
                <tr style="animation: slideIn 0.4s ease forwards;">
                    <td>#${student.id}</td>
                    <td><strong>${student.name}</strong></td>
                    <td>${student.time}</td>
                    <td><span style="color:#16a34a; font-weight:700;">● Present</span></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('afterbegin', row);
        }, index * 2000); // 2 seconds gap between each student check-in
    });
}