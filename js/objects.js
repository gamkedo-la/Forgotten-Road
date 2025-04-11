const pushableBlocks = [
    { x: 12, y: 10, width: TILE_W, height: TILE_H }
  ];

function tryPushBlock(player, dirX, dirY) {
    let playerTileX = Math.floor(player.x / TILE_W);
    let playerTileY = Math.floor(player.y / TILE_H);

    let nextX = playerTileX + dirX;
    let nextY = playerTileY + dirY;

    let block = pushableBlocks.find(b => b.x === nextX && b.y === nextY);
    if (block) {
        let pushX = block.x + dirX;
        let pushY = block.y + dirY;

        let canPush = collisionGrid[pushY]?.[pushX]?.isWalkable &&
                        !pushableBlocks.some(b => b.x === pushX && b.y === pushY);
        if (canPush) {
        block.x = pushX;
        block.y = pushY;
        return true; // Block was pushed
        }
        return false; // Block blocked
    }

    return null; // No block to push
 }
  
  