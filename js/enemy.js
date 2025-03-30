var DEBUG_turnOffEnemy_AI_ToAvoidFreeze = true;
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
        this.currentWalkFrame = 0;
        this.walkTimer = 0;
        this.attackTimer = 0;
        this.image = enemyPic; // fixme: override in specific child class 
        this.lastPathTime = 0;
        this.pathCooldown = 1000; 
        const BEHAVIOR_STATES = {
            IDLE: "idle",
            PATROL: "patrol",
            CHASE: "chase",
            LOST: "lost",
        };
        this.state = BEHAVIOR_STATES.IDLE;
    }

    // Getter for loot
    get loot() { return this.loot; }

    // Monster attack method
    attack(target) {
        if (target instanceof Player) {
            target.health -= this.damage;
            //console.log(`${this.name} attacks ${target.name} for ${this.damage} damage!`);
        }
    }

    

    placeAtRandomPosition(minDistanceFromPlayer = 5) {
      let validSpawnPositions = [];
      let totalPositions = TILE_ROWS * TILE_COLS;
      let wallPositions = 0;
      let tooClosePositions = 0;
      
      const playerGridCol = Math.floor(player.x / TILE_W);
      const playerGridRow = Math.floor(player.y / TILE_H);
      
      //console.log(`Player is at grid position (${playerGridCol}, ${playerGridRow})`);
      
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
      //console.log(`Spawn location analysis:`);
      //console.log(`- Total grid positions: ${totalPositions}`);
      //console.log(`- Unwalkable places e.g. Wall: ${wallPositions}`);
      //console.log(`- Places too close to player: ${tooClosePositions}`);
      //console.log(`- Valid spawn positions: ${validSpawnPositions.length}`);
      
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
      
      //console.log(`Placed ${this.name} at grid position (${spawnPos.col}, ${spawnPos.row}), pixel coordinates (${spawnX}, ${spawnY})`);
      
      return true;
    }

    fireAtPlayerIfInRange(player, projectiles, collisionGrid) {
        if (this.isDead) {
            //console.log("Enemy is dead.");
            return;
        }
    
        const now = performance.now();
    
        if (now - this.lastAttackTime < this.cooldownTime) {
        //console.log("Cooldown not met.");
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

    tryToChasePlayer(enemy, player) {
        const path = findPath(enemy.x, enemy.y, player.x, player.y);
      
        if (path && path.length > 0) {
          enemy.path = path;
          enemy.state = BEHAVIOR_STATES.CHASE;
        } else {
          console.warn("Goblin couldn't find a path!");
          enemy.state = BEHAVIOR_STATES.LOST;
          enemy.path = null;
        }
    }

    funcwanderOrPatrol() {
        if (!this.patrolPath) {
          // Simple square patrol
          this.patrolPath = [
            { x: this.x + 1, y: this.y },
            { x: this.x, y: this.y + 1 },
            { x: this.x - 1, y: this.y },
            { x: this.x, y: this.y - 1 },
          ];
        }
        this.state = BEHAVIOR_STATES.PATROL;
      }


    // FIXME: this is identical to code found in player class
    // move to Entity parent class and share the code
    updateMovement() {
        if (this.path && this.path.length > 0) {
            const next = this.path[this.pathIndex];
            if (next) {
                this.x = next.x * TILE_W;
                this.y = next.y * TILE_H;
                this.pathIndex++;
    
                if (this.pathIndex >= this.path.length) {
                    this.path = null; // reached end
                    this.pathIndex = 0;
                }
            }
        }
    }
    
     


    setPath(path) {
        this.path = path;
        if (this.path.length > 0) {
            this.moveTarget = {
                x: this.path[0].x * TILE_W,
                y: this.path[0].y * TILE_H
            };
            this.isMoving = true;
        }
    }  

    chooseNewPath(player, collisionGrid) {                  
        if (this.path && this.path.length > 0) {
            return; // Already has a path, no need to re-find
        }
        
        const now = performance.now(); // changed from Date.now()
        if (now - this.lastPathTime < this.pathCooldown) {
            return; 
        }
    
        this.lastPathTime = now;
    
        const startX = Math.floor(this.x / TILE_W);
        const startY = Math.floor(this.y / TILE_H);
        const endX = Math.floor(player.x / TILE_W);
        const endY = Math.floor(player.y / TILE_H);
    
        if (startX === endX && startY === endY) return;
    
        const path = findPath(startX, startY, endX, endY, collisionGrid);
    
        if (path && path.length > 0) {
            this.setPath(path);
            console.log(`${this.name} found path of ${path.length} steps`);
        } else {
       //     console.warn(`${this.name} couldn't find a path!`);
        }
    }    

    getDirectionIndex() {
        switch (this.facing) {
            case "up": return 0;
            case "left": return 3;
            case "right": return 1;
            case "down": return 2;
            default: return 2;
        }
    }       

    draw(deltaTime){

        let frameWidth, srcX, srcY;
    
        if (this.state === "attacking") {
            this.attackTimer += deltaTime;
            if (this.attackTimer > frameDuration) {
                this.attackTimer = 0;
                this.currentAttackFrame++;
    
                if (this.currentAttackFrame >= FRAMES_PER_ANIMATION) {
                    this.currentAttackFrame = 0;
                    this.state = "idle";
                }
            }
    
            frameWidth = this.width;
            srcX = 32+FRAME_WALK_WIDTH * FRAMES_PER_ANIMATION + this.currentAttackFrame * frameWidth;
            srcY = this.getDirectionIndex() * this.height;
    
        } else {
            // Walking or idle
            this.walkTimer += deltaTime;
            if (this.walkTimer > frameDuration) {
                this.walkTimer = 0;
                this.currentWalkFrame = (this.currentWalkFrame + 1) % FRAMES_PER_ANIMATION;
            }
    
            frameWidth = this.width;
            srcX = this.currentWalkFrame * frameWidth;
            srcY = this.getDirectionIndex() * this.height;
        }
    
        // red debug square
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        // draw enemy sprite
        // console.log("enemy draw: srcX="+srcX+" srcY="+srcY+" frameWidth="+frameWidth+" FRAME_HEIGHT="+FRAME_HEIGHT+" this.x="+this.x+" this.y="+this.y);
        ctx.drawImage(this.image, srcX, srcY, frameWidth, FRAME_HEIGHT, this.x, this.y, frameWidth, FRAME_HEIGHT);

        if(this.isDead){
            colorText("Dead", this.x, this.y+22, "white", fontSize = 12)
        }
    }
}

function updateEnemy(enemy, player) {
    switch (enemy.state) {
     /* case BEHAVIOR_STATES.IDLE:
        // Do nothing
        break;
        
      case BEHAVIOR_STATES.PATROL:
        followPatrolPath(enemy);
        break;
  
      case BEHAVIOR_STATES.CHASE:
        followPath(enemy);
        if (enemy.path.length === 0) {
          enemy.state = BEHAVIOR_STATES.IDLE;
        }
        break;
  
      case BEHAVIOR_STATES.LOST:
        // Behavior when pathing fails
        wanderOrPatrol(enemy);
        break;
        */
    }
       
  }