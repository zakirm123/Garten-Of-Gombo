document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const joystickZone = document.getElementById('joystick-zone');
    const uiOverlay = document.getElementById('ui-overlay');
    
    const player = document.querySelector('#player');
    const gombo = document.querySelector('#gombo');
    const zoyi = document.querySelector('#zoyibird');
    const eggScore = document.getElementById('egg-score');
    const emergencyBtn = document.getElementById('emergency-btn');
    const achievement = document.getElementById('achievement-toast');

    let moveX = 0, moveZ = 0;
    const speed = 0.12; 
    let eggsHandheld = 0;
    let eggsFed = 0;
    let zoyiIsChasing = false;
    let zoyiFell = false;
    let gameActive = false;

    function enterGame() {
        if (gameActive) return; // Prevent multiple initializations
        
        // Remove screen using display hidden cleanly
        startScreen.style.setProperty('display', 'none', 'important');
        joystickZone.style.display = "block";
        uiOverlay.style.display = "block";
        gameActive = true;
        
        // Refresh 3D environment engine state instantly
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 50);
    }

    // Force touch interactions down cleanly across layout layers
    startBtn.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        enterGame();
    }, { passive: true });

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enterGame();
    });

    // Mobile Joystick Setup
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

    emergencyBtn.addEventListener('click', () => {
        if(zoyiIsChasing && !zoyiFell) {
            zoyiFell = true;
            zoyiIsChasing = false;
            emergencyBtn.style.display = "none";
            uiOverlay.innerHTML = "<span style='color:#00ff66;'>Zoyi missed and fell into the Ball Pit!</span>";
            zoyi.setAttribute('position', '0 -15 -10');
            achievement.style.display = "block";
            setTimeout(() => { achievement.style.display = "none"; }, 5000);
        }
    });

    function tick() {
        if (!gameActive) {
            requestAnimationFrame(tick);
            return;
        }

        if (moveX !== 0 || moveZ !== 0) {
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

        let playerPos = player.getAttribute('position');

        // Eggs Interactivity Tracking Framework
        document.querySelectorAll('.egg').forEach(egg => {
            let eggPos = egg.getAttribute('position');
            let dist = Math.sqrt(Math.pow(playerPos.x - eggPos.x, 2) + Math.pow(playerPos.z - eggPos.z, 2));
            if (dist < 1.6) {
                egg.parentNode.removeChild(egg);
                eggsHandheld++;
                if (eggScore) eggScore.innerText = eggsHandheld;
                uiOverlay.innerText = `Eggs Handheld: ${eggsHandheld}/7. Feed Zoyi Bird!`;
            }
        });

        // Deliver Action Check Context
        let zoyiPos = zoyi.getAttribute('position');
        let zoyiDist = Math.sqrt(Math.pow(playerPos.x - zoyiPos.x, 2) + Math.pow(playerPos.z - zoyiPos.z, 2));

        if (zoyiDist < 2.5 && eggsHandheld > 0 && !zoyiIsChasing) {
            eggsFed += eggsHandheld;
            eggsHandheld = 0;
            if (eggScore) eggScore.innerText = eggsFed;
            
            if (eggsFed >= 7) {
                zoyiIsChasing = true;
                emergencyBtn.style.display = "block";
                uiOverlay.innerHTML = "<span style='color:#ff941a;'>ZOYI IS ANGRY! RUN TO EMERGENCY BUTTON!</span>";
            }
        }

        if (zoyiIsChasing && !zoyiFell) {
            let zdx = playerPos.x - zoyiPos.x;
            let zdz = playerPos.z - zoyiPos.z;
            let distance = Math.sqrt(zdx*zdx + zdz*zdz);
            
            zoyiPos.x += (zdx / distance) * 0.055;
            zoyiPos.z += (zdz / distance) * 0.055;
            zoyi.setAttribute('position', zoyiPos);

            if(distance < 1.5) {
                uiOverlay.innerHTML = "<span style='color:red;'>GAME OVER: ZOYI CAUGHT YOU!</span>";
            }
        }

        requestAnimationFrame(tick);
    }
    tick();
});
