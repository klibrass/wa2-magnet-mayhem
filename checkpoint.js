class Checkpoint {
    static checkpointWidth = 48;
    static checkpointHeight = 60;
    static offset = 5;

    constructor(x, y, nextBallPositionX, nextBallPositionY) {
        this.x = x;
        this.y = y;
        this.nextBallPosition = createVector(nextBallPositionX, nextBallPositionY);
    }

    show() {
        image(imgCheckpoint, this.x, this.y, Checkpoint.checkpointWidth, Checkpoint.checkpointHeight)
    }

    contains(ball) {
        if (
            this.x < ball.position.x + ball.size - Checkpoint.offset &&
            this.x + Checkpoint.checkpointWidth + Checkpoint.offset > ball.position.x + ball.size &&
            this.y < ball.position.y + ball.size &&
            this.y + Checkpoint.checkpointHeight + Checkpoint.offset > ball.position.y
        ) {
            ball.position = this.nextBallPosition;
        }
    }
}