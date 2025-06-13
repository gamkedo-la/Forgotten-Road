const TILE_W = 32;
const TILE_H = 32;
const TILE_COLS = 45;
const TILE_ROWS = 39;
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
const TILE_WATER_1 = 8; //GOAL to automate this tile from water
const TILE_WATER_2 = 9;//GOAL to automate this tile from water
const TILE_TREE2 = 10;
const TILE_DIRT = 11;
const TILE_GRAVES = 12;
const TILE_CRYPT_GATE = 13;
const TILE_FENCE = 14;
const TILE_LAMP = 15;

const TILE_TREASURECHEST = 88;

const TILE_GOBLIN_SPAWN = 90;
const TILE_ORC_SPAWN = 91;
const TILE_KOBOLD_SPAWN = 92;
const TILE_SKELETON_SPAWN = 93;
const TILE_WRAITH_SPAWN = 94;
const TILE_GHOUL_SPAWN = 95;
const TILE_SKELETON_KING_SPAWN = 96;

const TILE_NPC_OLD_MAN = 100;
const TILE_NPC_BLACKSMITH = 101;
const TILE_NPC_ALCHEMIST = 102;
const TILE_NPC_CHEF = 103;
const TILE_NPC_CHUCK = 104;
const TILE_NPC_MICK = 105;
const TILE_NPC_DOSDOCTORA = 106; // not implemented
const TILE_NPC_DOSDOCTORB = 107; // not implemented

var MAP_DATA = {
  fallDale: {
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
        buildingMessage:
          "You're in the blacksmith shop! You can interact with NPCs or buy items.",
        insidebuilding: false,
      },
      alchemistShop: {
        x: 32 * 18,
        y: 5 * 32,
        sX: 0,
        sY: 0,
        sW: 32 * 6,
        sH: 32 * 6,
        width: 32 * 6,
        height: 32 * 6,
        color: "rgba(9, 0, 128, 0.5)",
        image: alchemistShopPic,
        buildingMessage:
          "You're in the alchemist shop! You can interact with NPCs or buy items.",
        insidebuilding: false,
      },
    },
  },
  northForest: {
    buildings: {},
  },
  eastFields: {
    buildings: {},
  },
  graveYard: {
    buildings: {},
  },
};

// Background grids
const WORLD_MAPS = {
  fallDale: [
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 2, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [4, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0],
    [0, 1, 3, 3, 1, 1, 1, 0, 15,0, 4, 2, 2, 0,88, 0, 0, 0, 1, 3,3,  3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0,104, 0, 0, 0, 0],
    [0, 0,101,0, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 4, 0, 0, 7, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2,102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0,0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,15,0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,11,11,11,11,11,11,11, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0,11,11,11,11,11,11,11,11, 0, 1, 1, 1, 1, 1,0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 2, 0, 1, 3, 3, 3, 3, 3, 1, 0,11,11,11,11,11,11,11,11, 0, 1, 3, 3, 3, 1,0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 2, 0, 1, 3, 3, 3, 3, 3, 1, 0,11,11,11,11,11,11,11,11, 0, 1, 3, 3, 3, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 3, 3, 3, 3, 3, 1, 0,11,11,11,11,11,11,11,11, 0, 1, 3, 3, 3, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0,105, 0, 0, 0, 1, 3, 3, 3, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0,100,0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,103, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  northForest: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0,10, 0, 0,10, 0,10, 0, 0,10, 0,10, 0, 0,10, 0,10, 0, 0,10, 0,10, 0, 0,10, 0,10, 0, 0,10, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,90, 0, 0, 0, 0, 0,90, 0, 0, 0, 0, 0,90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0,90,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10, 0, 0,10, 0,0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0,90, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0,10, 0, 0,10, 0,10, 0, 0,10, 0,10, 0, 2,10, 0,10, 0, 0,10, 0,10, 0, 0,10, 0,10, 0, 0,10, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 2, 2,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0,90, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 2, 2, 2, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 2, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10,0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 2, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  eastFields: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,106,107,0,0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12,0, 4, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  southForest: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  graveYard: [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,93, 0,93, 0,93, 0,93, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0,12, 0,12, 0,12, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0,14,14,14,13,14,14,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0,12, 0,12, 0,12, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0,12, 0,12, 0,12, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,93, 0,93, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0,12, 0,12, 0,12, 0, 0, 0, 5, 5, 5, 5, 5],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,93, 0,93, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0,12, 0,12, 0,12, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8],
  ]
};


var currentMapKey = "fallDale";
var backgroundGrid = WORLD_MAPS[currentMapKey];
fillInMissingMapdata(); // NOW!!! before game starts

