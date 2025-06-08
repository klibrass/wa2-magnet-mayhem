function startMenu() {
    textFont('Bahnschrift', 80);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(120);
    text('MAGNET & MAYHEM', width * 0.5 - 3, 153)
    fill(255);
    text('MAGNET & MAYHEM', width * 0.5, 150);
    textFont('Bahnschrift', 20);
    fill(120);
    text('or M&M', width * 0.5 - 2, 202)
    fill(255);
    text('or M&M', width * 0.5, 200);

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

    if (magnetStrengthCo != 1) {
        if (magnetStrengthCo < 1) {
            fill(97, 7, 25);
            text(`WEAKENED: x${magnetStrengthCo}`, 65, 103 + 20 * 0.25);
        } else if (magnetStrengthCo > 1) {
            fill(107, 52, 102);
            text(`STRENGTHENED: x${magnetStrengthCo}`, 65, 103 + 20 * 0.25);
        }

        circle(50, 103, 20);
    }
    if (wind.mag() != 0) {
        fill(8, 79, 106);

        let windDirection;
        windDirection =
            wind.x < 0 ? "LEFT" :
            wind.x > 0 ? "RIGHT" :
            wind.y < 0 ? "UP" :
            "DOWN"
        text(`WIND SPEED: ${wind.mag()} unit/s, ${windDirection}`, 65, 133 + 20 * 0.25);

        circle(50, 133, 20);
    }


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
    // nextRound stationed here because I'm too lazy to remove unnecessary functions
    checkpoint.show();
    isRoundComplete = checkpoint.contains(ball);
    if (isRoundComplete) {
        ball.position = createVector(checkpoint.x, checkpoint.y);
    }

    platforms.forEach(platform => {
        platform.show();
        if (platform.isBallOnTop(ball)) {
            platform.applyForces(ball);
        }
    });
}

function displayCompleteScreen() {
    push();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    image(imgComplete, width * 0.5 - 250, height * 0.5 - 250, 500, 500);
    textFont('Bahnschrift Condensed', 30);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(255);
    text(`ROUND ${round}`, width * 0.5, height * 0.5 - 70);
    
    buttonNextRound.show();
    buttonReloadComplete.show();
    handleButtonHover(buttonNextRound);
    handleButtonHover(buttonReloadComplete);
    pop();
}

function loadRound1() {
    inGame = true;
    magnetStrengthCo = 1;
    wind = createVector(0, 0);
    loadRound(1, 1, 0, 120, 50);
}

function displayRound1() {
    displayRound(checkpoints[0], platforms[0], 2);

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
    displayRound(checkpoints[1], platforms[1], 3);

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
    displayRound(checkpoints[2], platforms[2], 4);

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
    displayRound(checkpoints[3], platforms[3], 5);

    push();
    textFont('Bahnschrift Condensed', 22);
    textStyle(NORMAL);
    textAlign(LEFT);
    fill(48, 48, 48)
    text("Rubber has high damping and friction.", platforms[3][0].x + 10, platforms[3][0].y + 56);
    textAlign(CENTER)
    fill(150, 170, 200)
    text("Ice has zero friction and lower damping.", platforms[3][1].x + platforms[3][1].w * 0.5, platforms[3][1].y + 56);
    pop();
}

function loadRound5() {
    loadRound(5, 1, 0, 50, 100);
}

function displayRound5() {
    displayRound(checkpoints[4], platforms[4], 6);

    platforms[4][1].x = 300 + sin(millis() * 0.001) * 200;
}

function loadRound6() {
    loadRound(6, 4, 0, 120, 400);
    magnetStrengthCo = 2;
}

