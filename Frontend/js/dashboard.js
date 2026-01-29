/* =============================================
   SMART ATTENDANCE - STUDENT DASHBOARD LOGIC
   ============================================= */

// 1. AUTH GUARD (Optional: Check if user is logged in)
// const token = localStorage.getItem("token");
// if (!token) window.location.href = "login.html";

// --- DATA MOCKUP ---
let activeLecture = {
    subject: "Database Management System",
    faculty: "Dr. Rakesh Sharma",
    period: 2,
    time: "10:00 AM - 11:00 AM"
}; 
// Tip: Lecture khatam hone par 'activeLecture = null;' karke test karein.

const subjectAttendance = [
    { subject: "DBMS", total: 32, present: 29 },
    { subject: "Computer Networks", total: 28, present: 20 }, // 71% -> Warning
    { subject: "Software Engineering", total: 26, present: 15 }, // 57% -> Danger
    { subject: "Mathematics", total: 30, present: 26 }
];

let stream = null; // Global stream reference to stop camera

document.addEventListener("DOMContentLoaded", () => {
    renderHeroSection();
    renderStatsAndTable();
});

// 1. HERO SECTION (Lecture vs No Lecture)
function renderHeroSection() {
    const container = document.getElementById("lectureContainer");
    if (!activeLecture) {
        container.innerHTML = `
            <div class="lecture-card no-lecture">
                <i class='bx bx-calendar-x' style="font-size: 50px; color: #94a3b8;"></i>
                <h2>No Active Lecture Right Now</h2>
                <p>Check back later or view your schedule.</p>
            </div>`;
        return;
    }

    container.innerHTML = `
        <div class="lecture-card">
            <div class="lecture-details">
                <span class="live-tag"><span class="dot"></span> LIVE NOW</span>
                <h1 id="currentSubject">${activeLecture.subject}</h1>
                <p><i class='bx bxs-user-voice'></i> ${activeLecture.faculty}</p>
                <div class="lecture-meta">
                    <span><i class='bx bxs-time-five'></i> ${activeLecture.time}</span>
                    <span><i class='bx bxs-layer'></i> Period ${activeLecture.period}</span>
                </div>
            </div>
            <div class="attendance-action">
                <div class="camera-preview">
                    <video id="video" autoplay muted></video>
                    <div class="scan-line" id="scanLine"></div>
                </div>
                <button id="captureBtn" class="glow-btn"><i class='bx bx-scan'></i> Mark Presence</button>
                <p id="statusMsg" style="margin-top:10px; font-size:13px;"></p>
            </div>
        </div>`;
    
    // Add Event Listener after rendering
    document.getElementById("captureBtn").addEventListener("click", startAttendance);
}

// 2. ATTENDANCE & CAMERA AUTO-OFF
async function startAttendance() {
    const video = document.getElementById("video");
    const scanLine = document.getElementById("scanLine");
    const statusMsg = document.getElementById("statusMsg");
    const captureBtn = document.getElementById("captureBtn");

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        scanLine.style.display = "block";
        statusMsg.innerText = "Scanning Face...";
        statusMsg.style.color = "#fff";
        captureBtn.disabled = true;

        // Simulate API Call (Face Recognition)
        setTimeout(() => {
            // Success Logic
            statusMsg.innerText = "✅ Attendance Marked!";
            statusMsg.style.color = "#22c55e";

            let captureBtn = document.getElementById("captureBtn")
            captureBtn.style.backgroundColor = "gray";
            captureBtn.style.cursor="not-allowed";
            
            // --- AUTOMATIC CAMERA OFF ---
            if (stream) {
                stream.getTracks().forEach(track => track.stop()); // Stop all tracks
                video.srcObject = null;
            }
            scanLine.style.display = "none";
            
        }, 3000);

    } catch (err) {
        statusMsg.innerText = "❌ Camera Access Denied!";
        statusMsg.style.color = "#f87171";
    }
}

// 3. STATS & TABLE LOGIC
function renderStatsAndTable() {
    let total = 0, present = 0;
    const tbody = document.getElementById("subjectTableBody");
    tbody.innerHTML = "";

    subjectAttendance.forEach(s => {
        total += s.total;
        present += s.present;
        const p = ((s.present / s.total) * 100).toFixed(1);
        
        let status, colorClass, barColor;
        if (p >= 75) { status = "Safe"; colorClass = "safe"; barColor = "#22c55e"; }
        else if (p >= 70) { status = "Warning"; colorClass = "warning"; barColor = "#eab308"; }
        else { status = "Danger"; colorClass = "danger"; barColor = "#ef4444"; }

        tbody.innerHTML += `
            <tr>
                <td><strong>${s.subject}</strong></td>
                <td>${s.total}</td>
                <td>${s.present}</td>
                <td>${s.total - s.present}</td>
                <td><span class="status-pill ${colorClass}">${status}</span></td>
                <td>
                    <div style="width: 100%; background: #f1f5f9; height: 6px; border-radius: 10px; overflow: hidden; margin-bottom:4px;">
                        <div style="width: ${p}%; background: ${barColor}; height: 100%;"></div>
                    </div>
                    <small>${p}%</small>
                </td>
            </tr>`;
    });

    document.getElementById("totalClasses").innerText = total;
    document.getElementById("presentCount").innerText = present;
    document.getElementById("absentCount").innerText = total - present;
    document.getElementById("attendancePercent").innerText = ((present / total) * 100).toFixed(1) + "%";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

navigator.geolocation.getCurrentPosition(
    position => {
        const studentLat = position.coords.latitude;
        const studentLong = position.coords.longitude;

        // ye backend ko bheja jaata hai
    },
    error => {
        alert("Location access is required to mark attendance");
    }
);
