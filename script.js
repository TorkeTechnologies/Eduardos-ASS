// Login-Funktion: Zeigt das Dashboard und versteckt den Login-Bereich
function handleLogin(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        document.getElementById('login-screen').classList.add('hidden'); // Versteckt Login
        document.getElementById('dashboard').classList.remove('hidden'); // Zeigt Dashboard
    } else {
        alert("Bitte geben Sie Benutzername und Passwort ein.");
    }
}

// Bereich ein-/ausklappen
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
}
