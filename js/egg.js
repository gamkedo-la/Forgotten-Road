const EGG_PICKUP_RANGE = 24;

class Egg extends Entity {

    // sprite size
    w = 16;
    h = 16;
    spriteNum = 4; // on chicken.png

    constructor(x, y, hp=1, dam=0) {
        super("Egg", x, y, hp, dam);
    }

    update(deltaTime) {
        
        // TODO: hatch into a new chicken after some time?

        if (this.distanceFromPlayer()<EGG_PICKUP_RANGE) {
            // console.log("we are touching an egg!");
            
            // TODO:
            // player.inventory.pickup("egg");
            pickupSound.play();
            // quest item
            // if (quests.yesYourEggcellence.started) 
                quests.yesYourEggcellence.eggsFound++;

            // remove from world
            const index = npcs.indexOf(this);
            if (index !== -1) npcs.splice(index, 1);

        }
    }
    
    draw() {
        ctx.drawImage(chickenPic,this.spriteNum*this.w,0,this.w,this.h,this.x,this.y,this.w,this.h);
    }

}