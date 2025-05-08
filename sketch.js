let round = 0;
let magnets = [];
let magnetNumber = {
    att: 0,
    rep: 0
};
let magnetColor;
let magnetColorHover;
let attractorOnClick = -1; // -1 is repulsion
let inGame = false; // Temporary, to be replaced with timer.
let preInGame = "start";

let platforms3 = [];

function preload() {
    imgCheckpoint = loadImage('/assets/checkpoint.png');
}

function setup() {
    createCanvas(800, 600);

    ball = new Ball(120, 50, 20);
    platform_1_1 = new Platform(0, 300, 800, 300);
    checkpoint_1 = new Checkpoint(740, 250);
    platform_2_1 = new Platform(0, 300, 800, 300);
    checkpoint_2 = new Checkpoint(740, 250);
    platform_3_1 = new Platform(0, 300, 300, 30);
    platform_3_2 = new Platform(500, 400, 300, 30);
    platforms3 = [platform_3_1, platform_3_2];
    checkpoint_3 = new Checkpoint(740, 350);

    buttonStart = new Button(width * 0.5, height * 0.5, 160 * 0.5, 60 * 0.5, 160 * 0.6, 60 * 0.6, "START"); // Change the parameters
    buttonInstructions = new Button(width * 0.5, height * 0.65, 230 * 0.5, 60 * 0.5, 230 * 0.6, 60 * 0.6, "INSTRUCTIONS");
    buttonStartMenu = new Button(width - 120, height - 60, 160 * 0.5, 60 * 0.5, 160 * 0.55, 60 * 0.55, "BACK");
}

function draw() {
    background(220, 235, 240);

    magnetColor = attractorOnClick == 1 ? [0, 0, 255] : [255, 0, 0];
    magnetColorMouse = attractorOnClick == 1 ? [0, 0, 255, 128] : [255, 0, 0, 128];
  
    if (!inGame) {
        if (preInGame == "start") startMenu();
        if (preInGame == "instructions") instructionsMenu();
    } else if (inGame) {
        displayMagnetNumber();
        handleForces();
        drawHoverEffect();
        handleBall();
        handleKeyPress();

        if (round == 1) displayRound1();
        if (round == 2) displayRound2();
        if (round == 3) displayRound3();
    }
}

function mouseClicked() {
    if (inGame) {
        handleMagnetAddition();
    } else {
        if (buttonStart.containsMouse()) {
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
    }
}

function drawHoverEffect() {
  push();
  fill(magnetColorMouse);
  noStroke();
  circle(mouseX, mouseY, 20);
  pop();
}

function handleBall() {
  ball.show();
  ball.update();
  ball.outOfFrame();

  fill(10, 180, 70);
  textFont('Cambria Math', 20);
  textStyle(ITALIC);
  text("v: " + floor(ball.velocity.mag()) + " unit/s", ball.position.x, ball.position.y - 40);
}

function handleForces() {
    for(let magnet of magnets) {
        magnet.show();
        magnet.changeColorHovered();
        if(magnet.attractionStatus === 1) {
            ball.applyForce(magnet.calculateAttraction(ball));
        } else {
            ball.applyForce(magnet.calculateRepulsion(ball));
        }
    }

  gravity = createVector(0, 3);
  ball.applyForce(gravity);
}

function handleKeyPress() {
    if (keyIsDown(65)) { // 'A' key
        attractorOnClick = 1;
    }
    if (keyIsDown(82)) { // 'R' key
        attractorOnClick = -1;
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