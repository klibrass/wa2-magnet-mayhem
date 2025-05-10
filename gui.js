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
    handleButtonHover(buttonGoToLatestRound);
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

function loadRound(roundNum, magnetNumberAtt, magnetNumberRep, ballX, ballY) {
    round = roundNum;
    magnetNumber.att = magnetNumberAtt;
    magnetNumber.rep = magnetNumberRep;
    ball.position = createVector(ballX, ballY);
    ball.velocity = createVector(0, 0);
    magnets = [];
}

function displayRound(checkpoint, platforms, nextRound) {
    checkpoint.show();
    const nextRoundLoader = window[`loadRound${nextRound}`];
    if (checkpoint.contains(ball) && typeof nextRoundLoader === "function") nextRoundLoader();
    for(let platform of platforms) {
        platform.show();
        if (platform.isBallOnTop(ball)) {
            platform.applyForces(ball);
        }
    }
}

function loadRound1() {
    inGame = true;
    loadRound(1, 1, 0, 120, 50);
}

function displayRound1() {
    displayRound(checkpoint_1, platforms_1, 2);

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
    loadRound(2, 0, 1, 120, 50);
}

function displayRound2() {
    displayRound(checkpoint_2, platforms_2, 3);

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
    loadRound(3, 2, 0, 100, 50);
}

function displayRound3() {
    displayRound(checkpoint_3, platforms_3, 4);

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
    loadRound(4, 0, 1, 140, 100);
}

function displayRound4() {
    displayRound(checkpoint_4, platforms_4, 5);

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

function loadRound5() {
    loadRound(5, 1, 0, 50, 100);
}

function displayRound5() {
    displayRound(checkpoint_5, platforms_5, 6);

    platform_5_2.x = 300 + sin(millis() * 0.001) * 200;
}

function loadRound6() {
    loadRound(6, 5, 0, 120, 400);
}

function displayRound6() {
    displayRound(checkpoint_6, platforms_6, 6);
    wall_6.show();
    wall_6.touch(ball);
    
    push();
    textFont('Bahnschrift Condensed', 22);
    textStyle(NORMAL);
    textAlign(CENTER);
    fill(135, 135, 255)
    text("Pressing D deletes magnets from the scene.\nIt does not return you any magnet though, so plan wisely!", width * 0.5, height * 0.5 - 150);
    textSize(12)
    text("The ball can be lifted.", width * 0.5, height * 0.5 - 100);
    textSize(22)
    fill(0, 0, 0);
    text("Walls kill!", width * 0.5, height * 0.5 + 30);
    pop();
}