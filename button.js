class Button {
    constructor(x, y, dw, dh, splashText) {
        this.x = x;
        this.y = y;
        this.baseHalfW = 180 * 0.5;
        this.baseHalfH = 60 * 0.5;
        this.halfW = 180 * 0.5;
        this.halfH = 60 * 0.5;
        this.dw = dw;
        this.dh = dh;
        this.splashText = splashText;
        this.color = [255, 255, 255];
    }

    show() {
        push();
        rectMode(RADIUS);
        noStroke();
        fill(this.color);
        rect(this.x, this.y, this.halfW, this.halfH);

        fill(0);
        textFont('Bahnschrift', 30);
        textAlign(CENTER);
        textStyle(BOLD);
        fill(0);
        text(this.splashText, this.x, this.y);
        pop();
    }

    containsMouse() {
        return (
            this.x - this.halfW <= mouseX &&
            this.x + this.halfW >= mouseX &&
            this.y - this.halfH <= mouseY &&
            this.y + this.halfH >= mouseY
        )
    }

    shift(hovered) {
        this.color = hovered
            ? [10, 180, 70]
            : [255, 255, 255];
        this.halfW = hovered
            ? lerp(this.halfW, this.dw, 0.2)
            : lerp(this.halfW, this.baseHalfW, 0.2);
        this.halfH = hovered
            ? lerp(this.halfH, this.dh, 0.2)
            : lerp(this.halfH, this.baseHalfH, 0.2);
    }
}