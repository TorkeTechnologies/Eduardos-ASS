// Variables

var studentLoggedIn = false;
var tutorLoggedIn = false;
var openAssignments = ["GMCI_Assignment07"];
var completedAssignments = [
    "GMCI_Assignment06",
    "GMCI_Assignment05",
    "GMCI_Assignment04",
    "GMCI_Assignment03",
    "GMCI_Assignment02",
    "GMCI_Assignment01",
];
var outstandingAssignments = [
    "GMCI_Assignment06",
    "GMCI_Assignment05"
]
var gradedAssignments = [
    "GMCI_Assignment04",
    "GMCI_Assignment03",
    "GMCI_Assignment02",
    "GMCI_Assignment01",
]

// Load home view on page load
document.addEventListener('DOMContentLoaded', () => { loadHome(); });

function mascotImageSrc() {
    if (openAssignments.length < 1) {
        console.log("Major image loaded");
        return "../Mascot0.png";
    }
    return "../Mascot1.png";
}

// Dynamically load views into the main container
function loadView(viewPath, callback = null) {
    const navLinks = document.getElementById('nav-links');
    {
        if (!studentLoggedIn && !tutorLoggedIn) {
            navLinks.classList.add('hidden'); // Hide navigation links for login
        } else {
            navLinks.classList.remove('hidden'); // Show navigation links for other views
        }
        fetch(viewPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load view: ${response.status}`);
                }
                return response.text();
            })
            .then((html) => {
                document.getElementById('view-container').innerHTML = html;
                if (callback) callback(); // Run the callback after loading the view
            })
            .catch((error) => console.error('Error loading view:', error));
    }
}

// Handle login
function handleStudentLogin(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        studentLoggedIn = true;
        console.log(`User logged in: ${username}`);
        loadStudentDashboard();
    } else {
        alert('Please enter your LUH-ID and WebSSO password.');
    }
}

function handleTutorLogin(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        tutorLoggedIn = true;
        console.log(`User logged in: ${username}`);
        loadTutorDashboard()
    } else {
        alert('Please enter your LUH-ID and WebSSO password.');
    }
}

function loadAssignments() {
    if (studentLoggedIn) {
        loadStudentDashboard();
        return;
    }
    loadTutorDashboard()
}

function  loadHome() {
    loadView('views/home.html', updateHomeBasedOnLogin)
}

function loadTutorDashboard() {
    loadView('views/tutor-dashboard.html', setupTutorDashboard());
}

function setupTutorDashboard() {

}

function loadStudentDashboard() {
    loadView('views/student-dashboard.html', () =>{
        setupStudentDashboard();
    });
}

// Set up dashboard functionality
function setupStudentDashboard() {
    document.getElementById('mascot').src = mascotImageSrc();
    populateAssignmentList('open-assignments', openAssignments, false);
    populateAssignmentList('completed-assignments', completedAssignments, true);
}

// Toggle section visibility
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
}

// Open file explorer
function openFileExplorer() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
}

// Redirect to file confirmation page
function redirectToUploadPage(event) {
    const file = event.target.files[0];
    if (file) {
        loadView('views/file-confirmation.html', () => {
            updateHeader('file-confirmation');
            document.getElementById('uploaded-filename').textContent = file.name;
            document
                .getElementById('submit-file-button')
                .addEventListener('click', submitFile);
        });
    }
}

// Submit file and show thank-you page
function submitFile() {
    const uploadedFileName = document.getElementById('uploaded-filename').textContent;
    if (uploadedFileName) {
        const assignmentName = Object.keys(assignmentToFileMap).find(
            key => assignmentToFileMap[key] === uploadedFileName
        );
        if (assignmentName) {
            moveToCompletedAssignments(assignmentName, uploadedFileName);
            delete assignmentToFileMap[assignmentName];
        }
        loadView('views/thank-you.html', () => {
            updateHeader('thank-you');
            document
                .getElementById('return-to-dashboard-button')
                .addEventListener('click', () => {
                    loadView('views/student-dashboard.html', () => {
                        updateHeader('dashboard');
                        setupDashboard();
                    });
                });
        });
    } else {
        alert("Kein Dateiname gefunden.");
    }
}

// Logout and return to home screen
function logout() {
    studentLoggedIn = false;
    tutorLoggedIn = false;
    loadHome();
    alert('Sie haben sich erfolgreich ausgeloggt.');
}

function updateHomeBasedOnLogin() {
    const studentLoginButton = document.getElementById('student-login-button');
    const tutorLoginButton = document.getElementById('tutor-login-button');

    // Check if the student is logged in
    if (studentLoggedIn) {
        studentLoginButton.textContent = "Studenten Dashboard"; // Change button text
        studentLoginButton.onclick = () => loadStudentDashboard();
    } else {
        studentLoginButton.textContent = "Student Login"; // Change button text
        studentLoginButton.onclick = () => loadView('views/student-login.html');
    }

    // Check if the tutor is logged in
    if (tutorLoggedIn) {
        tutorLoginButton.textContent = "Tutor Dashboard"; // Change button text
        tutorLoginButton.onclick = () => loadTutorDashboard();
    } else {
        tutorLoginButton.textContent = "Tutor Login"; // Change button text
        tutorLoginButton.onclick = () => loadView('views/tutor-login.html');
    }
}

// Dashboards

// Function to populate a list dynamically
function populateAssignmentList(listId, assignments, isCompleted) {
    const listElement = document.getElementById(listId);

    // Clear existing content
    listElement.innerHTML = "";

    // Add assignments to the list
    assignments.forEach((assignment) => {
        const listItem = document.createElement("li");
        listItem.textContent = assignment;

        // Add button based on the list type
        const button = document.createElement("button");
        if (isCompleted) {
            button.textContent = "⬇ Download";
            button.onclick = () => alert(`Downloading ${assignment}`);
        } else {
            button.textContent = "📤 Upload";
            button.onclick = openFileExplorer;
        }

        listItem.appendChild(button);

        // For "open assignments", include a file input
        if (!isCompleted) {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.className = "hidden";
            fileInput.onchange = redirectToUploadPage;
            listItem.appendChild(fileInput);
        }

        listElement.appendChild(listItem);
    });
}