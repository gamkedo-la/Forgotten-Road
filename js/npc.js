const quests = {
    echoesOfTheNorth: {
      started: false,
      completed: false,
      pendantFound: false
    }
};

class NPC extends Entity {
    constructor(name, x, y, dialogue, hoverText = null) {
        super(name, x, y, 100, 0);
        this.width = 32;
        this.height = 32;
    
        this.dialogueLines = Array.isArray(dialogue) ? dialogue : [dialogue];
        this.dialogueIndex = 0;
        this.dialogueCooldown = 0; // seconds until next speech
        this.dialogueInterval = 5; // seconds between new thoughts
        this._dialogue = this.dialogueLines[0];
        this.hoverText = hoverText || name;
        this.bubbleBobTimer = 0;
    }
    

    // Getter for dialogue
    get dialogue() { return this._dialogue; }

    // Setter for dialogue
    set dialogue(newDialogue) { this._dialogue = newDialogue; }

    speak() {
        console.log(`${this.name}: "${this._dialogue}"`);
    }

    interact(){
        console.log(this.name)
        if (this.name === "Old Man") {
            if (!quests.echoesOfTheNorth.started) {
                quests.echoesOfTheNorth.started = true;
                this.dialogue = "Thank you... it should be somewhere in the northern forest. Be careful.";
                console.log("Quest Started: Echoes of the North");
            } else if (quests.echoesOfTheNorth.pendantFound && !quests.echoesOfTheNorth.completed) {
                quests.echoesOfTheNorth.completed = true;
                this.dialogue = "You found it! I can’t thank you enough.";
                player.gold += 100; // reward
                console.log("Quest Completed! +100 gold");
            } else {
                this.speak();
            }
        } else {
            this.speak();
        }
    }

    update(deltaTime) {
        this.dialogueCooldown -= deltaTime * 1000; // convert seconds to ms
    
        if (this.dialogueCooldown > 0) return;
    
        const showNothing = Math.random() < 0.3;
    
        if (showNothing) {
            this.dialogue = "";
        } else {
            const newIndex = Math.floor(Math.random() * this.dialogueLines.length);
            this.dialogue = this.dialogueLines[newIndex];
        }
  
        this.dialogueCooldown = (3 + Math.random() * 3) * 1000;
    }
    
    

    draw(deltaTime) {
         // Update bobbing timer
        this.bubbleBobTimer += deltaTime;
        const bobOffset = Math.sin(this.bubbleBobTimer * 3) * 2;
        
        ctx.drawImage(oldManPic, 0, 64, 32, 32, this.x, this.y, 32, 32);
        //ctx.fillText(this.name, this.x, this.y - 5);

        // Dialogue 
        if (this.dialogue) {
            // Update bobbing animation
            this.bubbleBobTimer += deltaTime;
            let bobOffset = Math.sin(this.bubbleBobTimer * 3) * 2;

            // Bubble position and size
            let bubblePadding = 6;
            ctx.font = "12px Arial"; 
            let textWidth = ctx.measureText(this.dialogue).width;
            let bubbleWidth = textWidth + bubblePadding * 2;
            let bubbleHeight = 20;

            let bubbleX = this.x + this.width / 2 - bubbleWidth / 2;
            let bubbleY = this.y - bubbleHeight - 10 + bobOffset;

            colorRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, "white");              // background
            outlineRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, "black");           // border
            drawTextWithShadow(this.dialogue, this.x + this.width / 2, bubbleY + 14,    // text
                            "black", "12px Arial", "center");

        }
    }
}

function drawDialogueBox(npc) {
    let boxWidth = 300;
    let boxHeight = 100;
    let x = canvas.width / 2 - boxWidth / 2;
    let y = canvas.height - boxHeight - 20;

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${npc.name}: "${npc.dialogue}"`, x + 10, y + 30);
}


  


