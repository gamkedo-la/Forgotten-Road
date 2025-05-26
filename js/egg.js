class Egg extends Entity {

    // sprite size
    w = 16;
    h = 16;
    spriteNum = 4; // on chicken.png

    constructor(x, y, hp=1, dam=0) {
        super("Egg", x, y, hp, dam);
    }

    update(deltaTime) {
        // fixme: hatch into a new chicken after some time?
        return;
    }
    
    draw() {
        ctx.drawImage(chickenPic,this.spriteNum*this.w,0,this.w,this.h,this.x,this.y,this.w,this.h);
    }

}