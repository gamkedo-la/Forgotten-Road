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
    
    let clickX = Math.floor((event.clientX - rect.left) / TILE_W);
    let clickY = Math.floor((event.clientY - rect.top) / TILE_H);

    let playerX = Math.floor(player.x / TILE_W);
    let playerY = Math.floor(player.y / TILE_H);

    console.log(`Player at (${playerX}, ${playerY})`);
    console.log(`Target at (${clickX}, ${clickY})`);

    if (!player.isMoving) {
        const path = findPath(playerX, playerY, clickX, clickY, collisionGrid);
        if (path.length > 0) {
            player.setPath(path);
            console.log("Path found:", path.map(p => `(${p.x}, ${p.y})`).join(" → "));
        } else {
            console.warn("No valid path found!");
        }
    } else {
        console.log("Player is already moving.");
    }
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

    if (event.key === 'f') {
        player.staffAttack(enemies);
        player.state = "attacking";
        player.currentAttackFrame = 0;
        player.attackTimer = 0;
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
    if (event.key === 'r') {
        const projX = player.x + TILE_W / 4;
        const projY = player.y + TILE_H / 4;
        const bolt = new Projectile(projX, projY, player.facing);
        projectiles.push(bolt);
        console.log("Fired crossbow bolt!");
    }
});

// Function to handle player movement
function movePlayer(dx, dy, direction) {
    let newX = player.x + dx;
    let newY = player.y + dy;

    let tileX = Math.floor(newX / TILE_W); // Convert pixels to grid
    let tileY = Math.floor(newY / TILE_H);

    console.log(`Moving player from (${player.x}, ${player.y}) → (${newX}, ${newY})`);
    console.log(`Checking grid position (${tileX}, ${tileY})`);

    if (isWalkable(tileY, tileX)) {
        player.x = newX;
        player.y = newY;
        console.log(`Player moved to (${player.x}, ${player.y})`);
    } else {
        console.warn(`Movement blocked at (${tileX}, ${tileY})`);
    }

    const directionFacingMap = {
        NORTH: "up",
        SOUTH: "down",
        EAST: "right",
        WEST: "left",
    };
    player.facing = directionFacingMap[direction];
}

