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
let worldItems = {};
let npcs = [];
let buildings = {};
let dialoguePrompt = null;
let pendingQuest = null;
let isBlockSliding = false;
let isPullingBlock = false;
let pulledBlock = null;
let lastMapSwitchTime = 0;
const MAP_SWITCH_COOLDOWN = 1000; // milliseconds
let inventoryOpen = false;
let inventoryPressed = false; 



//Initialize the world items arrays for each screen
Object.keys(WORLD_MAPS).forEach((key) => {
  worldItems[key] = [];
});
// Player
const player = new Player("Hero", 300, 500, 30, 10, 1, STARTING_GOLD);
camera.followTarget = player;

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
  const oldMan = new NPC("Old Man", 12 * TILE_W, 8 * TILE_H, [
    "The forest holds many secrets...",
    "Sometimes I still hear the wind whisper his name.",
    "I wasn't always this old, you know.",
    "We lost something out there...",
  ]);
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
  switchToMap("fallDale", 5, 4); 
  spawnMonstersFromMap();
  requestAnimationFrame(drawGameFrame);
}

// Game Loop Functions
function drawGameFrame(currentTime) {
  var deltaTime = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  check_gamepad();
  updateGameState(deltaTime);

  camera.update(deltaTime);
  ctx.save();
  camera.applyTransform(ctx);

  renderGameWorld(deltaTime); 
  ctx.restore();              

  renderUI();                
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
  var now = performance.now();
  if (now - lastMapSwitchTime < MAP_SWITCH_COOLDOWN) return;

  var col = Math.floor(player.x / TILE_W);
  var row = Math.floor(player.y / TILE_H);

  // NORTH
  if (row === 0 && WORLD_MAPS["northForest"] && currentMapKey === "fallDale") {
    switchToMap("northForest", col, TILE_ROWS - 2);
    lastMapSwitchTime = now;
  }

  // SOUTH
  else if (
    row === TILE_ROWS - 1 &&
    WORLD_MAPS["fallDale"] &&
    currentMapKey === "northForest"
  ) {
    switchToMap("fallDale", col, 1);
    lastMapSwitchTime = now;
  }

  // EAST
  else if (
    col === TILE_COLS - 1 &&
    WORLD_MAPS["eastFields"] &&
    currentMapKey === "fallDale"
  ) {
    switchToMap("eastFields", 1, row);
    lastMapSwitchTime = now;
  }

  // WEST
  else if (
    col === 0 &&
    WORLD_MAPS["fallDale"] &&
    currentMapKey === "eastFields"
  ) {
    switchToMap("fallDale", TILE_COLS - 2, row);
    lastMapSwitchTime = now;
  }
}

function switchToMap(newMapKey, playerCol, playerRow) {
  if (!WORLD_MAPS[newMapKey]) {
    console.warn(`Map '${newMapKey}' not found.`);
    return;
  }

  currentMapKey = newMapKey;
  backgroundGrid = WORLD_MAPS[newMapKey];
  SetupCollisionGridFromBackground();
  updateBackground();

  player.x = playerCol * TILE_W;
  player.y = playerRow * TILE_H;

  // Clear and load map-specific content
  npcs = MAP_DATA[newMapKey]?.npcs || [];
  buildings = MAP_DATA[newMapKey]?.buildings || {};

  console.log(`Switched to ${newMapKey}`);
}

