let round = 1;
let magnets = []; 
let magnetColor;
let magnetColorHover;
let attractorOnClick = -1;

function preload() {
  imgCheckpoint = loadImage('/assets/checkpoint.png');
}

function setup() {
  createCanvas(800, 600);

  ball = new Ball(120, 50, 20);
  platform_1_1 = new Platform(0, 300, 800, 300);
  checkpoint_1 = new Checkpoint(740, 250, 50, 50);
}

function draw() {
  background(220, 240, 220);

  gravity = createVector(0, 3);
  ball.applyForce(gravity);

  magnetColor = attractorOnClick == 1 ? [0, 0, 255] : [255, 0, 0];
  magnetColorHover = color(magnetColor).setAlpha(128);

  // let drag = player.velocity.copy();
  // let dragMag = player.velocity.mag() * player.velocity.mag() * 0.99;
  // drag.normalize();
  // drag.mult(-dragMag);
  // player.applyForce(drag);

  ball.show();
  ball.update();
  ball.outOfFrame();

  checkpoint_1.show();
  checkpoint_1.contains(ball);
  platform_1_1.show();
  if (platform_1_1.isBallOnTop(ball)) {
    platform_1_1.applyForces(ball);
  }

  fill(10, 180, 70);
  textSize(20);
  text("Velocity: " + ball.velocity.mag(), 200, 50);

  if (keyIsPressed && keyCode == 68) {
    ball.applyForce(createVector(2.4, 0));
  }
  if (keyIsPressed && keyCode == 87) {
    ball.isSnapped = false;
    ball.applyForce(createVector(0, 4.4))
  }

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