var canvas, ctx, collisionCanvas, collisionCtx;
const enemies = [];
var turnPathFindingDrawingOn = false;
const PLAYER_MOVE_SPEED = 4;

console.log("============ The Forgotten Road ============\nInitializing...");

// Player and enemy setup
const player = new Player("Hero", 300, 500, 100, 10, 1, 50);
console.log(player.name, "has", player.health, "HP and", player.gold, "gold.");
player.levelUp();

const goblin = new Monster("Goblin", 32 * 9, 32 * 4, 32, 5, 20);
enemies.push(goblin);

goblin.placeAtRandomPosition(5);

console.log(`${goblin.name} is lurking in the woods...`);
goblin.attack(player);

console.log(`${player.name} now has ${player.health} HP.`);

var insidebuilding = false;

// Game state
const gameState = {
  house: {
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
    insidebuilding: false,
  },
  house2: {
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
    insidebuilding: false,
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
  setInterval(function () {
    check_gamepad();
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);
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

  player.updateMovement();

  // Collision with house
  checkCollision(
    player,
    gameState.house,
    "You're in the blacksmith shop! You can interact with NPCs or buy items."
  );
  checkCollision(
    player,
    gameState.house2,
    "You're in the alchemist shop! You can interact with NPCs or buy items."
  );
}

// Render game
function drawEverything() {
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
  if (gameState.house.insidebuilding) {
    ctx.drawImage(
      gameState.house.image,
      gameState.house.sX,
      gameState.house.sY,
      gameState.house.sW,
      gameState.house.sH,
      gameState.house.x,
      gameState.house.y,
      gameState.house.width,
      gameState.house.height
    );
  }
  if (gameState.house2.insidebuilding) {
    ctx.drawImage(
      gameState.house2.image,
      gameState.house2.sX,
      gameState.house2.sY,
      gameState.house2.sW,
      gameState.house2.sH,
      gameState.house2.x,
      gameState.house2.y,
      gameState.house2.width,
      gameState.house2.height
    );
  }

  // Render player
  //move this to player class
  ctx.drawImage(
    player.image,
    player.sX,
    player.sY,
    player.sW,
    player.sH,
    player.x,
    player.y,
    player.width,
    player.height
  );

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
        enemy.draw(ctx); // Normal rendering
    }
  }

  // Render house if outside

  if (!gameState.house.insidebuilding) {
    ctx.drawImage(
      gameState.house.image,
      gameState.house.sX,
      gameState.house.sY,
      gameState.house.sW,
      gameState.house.sH,
      gameState.house.x,
      gameState.house.y,
      gameState.house.width,
      gameState.house.height
    );
  }
  if (!gameState.house2.insidebuilding) {
    ctx.drawImage(
      gameState.house2.image,
      gameState.house2.sX,
      gameState.house2.sY,
      gameState.house2.sW,
      gameState.house2.sH,
      gameState.house2.x,
      gameState.house2.y,
      gameState.house2.width,
      gameState.house2.height
    );
  }

  // Display player stats
   colorRect(5, 5, 110, 50, "rgba(0, 0, 0, 0.5)");
   const style = UI_TEXT_STYLES.DEFAULT;
   drawTextWithShadow(`Health: ${player.health}`, 15, 25, style.textColor, style.font, style.align);
   drawTextWithShadow(`Gold: ${player.gold}`, 15, 45, style.textColor, style.font, style.align);

  //   Pause UI
  if (paused) {
    colorRect(0, 0, canvas.width, canvas.height, "#000000AA");
    ctx.textAlign = "center";
    colorText("PAUSED", canvas.width / 2, canvas.height / 2, "white", 16);
    ctx.textAlign = "start";
  }
}
