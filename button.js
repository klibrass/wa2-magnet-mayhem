class Button {
    constructor(x, y, halfW, halfH, dw, dh, splashText) {
        this.x = x;
        this.y = y;
        this.baseHalfW = halfW;
        this.baseHalfH = halfH;
        this.halfW = halfW;
        this.halfH = halfH;
        this.dw = dw;
        this.dh = dh;
        this.splashText = splashText;
        this.color = [255, 255, 255];
        this.splashTextColor = [0, 0, 0];
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
        fill(this.splashTextColor);
        text(this.splashText, this.x, this.y + this.baseHalfH * 0.4);
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
            ? [30, 105, 227]
            : [255, 255, 255];
        this.splashTextColor = hovered
            ? [255, 255, 255]
            : [0, 0, 0];
        this.halfW = hovered
            ? lerp(this.halfW, this.dw, 0.2)
            : lerp(this.halfW, this.baseHalfW, 0.2);
        this.halfH = hovered
            ? lerp(this.halfH, this.dh, 0.2)
            : lerp(this.halfH, this.baseHalfH, 0.2);
    }

    click(func) {
        func;
    }
}

function handleButtonHover(button) {
    button.show();
    if(button.containsMouse()) {
        button.shift(true);
        cursor(HAND);
    } else {
        button.shift(false);
        cursor(ARROW);
    }
}