function startMenu() {
    
}

function loadRound1() {
  checkpoint_1.show();
  checkpoint_1.contains(ball);
  platform_1_1.show();
  if (platform_1_1.isBallOnTop(ball)) {
    platform_1_1.applyForces(ball);
  }
}