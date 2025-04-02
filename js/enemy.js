const BEHAVIOR_STATES = {
    IDLE: "idle",
    PATROL: "patrol",
    CHASE: "chase",
    LOST: "lost",
    KITE: "kite",
    FLEE: "flee",
    WANDER: "wander"
};

var DEBUG_turnOffEnemy_AI_ToAvoidFreeze = false;

class Monster extends Entity {
    constructor(name, x, y, health, damage, loot, combatType = "melee") {
        super(name, x, y, health, damage);
        this._loot = loot;
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
        //this.image = enemyPic;
        this.lastPathTime = 0;
        this.pathCooldown = 1000;
        this.state = BEHAVIOR_STATES.IDLE;
        this.pathIndex = 0;
        this.speed = 1;
        this.combatType = combatType;
        this.isDying = false;
        this.deathFrame = 0;
        this.maxDeathFrames = 8; 
        this.removalStarted = false;
        if (name === "Goblin") {
            this.behavior = "melee";
            this.image = goblinPic;
            this.maxHP = 20;
            this.currentHP = 20;
        } else if (name === "Kobold") {
            this.behavior = "ranged";
            this.image = koboldPic;
            this.maxHP = 15;
            this.currentHP = 15;
        } else if (name === "Skeleton") {
            this.behavior = "resilient";
            this.image = skeletonPic;
            this.maxHP = 25;
            this.currentHP = 25;
        } else if (name === "Orc") {
            this.behavior = "melee";
            this.image = orcPic;
            this.maxHP = 40;
            this.currentHP = 40;
            this.width = 40;
            this.height = 40;
            this.speed = 0.8; 
        }
        
        
        this.patrolPath = [
            { x: Math.floor(this.x / TILE_W) + 1, y: Math.floor(this.y / TILE_H) },
            { x: Math.floor(this.x / TILE_W), y: Math.floor(this.y / TILE_H) + 1 },
            { x: Math.floor(this.x / TILE_W) - 1, y: Math.floor(this.y / TILE_H) },
            { x: Math.floor(this.x / TILE_W), y: Math.floor(this.y / TILE_H) - 1 },
        ];
    }
    

    get loot() { return this._loot; }

    attack(target) {
        if (target instanceof Player) {
            target.health -= this.damage;
        }
    }

    placeAtRandomPosition(minDistanceFromPlayer = 5) {
        let validSpawnPositions = [];

        const playerGridCol = Math.floor(player.x / TILE_W);
        const playerGridRow = Math.floor(player.y / TILE_H);

        for (let row = 0; row < TILE_ROWS; row++) {
            for (let col = 0; col < TILE_COLS; col++) {
                if (!backgroundGrid[row] || backgroundGrid[row][col] === undefined) continue;
                if (backgroundGrid[row][col] === TILE_WALL) continue;

                const distX = Math.abs(col - playerGridCol);
                const distY = Math.abs(row - playerGridRow);
                const distance = Math.sqrt(distX * distX + distY * distY);

                if (distance >= minDistanceFromPlayer) {
                    validSpawnPositions.push({ col, row });
                }
            }
        }

        if (validSpawnPositions.length === 0) {
            console.error("No valid spawning positions found!");
            return false;
        }

        const spawnPos = validSpawnPositions[Math.floor(Math.random() * validSpawnPositions.length)];
        this.x = spawnPos.col * TILE_W;
        this.y = spawnPos.row * TILE_H;
        return true;
    }

    fireAtPlayerIfInRange(player, projectiles, collisionGrid) {
        if (this.isDead || this.combatType !== "ranged") return;

        const now = performance.now();
        if (now - this.lastAttackTime < this.cooldownTime) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distX = Math.abs(Math.floor(dx / TILE_W));
        const distY = Math.abs(Math.floor(dy / TILE_H));

        const totalDistance = distX + distY;
        if (totalDistance > 8) return;

        let direction = null;
        if (distX === 0 && dy !== 0) direction = dy > 0 ? "down" : "up";
        else if (distY === 0 && dx !== 0) direction = dx > 0 ? "right" : "left";

        if (!direction || this.facing !== direction) return;

        const bolt = new Projectile(this.x, this.y, this.facing, 4, "enemy", this);
        projectiles.push(bolt);
        this.lastAttackTime = now;
        console.log(`${this.name} fires a bolt at ${player.name}`);
    }

    canSeePlayer(player, visionRadius = 6) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
    
        if (dist > visionRadius * TILE_W) {
            return false; // out of range
        }
    
        const steps = Math.ceil(dist / TILE_W);
        for (let i = 1; i < steps; i++) {
            const checkX = Math.floor(this.x + (dx * i) / steps);
            const checkY = Math.floor(this.y + (dy * i) / steps);
    
            const tileCol = Math.floor(checkX / TILE_W);
            const tileRow = Math.floor(checkY / TILE_H);
    
            if (collisionGrid[tileRow]?.[tileCol] === TILE_WALL) {
                return false; // blocked by wall
            }
        }
    
