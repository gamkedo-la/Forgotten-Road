const TILE_W = 32;
const TILE_H = 32;
const TILE_COLS = 25;
const TILE_ROWS = 19;
const GRID_HEIGHT = TILE_H * TILE_COLS;
const GRID_WIDTH = TILE_W * TILE_ROWS;

const TILE_GRASS = 0;
const TILE_WALL = 1;
const TILE_ROAD = 2;
const TILE_FLOOR = 3;
const TILE_TREE = 4;
const TILE_WATER = 5;
const TILE_CLIFF = 6;
const TILE_PRESSURE_PLATE = 7;

const TILE_GOBLIN_SPAWN = 90;
const TILE_ORC_SPAWN = 91;
const TILE_KOBOLD_SPAWN = 92;
const TILE_SKELETON_SPAWN = 93;
const TILE_WRAITH_SPAWN = 94;
const TILE_GHOUL_SPAWN = 95;

const MAP_DATA = {
  fallDale: {
    npcs: [
      new NPC("Old Man", 12 * TILE_W, 8 * TILE_H, [
        "The forest holds many secrets...",
        "Sometimes I still hear the wind whisper his name.",
        "I wasn't always this old, you know.",
        "We lost something out there...",
      ]),
    ],
    buildings: {
      blacksmithShop: {
        x: 32,
        y: 1 * 32,
        sX: 0,
        sY: 0,
        sW: 32 * 6,
        sH: 32 * 6,
        width: 32 * 6,
        height: 32 * 6,
        color: "rgba(9, 0, 128, 0.5)",
        image: blacksmithShopPic,
        buildingMessage: "You're in the blacksmith shop! You can interact with NPCs or buy items.",
        insidebuilding: false,
      },
      alchemistShop: {
        x: 32*18,
        y: 5 * 32,
        sX: 0,
        sY: 0,
        sW: 32 * 6,
        sH: 32 * 6,
        width: 32 * 6,
        height: 32 * 6,
        color: "rgba(9, 0, 128, 0.5)",
        image: alchemistShopPic,
        buildingMessage: "You're in the alchemist shop! You can interact with NPCs or buy items.",
        insidebuilding: false,
      },
    }
  },
  northForest: {
    npcs: [],
    buildings: {}
  },
  eastFields: {
    npcs: [],
    buildings: {}
  }
};

// Background grids
const WOLRD_MAPS = {
  fallDale: [
      [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 2, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0],
      [4, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 3, 3, 3, 3, 1, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 3, 3, 1, 1, 1, 0, 0, 0, 4, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
      [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 1, 3, 3, 3, 3, 1, 0],
      [0, 0, 0, 0, 4, 4, 0, 0, 7, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
  ],
  northForest: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  eastFields: [ 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 3, 3, 1, 1, 1, 0, 0, 0, 4, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 4, 4, 0, 0, 7, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0]
  ],
  southForest: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0],
    [4, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 3, 3, 1, 1, 1, 0, 0, 0, 4, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 1, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 4, 4, 0, 0, 7, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
  ],

}

var currentMapKey = "fallDale";
var backgroundGrid = WOLRD_MAPS[currentMapKey];

var collisionGrid = [];
let pathfindingGrid = Array.from({ length: GRID_HEIGHT }, () =>
  new Array(GRID_WIDTH).fill(0)
);

let backgroundNeedsUpdate = true;
let cachedBackgroundGrid = [];

function SetupCollisionGridFromBackground() {
  if (!backgroundGrid || backgroundGrid.length === 0) return;

  collisionGrid = new Array(TILE_ROWS).fill(null).map(() =>
    new Array(TILE_COLS).fill(null)
  );

  for (let row = 0; row < TILE_ROWS; row++) {
    for (let col = 0; col < TILE_COLS; col++) {
      const idxHere = tileCoordToIndex(col, row);
      const tileType = backgroundGrid[row][col];

      collisionGrid[row][col] = new GridElement();
      collisionGrid[row][col].name = `${col},${row}`;
      collisionGrid[row][col].idx = idxHere;
      collisionGrid[row][col].elementType = tileType;
      collisionGrid[row][col].isWalkable = (tileType !== TILE_WALL &&
                                            tileType !== TILE_CLIFF);
    }
  }
}

