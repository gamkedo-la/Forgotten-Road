// add random little extras to grass tiles
// such as flowers, mushrooms, and rocks

function decorateTile(x,y) {
    const max = 3;
    const sprcount = 10;
    const w = 8;
    const h = 8;
    const range = 16; // scatter size
    // fake random based on location (same every time)
    var rnd = Math.cos(x*3456+y*1234)/2+0.5; 
    if (rnd < 0.99) return; // draw nothing on most of them

    rnd = Math.cos(x*3456+y*1234)/2+0.5; 
    var num = Math.round(rnd)*max;
    //console.log("decorating a tile at "+x+","+y+" with "+num+" decorations.");
    for (i=0; i<num; i++) {
        let ran = Math.cos(x+54+y*76+i*43)/2+0.5; // fake random 0..1
        let spr = Math.floor(ran*sprcount);
        let rx = Math.round(x+8+Math.cos(x*789+y*123+i*777)*range); 
        let ry = Math.round(y+8+Math.cos(x*876+y*543+i*555)*range); 
        ctx.drawImage(foliagePic,spr*w,0,w,h,rx,ry,w,h);
    }

}