        return true; // no obstructions
    }
    

    moveAwayFrom(target) {
        const dx = this.x - target.x;
        const dy = this.y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
    
        if (dist > 0) {
            this.facing = Math.abs(dx) > Math.abs(dy)
                ? (dx > 0 ? "right" : "left")
                : (dy > 0 ? "down" : "up");
    
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
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
        const now = performance.now();
        if (now - this.lastPathTime < this.pathCooldown) return;

        this.lastPathTime = now;

        const startX = Math.floor(this.x / TILE_W);
        const startY = Math.floor(this.y / TILE_H);
        const endX = Math.floor(player.x / TILE_W);
        const endY = Math.floor(player.y / TILE_H);

        if (startX === endX && startY === endY) return;

        const path = findPath(startX, startY, endX, endY, collisionGrid);
        if (path && path.length > 0) {
            this.setPath(path);
            this.state = BEHAVIOR_STATES.CHASE;
            console.log(`${this.name} found path of ${path.length} steps`);
        }
    }

    followPath() {
        if (!this.path || this.path.length === 0) {
       //     console.warn(`${this.name} has no path to follow`);
            return;
        }
    
        const next = this.path[0];
        const dx = next.x * TILE_W - this.x;
        const dy = next.y * TILE_H - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = this.speed;
    
        if (Math.abs(dx) > Math.abs(dy)) {
            this.facing = dx > 0 ? "right" : "left";
        } else {
            this.facing = dy > 0 ? "down" : "up";
        }
    
        if (dist < 0.5) {
            this.x = Math.round(next.x * TILE_W);
            this.y = Math.round(next.y * TILE_H);
            this.path.shift();
        } else {
            this.x += (dx / dist) * speed;
            this.y += (dy / dist) * speed;
        }
    
      //  console.log(`${this.name} is following path, ${this.path.length} steps remaining`);
    }
    

    followPatrolPath() {
        if (!this.patrolPath) return;
        if (!this.path || this.path.length === 0) {
            this.setPath(this.patrolPath);
        } else {
            this.followPath();
        }
    }

    kiteAwayFrom(target) {
        const dx = this.x - target.x;
        const dy = this.y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > TILE_W * 5) {
            this.state = BEHAVIOR_STATES.CHASE;
            this.chooseNewPath(target, collisionGrid);
            return;
        }

        const moveX = (dx / dist) * this.speed;
        const moveY = (dy / dist) * this.speed;

        this.x += moveX;
        this.y += moveY;
    }

    funcwanderOrPatrol() {
        this.state = BEHAVIOR_STATES.PATROL;
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

    faceToward(target) {
        var dx = target.x - this.x;
        var dy = target.y - this.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            this.facing = dx > 0 ? "right" : "left";
        } else {
            this.facing = dy > 0 ? "down" : "up";
        }
    }

    draw(deltaTime) {
        let frameWidth = this.width;
        let srcX, srcY;
    
        // Skeleton dying animation
        if (this.isDying && this.sprite === "dying") {
            this.deathTimer += deltaTime;
    
            if (this.deathFrame < this.maxDeathFrames) {
                if (this.deathTimer > frameDuration) {
                    this.deathTimer = 0;
                    this.deathFrame++;
                }
            }
    
            // Clamp to final frame
            const frame = Math.min(this.deathFrame, this.maxDeathFrames - 1);
            srcX = frame * frameWidth;
            srcY = 4 * this.height; 
    
            ctx.drawImage(this.image, srcX, srcY, this.width, this.height, this.x, this.y, this.width, this.height);
    
            // After reaching final frame, delay removal
            if (this.deathFrame === this.maxDeathFrames && !this.removalStarted) {
                this.removalStarted = true;
                this.dropLoot();
    
                setTimeout(() => {
                    const index = enemies.indexOf(this);
                    if (index !== -1) {
                        enemies.splice(index, 1);
                        console.log(`${this.name} (skeleton) removed after animation.`);
                    }
                }, 3000);
            }
    
            return; // skip normal draw
        }
    
        // Normal walking / idle rendering
        this.walkTimer += deltaTime;
        if (this.walkTimer > frameDuration) {
            this.walkTimer = 0;
            this.currentWalkFrame = (this.currentWalkFrame + 1) % FRAMES_PER_ANIMATION;
        }
    
        srcX = this.currentWalkFrame * frameWidth;
        srcY = this.getDirectionIndex() * this.height;
    
        ctx.drawImage(this.image, srcX, srcY, this.width, this.height, this.x, this.y, this.width, this.height);
    
        if (this.isDead && !this.isDying) {
            colorText("Dead", this.x, this.y + 22, "white", 12);
        }
    }
}

