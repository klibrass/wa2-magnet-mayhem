let magnetStrengthCo = 1.0;

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

    containsMouse() {
        return dist(this.position.x, this.position.y, mouseX, mouseY) < this.radius;
    }

    changeColorHovered() {
        if (this.containsMouse()) {
            this.color =
            this.attractionStatus == -1
                ? [255, 176, 176]
                : [176, 176, 255];
        } else {
            this.color =
            this.attractionStatus == -1
                ? [255, 0, 0]
                : [0, 0, 255];
        }
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
    
        let distance = sqrt(force.mag());
        distance = constrain(distance, 5, 15);
        force.normalize();

        let strength = (this.G * magnetStrengthCo * this.mass * ball.mass) / (distance * distance)
        force.mult(strength);

        return force;
    }
}

class SandboxMagnet {
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

    containsMouse() {
        return dist(this.position.x, this.position.y, mouseX, mouseY) < this.radius;
    }

    changeColorHovered() {
        if (this.containsMouse()) {
            this.color =
            this.attractionStatus == -1
                ? [255, 176, 176]
                : [176, 176, 255];
        } else {
            this.color =
            this.attractionStatus == -1
                ? [255, 0, 0]
                : [0, 0, 255];
        }
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
    
        let distance = sqrt(force.mag());
        distance = constrain(distance, 5, 15);
        force.normalize();

        let strength = (this.G * magnetStrengthCo * this.mass * ball.mass) / (distance * distance)
        force.mult(strength);

        return force;
    }
}

function getHoveredMagnet() {
    for (let magnet of magnets) {
        if (magnet.containsMouse()) {
            return magnet;
        }
    }
    return null; // No magnet hovered
}

function removeMagnet(magnet) {
    if (magnet.attractionStatus === 1) {
        magnetNumber.att += 1;
    } else {
        magnetNumber.rep += 1;
    }
    magnets.splice(magnets.indexOf(magnet), 1);
}

function addNewMagnet() {
    if (attractorOnClick === 1 && magnetNumber.att > 0) {
        magnets.push(new Magnet(mouseX, mouseY, attractorOnClick, 20));
        magnetNumber.att -= 1;
    } else if (attractorOnClick === -1 && magnetNumber.rep > 0) {
        magnets.push(new Magnet(mouseX, mouseY, attractorOnClick, 20));
        magnetNumber.rep -= 1;
    }
}

function getHoveredSandboxMagnet() {
    for (let sandboxMagnet of sandboxMagnets) {
        if (sandboxMagnet.containsMouse()) {
            return sandboxMagnet;
        }
    }
    return null; // No magnet hovered
}

function removeSandboxMagnet(sandboxMagnet) {
    sandboxMagnets.splice(sandboxMagnets.indexOf(sandboxMagnet), 1);
}

function addNewSandboxMagnet() {
    sandboxMagnets.push(new SandboxMagnet(mouseX, mouseY, attractorOnClick, 20));
}