const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");
const scoreText = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const bestScore = document.getElementById("bestScore");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

let bird;
let pipes;
let score;
let best = Number(localStorage.getItem("flappyBest")) || 0;

let gameRunning = false;
let gameStarted = false;

const gravity = 0.42;
const jumpPower = -7.5;
const pipeSpeed = 2.5;
const pipeWidth = 65;
const pipeGap = 155;
const groundHeight = 55;

function resetGame() {
    bird = {
        x: 80,
        y: 280,
        radius: 15,
        velocity: 0,
        rotation: 0
    };

    pipes = [];
    score = 0;
    scoreText.textContent = "0";

    gameStarted = false;
    gameRunning = true;

    menu.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    addPipe();
}

function addPipe() {
    const minTop = 70;
    const maxTop = canvas.height - groundHeight - pipeGap - 70;

    const topHeight =
        Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        scored: false
    });
}

function flap() {
    if (!gameRunning) return;

    gameStarted = true;
    bird.velocity = jumpPower;
}

function endGame() {
    gameRunning = false;

    if (score > best) {
        best = score;
        localStorage.setItem("flappyBest", best);
    }

    finalScore.textContent = score;
    bestScore.textContent = best;

    gameOverScreen.classList.remove("hidden");
}

function update() {
    if (!gameRunning) return;

    if (gameStarted) {
        bird.velocity += gravity;
        bird.y += bird.velocity;

        bird.rotation = Math.min(
            Math.max(bird.velocity * 0.08, -0.5),
            1.2
        );

        for (const pipe of pipes) {
            pipe.x -= pipeSpeed;

            if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
                pipe.scored = true;
                score++;
                scoreText.textContent = score;
            }

            const hitX =
                bird.x + bird.radius > pipe.x &&
                bird.x - bird.radius < pipe.x + pipeWidth;

            const hitTop =
                bird.y - bird.radius < pipe.top;

            const bottomPipeY = pipe.top + pipeGap;

            const hitBottom =
                bird.y + bird.radius > bottomPipeY;

            if (hitX && (hitTop || hitBottom)) {
                endGame();
            }
        }

        pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

        if (
            pipes.length === 0 ||
            pipes[pipes.length - 1].x < canvas.width - 220
        ) {
            addPipe();
        }

        if (
            bird.y - bird.radius < 0 ||
            bird.y + bird.radius > canvas.height - groundHeight
        ) {
            endGame();
        }
    }
}

function drawBackground() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nuvens
    ctx.fillStyle = "rgba(255,255,255,0.7)";

    ctx.beginPath();
    ctx.arc(80, 100, 25, 0, Math.PI * 2);
    ctx.arc(110, 100, 35, 0, Math.PI * 2);
    ctx.arc(145, 105, 23, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(280, 180, 22, 0, Math.PI * 2);
    ctx.arc(310, 175, 32, 0, Math.PI * 2);
    ctx.arc(345, 180, 22, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipes() {
    for (const pipe of pipes) {
        // Cano de cima
        ctx.fillStyle = "#58be43";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);

        ctx.fillStyle = "#3d9c32";
        ctx.fillRect(pipe.x, 0, 10, pipe.top);

        ctx.fillStyle = "#70d957";
        ctx.fillRect(pipe.x + 10, 0, 10, pipe.top);

        // Tampa de cima
        ctx.fillStyle = "#58be43";
        ctx.fillRect(
            pipe.x - 5,
            pipe.top - 25,
            pipeWidth + 10,
            25
        );

        // Cano de baixo
        const bottomY = pipe.top + pipeGap;

        ctx.fillStyle = "#58be43";
        ctx.fillRect(
            pipe.x,
            bottomY,
            pipeWidth,
            canvas.height - groundHeight - bottomY
        );

        ctx.fillStyle = "#3d9c32";
        ctx.fillRect(
            pipe.x,
            bottomY,
            10,
            canvas.height - groundHeight - bottomY
        );

        ctx.fillStyle = "#70d957";
        ctx.fillRect(
            pipe.x + 10,
            bottomY,
            10,
            canvas.height - groundHeight - bottomY
        );

        // Tampa de baixo
        ctx.fillStyle = "#58be43";
        ctx.fillRect(
            pipe.x - 5,
            bottomY,
            pipeWidth + 10,
            25
        );
    }
}

function drawGround() {
    ctx.fillStyle = "#ded895";
    ctx.fillRect(
        0,
        canvas.height - groundHeight,
        canvas.width,
        groundHeight
    );

    ctx.fillStyle = "#8bc34a";
    ctx.fillRect(
        0,
        canvas.height - groundHeight,
        canvas.width,
        12
    );

    ctx.fillStyle = "#6da33a";

    for (let x = 0; x < canvas.width; x += 25) {
        ctx.fillRect(
            x,
            canvas.height - groundHeight + 12,
            12,
            8
        );
    }
}

function drawBird() {
    ctx.save();

    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);

    // Corpo
    ctx.fillStyle = "#ffd93d";
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Asa
    ctx.fillStyle = "#f2b632";
    ctx.beginPath();
    ctx.ellipse(-5, 5, 11, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Olho
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(7, -7, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(9, -7, 3, 0, Math.PI * 2);
    ctx.fill();

    // Bico
    ctx.fillStyle = "#f28c28";
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(27, 5);
    ctx.lineTo(12, 9);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function draw() {
    drawBackground();
    drawPipes();
    drawGround();
    drawBird();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function startGame() {
    resetGame();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

document.addEventListener("keydown", event => {
    if (event.code === "Space") {
        event.preventDefault();

        if (!gameRunning) {
            startGame();
        } else {
            flap();
        }
    }
});

canvas.addEventListener("mousedown", () => {
    if (!gameRunning) {
        startGame();
    } else {
        flap();
    }
});

canvas.addEventListener(
    "touchstart",
    event => {
        event.preventDefault();

        if (!gameRunning) {
            startGame();
        } else {
            flap();
        }
    },
    { passive: false }
);

bestScore.textContent = best;

resetGame();
gameRunning = false;
menu.classList.remove("hidden");

loop();
