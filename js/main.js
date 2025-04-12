var canvas, ctx, collisionCanvas, collisionCtx;
var playState = "playing";
const enemies = [];
const temp_ui_elements = [];
//const PLAYER_MOVE_SPEED = 4;
let lastFrameTime = performance.now();

let paused = false;
let pressedPause = false;
let turnPathFindingDrawingOn = false;
let insidebuilding = false;
let projectiles = [];
let worldItems = [];
let npcs = [];
let dialoguePrompt = null; 
let pendingQuest = null;  
let isBlockSliding = false;
let isPullingBlock = false;
let pulledBlock = null;



// Player
const player = new Player("Hero", 300, 500, 30, 10, 1, 50);
camera.followTarget = player;

// Building Setup
const gameState = {
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
      sY: 32 * 6,
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
  extra = {},
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
      monster = createMonster({
        name: "Goblin",
        x,
        y,
        damage: 5,
        maxHealth: 30,
        type: "melee",
      });
    } else if (tile === TILE_KOBOLD_SPAWN) {
      monster = createMonster({
        name: "Kobold",
        x,
        y,
        damage: 5,
        maxHealth: 20,
        type: "ranged",
        state: BEHAVIOR_STATES.WANDER,
      });
    } else if (tile === TILE_ORC_SPAWN) {
      monster = createMonster({
        name: "Orc",
        x,
        y,
        damage: 10,
        maxHealth: 40,
        type: "melee",
        size: 40,
      });
    } else if (tile === TILE_SKELETON_SPAWN) {
      monster = createMonster({
        name: "Skeleton",
        x,
        y,
        damage: 2,
        maxHealth: 20,
        type: "melee",
        size: 40,
        state: BEHAVIOR_STATES.PATROL,
        extra: { canResurrect: true, isUndead: true, immuneToRanged: true },
      });
    } else if (tile === TILE_WRAITH_SPAWN) {
      monster = createMonster({
        name: "Wraith",
        x,
        y,
        damage: 5,
        maxHealth: 20,
        type: "melee",
        state: BEHAVIOR_STATES.CHASE,
        image: wraithPic,
      });
    } else if (tile === TILE_GHOUL_SPAWN) {
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
          image: ghoulPic,
        });
        enemies.push(ghoul);
      }
      return;
    }

    if (monster) enemies.push(monster);
  });
}

