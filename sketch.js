// --- Game State ---
let round = 0; // Current round number
let inGame = false; // Whether the player is in a round
let isRoundComplete = false; // Whether the current round is complete
let preInGame = "start"; // Menu state: "start", "instructions", "SANDBOX"
let inGameStage = "PRELIMINARY"; // Stage label for display

// --- Physics and Objects ---
let magnets = []; // Array of magnets in the current round
let magnetNumber = { att: 0, rep: 0 }; // Number of attractor/repulsor magnets
let magnetColor, magnetColorHover; // Magnet colors for UI
let attractorOnClick = -1; // -1: repulsion, 1: attraction

let platforms = []; // Array of platforms for the round
let checkpoints = []; // Array of checkpoints for the round
let walls = []; // Array of walls for the round
let waterZones = []; // Array of water zones for the round

// --- Unlockables ---
let isWindUnlocked = false; // Wind feature unlocked
let isAntiGravityUnlocked = false; // Anti-gravity feature unlocked
let isMovingPlatformUnlocked = false; // Moving platform feature unlocked
let isColorPickerUnlocked = false; // Color picker feature unlocked

// --- Asset Preloading ---
function preload() {
    imgCheckpoint = loadImage('/assets/checkpoint.png'); // Checkpoint image
    imgComplete = loadImage('/assets/complete screen.png'); // Complete screen image
    imgOrbColorPicker = loadImage('/assets/rainbow orb.png'); // Color picker orb image
    imgOrbWind = loadImage('/assets/wind orb.png'); // Wind orb image
    imgOrbAntiGravity = loadImage('/assets/antigravity orb.png'); // Anti-gravity orb image
    imgOrbMovingPlatform = loadImage('/assets/moving platform orb.png'); // Moving platform orb image
}

// --- Setup Function ---
function setup() {
    createCanvas(800, 600); // Set canvas size

    ball = new Ball(120, 50, 20); // Create the main ball
    gravity = createVector(0, 3); // Set gravity vector
    wind = createVector(0, 0); // Set wind vector (default off)

    setupPlatformsAndCheckpoints(); // Initialize platforms, checkpoints, walls, water
    setupButtons(); // Initialize all UI buttons
    setupCollectibles(); // Initialize collectible orbs
}

// --- Main Draw Loop ---
function draw() {
    background(220, 235, 240); // Set background color
    cursor(ARROW); // Default cursor
    updateMagnetColors(); // Update magnet color based on mode

    // Menu or game logic
    if (!inGame) {
        if (round != 255) {
            handleMenus(); // Show menus
        } else {
            handleSandbox(); // Show sandbox
        }
    } else {
        handleGame(); // Run game logic
    }
}

// --- Mouse Click Handler ---
function mouseClicked() {
    if (inGame) {
        // Check if reload or complete reload button is clicked
        const shouldReload = buttonReload.containsMouse() || (buttonReloadComplete.containsMouse() && isRoundComplete);
        
        if (shouldReload) {
            reloadCurrentRound();
            cursor(ARROW);
            return;
        }

        handleQuitButton(); // Handle quit button

        // Check if next round button is clicked and round is complete
        const nextRoundClicked = buttonNextRound.containsMouse() && isRoundComplete;

        if (nextRoundClicked) {
            if (round !== 12) {
                // Load next round if not last
                const nextRoundLoader = window[`loadRound${round + 1}`];
                if (typeof nextRoundLoader === "function") {
                    nextRoundLoader();
                }
            } else {
                // If last round, go to sandbox
                inGame = false;
                preInGame = "SANDBOX";
                displaySandbox();
            }
            cursor(ARROW);
            return;
        }

        handleMagnetAddition(); // Add or remove magnets
    } else {
        // Menu or sandbox click handling
        if (preInGame !== "SANDBOX") {
            handleMenuClicks();
        } else {
            handleSandboxClicks();
            handleQuitButton();
        }
    }
}

// --- Menu Display Handler ---
function handleMenus() {
    if (preInGame === "start") startMenu();
    if (preInGame === "instructions") instructionsMenu();
    if (preInGame === "SANDBOX") displaySandbox();
}

// --- Main Game Handler ---
function handleGame() {
    displayRounds(); // Show round-specific visuals
    buttonReload.show(); // Show reload button
    if (!isRoundComplete) handleButtonHover(buttonReload);

    handleRoundText(); // Show round text
    handleForces(); // Apply forces to ball
    displayMagnetNumber(); // Show magnet count
    displayMagnetStrengthCo(); // Show magnet strength
    drawHoverEffect(); // Draw hover effect for magnets
    handleBall(); // Update and draw ball

    if (isRoundComplete) displayCompleteScreen(); // Show complete screen
    handleButtonHover(emojiButtonQuit); // Hover effect for quit button
    handleKeyPress(); // Handle key presses
}

