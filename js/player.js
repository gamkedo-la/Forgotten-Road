const FRAME_WALK_WIDTH = 32; // Each frame width (walking)
const FRAME_ATTACK_WIDTH = 37; // Slightly wider to fit staff swing
const FRAME_HEIGHT = 34; // Frame height is consistent
const FRAMES_PER_ANIMATION = 4;
const frameDuration = 0.1; // seconds (100 ms)
const STAMINA_COST_PUSH = 5;
const STAMINA_COST_PULL = 7;

var STARTING_GOLD = Math.round(Math.random() * 50); // just for testing!

function unlockDungeonDoorTripletAt(row, colLeft) {
    // Replace the three locked tiles with their unlocked counterparts
    backgroundGrid[row][colLeft + 0] = TILE_DUNGEON_DOOR_BL; // 212
    backgroundGrid[row][colLeft + 1] = TILE_DUNGEON_DOOR_BC; // 213 (walkable)
    backgroundGrid[row][colLeft + 2] = TILE_DUNGEON_DOOR_BR; // 214

    // Mark only the center walkable; sides stay blocking (frame art)
    collisionGrid[row][colLeft + 1].isWalkable = true;
}

class Player extends Entity {
    constructor(name, x, y, health, damage, level, gold) {
        super(name, x, y, health, damage);
        this._level = level;
        this._gold = gold;
        this.sprite = warriorPic;
        this.color = "blue";
        this.image = warriorPic;
        this.sX = 32 * 0; //sprite sheet X pos
        this.sY = 34 * 2; //sprite sheet Y pos
        this.sH = 34; //sprite sheet H
        this.sW = 32; //sprite sheet W
        this.x = 32 * 5;
        this.y = 32 * 4;
        this.width = 32;
        this.height = 34;
        this.path = [];
        this.currentSpeed = 4;
        this.baseSpeed = 4;
        this.sprintSpeed = 8;
        this.maxStamina = 100;
        this.currentStamina = 100;
        this.staminaRegenRate = 10;
        this.isSprinting = false;
        this.isMoving = false;
        this.path = [];
        this.moveTarget = null; // pixel coordinates to walk to
        this.isAttacking = false;
        this.facing = "down";
        this.state = "idle";
        this.attackTimer = 0;
        this.shootingProjectile = false;
        this.currentAttackFrame = 0;
        this.walkTimer = 0;
        this.currentWalkFrame = 0;
        this.image = warriorPic;
        this.deathTimer = 0;
        this.currentDeathFrame = 0;
        this.isBlocking = false;
        this.blockCooldown = 0;
        this.blockCooldownTime = 1000;
        this.arrows = 10;
        this.maxArrows = 20;
        this.inventory = []; // Backpack items (array of item objects)
        this.equipment = {
            weapon: basicStaff,
            armor: null,
            accessory: null,
        };
    }

    // Getters
    get level() {
        return this._level;
    }
    get gold() {
        return this._gold;
    }

    // Setters
    set level(value) {
        this._level = Math.max(1, value);
    } // Prevent level from dropping below 1
    set gold(value) {
        this._gold = Math.max(0, value);
    }

    // Level up method
    levelUp() {
        this._level += 1;
        this._health += 10; // Increase health on level up
        this._damage += 2; // Increase attack power
        console.log(`${this.name} leveled up to ${this._level}!`);
    }

    setPath(path) {
        this.path = path;
        if (this.path.length > 0) {
            this.moveTarget = {
                x: this.path[0].x * TILE_W,
                y: this.path[0].y * TILE_H,
            };
            this.isMoving = true;
            this.useStamina(10);
        }

    }

    cancelPath() {
        this.path = [];
        this.moveTarget = null;
        this.isMoving = false;
    }

    useStamina(amount) {
        this.currentStamina = Math.max(0, this.currentStamina - amount);
    }

    canPerformAction(cost) {
        return this.currentStamina >= cost;
    }