function displayRound6() {
    displayRound(checkpoints[5], platforms[5], 7);
    walls[5].show();
    walls[5].touch(ball);
    
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

function loadRound7() {
    loadRound(7, 0, 2, width * 0.5, 80);
    magnetStrengthCo = 1;
}

function displayRound7() {
    displayRound(checkpoints[6], platforms[6], 8);
    waterZones[6].show();
    if (waterZones[6].contains(ball)) {
        waterZones[6].applyForce(ball);
    }   

    push();
    textFont('Bahnschrift Condensed', 22);
    textStyle(NORMAL);
    textAlign(CENTER);
    fill(135, 135, 255);
    text("Water zones apply drag to the ball\nor in other words the ball slows down in water!", width * 0.5, height * 0.5 - 150);
    textSize(12);
    text("I don't know if I told you this, but the closer the magnet, the stronger it is.", width * 0.5, height * 0.5 - 100);
    pop();
}

function loadRound8() {
    loadRound(8, 1, 0, 120, 30);
}

function displayRound8() {
    displayRound(checkpoints[7], platforms[7], 9);

    walls[7][0].show();
    walls[7][0].touch(ball);
    walls[7][1].show();
    walls[7][1].touch(ball);

    push();
    textFont('Bahnschrift Condensed', 18);
    textStyle(NORMAL);
    textAlign(CENTER);
    fill(135, 135, 255);
    text("Now your prelims end here. With that being said,\nI should reveal to you what's the point of this.", width * 0.5, height * 0.5 - 200);
    text("If you just want to proceed straight to this game's boring sandbox,\nthen you can press the ❌ button on the corner to go back to the main menu.", width * 0.5, height * 0.5 - 130);
    text("True fun lies in exploration.\nFor the next 10 rounds, you'll be presented with harder and harder challenges.\nAnd it will be rewarding, as you'll unlock hidden mechanisms in the final sandbox\nonly found through each of these rounds.", width * 0.5, height * 0.5 - 30);
    fill(0);
    text("If you wish to proceed, go to the flag. Good luck and have fun!", width * 0.5, height - 90);
    pop();
}

function loadRound9() {
    loadRound(9, 0, 2, 120, 30);
    magnetStrengthCo = 1.5;
    inGameStage = "CHALLENGE";
    orbColorPicker.isCollected = false;
}

function displayRound9() {
    displayRound(checkpoints[8], platforms[8], 9);

    walls[8].show();
    walls[8].touch(ball);

    image(imgOrbColorPicker, 50, 300, 50, 50);

    push();
    textFont('Bahnschrift Condensed');
    textStyle(BOLD);
    textAlign(LEFT);
    if (!orbColorPicker.isCollected) {
        fill(135, 135, 255);
    } else {
        fill('green');
    }
    textSize(20);
    text("Perks of Round 9", 50, 290);
    textSize(22);
    text("Colour Picker", 50, 380);
    textStyle(NORMAL);
    textSize(20);
    text("You will be able to customise the\ncolour of the balls in the sandbox.", 50, 410);
    textSize(16);
    text("If you've already acquired the perk, you'll\nlose it upon retrying this round.", 50, 500);
    pop();

    orbColorPicker.show();
    orbColorPicker.touch(ball);
}

function loadRound10() {
    loadRound(10, 3, 0, width * 0.5, 90);
    wind = createVector(1, 0);
    orbWind.isCollected = false;
}

function displayRound10() {
    displayRound(checkpoints[9], platforms[9]);

    orbWind.show();
    orbWind.touch(ball);

    image(imgOrbWind, 50, 300, 50, 50);

    push();
    textFont('Bahnschrift Condensed');
    textStyle(BOLD);
    textAlign(LEFT);
    if (!orbWind.isCollected) {
        fill(135, 135, 255);
    } else {
        fill('green');
    }
    textSize(20);
    text("Perks of Round 10", 50, 290);
    textSize(22);
    text("Wind", 50, 380);
    textStyle(NORMAL);
    textSize(20);
    text("You will be able to customise the\ndirection of wind in the sandbox.", 50, 410);
    textSize(16);
    text("If you've already acquired the perk, you'll\nlose it upon retrying this round.", 50, 500);
    pop();
}

function loadRound11() {
    loadRound(11, 0, 15, 100, 100);
    wind = createVector(0, 0);
    orbAntiGravity.isCollected = false;
    magnetStrengthCo = 1.5;
}

function displayRound11() {
    displayRound(checkpoints[10], platforms[10]);

    walls[10].show();
    walls[10].touch(ball);

    waterZones[10].show();
    if (waterZones[10].contains(ball)) waterZones[10].applyForce(ball);

    orbAntiGravity.show();
    orbAntiGravity.touch(ball);

    image(imgOrbAntiGravity, 50, 360, 50, 50);

    push();
    textFont('Bahnschrift Condensed');
    textStyle(BOLD);
    textAlign(LEFT);
    if (!orbAntiGravity.isCollected) {
        fill(120, 32, 110);
    } else {
        fill('green');
    }
    textSize(20);
    text("Perks of Round 11", 50, 350);
    textSize(22);
    text("Antigravity", 50, 440);
    textStyle(NORMAL);
    textSize(20);
    text("You will be able to customise\nthe gravity so that entities\nfall upwards in the sandbox.", 50, 470);
    textSize(16);
    text("If you've already acquired the perk,\nyou'll lose it upon retrying this round.", 50, 560);
    pop();
}