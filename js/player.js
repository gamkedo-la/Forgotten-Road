class Player extends Entity {
    constructor(name, x, y, health, damage, level, gold) {
        super(name, x, y, health, damage);
        this._level = level;
        this._gold = gold;
        this.color = "blue";
        this.image = warriorPic;
        this.sX = 32*0; //sprite sheet X pos
        this.sY = 34*2; //sprite sheet Y pos
        this.sH = 34; //sprite sheet H
        this.sW = 32; //sprite sheet W
        this.x = 32*5;
        this.y = 32*4;
        this.width = 32;
        this.height = 34;
        this.path = [];
        this.speed = 2;
        this.isMoving = false;
        this.path = [];
        this.moveTarget = null; // pixel coordinates to walk to
        this.isAttacking = false;
        this.facing = "down";
    }

    // Getters
    get level() { return this._level; }
    get gold() { return this._gold; }

    // Setters
    set level(value) { this._level = Math.max(1, value); } // Prevent level from dropping below 1
    set gold(value) { this._gold = Math.max(0, value); }

    // Level up method
    levelUp() {
        this._level += 1;
        this._health += 10;  // Increase health on level up
        this._damage += 2;   // Increase attack power
        console.log(`${this.name} leveled up to ${this._level}!`);
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

    staffAttack(enemies) {
        if (this.isAttacking || this.isMoving) return;
    
        this.isAttacking = true;
    
        const playerX = Math.floor(this.x / TILE_W);
        const playerY = Math.floor(this.y / TILE_H);
    
        // Determine target tile based on facing direction
        let targetX = playerX;
        let targetY = playerY;
    
        switch (this.facing) {
            case "up":    targetY -= 1; break;
            case "down":  targetY += 1; break;
            case "left":  targetX -= 1; break;
            case "right": targetX += 1; break;
        }
    
        let attacked = false;
    
        enemies.forEach(enemy => {
            const enemyX = Math.floor(enemy.x / TILE_W);
            const enemyY = Math.floor(enemy.y / TILE_H);
    
            if (enemyX === targetX && enemyY === targetY) {
                enemy.takeDamage(10);
                console.log(`You hit ${enemy.name} at (${enemyX}, ${enemyY}) for 10 damage!`);
                attacked = true;
            }
        });
    
        if (!attacked) {
            console.log("You swing... but hit nothing.");
        }
    
        setTimeout(() => {
            this.isAttacking = false;
        }, 300);
    }
    
        
    updateMovement() {
        if (!this.isMoving || !this.moveTarget) return;

        const dx = this.moveTarget.x - this.x;
        const dy = this.moveTarget.y - this.y;

        const moveSpeed = 2;

        if (Math.abs(dx) <= moveSpeed && Math.abs(dy) <= moveSpeed) {
            this.x = this.moveTarget.x;
            this.y = this.moveTarget.y;
            this.path.shift(); // Remove reached tile

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
            if (dx !== 0) this.x += Math.sign(dx) * moveSpeed;
            else if (dy !== 0) this.y += Math.sign(dy) * moveSpeed;
        }

        if (dx !== 0) {
            this.x += Math.sign(dx) * moveSpeed;
            this.facing = dx > 0 ? "right" : "left";
        } else if (dy !== 0) {
            this.y += Math.sign(dy) * moveSpeed;
            this.facing = dy > 0 ? "down" : "up";
        }
        
    }       
}


