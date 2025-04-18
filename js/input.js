var pathfinderGrid = [];
let pressedInteract = false;

const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  action: false,
  pause: false,
  usePotion: false,
  sprint: false,
};

var mouse = { x: 0, y: 0, clicked: false, hoverObjects: null };

var { x: worldX, y: worldY } = screenToWorld(mouse.x, mouse.y);
var clickX = Math.floor(worldX / TILE_W);
var clickY = Math.floor(worldY / TILE_H);


gameCanvas.addEventListener("mousemove", (event) => {
  const rect = gameCanvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

gameCanvas.addEventListener("mousedown", (event) => {
  mouse.clicked = true;
  if (music.currentTime == 0) startIntro();
});

gameCanvas.addEventListener("click", (event) => {
  let rect = gameCanvas.getBoundingClientRect();

  // Screen coords
  let screenX = event.clientX - rect.left;
  let screenY = event.clientY - rect.top;
  
  // World coords
  let worldX = screenX + camera.x;
  let worldY = screenY + camera.y;
  
  let clickX = Math.floor(worldX / TILE_W);
  let clickY = Math.floor(worldY / TILE_H);
  

  let playerX = Math.floor(player.x / TILE_W);
  let playerY = Math.floor(player.y / TILE_H);

  if (!player.isMoving) {
    const path = findPath(playerX, playerY, clickX, clickY, collisionGrid);
    if (path.length > 0) {
      console.log("Click path to:", clickX, clickY);
      player.setPath(path);
    }
  }
});

function screenToWorld(x, y) {
  return {
    x: x + camera.x,
    y: y + camera.y
  };
}

// Key listeners
document.addEventListener("keydown", (event) => {
  if (player.state === "dead") return;

  // skip intro voiceovers
  console.log("keypress:"+event.key);
  if (event.key=='Escape') { skip_intro(); }


  // Handle active prompt
  if (dialoguePrompt && pendingQuest) {
    if (event.key.toLowerCase() === "y") {
      console.log("Quest accepted");
      pendingQuest();

      setTimeout(() => {
        dialoguePrompt = null;
        pendingQuest = null;
      }, 100);
    } else if (event.key.toLowerCase() === "n") {
      console.log("Quest declined");

      for (let npc of npcs) {
        const dx = player.x - npc.x;
        const dy = player.y - npc.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 40 && npc.name === "Old Man" && typeof npc.handleQuestDecline === "function") {
          npc.handleQuestDecline();
          break;
        }
      }

      setTimeout(() => {
        dialoguePrompt = null;
        pendingQuest = null;
      }, 100);
    }

    return; // Prevent other game input while prompt is active
  }

  // Movement
  if (event.key === "ArrowUp" || event.key === "w") keys.up = true;
  if (event.key === "ArrowDown" || event.key === "s") keys.down = true;
  if (event.key === "ArrowLeft" || event.key === "a") keys.left = true;
  if (event.key === "ArrowRight" || event.key === "d") keys.right = true;

  // Combat and action
  if (
    event.key === " " ||
    event.key === "f" ||
    event.key === "x" ||
    event.key === "z" ||
    event.key === "Control" ||
    event.key === "Shift"
  )
    keys.action = true;

  // Interact (X key)
  if (event.key === "x" && !pressedInteract) {
    console.log("[INPUT] X key pressed");
    pressedInteract = true;

    for (let npc of npcs) {
      const dx = player.x - npc.x;
      const dy = player.y - npc.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      console.log(`[NPC CHECK] ${npc.name} is ${dist.toFixed(1)}px away`);

      if (dist < 40) {
        console.log(`[NPC INTERACT] Triggering interact for ${npc.name}`);
        npc.interact();
        break;
      }
    }
  }

  // Pause
  if (event.key === "p") keys.pause = true;

  // Staff attack
  if (event.key === "f") {
    if (!player.isAttacking) {
      player.staffAttack(enemies);
      player.state = "attacking";
      player.currentAttackFrame = 0;
      player.attackTimer = 0;
    }
  }

  // Sprint
  if (event.key === "h") {
    if (player.isSprinting) {
      player.currentSpeed = player.baseSpeed;
      player.isSprinting = false;
    } else {
      player.currentSpeed = player.sprintSpeed;
      player.isSprinting = true;
    }
    keys.sprint = true;
  }
  if(event.key === 'Shift'){
    isPullingBlock = true;
  }
  if (event.key === "q") {
    player.isBlocking = true;
  }  
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp" || event.key === "w") keys.up = false;
  if (event.key === "ArrowDown" || event.key === "s") keys.down = false;
  if (event.key === "ArrowLeft" || event.key === "a") keys.left = false;
  if (event.key === "ArrowRight" || event.key === "d") keys.right = false;

  if (
    event.key === " " ||
    event.key === "f" ||
    event.key === "x" ||
    event.key === "z" ||
    event.key === "Control" ||
    event.key === "Shift"
  )
    keys.action = false;

  if (event.key === "p") keys.pause = false;

  if(event.key === 'Shift'){
    isPullingBlock = false;
  }
  if (event.key === "q") {
    player.isBlocking = false;
  }

  if (event.key === "r" && playState === "gameover") {
    restartGame();
  }

  if (event.key === "r") {
    player.fireProjectile();
  }
      
  if (event.key === "h") keys.sprint = false;
  if (event.key === "1") keys.usePotion = true;
  if (event.key === "x") pressedInteract = false;
});

function movePlayer(dx, dy, direction) {
  let newX = player.x + dx;
  let newY = player.y + dy;

  let tileX = Math.floor(newX / TILE_W);
  let tileY = Math.floor(newY / TILE_H);

  if (isWalkable(tileY, tileX)) {
    player.x = newX;
    player.y = newY;
  }

  const directionFacingMap = {
    NORTH: "up",
    SOUTH: "down",
    EAST: "right",
    WEST: "left",
  };

  player.facing = directionFacingMap[direction];
}