function updateEnemy(enemy, player) {
    if (DEBUG_turnOffEnemy_AI_ToAvoidFreeze) return;

    if (enemy.health < enemy.maxHealth * 0.25) {
        if (enemy.state !== BEHAVIOR_STATES.FLEE) {
            console.log(`${enemy.name} is fleeing!`);
            enemy.state = BEHAVIOR_STATES.FLEE;
        }
    }
    
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    switch (enemy.state) {
    case BEHAVIOR_STATES.IDLE:
        if (enemy.canSeePlayer(player)) {
            console.log(`${enemy.name} spots the player while idle!`);
            enemy.state = BEHAVIOR_STATES.CHASE;
        }
    break;

    break;
    case BEHAVIOR_STATES.PATROL:
        // If no path or path is empty, find next patrol point
        if (!enemy.path || enemy.path.length === 0) {
            const target = enemy.patrolPath[enemy.pathIndex];
            const startX = Math.floor(enemy.x / TILE_W);
            const startY = Math.floor(enemy.y / TILE_H);
            const endX = target.x;
            const endY = target.y;
    
            if (collisionGrid[endY]?.[endX] !== TILE_WALL) {
                enemy.path = findPath(startX, startY, endX, endY, collisionGrid);
            } else {
                console.warn(`${enemy.name}'s patrol point is blocked`);
            }
    
            // Cycle to next point for next round
            enemy.pathIndex = (enemy.pathIndex + 1) % enemy.patrolPath.length;
        } else {
            enemy.followPath();
        }
    
        // Look for player while patrolling
        if (enemy.canSeePlayer(player)) {
            console.log(`${enemy.name} sees the player!`);
            enemy.state = BEHAVIOR_STATES.CHASE;
        }        
    break;    
    case BEHAVIOR_STATES.CHASE:
        console.log(`${enemy.name} is chasing the player!`);
        if (dist < TILE_W * 2) {
            enemy.state = BEHAVIOR_STATES.KITE;
        } else if (dist < TILE_W * 6) {
            const prevProjectileCount = projectiles.length;
            enemy.fireAtPlayerIfInRange(player, projectiles, collisionGrid);
            const didFire = projectiles.length > prevProjectileCount;
        
            if (didFire) {
                enemy.isMoving = false;
            } else {
                enemy.followPath(); // keep moving if didn't fire
            }
        } else {
            enemy.followPath();
            if (!enemy.path || enemy.path.length === 0) {
                if (dist < TILE_W * 8) {
                    enemy.chooseNewPath(player, collisionGrid);
                } else {
                    enemy.state = BEHAVIOR_STATES.IDLE;
                }
            }
        }
        break;
    case BEHAVIOR_STATES.KITE:
        console.log(`${enemy.name} is kiting`);
        if (dist < TILE_W * 2) {
            if (enemy.combatType === "ranged") {
                enemy.state = BEHAVIOR_STATES.KITE;
            } else {
                enemy.faceToward(player);
                const now = performance.now();
                if (now - enemy.lastAttackTime > enemy.cooldownTime) {
                    player.health -= enemy.damage;
                    enemy.lastAttackTime = now;
                    console.log(`${enemy.name} strikes ${player.name} in melee!`);
                }
            }
        }   
    case BEHAVIOR_STATES.LOST:
        console.log(`${enemy.name} is lost!`);
        enemy.funcwanderOrPatrol();
        break;
    case BEHAVIOR_STATES.FLEE:
        console.log(`${enemy.name} is fleeing!`);
        enemy.moveAwayFrom(player);
    break;
    case BEHAVIOR_STATES.WANDER:
        console.log(`${enemy.name} is wandering!`);
        if (!enemy.path || enemy.path.length === 0) {
            const dir = Math.floor(Math.random() * 4);
            const dx = [1, -1, 0, 0][dir];
            const dy = [0, 0, 1, -1][dir];

            const newX = Math.floor(enemy.x / TILE_W) + dx;
            const newY = Math.floor(enemy.y / TILE_H) + dy;

            if (
                collisionGrid[newY] &&
                collisionGrid[newY][newX] !== TILE_WALL
            ) {
                enemy.path = findPath(
                    Math.floor(enemy.x / TILE_W),
                    Math.floor(enemy.y / TILE_H),
                    newX,
                    newY,
                    collisionGrid
                );
            }
        } else {
            enemy.followPath();
        }
        // Line of sight check
        if (enemy.canSeePlayer(player)) {
            console.log(`${enemy.name} sees the player while wandering!`);
            enemy.state = BEHAVIOR_STATES.CHASE;
        }
    break;
    default:
        console.log(`${enemy.name} has no behavor state!`);
        enemy.moveAwayFrom(player);
    break;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
function assignDefaultPatrol(enemy) {
    const tileX = Math.floor(enemy.x / TILE_W);
    const tileY = Math.floor(enemy.y / TILE_H);
    const path = [
        { x: tileX + 1, y: tileY },
        { x: tileX, y: tileY + 1 },
        { x: tileX - 1, y: tileY },
        { x: tileX, y: tileY - 1 },
    ];
    enemy.patrolPath = shuffle(path);
}

function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
  
  