    regenStamina(deltaTime) {
        if (!this.isSprinting && !this.isAttacking) {
            this.currentStamina = Math.min(
                this.maxStamina,
                this.currentStamina + this.staminaRegenRate * deltaTime
            );
        }
    }

    isDungeonLockedDoor(tile) {
        return tile === TILE_DUNGEON_LOCKED_DOOR_BL ||
            tile === TILE_DUNGEON_LOCKED_DOOR_BC ||
            tile === TILE_DUNGEON_LOCKED_DOOR_BR;
    }

    calculateWeaponDamage(weapon, bonusDamage = 0) {
        let min = weapon?.minDamage ?? weapon?.damage ?? 1;
        let max = weapon?.maxDamage ?? weapon?.damage ?? 1;
        let base = min + Math.floor(Math.random() * (max - min + 1));
        let critRoll = Math.random();
        let critChance = weapon?.critChance ?? 0;
        let critMultiplier = weapon?.critMultiplier ?? 1;

        const isCrit = critRoll < critChance;
        let total = isCrit ? Math.floor(base * critMultiplier) : base;
        return {
            damage: total + bonusDamage,
            isCrit
        };
    }

    tryUnlockDoor(col, row) {
        const tile = backgroundGrid[row][col];
        const hasKey = this.inventory.some((item) => item.id === "silver_key");

        // Single-tile legacy door
        if (tile === TILE_LOCKED_DOOR) {
            if (!hasKey) {
                console.log("You need a key to unlock this door.");
                return;
            }
            backgroundGrid[row][col] = TILE_UNLOCKED_DOOR;
            collisionGrid[row][col].isWalkable = true;
            unlockDoorSound.play();
            this.inventory = this.inventory.filter(i => i.id !== "silver_key");
            console.log("You unlocked the door!");
            return;
        }

        // 3-wide dungeon door (218–220)
        if (tile === TILE_DUNGEON_LOCKED_DOOR_BL ||
            tile === TILE_DUNGEON_LOCKED_DOOR_BC ||
            tile === TILE_DUNGEON_LOCKED_DOOR_BR) {

            if (!hasKey) {
                console.log("You need a key to unlock this door.");
                return;
            }

            let colLeft = col;
            if (tile === TILE_DUNGEON_LOCKED_DOOR_BC) colLeft = col - 1;
            if (tile === TILE_DUNGEON_LOCKED_DOOR_BR) colLeft = col - 2;

            unlockDungeonDoorTripletAt(row, colLeft);
            unlockDoorSound.play();
            this.inventory = this.inventory.filter(i => i.id !== "silver_key");
            console.log("You unlocked the door!");
            return;
        }
    }

    checkForKeyPickup() {
        const col = Math.floor(player.x / TILE_W);
        const row = Math.floor(player.y / TILE_H);
        if (backgroundGrid[row][col] === TILE_KEY) {
            player.addItemToInventory(keyItem);
            backgroundGrid[row][col] = TILE_GRASS; // Clear tile
            console.log("You picked up a key!");
        }
    }

