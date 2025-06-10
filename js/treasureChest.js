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
            console.log("opening a treasure cheat!");
            this.isOpen = true;
            pickupSound.play();
            // FIXME: spawn some gold coins as pickups
            player.gold += 10;
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