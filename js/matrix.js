const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

const characters =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const fontSize = 16;
let columns;
let drops;

function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    columns = Math.floor(window.innerWidth / fontSize);

    drops = Array.from(
        { length: columns },
        () => Math.random() * -100
    );
}

function drawMatrix() {
    ctx.fillStyle = "rgba(2, 6, 23, 0.08)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const character =
            characters[Math.floor(Math.random() * characters.length)];

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = "#00ff41";
        ctx.fillText(character, x, y);

        drops[i]++;

        if (
            y > window.innerHeight &&
            Math.random() > 0.975
        ) {
            drops[i] = Math.random() * -20;
        }
    }

    requestAnimationFrame(drawMatrix);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawMatrix();
