// spritesheetAnimation
// similar to a particle system
// except with only one sprite (a spritesheet)
// which animates once and then is deleted
// also called a "flipbook" animation

let anims = []; // all active spritesheetAnimations

class spritesheetAnimation extends Entity {
    
    img = animsPic;
    w = 32;
    h = 32;
    cols = 32;
    row = 0;
    nextFrameTimestamp = 0;
    currentAnimFrame = 0;
    secsPerFrame = 0.2;

    constructor(x,y,row=0,img=animsPic,w=32,h=32,cols=32,fps=32) {
        super("anim", x, y, 1, 0);
        this.img = img;
        this.row = row;
        this.w = w;
        this.h = h;
        this.cols = cols;
        this.secsPerFrame = 1/fps;
        this.currentAnimFrame = 0;
    }

    update(deltaTime) {
        let now = performance.now()/1000;
        if (now >= this.nextFrameTimestamp) {
            this.nextFrameTimestamp = now + this.secsPerFrame;
            this.currentAnimFrame++;
            if (this.currentAnimFrame > this.cols-1) {
                // animation has ended
                const index = anims.indexOf(this);
                if (index !== -1) anims.splice(index, 1);
            }
        }
    }

draw() {
        let sx = this.w*this.currentAnimFrame;
        let sy = this.row * this.h;
        ctx.drawImage(this.img,sx,sy,this.w,this.h,this.x,this.y,this.w,this.h);
    }

}

function pickupFX(x,y) {
    let a = new spritesheetAnimation(x-8,y-8);
    anims.push(a);
}