var canvas, ctx, collisionCanvas, collisionCtx;
var playState = "playing";
const enemies = [];
const destructibles = [];
const temp_ui_elements = [];
//const PLAYER_MOVE_SPEED = 4;
let lastFrameTime = performance.now();
const HUD_BAR_WIDTH = 195;

let paused = false;
let pressedPause = false;
let pauseOverlayAlpha = 0;
let pauseAlphaChangeRate = 0.14;
let pauseTextMovementFrequency = 0.09;
let pauseTextMovementAmplitude = 2;
let muted = false;
let pressedMute = false;
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
let weather = new WeatherSystem();
let currentWeather = "clear"; 
let timeOfDay = "day";
let dayNightTimer = 0;
const DAY_DURATION = 300;   
const NIGHT_DURATION = 180; 
let frameCount = 0;

//Initialize the world items arrays for each screen
Object.keys(WORLD_MAPS).forEach((key) => {
  worldItems[key] = [];
});

// Player
const player = new Player("Hero", 300, 500, STARTING_HEALTH, STARTING_DAMAGE, STARTING_LEVEL, STARTING_GOLD);
camera.followTarget = player;

// Enemy Factory and Spawning
function createMonster({
  name,
  x,
  y,
  size = TILE_H,
  damage,
  maxHealth,
  type,
  state = BEHAVIOR_STATES.IDLE,
  patrolZone = null,
  image = null,
  extra = {},
}) {
  
  var monster = new Monster(name, x, y, maxHealth, damage, loot ={}, type);
  monster.maxHealth = maxHealth;
  monster.health = maxHealth;
  monster.state = state;

  if (patrolZone) monster.placeAtRandomPosition(patrolZone);
  if (image) monster.image = image;
  Object.assign(monster, extra);

  if (state === BEHAVIOR_STATES.PATROL || state === BEHAVIOR_STATES.WANDER) {
    assignDefaultPatrol(monster);
  }
  console.log(monster);
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
    } else if (tile === TILE_SKELETON_KING_SPAWN) {
      monster = createMonster({
        name: "Skeleton King",
        x,
        y,
        damage: 2,
        maxHealth: 200,
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
        const offsetX = Math.random() * TILE_W * 2;
        const offsetY = Math.random() * TILE_H * 2;
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

// Initialization
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  loadImages();
};

function imageLoadingDoneSoStartGame() {
  console.log("All images downloaded. Starting game!");
  switchToMap("fallDale", 5, 4); 
  requestAnimationFrame(drawGameFrame);
}

// Game Loop Functions
function drawGameFrame(currentTime) {
  frameCount++;
  var deltaTime = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  check_gamepad();
  updateGameState(deltaTime);

  camera.update(deltaTime);
  ctx.save();
    camera.applyTransform(ctx);
    renderGameWorld(deltaTime); 
    renderParticles(deltaTime);
    weather?.update(deltaTime);
  ctx.restore();

  if (currentMapKey == "fallDale") { // no rain in dungeons etc
    ctx.save(); 
      weather?.render(ctx, timeOfDay);
    ctx.restore(); 
  }

  renderUI();                

  mouse.clicked = false;
  if (!keys.up && !keys.down && !keys.left && !keys.right && player.path.length === 0) {
    player.isMoving = false;
  }

  //if (titleScreenSecondsLeft>0) drawTitlescreen(deltaTime);

  requestAnimationFrame(drawGameFrame);

}

function drawQuestTracker() {
  let x = canvas.width - 270;
  let y = 20;
  let boxH = 64;

  if (quests.echoesOfTheNorth.started && !quests.echoesOfTheNorth.completed) {
    let title = "Quest: Echoes of the North";
    let status = quests.echoesOfTheNorth.pendantFound
        ? "• Return the pendant to the Old Man"
        : "• Find the lost pendant in the northern forest";
    colorRect(x - 5, y - 30, 260, boxH, "rgba(0, 0, 0, 0.5)");
    drawTextWithShadow(title, x, y, "white", "14px Arial", "left");
    drawTextWithShadow(status, x, y + 18, "yellow", "12px Arial", "left");
    y += boxH;
  }


  if (quests.yesYourEggcellence.started && !quests.yesYourEggcellence.completed) {
    let title = "Quest: Yes, your Eggcellence";
    let status1 = "• You need "+quests.yesYourEggcellence.eggsNeeded+" eggs and have "+quests.yesYourEggcellence.eggsFound;
    let status2 = "• You need "+quests.yesYourEggcellence.mushroomsNeeded+" mushrooms and have "+quests.yesYourEggcellence.mushroomsFound;
    colorRect(x - 5, y - 30, 260, boxH+20, "rgba(0, 0, 0, 0.5)");
    drawTextWithShadow(title, x, y, "white", "14px Arial", "left");
    drawTextWithShadow(status1, x, y + 18, "yellow", "12px Arial", "left");
    drawTextWithShadow(status2, x, y + 38, "yellow", "12px Arial", "left");
    y += boxH+20;
  }

}

const MAP_TRANSITIONS = {
  fallDale: {
    west: { to: "graveYard", col: TILE_COLS - 2 }, // enter graveyard from right
    north: { to: "northForest", row: TILE_ROWS - 2 },
    east: { to: "eastFields", col: 1 },
  },
  graveYard: {
    east: { to: "fallDale", col: 1 },
  },
  northForest: {
    south: { to: "fallDale", row: 1 },
  },
  eastFields: {
    west: { to: "fallDale", col: TILE_COLS - 2 },
  },
};

function checkForMapEdgeTransition() {
  const now = performance.now();
  if (now - lastMapSwitchTime < MAP_SWITCH_COOLDOWN) return;

  const col = Math.floor(player.x / TILE_W);
  const row = Math.floor(player.y / TILE_H);
  const transition = MAP_TRANSITIONS[currentMapKey];

  if (!transition) return;

  if (row === 0 && transition.north) {
    switchToMap(transition.north.to, col, transition.north.row ?? TILE_ROWS - 2);
    lastMapSwitchTime = now;
  } else if (row === TILE_ROWS - 1 && transition.south) {
    switchToMap(transition.south.to, col, transition.south.row ?? 1);
    lastMapSwitchTime = now;
  } else if (col === 0 && transition.west) {
    switchToMap(transition.west.to, transition.west.col ?? TILE_COLS - 2, row);
    lastMapSwitchTime = now;
  } else if (col === TILE_COLS - 1 && transition.east) {
    switchToMap(transition.east.to, transition.east.col ?? 1, row);
    lastMapSwitchTime = now;
  }
}

function switchToMap(newMapKey, playerCol, playerRow) {
  console.log("SWITCHING TO NEW MAP: "+newMapKey);
  
  // clear any previous path on the player
  // to prevent old movement to carry forward to new area
  player.path = [];

  if (!WORLD_MAPS[newMapKey]) {
    console.log("ERROR: unknown map.");
    return;
  }

  currentMapKey = newMapKey;
  backgroundGrid = WORLD_MAPS[newMapKey];
  SetupCollisionGridFromBackground();
  updateBackground();
  drawBackground(); 

  spawnEntitiesFromTiles(); 
  
  if (newMapKey == "fallDale") {
    spawnRandomChickens();
  }
  spawnRandomMushrooms();

  player.x = playerCol * TILE_W;
  player.y = playerRow * TILE_H;

  buildings = MAP_DATA[newMapKey]?.buildings || {};
 /* console.log(`Switched to ${newMapKey}`);
  console.log("Player moved to", player.x, player.y, "on map", newMapKey);
  console.log("backgroundGrid after switch:", backgroundGrid);
  console.log("Map key exists:", !!WORLD_MAPS[newMapKey]); */
}


function updateGameState(deltaTime) {
  handlePauseInput();
  handleMuteInput();

  if (weather) {
    let shouldChange = weather.updateWeatherTimer(deltaTime);
    if (shouldChange) {
      currentWeather = weather.changeWeatherRandomly();
    }
  }

  dayNightTimer += deltaTime;

  if (timeOfDay === "day" && dayNightTimer > DAY_DURATION) {
    timeOfDay = "night";
    dayNightTimer = 0;
    console.log("Night falls...");
  } else if (timeOfDay === "night" && dayNightTimer > NIGHT_DURATION) {
    timeOfDay = "day";
    dayNightTimer = 0;
    console.log("Dawn breaks...");
  } 

  handleInventoryInput(); 
  if (paused && !inventoryOpen && !shopOpen) return; 
  handlePlayerMovement();
  if (keys.fire) {
    player.fireProjectile();
  }  
  player.regenStamina(deltaTime);
  npcs.forEach((npc, index) => {
    // Spread pathfinding over time: only update 1 out of 3 NPCs per frame
    if ((frameCount + index) % 3 === 0) {
      npc.update(deltaTime, timeOfDay);
    }
  });
  anims.forEach((a) => a.update(deltaTime));
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
  checkForTileBasedMapTransition();
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

  // console.log("RENDER: currentMapKey =", currentMapKey);
  // console.log("RENDER: backgroundGrid[0][0] =", backgroundGrid?.[0]?.[0]);

  
  // clear using the same shade of green as our grass tile
  // just in case we can see past the map edges
  ctx.fillStyle="rgba(137,140,34,1)"; // grass green
  //ctx.fillStyle="rgba(60,103,140,1)"; // water blue
  ctx.fillRect(0,0,4000,4000); // if we use canvas.width and height it's too small due to scrolling

  // ground
  drawBackground();
  
  // tiles
  if (turnPathFindingDrawingOn) drawPathingFindingTiles();

  // walls
  drawBuildings();
  
  // npcs
  npcs.forEach((npc) => npc.draw && npc.draw(deltaTime)); 
  
  // player
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = "source-over";
  //console.log("Drawing player at", player.x, player.y);
  player.draw(deltaTime);

  
  // pickups
  worldItems[currentMapKey].forEach((item) => drawWorldItem(item));
  
  // enemies
  enemies.filter((e) => !e.isDead).forEach((e) => e.draw(deltaTime));
  
  // draw all pushable blocks
  pushableBlocks.forEach((block) => {
    ctx.drawImage(shadowPic,block.drawX-16,block.drawY+10);
    ctx.drawImage(
      boxPic,
      0,
      0,
      block.width,
      block.height,
      block.drawX,
      block.drawY,
      TILE_W,
      TILE_H
    );
  });
  
  // barrels, etc
  destructibles.forEach((p) => p.draw(ctx));
  
  // arrows
  projectiles.forEach((p) => p.draw(ctx));
  
  // spritesheetAnimations
  anims.forEach((a) => a.draw(ctx));

  // Re-draw the Blacksmith in front of the interior if we're inside
  if (insidebuilding) {
    npcs.forEach(npc => {
      if (npc.name === "Blacksmith") {
        npc.draw(0);
      }
    });
  } 

  drawCeilingTilesAbovePlayer(); // used by dungeon doorways

}

function renderTopStatsBar() {
    // top bar stats HUD display
    ctx.drawImage(topBarBackgroundPic,0,0);
    player.drawHearts();
    drawStaminaBar();
    drawGoldUI();
    drawQuestCounts();
    drawArrowCount();
    drawSeason(currentWeather)
 }

 // Test code below for UI system. Can leave commented for now.
  // const childNode1 = UIElement();
  // childNode1.backgroundColor = "pink";
  // childNode1.dimensions.width = 50;
  // childNode1.dimensions.height = 50;

  // const childNode2 = UIElement();
  // childNode2.backgroundColor = "yellow";
  // childNode2.dimensions.width = 400;
  // childNode2.dimensions.height = 200;
  // childNode2.layout.sizing.width.size.minMax.min = 100;
  // childNode2.layout.sizing.width.size.minMax.max = 200;
  // childNode2.children = [childNode1];

  // const rootNode = UIElement();
  // rootNode.layout.padding = {
  //   top: 32,
  //   right: 32,
  //   left: 32,
  //   bottom: 32,
  // };
  // rootNode.dimensions.width = 500;
  // rootNode.dimensions.height = 500;
  // rootNode.layout.childGap = 32;
  // rootNode.backgroundColor = "blue";
  // rootNode.children = [childNode2];
  // populateLayoutElements(rootNode);
  // LAYOUT_ELEMENT_TREE_ROOTS.push(rootNode);
  // SizeContainersAlongAxis(true);
  // SizeContainersAlongAxis(false);

  // console.log(LAYOUT_ELEMENTS);
  // console.log(LAYOUT_ELEMENT_TREE_ROOTS);

function renderUI() {
  drawBackpackUI(ctx, player);
  temp_ui_elements.forEach((ui) => ui.draw());
  if (paused) {
    drawPauseOverlay();
    pauseOverlayAlpha = lerp(pauseOverlayAlpha, 1, pauseAlphaChangeRate);
  } else {
    pauseOverlayAlpha = 0;
  }
  renderTopStatsBar(); 
  drawQuestTracker();
  drawDialoguePrompt();
  drawIntroText();
  if (shopOpen) drawShopUI();

  temp_ui_elements.forEach((ui) => ui.draw());

  if (playState === "gameover") {
    drawGameOverScreen();
  }

  // Test code below for various UI elements. Can leave commented for now.
  // DrawPass(rootNode);
}

function handlePauseInput() {
  if (keys.pause && !pressedPause) {
    paused = !paused;
    pressedPause = true;
  }
  if (!keys.pause) pressedPause = false;
}

function handleMuteInput() {
  if ((keys.mute && !pressedMute)) {
    pressedMute = true;
    muted = !muted
    
    if (muted){
      muteAllSounds();
    }
    else {
      unmuteAllSounds();
    }
  }
  if (!keys.mute) pressedMute = false;
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
            const sellMessage = new TextEntity(`Sold ${item.name} for ${sellPrice} gold`, canvas.width / 4, canvas.height / 2 + 150, "yellow", 0, -20, 3, "32px Arial");
            temp_ui_elements.push(sellMessage);
        } else {
            if (player.gold >= item.cost) {
                player.gold -= item.cost;
                player.inventory.push(cloneItem(item));
                console.log(`Bought ${item.name}`);

                const buyMessage = new TextEntity(`You bought ${item.name}`, canvas.width / 4, canvas.height / 2 + 150, "yellow", 0, -20, 3, "32px Arial");
                temp_ui_elements.push(buyMessage);

            } else {
                console.log("Not enough gold!");
                const noMoneyMessage = new TextEntity(`Not enough gold to buy ${item.name}!`, canvas.width / 4, canvas.height / 2 + 150, "yellow", 0, -20, 2, "32px Arial");
                temp_ui_elements.push(noMoneyMessage);
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
  projectiles.forEach((p) => p.update(collisionGrid, destructibles));
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
  var guix = 5+HUD_BAR_WIDTH+5+HUD_BAR_WIDTH+5;
  var guiy = 5;
  var guiw = HUD_BAR_WIDTH;
  var guih = 30;
  colorRect(guix, guiy, guiw, guih, "rgba(0, 0, 0, 0.5)");
  drawTextWithShadow(
    `Gold: ${player.gold}`,
    guix+5,
    guiy+20,
    UI_TEXT_STYLES.DEFAULT.textColor,
    UI_TEXT_STYLES.DEFAULT.font,
    UI_TEXT_STYLES.DEFAULT.align
  );
  // actually draw each gold coin in stacks of ten! =)
  for (let n = 0; n < player.gold; n++) {
    let x = guix + 65 + Math.floor(n / 10) * 12;
    let y = guiy+20 + (n % 10) * -2;
    ctx.drawImage(coinPic, x, y);
  }
}

function drawQuestCounts() {
    //console.log("drawQuestCounts eggs="+quests.yesYourEggcellence.eggsFound+" mushrooms="+quests.yesYourEggcellence.mushroomsFound);
    var guix = 5+HUD_BAR_WIDTH+5+HUD_BAR_WIDTH+5+HUD_BAR_WIDTH-18;
    var guiy = 7;
    for (let n = 0; n < quests.yesYourEggcellence.eggsFound; n++) {
        let x = guix-n*4;
        let y = guiy;
        //ctx.drawImage(eggPic, x, y);
        ctx.drawImage(chickenPic,4*16,0,16,16,x,y,16,16); // it's on this spritesheet
    }
    for (let n = 0; n < quests.yesYourEggcellence.mushroomsFound; n++) {
        let x = guix-n*4;
        let y = guiy+10;
        ctx.drawImage(mushroomPic, x, y);
    }
}

function drawSeason(currentWeather){
    var guix = 130;
    var guiy = 5;
    var guiw = 70;
    var guih = 30;
    colorRect(guix, guiy, guiw, guih, "rgba(0, 0, 0, 0.5)");

  const season = {
    rain : bluethermometerPic,
    clear : redthermometerPic,
    tx : 175,
    ty : 8,
    tsize : 24
  }
  
  if (currentWeather === "clear"){
    ctx.drawImage(season.clear, season.tx ,season.ty, season.tsize, season.tsize)
  }
  else {
    ctx.drawImage(season.rain, season.tx ,season.ty, season.tsize, season.tsize)

  }
  let text = currentWeather + ":";
  drawTextWithShadow(text, 140, 25, UI_TEXT_STYLES.DEFAULT.textColor, UI_TEXT_STYLES.DEFAULT.font, "left")
}

function drawArrowCount() {
  let guix = 5+HUD_BAR_WIDTH+5+HUD_BAR_WIDTH+5+HUD_BAR_WIDTH+5;
  let guiy = 5;
  let guiw = HUD_BAR_WIDTH - 5; // this -5 is a hack for nice margin on the right
  let guih = 30;
  let text = `Arrows: ${player.arrows}/${player.maxArrows}`;
  colorRect(guix, guiy, guiw, guih, "rgba(0, 0, 0, 0.5)");
  drawTextWithShadow(text, guix+5, guiy+20, UI_TEXT_STYLES.DEFAULT.textColor, UI_TEXT_STYLES.DEFAULT.font, "left");
  // actually draw each arrow =)
  let w = 16;
  let h = 20;
  let spacing = 6;
  for (let n = 0; n < player.arrows; n++) {
    ctx.drawImage(boltPic,0,0,w,h,guix+90+n*spacing,guiy+5,w,h);
  }  
}


function drawPauseOverlay() {
  ctx.globalAlpha = pauseOverlayAlpha;
  colorRect(0, 0, canvas.width, canvas.height, "#000000AA");
  ctx.textAlign = "center";
  let movement_offset = Math.sin(frameCount * (pauseTextMovementFrequency)) * pauseTextMovementAmplitude;
  let x = canvas.width/2;
  let y = canvas.height/2;
  let shadow_offset_x = 2;
  let shadow_offset_y = 2;
  colorText("PAUSED", x+shadow_offset_x, y+shadow_offset_y + movement_offset, "orange", 32, "FantasyFont");
  colorText("PAUSED", x, y + movement_offset, "yellow", 32, "FantasyFont");
  ctx.globalAlpha = 1;
}

function drawWorldItem(item) {
  if (item.sprite instanceof Image && item.sprite.complete) {
    ctx.drawImage(item.sprite, item.x, item.y, TILE_W, TILE_H);
  } else {
    ctx.fillStyle = "orange";
    ctx.fillRect(item.x, item.y, TILE_W, TILE_H);
  }
}

function drawBuildings() {
  drawVillagerHouses();
  for (let key in buildings) {
    const b = buildings[key];
    ctx.drawImage(b.image, b.sX, b.sY, b.sW, b.sH, b.x, b.y, b.width, b.height);
  }
}

// placeholder extra houses of varying size
// all using the same image (nine-slice style)
function drawVillagerHouses(){
   if (currentMapKey == "fallDale") {
     drawAnyHouse(14,13,8,5);
     drawAnyHouse(14,21,7,7);
     drawAnyHouse(31,21,5,7);
     drawAnyHouse(36,2,6,6);
   }
}

function drawAnyHouse(x,y,w,h) {
   let s=32;
   // top left
   ctx.drawImage(villagerHousesPic,0*s,0*s,w*s,h*s,x*s,y*s,w*s,h*s);
   // bottom left
   ctx.drawImage(villagerHousesPic,0*s,6*s,w*s,2*s,x*s,y*s+(h-2)*s,w*s,2*s);
   // top right
   ctx.drawImage(villagerHousesPic,7*s,0*s,1*s,h*s,x*s+(w-1)*s,y*s,1*s,h*s);
   // bottom right
   ctx.drawImage(villagerHousesPic,7*s,6*s,1*s,2*s,x*s+(w-1)*s,y*s+(h-2)*s,1*s,2*s);
 }

function drawStaminaBar() {
  let barColor = "rgba(0,100,0,1)";
  let barColor2 = "rgba(0,50,0,1)";
  let emptyColor = "rgba(128,0,0,0.5)";
  if (player.currentStamina < 30) barColor = "orange";
  if (player.currentStamina < 10) barColor = "red";
  let x = 5+HUD_BAR_WIDTH+5;
  let y = 5;
  let width = HUD_BAR_WIDTH;
  let height = 30;
  let margin = 5;
  let barW = 1;
  let barH = 16; 
  let fillWidth = (player.currentStamina / player.maxStamina) * (width-margin-margin);
  // bg
  colorRect(x, y, width, height, "rgba(0, 0, 0, 0.5)");
  // green part
  // a single solid rectangle:
  // colorRect(x+margin, y+margin, fillWidth, height-margin-margin, barColor);
  // as lines just to be fancy
  for (let i=0; i<Math.ceil(fillWidth/6); i++) {
    colorRect(x+margin+(i*6), y+margin, 3, height-margin-margin, barColor);
    colorRect(x+margin+(i*6)+3, y+margin, 3, height-margin-margin, barColor2);
  }
  // red part
  colorRect(x+margin+fillWidth, y+margin, width-margin-margin-fillWidth, height-margin-margin, emptyColor);
  // numbers
  drawTextWithShadow("Stamina: "+Math.round(player.currentStamina), x+10, y+19, UI_TEXT_STYLES.DEFAULT.textColor, UI_TEXT_STYLES.DEFAULT.font, "left");
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
    
    // play door opening sound if we just entered this frame
    if (!building.insidebuilding) unlockDoorSound.play();
    
    building.insidebuilding = true;
  } else {
    building.sX = 0;
    // play door closing sound if we just exited this frame
    if (building.insidebuilding) unlockDoorSound.play();
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
  if (inventoryOpen) {
    player.cancelPath();
  }
}


