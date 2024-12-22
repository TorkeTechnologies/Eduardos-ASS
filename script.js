// Login-Funktion: Zeigt das Dashboard, aktualisiert den Header
function handleLogin(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        document.getElementById('login-screen').classList.add('hidden'); // Versteckt Login
        document.getElementById('dashboard').classList.remove('hidden'); // Zeigt Dashboard
        document.getElementById('nav-links').classList.remove('hidden'); // Zeigt Navigationsleiste
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
    fileInput.click(); // Simuliert einen Klick auf das versteckte Datei-Eingabeelement
}

// Leitet zur Upload-Bestätigungsseite weiter
function redirectToUploadPage(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('file-confirmation').classList.remove('hidden');
        document.getElementById('uploaded-filename').textContent = file.name;
    }
}

// Handhabt den finalen Upload und zeigt die Dankesseite
function submitFile() {
    document.getElementById('file-confirmation').classList.add('hidden');
    document.getElementById('thank-you').classList.remove('hidden');
}

// Zurück zur Startseite
function goToStartseite() {
    document.getElementById('thank-you').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

// Logout-Funktion: Zurück zum Login
function logout() {
    document.getElementById('dashboard').classList.add('hidden'); // Versteckt Dashboard
    document.getElementById('nav-links').classList.add('hidden'); // Versteckt Navigationsleiste
    document.getElementById('login-screen').classList.remove('hidden'); // Zeigt Login-Bereich
    alert("Sie haben sich erfolgreich ausgeloggt.");
}

// Seitenwechsel-Funktion (für Startseite, Aufgaben)
function goToPage(page) {
    alert(`Wechsel zu: ${page}`);
}
