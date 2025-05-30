let round = 0;
let magnets = [];
let magnetNumber = { att: 0, rep: 0 };
let magnetColor, magnetColorHover;
let attractorOnClick = -1; // -1 is repulsion

let inGame = false; // Temporary, to be replaced with timer.
let isRoundComplete = false;
let preInGame = "start"; // State before entering game.
let inGameStage = "PRELIMINARY";

let platforms = [];
let checkpoints = [];
let walls = [];
let waterZones = [];

function preload() {
    imgCheckpoint = loadImage('/assets/checkpoint.png');
    imgComplete = loadImage('/assets/complete screen.png');
}

function setup() {
    createCanvas(800, 600);

    ball = new Ball(120, 50, 20);
    gravity = createVector(0, 3);
    wind = createVector(0, 0);

    setupPlatformsAndCheckpoints();
    setupButtons();
}

function draw() {
    background(220, 235, 240);
    cursor(ARROW);
    updateMagnetColors();

    if (!inGame) {
        handleMenus();
    } else {
        handleGame();
    }
}

function mouseClicked() {
    if (inGame) {
        if (buttonReload.containsMouse() || (buttonReloadComplete.containsMouse() && isRoundComplete)) {
            reloadCurrentRound();
            cursor(ARROW);
        } else if (emojiButtonQuit.containsMouse()) {
            inGame = false;
            preInGame = "start";
        } else if (buttonNextRound.containsMouse() && isRoundComplete) {
            const nextRoundLoader = window[`loadRound${round + 1}`];
            if (typeof nextRoundLoader === "function") {
                nextRoundLoader();
            }
        } else {
            handleMagnetAddition();
        }
    } else {
        handleMenuClicks();
    }
}

function handleMenus() {
    if (preInGame === "start") startMenu();
    if (preInGame === "instructions") instructionsMenu();
}

function handleGame() {
    displayRounds();
    buttonReload.show();
    if (!isRoundComplete) handleButtonHover(buttonReload);

    handleRoundText();
    handleForces();
    displayMagnetNumber();
    displayMagnetStrengthCo();
    drawHoverEffect();
    handleBall();

    if (isRoundComplete) displayCompleteScreen();
    handleButtonHover(emojiButtonQuit);
    handleKeyPress();
}

function handleRoundText() {
    push();
    textAlign(CENTER);
    textFont('Bahnschrift Condensed', 32);
    textStyle(NORMAL);
    stroke(120);
    strokeWeight(3.5);
    fill(255);
    text(`Round ${round}`, width * 0.5, 55);

    textSize(16);
    strokeWeight(2);
    text(inGameStage, width * 0.5, 79);
    pop();
}

function handleMenuClicks() {
    if (buttonStart.containsMouse()) {
        inGameStage = "PRELIMINARY";
        loadRound1();
    }

    if (buttonInstructions.containsMouse()) {
        preInGame = "instructions";
        cursor(ARROW);
    }

    if (buttonStartMenu.containsMouse()) {
        preInGame = "start";
        cursor(ARROW);
    }

    if (buttonGoToLatestRound.containsMouse()) {
        inGame = true;
        loadRound9();
    }
}

function updateMagnetColors() {
    magnetColor = attractorOnClick === 1 ? [0, 0, 255] : [255, 0, 0];
    magnetColorHover = attractorOnClick === 1 ? [0, 0, 255, 128] : [255, 0, 0, 128];
}

function drawHoverEffect() {
    push();
    fill(magnetColorHover);
    noStroke();
    circle(mouseX, mouseY, 20);
    pop();
}

function handleBall() {
    ball.show();
    ball.update();
    ball.outOfFrame();
    displayBallVelocity();

    if (isRoundComplete) ball.velocity = createVector(0, 0);
}

function displayBallVelocity() {
    fill(10, 180, 70);
    textFont('Bahnschrift Semicondensed', 20);
    textStyle(ITALIC);
    text(`v: ${floor(ball.velocity.mag())} unit/s`, ball.position.x, ball.position.y - 40);
}

