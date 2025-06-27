let isSandboxPaused = false;
let sandboxEmojiButtons = [];
let sandboxSimulationEmojiButtons = [];
let sandboxBalls = [], sandboxPlatforms = [], sandboxMagnets = [], sandboxMovingPlatforms = [];
let sandboxMouseMode = "";
let sandboxHoverColor;
let showSandboxColorPicker = false;
let sandboxBallColor = [10, 180, 70]; // default color
let sandboxColorPickerInput; // p5.js color input element

let sandboxHoverColors = {
    emojiButtonNewBall: [255, 255, 255, 128],
    emojiButtonNewPlatform: [0, 210, 255, 128],
    emojiButtonNewMagnet: [255, 99, 120, 128],
    emojiButtonWind: [0, 210, 255, 128],
    emojiButtonAntiGravity: [228, 218, 0, 128],
    emojiButtonMovingPlatform: [200, 200, 200, 128],
    emojiButtonColorPicker: [255, 255, 255, 128],
    emojiButtonPause: [0, 210, 255, 128],
    emojiButtonDelete: [255, 99, 120, 128]
};

function handleSandbox() {
    displaySandbox();
    drawSandboxHoverEffect();
    handleButtonHover(emojiButtonQuit);
    handleKeyPress();
    handleSandboxBalls();
    handleSandboxPlatforms();
    handleSandboxMagnets();
    if (!isSandboxPaused) {
        handleSandboxForces();
    }
}

function handleSandboxClicks() {
    for (let sandboxSimulationEmojiButton of sandboxSimulationEmojiButtons) {
        if (sandboxSimulationEmojiButton.containsMouse()) {
            if (sandboxSimulationEmojiButton === emojiButtonPause) {
                isSandboxPaused = !isSandboxPaused;
                emojiButtonPause.emoji = isSandboxPaused ? "▶️" : "⏸️";
                emojiButtonPause.splashText = isSandboxPaused ? "PLAY" : "PAUSE";
            } else if (sandboxSimulationEmojiButton === emojiButtonDelete) {
                sandboxMouseMode = "emojiButtonDelete";
                sandboxHoverColor = sandboxHoverColors["emojiButtonDelete"];
            } else if (sandboxSimulationEmojiButton === emojiButtonReset) {
                resetSandbox();
            }
            return;
        }
    }

    const hoveredSandboxToolbar = getHoveredSandboxToolbar();

    if (hoveredSandboxToolbar && hoveredSandboxToolbar.key) {
        // Block if not unlocked
        if (
            (hoveredSandboxToolbar.key === "emojiButtonWind" && !isWindUnlocked) ||
            (hoveredSandboxToolbar.key === "emojiButtonAntiGravity" && !isAntiGravityUnlocked) ||
            (hoveredSandboxToolbar.key === "emojiButtonMovingPlatform" && !isMovingPlatformUnlocked) ||
            (hoveredSandboxToolbar.key === "emojiButtonColorPicker" && !isColorPickerUnlocked)
        ) {
            return;
        }

        // Wind button special toggle
        if (hoveredSandboxToolbar.key === "emojiButtonWind") {
            // Toggle wind between (3, 0) and (0, 0)
            if (wind.x === 3 && wind.y === 0) {
                wind.set(0, 0);
            } else {
                wind.set(3, 0);
            }
            console.log("Wind is now:", wind.x, wind.y);
            return; // Don't change mouse mode for wind button
        }

        // Antigravity button special toggle
        if (hoveredSandboxToolbar.key === "emojiButtonAntiGravity") {
            if (gravity.x === 0 && gravity.y === 3) {
                gravity.set(0, 0);
            } else {
                gravity.set(0, 3);
            }
            return;
        }

        // Color picker button toggle
        if (hoveredSandboxToolbar.key === "emojiButtonColorPicker") {
            showSandboxColorPicker = !showSandboxColorPicker;
            if (showSandboxColorPicker) {
                if (!sandboxColorPickerInput) {
                    sandboxColorPickerInput = createColorPicker(color(sandboxBallColor));
                    sandboxColorPickerInput.position(100, 100); // adjust as needed
                    sandboxColorPickerInput.input(() => {
                        const c = sandboxColorPickerInput.color();
                        sandboxBallColor = [red(c), green(c), blue(c)];
                    });
                }
                sandboxColorPickerInput.show();
            } else if (sandboxColorPickerInput) {
                sandboxColorPickerInput.hide();
            }
            return;
        }

        if (sandboxColorPickerInput) sandboxColorPickerInput.hide();

        sandboxMouseMode = hoveredSandboxToolbar.key;
        sandboxHoverColor = sandboxHoverColors[hoveredSandboxToolbar.key];
    }

    if (!hoveredSandboxToolbar && sandboxMouseMode === "emojiButtonDelete") {
        deleteHoveredSandboxObject();
        return;
    }

    if (!hoveredSandboxToolbar) {
        switch (sandboxMouseMode) {
            case "emojiButtonNewBall":
                sandboxBalls.push(new SandboxBall(mouseX, mouseY, 10, sandboxBallColor));
                break;
            case "emojiButtonNewPlatform":
                sandboxPlatforms.push(new SandboxPlatform(mouseX - 50, mouseY - 15, 100, 30));
                break;
            case "emojiButtonNewMagnet":
                const hoveredSandboxMagnet = getHoveredSandboxMagnet();
                if (hoveredSandboxMagnet) {
                    removeSandboxMagnet(hoveredSandboxMagnet);
                } else {
                    sandboxMagnets.push(new SandboxMagnet(mouseX, mouseY, attractorOnClick, 30));
                }
                break;
            case "emojiButtonMovingPlatform":
                sandboxMovingPlatforms.push(new SandboxMovingPlatform(mouseX - 50, mouseY - 15, 100, 30));
                break;
        }
    }
}

