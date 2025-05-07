class Platform {
    constructor(x, y, w, h, material) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fricCo =
            material == "ice" ? 0 :
            material == "rubber" ? 2 :
            0.65;
        this.dampCo =
            material == "ice" ? 0.31 :
            material == "rubber" ? 0.22 :
            0.25;
    }

    show() {
        push();
        fill(255);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        pop();
    }

    isBallOnTop(ball) {
        this.contactY = ball.position.y;
        return(
            this.x < ball.position.x &&
            this.x + this.w > ball.position.x + ball.size*2 &&
            ball.position.y + ball.size >= this.y &&
            ball.position.y + ball.size <= this.y + this.h
        );
    }

    applyForces(ball) {
        let friction = ball.velocity.copy();
        friction.normalize();
        friction.mult(-this.fricCo);
        ball.applyForce(friction);

        let dampThreshold = 2.4 - this.dampCo;
        if (abs(ball.velocity.y) > dampThreshold) {
            ball.velocity.mult(1, -0.95 + this.dampCo)
        } else {
            ball.velocity.y = 0;
        }
        ball.position.y = this.y - ball.size;
    }
}