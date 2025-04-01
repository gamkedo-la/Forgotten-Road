var canvas, ctx, collisionCanvas, collisionCtx;
const enemies = [];
const temp_ui_elements = [];
var turnPathFindingDrawingOn = false;
const PLAYER_MOVE_SPEED = 4;
let lastFrameTime = performance.now();

// Player and enemy setup
const player = new Player("Hero", 300, 500, 30, 10, 1, 50);
console.log(player.name, "has", player.health, "HP and", player.gold, "gold.");
player.addItemToInventory(basicStaff);
player.addItemToInventory(leatherArmor);
var worldItems = []; 

player.levelUp();

const goblin = new Monster("Goblin", 32 * 9, 32 * 4, 32, 5, 20, 'melee');
goblin.maxHealth = 30;
goblin.health = 30;
goblin.state = BEHAVIOR_STATES.IDLE;
goblin.placeAtRandomPosition(5);
assignDefaultPatrol(goblin);

const kobold = new Monster("Kobold", 32 * 9, 32 * 4, 32, 5, 20, 'ranged');
kobold.maxHealth = 20;
kobold.health = 20;
kobold.state = BEHAVIOR_STATES.WANDER;
kobold.placeAtRandomPosition(2);
assignDefaultPatrol(kobold);

const skeleton = new Monster("Skeleton", 0, 0, 40, 2, 0, "melee");
skeleton.state = BEHAVIOR_STATES.PATROL;
skeleton.canResurrect = true;
skeleton.isUndead = true;
skeleton.immuneToRanged = true;

enemies.push(goblin, kobold, skeleton);

var insidebuilding = false;
var projectiles = [];

// Game state
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

let paused = false;
let pressedPause = false;

// Collision Canvas Setup, ,
function setupCollisionCanvas() {
  collisionCanvas = document.createElement("canvas");
  collisionCanvas.width = canvas.width;
  collisionCanvas.height = canvas.height;
  collisionCanvas.style.position = "absolute";
  collisionCanvas.style.pointerEvents = "none";
  collisionCanvas.style.opacity = 0.5;

  const canvasRect = canvas.getBoundingClientRect();
  collisionCanvas.style.top = `${canvasRect.top}px`;
  collisionCanvas.style.left = `${canvasRect.left}px`;
  collisionCanvas.style.width = `${canvasRect.width}px`;
  collisionCanvas.style.height = `${canvasRect.height}px`;

  collisionCanvas.style.zIndex = 10;
  document.body.appendChild(collisionCanvas);

  collisionCtx = collisionCanvas.getContext("2d");
}

// Utility: Clear collision canvas
function clearCollisionCanvas() {
  collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
}

// Utility: Draw a collision box (for debugging)
function drawCollisionBox(x, y, width, height) {
  collisionCtx.fillStyle = "rgba(123, 0, 255, 0.8)"; // Red color
  collisionCtx.fillRect(x, y, width, height);
}

// Utility: Check collision on the collision canvas
function isCollisionAt(x, y) {
  const pixel = collisionCtx.getImageData(x, y, 1, 1).data;
  return pixel[0] === 255 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] > 0; // Red detection
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  setupCollisionCanvas();
  loadImages();
};

function imageLoadingDoneSoStartGame() {
  console.log("All images downloaded. Starting game!");
  var framesPerSecond = 60;

  SetupCollisionGridFromBackground();
  function drawGameFrame(currentTime) {
    var deltaTime = (currentTime - lastFrameTime) / 1000; // in seconds
    lastFrameTime = currentTime;

    check_gamepad();
    moveEverything();
    drawEverything(deltaTime); // <- pass it here

    requestAnimationFrame(drawGameFrame);
  }

  requestAnimationFrame(drawGameFrame);
}

function drawBuildings() {
  for (buildingKey in gameState.buildings) {
    ctx.drawImage(
      gameState.buildings[buildingKey].image,
      gameState.buildings[buildingKey].sX,
      gameState.buildings[buildingKey].sY,
      gameState.buildings[buildingKey].sW,
      gameState.buildings[buildingKey].sH,
      gameState.buildings[buildingKey].x,
      gameState.buildings[buildingKey].y,
      gameState.buildings[buildingKey].width,
      gameState.buildings[buildingKey].height
    );
  }
}

