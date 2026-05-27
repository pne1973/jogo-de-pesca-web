const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const btnPlay = document.getElementById("btnPlay");
const btnInventory = document.getElementById("btnInventory");
const inventoryModal = document.getElementById("inventoryModal");
const btnCloseInventory = document.getElementById("btnCloseInventory");
const inventoryList = document.getElementById("inventoryList");

canvas.width = 800;
canvas.height = 500;

/* PEIXES (VÁRIOS TIPOS) */
const fishSprites = [
    {
        name: "Robalo",
        img: loadImage("https://i.imgur.com/1Q9Z1ZB.png"),
        baseSpeed: 2
    },
    {
        name: "Truta",
        img: loadImage("https://i.imgur.com/5qQ7p3M.png"),
        baseSpeed: 1.5
    },
    {
        name: "Carpa",
        img: loadImage("https://i.imgur.com/7m0xq0G.png"),
        baseSpeed: 1.2
    }
];

let currentFishType = fishSprites[0];

let fish = {
    x: randomRange(50, 750),
    y: randomRange(180, 420),
    size: 30,
    speed: 2
};

/* LINHA / ESTADO */
let line = null;
let score = 0;
let gameRunning = false;

/* ÁGUA ANIMADA */
let waveOffset = 0;

/* MINI-JOGO DE TENSÃO */
let catching = false;
let tension = 50;
let tensionDirection = 1;

/* INVENTÁRIO */
let inventory = [];

/* SONS */
const splashSound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
const catchSound = new Audio("https://www.soundjay.com/nature/sounds/water-splash-1.mp3");

/* FUNÇÕES UTIL */
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

/* RARIDADE */
function getRarity() {
    const r = Math.random();
    if (r < 0.6) return "Comum";
    if (r < 0.85) return "Raro";
    if (r < 0.97) return "Épico";
    return "Lendário";
}

/* ESCOLHER TIPO DE PEIXE */
function chooseFishType() {
    const r = Math.random();
    if (r < 0.5) currentFishType = fishSprites[0];      // Robalo
    else if (r < 0.8) currentFishType = fishSprites[1]; // Truta
    else currentFishType = fishSprites[2];              // Carpa

    fish.speed = currentFishType.baseSpeed * (Math.random() < 0.5 ? 1 : -1);
}

/* DESENHAR PEIXE */
function drawFish() {
    const img = currentFishType.img;
    ctx.drawImage(img, fish.x - 40, fish.y - 20, 80, 40);
}

/* MOVER PEIXE */
function moveFish() {
    if (catching || !gameRunning) return;

    fish.x += fish.speed;

    if (fish.x > canvas.width - 50 || fish.x < 50) {
        fish.speed *= -1;
    }
}

/* DESENHAR LINHA */
function drawLine() {
    if (!line || !gameRunning) return;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(line.x, line.y);
    ctx.stroke();
}

/* BARRA DE TENSÃO */
function drawTensionBar() {
    if (!catching || !gameRunning) return;

    ctx.fillStyle = "black";
    ctx.fillRect(300, 20, 200, 20);

    ctx.fillStyle = "lime";
    ctx.fillRect(300, 20, tension * 2, 20);

    ctx.fillStyle = "yellow";
    ctx.fillRect(380, 20, 40, 20);
}

/* VERIFICAR CAPTURA */
function checkCatch() {
    if (!line || catching || !gameRunning) return;

    const dx = line.x - fish.x;
    const dy = line.y - fish.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < fish.size) {
        catching = true;
        splashSound.play();
        line = null;

        setTimeout(() => {
            if (tension > 40 && tension < 60) {
                const rarity = getRarity();
                score++;
                catchSound.play();

                inventory.push({
                    name: currentFishType.name,
                    rarity,
                    time: new Date().toLocaleTimeString()
                });

                alert("🎣 Capturaste um " + currentFishType.name + " " + rarity + "! Total: " + score);
            } else {
                alert("❌ O peixe fugiu!");
            }

            catching = false;
            tension = 50;

            chooseFishType();
            fish.x = randomRange(50, 750);
            fish.y = randomRange(180, 420);

        }, 3000);
    }
}

/* CLIQUE NO CANVAS */
canvas.addEventListener("click", (e) => {
    if (catching || !gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    line = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    splashSound.play();
});

/* MENU: JOGAR */
btnPlay.addEventListener("click", () => {
    gameRunning = true;
    canvas.style.display = "block";
});

/* MENU: INVENTÁRIO */
btnInventory.addEventListener("click", () => {
    updateInventoryUI();
    inventoryModal.classList.remove("hidden");
});

/* FECHAR INVENTÁRIO */
btnCloseInventory.addEventListener("click", () => {
    inventoryModal.classList.add("hidden");
});

/* ATUALIZAR INVENTÁRIO VISUAL */
function updateInventoryUI() {
    inventoryList.innerHTML = "";

    if (inventory.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Ainda não pescaste nenhum peixe.";
        inventoryList.appendChild(li);
        return;
    }

    inventory.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${item.name} (${item.rarity}) - ${item.time}`;
        inventoryList.appendChild(li);
    });
}

/* LOOP PRINCIPAL */
function gameLoop() {
    ctx.fillStyle = "#003f7f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    if (catching && gameRunning) {
        tension += tensionDirection * 0.5;
        if (tension > 100 || tension < 0) tensionDirection *= -1;
    }

    requestAnimationFrame(gameLoop);
}

/* INÍCIO */
chooseFishType();
gameLoop();