    staffAttack(enemies) {
        if (this.isAttacking || this.isMoving) return;

        const STAMINA_COST = 15;
        if (!this.canPerformAction(STAMINA_COST)) {
            console.log("Too exhausted to swing!");
            noStaminaSound.play();
            return;
        }
        staffAttackSound.play();
        this.useStamina(STAMINA_COST);
        this.isAttacking = true;
        this.state = "attacking";
        this.currentAttackFrame = 0;
        this.attackTimer = 0;

        let bonusDamage = this.getEquippedBonusDamage();
        let attacked = false;

        let targetX = this.x;
        let targetY = this.y;
        let attackRange = TILE_W;
        //let attackRadius = TILE_W;

        switch (this.facing) {
            case "up":
                targetY -= attackRange;
                break;
            case "down":
                targetY += attackRange;
                break;
            case "left":
                targetX -= attackRange;
                break;
            case "right":
                targetX += attackRange;
                break;
        }

        let swingBox = {
            x: targetX,
            y: targetY,
            width: TILE_W,
            height: TILE_H
        };

        destructibles.forEach((barrel) => {
            if (barrel.isDead) return;
            let bBox = {
                x: barrel.x,
                y: barrel.y,
                width: barrel.width,
                height: barrel.height
            };
            if (rectsOverlap(swingBox, bBox)) {
                let weapon = this.equipment.weapon;
                let {
                    damage,
                    isCrit
                } = this.calculateWeaponDamage(weapon, bonusDamage);
                barrel.takeDamage(damage);
                attacked = true;
            }
        });

        enemies.forEach((enemy) => {
            if (enemy.isDead) return;

            let enemyBox = {
                x: enemy.x,
                y: enemy.y,
                width: enemy.width,
                height: enemy.height
            };

            if (rectsOverlap(swingBox, enemyBox)) {
                let weapon = this.equipment.weapon;
                let {
                    damage,
                    isCrit
                } = this.calculateWeaponDamage(weapon, bonusDamage);

                enemy.takeDamage(damage);
                camera.applyShake(4, 200);

                const critText = isCrit ? " (CRIT!)" : "";
                console.log(`You hit ${enemy.name} for ${damage} damage${critText}`);

                enemyDamagedSound.play();

                attacked = true;
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                enemy.knockback(dx, dy, 10);
                this.damagedEquippedItem();
            }
        });


        if (!attacked) {
            console.log("You swing... but hit nothing.");
        }

        setTimeout(() => {
            this.isAttacking = false;
            if (this.state === "attacking") {
                this.state = "idle";
            }
        }, 350); // or FRAMES_PER_ANIMATION * frameDuration * 1000
    }

    fireProjectile() {
        if (this.isAttacking || this.isMoving) return;

        if (this.arrows <= 0) {
            console.log("You're out of arrows!");
            return;
        }

        const STAMINA_COST = 10;
        if (!this.canPerformAction(STAMINA_COST)) {
            console.log("Too exhausted to shoot!");
            return;
        }

        this.cancelPath?.();
        this.isAttacking = true; // <-- add this
        this.useStamina(STAMINA_COST);
        this.arrows--;
        this.state = "shooting";
        this.currentAttackFrame = 0;
        this.attackTimer = 0;

        bowAttackSound.play();

        attackFX(this.x, this.y, 0, 0, this.facing);

        let weapon = this.equipment.weapon;
        let bonusDamage = this.getEquippedBonusDamage();
        let {
            damage
        } = this.calculateWeaponDamage(weapon, bonusDamage);

        let bolt = new Projectile(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.facing,
            6,
            "player",
            this,
            damage
        );
        projectiles.push(bolt);

        setTimeout(() => {
            this.isAttacking = false; // <-- and release it
            if (this.state === "shooting") this.state = "idle";
        }, 300);
    }


    addItemToInventory(item) {
        if (item.stackable) {
            const existing = this.inventory.find((i) => i.id === item.id);
            if (existing) {
                existing.quantity += item.quantity || 1;
                console.log(`Stacked ${item.name}. New quantity: ${existing.quantity}`);
                return;
            }
        }

        if (this.inventory.length < 20) {
            this.inventory.push({
                ...item
            });

            console.log(`${item.name} added to backpack.`);
        } else {
            console.log("Backpack is full!");
        }
    }

    useItem(item) {
        if (item.use === "heal" && this.currentHP < this.maxHP) {
            this.currentHP = Math.min(this.maxHP, this.currentHP + item.amount);
            console.log(`Healed for ${item.amount}. HP: ${this.currentHP}`);

            playerHealSound.play();

            if (item.stackable) {
                item.quantity--;
                if (item.quantity <= 0) {
                    this.inventory = this.inventory.filter((i) => i !== item);
                }
            } else {
                this.inventory = this.inventory.filter((i) => i !== item);
            }
        } else {
            console.log("Nothing happened.");
        }
    }

