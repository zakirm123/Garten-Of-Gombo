document.addEventListener('DOMContentLoaded', () => {
    const player = document.querySelector('#player');
    const gombo = document.querySelector('#gombo');
    const zoyi = document.querySelector('#zoyibird');
    const joystickZone = document.getElementById('joystick-zone');
    const eggScore = document.getElementById('egg-score');
    const uiOverlay = document.getElementById('ui-overlay');
    const emergencyBtn = document.getElementById('emergency-btn');
    const achievement = document.getElementById('achievement-toast');

    let moveX = 0, moveZ = 0;
    const speed = 0.14; 
    let eggsHandheld = 0;
    let eggsFed = 0;
    let zoyiIsChasing = false;
    let zoyiFell = false;

    // Mobile Thumb Joystick
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

    // Handle Emergency Action Event Trigger
    emergencyBtn.addEventListener('touchstart', () => {
        if(zoyiIsChasing && !zoyiFell) {
            zoyiFell = true;
            zoyiIsChasing = false;
            emergencyBtn.style.display = "none";
            uiOverlay.innerHTML = "<span style='color:#00ff66;'>Zoyi missed and fell into the Ball Pit abyss!</span>";
            
            // Drop Zoyi model down out of view
            zoyi.setAttribute('animation', 'property: position; to: 0 -10 -15; dur: 1000; easing: linear');
            
            // Show custom trophy toast setup
            achievement.style.display = "block";
            setTimeout(() => { achievement.style.display = "none"; }, 5000);
        }
    });

    function tick() {
        // Player Position Movement Mapping
        if (moveX !== 0 || moveZ !== 0) {
            let position = player.getAttribute('position');
            let rotation = player.querySelector('a-entity[camera]').getAttribute('rotation');
            let angle = (rotation.y * Math.PI) / 180;
            let currentX = position.x + (moveX * Math.cos(angle) + moveZ * Math.sin(angle));
            let currentZ = position.z + (-moveX * Math.sin(angle) + moveZ * Math.cos(angle));

            if (Math.abs(currentX) < 29 && Math.abs(currentZ) < 29) {
                player.setAttribute('position', { x: currentX, y: position.y, z: currentZ });
            }
        }

        let playerPos = player.getAttribute('position');

        // Colliding & Collecting Nest Eggs
        document.querySelectorAll('.egg').forEach(egg => {
            let eggPos = egg.getAttribute('position');
            let dist = Math.sqrt(Math.pow(playerPos.x - eggPos.x, 2) + Math.pow(playerPos.z - eggPos.z, 2));
            if (dist < 1.5) {
                egg.parentNode.removeChild(egg);
                eggsHandheld++;
                eggScore.innerText = eggsHandheld;
                uiOverlay.innerText = `Eggs Collected: ${eggsHandheld}/7. Go feed Zoyi Bird!`;
            }
        });

        // Interacting with Zoyi Bird's Mouth to deliver items
        let zoyiPos = zoyi.getAttribute('position');
        let zoyiDist = Math.sqrt(Math.pow(playerPos.x - zoyiPos.x, 2) + Math.pow(playerPos.z - zoyiPos.z, 2));

        if (zoyiDist < 2.5 && eggsHandheld > 0 && !zoyiIsChasing) {
            eggsFed += eggsHandheld;
            eggsHandheld = 0;
            eggScore.innerText = eggsFed;
            
            if (eggsFed >= 7) {
                zoyiIsChasing = true;
                emergencyBtn.style.display = "block";
                uiOverlay.innerHTML = "<span style='color:orange;'>Zoyi got aggressive! RUN TO THE EMERGENCY BUTTON!</span>";
            }
        }

        // Active Boss Chase State Tracking
        if (zoyiIsChasing && !zoyiFell) {
            let zdx = playerPos.x - zoyiPos.x;
            let zdz = playerPos.z - zoyiPos.z;
            let distance = Math.sqrt(zdx*zdx + zdz*zdz);
            
            zoyiPos.x += (zdx / distance) * 0.06;
            zoyiPos.z += (zdz / distance) * 0.06;
            zoyi.setAttribute('position', zoyiPos);

            if(distance < 1.6) {
                uiOverlay.innerHTML = "<span style='color:red;'>ZOYI BIRD FEASTED ON YOU! GAME OVER</span>";
            }
        }

        // Standard Main Stalker Mascot (Gombo) Ambient Movement Tracking
        let gomboPos = gombo.getAttribute('position');
        let gdx = playerPos.x - gomboPos.x;
        let gdz = playerPos.z - gomboPos.z;
        let gomboDist = Math.sqrt(gdx * gdx + gdz * gdz);

        if (gomboDist > 2.0 && !zoyiIsChasing) {
            gomboPos.x += (gdx / gomboDist) * 0.025;
            gomboPos.z += (gdz / gomboDist) * 0.025;
            gombo.setAttribute('position', gomboPos);
        }

        requestAnimationFrame(tick);
    }
    tick();
});
