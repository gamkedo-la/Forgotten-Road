
function checkForMapEdgeTransition() {
const now = performance.now();
if (now - lastMapSwitchTime < MAP_SWITCH_COOLDOWN) return;

const col = Math.floor(player.x / TILE_W);
const row = Math.floor(player.y / TILE_H);
const transition = MAP_TRANSITIONS[currentMapKey];

if (!transition) return;

if (row === 0 && transition.north) {
    switchToMap(transition.north.to, col, transition.north.row ?? TILE_ROWS - 2);
    lastMapSwitchTime = now;
} else if (row === TILE_ROWS - 1 && transition.south) {
    switchToMap(transition.south.to, col, transition.south.row ?? 1);
    lastMapSwitchTime = now;
} else if (col === 0 && transition.west) {
    switchToMap(transition.west.to, transition.west.col ?? TILE_COLS - 2, row);
    lastMapSwitchTime = now;
} else if (col === TILE_COLS - 1 && transition.east) {
    switchToMap(transition.east.to, transition.east.col ?? 1, row);
    lastMapSwitchTime = now;
}
}  