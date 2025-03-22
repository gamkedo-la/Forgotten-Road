class Entity {
    constructor(name, x, y, health, damage) {
        this._name = name;
        this._x = x;
        this._y = y;
        this._health = health;
        this._damage = damage;
        this.targetX = null;
        this.targetY = null;
        this.speed = 0.5;
    }

    // Getters
    get name() { return this._name; }
    get x() { return this._x; }
    get y() { return this._y; }
    get health() { return this._health; }
    get damage() { return this._damage; }

    // Setters
    set health(value) { 
        this._health = Math.max(0, value); // Prevent negative health
    }
    
    set x(value) { this._x = value; }
    set y(value) { this._y = value; }

    takeDamage(amount) {
        this.health -= amount;
        console.log(`${this.name} has ${this.health} HP left.`);
    
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        console.log(`${this.name} has been defeated!`);
        this.isDead = true;
        // Optional: remove from enemy array, hide sprite, etc.
    }
    

    // Common method for moving an entity
    move(dx, dy) {
        this._x += dx;
        this._y += dy;

        if (isCollisionAt(this._x, this._y)) {
            console.log("Collision detected at", this._x, this._y);
        }
    
    }
}
