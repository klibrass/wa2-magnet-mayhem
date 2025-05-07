let round = 1;
let magnets = []; 
let magnetColor;
let magnetColorHover;
let attractorOnClick = -1;
let inGame = false; // Temporary, to be replaced with timer.

function preload() {
    imgCheckpoint = loadImage('/assets/checkpoint.png');
}

function setup() {
    createCanvas(800, 600);

    ball = new Ball(120, 50, 20);
    platform_1_1 = new Platform(0, 300, 800, 300);
    checkpoint_1 = new Checkpoint(740, 250, 50, 50);

    buttonStart = new Button(width/2, height/2, 180 * 0.7, 60 * 0.7, "START"); // Change the parameters
}

function mouseClicked() {
    if (inGame) {
        magnets.push(new Magnet(mouseX, mouseY, attractorOnClick, 20));
    }
}

function draw() {
    background(220, 240, 220);

    magnetColor = attractorOnClick == 1 ? [0, 0, 255] : [255, 0, 0];
    magnetColorHover = attractorOnClick == 1 ? [0, 0, 255, 128] : [255, 0, 0, 128];
  
    if (!inGame) {
        startMenu();
    } else if (inGame) {
        handleForces();
        drawHoverEffect();
        handleBall();
        handleKeyPress();
    }
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

  fill(10, 180, 70);
  textFont('Cambria Math', 20);
  textStyle(ITALIC);
  text("v: " + floor(ball.velocity.mag()) + " unit/s", ball.position.x, ball.position.y + 40);
}

function handleForces() {
  for(let magnet of magnets) {
    magnet.show();
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
  if (keyIsDown && keyCode == 65) {
    attractorOnClick = 1;
  }
  if (keyIsDown && keyCode == 82) {
    attractorOnClick = -1;
  }
}

function toNextRound() {
  round += 1;
}