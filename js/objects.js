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
  let playerTileX = Math.floor(player.x / TILE_W);
  let playerTileY = Math.floor(player.y / TILE_H);

  let nextX = playerTileX + dirX;
  let nextY = playerTileY + dirY;

  let block = pushableBlocks.find(b => b.x === nextX && b.y === nextY);
  if (block && !block.isMoving) {
    let pushX = block.x + dirX;
    let pushY = block.y + dirY;

    let canPush = collisionGrid[pushY]?.[pushX]?.isWalkable &&
                  !pushableBlocks.some(b => b.x === pushX && b.y === pushY);

    if (canPush) {
      block.x = pushX;
      block.y = pushY;
      block.targetX = pushX * TILE_W;
      block.targetY = pushY * TILE_H;
      block.isMoving = true;
      return true;
      camera.applyShake(2, 200);
    }
    return false;
  }

  return null;
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
      // Update block position
      block.x = newBlockX;
      block.y = newBlockY;
      block.targetX = newBlockX * TILE_W;
      block.targetY = newBlockY * TILE_H;
      block.isMoving = true;

      // Move player in the opposite direction
      movePlayer(dirX * player.currentSpeed, dirY * player.currentSpeed, getDirectionName(dirX, dirY));
      return true;
    }
  }

  return false;
}

function getDirectionName(dx, dy) {
  if (dx === 1) return "EAST";
  if (dx === -1) return "WEST";
  if (dy === -1) return "NORTH";
  if (dy === 1) return "SOUTH";
  return "NONE";
}


  
  