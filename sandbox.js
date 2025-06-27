// --- SANDBOX STATE VARIABLES ---

let isSandboxPaused = false; // Whether the sandbox simulation is paused
let sandboxEmojiButtons = []; // Toolbar buttons for sandbox tools
let sandboxSimulationEmojiButtons = []; // Toolbar buttons for simulation controls
let sandboxBalls = [], sandboxPlatforms = [], sandboxMagnets = [], sandboxMovingPlatforms = []; // Sandbox objects
let sandboxMouseMode = ""; // Current tool/mode selected in sandbox
let sandboxHoverColor; // Current hover color for sandbox tool
let showSandboxColorPicker = false; // Whether the color picker is visible
let sandboxBallColor = [10, 180, 70]; // Default color for new sandbox balls
let sandboxColorPickerInput; // p5.js color input element for color picker

// Hover colors for each tool
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

// --- MAIN SANDBOX HANDLER ---

function handleSandbox() {
    displaySandbox(); // Draw sandbox background and UI
    drawSandboxHoverEffect(); // Draw hover effect for current tool
    handleButtonHover(emojiButtonQuit); // Show hover effect for quit button
    handleKeyPress(); // Handle key presses for sandbox
    handleSandboxBalls(); // Draw and update balls
    handleSandboxPlatforms(); // Draw and update platforms and moving platforms
    handleSandboxMagnets(); // Draw magnets
    if (!isSandboxPaused) {
        handleSandboxForces(); // Apply forces if not paused
    }
}

// --- HANDLE SANDBOX TOOLBAR AND SIMULATION BUTTON CLICKS ---

