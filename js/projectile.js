class Projectile {
    constructor(x, y, direction, speed = 4) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.width = TILE_W / 2;
        this.height = TILE_H / 2;
        this.isActive = true;
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
        const gridElement = collisionGrid[tileY]?.[tileX];

        if (!collisionGrid[tileY] || !collisionGrid[tileY][tileX] || collisionGrid[tileY][tileX] === 1) {
            console.log(`Projectile hit wall at (${tileX}, ${tileY})`);
            this.isActive = false; 
            return;
        }
        
        // Check collision with enemies
        for (let enemy of enemies) {
            if (enemy.isDead) continue;

            const enemyTileX = Math.floor(enemy.x / TILE_W);
            const enemyTileY = Math.floor(enemy.y / TILE_H);

            if(collisionGrid[tileY] == 8){
                console.log("On row 8");
            }
            
            if (enemyTileX === tileX && enemyTileY === tileY) {
                enemy.takeDamage(15); // Crossbow deals 15 damage
                console.log(`${enemy.name} was shot!`);
                this.isActive = false;
                break;
            }
        }
    }

    draw(ctx) {
        if (!this.isActive) return;

        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
