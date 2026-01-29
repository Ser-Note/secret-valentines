
const allElements = document.querySelectorAll('*');

let curTheme = getTheme();

// Add theme class to all elements
allElements.forEach(el => {
    el.classList.add(curTheme);
});

// #region Flower Theme Features
// Add flower petals falling effect
function setValentinesTheme() {
    createFallingEffect('❤️', 30, 30, 80);
}
// #endregion

// region makes code calapsable


// #region Winter Theme Features
// Snowflake animation function
function createFallingEffect(content, size, amount, speedMult) {
    // #region container init
    let snowContainer = document.getElementById('winterSnowContainer');
    if (!snowContainer) {
        snowContainer = document.createElement('div');
        snowContainer.id = 'winterSnowContainer';
        document.body.appendChild(snowContainer);
    }
    snowContainer.style.position = 'fixed';
    snowContainer.style.top = '0';
    snowContainer.style.left = '0';
    snowContainer.style.width = '100vw';
    snowContainer.style.height = '100vh';
    snowContainer.style.pointerEvents = 'none';
    snowContainer.style.zIndex = '1200';
    snowContainer.style.display = 'block';
    // #endregion
    // Create a fixed number of snowflakes that animate via CSS for continuous effect
    for (let i = 0; i < amount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = content;
        // random horizontal start
        snowflake.style.left = (Math.random() * 100) + '%';
        // random size
        snowflake.style.fontSize = (Math.random() * size + 8) + 'px';
        // opacity
        snowflake.style.opacity = (Math.random() * 0.6 + 0.3).toString();
        // random animation duration and delay (negative delay scatters positions immediately)
        const duration = (6 + Math.random() * speedMult).toFixed(2) + 's';
        const delay = (-Math.random() * 12).toFixed(2) + 's';
        snowflake.style.animationDuration = duration;
        snowflake.style.animationDelay = delay;
        snowContainer.appendChild(snowflake);
    }
}

function setWinterTheme() {
    // Ensure winter background layer exists
    let bg = document.getElementById('winterBackground');
    if (!bg) {
        bg = document.createElement('div');
        bg.id = 'winterBackground';
        document.body.appendChild(bg);
    }

    // Add snowflake animation
    createFallingEffect('❄');

    // Show polar bear mascot if it exists
    const winterBear = document.getElementById('winterBear');
    if (!winterBear) {
        return; // Element doesn't exist, exit gracefully
    }

    winterBear.style.display = 'block';

    // Animate polar bear hand waving
    winterBear.addEventListener('load', () => {
        const svgDoc = winterBear.contentDocument;
        if (!svgDoc) return; // Ensure content document is available
        const hand = svgDoc.getElementById('hand');
        if (hand) {
            let angle = 0;
            setInterval(() => {
                angle += 0.15; // slightly faster
                const wave = Math.sin(angle) * 20; // larger movement
                hand.style.transformOrigin = 'center';
                hand.style.transform = `translateY(${wave}px) rotate(${wave * 0.5}deg)`;
            }, 50);
        }
    });
}
// #endregion



// get theme per month
function getTheme() {
    let theme;
    switch (1) {
        case 1:
            theme = "Valentines";
            setValentinesTheme();
            break;
    }

    return theme;
}