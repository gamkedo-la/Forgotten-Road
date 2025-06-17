// note: weapons need this to be in the enemies[] array
// so the entity class damage+die+loot routines get run

class Destructible extends Entity {
    
    // default is a fragile barrel with nothing inside it
    constructor(name="Barrel", x=0, y=0, health=1, loot=[], image=barrelPic) {
        super(name, x, y, health);
        this.image = image;
        this.spriteFrame = 0;
        this.width = 32;
        this.height = 32;
        this.isDead = false;
        // for future use - copied from the Monster class
        this._loot = loot; 
    }

    get loot() { return this._loot; } // FIXME: never gets called
    
    draw(deltaTime) {
        this.drawShadow();
        ctx.drawImage(this.image,
            (this.isDead?1:0)*this.width,0,this.width,this.height,
            this.x,this.y,this.width,this.height);
    }
}