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
  get name() {
    return this._name;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get health() {
    return this.currentHP;
  }
  get damage() {
    return this._damage;
  }

  // Setters
  set health(value) {
    this.currentHP = Math.max(0, value); // Prevent negative health
  }

  set x(value) {
    this._x = value;
  }
  set y(value) {
    this._y = value;
  }

  distanceFromEntity(e) {
    return Math.sqrt(Math.pow((this.x-e.x), 2) + Math.pow((this.y-e.y), 2) );
  }

  distanceFromPlayer() {
    // calculated from CENTER of player sprite
    let px = player.x + 16;
    let py = player.y + 16;
    return Math.sqrt(Math.pow((this.x-px), 2) + Math.pow((this.y-py), 2) );
  }

  takeDamage(amount) {
    // Skeleton takes reduced damage
    if (this.type === "Skeleton") {
      amount = Math.floor(amount * 0.5);
    }

    this.currentHP -= amount;
    if (this.currentHP < 0) this.currentHP = 0;

    console.log(`${this.name} takes ${amount} damage!`);

    // Resurrection logic (only for skeletons)
    if (this.currentHP <= 0) {
      if (this.type === "Skeleton" && Math.random() < 0.25) {
        this.currentHP = 10;
        console.log(`${this.name} reassembles itself with 10 HP!`);
      } else {
        console.log(`${this.name} has died!`);
        this.die();
      }
    }

    // Visual feedback
    this.isFlashing = true;
    this.lastHitTime = Date.now();

    hitFX(this.x,this.y);

    console.log(`${this.name} has ${this.currentHP} HP left.`);

    // Spawn floating damage number
    const floatingDamageNumber = new TextEntity(
      `-${amount}`,
      this._x,
      this._y,
      "red",
      0,
      -20,
      2
    );
    temp_ui_elements.push(floatingDamageNumber);
  }

  knockback(dx, dy, strength = 10) {
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      this.x += (dx / dist) * strength;
      this.y += (dy / dist) * strength;
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

    if (this.type === "Skeleton") {
      this.sprite = "dying";
      this.isDying = true;
      this.deathFrame = 0;
      this.maxDeathFrames = 8;
      return; // animation will handle removal
    }

    this.sprite = "dead";

    // Drop loot immediately for non-skeletons
    this.dropLoot();

    setTimeout(() => {
      const index = enemies.indexOf(this);
      if (index !== -1) {
        enemies.splice(index, 1);
        console.log(`${this.name} removed from enemies array.`);
      }
    }, 5000);
  }

  dropLoot() {
    // FIXME: this should use the Monster's .loot() if any
    const drops = [{ ...basicStaff }, { ...leatherArmor }, { ...healthPotion }, {...boltPickUp}];
    const randomDrop = drops[Math.floor(Math.random() * drops.length)];

    const dropX = this.x;
    const dropY = this.y;

    if (randomDrop === "gold") {
      const goldAmount = Math.floor(Math.random() * 10) + 5;
      player.gold += goldAmount;
      console.log(`${this.name} dropped ${goldAmount} gold!`);
    } else {
      worldItems[currentMapKey].push({
        ...randomDrop,
        x: dropX,
        y: dropY,
        pickupRadius: 20,
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

  drawShadow() {
    ctx.globalAlpha = 0.5;
    ctx.drawImage(shadowPic,this.x-16,this.y+18);
    ctx.globalAlpha = 1; 
  }

}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

