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
    followPath() {
        if (!this.path || this.path.length === 0 || this.isMoving) return;
    
        this.isMoving = true;
        let moveSpeed = 2;
        let stepIndex = 0;
    
        console.log("Target Path:", this.path.map(t => `(${t.x},${t.y})`).join(" → "));
    
        const moveToNextTile = () => {
            if (stepIndex >= this.path.length) {
                this.path = [];
                this.isMoving = false;
                return;
            }
    
            const targetTile = this.path[stepIndex];
            const targetX = targetTile.x * TILE_W;
            const targetY = targetTile.y * TILE_H;
    
            const interval = setInterval(() => {
                const dx = targetX - this.x;
                const dy = targetY - this.y;
    
                if (Math.abs(dx) <= moveSpeed && Math.abs(dy) <= moveSpeed) {
                    this.x = targetX;
                    this.y = targetY;
                    clearInterval(interval);
                    stepIndex++;
                    moveToNextTile(); // move to next tile
                } else {
                    if (dx !== 0) this.x += Math.sign(dx) * moveSpeed;
                    else if (dy !== 0) this.y += Math.sign(dy) * moveSpeed;
                }
            }, 16); // ~60 FPS
        };
    
        moveToNextTile();
    }
    
           
}
