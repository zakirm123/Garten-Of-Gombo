window.addEventListener('load', () => {
    // Make sure elements exist before applying logic
    const player = document.querySelector('#player');
    const gombo = document.querySelector('#gombo');
    const zoyi = document.querySelector('#zoyibird');
    const joystickZone = document.getElementById('joystick-zone');
    const eggScore = document.getElementById('egg-score');
    const uiOverlay = document.getElementById('ui-overlay');
    const emergencyBtn = document.getElementById('emergency-btn');
    const achievement = document.getElementById('achievement-toast');

    if (!player || !gombo || !zoyi || !joystickZone) return;

    let moveX = 0, moveZ = 0;
    const speed = 0.12; 
    let eggsHandheld = 0;
    let eggsFed = 0;
    let zoyiIsChasing = false;
    let zoyiFell = false;

    // Mobile Virtual Joystick Setup
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

    emergencyBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
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

        // Target Eggs Logic Loop
        document.querySelectorAll('.egg').forEach(egg => {
            let eggPos = egg.getAttribute('position');
            let dist = Math.sqrt(Math.pow(playerPos.x - eggPos.x, 2) + Math.pow(playerPos.z - eggPos.z, 2));
            if (dist < 1.6) {
                egg.parentNode.removeChild(egg);
                eggsHandheld++;
                if (eggScore) eggScore.innerText = eggsHandheld;
                uiOverlay.innerText = `Eggs Handheld: ${eggsHandheld}/7. Go to Zoyi Bird's Beak!`;
            }
        });

        // Interactive feeding logic 
        let zoyiPos = zoyi.getAttribute('position');
        let zoyiDist = Math.sqrt(Math.pow(playerPos.x - zoyiPos.x, 2) + Math.pow(playerPos.z - zoyiPos.z, 2));

        if (zoyiDist < 2.5 && eggsHandheld > 0 && !zoyiIsChasing) {
            eggsFed += eggsHandheld;
            eggsHandheld = 0;
            if (eggScore) eggScore.innerText = eggsFed;
            
            if (eggsFed >= 7) {
                zoyiIsChasing = true;
                emergencyBtn.style.display = "block";
                uiOverlay.innerHTML = "<span style='color:#ff941a;'>ZOYI IS ANGRY! HEAD TO THE EMERGENCY BUTTON!</span>";
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
