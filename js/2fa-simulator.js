const loginStep = document.getElementById("loginStep");
const codeStep = document.getElementById("codeStep");
const loginButton = document.getElementById("loginButton");
const verifyButton = document.getElementById("verifyButton");
const result = document.getElementById("result");
const codeInput = document.getElementById("codeInput");
const currentCodeElement = document.getElementById("currentCode");
const timerElement = document.getElementById("timer");
const usernameInput = document.getElementById("username");
const displayUser = document.getElementById("displayUser");

let currentCode = "";
let seconds = 30;

function createCode() {
    currentCode = Math.floor(100000 + Math.random() * 900000).toString();
    currentCodeElement.textContent = currentCode;
}

function startTimer() {
    setInterval(() => {
        seconds--;

        if (seconds <= 0) {
            seconds = 30;
            createCode();
        }

        timerElement.textContent = seconds;
    }, 1000);
}

loginButton.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        result.textContent = "Заповніть усі поля.";
        result.className = "result error";
        return;
    }

    displayUser.textContent = username;
    loginStep.classList.add("hidden");
    codeStep.classList.remove("hidden");

    result.textContent = "Пароль правильний. Введіть код 2FA.";
    result.className = "result";
});

verifyButton.addEventListener("click", () => {
    const enteredCode = codeInput.value.trim();

    if (enteredCode === currentCode) {
        result.textContent = "✅ Вхід успішний! Двофакторну автентифікацію пройдено.";
        result.className = "result success";
    } else {
        result.textContent = "❌ Неправильний код. Спробуйте ще раз.";
        result.className = "result error";
    }
});

createCode();
startTimer();
