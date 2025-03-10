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
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    //write a function for clicked objects

    //If not a clicked objecct, start pathfinding
    player.targetX = clickX;
    player.targetY = clickY;
    pathfinderGrid = SetupPathfindingGridData(player)
})



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