function getMonsterSpawnTiles() {
  const spawns = [];

  for (let row = 0; row < backgroundGrid.length; row++) {
    for (let col = 0; col < backgroundGrid[row].length; col++) {
      const tile = backgroundGrid[row][col];
      if (
        tile === TILE_GOBLIN_SPAWN ||
        tile === TILE_ORC_SPAWN ||
        tile === TILE_KOBOLD_SPAWN ||
        tile === TILE_SKELETON_SPAWN ||
        tile === TILE_WRAITH_SPAWN ||
        tile === TILE_GHOUL_SPAWN
      ) {
        spawns.push({ tile, col, row });
        backgroundGrid[row][col] = TILE_GRASS;
      }
    }
  }

  return spawns;
}

function precomputeBackground() {
  cachedBackgroundGrid = [];

  for (let row = 0; row < TILE_ROWS; row++) {
    cachedBackgroundGrid[row] = [];

    for (let col = 0; col < TILE_COLS; col++) {
      const tileType = backgroundGrid[row][col];
      const result = checkTileTypeForConnectors(tileType, col, row) || checkTileTypeForRandomization(tileType) || {};
      const { sX = 0, sY = 0 } = result;
      cachedBackgroundGrid[row][col] = { sX, sY, tileType };
    }
  }

  backgroundNeedsUpdate = false;
}

function drawBackground(context = ctx) {
  if (backgroundNeedsUpdate) precomputeBackground();

  for (let row = 0; row < TILE_ROWS; row++) {
    for (let col = 0; col < TILE_COLS; col++) {
      const { sX, sY, tileType } = cachedBackgroundGrid[row][col];
      drawImageTile(col, row, sX, sY, tileType, context);
    }
  }
}

function updateBackground() {
  backgroundNeedsUpdate = true;
}

function drawImageTile(col, row, sX, sY, tileType, context = ctx) {
  const tileImage = tilePics[tileType];
  if (!tileImage) return;

  if (tileType === TILE_TREE) {
    // draw the ground tile
    context.drawImage(tilePics[TILE_GRASS], 0, 0, 32, 32, col * TILE_W, row * TILE_H, TILE_W, TILE_H);
    // draw the tree over top of it
    context.drawImage(tileImage, col * TILE_W - 32, row * TILE_H - 32);
  } else {
    context.drawImage(tileImage, sX, sY, 32, 32, col * TILE_W, row * TILE_H, TILE_W, TILE_H);
  }
}

function checkTileTypeForConnectors(tileType, x, y) {
  if (tileType === TILE_ROAD) {
    const above = y > 0 && backgroundGrid[y - 1][x] === TILE_ROAD;
    const below = y < backgroundGrid.length - 1 && backgroundGrid[y + 1][x] === TILE_ROAD;
    const left = x > 0 && backgroundGrid[y][x - 1] === TILE_ROAD;
    const right = x < backgroundGrid[0].length - 1 && backgroundGrid[y][x + 1] === TILE_ROAD;

    if (above && below) return { sX: 32, sY: 32 };
    if (left && right) return { sX: 0, sY: 32 };
    if (above && right) return { sX: 0, sY: 64 };
    if (above && left) return { sX: 64, sY: 64 };
    if (below && right) return { sX: 0, sY: 0 };
    if (below && left) return { sX: 64, sY: 0 };

    return { sX: 32, sY: 32 }; 
  }

  if (tileType === TILE_CLIFF) {
    const leftIsGrass = x > 0 && backgroundGrid[y][x - 1] === TILE_GRASS;
    const rightIsGrass = x < backgroundGrid[0].length - 1 && backgroundGrid[y][x + 1] === TILE_GRASS;

    if (leftIsGrass && !rightIsGrass) {
      return { sX: 0, sY: 0 }; // opens to grass on the left
    } else if (!leftIsGrass && rightIsGrass) {
      return { sX: 64, sY: 0 }; // opens to grass on the right
    } else {
      return { sX: 32, sY: 0 }; // default center cliff
    }
  }
  return null;
}

function checkTileTypeForRandomization(tileType) {
  if (tileType === TILE_GRASS) {
    const options = 9;
    const rand = Math.floor(Math.random() * (options + 1));
    return { sX: 32 * rand, sY: 0 };
  }
  if (tileType === TILE_FLOOR) {
    const options = 9;
    const rand = Math.floor(Math.random() * (options + 1));
    return { sX: 32 * rand, sY: 64 };
  }

  if (tileType === TILE_PRESSURE_PLATE) {
    return { sX: 64, sY: 96 };
  }
  return null;
}

function tileCoordToIndex(col, row) {
  return col + TILE_COLS * row;
}
