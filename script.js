// Basic Jumpscare or Movement logic for Gombo
document.addEventListener('DOMContentLoaded', () => {
    const gombo = document.querySelector('#gombo');
    
    // Make Gombo slowly drift toward the player over time
    setInterval(() => {
        let currentPos = gombo.getAttribute('position');
        if (currentPos.z < -2) {
            currentPos.z += 0.02; // Slowly creeps closer
            gombo.setAttribute('position', currentPos);
        }
    }, 50);
});
