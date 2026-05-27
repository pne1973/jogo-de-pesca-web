const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

/* ============================
   PEIXE REALISTA
============================ */
const fishImg = new Image();
fishImg.src = "https://i.imgur.com/1Q9Z1ZB.png"; // peixe realista

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
   MINI-JOGO DE TENSÃO
============================ */
let catching = false;
let tension = 50;
let tensionDirection = 1;

/* ============================
   INVENTÁRIO
============================ */
let inventory = [];

/* ============================
   SONS
============================ */
const splashSound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
const catchSound = new Audio("https://www.soundjay.com/nature/sounds/water-splash-1.mp3");

/* ============================
   RARIDADE DO PEIXE
============================ */
function getRarity() {
    const r = Math.random();
    if (r < 0.6) return "Comum";
    if (r < 0.85) return "Raro";
    if (r < 0.97) return "Épico";
    return "Lendário";
}

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
    if (catching) return; // peixe para quando está a ser capturado

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
   BARRA DE TENSÃO
============================ */
function drawTensionBar() {
    if (!catching) return;

    // fundo
    ctx.fillStyle = "black";
    ctx.fillRect(300, 20, 200, 20);

    // barra
    ctx.fillStyle = "lime";
    ctx.fillRect(300, 20, tension * 2, 20);

    // zona ideal
    ctx.fillStyle = "yellow";
    ctx.fillRect(380, 20, 40, 20);
}

/* ============================
   VERIFICAR CAPTURA
============================ */
function checkCatch() {
    if (!line || catching) return;

    const dx = line.x - fish.x;
    const dy = line.y - fish.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < fish.size) {
        catching = true;
        splashSound.play();
        line = null;

        // mini-jogo de 3 segundos
        setTimeout(() => {
            if (tension > 40 && tension < 60) {
                const rarity = getRarity();
                score++;
                catchSound.play();

                inventory.push({
                    rarity,
                    time: new Date().toLocaleTimeString()
                });

                alert("🎣 Capturaste um peixe " + rarity + "! Total: " + score);
            } else {
                alert("❌ O peixe fugiu!");
            }

            catching = false;
            tension = 50;

            // reposicionar peixe
            fish.x = Math.random() * 700 + 50;
            fish.y = Math.random() * 300 + 150;

        }, 3000);
    }
}

/* ============================
   CLIQUE PARA LANÇAR LINHA
============================ */
canvas.addEventListener("click", (e) => {
    if (catching) return;

    const rect = canvas.getBoundingClientRect();
    line = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    splashSound.play();
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
    drawTensionBar();
    checkCatch();

    // animação da barra de tensão
    if (catching) {
        tension += tensionDirection * 0.5;
        if (tension > 100 || tension < 0) tensionDirection *= -1;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
