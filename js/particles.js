// TODO: actually make a real particle system lol

function renderParticles(deltaTime) {

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