const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let fish = {
    x: Math.random() * 700 + 50,
    y: Math.random() * 300 + 150,
    size: 30,
    speed: 2
};

let line = null;
let score = 0;

function drawFish() {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.ellipse(fish.x, fish.y, fish.size, fish.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
}

function moveFish() {
    fish.x += fish.speed;

    if (fish.x > canvas.width - 50 || fish.x < 50) {
        fish.speed *= -1;
    }
}

function drawLine() {
    if (!line) return;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(line.x, line.y);
    ctx.stroke();
}

function checkCatch() {
    if (!line) return;

    const dx = line.x - fish.x;
    const dy = line.y - fish.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < fish.size) {
        score++;
        alert("🎣 Pescaste um peixe! Total: " + score);

        fish.x = Math.random() * 700 + 50;
        fish.y = Math.random() * 300 + 150;
        line = null;
    }
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    line = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawFish();
    moveFish();
    drawLine();
    checkCatch();

    requestAnimationFrame(gameLoop);
}

gameLoop();
