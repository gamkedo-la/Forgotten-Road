var titleScreenSecondsLeft = 4;

function drawTitlescreen(deltaTime) {
    titleScreenSecondsLeft -= deltaTime;
    if (titleScreenSecondsLeft<=0) return;
    ctx.globalAlpha = Math.min(1,titleScreenSecondsLeft);
    ctx.drawImage(logoPic,
        Math.round(canvas.width/2-logoPic.width/2),
        Math.round(canvas.height/2-logoPic.height/2));
    ctx.globalAlpha = 1;
}