// --- Round Text Display ---
function handleRoundText() {
    push();
    textAlign(CENTER);
    textFont('Bahnschrift Condensed', 32);
    textStyle(NORMAL);
    stroke(120);
    strokeWeight(3.5);
    fill(255);
    text(`Round ${round}`, width * 0.5, 55);

    textSize(16);
    strokeWeight(2);
    text(inGameStage, width * 0.5, 79);
    pop();
}

// --- Menu Click Handler ---
function handleMenuClicks() {
    if (buttonStart.containsMouse()) {
        inGameStage = "PRELIMINARY";
        loadRound1();
    }

    if (buttonInstructions.containsMouse()) {
        preInGame = "instructions";
        cursor(ARROW);
    }

    if (buttonStartMenu.containsMouse()) {
        preInGame = "start";
        cursor(ARROW);
    }

    if (buttonGoToLatestRound.containsMouse()) {
        preInGame = "SANDBOX";
        cursor(ARROW);
    }
}

// --- Quit Button Handler ---
function handleQuitButton() {
    if (emojiButtonQuit.containsMouse()) {
        inGame = false;
        round = 0;
        magnets = [];
        preInGame = "start";
        return;
    }
}

// --- Magnet Color Update ---
function updateMagnetColors() {
    magnetColor = attractorOnClick === 1 ? [0, 0, 255] : [255, 0, 0];
    magnetColorHover = attractorOnClick === 1 ? [0, 0, 255, 128] : [255, 0, 0, 128];
}

// --- Draw Magnet Hover Effect ---
function drawHoverEffect() {
    push();
    fill(magnetColorHover);
    noStroke();
    circle(mouseX, mouseY, 20);
    pop();
}

// --- Ball Handler ---
function handleBall() {
    if (!isRoundComplete) {
        ball.show();
        ball.update();
        ball.outOfFrame();
        displayBallVelocity();
    } else {
        ball.acceleration.mult(0);
        ball.velocity.mult(0);
    }
}

// --- Ball Velocity Display ---
function displayBallVelocity() {
    fill(10, 180, 70);
    textFont('Bahnschrift Semicondensed', 20);
    textStyle(ITALIC);
    text(`v: ${floor(ball.velocity.mag())} unit/s`, ball.position.x, ball.position.y - 40);
}

// --- Apply Forces to Ball ---
function handleForces() {
    magnets.forEach(magnet => {
        magnet.show();
        magnet.changeColorHovered();
        if (magnet.attractionStatus === 1) {
            ball.applyForce(magnet.calculateAttraction(ball));
        } else {
            ball.applyForce(magnet.calculateRepulsion(ball));
        }
    });

    ball.applyForce(gravity);
    ball.applyForce(wind);
}

// --- Key Press Handler ---
function handleKeyPress() {
    if (keyIsDown(65)) attractorOnClick = 1; // 'A' key for attractor
    if (keyIsDown(82)) attractorOnClick = -1; // 'R' key for repulsor
    if (keyIsDown(68)) magnets = []; // 'D' key to clear magnets
}

// --- Magnet Addition/Removal Handler ---
function handleMagnetAddition() {
    const hoveredMagnet = getHoveredMagnet();
    if (hoveredMagnet && !isRoundComplete) {
        removeMagnet(hoveredMagnet);
    } else if (!isRoundComplete) {
        addNewMagnet();
    }
}

// --- Reload Current Round ---
function reloadCurrentRound() {
    const roundLoader = window[`loadRound${round}`];
    if (typeof roundLoader === "function") {
        roundLoader();
    } else {
        console.error(`No loader function found for round ${round}`);
    }
}

// --- Display Round-Specific Visuals ---
function displayRounds() {
    const roundDisplayFunction = window[`displayRound${round}`];
    if (typeof roundDisplayFunction === "function") {
        roundDisplayFunction();
    }
}

// --- Setup Platforms, Checkpoints, Walls, Water ---
function setupPlatformsAndCheckpoints() {
    platforms = [
        [new Platform(0, 300, 800, 300)],
        [new Platform(0, 300, 800, 300)],
        [new Platform(0, 300, 300, 30), new Platform(500, 400, 300, 30)],
        [new Platform(0, 200, 400, 30, "rubber"), new Platform(200, 400, 500, 30, "ice")],
        [new Platform(0, 200, 100, 30), new Platform(300, 300, 180, 30, "ice"), new Platform(600, 400, 200, 30)],
        [new Platform(0, 450, 350, 150), new Platform(450, 450, 350, 150, "ice")],
        [new Platform(250, 250, 300, 30)],
        [new Platform(0, 450, width, 150)],
        [new Platform(50, 200, 150, 30), new Platform(500, 500, 300, 100)],
        [new Platform(350, 200, 100, 30), new Platform(350, 500, 100, 30)],
        [new Platform(500, 0, 300, 100)],
        [new Platform(50, 200, 100, 30), new Platform(650, 160, 100, 30), new Platform(50, 550, 200, 30), new Platform(530, 160, 120, 30), new Platform (655, 550, 165, 50)]
    ];

    checkpoints = [
        new Checkpoint(740, 250),
        new Checkpoint(740, 250),
        new Checkpoint(740, 350),
        new Checkpoint(260, 350),
        new Checkpoint(750, 350),
        new Checkpoint(740, 400),
        new Checkpoint(width * 0.5, 550),
        new Checkpoint(680, 400),
        new Checkpoint(500, 450),
        new Checkpoint(380, 450),
        new Checkpoint(700, 110),
        new Checkpoint(700, 110)
    ];

    walls = [
        null,
        null,
        null,
        null,
        null,
        new Wall(350, 400, 100, 200),
        null,
        [new Wall(0, 0, 50, height), new Wall(750, 0, 50, height)],
        new Wall(width * 0.5 - 30, 370, 60, 230),
        null,
        new Wall(300, 300, 200, 300),
        new Wall(325, 0, 150, 350) 
    ];

    waterZones = [
        null,
        null,
        null,
        null,
        null,
        null,
        new WaterZone(0, 280, width, height - 280),
        null,
        null,
        null,
        new WaterZone(0, 0, width, height),
        null
    ];
}

