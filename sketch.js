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

let isWindUnlocked = false;
let isAntiGravityUnlocked = false;
let isMovingPlatformUnlocked = false;
let isColorPickerUnlocked = false;

function preload() {
    imgCheckpoint = loadImage('/assets/checkpoint.png');
    imgComplete = loadImage('/assets/complete screen.png');
    imgOrbColorPicker = loadImage('/assets/rainbow orb.png');
    imgOrbWind = loadImage('/assets/wind orb.png');
    imgOrbAntiGravity = loadImage('/assets/antigravity orb.png');
    imgOrbMovingPlatform = loadImage('/assets/moving platform orb.png');
}

function setup() {
    createCanvas(800, 600);

    ball = new Ball(120, 50, 20);
    gravity = createVector(0, 3);
    wind = createVector(0, 0);

    setupPlatformsAndCheckpoints();
    setupButtons();
    setupCollectibles();
}

function draw() {
    background(220, 235, 240);
    cursor(ARROW);
    updateMagnetColors();

    if (!inGame) {
        if (round != 255) {
            handleMenus();
        } else {
            handleSandbox();
        }
    } else {
        handleGame();
    }
}

function mouseClicked() {
    if (inGame) {
        const shouldReload = buttonReload.containsMouse() || (buttonReloadComplete.containsMouse() && isRoundComplete);
        
        if (shouldReload) {
            reloadCurrentRound();
            cursor(ARROW);
            return;
        }

        handleQuitButton();

        const nextRoundClicked = buttonNextRound.containsMouse() && isRoundComplete;

        if (nextRoundClicked) {
            if (round !== 12) {
                const nextRoundLoader = window[`loadRound${round + 1}`];
                if (typeof nextRoundLoader === "function") {
                    nextRoundLoader();
                }
            } else {
                inGame = false;
                preInGame = "SANDBOX";
                displaySandbox();
            }
            cursor(ARROW);
            return;
        }

        handleMagnetAddition();
    } else {
        if (preInGame !== "SANDBOX") {
            handleMenuClicks();
        } else {
            handleSandboxClicks();
            handleQuitButton();
        }
    }
}

function handleMenus() {
    if (preInGame === "start") startMenu();
    if (preInGame === "instructions") instructionsMenu();
    if (preInGame === "SANDBOX") displaySandbox();
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
        preInGame = "SANDBOX";
        cursor(ARROW);
    }
}

function handleQuitButton() {
    if (emojiButtonQuit.containsMouse()) {
        inGame = false;
        round = 0;
        magnets = [];
        preInGame = "start";
        return;
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
    if (!isRoundComplete) {
        ball.show();
        ball.update();
        ball.outOfFrame();
        displayBallVelocity();
    } else {
        ball.acceleration.mult(0);
        ball.velocity.mult(0);
    }
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
        [new Platform(50, 200, 150, 30), new Platform(500, 500, 300, 100)],
        [new Platform(350, 200, 100, 30), new Platform(350, 500, 100, 30)],
        [new Platform(500, 0, 300, 100)],
        [new Platform(50, 200, 100, 30), new Platform(650, 160, 100, 30), new Platform(50, 550, 2110, 30), new Platform(530, 160, 120, 30), new Platform (655, 550, 165, 50)]
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
        new Checkpoint(500, 450),
        new Checkpoint(380, 450),
        new Checkpoint(700, 110),
        new Checkpoint(700, 110)
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
        new Wall(width * 0.5 - 30, 370, 60, 230),
        null,
        new Wall(300, 300, 200, 300),
        new Wall(325, 0, 150, 350) 
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
        null,
        null,
        new WaterZone(0, 0, width, height),
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

    emojiButtonNewBall = new EmojiButton(5, 30, 25, 30, "⚪", "ADD BALL", [255, 255, 255]);
    emojiButtonNewPlatform = new EmojiButton(5, 35, 25, 30, "📶", "ADD PLATFORM", [0, 210, 255]);
    emojiButtonNewMagnet = new EmojiButton(5, 55, 25, 30, "🧲", "ADD MAGNET", [255, 99, 120]);
    emojiButtonWind = new EmojiButton(5, 105, 25, 30, "🌬️", "WIND", [0, 210, 255]);
    emojiButtonAntiGravity = new EmojiButton(5, 130, 25, 30, "🪐", "ANTIGRAVITY", [228, 218, 0]);
    emojiButtonMovingPlatform = new EmojiButton(5, 155, 25, 30, "🛠️", "MOVING PLATFORM", [200, 200, 200]);
    emojiButtonColorPicker = new EmojiButton(5, 180, 25, 30, "🌈", "COLOUR PICKER", [255, 255, 255]);

    emojiButtonPause = new EmojiButton(770, 30, 25, 30, "⏸️", "PAUSE", [0, 210, 255]);
    emojiButtonDelete = new EmojiButton(770, 35, 25, 30, "🚫", "DELETE", [255, 99, 120]);
    emojiButtonReset = new EmojiButton(770, 60, 25, 30, "🔄", "RESET", [120, 120, 255]);

    sandboxEmojiButtons = [
        emojiButtonNewBall,
        emojiButtonNewPlatform,
        emojiButtonNewMagnet,
        emojiButtonWind,
        emojiButtonAntiGravity,
        emojiButtonMovingPlatform,
        emojiButtonColorPicker
    ];

    emojiButtonNewBall.key = "emojiButtonNewBall";
    emojiButtonNewPlatform.key = "emojiButtonNewPlatform";
    emojiButtonNewMagnet.key = "emojiButtonNewMagnet";
    emojiButtonWind.key = "emojiButtonWind";
    emojiButtonAntiGravity.key = "emojiButtonAntiGravity";
    emojiButtonMovingPlatform.key = "emojiButtonMovingPlatform";
    emojiButtonColorPicker.key = "emojiButtonColorPicker";
    emojiButtonReset.key = "emojiButtonReset";

    sandboxSimulationEmojiButtons = [
        emojiButtonPause,
        emojiButtonDelete,
        emojiButtonReset
    ];
}

function setupCollectibles() {
    orbColorPicker = new Orb(700, 470, 20, imgOrbColorPicker);
    orbWind = new Orb(width * 0.5, 350, 20, imgOrbWind);
    orbAntiGravity = new Orb(600, 350, 20, imgOrbAntiGravity);
    orbMovingPlatform = new Orb(250, 320, 20, imgOrbMovingPlatform);
}