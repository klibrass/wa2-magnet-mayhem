class Ball {
    constructor(x, y, size) {
        this.position = createVector(x, y);
        this.size = size;
        this.mass = size/2;
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
        if (this.position.y > height) {
            this.position = createVector(120, 50);
            this.velocity = createVector(0, 0);
        }
    }
}