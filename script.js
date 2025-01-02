// Dynamically load views into the main container
function loadView(viewPath, callback = null) {
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

// Update the header based on the current view
function updateHeader(view) {
    const navLinks = document.getElementById('nav-links');
    if (view === 'login') {
        navLinks.classList.add('hidden'); // Hide navigation links for login
    } else {
        navLinks.classList.remove('hidden'); // Show navigation links for other views
    }
}

// Load login view on page load
document.addEventListener('DOMContentLoaded', () => {
    loadView('views/login.html', () => updateHeader('login'));
});

// Handle login
function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        console.log(`User logged in: ${username}`);
        loadView('views/dashboard.html', () => {
            updateHeader('dashboard');
            setupDashboard();
        });
    } else {
        alert('Please enter your LUH-ID and WebSSO password.');
    }
}

// Set up dashboard functionality
function setupDashboard() {
    document.getElementById('logout-button').addEventListener('click', logout);

    // Example: Set up event listeners for open and completed assignments
    document.querySelectorAll('.toggle-section').forEach((btn) => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.sectionId;
            toggleSection(sectionId);
        });
    });

    document.getElementById('file-input').addEventListener('change', redirectToUploadPage);
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
    loadView('views/thank-you.html', () => {
        updateHeader('thank-you');
        document
            .getElementById('return-to-dashboard-button')
            .addEventListener('click', () => {
                loadView('views/dashboard.html', () => {
                    updateHeader('dashboard');
                    setupDashboard();
                });
            });
    });
}

// Logout and return to login screen
function logout() {
    loadView('views/login.html', () => updateHeader('login'));
    alert('Sie haben sich erfolgreich ausgeloggt.');
}

// Switch pages (e.g., Startseite, Aufgaben)
function goToPage(page) {
    alert(`Wechsel zu: ${page}`);
}
