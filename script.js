const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const skinsMenu = document.getElementById("skinsMenu");
const gameOverScreen = document.getElementById("gameOver");

const scoreText = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const bestScore = document.getElementById("bestScore");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const skinsButton = document.getElementById("skinsButton");
const backButton = document.getElementById("backButton");

const skinList = document.getElementById("skinList");


/* =========================
   VARIÁVEIS DO JOGO
========================= */

let bird;
let pipes;
let score;

let best =
    Number(localStorage.getItem("flappyBest")) || 0;

let gameRunning = false;
let gameStarted = false;


/* =========================
   CONFIGURAÇÕES
========================= */

const gravity = 0.42;
const jumpPower = -7.5;
const pipeSpeed = 2.5;
const pipeWidth = 65;
const pipeGap = 155;
const groundHeight = 55;


/* =========================
   SKINS
========================= */

const skins = [
    "Skin1.png",
    "Skin2.png",
    "Skin3.png"
];

let selectedSkin =
    localStorage.getItem("flappySkin");

if (!skins.includes(selectedSkin)) {
    selectedSkin = "Skin1.png";
}


/* =========================
   CARREGAR IMAGENS
========================= */

const birdImages = {};

skins.forEach(function(skin) {

    const image = new Image();

    image.src = "images/" + skin;

    birdImages[skin] = image;

});


/* =========================
   MENU DE SKINS
========================= */

function createSkinMenu() {

    skinList.innerHTML = "";

    skins.forEach(function(skin) {

        const button =
            document.createElement("button");

        button.className = "skin";


        if (skin === selectedSkin) {

            button.classList.add("selected");

        }


        const image =
            document.createElement("img");

        image.src =
            "images/" + skin;

        image.alt = skin;


        button.appendChild(image);


        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                selectedSkin = skin;


                localStorage.setItem(
                    "flappySkin",
                    selectedSkin
                );


                createSkinMenu();

            }
        );


        skinList.appendChild(button);

    });
}


/* =========================
   ABRIR SKINS
========================= */

skinsButton.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        event.stopPropagation();


        menu.classList.add("hidden");

        skinsMenu.classList.remove("hidden");

        gameOverScreen.classList.add("hidden");


        createSkinMenu();

    }
);


/* =========================
   VOLTAR DAS SKINS
========================= */

backButton.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        event.stopPropagation();


        skinsMenu.classList.add("hidden");

        menu.classList.remove("hidden");

    }
);


/* =========================
   RESETAR JOGO
========================= */

function resetGame() {

    bird = {

        x: 80,

        y: 280,

        radius: 20,

        velocity: 0,

        rotation: 0

    };


    pipes = [];

    score = 0;

    scoreText.textContent = "0";


    gameStarted = false;

    gameRunning = true;


    menu.classList.add("hidden");

    skinsMenu.classList.add("hidden");

    gameOverScreen.classList.add("hidden");


    addPipe();
}


/* =========================
   ADICIONAR CANO
========================= */

function addPipe() {

    const minTop = 70;

    const maxTop =
        canvas.height -
        groundHeight -
        pipeGap -
        70;


    const topHeight =
        Math.floor(
            Math.random() *
            (maxTop - minTop + 1)
        ) + minTop;


    pipes.push({

        x: canvas.width,

        top: topHeight,

        scored: false

    });
}


/* =========================
   VOAR
========================= */

function flap() {

    if (!gameRunning) {
        return;
    }


    gameStarted = true;

    bird.velocity = jumpPower;

}


/* =========================
   GAME OVER
========================= */

function endGame() {

    gameRunning = false;


    if (score > best) {

        best = score;

        localStorage.setItem(
            "flappyBest",
            best
        );

    }


    finalScore.textContent = score;

    bestScore.textContent = best;


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* =========================
   UPDATE
========================= */

function update() {

    if (!gameRunning) {
        return;
    }


    if (!gameStarted) {
        return;
    }


    bird.velocity += gravity;

    bird.y += bird.velocity;


    bird.rotation =
        Math.min(
            Math.max(
                bird.velocity * 0.08,
                -0.5
            ),
            1.2
        );


    for (const pipe of pipes) {

        pipe.x -= pipeSpeed;


        /* PONTUAÇÃO */

        if (
            !pipe.scored &&
            pipe.x + pipeWidth < bird.x
        ) {

            pipe.scored = true;

            score++;

            scoreText.textContent =
                score;

        }


        /* COLISÃO */

        const hitX =
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius <
                pipe.x + pipeWidth;


        const hitTop =
            bird.y - bird.radius <
            pipe.top;


        const bottomPipeY =
            pipe.top + pipeGap;


        const hitBottom =
            bird.y + bird.radius >
            bottomPipeY;


        if (
            hitX &&
            (hitTop || hitBottom)
        ) {

            endGame();

            return;

        }

    }


    pipes = pipes.filter(
        pipe =>
            pipe.x + pipeWidth > 0
    );


    if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x <
            canvas.width - 220
    ) {

        addPipe();

    }


    /* CHÃO / TETO */

    if (
        bird.y - bird.radius < 0 ||
        bird.y + bird.radius >
            canvas.height - groundHeight
    ) {

        endGame();

    }

}


