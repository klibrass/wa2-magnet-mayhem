class Portal {
    constructor(x, y, nextRound) {
        this.x = x;
        this.y = y;
        this.nextRound = nextRound;
    }

    show() {
        push();
        fill(0, 255, 0);
        noStroke();
        ellipse(this.x, this.y, 40, 60);
        pop();
    }
}