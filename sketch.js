let round = 0;
let magnets = [];
let magnetNumber = { att: 0, rep: 0 };
let magnetColor, magnetColorHover;
let attractorOnClick = -1; // -1 is repulsion

let inGame = false; // Temporary, to be replaced with timer.
let preInGame = "start"; // State before entering game.

let platforms1 = [], platforms2 = [], platforms3 = [], platforms4 = [], platforms5 = [], platforms6 = [];

function preload() {
    imgCheckpoint = loadImage('/assets/checkpoint.png');
}

function setup() {
    createCanvas(800, 600);

    ball = new Ball(120, 50, 20);
    setupPlatformsAndCheckpoints();
    setupButtons();
}

function draw() {
    background(220, 235, 240);

    updateMagnetColors();

    if (!inGame) {
        handleMenus();
    } else {
        handleGame();
    }
}

function mouseClicked() {
    if (inGame) {
        if (buttonReload.containsMouse()) {
            reloadCurrentRound();
            cursor(ARROW);
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
    buttonReload.show();
    handleButtonHover(buttonReload);
    handleRoundText();

    displayMagnetNumber();
    handleForces();
    drawHoverEffect();
    handleBall();
    handleKeyPress();

    displayRounds();
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
    pop();
}

function handleMenuClicks() {
    if (buttonStart.containsMouse()) loadRound1();
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
        loadRound6();
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
}

function displayBallVelocity() {
    fill(10, 180, 70);
    textFont('Bahnschrift Semicondensed', 20);
    textStyle(ITALIC);
    text(`v: ${floor(ball.velocity.mag())} unit/s`, ball.position.x, ball.position.y - 40);
}

function handleForces() {
    for (let magnet of magnets) {
        magnet.show();
        magnet.changeColorHovered();
        if (magnet.attractionStatus === 1) {
            ball.applyForce(magnet.calculateAttraction(ball));
        } else {
            ball.applyForce(magnet.calculateRepulsion(ball));
        }
    }

    let gravity = createVector(0, 3);
    ball.applyForce(gravity);
}

function handleKeyPress() {
    if (keyIsDown(65)) attractorOnClick = 1; // 'A' key
    if (keyIsDown(82)) attractorOnClick = -1; // 'R' key
    if (keyIsDown(68)) {
        magnets = [];    
    }
}

function handleMagnetAddition() {
    let hoveredMagnet = getHoveredMagnet();

    if (hoveredMagnet) {
        removeMagnet(hoveredMagnet);
    } else {
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
    if (round === 1) displayRound1();
    if (round === 2) displayRound2();
    if (round === 3) displayRound3();
    if (round === 4) displayRound4();
    if (round === 5) displayRound5();
    if (round === 6) displayRound6();
}

function setupPlatformsAndCheckpoints() {
    platform_1_1 = new Platform(0, 300, 800, 300);
    platforms_1 = [platform_1_1];
    checkpoint_1 = new Checkpoint(740, 250);

    platform_2_1 = new Platform(0, 300, 800, 300);
    platforms_2 = [platform_2_1];
    checkpoint_2 = new Checkpoint(740, 250);

    platform_3_1 = new Platform(0, 300, 300, 30);
    platform_3_2 = new Platform(500, 400, 300, 30);
    platforms_3 = [platform_3_1, platform_3_2];
    checkpoint_3 = new Checkpoint(740, 350);

    platform_4_1 = new Platform(0, 200, 400, 30, "rubber");
    platform_4_2 = new Platform(200, 400, 500, 30, "ice");
    platforms_4 = [platform_4_1, platform_4_2];
    checkpoint_4 = new Checkpoint(260, 350);

    platform_5_1 = new Platform(0, 200, 100, 30);
    platform_5_2 = new Platform(300, 300, 120, 30, "ice");
    platform_5_3 = new Platform(600, 400, 200, 30)
    platforms_5 = [platform_5_1, platform_5_2, platform_5_3];
    checkpoint_5 = new Checkpoint(750, 350);

    platform_6_1 = new Platform(0, 450, 300, 150);
    platform_6_2 = new Platform(500, 450, 300, 150);
    platforms_6 = [platform_6_1, platform_6_2];
    checkpoint_6 = new Checkpoint(740, 400);
    wall_6 = new Wall(300, 350, 200, 250);
}

function setupButtons() {
    buttonStart = new Button(width * 0.5, height * 0.5, 80, 30, 96, 36, "START");
    buttonInstructions = new Button(width * 0.5, height * 0.65, 115, 30, 138, 36, "INSTRUCTIONS");
    buttonGoToLatestRound = new Button(width * 0.5, height * 0.8, 80, 30, 96, 36, "SKIP")
    buttonStartMenu = new Button(width - 120, height - 60, 80, 30, 88, 33, "BACK");
    buttonReload = new Button(width - 115, 55, 85, 25, 93.5, 27.5, "RESTART");
}