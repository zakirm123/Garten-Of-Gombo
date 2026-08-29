document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const introScreen = document.getElementById('intro-screen');
    const newGameBtn = document.getElementById('new-game-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const quitBtn = document.getElementById('quit-btn');
    const mohajushClockBtn = document.getElementById('mohajush-clock-btn');

    // Helper to catch both fast iPad taps and desktop mouse clicks 
    function setupButton(button, targetAction) {
        if (!button) return;
        button.addEventListener('click', targetAction);
        button.addEventListener('touchend', (e) => {
            e.preventDefault(); // Prevents double click layout bugs
            targetAction();
        });
    }

    // New Game transitions to Narrative overlay
    setupButton(newGameBtn, () => {
        startScreen.style.setProperty('display', 'none', 'important');
        introScreen.style.display = "flex";
    });

    setupButton(creditsBtn, () => {
        alert("GARTEN OF GOMBO - Credits:\n\nCreated by: You!\nMascot Designs: Gombo, Huge Mohajush, Zoyi Bird, Gombolenna, Captain Riddles, Stinger Mulyn.\nBuilt with GitHub & iPad 🚀");
    });

    setupButton(settingsBtn, () => {
        alert("Settings: Controls are fully optimized for iPad Touchscreens!");
    });

    setupButton(quitBtn, () => {
        alert("To quit, close this browser tab on your iPad!");
    });

    // The Magic Fix: Links directly to the isolated 3D canvas file layout window!
    setupButton(mohajushClockBtn, () => {
        window.location.href = "game.html";
    });
});
