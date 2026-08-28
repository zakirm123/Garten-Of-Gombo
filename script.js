document.addEventListener('DOMContentLoaded', () => {
    // UI Interface Hooks
    const startScreen = document.getElementById('start-screen');
    const newGameBtn = document.getElementById('new-game-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const quitBtn = document.getElementById('quit-btn');
    const introScreen = document.getElementById('intro-screen');
    const mohajushClockBtn = document.getElementById('mohajush-clock-btn');
    const gameStage = document.getElementById('game-stage');
    const rendererContainer = document.getElementById('renderer-container');

    let moveX = 0, moveZ = 0;
    const speed = 0.12;
    let eggsHandheld = 0;
    let eggsFed = 0;
    let zoyiIsChasing = false;
    let zoyiFell = false;
    let mainLoopRunning = false;

    // --- UNIVERSAL IPAD TOUCH HELPER FUNCTION ---
    // This safely listens for iPad finger taps and instantly triggers your actions
    function bindButton(buttonElement, actionFunction) {
        if (!buttonElement) return;
        
        // Listen for mobile touch taps
        buttonElement.addEventListener('touchend', (e) => {
            e.preventDefault(); // Stops iPad zoom bugs
            actionFunction();
        });
        
        // Backup listener for standard desktop clicks
        buttonElement.addEventListener('click', (e) => {
            actionFunction();
        });
    }

    // --- BUTTON ACTIONS ---

    // 1. New Game Action
    function triggerNewGame() {
        startScreen.style.setProperty('display', 'none', 'important');
        introScreen.style.display = "flex";
    }

    // 2. Credits Action
    function showCredits() {
        alert("GARTEN OF GOMBO - Credits:\n\nCreated by: You!\nMascot Designs: Gombo, Huge Mohajush, Zoyi Bird, Gombolenna, Captain Riddles, Stinger Mulyn.\nBuilt with GitHub & iPad 🚀");
    }

    // 3. Settings Action
    function openSettings() {
        alert("Settings: Controls are optimized for iPad Touchscreens!");
    }

    // 4. Quit Action
    function quitGame() {
        alert("To quit, simply close this browser tab on your iPad!");
    }

    // --- BIND ALL MENU BUTTONS ---
    bindButton(newGameBtn, triggerNewGame);
    bindButton(creditsBtn, showCredits);
    bindButton(settingsBtn, openSettings);
    bindButton(quitBtn, quitGame);


    // --- STEP 2: TAP THE HUGE MOHAJUSH CLOCK ICON TO ADVANCE TIME ---
    function startActiveDaycare() {
        introScreen.style.setProperty('display', 'none', 'important');
        gameStage.style.display = "block";

        // Inject the heavy 3D A-Frame libraries into browser execution cleanly *AFTER* interaction
        const aframeScript = document.createElement('script');
        aframeScript.src = "https://aframe.io";
        
        aframeScript.onload = () => {
            build3DEnvironmentScene();
            initializeJoystickEngine();
            mainLoopRunning = true;
            tick();
        };
        document.head.appendChild(aframeScript);
    }

    // Bind the Mohajush Clock button using our universal touch helper
    bindButton(mohajushClockBtn, startActiveDaycare);


    // --- STEP 3: CONSTRUCT CORE HORROR ENGINE ENVIRONMENT METRICS ---
    function build3DEnvironmentScene() {
        rendererContainer.innerHTML = `
            <a-scene embedded loading-screen="enabled: false">
                <a-sky color="#05060f"></a-sky>
                <a-ambient-light color="#777788"></a-ambient-light>
                
                
                    
                        <a-light type="spot" color="#fff" intensity="2.5" distance="25" angle="45"></a-light>
                        <a-cursor color="#ff0000" scale="0.5 0.5 0.5"></a-cursor>
                    
                

                <a-plane position="0 0 0" rotation="-90 0 0" width="60" height="60" color="#3c3f4a"></a-plane>
                
                <!-- Room Boundaries -->
                <a-box position="0 2.5 -30" width="60" height="5" depth="1" color="#5c3f2e"></a-box>
                <a-box position="0 2.5 30" width="60" height="5" depth="1" color="#5c3f2e"></a-box>
                <a-box position="-30 2.5 0" width="1" height="5" depth="60" color="#5c3f2e"></a-box>
                <a-box position="30 2.5 0" width="1" height="5" depth="60" color="#5c3f2e"></a-box>

                <!-- Partitions and Ballpit layout zones -->
                <a-box position="-15 2.5 5" width="1" height="5" depth="30" color="#6a44b5"></a-box>
                <a-box position="15 2.5 5" width="1" height="5" depth="30" color="#6a44b5"></a-box>
                <a-plane id="ballpit" position="0 0.05 -10" rotation="-90 0 0" width="16" height="12" color="#1a66b8"></a-plane>

                <!-- Targets Collectibles -->
                <a-sphere class="egg" position="-5 0.5 8" radius="0.4" color="#fffce6"></a-sphere>
                <a-sphere class="egg" position="8 0.5 10" radius="0.4" color="#fffce6"></a-sphere>
                <a-sphere class="egg" position="-18 0.5 -8" radius="0.4" color="#fffce6"></a-sphere>
                <a-sphere class="egg" position="18 0.5 -15" radius="0.4" color="#fffce6"></a-sphere>
                <a-sphere class="egg" position="0 0.5 20" radius="0.4" color="#fffce6"></a-sphere>

                <!-- GOMBO Mascot Monster Model Instance (With Horns & Stitches on Back) -->
                
                    <a-box width="2" height="3.5" depth="1.8" color="#e62e2e"></a-box>
                    <a-sphere position="-0.4 1 1" radius="0.2" color="#fff"></a-sphere>
                    <a-sphere position="-0.4 1 1.1" radius="0.05" color="#000"></a-sphere>
                    <a-sphere position="0.4 1 1" radius="0.2" color="#fff"></a-sphere>
                    <a-sphere position="0.4 1 1.1" radius="0.05" color="#000"></a-sphere>
                    <a-cone position="-0.7 1.8 0" radius-bottom="0.15" height="0.8" color="#222" rotation="0 0 15"></a-cone>
                    <a-cone position="0.7 1.8 0" radius-bottom="0.15" height="0.8" color="#222" rotation="0 0 -15"></a-cone>
                    <a-cone position="-0.75 2.2 0" radius-bottom="0.2" height="0.6" color="#ffff1a" rotation="0 0 15"></a-cone>
                    <a-cone position="0.75 2.2 0" radius-bottom="0.2" height="0.6" color="#1affff" rotation="0 0 -15"></a-cone>
                    <!-- Back Stitches -->
                    <a-box position="0 0 -0.92" width="0.1" height="2.5" depth="0.05" color="#111"></a-box>
                

                <!-- ZOYI BIRD Base Model -->
                
                    <a-cone radius-bottom="1.2" height="3" color="#ffcbd7"></a-cone>
                    <a-box id="zoyi-mouth" position="0 0.8 0.8" width="1.2" height="0.6" depth="0.6" color="#ffaa1a"></a-box>
                    <a-sphere position="-0.3 1.3 0.8" radius="0.15" color="#fff"></a-sphere>
                    <a-sphere position="0.3 1.3 0.8" radius="0.15" color="#fff"></a-sphere>
                    <!-- Back Stitches -->
                    <a-box position="0 0 -0.8" width="0.08" height="2" depth="0.05" color="#222"></a-box>
                
            </a-scene>
        `;
    }

    // --- STEP 4: SEPARATE MOBILE TOUCH JOYSTICK CONTROLS INITIALIZATION ---
    function initializeJoystickEngine() {
        const manager = nipplejs.create({
            zone: joystickZone, mode: 'static',
            position: { left: '60px', bottom: '60px' },
            color: 'white', size: 100
        });

        manager.on('move', (evt, data) => {
            if (data.vector) {
                moveX = data.vector.x * speed;
                moveZ = -data.vector.y * speed; 
            }
        });
        manager.on('end', () => { moveX = 0; moveZ = 0; });
    }

    // --- STEP 5: RUNTIME FRAME ANIMATION TICK ENGINE ---
    function tick() {
        if (!mainLoopRunning) return;

        const player = document.querySelector('#player');
        const gombo = document.querySelector('#gombo');
        const zoyi = document.querySelector('#zoyibird');
        const eggScore = document.getElementById('egg-score');
        const uiOverlay = document.getElementById('ui-overlay');

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

        if (player) {
            let playerPos = player.getAttribute('position');

            // Pick up Eggs
            document.querySelectorAll('.egg').forEach(egg => {
                let eggPos = egg.getAttribute('position');
                let dist = Math.sqrt(Math.pow(playerPos.x - eggPos.x, 2) + Math.pow(playerPos.z - eggPos.z, 2));
                if (dist < 1.6) {
                    egg.parentNode.removeChild(egg);
                    eggsHandheld++;
                    if (eggScore) eggScore.innerText = eggsHandheld;
                }
            });

            // Gombo AI tracking loop
            if (gombo) {
                let gomboPos = gombo.getAttribute('position');
             let gdx = playerPos.x - gomboPos.x;let gdz = playerPos.z - gomboPos.z;let gomboDist = Math.sqrt(gdx * gdx + gdz * gdz);if (gomboDist > 2.0) {gomboPos.x += (gdx / gomboDist) * 0.02;gomboPos.z += (gdz / gomboDist) * 0.02;gombo.setAttribute('position', gomboPos);}}}requestAnimationFrame(tick);}});   
