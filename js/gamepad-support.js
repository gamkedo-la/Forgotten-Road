var gamepad = {
    up: false,
    down: false,
    left: false,
    right: false,
    action: false
}

function check_gamepad() {
    // is a gamepad connected?
    const deadzone = 0.16; // avoid drift on old gamepads
    if (!navigator.getGamepads) return;
    let g = navigator.getGamepads()[0];
    if (!g) return;
    gamepad.left = g.axes[0] < -deadzone;
    gamepad.right = g.axes[0] > deadzone;
    gamepad.up = g.axes[1] < -deadzone;
    gamepad.down = g.axes[1] > deadzone;
    gamepad.action = 
        g.buttons[0].value > deadzone || 
        g.buttons[1].value > deadzone || 
        g.buttons[2].value > deadzone || 
        g.buttons[3].value > deadzone;

    // debug the gamepad state:
    // var str = ""+(gamepad.left?"L":"")+(gamepad.right?"R":"")+(gamepad.up?"U":"")+(gamepad.down?"D":"")+(gamepad.action?"!":"");
    // if (str!="") console.log("gamepad: "+g.axes[0].toFixed(1)+","+g.axes[1].toFixed(1)+" = "+str);

}