class Magnet {
    constructor(x, y, attractionStatus, radius, G = 1) {
        this.position = createVector(x, y);
        this.attractionStatus = attractionStatus;
        this.G = G;
        this.radius = radius;
        this.mass = radius/2;
    }

    show() {
        push();
        strokeWeight(3);
        fill(magnetColor);
        circle(this.position.x, this.position.y, this.radius*2);
        pop();
    }

    calculateAttraction(ball) {
        let force = p5.Vector.sub(this.position, ball.position);
        let distance = force.mag();
        distance = constrain(5, 30);
        force.normalize();

        let strength = (this.G * this.mass * ball.mass) / (this.distance * this.distance)
        force.mult(strength * this.attractionStatus);

        return force;
    }
}