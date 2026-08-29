// --- 1. BOOTSTRAP SYSTEM (Runs instantly when page loads) ---
document.addEventListener('DOMContentLoaded', () => {
    // Hook up Menu UI Buttons safely
    const startScreen = document.getElementById('start-screen');
    const newGameBtn = document.getElementById('new-game-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const quitBtn = document.getElementById('quit-btn');
    const introScreen = document.getElementById('intro-screen');
    const mohajushClockBtn = document.getElementById('mohajush-clock-btn');

    // Universal helper to read iPad taps and desktop clicks smoothly
    function attachTouchAction(element, action) {
        if (!element) return;
        
        // Mobile finger tap
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            action();
        });
        // Desktop backup click
        element.addEventListener('click', (e) => {
            action();
        });
    }

    // --- BUTTON TRIGGER FUNCTIONS ---
    
    function startNewGame() {
        if (startScreen) startScreen.style.setProperty('display', 'none', 'important');
        if (introScreen) introScreen.style.display = "flex";
    }

    function showCredits() {
        alert("GARTEN OF GOMBO - Credits:\n\nCreated by: You!\nMascot Designs: Gombo, Huge Mohajush, Zoyi Bird, Gombolenna, Captain Riddles, Stinger Mulyn.\nBuilt with GitHub & iPad 🚀");
    }

    function openSettings() {
        alert("Settings: Controls are fully optimized for iPad Touchscreens!");
    }

    function quitGame() {
        alert("To quit, close this Safari/Chrome browser tab on your iPad!");
    }

    // Bind touch trackers to menu items immediately
    attachTouchAction(newGameBtn, startNewGame);
    attachTouchAction(creditsBtn, showCredits);
    attachTouchAction(settingsBtn, openSettings);
    attachTouchAction(quitBtn, quitGame);

    // Bind the final Huge Mohajush clock advancement trigger
    attachTouchAction(mohajushClockBtn, () => {
        if (introScreen) introScreen.style.setProperty('display', 'none', 'important');
        
        const gameStage = document.getElementById('game-stage');
        if (gameStage) gameStage.style.display = "block";

        // Defer launching heavy scripts until AFTER user is safely past the menus
        loadGameEngine();
    });
});

// --- 2. DEFERRED HORROR GAME ENGINE LAUNCHER ---
function loadGameEngine() {
    // Inject A-Frame 3D library files into document headers
    const aframeScript = document.createElement('script');
    aframeScript.src = "https://aframe.io";
    
    aframeScript.onload = () => {
        // Construct the 3D map environment models dynamically
        build3DDaycareMap();
        
        // Safely initiate mobile touchscreen joystick variables
        if (typeof nipplejs !== 'undefined') {
            startJoystickTracking();
        } else {
            // Backup fallback loop to wait for joystick library scripts if delayed
            setTimeout(startJoystickTracking, 200);
        }
    };
    document.head.appendChild(aframeScript);
}

// Global variables for movement engine tracking
let moveX = 0, moveZ = 0;
const speed = 0.12;

