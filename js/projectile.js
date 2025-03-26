class Projectile {
    constructor(x, y, direction, speed = 4, ownerType, owner) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.width = TILE_W / 2;
        this.height = TILE_H / 2;
        this.isActive = true;
        this.owner = owner;
        this.ownerType = ownerType;

    }

    update(collisionGrid, enemies) {
        if (!this.isActive) return;
    
        // Move projectile
        switch (this.direction) {
            case "up": this.y -= this.speed; break;
            case "down": this.y += this.speed; break;
            case "left": this.x -= this.speed; break;
            case "right": this.x += this.speed; break;
        }
    
        const tileX = Math.floor(this.x / TILE_W);
        const tileY = Math.floor(this.y / TILE_H);
    
        // Check collision with walls
        if (!collisionGrid[tileY] || !collisionGrid[tileY][tileX] || collisionGrid[tileY][tileX] === 1) {
            console.log(`Projectile hit wall at (${tileX}, ${tileY})`);
            this.isActive = false;
            return;
        }
    
        // Check collision with player (if fired by enemy)
        if (this.ownerType === "enemy") {
            const playerTileX = Math.floor(player.x / TILE_W);
            const playerTileY = Math.floor(player.y / TILE_H);
    
            if (playerTileX === tileX && playerTileY === tileY) {
                player.takeDamage(5);
                console.log(`Player was hit by enemy projectile!`);
                this.isActive = false;
                return;
            }
        }
    
        // Check collision with enemies (if fired by player)
        if (this.ownerType === "player") {
            for (let enemy of enemies) {
                if (enemy.isDead) continue;
                if (enemy === this.owner) continue;
    
                const enemyTileX = Math.floor(enemy.x / TILE_W);
                const enemyTileY = Math.floor(enemy.y / TILE_H);
    
                if (enemyTileX === tileX && enemyTileY === tileY) {
                    enemy.takeDamage(5); 
                    console.log(`${enemy.name} was shot!`);
                    this.isActive = false;
                    break;
                }
            }
        }
    }
    

    draw(ctx) {
        if (!this.isActive) return;

        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
