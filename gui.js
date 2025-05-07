function startMenu() {
    textFont('Bahnschrift', 80);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(120);
    text('MAGNET MAYHEM', width/2 - 3, 153)
    fill(255);
    text('MAGNET MAYHEM', width/2, 150);

    buttonStart.show();
    if(buttonStart.containsMouse()) {
        buttonStart.shift(true);
    } else {
        buttonStart.shift(false);
    }
}

function loadRound1() {
  checkpoint_1.show();
  checkpoint_1.contains(ball);
  platform_1_1.show();
  if (platform_1_1.isBallOnTop(ball)) {
    platform_1_1.applyForces(ball);
  }
}