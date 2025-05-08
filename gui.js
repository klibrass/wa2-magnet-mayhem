function startMenu() {
    textFont('Bahnschrift', 80);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(120);
    text('MAGNET MAYHEM', width * 0.5 - 3, 153)
    fill(255);
    text('MAGNET MAYHEM', width * 0.5, 150);

    handleButtonHover(buttonStart);
    handleButtonHover(buttonInstructions);
}

function instructionsMenu() {
    push();
    textFont('Bahnschrift', 80);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(120);
    text('INSTRUCTIONS', width * 0.5 - 3, 103)
    fill(255);
    text('INSTRUCTIONS', width * 0.5, 100);

    textFont('Bahnschrift Condensed', 25);
    textAlign(LEFT)
    textStyle(NORMAL);
    fill(0);
    text("The game is simple. You have a ball       , and your mission is to bring it to\nthe checkpoint flag      . You cannot manually move the ball, but you can place\nmagnets             to help guide the ball to place.\n\nAs you advance, the levels will get harder, with weirder quirks and it shall\nchallenge your creativity to help get the ball to where it should be in the\nmost efficient way possible.\n\nThe mechanics of the game will be revealed to you as you go along.\n\nGood luck and have fun!", 30, 170);
    
    noStroke();
    fill(10, 180, 70);
    circle(395, 163, 30);
    image(imgCheckpoint, 222, 175, 24, 30)
    fill(0, 0, 255);
    circle(135, 223, 25);
    fill(255, 0, 0);
    circle(167, 223, 25);
    pop();

    handleButtonHover(buttonStartMenu);
}

function displayMagnetNumber() {
    push();
    noStroke();

    fill(120);
    rect(30 - 3, 30 + 3, 170, 50);
    fill(255);
    rect(30, 30, 170, 50);

    textFont('Bahnschrift Condensed', 20);
    textStyle(NORMAL);
    textAlign(LEFT);

    fill(0, 0, 255);
    circle(50, 43, 20);
    text(`ATTRACTION: ${magnetNumber.att}`, 65, 45 + 20 * 0.25);

    fill(255, 0, 0);
    circle(50, 67, 20);
    text(`REPULSION: ${magnetNumber.rep}`, 65, 67 + 20 * 0.35);
    pop();
}

function displayMagnetStrengthCo() {
    push();
    noStroke();
    textFont('Bahnschrift Condensed', 20);
    textStyle(NORMAL);
    textAlign(LEFT);

    if (magnetStrengthCo < 1) {
        fill(97, 7, 25);
        text(`SLOWED: x${magnetStrengthCo}`, 65, 63 + 20 * 0.25);
    } else if (magnetStrengthCo > 1) {
        fill(107, 52, 102);
        text(`SPED: x${magnetStrengthCo}`, 65, 63 + 20 * 0.25);
    }

    circle(50, 63, 20);
    pop();
}

function loadRound1() {
    inGame = true;
    round = 1;
    magnetNumber.att = 1;
    magnetNumber.rep = 0;
    ball.position = createVector(120, 50);
    ball.velocity = createVector(0, 0);
    magnets = [];
}

function displayRound1() {
    checkpoint_1.show();
    if (checkpoint_1.contains(ball)) loadRound2();
    platform_1_1.show();
    if (platform_1_1.isBallOnTop(ball)) {
        platform_1_1.applyForces(ball);
    }

    push();
    textFont('Bahnschrift Condensed', 22);
    textStyle(NORMAL);
    textAlign(CENTER);
    fill(0, 0, 255)
    text("Blue magnets attract.\nPress A to change magnet mode to attracting, and click to place your magnet.\nReach the checkpoint flag.", width * 0.5, height * 0.5 + 30);
    textSize(12);
    fill(135, 135, 255);
    text("If you've messed up, you can click on the magnet to take it back, or press restart.", width * 0.5, height - 20);
    pop();
}

function loadRound2() {
    round = 2;
    magnetNumber.att = 0;
    magnetNumber.rep = 1;
    ball.position = createVector(120, 50);
    ball.velocity = createVector(0, 0);
    magnets = [];
}

function displayRound2() {
    checkpoint_2.show();
    if (checkpoint_2.contains(ball)) loadRound3();
    platform_2_1.show();
    if (platform_2_1.isBallOnTop(ball)) {
        platform_2_1.applyForces(ball);
    }

    push();
    textFont('Bahnschrift Condensed', 22);
    textStyle(NORMAL);
    textAlign(CENTER);
    fill(255, 0, 0)
    text("Red magnets repel.\nPress R to change magnet mode to repelling, and click to place your magnet.\nReach the checkpoint flag.", width * 0.5, height * 0.5 + 30);
    textSize(12);
    fill(135, 135, 255);
    text("If you've messed up, you can click on the magnet to take it back, or press restart.", width * 0.5, height - 20);
    pop();
}

function loadRound3() {
    round = 3;
    magnetNumber.att = 2;
    magnetNumber.rep = 0;
    ball.position = createVector(100, 50);
    ball.velocity = createVector(0, 0);
    magnets = [];
}

function displayRound3() {
    checkpoint_3.show();
    if (checkpoint_3.contains(ball)) loadRound4();
    for (let platform of platforms3) {
        platform.show();
        if (platform.isBallOnTop(ball)) {
            platform.applyForces(ball);
        }
    }

    push();
    textFont('Bahnschrift Condensed', 22);
    textStyle(NORMAL);
    textAlign(CENTER);
    fill(0, 0, 255)
    text("You can stack attractors or repellers.", width * 0.5, height * 0.5 - 150);
    textSize(12);
    fill(135, 135, 255);
    text("If you've messed up, you can click on the magnet to take it back, or press restart.", width * 0.5, height - 20);
    pop();
}

function loadRound4() {
    round = 4;
    magnetNumber.att = 0;
    magnetNumber.rep = 1;
    ball.position = createVector(140, 100);
    ball.velocity = createVector(0, 0);
    magnets = [];
}

function displayRound4() {
    checkpoint_4.show();
    if (checkpoint_4.contains(ball)) loadRound4();
    for (let platform of platforms4) {
        platform.show();
        if (platform.isBallOnTop(ball)) {
            platform.applyForces(ball);
        }
    }

    push();
    textFont('Bahnschrift Condensed', 22);
    textStyle(NORMAL);
    textAlign(LEFT);
    fill(platform_4_1.materialColor)
    text("Rubber has high damping and friction.", platform_4_1.x + 10, platform_4_1.y + 56);
    textAlign(CENTER)
    fill(platform_4_2.materialColor)
    text("Ice has zero friction and lower damping.", platform_4_2.x + platform_4_2.w * 0.5, platform_4_2.y + 56);
    pop();
}