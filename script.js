// Zuordnung von Assignments zu hochgeladenen Dateien
let assignmentToFileMap = {};

// Login-Funktion
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('nav-links').classList.remove('hidden');
    } else {
        alert("Bitte geben Sie Benutzername und Passwort ein.");
    }
}

// Bereich ein-/ausklappen
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
}

// Öffnet den Datei-Explorer
function openFileExplorer() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
}

// Zeigt Bestätigungsseite nach Dateiauswahl
function redirectToUploadPage(event) {
    const file = event.target.files[0];
    if (file) {
        const openAssignmentsList = document.getElementById('open-assignments');
        const firstOpenAssignment = openAssignmentsList.querySelector('li');
        const assignmentName = firstOpenAssignment ? firstOpenAssignment.textContent.trim() : null;

        if (assignmentName) {
            assignmentToFileMap[assignmentName] = file.name;

            document.getElementById('dashboard').classList.add('hidden');
            document.getElementById('file-confirmation').classList.remove('hidden');
            document.getElementById('uploaded-filename').textContent = file.name;
        } else {
            alert("Kein offenes Assignment verfügbar.");
        }
    }
}

// Datei hochladen und verschieben
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

        document.getElementById('file-confirmation').classList.add('hidden');
        document.getElementById('thank-you').classList.remove('hidden');

        // Reiter für "Offene Assignments" und "Abgeschlossene Assignments" öffnen
        document.getElementById('open-assignments').classList.remove('hidden');
        document.getElementById('completed-assignments').classList.remove('hidden');
    } else {
        alert("Kein Dateiname gefunden.");
    }
}

// Verschiebt das Assignment zu den abgeschlossenen
function moveToCompletedAssignments(assignmentName, fileName) {
    const completedAssignmentsList = document.getElementById('completed-assignments');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${assignmentName}
        <button onclick="downloadFile('${fileName}')">⬇ Download</button>
    `;
    completedAssignmentsList.appendChild(listItem);

    const openAssignmentsList = document.getElementById('open-assignments');
    const openAssignmentItem = Array.from(openAssignmentsList.children).find(item =>
        item.textContent.includes(assignmentName)
    );
    if (openAssignmentItem) {
        openAssignmentsList.removeChild(openAssignmentItem); // Entfernt das Assignment vollständig
    }
}

// Logout
function logout() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('nav-links').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    alert("Sie haben sich erfolgreich ausgeloggt.");
}

// Wechsel zur Startseite
function goToStartseite() {
    document.getElementById('thank-you').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

