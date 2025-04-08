class NPC extends Entity {
    constructor(name, x, y, dialogue) {
        super(name, x, y, 100, 0); // NPCs don't fight, so no damage
        this.width = 32;
        this.height = 32;
        this._dialogue = dialogue;
    }

    // Getter for dialogue
    get dialogue() { return this._dialogue; }

    // Setter for dialogue
    set dialogue(newDialogue) { this._dialogue = newDialogue; }

    speak() {
        console.log(`${this.name}: "${this._dialogue}"`);
    }

    draw(deltaTime) {
        ctx.drawImage(oldManPic, 0, 64, 32, 32, this.x, this.y, 32, 32);
        ctx.fillText(this.name, this.x, this.y - 5);
    }
    
    
}

function handleNPCInteraction() {
    if (keys.interact) {
        for (let npc of npcs) {
            const dx = player.x - npc.x;
            const dy = player.y - npc.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 40) { // 40 pix
                npc.speak(); 
                break;
            }
        }
    }
}

function drawDialogueBox(npc) {
    const boxWidth = 300;
    const boxHeight = 100;
    const x = canvas.width / 2 - boxWidth / 2;
    const y = canvas.height - boxHeight - 20;

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${npc.name}: "${npc.dialogue}"`, x + 10, y + 30);
}