var collisionGrid = [];
let pathfindingGrid = Array.from({ length: GRID_HEIGHT }, () =>
  new Array(GRID_WIDTH).fill(0)
);

let backgroundNeedsUpdate = true;
let cachedBackgroundGrid = [];

function SetupCollisionGridFromBackground() {
  if (!backgroundGrid || backgroundGrid.length === 0 || backgroundGrid[0].length === 0 ) {
    console.log("ERROR: backgroundGrid is broken:",backgroundGrid);
    return;
  }

  collisionGrid = new Array(TILE_ROWS)
    .fill(null)
    .map(() => new Array(TILE_COLS).fill(null));

  const unwalkableTiles = [
    TILE_WALL,
    TILE_CRYPT_GATE,
    TILE_CLIFF,
    TILE_TREE,
    TILE_TREE2,
    TILE_WATER,
    TILE_WATER_1,
    TILE_WATER_2,
  ];

  for (let row = 0; row < TILE_ROWS; row++) {
    for (let col = 0; col < TILE_COLS; col++) {
      const idxHere = tileCoordToIndex(col, row);
      let tileType = 0; // default if data is missing
      if (!backgroundGrid[row] || backgroundGrid[row][col]) {
        console.log("ERROR - missing data for backgroundGrid["+row+","+col+"] - filling with zeroes");
      } else {
        tileType = backgroundGrid[row][col];
      }

      collisionGrid[row][col] = new GridElement();
      collisionGrid[row][col].name = `${col},${row}`;
      collisionGrid[row][col].idx = idxHere;
      collisionGrid[row][col].elementType = tileType;
      collisionGrid[row][col].isWalkable = !unwalkableTiles.includes(tileType);
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

function checkTileTypeForEntitySpawners(tileType, col, row) {
    if (tileType === TILE_TREASURECHEST) {
        let x = col * TILE_W;
        let y = row * TILE_H;
        console.log("spawning a treasure chest at "+x+","+y);
        // spawn an entity here!
        let e = new TreasureChest(x,y);
        npcs.push(e); // fixme: this isn't really an NPC but it works
        // replace this ground tile with grass
        tileType = TILE_GRASS; 
    }
    return tileType;
}

function precomputeBackground() {
  cachedBackgroundGrid = [];

  for (let row = 0; row < TILE_ROWS; row++) {
    cachedBackgroundGrid[row] = [];

    for (let col = 0; col < TILE_COLS; col++) {
      let tileType = 0; // default
      if (!backgroundGrid[row] || !backgroundGrid[row][col]) {
        console.log("missing backgroundGrid data - ignoring...");
      } else {
        tileType = backgroundGrid[row][col];
      }
      
      // spawn entities (such as treasure) and
      // then transform in a regular TILE_GRASS tile
      tileType = checkTileTypeForEntitySpawners(tileType, col, row);
      
      // used to select which sprite to use for roads, etc
      const result =
        checkTileTypeForConnectors(tileType, col, row) ||
        checkTileTypeForRandomization(tileType) ||
        {};
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

  if(tileType === TILE_GRASS) decorateTile(col*TILE_W, row*TILE_H);

  // NOTE: these larger-than-tile-size special props
  // need to be offset left and up or else the next tile
  // will draw on top of it (grass etc)
  if (tileType === TILE_LAMP) {
    // draw the ground tile
    context.drawImage(tilePics[TILE_GRASS],0,0,32,32,col*TILE_W,row*TILE_H,TILE_W,TILE_H);
    // draw the lamp over top of it
    context.drawImage(tileImage, col * TILE_W - 52, row * TILE_H - 32);
  } else if (tileType === TILE_TREE) {
    // draw the ground tile
    context.drawImage(tilePics[TILE_GRASS],0,0,32,32,col*TILE_W,row*TILE_H,TILE_W,TILE_H);
    // add a shadow just for fun
    context.globalAlpha = 0.5;
    context.drawImage(shadowPic,col * TILE_W - 32, row * TILE_H+4);
    context.globalAlpha = 1; 
    // draw the tree over top of it
    context.drawImage(tileImage, col * TILE_W - 32, row * TILE_H - 40);
  } else if (tileType === TILE_TREE2) {
    // Draw ground first
    context.drawImage(tilePics[TILE_GRASS],0,0,32,32,col*TILE_W,row*TILE_H,TILE_W,TILE_H);
      // shadow (shifted like the tree)
    context.globalAlpha = 0.5;
    context.drawImage(
      shadowPic,
      col * TILE_W - 16, // left by 16
      row * TILE_H - 16  // up by 16
    );
    context.globalAlpha = 1;
  
    context.drawImage(
      tilePics[TILE_GRASS],
      0, 96,  // sX, sY in grass.png
      64, 96,  // sW, sH
      col * TILE_W - 16, // same X offset
      row * TILE_H - 64, // same Y offset
      64, 96
    );        
  } else {
    context.drawImage(
      tileImage,
      sX,
      sY,
      32,
      32,
      col * TILE_W,
      row * TILE_H,
      TILE_W,
      TILE_H
    );
  }
}

function checkTileTypeForConnectors(tileType, x, y) {
  if (tileType === TILE_ROAD) {
    const above = y > 0 && backgroundGrid[y - 1][x] === TILE_ROAD;
    const below =
      y < backgroundGrid.length - 1 && backgroundGrid[y + 1][x] === TILE_ROAD;
    const left = x > 0 && backgroundGrid[y][x - 1] === TILE_ROAD;
    const right =
      x < backgroundGrid[0].length - 1 &&
      backgroundGrid[y][x + 1] === TILE_ROAD;

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
    const rightIsGrass =
      x < backgroundGrid[0].length - 1 &&
      backgroundGrid[y][x + 1] === TILE_GRASS;

    if (leftIsGrass && !rightIsGrass) {
      return { sX: 0, sY: 0 }; // opens to grass on the left
    } else if (!leftIsGrass && rightIsGrass) {
      return { sX: 64, sY: 0 }; // opens to grass on the right
    } else {
      return { sX: 32, sY: 0 }; // default center cliff
    }
  }
  
  if (tileType === TILE_DIRT) {
    const up = y > 0 && backgroundGrid[y - 1][x] === TILE_GRASS;
    const down = y < backgroundGrid.length - 1 && backgroundGrid[y + 1][x] === TILE_GRASS;
    const left = x > 0 && backgroundGrid[y][x - 1] === TILE_GRASS;
    const right = x < backgroundGrid[0].length - 1 && backgroundGrid[y][x + 1] === TILE_GRASS;
  
    // Determine sprite based on surroundings
    let tileIndex = 4; // default center tile (no grass touching)
    if (up && !down && !left && !right) tileIndex = 1;
    else if (!up && down && !left && !right) tileIndex = 7;
    else if (!up && !down && left && !right) tileIndex = 3;
    else if (!up && !down && !left && right) tileIndex = 5;
    else if (up && down && !left && !right) tileIndex = 4; // vertical bridge
    else if (!up && !down && left && right) tileIndex = 4; // horizontal bridge
    else if (up && left) tileIndex = 0;
    else if (up && right) tileIndex = 2;
    else if (down && left) tileIndex = 6;
    else if (down && right) tileIndex = 8;
  
    const sX = (tileIndex % 3) * 32;
    const sY = Math.floor(tileIndex / 3) * 32;
    return { sX, sY };
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

  if (
    tileType === TILE_WATER ||
    tileType === TILE_WATER_1 ||
    tileType === TILE_WATER_2
  ) {
    const options = 1; // col
    const randCol = Math.floor(Math.random() * options);
  
    let sY = 0;
    if (tileType === TILE_WATER_1) sY = 32;
    else if (tileType === TILE_WATER_2) sY = 64;
  
    return {
      sX: 32 * randCol,
      sY: sY
    };
  }
  

  if (tileType === TILE_PRESSURE_PLATE) {
    return { sX: 64, sY: 96 };
  }
  return null;
}

function tileCoordToIndex(col, row) {
  return col + TILE_COLS * row;
}

const TILE_ENTITY_MAP = {
  [TILE_GOBLIN_SPAWN]: ({ x, y }) => createMonster({
    name: "Goblin", x, y, damage: 5, maxHealth: 30, type: "melee"
  }),
  [TILE_ORC_SPAWN]: ({ x, y }) => createMonster({
    name: "Orc", x, y, damage: 10, maxHealth: 40, type: "melee", size: 40
  }),
  [TILE_NPC_OLD_MAN]: ({ x, y }) => new NPC("Old Man", x, y, [
    "The forest holds many secrets...",
    "Sometimes I still hear the wind whisper his name.",
    "I wasn't always this old, you know.",
    "We lost something out there..."
  ], null, {
    day: { active: true, destination: { x, y }, dialogueSet: "day" },
    night: { active: false, destination: toXY(x, y), dialogueSet: "night" }
  }),
  [TILE_NPC_BLACKSMITH]: ({ x, y }) => new NPC("Blacksmith", x, y, [
    "Need something forged?", "I can sharpen that blade.", "Strong arms make strong steel."
  ], null, {
    day: { active: true, destination: { x, y }, dialogueSet: "day" },
    night: { active: false, destination: toXY(x, y), dialogueSet: "night" }
  }),
  [TILE_NPC_ALCHEMIST]: ({ x, y }) => new NPC("Alchemist", x, y, [
    "Potions, elixirs, and ancient remedies!",
    "Tread carefully — not every potion is for the faint-hearted.",
    "Knowledge is power... and danger."
  ], null, {
    day: { active: true, destination: { x, y }, dialogueSet: "day" },
    night: { active: false, destination: toXY(x, y), dialogueSet: "night" }
  }),
  [TILE_NPC_CHEF]: ({ x, y }) => new NPC("Chef Gormondo", x, y, [
    "Please help me make a royal omelette.",
    "I am missing a few key ingredients.",
    "As chef, my duty requires I remain here.",
    "All I need are eggs and mushrooms.",
  ], null, {
    day: { active: true, destination: { x, y }, dialogueSet: "day" },
      night: { active: false, destination: toXY(x, y), dialogueSet: "night" }
  }),
  [TILE_NPC_CHUCK]: ({ x, y }) => new NPC("Chuck", x, y, [
    "I miss the days of adventuring.",
    "Those skeletons came to life!",
    "I can't believe I lost my sword.",
  ], null, {
    day: { active: true, destination: { x, y }, dialogueSet: "day" },
    night: { active: false, destination: toXY(x, y), dialogueSet: "night" }
  }),
  [TILE_NPC_MICK]: ({ x, y }) => new NPC("Mick", x, y, [
    "A hard day's work on the farm.",
    "I wish I had mushrooms for Chef",
  ], null, {
    day: { active: true, destination: { x, y }, dialogueSet: "day" },
      night: { active: false, destination: toXY(x, y), dialogueSet: "night" }
  }),
  [TILE_NPC_DOSDOCTORA]: ({ x, y }) => new NPC("First Doctor", x, y, [
    "The melody of the cosmos speaks to me.",
    "If only I could sing it.",
  ], null, {
    day: { active: true, destination: { x, y }, dialogueSet: "day" },
    night: { active: false, destination: toXY(x, y), dialogueSet: "night" }
  }),
  [TILE_NPC_DOSDOCTORB]: ({ x, y }) => new NPC("Second Doctor", x, y, [
    "We had to know the inner workings.",
    "It didn't feel a thing.",
  ], null, {
    day: { active: true, destination: { x, y }, dialogueSet: "day" },
    night: { active: false, destination: toXY(x, y), dialogueSet: "night" }
  }),
};

const toXY = (col, row) => ({ x: col * TILE_W, y: row * TILE_H })

function spawnEntitiesFromTiles() {
  const grid = backgroundGrid;
  enemies.length = 0;
  npcs.length = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const tile = grid[row][col];
      const spawnFunc = TILE_ENTITY_MAP[tile];
      if (spawnFunc) {
        const x = col * TILE_W;
        const y = row * TILE_H;
        const entity = spawnFunc({ x, y });

        if (entity instanceof Monster) {
          enemies.push(entity);
        } else if (entity instanceof NPC) {
          npcs.push(entity);
        }
      }
    }
  }
}

function unlockCryptGate() {
  for (let row = 0; row < TILE_ROWS; row++) {
    for (let col = 0; col < TILE_COLS; col++) {
      if (backgroundGrid[row][col] === TILE_CRYPT_GATE) {
        backgroundGrid[row][col] = TILE_ROAD;
        collisionGrid[row][col].isWalkable = true;
      }
    }
  }
  console.log("Crypt gate opened!");
}

// some of the arrays are the wrong size: this ensures that code
// which iterates through map data doesn't encounter any undefineds
function fillInMissingMapdata() {

    for (r=0; r<TILE_ROWS; r++) {
        
        // missing row?
        if (WORLD_MAPS.fallDale[r]==undefined) WORLD_MAPS.fallDale[r] = [];
        if (WORLD_MAPS.eastFields[r]==undefined) WORLD_MAPS.eastFields[r] = [];
        if (WORLD_MAPS.graveYard[r]==undefined) WORLD_MAPS.graveYard[r] = [];
        if (WORLD_MAPS.southForest[r]==undefined) WORLD_MAPS.southForest[r] = [];
        
        for (c=0; c<TILE_COLS; c++) {

            // missing col?
            if (WORLD_MAPS.fallDale[r][c]==undefined) WORLD_MAPS.fallDale[r][c] = 0;
            if (WORLD_MAPS.eastFields[r][c]==undefined) WORLD_MAPS.eastFields[r][c] = 0;
            if (WORLD_MAPS.graveYard[r][c]==undefined) WORLD_MAPS.graveYard[r][c] = 0;
            if (WORLD_MAPS.southForest[r][c]==undefined) WORLD_MAPS.southForest[r][c] = 0;

        }
    }
}