/* =========================
   FUNDO
========================= */

function drawBackground() {

    ctx.fillStyle = "#70c5ce";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle =
        "rgba(255,255,255,0.7)";


    ctx.beginPath();

    ctx.arc(
        80,
        100,
        25,
        0,
        Math.PI * 2
    );

    ctx.arc(
        110,
        100,
        35,
        0,
        Math.PI * 2
    );

    ctx.arc(
        145,
        105,
        23,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        280,
        180,
        22,
        0,
        Math.PI * 2
    );

    ctx.arc(
        310,
        175,
        32,
        0,
        Math.PI * 2
    );

    ctx.arc(
        345,
        180,
        22,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================
   CANOS
========================= */

function drawPipes() {

    for (const pipe of pipes) {

        /* CANO DE CIMA */

        ctx.fillStyle = "#58be43";

        ctx.fillRect(
            pipe.x,
            0,
            pipeWidth,
            pipe.top
        );


        ctx.fillStyle = "#3d9c32";

        ctx.fillRect(
            pipe.x,
            0,
            10,
            pipe.top
        );


        ctx.fillStyle = "#70d957";

        ctx.fillRect(
            pipe.x + 10,
            0,
            10,
            pipe.top
        );


        /* TAMPA DE CIMA */

        ctx.fillStyle = "#58be43";

        ctx.fillRect(
            pipe.x - 5,
            pipe.top - 25,
            pipeWidth + 10,
            25
        );


        /* CANO DE BAIXO */

        const bottomY =
            pipe.top + pipeGap;


        ctx.fillStyle = "#58be43";

        ctx.fillRect(
            pipe.x,
            bottomY,
            pipeWidth,
            canvas.height -
                groundHeight -
                bottomY
        );


        ctx.fillStyle = "#3d9c32";

        ctx.fillRect(
            pipe.x,
            bottomY,
            10,
            canvas.height -
                groundHeight -
                bottomY
        );


        ctx.fillStyle = "#70d957";

        ctx.fillRect(
            pipe.x + 10,
            bottomY,
            10,
            canvas.height -
                groundHeight -
                bottomY
        );


        /* TAMPA DE BAIXO */

        ctx.fillStyle = "#58be43";

        ctx.fillRect(
            pipe.x - 5,
            bottomY,
            pipeWidth + 10,
            25
        );

    }

}


/* =========================
   CHÃO
========================= */

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


    for (
        let x = 0;
        x < canvas.width;
        x += 25
    ) {

        ctx.fillRect(
            x,
            canvas.height -
                groundHeight +
                12,
            12,
            8
        );

    }

}


/* =========================
   PASSARINHO
========================= */

function drawBird() {

    const image =
        birdImages[selectedSkin];


    if (
        !image ||
        !image.complete ||
        image.naturalWidth === 0
    ) {

        return;

    }


    ctx.save();


    ctx.translate(
        bird.x,
        bird.y
    );


    ctx.rotate(
        bird.rotation
    );


    const size = 42;


    ctx.drawImage(
        image,
        -size / 2,
        -size / 2,
        size,
        size
    );


    ctx.restore();

}


/* =========================
   DESENHAR
========================= */

function draw() {

    drawBackground();

    drawPipes();

    drawGround();

    drawBird();

}


/* =========================
   LOOP
========================= */

function loop() {

    update();

    draw();

    requestAnimationFrame(loop);

}


/* =========================
   BOTÕES
========================= */

startButton.addEventListener(
    "click",
    function() {

        resetGame();

    }
);


restartButton.addEventListener(
    "click",
    function() {

        resetGame();

    }
);


/* =========================
   ESPAÇO
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.code !== "Space") {
            return;
        }


        if (
            !skinsMenu.classList.contains(
                "hidden"
            )
        ) {

            return;

        }


        event.preventDefault();


        if (!gameRunning) {

            resetGame();

        } else {

            flap();

        }

    }
);


/* =========================
   MOUSE
========================= */

canvas.addEventListener(
    "mousedown",
    function() {

        if (!gameRunning) {

            resetGame();

        } else {

            flap();

        }

    }
);


/* =========================
   TOUCH
========================= */

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();


        if (!gameRunning) {

            resetGame();

        } else {

            flap();

        }

    },
    {
        passive: false
    }
);


/* =========================
   INICIALIZAÇÃO
========================= */

bestScore.textContent = best;

createSkinMenu();

menu.classList.remove("hidden");

skinsMenu.classList.add("hidden");

gameOverScreen.classList.add("hidden");


loop();