    equipItem(item) {
        if (item.type && this.equipment.hasOwnProperty(item.type)) {
            this.equipment[item.type] = cloneItem(item);
            console.log(`Equipped ${item.name} as ${item.type}.`);
        } else {
            console.log("Item cannot be equipped.");
        }
    }

    damagedEquippedItem() {
        const weapon = this.equipment.weapon;
        if (!weapon) return;

        weapon.durability--;

        if (weapon.durability < 0) {
            weapon.durability = 0;
            console.log(`${weapon.name} is broken!`);
        }
    }


    getEquippedBonusDamage() {
        return this.equipment.weapon ? this.equipment.weapon.damage : 0;
    }




    updateMovement() {
        if (!this.isMoving || !this.moveTarget || isBlockSliding || this.state == "dead") return;

        const dx = this.moveTarget.x - this.x;
        const dy = this.moveTarget.y - this.y;

        if (this.blockCooldown > 0) {
            this.blockCooldown -= deltaTime * 1000;
            if (this.blockCooldown < 0) this.blockCooldown = 0;
        }

        const nextCol = Math.floor(this.moveTarget.x / TILE_W);
        const nextRow = Math.floor(this.moveTarget.y / TILE_H);

        // Auto-unlock on collision with locked door
        if (!collisionGrid[nextRow][nextCol].isWalkable) {
            const tileAhead = backgroundGrid[nextRow][nextCol];

            if (tileAhead === TILE_LOCKED_DOOR || this.isDungeonLockedDoor(tileAhead)) {
                this.tryUnlockDoor(nextCol, nextRow);

                if (!collisionGrid[nextRow][nextCol].isWalkable) {
                    this.isMoving = false;
                    this.path = [];
                    this.moveTarget = null;
                    return;
                }
            } else {
                this.isMoving = false;
                this.path = [];
                this.moveTarget = null;
                return;
            }
        }

        const moveSpeed = this.currentSpeed / 2;

        if (Math.abs(dx) <= moveSpeed && Math.abs(dy) <= moveSpeed) {
            // Arrive at tile
            this.x = this.moveTarget.x;
            this.y = this.moveTarget.y;
            this.path.shift();

            if (this.path.length === 0) {
                this.isMoving = false;
                this.moveTarget = null;
            } else {
                const next = this.path[0];
                this.moveTarget = {
                    x: next.x * TILE_W,
                    y: next.y * TILE_H
                };
            }
        } else {
            // Step toward target + set facing
            if (dx !== 0) {
                this.x += Math.sign(dx) * moveSpeed;
                this.facing = dx > 0 ? "right" : "left";
            } else if (dy !== 0) {
                this.y += Math.sign(dy) * moveSpeed;
                this.facing = dy > 0 ? "down" : "up";
            }
        }
    }

    getDirectionIndex() {
        switch (this.facing) {
            case "up":
                return 0;
            case "left":
                return 3;
            case "right":
                return 1;
            case "down":
                return 2;
            default:
                return 2;
        }
    }

    takeDamage(amount) {
        if (this.isBlocking && this.blockCooldown <= 0) {
            const staminaBlockCost = 20;
            if (this.currentStamina >= staminaBlockCost) {
                this.useStamina(staminaBlockCost);
                this.blockCooldown = this.blockCooldownTime;
                console.log(`${this.name} blocks the attack with stamina!`);
                blockSound.play();
                return;
            } else {
                console.log(`${this.name} tried to block but was too exhausted!`);
            }
        }

        const floatingDamageNumber = new TextEntity(`-${amount}`, this.x, this.y, "white", 0, -20, 10, "20px Arial");
        temp_ui_elements.push(floatingDamageNumber);

        playerHitFX(this.x, this.y); // particles

        this.currentHP -= amount;
        if (this.currentHP < 0) this.currentHP = 0;

        console.log(`${this.name} takes ${amount} damage! HP: ${this.currentHP}`);

        if (this.currentHP <= 0 && this.state !== "dead") {
            playerDieSound.play();
            this.state = "dead";
            playState = "gameover";
        } else {
            playerDamagedSound.play();
        }
    }