function build3DDaycareMap() {
    const container = document.getElementById('renderer-container');
    if (!container) return;

    container.innerHTML = `
        <a-scene embedded loading-screen="enabled: false">
            <a-sky color="#05060f"></a-sky>
            <a-ambient-light color="#777788"></a-ambient-light>
            
            
                
                    <a-light type="spot" color="#fff" intensity="2.5" distance="25" angle="45"></a-light>
                    <a-cursor color="#ff0000" scale="0.5 0.5 0.5"></a-cursor>
                
            

            <a-plane position="0 0 0" rotation="-90 0 0" width="60" height="60" color="#3c3f4a"></a-plane>
            
            <!-- Daycare Walls -->
            <a-box position="0 2.5 -30" width="60" height="5" depth="1" color="#5c3f2e"></a-box>
            <a-box position="0 2.5 30" width="60" height="5" depth="1" color="#5c3f2e"></a-box>
            <a-box position="-30 2.5 0" width="1" height="5" depth="60" color="#5c3f2e"></a-box>
            <a-box position="30 2.5 0" width="1" height="5" depth="60" color="#5c3f2e"></a-box>

            <!-- Drone Interaction Target Console Button Box -->
            <a-box id="puzzle-button" position="0 2 -2" width="0.8" height="0.8" depth="0.2" color="#ff0000"></a-box>

            <!-- Drone Device Object Asset representation -->
            
                <a-box width="0.6" height="0.3" depth="0.6" color="#ffcc00"></a-box>
                <a-sphere position="0 0 0.3" radius="0.1" color="#fff"></a-sphere>
            

            <!-- Mascot Character Models (Horns & Stitches) -->
            
                <a-box width="2" height="3.5" depth="1.8" color="#e62e2e"></a-box>
                <a-sphere position="-0.4 1 1" radius="0.2" color="#fff"></a-sphere>
                <a-sphere position="-0.4 1 1.1" radius="0.05" color="#000"></a-sphere>
                <a-sphere position="0.4 1 1" radius="0.2" color="#fff"></a-sphere>
                <a-sphere position="0.4 1 1.1" radius="0.05" color="#000"></a-sphere>
                <a-cone position="-0.7 1.8 0" radius-bottom="0.15" height="0.8" color="#222" rotation="0 0 15"></a-cone>
                <a-cone position="0.7 1.8 0" radius-bottom="0.15" height="0.8" color="#222" rotation="0 0 -15"></a-cone>
                <a-cone position="-0.75 2.2 0" radius-bottom="0.2" height="0.6" color="#ffff1a" rotation="0 0 15"></a-cone>
                <a-cone position="0.75 2.2 0" radius-bottom="0.2" height="0.6" color="#1affff" rotation="0 0 -15"></a-cone>
                <a-box position="0 0 -0.92" width="0.1" height="2.5" depth="0.05" color="#111"></a-box>
            
        </a-scene>
    `;
    
    // Fire up the tracking framework tick loop calculation frames
    requestAnimationFrame(gameLoopTick);
}

function startJoystickTracking() {
    const joystickZone = document.getElementById('joystick-zone');
    if (!joystickZone || typeof nipplejs === 'undefined') return;

    const manager = nipplejs.create({
        zone: joystickZone,
        mode: 'static',
        position: { left: '60px', bottom: '60px' },
        color: 'white',
        size: 100
    });

    manager.on('move', (evt, data) => {
        if (data.vector) {
            moveX = data.vector.x * speed;
            moveZ = -data.vector.y * speed; 
        }
    });
    manager.on('end', () => { moveX = 0; moveZ = 0; });
    
    // Turn on supporting sub-puzzles interface loops
    initDroneAndQuizSystems();
}

function initDroneAndQuizSystems() {
    const summonBtn = document.getElementById('drone-summon-btn');
    const commandBtn = document.getElementById('drone-click-btn');
    const quizBox = document.getElementById('quiz-ui-box');
    let droneActive = false;

    if (summonBtn) {
        summonBtn.addEventListener('click', () => {
            const player = document.querySelector('#player');
            const drone = document.querySelector('#player-drone');
            if (player && drone) {
                let pPos = player.getAttribute('position');
                drone.setAttribute('position', {x: pPos.x, y: 2.2, z: pPos.z - 2});
                droneActive = true;
            }
        });
    }

    if (commandBtn) {
        commandBtn.addEventListener('click', () => {
            const drone = document.querySelector('#player-drone');
            if (drone && droneActive) {
                drone.setAttribute('animation', 'property: position; to: 0 2 -1.5; dur: 1500; easing: easeOutQuad');
                setTimeout(() => { if (quizBox) quizBox.style.display = "block"; }, 1600);
            }
        });
    }

    document.querySelectorAll('.quiz-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let color = btn.getAttribute('data-color');
            if (color === "red") {
                if (quizBox) quizBox.style.display = "none";
                alert("CORRECT! Gombo is Red (Case 6). Path unlocked!");
                const gombo = document.querySelector('#gombo');
                if (gombo) gombo.setAttribute('position', '0 0 -12');
            } else {
                alert("WRONG! Gombo is angry!");
            }
        });
    });
}

function gameLoopTick() {
    const player = document.querySelector('#player');
    if (player && (moveX !== 0 || moveZ !== 0)) {
        let position = player.getAttribute('position');
        let cameraEntity = player.querySelector('[camera]');
        let rotation = cameraEntity ? cameraEntity.getAttribute('rotation') : {y: 0};
        
        let angle = (rotation.y * Math.PI) / 180;
        let currentX = position.x + (moveX * Math.cos(angle) + moveZ * Math.sin(angle));
        let currentZ = position.z + (-moveX * Math.sin(angle) + moveZ * Math.cos(angle));

        if (Math.abs(currentX) < 28 && Math.abs(currentZ) < 28) {
            player.setAttribute('position', { x: currentX, y: position.y, z: currentZ });
        }
    }
    requestAnimationFrame(gameLoopTick);
}
