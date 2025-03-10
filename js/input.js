var pathfinderGrid = [];

// Key press handling
const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
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
    if (event.key === 'ArrowUp') keys.up = true;
    if (event.key === 'ArrowDown') keys.down = true;
    if (event.key === 'ArrowLeft') keys.left = true;
    if (event.key === 'ArrowRight') keys.right = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') keys.up = false;
    if (event.key === 'ArrowDown') keys.down = false;
    if (event.key === 'ArrowLeft') keys.left = false;
    if (event.key === 'ArrowRight') keys.right = false;
});

// Function to handle player movement
function movePlayer(dx, dy, direction) {
    let newX = player.x + dx;
    let newY = player.y + dy;
    if(direction == "NORTH"){
        player.sY = 0;
    } else if (direction == "EAST"){
        player.sY = 1 * player.sH;
    } else if (direction == "SOUTH"){
        player.sY = 2 * player.sH;
    } else if (direction == "WEST"){
        player.sY = 3 * player.sH;
    }

    if (isWalkable(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }
}