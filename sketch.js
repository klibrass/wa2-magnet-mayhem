function setup() {
  createCanvas(800, 480);

  ball = new Ball(50, 50, 20);
  platform_1_1 = new Platform(0, 200, 800, 280);
  portal_1 = new Portal(740, 160, 2);
}

function draw() {
  background(220, 240, 220);

  gravity = createVector(0, 3);
  ball.applyForce(gravity);

  // let drag = player.velocity.copy();
  // let dragMag = player.velocity.mag() * player.velocity.mag() * 0.99;
  // drag.normalize();
  // drag.mult(-dragMag);
  // player.applyForce(drag);

  ball.show();
  ball.update();
  ball.outOfFrame();

  portal_1.show();

  fill(10, 180, 70);
  textSize(20);
  text("Velocity: " + round(ball.velocity.mag(), 2), 200, 50);

  platform_1_1.show();
  if (platform_1_1.isBallOnTop(ball)) {
    platform_1_1.applyForces(ball);
  }

  if (keyIsPressed && keyCode == 68) {
    ball.applyForce(createVector(2, 1));
  }
}