function handleSandboxClicks() {
    // Handle simulation control buttons (pause, delete, reset)
    for (let sandboxSimulationEmojiButton of sandboxSimulationEmojiButtons) {
        if (sandboxSimulationEmojiButton.containsMouse()) {
            if (sandboxSimulationEmojiButton === emojiButtonPause) {
                // Toggle pause/play
                isSandboxPaused = !isSandboxPaused;
                emojiButtonPause.emoji = isSandboxPaused ? "▶️" : "⏸️";
                emojiButtonPause.splashText = isSandboxPaused ? "PLAY" : "PAUSE";
            } else if (sandboxSimulationEmojiButton === emojiButtonDelete) {
                // Activate delete mode
                sandboxMouseMode = "emojiButtonDelete";
                sandboxHoverColor = sandboxHoverColors["emojiButtonDelete"];
            } else if (sandboxSimulationEmojiButton === emojiButtonReset) {
                // Reset sandbox
                resetSandbox();
            }
            return;
        }
    }

    // Handle tool selection from toolbar
    const hoveredSandboxToolbar = getHoveredSandboxToolbar();

    if (hoveredSandboxToolbar && hoveredSandboxToolbar.key) {
        // Block tool if not unlocked
        if (
            (hoveredSandboxToolbar.key === "emojiButtonWind" && !isWindUnlocked) ||
            (hoveredSandboxToolbar.key === "emojiButtonAntiGravity" && !isAntiGravityUnlocked) ||
            (hoveredSandboxToolbar.key === "emojiButtonMovingPlatform" && !isMovingPlatformUnlocked) ||
            (hoveredSandboxToolbar.key === "emojiButtonColorPicker" && !isColorPickerUnlocked)
        ) {
            return;
        }

        // Wind button toggles wind on/off
        if (hoveredSandboxToolbar.key === "emojiButtonWind") {
            if (wind.x === 3 && wind.y === 0) {
                wind.set(0, 0);
            } else {
                wind.set(3, 0);
            }
            console.log("Wind is now:", wind.x, wind.y);
            return;
        }

        // Antigravity button toggles gravity on/off
        if (hoveredSandboxToolbar.key === "emojiButtonAntiGravity") {
            if (gravity.x === 0 && gravity.y === 3) {
                gravity.set(0, 0);
            } else {
                gravity.set(0, 3);
            }
            return;
        }

        // Color picker button toggles color picker UI
        if (hoveredSandboxToolbar.key === "emojiButtonColorPicker") {
            showSandboxColorPicker = !showSandboxColorPicker;
            if (showSandboxColorPicker) {
                if (!sandboxColorPickerInput) {
                    sandboxColorPickerInput = createColorPicker(color(sandboxBallColor));
                    sandboxColorPickerInput.position(100, 100); // Adjust position as needed
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

        // Hide color picker if switching away from color picker tool
        if (sandboxColorPickerInput) sandboxColorPickerInput.hide();

        // Set current tool and hover color
        sandboxMouseMode = hoveredSandboxToolbar.key;
        sandboxHoverColor = sandboxHoverColors[hoveredSandboxToolbar.key];
    }

    // Handle delete mode: delete hovered object
    if (!hoveredSandboxToolbar && sandboxMouseMode === "emojiButtonDelete") {
        deleteHoveredSandboxObject();
        return;
    }

    // Handle placing or interacting with objects based on current tool
    if (!hoveredSandboxToolbar) {
        switch (sandboxMouseMode) {
            case "emojiButtonNewBall":
                // Add a new ball with current color
                sandboxBalls.push(new SandboxBall(mouseX, mouseY, 10, sandboxBallColor));
                break;
            case "emojiButtonNewPlatform":
                // Add a new static platform
                sandboxPlatforms.push(new SandboxPlatform(mouseX - 50, mouseY - 15, 100, 30));
                break;
            case "emojiButtonNewMagnet":
                // Delete hovered magnet or add new magnet
                const hoveredSandboxMagnet = getHoveredSandboxMagnet();
                if (hoveredSandboxMagnet) {
                    removeSandboxMagnet(hoveredSandboxMagnet);
                } else {
                    sandboxMagnets.push(new SandboxMagnet(mouseX, mouseY, attractorOnClick, 30));
                }
                break;
            case "emojiButtonMovingPlatform":
                // Add a new moving platform
                sandboxMovingPlatforms.push(new SandboxMovingPlatform(mouseX - 50, mouseY - 15, 100, 30));
                break;
        }
    }
}

// --- SANDBOX OBJECT HANDLERS ---

// Draw and update all sandbox balls
function handleSandboxBalls() {
    sandboxBalls.forEach(sandboxBall => {
        sandboxBall.show();
        if (!isSandboxPaused) {
            sandboxBall.update();
        }
    });
}

// Draw and update all sandbox platforms and moving platforms
function handleSandboxPlatforms() {
    // Static platforms
    sandboxPlatforms.forEach(sandboxPlatform => {
        sandboxPlatform.show();
        sandboxBalls.forEach(sandboxBall => {
            if (sandboxPlatform.isBallOnTop(sandboxBall)) {
                sandboxPlatform.applyForces(sandboxBall);
            }
        });
    });

    // Moving platforms
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

// Apply forces to all sandbox balls (magnets, gravity, wind)
function handleSandboxForces() {
    // Magnet forces
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

    // Gravity and wind
    sandboxBalls.forEach(sandboxBall => {
        sandboxBall.applyForce(gravity);
        sandboxBall.applyForce(wind);
    });
}

// Draw all sandbox magnets and their hover effect
function handleSandboxMagnets() {
    sandboxMagnets.forEach(sandboxMagnet => {
        sandboxMagnet.show();
        sandboxMagnet.changeColorHovered();
    });
}

// Add or remove a sandbox magnet on click
function handleSandboxMagnetClick() {
    const hoveredSandboxMagnet = getHoveredSandboxMagnet();
    if (hoveredSandboxMagnet) {
        removeSandboxMagnet(hoveredSandboxMagnet);
    } else {
        addNewSandboxMagnet();
    }
}

// --- SANDBOX OBJECT DELETION ---

// Delete the hovered object (magnet, ball, platform, moving platform)
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

// --- SANDBOX RESET ---

// Reset the sandbox to default state
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

// --- SANDBOX UI HELPERS ---

// Draw the hover effect for the current tool
function drawSandboxHoverEffect() {
    push();
    fill(sandboxHoverColor || [200, 200, 200]);
    circle(mouseX, mouseY, 20);
    pop();
}

// Get the hovered toolbar button (if any)
function getHoveredSandboxToolbar() {
    for (let sandboxEmojiButton of sandboxEmojiButtons) {
        if (sandboxEmojiButton.containsMouse()) {
            return sandboxEmojiButton;
        }
    }
    return null;
}