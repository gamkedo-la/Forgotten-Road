const TREASURECHEST_PICKUP_RANGE = 24;

class TreasureChest extends Entity {

    isOpen = false;

    // sprite size
    w = 32;
    h = 32;

    constructor(x, y, hp=1, dam=0) {
        super("TreasureChest", x, y, hp, dam);
    }

    interact() { // used by player movement when clicking an "npc"
        this.openSesame();
    }

    openSesame() {
        if (!this.isOpen) { 
            console.log("opening a treasure chest!");
            this.isOpen = true;
            openChestSound.play();
            // FIXME: spawn some gold coins as pickups
            // player.gold += 10;
            let numGold = Math.ceil(Math.random() * 15);
            for (let n=0; n<numGold; n++) {
                let x = this.x + Math.round(Math.random()*64-32);
                let y = this.y + 32 + Math.round(Math.random()*32);
                let c = new Coin(x,y);
                npcs.push(c); // FIXME: this is not really an NPC
            }
        }
    }

    update(deltaTime) {
        
        if(this.isOpen) {
            return; // already opened - do nothing
        }
        
        if (this.distanceFromPlayer()<TREASURECHEST_PICKUP_RANGE) {
            this.openSesame();            
        }
    }
    
    draw() {
        this.drawShadow();
        ctx.drawImage(treasureChestPic,
            (this.isOpen?1:0)*this.w,0,this.w,this.h,
            this.x,this.y,this.w,this.h);
    }

}