(function() {
    // Secure Global Window Scoping to prevent iOS tracking dropouts
    window.GomboEngine = {
        moveX: 0,
        moveZ: 0,
        speed: 0.12,
        eggsHandheld: 0,
        eggsFed: 0,
        zoyiIsChasing: false,
        zoyiFell: false,
        droneActive: false,
        mainLoopRunning: false,

        triggerNewGame: function() {
            document.getElementById('start-screen').style.setProperty('display', 'none', 'important');
            document.getElementById('intro-screen').style.display = "flex";
        },

        showCredits: function() {
            alert("GARTEN OF GOMBO - Credits:\n\nCreated by: You!\nMascot Designs: Gombo, Huge Mohajush, Zoyi Bird, Gombolenna, Captain Riddles, Stinger Mulyn.\nBuilt with GitHub & iPad 🚀");
        },

        showSettings: function() {
            alert("Settings: Controls are fully optimized for iPad Touchscreens!");
        },

        showQuit: function() {
            alert("To quit, close this browser tab on your iPad!");
        },

        startActiveDaycare: function() {
            document.getElementById('intro-screen').style.setProperty('display', 'none', 'important');
            document.getElementById('game-stage').style.display = "block";

            // Dynamically load the heavy 3D library only after menus are closed
            const aframeScript = document.createElement('script');
            aframeScript.src = "https://aframe.io";
            
            aframeScript.onload = () => {
                window.GomboEngine.build3DDaycareMap();
                window.GomboEngine.startJoystickTracking();
                window.GomboEngine.mainLoopRunning = true;
                window.GomboEngine.tickLoop();
            };
            document.head.appendChild(aframeScript);
        },

        build3DDaycareMap: function() {
            const container = document.getElementById('renderer-container');
            if (!container) return;

            container.innerHTML = `
                <a-scene embedded loading-screen="enabled: false">
                    <a-sky color="#05060f"></a-sky>
                    <a-ambient-light color="#777788"></a-ambient-light>
                    
                    
                        
                            <a-light type="spot" color="#fff" intensity="2.5" distance="25" angle="45"></a-light>
                            <a-cursor color="#ff0000" scale="0.5 0.5 0.5"></a-cursor>
                        
                    

                    <a-plane position="0 0 0" rotation="-90 0 0" width="60" height="60" color="#3c3f4a"></a-plane>
                    
                    <!-- Boundaries -->
                    <a-box position="0 2.5 -30" width="60" height="5" depth="1" color="#5c3f2e"></a-box>
                    <a-box position="0 2.5 30" width="60" height="5" depth="1" color="#5c3f2e"></a-box>
                    <a-box position="-30 2.5 0" width="1" height="5" depth="60" color="#5c3f2e"></a-box>
                    <a-box position="30 2.5 0" width="1" height="5" depth="60" color="#5c3f2e"></a-box>

                    <a-box id="puzzle-button" position="0 2 -2" width="0.8" height="0.8" depth="0.2" color="#ff0000"></a-box>

                    
                        <a-box width="0.6" height="0.3" depth="0.6" color="#ffcc00"></a-box>
                        <a-sphere position="0 0 0.3" radius="0.1" color="#fff"></a-sphere>
                    

                    <!-- Mascot: GOMBO (Horns & Stitches) -->
                    
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
        },

        startJoystickTracking: function() {
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
                    window.GomboEngine.moveX = data.vector.x * window.GomboEngine.speed;
                    window.GomboEngine.moveZ = -data.vector.y * window.GomboEngine.speed; 
                }
            });
            manager.on('end', () => { 
                window.GomboEngine.moveX = 0; 
                window.GomboEngine.moveZ = 0; 
            });
        },

        summonDrone: function() {
            const player = document.querySelector('#player');
            const drone = document.querySelector('#player-drone');
            if (player && drone) {
                let pPos = player.getAttribute('position');
                drone.setAttribute('position', {x: pPos.x, y: 2.2, z: pPos.z - 2});
                window.GomboEngine.droneActive = true;
            }
        },

        commandDrone: function() {
            const drone = document.querySelector('#player-drone');
            if (drone && window.GomboEngine.droneActive) {
                drone.setAttribute('animation', 'property: position; to: 0 2 -1.5; dur: 1500; easing: easeOutQuad');
                setTimeout(() => { 
                    document.getElementById('quiz-ui-box').style.display = "block"; 
                }, 1600);
            }
        },

        checkQuiz: function(color) {
            if (color === "red") {
                document.getElementById('quiz-ui-box').style.display = "none";
                alert("CORRECT! Gombo is Red. Path unlocked!");
                const gombo = document.querySelector('#gombo');
                if (gombo) gombo.setAttribute('position', '0 0 -12');
            } else {
                alert("WRONG! Gombo is angry!");
            }
        },

        tickLoop: function() {
            if (!window.GomboEngine.mainLoopRunning) return;

            const player = document.querySelector('#player');
            let mx = window.GomboEngine.moveX;
            let mz = window.GomboEngine.moveZ;

            if (player && (mx !== 0 || mz !== 0)) {
                let position = player.getAttribute('position');
                let cameraEntity = player.querySelector('[camera]');
                let rotation = cameraEntity ? cameraEntity.getAttribute('rotation') : {y: 0};
                
                let angle = (rotation.y * Math.PI) / 180;
                let currentX = position.x + (mx * Math.cos(angle) + mz * Math.sin(angle));
                let currentZ = position.z + (-mx * Math.sin(angle) + mz * Math.cos(angle));

                if (Math.abs(currentX) < 28 && Math.abs(currentZ) < 28) {
                    player.setAttribute('position', { x: currentX, y: position.y, z: currentZ });
                }
            }
            requestAnimationFrame(window.GomboEngine.tickLoop);
        }
    };
})();
