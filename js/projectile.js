class Projectile {
    constructor(x, y, direction, speed = 4, ownerType, owner, damage = 5, statusEffect = null) {
      this.x = x;
      this.y = y;
      this.direction = direction;
      this.speed = speed;
      this.width = 17;
      this.height = 17;
      this.isActive = true;
      this.owner = owner;
      this.ownerType = ownerType;
      this.sY = 0;
      this.bouncesRemaining = 2;
      this.damage = damage;
      this.statusEffect = statusEffect;
      this.maxDistance = 300;
      this.distanceTraveled = 0;
      this.isChaotic = false; 
    }
  

    update(collisionGrid, enemies) {
        if (!this.isActive) return;

        let dy = 0;
        let dx = 0;

        //projectile movement
        switch (this.direction) {
          case "up":
            dy = -this.speed;
            this.sY = 0 * this.height;
            break;
          case "right":
            dx = this.speed;
            this.sY = 1 * this.height;
            break;
          case "down":
            dy = this.speed;
            this.sY = 2 * this.height;
            break;
          case "left":
            dx = -this.speed;
            this.sY = 3 * this.height;
            break;
        }
 
        this.x += dx;
        this.y += dy;
        this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
        if (this.distanceTraveled > this.maxDistance) {
          this.isActive = false;
          return;
        }
      
        // Check collision with walls

        let tileX = Math.floor(this.x / TILE_W);
        let tileY = Math.floor(this.y / TILE_H);

        if (
            !collisionGrid[tileY] ||
            !collisionGrid[tileY][tileX] ||
            !collisionGrid[tileY][tileX].isWalkable
          ) {
            switch (this.direction) {
                case "up":
                  this.direction = "down";
                break;
                case "down":
                  this.direction = "up";
                break;
                case "left":
                  this.direction = "right";
                break;
                case "right":
                  this.direction = "left";
                break;
            }
            
            this.bouncesRemaining--;
            this.isChaotic = true;
            createSpark(this.x + this.width / 2, this.y + this.height / 2);
            this.speed *= 0.8;
            if (this.bouncesRemaining <= 0) {
              this.isActive = false;
            }
          
            return;
        }
          
        // Check collision with player
        let playerTileX = Math.floor(player.x / TILE_W);
        let playerTileY = Math.floor(player.y / TILE_H);
        
        let hitPlayer = playerTileX === tileX && playerTileY === tileY;
        let validToHitPlayer = this.ownerType === "enemy" || this.isChaotic;
        
        if (validToHitPlayer && hitPlayer) {
          player.takeDamage(this.damage);
          this.isActive = false;
          return;
        }
        
        
    
        // Check collision with enemies 
        if (this.ownerType === "player" || this.isChaotic) {
          for (let enemy of enemies) {
            if (enemy.isDead) continue;
        
            const enemyTileX = Math.floor(enemy.x / TILE_W);
            const enemyTileY = Math.floor(enemy.y / TILE_H);
        
            const hitEnemy = enemyTileX === tileX && enemyTileY === tileY;
            const isNotOwner = enemy !== this.owner;
        
            if (hitEnemy && (this.isChaotic || this.ownerType === "player")) {
              enemy.takeDamage(this.damage);
              console.log(`${enemy.name} was hit by projectile!`);
              this.isActive = false;
              break;
            }
          }
        }
        
    }
    

    draw(ctx) {
        if (!this.isActive) return;
        ctx.drawImage(boltPic, 0,this.sY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

function createSpark(x, y) {
  const spark = {
    x,
    y,
    radius: 8,
    life: 0.3,
    maxLife: 0.3,
    color: "yellow",
    update(deltaTime) {
      this.life -= deltaTime;
      this.radius *= 0.92; 
    },
    draw(ctx) {
      if (this.life > 0) {
        const opacity = this.life / this.maxLife;
        const rgbaColor = `rgba(255, 255, 0, ${opacity})`;
        colorCircle(this.x, this.y, this.radius, rgbaColor); 
      }
    }
  };

  temp_ui_elements.push(spark);
}

function updateProjectiles(deltaTime) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.update(deltaTime);

    // Check collision with player
    if (p.owner !== player && dist(p.x, p.y, player.x, player.y) < 20) {
      player.takeDamage(5); // or p.damage
      projectiles.splice(i, 1);
      continue;
    }

    // Check collision with enemies
    enemies.forEach((e) => {
      if (p.owner === player && !e.isDead && dist(p.x, p.y, e.x, e.y) < 20) {
        e.takeDamage(10); // or p.damage
        projectiles.splice(i, 1);
      }
    });

    destructibles.forEach((e) => {
      if (p.owner === player && !e.isDead && dist(p.x, p.y, e.x, e.y) < 20) {
        e.takeDamage(10); // or p.damage
        projectiles.splice(i, 1);
      }
    });
    
  }
}
