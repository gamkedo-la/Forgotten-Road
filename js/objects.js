const pushableBlocks = [
  {
    x: 8,
    y: 10,
    width: TILE_W,
    height: TILE_H,
    isMoving: false,
    targetX: 8 * TILE_W,
    targetY: 10 * TILE_H
  }
];


function isTileOccupiedByPushBlock(tileX, tileY) {
  return pushableBlocks.some(block => block.x === tileX && block.y === tileY);
}  

function tryPushBlock(player, dirX, dirY) {
  const playerTileX = Math.floor(player.x / TILE_W);
  const playerTileY = Math.floor(player.y / TILE_H);

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
  for (let row = 0; row < TILE_ROWS; row++) {
    for (let col = 0; col < TILE_COLS; col++) {
      if (backgroundGrid[row][col] === TILE_PRESSURE_PLATE) {
        const isOnPlate = pushableBlocks.some(block => block.x === col && block.y === row);

        if (isOnPlate) {
          backgroundGrid[1][12] = TILE_TREE;
          console.log(`Pressure plate at (${col}, ${row}) is pressed.`);
        }
      }
    }
  }
}




  
  