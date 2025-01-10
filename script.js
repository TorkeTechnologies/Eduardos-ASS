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
    "GMCI_Assignment01"
];
var closedAssignments = [
    "GMCI_Assignment06",
    "GMCI_Assignment05",
    "GMCI_Assignment04",
    "GMCI_Assignment03",
    "GMCI_Assignment02",
    "GMCI_Assignment01"
];
var outstandingAssignments = [
    "GMCI_Assignment06",
    "GMCI_Assignment05"
];
var gradedAssignments = [
    "GMCI_Assignment04",
    "GMCI_Assignment03",
    "GMCI_Assignment02",
    "GMCI_Assignment01"
];
var groups = [
    "Group 3",
    "Group 9",
    "Group 33"
]
const assignmentMaxPoints = new Map()
assignmentMaxPoints.set("GMCI_Assignment07", 25)
assignmentMaxPoints.set("GMCI_Assignment06", 30)
assignmentMaxPoints.set("GMCI_Assignment05", 29)
assignmentMaxPoints.set("GMCI_Assignment04", 24)
assignmentMaxPoints.set("GMCI_Assignment03", 31)
assignmentMaxPoints.set("GMCI_Assignment02", 22)
assignmentMaxPoints.set("GMCI_Assignment01", 27)
const assignmentGrades = new Map();
assignmentGrades.set("GMCI_Assignment04", 22);
assignmentGrades.set("GMCI_Assignment03", 31);
assignmentGrades.set("GMCI_Assignment02", 21);
assignmentGrades.set("GMCI_Assignment01", 26);
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
        tutorLoggedIn = false;
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
        studentLoggedIn = false;
        console.log(`User logged in: ${username}`);
        loadTutorDashboard()
    } else {
        alert('Please enter your LUH-ID and WebSSO password.');
    }
}

function loadAssignment(assignment) {
    loadView('views/assignment.html', () => {
        document.getElementById('assignmentTitle').textContent = assignment;
        if (completedAssignments.includes(assignment)) {
            document.getElementById('downloadWork').classList.remove('hidden');
        }
        if (!closedAssignments.includes(assignment) && studentLoggedIn) {
            let uploadWork = document.getElementById('uploadWork')
            uploadWork.classList.remove('hidden');
            uploadWork.onclick = () => openFileExplorer(assignment, submitWork);
        }

        if (gradedAssignments.includes(assignment)) {
            document.getElementById('downloadGrading').classList.remove('hidden');
        }

        if (tutorLoggedIn) {
            let uploadGrading = document.getElementById('uploadGrading');
            uploadGrading.classList.remove('hidden');
            uploadGrading.onclick = () => openFileExplorer(assignment, submitGrading);
        }
    });
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
    loadView('views/tutor-dashboard.html', setupTutorDashboard);
}

function setupTutorDashboard() {
    populateAssignmentsTutor('outstanding-assignments', outstandingAssignments, true);
    populateAssignmentsTutor('graded-assignments', gradedAssignments, false);
}

function loadStudentDashboard() {
    loadView('views/student-dashboard.html', () => {
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
function openFileExplorer(assignment, callback) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // Listen for file selection
    fileInput.addEventListener("change", (event) => {
        redirectToUploadPage(event, assignment, callback); // Pass the event when a file is selected
    });

    // Trigger the file input click to open file explorer
    fileInput.click();

    // Clean up the DOM by removing the input element after usage
    fileInput.addEventListener("change", () => {
        document.body.removeChild(fileInput);
    });
}

// Redirect to file confirmation page
function redirectToUploadPage(event, assignment, callback) {
    const file = event.target.files[0]; // Access the selected file
    if (file) {
        loadView("views/file-confirmation.html", () => {
            document.getElementById("uploaded-filename").textContent = file.name;
            document
                .getElementById("submit-button")
                .addEventListener("click", () => callback(assignment));
        });
    }
}

// Submit file and show thank-you page
function submitWork(assignment) {
    let index = openAssignments.indexOf(assignment);
    if (index > -1) {
        openAssignments.splice(index, 1);
    }
    completedAssignments.unshift(assignment);
    loadView('views/thank-you.html');
}

function submitGrading(assignment) {
    let index = outstandingAssignments.indexOf(assignment);
    if (index > -1) {
        outstandingAssignments.splice(index, 1);
    }
    if (!gradedAssignments.includes(assignment)) {
        gradedAssignments.unshift(assignment);
    }
    loadView('views/thank-you.html');
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

function populateAssignmentsTutor(listId, assignments, isCompleted) {
    const listElement = document.getElementById(listId);

    // Clear existing content
    listElement.innerHTML = "";

    if (assignments.length <= 0) {
        let emptyAssignmentsElement = document.createElement("li");
        emptyAssignmentsElement.textContent = "In diesem Bereich sind noch keine Assignments";
        listElement.appendChild(emptyAssignmentsElement);
        return;
    }
    // Add assignments to the list
    assignments.forEach((assignment) => {
        const listItem = document.createElement("li");
        listItem.textContent = assignment;
        listItem.classList.add("assignment");
        listItem.onclick = () => {
            toggleSection((assignment + 'groups'));

        }
        const assGroups = document.createElement("lu");
        assGroups.id = assignment + 'groups';
        assGroups.classList.add("hidden");
        groups.forEach((group) => {
            const groupElement = document.createElement("li");
            groupElement.textContent = group;
            groupElement.classList.add("group");
            groupElement.classList.add("hidden");
            groupElement.onclick = () => loadAssignment(assignment);
            const button = document.createElement("button");
            if (isCompleted) {
                button.textContent = "⬇ Download";
                button.onclick = (event) => {
                    event.stopPropagation();
                    alert(`Downloading ${assignment}`);
                };
            } else {
                button.textContent = "⬆ Upload";
                button.onclick = (event) => {
                    event.stopPropagation();
                    openFileExplorer(assignment, submitGrading);
                };
            }
            groupElement.appendChild(button);
            assGroups.appendChild(groupElement);
        })
        listItem.appendChild(assGroups);
        listElement.appendChild(listItem);
    });
}

// Function to populate a list dynamically
function populateAssignmentList(listId, assignments, isCompleted) {
    const listElement = document.getElementById(listId);

    // Clear existing content
    listElement.innerHTML = "";

    if (assignments.length <= 0) {
        let emptyAssignmentsElement = document.createElement("li");
        emptyAssignmentsElement.textContent = "In diesem Bereich sind noch keine Assignments";
        listElement.appendChild(emptyAssignmentsElement);
        return;
    }
    // Add assignments to the list
    assignments.forEach((assignment) => {
        const listItem = document.createElement("li");
        listItem.textContent = assignment;
        listItem.classList.add("assignment");
        listItem.onclick = () => loadAssignment(assignment);

        // Add button based on the list type
        const button = document.createElement("button");
        if (isCompleted) {
            button.textContent = "⬇ Download";
            button.onclick = (event) => {
                event.stopPropagation();
                alert(`Downloading ${assignment}`);
            };
        } else {
            button.textContent = "⬆ Upload";
            button.onclick = (event) => {
                event.stopPropagation();
                openFileExplorer(assignment, submitWork);
            };
        }
        listItem.appendChild(button);
        listElement.appendChild(listItem);
    });
}