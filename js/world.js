const TILE_W = 32;
const TILE_H = 32;
const TILE_COLS = 25;
const TILE_ROWS = 19;
const GRID_HEIGHT = TILE_H * TILE_COLS;
const GRID_WIDTH = TILE_W * TILE_ROWS; 

// Background grid (visual representation)
var backgroundGrid = [
[0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 3, 3, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
[0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// Collision grid (1 = blocked, 0 = walkable)
var collisionGrid = [];
let pathfindingGrid = Array.from({ length: GRID_HEIGHT }, () =>
    new Array(GRID_WIDTH).fill(0) // Default all tiles to walkable (0)
);

const TILE_GRASS = 0;
const TILE_WALL = 1;
const TILE_ROAD = 2;
const TILE_FLOOR = 3;
const TILE_TREE = 4;

function SetupCollisionGridFromBackground() {
    if (!backgroundGrid || backgroundGrid.length == 0) {
        console.warn("Background grid is empty or undefined!");
        return;
    }

    // Ensure collisionGrid is an array before assigning rows
    collisionGrid = new Array(TILE_ROWS).fill(null).map(() =>
        new Array(TILE_COLS).fill(null)
    );

    for (let row = 0; row < TILE_ROWS; row++) {
        for (let col = 0; col < TILE_COLS; col++) {
            let idxHere = tileCoordToIndex(col, row);

            // Explicitly assign a GridElement object
            collisionGrid[row][col] = new GridElement();
            collisionGrid[row][col].name = `${col},${row}`;
            collisionGrid[row][col].idx = idxHere;

            // Set collision based on backgroundGrid
            let tileType = backgroundGrid[row][col]; // Ensure backgroundGrid[row][col] exists
            collisionGrid[row][col].elementType = tileType;

            // Set walkability
            collisionGrid[row][col].isWalkable = (tileType !== TILE_WALL);

           // console.log(`Set tile (${col}, ${row}) to ${tileType} Walkable: ${collisionGrid[row][col].isWalkable}`);
        }
    }
}



// Function to check if a tile is walkable
function isWalkable(x, y) {
    if (!pathfindingGrid) {
        console.error("ERROR: pathfindingGrid is not yet defined!");
        return false;
    }
    let tile = pathfindingGrid[y]?.[x];
    console.log(`Checking walkability for (${x}, ${y}): Tile = ${tile}`); 
    if (!pathfindingGrid[y]) {
        console.error(`ERROR: pathfindingGrid[${y}] does not exist!`, pathfindingGrid);
        return false;
    }
    
    if (typeof pathfindingGrid[y][x] === "undefined") {
        console.error('ERROR: pathfindingGrid[${y}][${x}] is undefined!', pathfindingGrid[y]);
        return false;
    }
    
    console.log(`Checking walkability for (${x}, ${y}): Tile = ${pathfindingGrid[y][x]}`);

    if (!pathfindingGrid || !pathfindingGrid[y] || typeof pathfindingGrid[y][x] === "undefined") {
        console.error('Invalid grid lookup: (${x}, ${y})');
        return false;
    }
    
    return pathfindingGrid[y][x] == 0; // 0 means walkable
}
    
// Drawing 
let cachedBackgroundGrid = []; // Store precomputed tile properties
let backgroundNeedsUpdate = true; // Flag to track updates

function precomputeBackground() {
    cachedBackgroundGrid = []; // Reset cache
    let tileType = 0;
    for (let row = 0; row < TILE_ROWS; row++) {
        cachedBackgroundGrid[row] = []; // Initialize row
        for (let col = 0; col < TILE_COLS; col++) {
       
            // debug the array shape - this looks good now
            // console.log("Generated backgroundGrid:", backgroundGrid);
            // console.log("backgroundGrid.length (should be TILE_ROWS="+TILE_ROWS+"):", backgroundGrid.length);
            // console.log("backgroundGrid[0]?.length (should be TILE_COLS="+TILE_COLS+"):", backgroundGrid[0]?.length);

            // missing data?
            if (!backgroundGrid[row] || backgroundGrid[row][col] === undefined) {
                console.error("ERROR missing backgroundGrid data for row,col "+row+","+col);
                console.log(`backgroundGrid.length: ${backgroundGrid.length}`);
                console.log(`backgroundGrid[19]?.length: ${backgroundGrid[19]?.length}`);
            } 
            
            tileType = backgroundGrid[row][col];
            
            // Get tile properties based on connectors first
            let result = checkTileTypeForConnectors(tileType, col, row);

            // If no connector adjustments, check for randomization
            if (!result) {
                result = checkTileTypeForRandomization(tileType);
            }

            // Fallback to default if still undefined
            let { sX = 0, sY = 0 } = result || {};

            // Store computed data in the cache
            cachedBackgroundGrid[row][col] = { sX, sY, tileType };
        }
    }

    backgroundNeedsUpdate = false; // Reset update flag after computing
}

function drawBackground() {
    if (backgroundNeedsUpdate) {
        precomputeBackground(); // Only update if needed
    }

    for (let row = 0; row < TILE_ROWS; row++) {
        for (let col = 0; col < TILE_COLS; col++) {
      
            let { sX, sY, tileType } = cachedBackgroundGrid[row][col];
            drawImageTile(col, row, sX, sY, tileType);
        }
    }
}

// Call this whenever backgroundGrid changes
function updateBackground() {
    backgroundNeedsUpdate = true;
}


function checkTileTypeForConnectors(tileType, x, y) {
    if (tileType !== TILE_ROAD) return null;

    const above = y > 0 && backgroundGrid[y - 1][x] === TILE_ROAD;
    const below = y < backgroundGrid.length - 1 && backgroundGrid[y + 1][x] === TILE_ROAD;
    const left = x > 0 && backgroundGrid[y][x - 1] === TILE_ROAD;
    const right = x < backgroundGrid[0].length - 1 && backgroundGrid[y][x + 1] === TILE_ROAD;

    if (above && below) return { sX: 32 * 1, sY: 32 * 1 }; // Vertical road
    if (left && right) return { sX: 0, sY: 32 * 1 }; // Horizontal road
    if (above && right) return { sX: 32 * 0, sY: 32 * 2 }; // Turn top-right
    if (above && left) return { sX: 32 * 2, sY: 32 * 2 }; // Turn top-left
    if (below && right) return { sX: 32 * 0, sY: 32 * 0 }; // Turn bottom-right
    if (below && left) return { sX: 32 * 2, sY: 32 * 0 }; // Turn bottom-left

    return { sX: 32 * 1, sY: 32 * 1 }; // Default road tile
}

function checkTileTypeForTrees(tileType, x, y) {
    if (tileType !== TILE_TREE) return null;

    // Ensure there's enough space for a 2x2 tree
    if (
        x < backgroundGrid[0].length - 1 && 
        y < backgroundGrid.length - 1 &&
        backgroundGrid[y][x] === TILE_TREE &&
        backgroundGrid[y][x + 1] === TILE_TREE &&
        backgroundGrid[y + 1][x] === TILE_TREE &&
        backgroundGrid[y + 1][x + 1] === TILE_TREE
    ) {
        return { sX: 0, sY: 32*3 }; // Example sprite position for a tree
    }

    return null;
}

function checkTileTypeForRandomization(tileType) {
    if (tileType === TILE_GRASS) {
        let options = 9;
        let randomNum = Math.floor(Math.random() * (options + 1));
        return { sX: 32 * randomNum, sY: 0 };
    }
    if (tileType === TILE_FLOOR){
        let options = 9;
        let randomNum = Math.floor(Math.random() * (options + 1));
        return { sX: 32 * randomNum, sY: 32*2 };
    }
    return null;
}


function drawImageTile(col, row, sX, sY, tileType) {   
    let tileImage = tilePics[tileType]; // Fetch the correct image from tilePics

    if (!tileImage) {
        console.error("Invalid tileType or missing image:", tileType);
        return;
    }
    ctx.drawImage(tileImage, sX, sY, 32, 32, col * TILE_W, row * TILE_H, TILE_W, TILE_H);
}

var grid = []; // array of GridElement instances, gets initialized based on tileGrid
const NOTHING = 20;
const SOURCE = 21;
const DEST = 22;
const WALL = 23;
const VISITED = 24;
const PATH = 25;

const INFINITY_START_DISTANCE = 999999;

function tileCoordToIndex(tileCol, tileRow) {
    return (tileCol + TILE_COLS * tileRow);
}

function pixCoordToIndex(pX, pY){
	var col = Math.floor(pX/GRID_WIDTH);
	var row = Math.floor(pY/GRID_HEIGHT);
	
	return tileCoordToIndex(col, row);
}

function pixCoordToIndexIn1D(pX, pY) { 
    var col = Math.floor(pX / TILE_W);
    var row = Math.floor(pY / TILE_H);
    return row * TILE_COLS + col;
}



function drawPathingFindingTiles() {
    for (let row = 0; row < TILE_ROWS; row++) {
        for (let col = 0; col < TILE_COLS; col++) {
            collisionGrid[row][col].display();
            colorText("C: " + col + " R:" + row, col*32, row*32+10, "White");
        }
    } // end of for eachTil
} // end of drawTiles()
