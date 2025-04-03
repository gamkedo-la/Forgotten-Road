var canvas, ctx, collisionCanvas, collisionCtx;
const enemies = [];
const temp_ui_elements = [];
const PLAYER_MOVE_SPEED = 4;
let lastFrameTime = performance.now();

let paused = false;
let pressedPause = false;
let turnPathFindingDrawingOn = false;
let insidebuilding = false;
let projectiles = [];
let worldItems = [];

// Player
const player = new Player("Hero", 300, 500, 30, 10, 1, 50);
console.log(player.name, "has", player.health, "HP and", player.gold, "gold.");

// ========================
// Building Setup
// ========================
const gameState = {
  buildings: {
    blacksmithShop: {
      x: 32,
      y: 0,
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
      x: 32 * 18,
      y: 5 * 32,
      sX: 0,
      sY: 32 * 6,
      sW: 32 * 6,
      sH: 32 * 6,
      width: 32 * 6,
      height: 32 * 6,
      color: "rgba(9, 0, 128, 0.5)",
      image: alchemistShopPic,
      buildingMessage: "You're in the alchemist shop! You can interact with NPCs or buy items.",
      insidebuilding: false,
    },
  },
};


// Initialization
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  //setupCollisionCanvas();
  loadImages();
};

function imageLoadingDoneSoStartGame() {
  console.log("All images downloaded. Starting game!");
  SetupCollisionGridFromBackground();
  spawnMonstersFromMap();
  requestAnimationFrame(drawGameFrame);
}

// Game Loop Functions
function drawGameFrame(currentTime) {
  var deltaTime = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  check_gamepad();
  updateGameState(deltaTime);
  renderGameFrame(deltaTime);

  requestAnimationFrame(drawGameFrame);
}

function updateGameState(deltaTime) {
  handlePauseInput();
  if (paused) return;

  handlePlayerMovement();
  updateEnemiesAndProjectiles(deltaTime);
  handleItemPickups();
  checkBuildingCollisions();
  updateUI(deltaTime);
}

function renderGameFrame(deltaTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.drawImage(bgCanvas,0,0);

  drawBackground();
  if (turnPathFindingDrawingOn) drawPathingFindingTiles();
  drawBuildings();

  player.draw(deltaTime);

  worldItems.forEach(item => drawWorldItem(item));
  enemies.filter(e => !e.isDead).forEach(e => e.draw(deltaTime));
  projectiles.forEach(p => p.draw(ctx));
  drawBackpackUI(ctx, player);

  drawGoldUI();
  temp_ui_elements.forEach(ui => ui.draw());
  if (paused) drawPauseOverlay();

  player.drawHearts();
}

// Utility & Helpers
function handlePauseInput() {
  if (keys.pause && !pressedPause) {
    paused = !paused;
    pressedPause = true;
  }
  if (!keys.pause) pressedPause = false;
}

function handlePlayerMovement() {
  if (keys.up || gamepad.up) movePlayer(0, -PLAYER_MOVE_SPEED, "NORTH");
  if (keys.down || gamepad.down) movePlayer(0, PLAYER_MOVE_SPEED, "SOUTH");
  if (keys.left || gamepad.left) movePlayer(-PLAYER_MOVE_SPEED, 0, "WEST");
  if (keys.right || gamepad.right) movePlayer(PLAYER_MOVE_SPEED, 0, "EAST");
  player.updateMovement();
}

function updateEnemiesAndProjectiles(deltaTime) {
  enemies.forEach(e => updateEnemy(e, player));
  enemies.forEach(e => e.fireAtPlayerIfInRange(player, projectiles, collisionGrid));
  projectiles.forEach(p => p.update(collisionGrid, enemies));
  projectiles = projectiles.filter(p => p.isActive);
}

function handleItemPickups() {
  for (let i = worldItems.length - 1; i >= 0; i--) {
    const item = worldItems[i];
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < item.pickupRadius) {
      if (item.use === "heal" && player.currentHP < player.maxHP) {
        player.heal(item.amount);
      } else {
        player.addItemToInventory(item);
      }
      worldItems.splice(i, 1);
    }
  }
}

function updateUI(deltaTime) {
  temp_ui_elements.forEach(e => e.update(deltaTime));
}

function drawGoldUI() {
  colorRect(5, 40, 110, 30, "rgba(0, 0, 0, 0.5)");
  drawTextWithShadow(`Gold: ${player.gold}`, 15, 60, UI_TEXT_STYLES.DEFAULT.textColor, UI_TEXT_STYLES.DEFAULT.font, UI_TEXT_STYLES.DEFAULT.align);
}

function drawPauseOverlay() {
  colorRect(0, 0, canvas.width, canvas.height, "#000000AA");
  ctx.textAlign = "center";
  colorText("PAUSED", canvas.width / 2, canvas.height / 2, "white", 16);
  ctx.textAlign = "start";
}

function drawWorldItem(item) {
  if (item.sprite instanceof Image && item.sprite.complete) {
    ctx.drawImage(item.sprite, item.x, item.y, 32, 32);
  } else {
    ctx.fillStyle = "orange";
    ctx.fillRect(item.x, item.y, 32, 32);
  }
}

function drawBuildings() {
  for (let key in gameState.buildings) {
    const b = gameState.buildings[key];
    ctx.drawImage(b.image, b.sX, b.sY, b.sW, b.sH, b.x, b.y, b.width, b.height);
  }
}

function checkBuildingCollisions() {
  for (let key in gameState.buildings) {
    checkCollision(player, gameState.buildings[key], gameState.buildings[key].buildingMessage);
  }
}

function checkCollision(character, building, message) {
  if (
    character._x < building.x + building.width &&
    character._x + character.width > building.x &&
    character._y < building.y + building.height &&
    character._y + character.height > building.y
  ) {
    building.sX = building.width;
    building.insidebuilding = true;
  } else {
    building.sX = 0;
    building.insidebuilding = false;
  }
}

function isCollisionAt(x, y) {
  const pixel = collisionCtx.getImageData(x, y, 1, 1).data;
  return pixel[0] === 255 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] > 0;
}

function dist(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}
