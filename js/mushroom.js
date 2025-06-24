const NUM_MUSHROOMS = 6;
const MUSHROOM_PICKUP_RANGE = 24;

class Mushroom extends Entity {

    // sprite size
    w = 16;
    h = 16;
    spriteNum = 0; 

    constructor(x, y, hp=1, dam=0) {
        super("Mushroom", x, y, hp, dam);
    }

    update(deltaTime) {
        if (this.distanceFromPlayer()<MUSHROOM_PICKUP_RANGE) {
            // console.log("we are touching a mushroom!");
            
            // TODO:
            // player.inventory.pickup("mushroom");
            pickupSound.play();
            pickupFX(this.x,this.y);
            // quest item
            //if (quests.yesYourEggcellence.started) 
                quests.yesYourEggcellence.mushroomsFound++;

            // remove from world
            const index = npcs.indexOf(this);
            if (index !== -1) npcs.splice(index, 1);

        }
    }
    
    draw() {
        ctx.drawImage(mushroomPic,this.spriteNum*this.w,0,this.w,this.h,this.x,this.y,this.w,this.h);
    }

}

function spawnRandomMushrooms() {
    for (let n=0; n<NUM_MUSHROOMS; n++) {
        let buck = new Mushroom(Math.round(Math.random()*1000),Math.round(Math.random()*550));
        npcs.push(buck);
    }
}