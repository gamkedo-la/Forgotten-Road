const pushableBlocks = [];

let plateToDoorLinks = {}; // "col,row" -> "doorCol,doorRow"

// Finds the nearest LOCKED/UNLOCKED door tile to a plate.
// Prefers a LOCKED door (49) at link time.
function findNearestDoorForPlate(plateCol, plateRow) {
  let best = null, bestDist = Infinity;
  for (let r = 0; r < TILE_ROWS; r++) {
    for (let c = 0; c < TILE_COLS; c++) {
      const t = backgroundGrid[r][c];
      if (t === TILE_LOCKED_DOOR || t === TILE_UNLOCKED_DOOR) {
        const d = Math.abs(c - plateCol) + Math.abs(r - plateRow);
        const isBetter = d < bestDist || (d === bestDist && t === TILE_LOCKED_DOOR);
        if (isBetter) { best = { c, r, t }; bestDist = d; }
      }
    }
  }
  return best; // {c, r, t} or null
}

function isTileOccupiedByPushBlock(tileX, tileY) {
  return pushableBlocks.some(block => block.x === tileX && block.y === tileY);
}  

function tryPushBlock(player, dirX, dirY) {
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const playerTileX = Math.floor(playerCenterX / TILE_W);
  const playerTileY = Math.floor(playerCenterY / TILE_H);

  const nextX = playerTileX + dirX;
  const nextY = playerTileY + dirY;

  const block = pushableBlocks.find(b => b.x === nextX && b.y === nextY);
  if (block && !block.isMoving) {
    const pushX = block.x + dirX;
    const pushY = block.y + dirY;

    const canPush = collisionGrid[pushY]?.[pushX]?.isWalkable &&
                    !pushableBlocks.some(b => b.x === pushX && b.y === pushY);

    if (canPush) {
      const STAMINA_COST_PUSH = 5;
      if (!player.canPerformAction(STAMINA_COST_PUSH)) {
        console.log("Too tired to push!");
        return false;
      }

      player.useStamina(STAMINA_COST_PUSH);

      block.x = pushX;
      block.y = pushY;
      block.targetX = pushX * TILE_W;
      block.targetY = pushY * TILE_H;
      block.isMoving = true;

      camera.applyShake(2, 100);

      return true;
    }

    return false; // Tile blocked
  }

  return null; // No block to push
}

function tryPullBlock(player, dirX, dirY) {
  const playerTileX = Math.floor(player.x / TILE_W);
  const playerTileY = Math.floor(player.y / TILE_H);

  const behindX = playerTileX - dirX;
  const behindY = playerTileY - dirY;

  const block = pushableBlocks.find(b => b.x === behindX && b.y === behindY);
  if (block && !block.isMoving) {
    const newBlockX = block.x + dirX;
    const newBlockY = block.y + dirY;

    const canMove = collisionGrid[newBlockY]?.[newBlockX]?.isWalkable &&
                    !pushableBlocks.some(b => b.x === newBlockX && b.y === newBlockY);

    if (canMove) {
      const STAMINA_COST_PULL = 7;
      if (!player.canPerformAction(STAMINA_COST_PULL)) {
        console.log("Too tired to pull!");
        return false;
      }

      player.useStamina(STAMINA_COST_PULL);

      // Move block
      block.x = newBlockX;
      block.y = newBlockY;
      block.targetX = newBlockX * TILE_W;
      block.targetY = newBlockY * TILE_H;
      block.isMoving = true;

      // Move player in the opposite direction
      movePlayer(dirX * player.currentSpeed, dirY * player.currentSpeed, getDirectionName(dirX, dirY));

      camera.applyShake(1, 100);

      return true;
    }

    return false; // Block cannot move forward
  }
  return null; // No block behind player
}

function getDirectionName(dx, dy) {
  if (dx === 1) return "EAST";
  if (dx === -1) return "WEST";
  if (dy === -1) return "NORTH";
  if (dy === 1) return "SOUTH";
  return "NONE";
}

function isCrateOnPlate(plateCol, plateRow) {
  return crates.some(crate => crate.col === plateCol && crate.row === plateRow);
}

function updatePressurePlates() {
  // 1) Build links once per map: each plate -> nearest door
  if (!Object.keys(plateToDoorLinks).length) {
    for (let row = 0; row < TILE_ROWS; row++) {
      for (let col = 0; col < TILE_COLS; col++) {
        if (backgroundGrid[row][col] === TILE_PRESSURE_PLATE) {
          const door = findNearestDoorForPlate(col, row);
          if (door && door.t === TILE_LOCKED_DOOR) {
            plateToDoorLinks[`${col},${row}`] = `${door.c},${door.r}`;
          }
        }
      }
    }
  }

  // 2) Determine which linked doors should be open this frame
  const doorsToOpen = new Set();
  for (const plateKey of Object.keys(plateToDoorLinks)) {
    const [pCol, pRow] = plateKey.split(",").map(Number);
    const pressed = pushableBlocks.some(b => b.x === pCol && b.y === pRow);
    const doorKey = plateToDoorLinks[plateKey];
    if (pressed) doorsToOpen.add(doorKey);
  }

  // 3) Apply open/close to linked doors
  for (const plateKey of Object.keys(plateToDoorLinks)) {
    const doorKey = plateToDoorLinks[plateKey];
    const [dCol, dRow] = doorKey.split(",").map(Number);
    const shouldOpen = doorsToOpen.has(doorKey);

    if (shouldOpen) {
      backgroundGrid[dRow][dCol] = TILE_UNLOCKED_DOOR;
      if (collisionGrid[dRow] && collisionGrid[dRow][dCol]) {
        collisionGrid[dRow][dCol].isWalkable = true;
      }
    } else {
      backgroundGrid[dRow][dCol] = TILE_LOCKED_DOOR;
      if (collisionGrid[dRow] && collisionGrid[dRow][dCol]) {
        collisionGrid[dRow][dCol].isWalkable = false;
      }
    }
  }
}





  
  
