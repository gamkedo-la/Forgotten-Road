const COIN_PICKUP_RANGE = 24;

class Coin extends Entity {

    // sprite size
    w = 16;
    h = 16;

    constructor(x, y, hp=1, dam=0) {
        super("Coin", x, y, hp, dam);
    }

    update(deltaTime) {
        
        if (this.distanceFromPlayer()<COIN_PICKUP_RANGE) {
            pickupCoinSound.play();
            pickupFX(this.x,this.y);
            // getting richer by the minute!
            player.gold++; 
            // remove from world
            const index = npcs.indexOf(this);
            if (index !== -1) npcs.splice(index, 1);
        }
    }
    
    draw() {
        ctx.drawImage(coinPic,0,0,this.w,this.h,this.x,this.y,this.w,this.h);
    }

}