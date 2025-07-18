class Platform {
    constructor(x, y, w, h, material) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fricCo =
            material == "ice" ? 0 :
            material == "rubber" ? 1.2 :
            0.65;
        this.dampCo =
            material == "ice" ? 0.37 :
            material == "rubber" ? 0.20 :
            0.28;
        this.materialColor =
            material == "ice" ? [150, 170, 200] :
            material == "rubber" ? [48, 48, 48] :
            [255, 255, 255]
    }

    show() {
        push();
        fill(this.materialColor);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        pop();
    }

    isBallOnTop(ball) {
        this.contactY = ball.position.y;
        return(
            this.x < ball.position.x - ball.size * 0.125 &&
            this.x + this.w > ball.position.x + ball.size * 0.125 &&
            ball.position.y + ball.size >= this.y &&
            ball.position.y + ball.size <= this.y + this.h
        );
    }

    applyForces(ball) {
        // Apply friction
        let friction = ball.velocity.copy();
        friction.normalize();
        friction.mult(-this.fricCo);
        ball.applyForce(friction);

        // Apply damping
        let dampThreshold = 2.4 - this.dampCo;
        if (abs(ball.velocity.y) > dampThreshold) {
            ball.velocity.mult(1, -0.95 + this.dampCo)
        } else if (ball.velocity.y >= 0) {
            ball.velocity.y = 0;
        }
        
        // Snap ball to platform
        if (ball.velocity.y >= 0) {
            ball.position.y = this.y - ball.size;
        }
    }
}

class SandboxPlatform {
    constructor(x, y, w, h, material) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fricCo =
            material == "ice" ? 0 :
            material == "rubber" ? 1.2 :
            0.65;
        this.dampCo =
            material == "ice" ? 0.37 :
            material == "rubber" ? 0.20 :
            0.28;
        this.materialColor =
            material == "ice" ? [150, 170, 200] :
            material == "rubber" ? [48, 48, 48] :
            [255, 255, 255]
    }

    show() {
        push();
        fill(this.materialColor);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        pop();
    }

    isBallOnTop(ball) {
        this.contactY = ball.position.y;
        return(
            this.x < ball.position.x - ball.size * 0.125 &&
            this.x + this.w > ball.position.x + ball.size * 0.125 &&
            ball.position.y + ball.size >= this.y &&
            ball.position.y + ball.size <= this.y + this.h
        );
    }

    applyForces(ball) {
        // Apply friction
        let friction = ball.velocity.copy();
        friction.normalize();
        friction.mult(-this.fricCo);
        ball.applyForce(friction);

        // Apply damping
        let dampThreshold = 2.4 - this.dampCo;
        if (abs(ball.velocity.y) > dampThreshold) {
            ball.velocity.mult(1, -0.95 + this.dampCo)
        } else if (ball.velocity.y >= 0) {
            ball.velocity.y = 0;
        }
        
        // Snap ball to platform
        if (ball.velocity.y >= 0) {
            ball.position.y = this.y - ball.size;
        }
    }
}

class SandboxMovingPlatform {
    constructor(x, y, w, h, material) {
        this.x = x;
        this.baseX = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fricCo =
            material == "ice" ? 0 :
            material == "rubber" ? 1.2 :
            0.65;
        this.dampCo =
            material == "ice" ? 0.37 :
            material == "rubber" ? 0.20 :
            0.28;
        this.materialColor =
            material == "ice" ? [150, 170, 200] :
            material == "rubber" ? [48, 48, 48] :
            [255, 255, 255]
    }

    show() {
        push();
        fill(this.materialColor);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        pop();
    }

    update() {
        if (!isSandboxPaused) this.x = this.baseX + sin(frameCount * 0.09) * 100;
    }

    isBallOnTop(ball) {
        this.contactY = ball.position.y;
        return(
            this.x < ball.position.x - ball.size * 0.125 &&
            this.x + this.w > ball.position.x + ball.size * 0.125 &&
            ball.position.y + ball.size >= this.y &&
            ball.position.y + ball.size <= this.y + this.h
        );
    }

    applyForces(ball) {
        // Apply friction
        let friction = ball.velocity.copy();
        friction.normalize();
        friction.mult(-this.fricCo);
        ball.applyForce(friction);

        // Apply damping
        let dampThreshold = 2.4 - this.dampCo;
        if (abs(ball.velocity.y) > dampThreshold) {
            ball.velocity.mult(1, -0.95 + this.dampCo)
        } else if (ball.velocity.y >= 0) {
            ball.velocity.y = 0;
        }
        
        // Snap ball to platform
        if (ball.velocity.y >= 0) {
            ball.position.y = this.y - ball.size;
        }
    }
}