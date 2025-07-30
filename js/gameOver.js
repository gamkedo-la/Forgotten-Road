function drawGameOverScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 48px serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "20px sans-serif";
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 30);
}

function restartGame() {

    // FIXME: we need to reload the map
    // and respawn enemies and NPCs etc
    // and perhaps auto-load the savegame

    playState = "playing";
    player.currentHP = player.maxHP;
    player.state = "idle";
    player.x = TILE_W * 5;
    player.y = TILE_H * 4;
    player.path = [];
    player.moveTarget = null;
    player.inventory = [];
    player.gold = 0;

    enemies.length = 0;

    console.log("Game restarted.");
}

