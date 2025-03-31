const BEHAVIOR_STATES = {
    IDLE: "idle",
    PATROL: "patrol",
    CHASE: "chase",
    LOST: "lost",
    KITE: "kite" //backing away from player
};

var DEBUG_turnOffEnemy_AI_ToAvoidFreeze = false;

class Monster extends Entity {
    constructor(name, x, y, health, damage, loot) {
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
        this.image = enemyPic;
        this.lastPathTime = 0;
        this.pathCooldown = 1000;
        this.state = BEHAVIOR_STATES.IDLE;
        this.pathIndex = 0;
        this.speed = 1;
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
        if (this.isDead) return;

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
        if (this.path && this.path.length > 0) return;

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
        if (this.path && this.path.length > 0) {
            const next = this.path[0];
            const dx = next.x * TILE_W - this.x;
            const dy = next.y * TILE_H - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = this.speed;
    
            // 👉 Update facing
            if (Math.abs(dx) > Math.abs(dy)) {
                this.facing = dx > 0 ? "right" : "left";
            } else {
                this.facing = dy > 0 ? "down" : "up";
            }
    
            if (dist < speed) {
                this.x = next.x * TILE_W;
                this.y = next.y * TILE_H;
                this.path.shift();
            } else {
                this.x += (dx / dist) * speed;
                this.y += (dy / dist) * speed;
            }
        }
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
            return;
        }
    
        const moveX = (dx / dist) * this.speed;
        const moveY = (dy / dist) * this.speed;
    
        this.x += moveX;
        this.y += moveY;
    }    

    funcwanderOrPatrol() {
        if (!this.patrolPath) {
            this.patrolPath = [
                { x: Math.floor(this.x / TILE_W) + 1, y: Math.floor(this.y / TILE_H) },
                { x: Math.floor(this.x / TILE_W), y: Math.floor(this.y / TILE_H) + 1 },
                { x: Math.floor(this.x / TILE_W) - 1, y: Math.floor(this.y / TILE_H) },
                { x: Math.floor(this.x / TILE_W), y: Math.floor(this.y / TILE_H) - 1 },
            ];
        }
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
        let frameWidth, srcX, srcY;

    //    console.log(`Enemy facing: ${this.facing}`);

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
            srcX = 32 + FRAME_WALK_WIDTH * FRAMES_PER_ANIMATION + this.currentAttackFrame * frameWidth;
            srcY = this.getDirectionIndex() * this.height; 
            console.log(srcY);
        } else {
            this.walkTimer += deltaTime;
            if (this.walkTimer > frameDuration) {
                this.walkTimer = 0;
                this.currentWalkFrame = (this.currentWalkFrame + 1) % FRAMES_PER_ANIMATION;
            }

            frameWidth = this.width;
            srcX = this.currentWalkFrame * frameWidth;
            srcY = this.getDirectionIndex() * this.height;
          //  console.log(srcY)
        }

        ctx.drawImage(this.image, srcX, srcY, frameWidth, FRAME_HEIGHT, this.x, this.y, frameWidth, FRAME_HEIGHT);

        if (this.isDead) {
            colorText("Dead", this.x, this.y + 22, "white", fontSize = 12);
        }
    }
}

function updateEnemy(enemy, player) {
    var dx;
    var dy;
    var distance;
    if (DEBUG_turnOffEnemy_AI_ToAvoidFreeze) return;

    switch (enemy.state) {
        case BEHAVIOR_STATES.IDLE:
            dx = player.x - enemy.x;
            dy = player.y - enemy.y;
            distance = Math.sqrt(dx * dx + dy * dy);
        
            // If player is within range, start chasing
            if (distance < TILE_W * 8) {
                enemy.faceToward(player); 
                enemy.chooseNewPath(player, collisionGrid);
                enemy.state = BEHAVIOR_STATES.CHASE;
            }
            
            // Otherwise maybe wander
            else if (Math.random() < 0.005) {
                enemy.funcwanderOrPatrol();
            }
        break;
        case BEHAVIOR_STATES.PATROL:
            enemy.followPatrolPath();
        break;
        case BEHAVIOR_STATES.CHASE:
            dx = player.x - enemy.x;
            dy = player.y - enemy.y;
            dist = Math.sqrt(dx * dx + dy * dy);
            
            // If player is too close, kite away
            if (dist < TILE_W * 2) {
                enemy.state = BEHAVIOR_STATES.KITE;
            }
            // If in firing range, stop moving and fire
            else if (dist < TILE_W * 6) {
                enemy.fireAtPlayerIfInRange(player, projectiles, collisionGrid);
                enemy.isMoving = false;
            }
            // Otherwise keep chasing
            else {
                enemy.followPath();
            }
    
            if (!enemy.path || enemy.path.length === 0) {
                enemy.state = BEHAVIOR_STATES.IDLE;
            }
        break;
        case BEHAVIOR_STATES.KITE:
            enemy.kiteAwayFrom(player);
        break;
        case BEHAVIOR_STATES.LOST:
            enemy.funcwanderOrPatrol();
            break;
        }
}