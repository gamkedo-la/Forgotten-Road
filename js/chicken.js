const NUM_CHICKENS = 20;

class Chicken extends Entity {
    // spritesheet frames
    anim = [0,1,0,1,0,1,0,1,0,1,2,2,2,2,1,1,1,1,2,2,2,2,1,1,1,1,0,1,0,1,0,1,0,1,3,3,3,3,3,3,3,3,3,3,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
    // current
    currentAnimFrame = 0;
    // anim speed
    secsPerFrame = 0.2;
    // movement on frames 0+1
    dir = 1; // pixels per frame of movement
    // sprite size
    w = 8;
    h = 8;
    // anim
    nextFrameTimestamp = 0;

    constructor(x, y) {
        super("Chicken", x, y, 100, 0);
        // starts at a different frame so they don't synch up
        this.currentAnimFrame = Math.floor(Math.random()*this.anim.length);
        this.secsPerFrame += Math.random(0.05);
        if (Math.random()<0.5) this.dir *= -1;
    }

    update(deltaTime) {
        let now = performance.now()/1000;
        if (now >= this.nextFrameTimestamp) {
            //console.log("chicken next frame: "+this.currentAnimFrame+" now:"+now.toFixed(1)+" next:"+this.nextFrameTimestamp.toFixed(1));
            this.nextFrameTimestamp = now + this.secsPerFrame;
            this.currentAnimFrame++;
            if (this.currentAnimFrame > this.anim.length-1) this.currentAnimFrame = 0;
            // sometimes, change direction
            if (Math.random() < 0.005) { this.dir *= -1; }
            // is this a walk frame? then move
            let spritesheetFrame = this.anim[this.currentAnimFrame];
            if (spritesheetFrame==0 || spritesheetFrame==1) { // walking?
                this.x += this.dir;
            }
        }
    }
    
    draw() {
        //this.drawShadow();
        let spritesheetFrame = this.anim[this.currentAnimFrame];
        let flipped = (this.dir<=0);
        if (flipped) {
            ctx.scale(-1,1);
            ctx.drawImage(chickenPic,this.w*spritesheetFrame,0,this.w,this.h,this.x-this.w,this.y,-this.w,this.h);
            ctx.scale(1,1);
        } else {
            ctx.drawImage(chickenPic,this.w*spritesheetFrame,0,this.w,this.h,this.x,this.y,this.w,this.h);
        }
    }

}

function spawnRandomChickens() {
    for (let n=0; n<NUM_CHICKENS; n++) {
        let buck = new Chicken(Math.round(Math.random()*1000),Math.round(Math.random()*1000));
        npcs.push(buck);
    }
}