function handleForces() {
    magnets.forEach(magnet => {
        magnet.show();
        magnet.changeColorHovered();
        if (magnet.attractionStatus === 1) {
            ball.applyForce(magnet.calculateAttraction(ball));
        } else {
            ball.applyForce(magnet.calculateRepulsion(ball));
        }
    });

    ball.applyForce(gravity);
    ball.applyForce(wind);
}

function handleKeyPress() {
    if (keyIsDown(65)) attractorOnClick = 1; // 'A' key
    if (keyIsDown(82)) attractorOnClick = -1; // 'R' key
    if (keyIsDown(68)) magnets = []; // 'D' key
}

function handleMagnetAddition() {
    const hoveredMagnet = getHoveredMagnet();
    if (hoveredMagnet && !isRoundComplete) {
        removeMagnet(hoveredMagnet);
    } else if (!isRoundComplete) {
        addNewMagnet();
    }
}

function reloadCurrentRound() {
    const roundLoader = window[`loadRound${round}`];
    if (typeof roundLoader === "function") {
        roundLoader();
    } else {
        console.error(`No loader function found for round ${round}`);
    }
}

function displayRounds() {
    const roundDisplayFunction = window[`displayRound${round}`];
    if (typeof roundDisplayFunction === "function") {
        roundDisplayFunction();
    }
}

function setupPlatformsAndCheckpoints() {
    platforms = [
        [new Platform(0, 300, 800, 300)],
        [new Platform(0, 300, 800, 300)],
        [new Platform(0, 300, 300, 30), new Platform(500, 400, 300, 30)],
        [new Platform(0, 200, 400, 30, "rubber"), new Platform(200, 400, 500, 30, "ice")],
        [new Platform(0, 200, 100, 30), new Platform(300, 300, 180, 30, "ice"), new Platform(600, 400, 200, 30)],
        [new Platform(0, 450, 350, 150), new Platform(450, 450, 350, 150, "ice")],
        [new Platform(250, 250, 300, 30)],
        [new Platform(0, 450, width, 150)],
        [new Platform(50, 200, 150, 30), new Platform(550, 500, 150, 100)]
    ];

    checkpoints = [
        new Checkpoint(740, 250),
        new Checkpoint(740, 250),
        new Checkpoint(740, 350),
        new Checkpoint(260, 350),
        new Checkpoint(750, 350),
        new Checkpoint(740, 400),
        new Checkpoint(width * 0.5, 550),
        new Checkpoint(680, 400),
        new Checkpoint(600, 450)
    ];

    walls = [
        null,
        null,
        null,
        null,
        null,
        new Wall(350, 400, 100, 200),
        null,
        [new Wall(0, 0, 50, height), new Wall(750, 0, 50, height)],
        new Wall(width * 0.5 - 30, 370, 60, 230)
    ];

    waterZones = [
        null,
        null,
        null,
        null,
        null,
        null,
        new WaterZone(0, 280, width, height - 280),
        null,
        null
    ];
}

function setupButtons() {
    buttonStart = new Button(width * 0.5, height * 0.5, 80, 30, 96, 36, "START");
    buttonInstructions = new Button(width * 0.5, height * 0.65, 115, 30, 138, 36, "INSTRUCTIONS");
    buttonGoToLatestRound = new Button(width * 0.5, height * 0.8, 80, 30, 96, 36, "SKIP")
    buttonStartMenu = new Button(width - 120, height - 60, 80, 30, 88, 33, "BACK");
    buttonReload = new Button(width - 115, 55, 85, 25, 93.5, 27.5, "RESTART");
    buttonNextRound = new Button(width * 0.5, height * 0.5, 80, 30, 96, 36, "NEXT");
    buttonReloadComplete = new Button(width * 0.5, height * 0.5 + 80, 80, 30, 96, 36, "RESTART");

    emojiButtonQuit = new EmojiButton(5, 5, 15, 20, "❌", "QUIT", [255, 99, 120]);
}