function handleSandboxBalls() {
    sandboxBalls.forEach(sandboxBall => {
        sandboxBall.show();
        if (!isSandboxPaused) {
            sandboxBall.update();
        }
    });
}

function handleSandboxPlatforms() {
    sandboxPlatforms.forEach(sandboxPlatform => {
        sandboxPlatform.show();
        sandboxBalls.forEach(sandboxBall => {
            if (sandboxPlatform.isBallOnTop(sandboxBall)) {
                sandboxPlatform.applyForces(sandboxBall);
            }
        });
    });

    sandboxMovingPlatforms.forEach(sandboxMovingPlatform => {
        sandboxMovingPlatform.show();
        sandboxMovingPlatform.update();
        sandboxBalls.forEach(sandboxBall => {
            if (sandboxMovingPlatform.isBallOnTop(sandboxBall)) {
                sandboxMovingPlatform.applyForces(sandboxBall);
            }
        });
    });
}

function handleSandboxForces() {
    sandboxMagnets.forEach(sandboxMagnet => {
        if (sandboxMagnet.attractionStatus === 1) {
            sandboxBalls.forEach(sandboxBall => {
                sandboxBall.applyForce(sandboxMagnet.calculateAttraction(sandboxBall));
            });
        } else {
            sandboxBalls.forEach(sandboxBall => {
                sandboxBall.applyForce(sandboxMagnet.calculateRepulsion(sandboxBall));
            });
        }
    });

    sandboxBalls.forEach(sandboxBall => {
        sandboxBall.applyForce(gravity);
        sandboxBall.applyForce(wind);
    });
}

function handleSandboxMagnets() {
    sandboxMagnets.forEach(sandboxMagnet => {
        sandboxMagnet.show();
        sandboxMagnet.changeColorHovered();
    });
}

function handleSandboxMagnetClick() {
    const hoveredSandboxMagnet = getHoveredSandboxMagnet();
    if (hoveredSandboxMagnet) {
        removeSandboxMagnet(hoveredSandboxMagnet);
    } else {
        addNewSandboxMagnet();
    }
}

function deleteHoveredSandboxObject() {
    // Try to delete a hovered magnet first
    const hoveredMagnet = getHoveredSandboxMagnet();
    if (hoveredMagnet) {
        removeSandboxMagnet(hoveredMagnet);
        return;
    }

    // Then try to delete a hovered ball
    for (let i = 0; i < sandboxBalls.length; i++) {
        const ball = sandboxBalls[i];
        if (dist(mouseX, mouseY, ball.position.x, ball.position.y) < ball.size) {
            sandboxBalls.splice(i, 1);
            return;
        }
    }

    // Then try to delete a hovered platform
    for (let i = 0; i < sandboxPlatforms.length; i++) {
        const platform = sandboxPlatforms[i];
        if (
            mouseX >= platform.x &&
            mouseX <= platform.x + platform.w &&
            mouseY >= platform.y &&
            mouseY <= platform.y + platform.h
        ) {
            sandboxPlatforms.splice(i, 1);
            return;
        }
    }

    // Finally, try to delete a hovered moving platform
    for (let i = 0; i < sandboxMovingPlatforms.length; i++) {
        const movingPlatform = sandboxMovingPlatforms[i];
        if (
            mouseX >= movingPlatform.x &&
            mouseX <= movingPlatform.x + movingPlatform.w &&
            mouseY >= movingPlatform.y &&
            mouseY <= movingPlatform.y + movingPlatform.h
        ) {
            sandboxMovingPlatforms.splice(i, 1);
            return;
        }
    }
}

function resetSandbox() {
    // Clear all objects
    sandboxBalls = [];
    sandboxPlatforms = [];
    sandboxMagnets = [];
    sandboxMovingPlatforms = [];

    // Reset settings
    isSandboxPaused = false;
    gravity.set(0, 3);
    wind.set(0, 0);
    sandboxMouseMode = "";
    sandboxHoverColor = undefined;
    showSandboxColorPicker = false;
    sandboxBallColor = [10, 180, 70]; // default color

    // Hide color picker if open
    if (sandboxColorPickerInput) {
        sandboxColorPickerInput.hide();
    }
}

function drawSandboxHoverEffect() {
    push();
    fill(sandboxHoverColor || [200, 200, 200]);
    circle(mouseX, mouseY, 20);
    pop();
}

function getHoveredSandboxToolbar() {
    for (let sandboxEmojiButton of sandboxEmojiButtons) {
        if (sandboxEmojiButton.containsMouse()) {
            return sandboxEmojiButton;
        }
    }
    return null;
}