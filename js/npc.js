const quests = {
    echoesOfTheNorth: {
      started: false,
      completed: false,
      pendantFound: false,
      declinedCount: 0,
      permanentlyDeclined: false 
    },
    shadowsOfDoubt: {
      started: false,
      completed: false
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
    interact() {
        if (dialoguePrompt || pendingQuest) {
            console.log("[INTERACT] Skipped — dialogue prompt active");
            return;
        }
    
        if (this.name === "Old Man") {
            const quest = quests.echoesOfTheNorth;
    
            if (!quest.started && !quest.permanentlyDeclined) {
                const declines = quest.declinedCount;
    
                if (declines === 0) {
                    dialoguePrompt = "Would you help me find a pendant I lost in the forest?";
                } else if (declines === 1) {
                    dialoguePrompt = "You've returned. Have you changed your mind?";
                } else if (declines === 2) {
                    dialoguePrompt = "This is your last chance. Will you help me?";
                }
    
                pendingQuest = () => {
                    quest.started = true;
                    this.dialogue = "Thank you... it should be somewhere in the northern forest. Be careful.";
                    console.log("Quest Started: Echoes of the North");
                };
                return;
            }
    
            if (quest.permanentlyDeclined && !quests.shadowsOfDoubt.started) {
                this.dialogue = "Have you reconsidered? I still need someone to investigate the graveyard.";
                dialoguePrompt = "Will you help with the cloaked figure?";
                pendingQuest = () => {
                    quests.shadowsOfDoubt.started = true;
                    this.dialogue = "Excellent. Keep your distance, but observe closely.";
                    console.log("Quest Started: Shadows of Doubt");
                };
                return;
            }
    
            // ✅ Handle quest turn-in
            if (quest.pendantFound && !quest.completed) {
                quest.completed = true;
                this.dialogue = "You found it! I can’t thank you enough.";
                player.gold += 100;
                console.log("Quest Completed! +100 gold");
                return;
            }
    
            // Default response if none of the conditions matched
            this.speak();
        } else {
            this.speak();
        }
    }
    
    handleQuestDecline() {
        quests.echoesOfTheNorth.declinedCount++;
    
        let response = "";
    
        switch (quests.echoesOfTheNorth.declinedCount) {
            case 1:
                response = "I understand. Not everyone is ready for what lies beyond.";
                break;
            case 2:
                response = "You again? Still unwilling to help? Hmph...";
                break;
            case 3:
            default:
                response = "Very well, I won’t ask about the pendant again.";
                quests.echoesOfTheNorth.permanentlyDeclined = true;

                setTimeout(() => {
                    this.dialogue = "If you won’t help with my past... perhaps you can investigate something else for me.";
                    dialoguePrompt = "Start a different quest?";
                    pendingQuest = () => {
                        quests.shadowsOfDoubt.started = true;
                        this.dialogue = "There’s a cloaked figure near the graveyard. I want to know who they are.";
                    };
                }, 2000);
                break;
        }
    
        this.dialogue = response;
    }
    
    
    update(deltaTime) {
        this.dialogueCooldown -= deltaTime * 1000; 
    
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
        
        ctx.drawImage(oldManPic, 0, 0, 34, 32, this.x, this.y, 34, 32);
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

function drawDialoguePrompt() {
    if (!dialoguePrompt) {
        for (let npc of npcs) {
            const dx = player.x - npc.x;
            const dy = player.y - npc.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
       
            if (dist < 40) {
                drawTextWithShadow("Press X to Interact", player.x + 20, player.y + 60, "white", "14px Arial", "left");
            }
          }
        return;
    }
    
    const width = 400;
    const height = 100;
    const x = canvas.width / 2 - width / 2;
    const y = canvas.height - height - 30;

    colorRect(x, y, width, height, "rgba(0, 0, 0, 0.8)");
    outlineRect(x, y, width, height, "white");

    drawTextWithShadow(dialoguePrompt, x + 20, y + 30, "white", "16px Arial", "left");
    drawTextWithShadow("[Y]es   [N]o", x + 20, y + 60, "gray", "14px Arial", "left");
}

function spawnGraveyardMystery() {
    const figure = new NPC(
        "Cloaked Figure",
        25 * TILE_W,
        16 * TILE_H,
        ["..."], // mysterious
        "Suspicious?"
    );

    npcs.push(figure);
}




  


