class Monster extends Entity {
    constructor(name, x, y, health, damage, loot) {
        super(name, x, y, health, damage);
        this._loot = loot;  // e.g., gold or items
        this.color = "red";
        this.width = 32;
        this.height = 32;
        this.attackCooldown = 0; 
        this.cooldownTime = 1000; 
        this.lastAttackTime = 0;
        this.facing = "left";            
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

    fireAtPlayerIfInRange(player, projectiles, collisionGrid) {
        if (this.isDead) {
            console.log("Enemy is dead.");
            return;
        }
    
        const now = performance.now();
    
        if (now - this.lastAttackTime < this.cooldownTime) {
     //       console.log("Cooldown not met.");
            return;
        }
    
        const dx = player.x - this.x;
        const dy = player.y - this.y;
    
        const distX = Math.abs(Math.floor(dx / TILE_W));
        const distY = Math.abs(Math.floor(dy / TILE_H));
    
        const totalDistance = distX + distY;
        if (totalDistance > 8) {
         //   console.log("Player out of range.");
            return;
        }
    
        let direction = null;
    
        if (distX === 0 && dy !== 0) {
            direction = dy > 0 ? "down" : "up";
        } else if (distY === 0 && dx !== 0) {
            direction = dx > 0 ? "right" : "left";
        }
    
        //console.log("Player direction relative to enemy:", direction);
       // console.log("Enemy facing:", this.facing);
    
        if (!direction || this.facing !== direction) {
        //    console.log("Enemy not facing player.");
            return;
        }
    
        const bolt = new Projectile(this.x, this.y, this.facing, 4, "enemy", this);
        projectiles.push(bolt);
        
        this.lastAttackTime = now;
        console.log(`${this.name} fires a bolt at ${player.name}`);
    }
        
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.isDead){
            colorText("Dead", this.x, this.y+22, "white", fontSize = 12)
        }
    }
}
