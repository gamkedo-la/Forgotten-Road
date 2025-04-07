var canvas, ctx, collisionCanvas, collisionCtx;
var playState = "playing"; 
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
camera.followTarget = player;

// Building Setup
const gameState = {
  buildings: {
    blacksmithShop: {
      x: 32,
      y: 1*32,
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

// Enemy Factory and Spawning
function createMonster({
  name,
  x,
  y,
  size = 32,
  damage,
  maxHealth,
  type,
  state = BEHAVIOR_STATES.IDLE,
  patrolZone = null,
  image = null,
  extra = {}
}) {
  var monster = new Monster(name, x, y, size, damage, maxHealth, type);
  monster.maxHealth = maxHealth;
  monster.health = maxHealth;
  monster.state = state;

  if (patrolZone) monster.placeAtRandomPosition(patrolZone);
  if (image) monster.image = image;
  Object.assign(monster, extra);

  if (state === BEHAVIOR_STATES.PATROL || state === BEHAVIOR_STATES.WANDER) {
    assignDefaultPatrol(monster);
  }

  return monster;
}

function spawnMonstersFromMap() {
    const spawns = getMonsterSpawnTiles();

    spawns.forEach(({ tile, col, row }) => {
      const x = col * TILE_W;
      const y = row * TILE_H;
      let monster;

      if (tile === TILE_GOBLIN_SPAWN) {
        monster = createMonster({ name: "Goblin", x, y, damage: 5, maxHealth: 30, type: "melee" });
      } else if (tile === TILE_KOBOLD_SPAWN) {
        monster = createMonster({ name: "Kobold", x, y, damage: 5, maxHealth: 20, type: "ranged", state: BEHAVIOR_STATES.WANDER });
      } else if (tile === TILE_ORC_SPAWN) {
        monster = createMonster({ name: "Orc", x, y, damage: 10, maxHealth: 40, type: "melee", size: 40 });
      } else if (tile === TILE_SKELETON_SPAWN) {
        monster = createMonster({
          name: "Skeleton", x, y, damage: 2, maxHealth: 20, type: "melee", size: 40,
          state: BEHAVIOR_STATES.PATROL,
          extra: { canResurrect: true, isUndead: true, immuneToRanged: true }
        });
      } else if (tile === TILE_WRAITH_SPAWN) {
        monster = createMonster({
          name: "Wraith", x, y, damage: 5, maxHealth: 20, type: "melee", state: BEHAVIOR_STATES.CHASE, image: wraithPic
        });
      } else if (tile === TILE_GHOUL_SPAWN){
        for (let i = 0; i < 5; i++) {
          const offsetX = Math.random() * 32 * 2;
          const offsetY = Math.random() * 32 * 2;
          const ghoul = createMonster({
            name: "Ghoul", 
            x: x + offsetX, 
            y: y + offsetY, 
            damage: 3, 
            maxHealth: 15, 
            type: "melee", 
            state: BEHAVIOR_STATES.CHASE, 
            image: ghoulPic  
          });
          enemies.push(ghoul);
        }
        return;
      }

      if (monster) enemies.push(monster);
    });
}

// Initialization
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
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

  // Add this before rendering
  camera.update(deltaTime);
  ctx.save();
    camera.applyTransform(ctx);
    renderGameFrame(deltaTime);
  ctx.restore(); // restore after all drawing

  requestAnimationFrame(drawGameFrame);
  mouse.clicked = false;
}


function updateGameState(deltaTime) {
  handlePauseInput();
  if (paused) return;
  handlePlayerMovement();
  player.regenStamina(deltaTime);
  handleQuickUseKeys();
  updateEnemiesAndProjectiles(deltaTime);
  handleItemPickups();
  checkBuildingCollisions();
  updateUI(deltaTime);
}

function renderGameFrame(deltaTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  drawStaminaBar();
  
  if (playState === "gameover") {
    drawGameOverScreen();
  }
}

function handlePauseInput() {
  if (keys.pause && !pressedPause || playState === "gameover") {
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

function handleQuickUseKeys() {
  if (keys.usePotion) {
      const potion = player.inventory.find(i => i.type === "consumable");
      if (potion) {
          player.useItem(potion);
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

function drawStaminaBar() {

  let barColor = "green";
  if (player.currentStamina < 30) barColor = "orange";
  if (player.currentStamina < 10) barColor = "red";
  let x = 5;
  let y = 75;
  let width = 110;
  let height = 12;
  let fillWidth = (player.currentStamina / player.maxStamina) * width;

  colorRect(x, y, width, height, "rgba(0, 0, 0, 0.5)");

  colorRect(x, y, fillWidth, height, barColor);

  drawTextWithShadow("Stamina", x + 2, y + 10, 'white', "12px Arial", "left");
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
