document.addEventListener('DOMContentLoaded', () => {
    const player = document.querySelector('#player');
    const gombo = document.querySelector('#gombo');
    const joystickZone = document.getElementById('joystick-zone');

    let moveX = 0;
    let moveZ = 0;
    const speed = 0.08; // Adjust walking speed here

    // Create the visual joystick
    const manager = nipplejs.create({
        zone: joystickZone,
        mode: 'static',
        position: { left: '60px', bottom: '60px' },
        color: 'white',
        size: 100
    });

    // Track joystick movements
    manager.on('move', (evt, data) => {
        if (data.vector) {
            // Map the joystick angle to player direction
            moveX = data.vector.x * speed;
            moveZ = -data.vector.y * speed; 
        }
    });

    // Stop moving when finger lifts up
    manager.on('end', () => {
        moveX = 0;
        moveZ = 0;
    });

    // Game loop running every frame
    function tick() {
        if (moveX !== 0 || moveZ !== 0) {
            let position = player.getAttribute('position');
            let rotation = player.querySelector('a-entity[camera]').getAttribute('rotation');

            // Calculate movement relative to where the camera is facing
            let angle = (rotation.y * Math.PI) / 180;
            let currentX = position.x + (moveX * Math.cos(angle) + moveZ * Math.sin(angle));
            let currentZ = position.z + (-moveX * Math.sin(angle) + moveZ * Math.cos(angle));

            // Boundary checks to stay in the room
            if (Math.abs(currentX) < 19 && Math.abs(currentZ) < 19) {
                player.setAttribute('position', { x: currentX, y: position.y, z: currentZ });
            }
        }

        // --- GOMBO CHASE LOGIC ---
        let playerPos = player.getAttribute('position');
        let gomboPos = gombo.getAttribute('position');

        // Gombo calculates direction toward player
        let dx = playerPos.x - gomboPos.x;
        let dz = playerPos.z - gomboPos.z;
        let distance = Math.sqrt(dx * dx + dz * dz);

        if (distance > 1.5) {
            // Move Gombo closer to player slowly
            gomboPos.x += (dx / distance) * 0.02;
            gomboPos.z += (dz / distance) * 0.02;
            gombo.setAttribute('position', gomboPos);
        } else {
            // Jumpscare condition reached!
            document.getElementById('ui-overlay').innerHTML = "<span style='color:red; font-weight:bold;'>GOMBO CAUGHT YOU!</span>";
        }

        requestAnimationFrame(tick);
    }

    tick();
});
