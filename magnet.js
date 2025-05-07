class Magnet {
    constructor(x, y, attractionStatus, radius, G = 1) {
        this.position = createVector(x, y);
        this.G = G;
        this.attractionStatus = attractionStatus;
        this.color = magnetColor;
        this.radius = radius;
        this.mass = radius / 2;
    }

    show() {
        push();
        strokeWeight(2);
        fill(this.color);
        circle(this.position.x, this.position.y, this.radius);
        pop();
    }

    calculateAttraction(ball) {
        return this.calculateForce(ball, true);
    }

    calculateRepulsion(ball) {
        return this.calculateForce(ball, false);
    }

    calculateForce(ball, doesAttract) {
        let force = doesAttract
            ? p5.Vector.sub(this.position, ball.position)
            : p5.Vector.sub(ball.position, this.position);
    
        let distance = force.mag();
        distance = constrain(5, 30);
        force.normalize();

        let strength = (this.G * this.mass * ball.mass) / (this.distance * this.distance)
        force.mult(strength);

        return force;
    }
}