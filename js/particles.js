// TODO: actually make a real particle system lol

function renderParticles(deltaTime) {

    // dust particles / fireflies
    drawFireflies();

    // and a couple smokestacks in town
    drawSmoke(750,170);
    drawSmoke(210,40);

}

function drawFireflies() {
    // draw a bunch of random dust particles for now
    let now = performance.now();
    for (let n=0; n<200; n++) {
        let x = Math.cos(n*1237+now/123400)*800;
        let y = Math.cos(n*6123+now/199000)*600;
        let a = Math.sin(n*7777+now/900)/2+0.5;
        ctx.fillStyle="rgba(255,255,255,"+a+")";
        ctx.fillRect(x,y,2,2);
    }
}

function drawSmoke(xx,yy) {
    let now = performance.now();
    let maxSize = 32;
    let maxHeight = 128;
    for (let n=0; n<64; n++) {
        let a = (Math.cos(n*123+now/12340)+now/12340) % 1;
        if (a<0) a=0; if (a>1) a=1;
        let x = xx + Math.cos(n*1237+now/888)*10;
        let y = yy + a*-maxHeight;
        let opacity = 1-a;
        ctx.fillStyle="rgba(32,32,32,"+opacity+")";
        ctx.fillRect(x,y,maxSize*(a),maxSize*(a));
    }
}