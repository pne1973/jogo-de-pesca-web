const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

/* ============================
   PEIXE REALISTA
============================ */
const fishImg = new Image();
fishImg.src = "https://i.imgur.com/1Q9Z1ZB.png"; // imagem de peixe realista

let fish = {
    x: Math.random() * 700 + 50,
    y: Math.random() * 300 + 150,
    size: 30,
    speed: 2
};

/* ============================
   LINHA DE PESCA
============================ */
let line = null;
let score = 0;

/* ============================
   ÁGUA ANIMADA
============================ */
let waveOffset = 0;

/* ============================
   DESENHAR PEIXE
============================ */
function drawFish() {
    ctx.drawImage(fishImg, fish.x - 40, fish.y - 20, 80, 40);
}

/* ============================
   MOVER PEIXE
============================ */
function moveFish() {
    fish.x += fish.speed;

    if (fish.x > canvas.width - 50 || fish.x < 50) {
        fish.speed *= -1;
    }
}

/* ============================
   DESENHAR LINHA
============================ */
function drawLine() {
    if (!line) return;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(line.x, line.y);
    ctx.stroke();
}

/* ============================
   VERIFICAR CAPTURA
============================ */
function checkCatch() {
    if (!line) return;

    const dx = line.x - fish.x;
    const dy = line.y - fish.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < fish.size) {
        score++;
        alert("🎣 Pescaste um peixe! Total: " + score);

        // reposicionar peixe
        fish.x = Math.random() * 700 + 50;
        fish.y = Math.random() * 300 + 150;

        line = null;
    }
}

/* ============================
   CLIQUE PARA LANÇAR LINHA
============================ */
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    line = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
});

/* ============================
   LOOP PRINCIPAL DO JOGO
============================ */
function gameLoop() {
    // fundo da água
    ctx.fillStyle = "#003f7f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ondas animadas
    waveOffset += 0.05;
    for (let i = 0; i < canvas.width; i += 20) {
        const waveHeight = Math.sin(i * 0.02 + waveOffset) * 5;
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(i, 250 + waveHeight, 20, 3);
    }

    drawFish();
    moveFish();
    drawLine();
    checkCatch();

    requestAnimationFrame(gameLoop);
}

gameLoop();
