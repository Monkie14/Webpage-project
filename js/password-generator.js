const lengthInput = document.getElementById("passwordLength");
const lengthValue = document.getElementById("lengthValue");
const display = document.getElementById("passwordDisplay");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
});

function generatePassword() {
    const uppercase = document.getElementById("uppercase").checked;
    const lowercase = document.getElementById("lowercase").checked;
    const numbers = document.getElementById("numbers").checked;
    const symbols = document.getElementById("symbols").checked;

    let characters = "";
    let password = "";

    if (uppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) characters += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) characters += "0123456789";
    if (symbols) characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!characters) {
        alert("Оберіть хоча б один тип символів.");
        return;
    }

    for (let i = 0; i < lengthInput.value; i++) {
        const index = Math.floor(Math.random() * characters.length);
        password += characters[index];
    }

    display.value = password;
    calculateStrength(password);
}

function calculateStrength(password) {
    let score = 0;

    if (password.length >= 12) score += 30;
    else if (password.length >= 8) score += 15;

    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    strengthBar.style.width = score + "%";

    if (score < 40) {
        strengthBar.style.background = "#ef4444";
        strengthText.textContent = "Міцність: слабкий";
    } else if (score < 70) {
        strengthBar.style.background = "#f59e0b";
        strengthText.textContent = "Міцність: середній";
    } else {
        strengthBar.style.background = "#10b981";
        strengthText.textContent = "Міцність: сильний";
    }
}

copyButton.addEventListener("click", async () => {
    if (!display.value) {
        alert("Спочатку згенеруйте пароль.");
        return;
    }

    await navigator.clipboard.writeText(display.value);
    copyButton.textContent = "Скопійовано!";

    setTimeout(() => {
        copyButton.textContent = "Копіювати";
    }, 1500);
});

generateButton.addEventListener("click", generatePassword);

generatePassword();