// --- Setup All Buttons ---
function setupButtons() {
    // Main menu buttons
    buttonStart = new Button(width * 0.5, height * 0.5, 80, 30, 96, 36, "START");
    buttonInstructions = new Button(width * 0.5, height * 0.65, 115, 30, 138, 36, "INSTRUCTIONS");
    buttonGoToLatestRound = new Button(width * 0.5, height * 0.8, 80, 30, 96, 36, "SKIP");
    buttonStartMenu = new Button(width - 120, height - 60, 80, 30, 88, 33, "BACK");
    buttonReload = new Button(width - 115, 55, 85, 25, 93.5, 27.5, "RESTART");
    buttonNextRound = new Button(width * 0.5, height * 0.5, 80, 30, 96, 36, "NEXT");
    buttonReloadComplete = new Button(width * 0.5, height * 0.5 + 80, 80, 30, 96, 36, "RESTART");

    // Emoji buttons for sandbox/tools
    emojiButtonQuit = new EmojiButton(5, 5, 15, 20, "❌", "QUIT", [255, 99, 120]);
    emojiButtonNewBall = new EmojiButton(5, 30, 25, 30, "⚪", "ADD BALL", [255, 255, 255]);
    emojiButtonNewPlatform = new EmojiButton(5, 35, 25, 30, "📶", "ADD PLATFORM", [0, 210, 255]);
    emojiButtonNewMagnet = new EmojiButton(5, 55, 25, 30, "🧲", "ADD MAGNET", [255, 99, 120]);
    emojiButtonWind = new EmojiButton(5, 105, 25, 30, "🌬️", "WIND", [0, 210, 255]);
    emojiButtonAntiGravity = new EmojiButton(5, 130, 25, 30, "🪐", "ANTIGRAVITY", [228, 218, 0]);
    emojiButtonMovingPlatform = new EmojiButton(5, 155, 25, 30, "🛠️", "MOVING PLATFORM", [200, 200, 200]);
    emojiButtonColorPicker = new EmojiButton(5, 180, 25, 30, "🌈", "COLOUR PICKER", [255, 255, 255]);
    emojiButtonPause = new EmojiButton(770, 30, 25, 30, "⏸️", "PAUSE", [0, 210, 255]);
    emojiButtonDelete = new EmojiButton(770, 35, 25, 30, "🚫", "DELETE", [255, 99, 120]);
    emojiButtonReset = new EmojiButton(770, 60, 25, 30, "🔄", "RESET", [120, 120, 255]);

    // Assign keys for identification
    emojiButtonNewBall.key = "emojiButtonNewBall";
    emojiButtonNewPlatform.key = "emojiButtonNewPlatform";
    emojiButtonNewMagnet.key = "emojiButtonNewMagnet";
    emojiButtonWind.key = "emojiButtonWind";
    emojiButtonAntiGravity.key = "emojiButtonAntiGravity";
    emojiButtonMovingPlatform.key = "emojiButtonMovingPlatform";
    emojiButtonColorPicker.key = "emojiButtonColorPicker";
    emojiButtonReset.key = "emojiButtonReset";

    // Group buttons for sandbox toolbars
    sandboxEmojiButtons = [
        emojiButtonNewBall,
        emojiButtonNewPlatform,
        emojiButtonNewMagnet,
        emojiButtonWind,
        emojiButtonAntiGravity,
        emojiButtonMovingPlatform,
        emojiButtonColorPicker
    ];

    sandboxSimulationEmojiButtons = [
        emojiButtonPause,
        emojiButtonDelete,
        emojiButtonReset
    ];
}

// --- Setup Collectible Orbs ---
function setupCollectibles() {
    orbColorPicker = new Orb(700, 470, 20, imgOrbColorPicker);
    orbWind = new Orb(width * 0.5, 350, 20, imgOrbWind);
    orbAntiGravity = new Orb(600, 350, 20, imgOrbAntiGravity);
    orbMovingPlatform = new Orb(250, 320, 20, imgOrbMovingPlatform);
}