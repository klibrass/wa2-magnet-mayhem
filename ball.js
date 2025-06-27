class Ball {
    constructor(x, y, size) {
        this.position = createVector(x, y);
        this.size = size;
        this.mass = size / 2;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.isSnapped = false;
    }

    show() {
        push();
        fill(10, 180, 70);
        noStroke();
        circle(this.position.x, this.position.y, this.size*2);
        pop();
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        let f = force.copy().div(this.mass);
        this.acceleration.add(f);
    }

    outOfFrame() {
        if (this.position.y > height || this.position.y < 0 - this.size) {
            reloadCurrentRound();
        }
    }
}

class SandboxBall {
    constructor(x, y, size, colorArr = [10, 180, 70]) {
        this.position = createVector(x, y);
        this.size = size;
        this.mass = size / 2;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.isSnapped = false;
        this.colorArr = colorArr.slice(); // copy array
    }

    show() {
        push();
        fill(...this.colorArr);
        noStroke();
        circle(this.position.x, this.position.y, this.size * 2);
        pop();
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);

        if (this.position.y > height || this.position.y < 0 - this.size) {
            const idx = sandboxBalls.indexOf(this);
            if (idx !== -1) {
                sandboxBalls.splice(idx, 1);
            }
        }
    }

    applyForce(force) {
        let f = force.copy().div(this.mass);
        this.acceleration.add(f);
    }
}