function checkBuildingCollisions() {
  for (buildingKey in gameState.buildings) {
    checkCollision(
      player,
      gameState.buildings[buildingKey],
      gameState.buildings[buildingKey].buildingMessage
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
    //console.log(message);
    building.sX = building.width;
    building.insidebuilding = true;
  } else {
    building.sX = 0;
    building.insidebuilding = false;
  }
}

// Move all entities
function moveEverything() {
  // Pause/unpause game
  let now = performance.now();
  let deltaTime = now - (lastFrameTime || now);
  lastFrameTime = now;

  if (keys.pause && !pressedPause) {
    paused = !paused;
    pressedPause = true;
  }

  if (!keys.pause) {
    pressedPause = false;
  }

  if (paused) {
    return;
  }

  // Move player
  if (keys.up || gamepad.up) movePlayer(0, -PLAYER_MOVE_SPEED, "NORTH");
  if (keys.down || gamepad.down) movePlayer(0, PLAYER_MOVE_SPEED, "SOUTH");
  if (keys.left || gamepad.left) movePlayer(-PLAYER_MOVE_SPEED, 0, "WEST");
  if (keys.right || gamepad.right) movePlayer(PLAYER_MOVE_SPEED, 0, "EAST");

  // move player along path
  player.updateMovement();

  // move enemies on optional path
  for (let enemy of enemies) {
    updateEnemy(enemy, player);
  }

  for (let i = worldItems.length - 1; i >= 0; i--) {
    const item = worldItems[i];
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < item.pickupRadius) {
      if (item.use === "heal" && player.currentHP < player.maxHP) {
        player.heal(item.amount); // heal damaged player
      } else {
        player.addItemToInventory(item);
      }
      worldItems.splice(i, 1);
    }
  }

  // Collision with house
  checkBuildingCollisions();

  for (let enemy of enemies) {
    enemy.fireAtPlayerIfInRange(player, projectiles, collisionGrid);
  }

  projectiles.forEach((p) => p.update(collisionGrid, enemies));

  // Remove inactive projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    if (!projectiles[i].isActive) {
      projectiles.splice(i, 1);
    }
  }

  temp_ui_elements.forEach((element) => {
    element.update(deltaTime);
  });
}

// Render game
function drawEverything(deltaTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    townMapPic,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawBackground();
  if (turnPathFindingDrawingOn) {
    drawPathingFindingTiles();
  }

  // Render building if inside
  drawBuildings();

  player.draw(deltaTime);

  for (let item of worldItems) {
    if (item.sprite instanceof Image && item.sprite.complete) {
      ctx.drawImage(item.sprite, item.x, item.y, 32, 32); // or TILE_W, TILE_H
    } else {
      ctx.fillStyle = "orange";
      ctx.fillRect(item.x, item.y, 32, 32); // fallback box
    }
  }

  // Render enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];

    if (enemy.isDead) {
      continue;
    }

    // Alive enemy flash logic
    const now = Date.now();
    if (enemy.isFlashing && now - enemy.lastHitTime < enemy.flashDuration) {
      // Flash yellow
      ctx.fillStyle = enemy.flashColor;
      ctx.fillRect(enemy.x, enemy.y, TILE_W, TILE_H);
    } else {
      enemy.isFlashing = false; // End flash
      enemy.draw(deltaTime); // Normal rendering
    }
  }

  projectiles.forEach((p) => p.draw(ctx));

  drawBackpackUI(ctx, player);

  // Display player stats
  var UIvertical = 40;
  colorRect(5, UIvertical, 110, 30, "rgba(0, 0, 0, 0.5)");
  const style = UI_TEXT_STYLES.DEFAULT;
  drawTextWithShadow(
    `Gold: ${player.gold}`,
    15,
    UIvertical + 20,
    style.textColor,
    style.font,
    style.align
  );

  //  Draw Temp UI elements
  temp_ui_elements.forEach((ui_element) => {
    ui_element.draw();
  });

  //   Pause UI
  if (paused) {
    colorRect(0, 0, canvas.width, canvas.height, "#000000AA");
    ctx.textAlign = "center";
    colorText("PAUSED", canvas.width / 2, canvas.height / 2, "white", 16);
    ctx.textAlign = "start";
  }

  player.drawHearts();
}

function dist(x1, y1, x2, y2) {
  const distX = x1 - x2;
  const distY = y1 - y2;
  return Math.sqrt(distX * distX + distY * distY);
}
