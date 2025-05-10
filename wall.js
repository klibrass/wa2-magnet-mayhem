class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show() {
        push();
        fill(0, 0, 0);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        pop();
    }

    touch(ball) {
        if (
            this.x < ball.position.x + ball.size &&
            this.x + this.w > ball.position.x - ball.size &&
            ball.position.y + ball.size >= this.y &&
            ball.position.y + ball.size <= this.y + this.h
        ) {
            reloadCurrentRound();
        }
    }
}