function spawnNPCs() {
  const oldMan = new NPC(
    "Old Man",
    12 * TILE_W,
    8 * TILE_H,
    [ "The forest holds many secrets...",
      "Sometimes I still hear the wind whisper his name.",
      "I wasn't always this old, you know.",
      "We lost something out there..."]
  );
  npcs.push(oldMan);
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
  spawnNPCs();
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

function drawQuestTracker() {
  if (!quests.echoesOfTheNorth.started || quests.echoesOfTheNorth.completed)
    return;

  let title = "Quest: Echoes of the North";
  let status = quests.echoesOfTheNorth.pendantFound
    ? "• Return the pendant to the Old Man"
    : "• Find the lost pendant in the northern forest";

  let x = canvas.width - 270;
  let y = 10;

  colorRect(x - 5, y - 30, 260, 50, "rgba(0, 0, 0, 0.5)");

  drawTextWithShadow(title, x, y, "white", "14px Arial", "left");
  drawTextWithShadow(status, x, y + 18, "yellow", "12px Arial", "left");
}

function checkForMapEdgeTransition() {
  const col = Math.floor(player.x / TILE_W);
  const row = Math.floor(player.y / TILE_H);

  // NORTH TRANSITION
  if (row === 0 && WOLRD_MAPS["northForest"] && currentMapKey === "fallDale") {
    switchToMap("northForest", col, TILE_ROWS - 1);
  }

  // SOUTH TRANSITION
  if (row === TILE_ROWS - 1 && WOLRD_MAPS["fallDale"] && currentMapKey === "northForest") {
    switchToMap("fallDale", col, 0);
  }

  // EAST TRANSITION (→ into eastFields)
  if (col === TILE_COLS - 1 && WOLRD_MAPS["eastFields"] && currentMapKey === "fallDale") {
    switchToMap("eastFields", 0, row); // start at left edge of eastFields
  }

  // WEST TRANSITION (← back into startTown)
  if (col === 0 && WOLRD_MAPS["fallDale"] && currentMapKey === "eastFields") {
    switchToMap("fallDale", TILE_COLS - 1, row); // return to right edge of startTown
  }
}


function switchToMap(newMapKey, playerCol, playerRow) {
  if (!WOLRD_MAPS[newMapKey]) {
    console.warn(`Map '${newMapKey}' not found.`);
    return;
  }

  currentMapKey = newMapKey;
  backgroundGrid = WOLRD_MAPS[newMapKey];
  SetupCollisionGridFromBackground();
  updateBackground();

  player.x = playerCol * TILE_W;
  player.y = playerRow * TILE_H;

  console.log(`Switched to ${newMapKey}`);
}

function updateGameState(deltaTime) {
  handlePauseInput();
  if (paused) return;
  handlePlayerMovement();
  player.regenStamina(deltaTime);
  npcs.forEach(npc => npc.update && npc.update(deltaTime));
  handleQuickUseKeys();
  updateEnemiesAndProjectiles(deltaTime);
  handleItemPickups();
  checkBuildingCollisions();
  isBlockSliding = false; // reset before checking

  pushableBlocks.forEach(block => {
    if (block.isMoving) {
      isBlockSliding = true; // block is sliding this frame
  
      let dx = block.targetX - block.drawX;
      let dy = block.targetY - block.drawY;
      const speed = 4;
  
      if (Math.abs(dx) <= speed && Math.abs(dy) <= speed) {
        block.drawX = block.targetX;
        block.drawY = block.targetY;
        block.isMoving = false;
      } else {
        block.drawX += Math.sign(dx) * speed;
        block.drawY += Math.sign(dy) * speed;
      }
    } else {
      block.drawX = block.x * TILE_W;
      block.drawY = block.y * TILE_H;
    }
  });  
  
  updateUI(deltaTime);
  if (
    quests.echoesOfTheNorth.started &&
    !quests.echoesOfTheNorth.pendantSpawned
  ) {
    //Move to its own file
    spawnPendantInForest();
    quests.echoesOfTheNorth.pendantSpawned = true;
  }
  updatePressurePlates(); 
  checkForMapEdgeTransition();
}

function spawnPendantInForest() {
  //Move to Items.js
  const pendant = {
    name: "Silver Pendant",
    type: "quest",
    sprite: pickUpItemPic,
    x: 12 * TILE_W,
    y: 4 * TILE_H,
    pickupRadius: 20,
    onPickup: function () {
      quests.echoesOfTheNorth.pendantFound = true;
      console.log("Pendant found! Return to the Old Man.");
    },
  };
  worldItems.push(pendant);
}

function renderGameFrame(deltaTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  if (turnPathFindingDrawingOn) drawPathingFindingTiles();
  drawBuildings();

  player.draw(deltaTime);
  npcs.forEach((npc) => npc.draw && npc.draw(deltaTime));
  worldItems.forEach((item) => drawWorldItem(item));
  enemies.filter((e) => !e.isDead).forEach((e) => e.draw(deltaTime));
  pushableBlocks.forEach(block => {
    //colorRect(block.drawX, block.drawY, block.width, block.height, 'brown');
    ctx.drawImage(boxPic, 0, 0, block.width, block.height, block.drawX, block.drawY, 32, 32);
  });  
  projectiles.forEach((p) => p.draw(ctx));
  drawBackpackUI(ctx, player);

  drawGoldUI();
  temp_ui_elements.forEach((ui) => ui.draw());
  if (paused) drawPauseOverlay();

  player.drawHearts();
  drawStaminaBar();



  drawQuestTracker();
  drawDialoguePrompt();

  if (playState === "gameover") {
    drawGameOverScreen();
  }
}

function handlePauseInput() {
  if ((keys.pause && !pressedPause) || playState === "gameover") {
    paused = !paused;
    pressedPause = true;
  }
  if (!keys.pause) pressedPause = false;
}

function handlePlayerMovement() {
  // sprint stamina drain
  if (player.isSprinting) {
    if (player.canPerformAction(1)) {
      player.useStamina(1);
    } else {
      player.isSprinting = false;
      player.currentSpeed = player.baseSpeed;
    }
  }

  // movement input
  if (keys.up || gamepad.up) {
    if (isPullingBlock && tryPullBlock(player, 0, -1)) return;
    const pushed = tryPushBlock(player, 0, -1);
    if (pushed !== false) movePlayer(0, -player.currentSpeed, "NORTH");
  }
  if (keys.down || gamepad.down) {
    if (isPullingBlock && tryPullBlock(player, 0, 1)) return;
    const pushed = tryPushBlock(player, 0, 1);
    if (pushed !== false) movePlayer(0, player.currentSpeed, "SOUTH");
  }
  if (keys.left || gamepad.left) {
    if (isPullingBlock && tryPullBlock(player, -1, 0)) return;
    const pushed = tryPushBlock(player, -1, 0);
    if (pushed !== false) movePlayer(-player.currentSpeed, 0, "WEST");
  }
  if (keys.right || gamepad.right) {
    if (isPullingBlock && tryPullBlock(player, 1, 0)) return;
    const pushed = tryPushBlock(player, 1, 0);
    if (pushed !== false) movePlayer(player.currentSpeed, 0, "EAST");
  }
  player.updateMovement();
}


function updateEnemiesAndProjectiles(deltaTime) {
  enemies.forEach((e) => updateEnemy(e, player));
  enemies.forEach((e) =>
    e.fireAtPlayerIfInRange(player, projectiles, collisionGrid)
  );
  projectiles.forEach((p) => p.update(collisionGrid, enemies));
  projectiles = projectiles.filter((p) => p.isActive);
}

function handleItemPickups() {
  for (let i = worldItems.length - 1; i >= 0; i--) {
    const item = worldItems[i];
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < item.pickupRadius) {
      // Custom on-pickup
      if (item.onPickup) {
        item.onPickup();
      }

      // Apply item effect or add to inventory
      if (item.use === "heal" && player.currentHP < player.maxHP) {
        player.heal(item.amount);
      } else {
        player.addItemToInventory(item);
      }

      // Remove from world
      worldItems.splice(i, 1);
    }
  }
}

function handleQuickUseKeys() {
  if (keys.usePotion) {
    const potion = player.inventory.find((i) => i.type === "consumable");
    if (potion) {
      player.useItem(potion);
    }
  }
}

function updateUI(deltaTime) {
  temp_ui_elements.forEach((e) => e.update(deltaTime));
}

function drawGoldUI() {
  colorRect(5, 40, 110, 30, "rgba(0, 0, 0, 0.5)");
  drawTextWithShadow(
    `Gold: ${player.gold}`,
    15,
    60,
    UI_TEXT_STYLES.DEFAULT.textColor,
    UI_TEXT_STYLES.DEFAULT.font,
    UI_TEXT_STYLES.DEFAULT.align
  );
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

  drawTextWithShadow("Stamina", x + 2, y + 10, "white", "12px Arial", "left");
}

function checkBuildingCollisions() {
  for (let key in gameState.buildings) {
    checkCollision(
      player,
      gameState.buildings[key],
      gameState.buildings[key].buildingMessage
    );
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
