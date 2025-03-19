var pathfinderGrid = [];

// Key press handling
const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
    pause: false,
};

var mouse = {x: 0, y: 0, hoverObjects: null};

gameCanvas.addEventListener("mousemove", (event) => {
    const rect = gameCanvas.getBoundingClientRect();
    clickX = event.clientX - rect.left;
    clickY = event.clientY - rect.top;

    //mouse.hoverObject - write a function to identify objects
})

gameCanvas.addEventListener("click", (event) => {
    const rect = gameCanvas.getBoundingClientRect();
    
    // Get mouse click coordinates relative to the canvas
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    // Write a function for clicked objects (if applicable)
    // Example: if (isClickedObject(mouse.x, mouse.y)) return;

    // If not a clicked object, start pathfinding
    player.targetX = mouse.x;
    player.targetY = mouse.y;

    // Setup pathfinding grid
    pathfinderGrid = SetupPathfindingGridData(player);

    let endTile = pixCoordToIndexIn1D(player.targetX, player.targetY);
    let startTile = pixCoordToIndexIn1D(player.x, player.y);

    //console.log("S: " + startTile + " E: " + endTile);

    startPath(endTile, player);
});




// Key listeners
document.addEventListener('keydown', (event) => {
    //console.log("keydown: "+event.key);
    if ((event.key === 'ArrowUp') || (event.key === 'w')) keys.up = true;
    if ((event.key === 'ArrowDown') || (event.key === 's')) keys.down = true;
    if ((event.key === 'ArrowLeft') || (event.key === 'a')) keys.left = true;
    if ((event.key === 'ArrowRight') || (event.key === 'd')) keys.right = true;
    if ((event.key === ' ') || 
        (event.key === 'f') ||
        (event.key === 'x') ||
        (event.key === 'z') ||
        (event.key === 'Control') ||
        (event.key === 'Shift')
        ) keys.action = true;
    if (event.key === 'p') {
        keys.pause = true;
    }
});

document.addEventListener('keyup', (event) => {
    if ((event.key === 'ArrowUp') || (event.key === 'w')) keys.up = false;
    if ((event.key === 'ArrowDown') || (event.key === 's')) keys.down = false;
    if ((event.key === 'ArrowLeft') || (event.key === 'a')) keys.left = false;
    if ((event.key === 'ArrowRight') || (event.key === 'd')) keys.right = false;
    if ((event.key === ' ') || 
        (event.key === 'f') ||
        (event.key === 'x') ||
        (event.key === 'z') ||
        (event.key === 'Control') ||
        (event.key === 'Shift')
        ) keys.action = false;
    if (event.key === 'p') {
        keys.pause = false;
    }
});

// Function to handle player movement
function movePlayer(dx, dy, direction) {
    let newX = player.x + dx;
    let newY = player.y + dy;

    let tileX = Math.floor(newX / TILE_W); // Convert pixels to grid
    let tileY = Math.floor(newY / TILE_H);

    console.log(`🚀 Moving player from (${player.x}, ${player.y}) → (${newX}, ${newY})`);
    console.log(`🎯 Checking grid position (${tileX}, ${tileY})`);

    if (isWalkable(tileY, tileX)) {
        player.x = newX;
        player.y = newY;
        console.log(`✅ Player moved to (${player.x}, ${player.y})`);
    } else {
        console.warn(`❌ Movement blocked at (${tileX}, ${tileY})`);
    }
}

