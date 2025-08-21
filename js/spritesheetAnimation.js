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

// called by entity.takeDamage (skeletons etc)
function hitFX(x,y) {
    let a = new spritesheetAnimation(x+Math.random()*16-8,y+8+Math.random()*16-8,1);
    anims.push(a);
}

// called by player.takeDamage
function playerHitFX(x,y) {
    // spawn a bunch of them!
    for (let i=0; i<5; i++) {
        let a = new spritesheetAnimation(x+Math.random()*32-16,y+8+Math.random()*32-16,2);
        anims.push(a);
    }
}

// a "slash" style curved woosh line effect
function attackFX(x,y,dx,dy,facing) {
    const offset = 16;
    let ofsx = 0;
    let ofsy = 0;
    let column = 3;
    if (!facing) { // if not set, use dx,dy to guess
        facing = "left"; // default is at 0,0
        if (dy<0) facing = "up";
        if (dy>0) facing = "down";
        if (dx<0) facing = "left";
        if (dx>0) facing = "right";
    }
    if (facing=="right") { ofsx = offset; column = 3; }
    if (facing=="left") { ofsx = -offset; column = 4; }
    if (facing=="up") { ofsy = -offset; column = 5; }
    if (facing=="down") { ofsy = offset; column = 6; }
    let a = new spritesheetAnimation(x+ofsx,y+ofsy,column);
    anims.push(a);
}

// a "muzzle flash" style burst
function bowAttackFX(x,y,dx,dy,facing) {
    const offset = 25;
    let ofsx = 0;
    let ofsy = 0;
    let column = 7;
    if (!facing) { // if not set, use dx,dy to guess
        facing = "left"; // default is at 0,0
        if (dy<0) facing = "up";
        if (dy>0) facing = "down";
        if (dx<0) facing = "left";
        if (dx>0) facing = "right";
    }
    if (facing=="right") { ofsx = offset; column = 7; }
    if (facing=="left") { ofsx = -offset; column = 8; }
    if (facing=="up") { ofsy = -offset; column = 9; }
    if (facing=="down") { ofsy = offset; column = 10; }
    let a = new spritesheetAnimation(x+ofsx,y+ofsy,column);
    anims.push(a);
}