    drawHearts() {
        var guix = 5;
        var guiy = 5;
        var guiw = HUD_BAR_WIDTH - 75;
        var guih = 30;
        var heartSize = 24;
        var spacing = 3;
        var totalHearts = Math.ceil(this.maxHP / 10);
        var fullHearts = Math.floor(this.currentHP / 10);
        var hasHalfHeart = this.currentHP % 10 >= 5;

        colorRect(guix, guiy, guiw, guih, "rgba(0, 0, 0, 0.5)");

        for (let i = 0; i < totalHearts; i++) {
            let x = 10 + i * (heartSize + spacing);
            let y = 8;

            if (i < fullHearts) {
                ctx.drawImage(heartFullPic, x, y, heartSize, heartSize);
            } else if (i === fullHearts && hasHalfHeart) {
                ctx.drawImage(heartHalfPic, x, y, heartSize, heartSize);
            } else {
                ctx.drawImage(heartEmptyPic, x, y, heartSize, heartSize);
            }
        }
    }

    draw(deltaTime) {
        ctx.globalAlpha = 1;

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

            frameWidth = FRAME_ATTACK_WIDTH;
            srcX =
                32 +
                FRAME_WALK_WIDTH * FRAMES_PER_ANIMATION +
                this.currentAttackFrame * frameWidth;
            srcY = this.getDirectionIndex() * FRAME_HEIGHT;

        } else if (this.state === "shooting") {
            this.attackTimer += deltaTime;
            if (this.attackTimer > frameDuration) {
                this.attackTimer = 0;
                this.currentAttackFrame++;

                if (this.currentAttackFrame >= FRAMES_PER_ANIMATION) {
                    this.currentAttackFrame = 0;
                    this.state = "idle";
                }
            }

            frameWidth = 32;
            srcX = 310 + this.currentAttackFrame * frameWidth;
            srcY = this.getDirectionIndex() * FRAME_HEIGHT;

        } else if (this.state === "dead") {
            this.deathTimer += deltaTime;
            if (this.deathTimer > frameDuration) {
                this.deathTimer = 0;
                if (this.currentDeathFrame < 8) {
                    this.currentDeathFrame++;
                }
                // Remain on last frame once finished
            }

            frameWidth = 32;
            srcX = this.currentDeathFrame * frameWidth;
            srcY = 4 * 34; // 5th row
        } else {
            // Walking or idle
            if (this.isMoving) {
                this.walkTimer += deltaTime;
                if (this.walkTimer > frameDuration) {
                    this.walkTimer = 0;
                    this.currentWalkFrame = (this.currentWalkFrame + 1) % FRAMES_PER_ANIMATION;
                    footstepSound.play();
                }
            } else {
                this.currentWalkFrame = -1;
                if (footstepSound.currentTime != 0) {
                    footstepSound.pause();
                    footstepSound.currentTime = 0;
                }
            }

            frameWidth = FRAME_WALK_WIDTH;
            srcX = (this.currentWalkFrame + 1) * frameWidth;
            srcY = this.getDirectionIndex() * FRAME_HEIGHT;
        }

        this.drawShadow();

        if (!this.sprite || !this.sprite.complete) {
            console.warn("Player sprite missing or not ready", this.sprite);
        }

        ctx.drawImage(
            this.image,
            srcX,
            srcY,
            frameWidth,
            FRAME_HEIGHT,
            this.x,
            this.y,
            frameWidth,
            FRAME_HEIGHT
        );

        //temp until animated
        if (this.isBlocking) {
            ctx.drawImage(shieldGlowPic, this.x - 8, this.y - 8, this.width + 16, this.height + 16);
        }
    }
}