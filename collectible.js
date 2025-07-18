class Orb {
    constructor(x, y, size, img) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.size = size;
        this.img = img;
        this.isCollected = false;
    }

    show() {
        if (!this.isCollected) image(this.img, this.x, this.y, this.size, this.size);
        this.y = this.baseY + sin(millis() * 0.002) * 6.5;
    }

    touch(ball) {
        if (
            this.x <= ball.position.x + ball.size &&
            this.x + this.size >= ball.position.x - ball.size &&
            this.y <= ball.position.y + ball.size &&
            this.y + this.size >= ball.position.y - ball.size &&
            !this.isCollected
        ) {
            this.isCollected = true;
        }
    }
}