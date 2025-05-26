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

    constructor(x, y, hp=100, dam=0) {
        super("Chicken", x, y, hp, dam);
        // starts at a different frame so they don't synch up
        this.currentAnimFrame = Math.floor(Math.random()*this.anim.length);
        this.secsPerFrame += Math.random(0.05);
        if (Math.random()<0.5) this.dir *= -1;
    }

    layEgg() {
        let x = this.x + 4;
        let y = this.y + 4;
        console.log("laying an egg at "+x+","+y);
        let e = new Egg(x,y);
        npcs.push(e);
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
            // very rarely, lay an egg
            if (Math.random() < 0.001) { this.layEgg(); }
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
            ctx.save();
            ctx.scale(-1,1);
            ctx.drawImage(chickenPic,this.w*spritesheetFrame,0,this.w,this.h,this.x-this.w,this.y,-this.w,this.h);
            ctx.scale(1,1);
            ctx.restore();
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
    // a few eggs to start us off, too
    for (let n=0; n<NUM_CHICKENS; n++) {
        let e = new Chicken(Math.round(Math.random()*1000),Math.round(Math.random()*1000));
        npcs.push(e);
    }
}
