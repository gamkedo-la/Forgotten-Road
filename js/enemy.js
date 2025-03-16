class Monster extends Entity {
    constructor(name, x, y, health, damage, loot) {
        super(name, x, y, health, damage);
        this._loot = loot;  // e.g., gold or items
        this.color = "red";
        this.width = 32;
        this.height = 32;
    }

    // Getter for loot
    get loot() { return this.loot; }

    // Monster attack method
    attack(target) {
        if (target instanceof Player) {
            target.health -= this.damage;
            console.log(`${this.name} attacks ${target.name} for ${this.damage} damage!`);
        }
    }

    placeAtRandomPosition(minDistanceFromPlayer = 5) {
      let validSpawnPositions = [];
      let totalPositions = TILE_ROWS * TILE_COLS;
      let wallPositions = 0;
      let tooClosePositions = 0;
      
      const playerGridCol = Math.floor(player.x / TILE_W);
      const playerGridRow = Math.floor(player.y / TILE_H);
      
      console.log(`Player is at grid position (${playerGridCol}, ${playerGridRow})`);
      
      for (let row = 0; row < TILE_ROWS; row++) {
        for (let col = 0; col < TILE_COLS; col++) {  
            if (!backgroundGrid[row] || backgroundGrid[row][col] === undefined) {  
                console.warn(`Skipping undefined tile at row=${row}, col=${col}`);
                continue;
            }
    
            if (backgroundGrid[row][col] == TILE_WALL) {
                wallPositions++;
                continue;
            }       
            const distX = Math.abs(col - playerGridCol);
            const distY = Math.abs(row - playerGridRow);
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            if (distance >= minDistanceFromPlayer) {
                validSpawnPositions.push({ col, row });      
            } else {
                tooClosePositions++;
            }
          }
      }      
      console.log(`Spawn location analysis:`);
      console.log(`- Total grid positions: ${totalPositions}`);
      console.log(`- Unwalkable places e.g. Wall: ${wallPositions}`);
      console.log(`- Places too close to player: ${tooClosePositions}`);
      console.log(`- Valid spawn positions: ${validSpawnPositions.length}`);
      
      if (validSpawnPositions.length === 0) {
          console.error("No valid spawning positions found!");
          return false;
      }
      
      const randomIndex = Math.floor(Math.random() * validSpawnPositions.length);
      const spawnPos = validSpawnPositions[randomIndex];
      
      const spawnX = spawnPos.col * TILE_W;
      const spawnY = spawnPos.row * TILE_H;
      
      this.x = spawnX;
      this.y = spawnY;
      
      console.log(`Placed ${this.name} at grid position (${spawnPos.col}, ${spawnPos.row}), pixel coordinates (${spawnX}, ${spawnY})`);
      
      return true;
  }
}
