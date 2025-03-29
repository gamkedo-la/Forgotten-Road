class Entity {
    constructor(name, x, y, health, damage) {
        this._name = name;
        this._x = x;
        this._y = y;
        this.currentHP = health;
        this.maxHP = health;
        this._damage = damage;
        this.targetX = null;
        this.targetY = null;
        this.speed = 0.5;
        this.isFlashing = false;
        this.flashColor = "yellow";
        this.flashDuration = 200; 
        this.lastHitTime = 0;
    }

    // Getters
    get name() { return this._name; }
    get x() { return this._x; }
    get y() { return this._y; }
    get health() { return this.currentHP; }
    get damage() { return this._damage; }

    // Setters
    set health(value) { 
        this._health = Math.max(0, value); // Prevent negative health
    }
    
    set x(value) { this._x = value; }
    set y(value) { this._y = value; }

    takeDamage(amount) {
        
        this.currentHP -= amount;
        if (this.currentHP < 0) this.currentHP = 0;
        console.log(`${this.name} has ${this.currentHP} HP left.`);
    
        this.isFlashing = true;
        this.lastHitTime = Date.now();
    
        if (this.currentHP <= 0) {
            this.die();
        }
    }

    heal(amount) {
        this.currentHP += amount;
        if (this.currentHP > this.maxHP) this.currentHP = this.maxHP;
    }
    
    
    die() {
        if (this.isDead) return;
    
        this.isDead = true;
        this.deathTime = Date.now();
        console.log(`${this.name} has been defeated!`);
        this.sprite = "dead";
    
        // Drop item
        this.dropLoot();
    
        // Delay removal
        setTimeout(() => {
            const index = enemies.indexOf(this);
            if (index !== -1) {
                enemies.splice(index, 1);
                console.log(`${this.name} removed from enemies array.`);
            }
        }, 5000);
    }

    dropLoot() {
        const drops = [{ ...basicStaff }, { ...leatherArmor }, {...healthPotion}];
        const randomDrop = drops[Math.floor(Math.random() * drops.length)];
    
        const dropX = this.x;
        const dropY = this.y;
    
        if (randomDrop === "gold") {
            const goldAmount = Math.floor(Math.random() * 10) + 5;
            player.gold += goldAmount;
            console.log(`${this.name} dropped ${goldAmount} gold!`);
        } else {
            worldItems.push({
                ...randomDrop,
                x: dropX,
                y: dropY,
                pickupRadius: 20
            });
            console.log(`${this.name} dropped ${randomDrop.name}`);
        }
    }
    
    move(dx, dy) {
        this._x += dx;
        this._y += dy;

        if (isCollisionAt(this._x, this._y)) {
            console.log("Collision detected at", this._x, this._y);
        }
    }
}
