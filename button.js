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

class EmojiButton {
    constructor(x, y, size, dsize, emoji, splashText, splashTextColor) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSize = size;
        this.dsize = dsize;
        this.emoji = emoji;
        this.splashText = splashText;
        this.splashTextColor = splashTextColor;
    }

    show() {
        push();
        rectMode(CENTER);
        fill(0, 0, 0, 0);
        noStroke();
        square(this.x, this.y, this.size);

        fill(0, 0, 0, 255);
        textAlign(CENTER);
        textStyle(NORMAL);
        textSize(this.size);
        text(this.emoji, this.x + this.size * 0.5, this.y + this.size);
        pop();
    }

    containsMouse() {
        return (
            this.x <= mouseX &&
            this.x + this.size >= mouseX &&
            this.y <= mouseY &&
            this.y + this.size >= mouseY
        )
    }

    shift(hovered) {
        this.size = hovered
            ? lerp(this.size, this.dsize, 0.2)
            : lerp(this.size, this.baseSize, 0.2);
        if (hovered) {
            push();
            fill(this.splashTextColor);
            textStyle(NORMAL);
            textAlign(LEFT);
            textFont('Bahnschrift Condensed', this.size);
            text(this.splashText, this.x + this.size * 1.4, this.y + this.size);
            pop();
        }
    }
}

function handleButtonHover(button) {
    button.show();
    if (button.containsMouse()) {
        button.shift(true);
        cursor(HAND);
    } else {
        button.shift(false);
    }
}

function handleEmojiButtonHover(emojiButton) {
    emojiButton.show();
    if (emojiButton.containsMouse()) {
        emojiButton.shift(true);
        cursor(HAND);
    } else {
        emojiButton.shift(false);
    }
}