function updateGameState(deltaTime) {
  handlePauseInput();
  handleInventoryInput(); 
  if (paused && !inventoryOpen && !shopOpen) return; 
  handlePlayerMovement();
  if (keys.fire) {
    player.fireProjectile();
  }  
  player.regenStamina(deltaTime);
  npcs.forEach((npc) => npc.update && npc.update(deltaTime));
  handleQuickUseKeys();
  globalUsedFlankTiles.clear();
  updateEnemiesAndProjectiles(deltaTime);
  handleItemPickups();
  checkBuildingCollisions();
  isBlockSliding = false; // reset before checking

  pushableBlocks.forEach((block) => {
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
    sprite: pendantPic,
    x: 12 * TILE_W,
    y: 4 * TILE_H,
    pickupRadius: 20,
    onPickup: function () {
      quests.echoesOfTheNorth.pendantFound = true;
      console.log("Pendant found! Return to the Old Man.");
    },
  };
  worldItems["northForest"].push(pendant);
}

function renderGameWorld(deltaTime) {
  
  // clear using the same shade of green as our grass tile
  // just in case we can see past the map edges
  // ctx.fillStyle="rgba(137,140,34,1)"; // grass green
  ctx.fillStyle="rgba(60,103,140,1)"; // water blue
  ctx.fillRect(0,0,4000,4000); // if we use canvas.width and height it's too small due to scrolling

  drawBackground();
  if (turnPathFindingDrawingOn) drawPathingFindingTiles();
  npcs.forEach((npc) => npc.draw && npc.draw(deltaTime));
  drawBuildings();
  player.draw(deltaTime);
  worldItems[currentMapKey].forEach((item) => drawWorldItem(item));
  enemies.filter((e) => !e.isDead).forEach((e) => e.draw(deltaTime));
  pushableBlocks.forEach((block) => {
    ctx.drawImage(
      boxPic,
      0,
      0,
      block.width,
      block.height,
      block.drawX,
      block.drawY,
      32,
      32
    );
  });
  projectiles.forEach((p) => p.draw(ctx));
  // Re-draw the Blacksmith in front of the interior if we're inside
  if (insidebuilding) {
    npcs.forEach(npc => {
    if (npc.name === "Blacksmith") {
      npc.draw(0);
    }
  });
}

}

function renderUI() {
  drawBackpackUI(ctx, player);
  drawGoldUI();
  temp_ui_elements.forEach((ui) => ui.draw());

  if (paused) drawPauseOverlay();
  player.drawHearts();
  drawStaminaBar();
  drawArrowCount();
  drawQuestTracker();
  drawDialoguePrompt();
  drawIntroText();
  if (shopOpen) drawShopUI();
  if (playState === "gameover") {
    drawGameOverScreen();
  }
}

function handlePauseInput() {
  if ((keys.pause && !pressedPause)) {
    paused = !paused;
    pressedPause = true;
  }
  if (!keys.pause) pressedPause = false;
}

function handlePlayerMovement() {
  if (shopOpen) {
    if (shopJustOpened) {
        shopJustOpened = false;
        return;
    }

    if (keys.cancel) {
      closeShopInterface();
      keys.cancel = false;
      return;
    }

    const itemList = inSellMode ? player.inventory : shopInventory;

    if (keys.up) {
        selectedItemIndex = (selectedItemIndex - 1 + itemList.length) % itemList.length;
        keys.up = false;
    }
    if (keys.down) {
        selectedItemIndex = (selectedItemIndex + 1) % itemList.length;
        keys.down = false;
    }

    if (keys.s) {
        inSellMode = true;
        selectedItemIndex = 0;
        keys.s = false;
    }

    if (keys.b) {
        inSellMode = false;
        selectedItemIndex = 0;
        keys.b = false;
    }

    if (keys.action && itemList[selectedItemIndex]) {
        const item = itemList[selectedItemIndex];

        if (inSellMode) {
            const sellPrice = Math.floor(item.cost / 2);
            player.gold += sellPrice;
            player.inventory.splice(player.inventory.indexOf(item), 1);
            console.log(`Sold ${item.name} for ${sellPrice}g`);
        } else {
            if (player.gold >= item.cost) {
                player.gold -= item.cost;
                player.inventory.push(item);
                console.log(`Bought ${item.name}`);
            } else {
                console.log("Not enough gold!");
            }
        }

        keys.action = false;
    }

    if (keys.cancel) {
        closeShopInterface();
        keys.cancel = false;
    }

    return;
}

  
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
  for (let i = worldItems[currentMapKey].length - 1; i >= 0; i--) {
    const item = worldItems[currentMapKey][i];
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
        console.log("Add item to inventory");
        player.addItemToInventory(item);
      }

      // Remove from world
      worldItems[currentMapKey].splice(i, 1);
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
  colorRect(5, 40, 170, 30, "rgba(0, 0, 0, 0.5)");
  drawTextWithShadow(
    `Gold: ${player.gold}`,
    15,
    60,
    UI_TEXT_STYLES.DEFAULT.textColor,
    UI_TEXT_STYLES.DEFAULT.font,
    UI_TEXT_STYLES.DEFAULT.align
  );
  // actually draw each gold coin in stacks of ten! =)
  for (let n = 0; n < player.gold; n++) {
    let x = 100 + Math.floor(n / 10) * 12;
    let y = 60 + (n % 10) * -2;
    ctx.drawImage(coinPic, x, y);
  }
}

function drawArrowCount() {
  let text = `Arrows: ${player.arrows}/${player.maxArrows}`;
  let x = 10;
  let y = 80;
  drawTextWithShadow(text, x, y, UI_TEXT_STYLES.DEFAULT.textColor, UI_TEXT_STYLES.DEFAULT.font, "left");
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
  for (let key in buildings) {
    const b = buildings[key];
    ctx.drawImage(b.image, b.sX, b.sY, b.sW, b.sH, b.x, b.y, b.width, b.height);
  }
}

function drawStaminaBar() {
  let barColor = "green";
  if (player.currentStamina < 30) barColor = "orange";
  if (player.currentStamina < 10) barColor = "red";
  let x = 5;
  let y = 85;
  let width = 110;
  let height = 12;
  let fillWidth = (player.currentStamina / player.maxStamina) * width;

  colorRect(x, y, width, height, "rgba(0, 0, 0, 0.5)");

  colorRect(x, y, fillWidth, height, barColor);

  drawTextWithShadow("Stamina", x + 2, y + 10, "white", "12px Arial", "left");
}

function checkBuildingCollisions() {
  for (let key in buildings) {
    checkCollision(player, buildings[key], buildings[key].buildingMessage);
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

function handleInventoryInput() {
  if (keys.inventory && !inventoryPressed) {
    inventoryOpen = !inventoryOpen;
    paused = inventoryOpen;
    inventoryPressed = true;
  }
  if (!keys.inventory) {
    inventoryPressed = false;
  }
}


