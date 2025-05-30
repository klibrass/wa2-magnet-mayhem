class WaterZone {
    constructor(x, y, w, h, dragCo = 0.5) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dragCo = dragCo;
    }

    show() {
        push();
        fill(107, 144, 255, 125);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        pop();
    }

    contains(ball) {
        return (
            this.x < ball.position.x - ball.size &&
            this.x + this.w > ball.position.x + ball.size &&
            this.y <= ball.position.y - ball.size &&
            this.y + this.h >= ball.position.y + ball.size
        )
    }

    applyForce(ball) {
        let drag = ball.velocity.copy();
        let dragMag = ball.velocity.copy().mag();
        drag.normalize();
        drag.mult(-1 * dragMag * dragMag * this.dragCo);

        ball.applyForce(drag);
    }
}