const FADE_BUBBLES = true; // smoothly fade in the speech bubbles?
var dialoguePortraitSX = 0;

// the current state for all known quests
// as used by npc.js and main.js
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
    },
    yesYourEggcellence: {
        started: false,
        completed: false,
        eggsFound: 0,
        eggsNeeded: 4,
        mushroomsFound: 0,
        mushroomsNeeded: 4,
        rewardGold: 250
    },
    restlessBones: {
        started: false,
        completed: false,
        skeletonsDefeated: 0,
        skeletonsNeeded: 5
    },
    skeletonKing: {
        started: false,
        completed: false,
        bossDefeated: false
    },
    dosDoctors: {
        started: false,
        completed: false,
        herbsFound: 0,
        herbsNeeded: 10,
        specimensFound: 0,
        specimensNeeded: 6,
        //insulted: false,
        rewardGold: 600
    }
};

function findPathForNPC(startX, startY, endX, endY, collisionGrid, maxDistance = 640) {
    return findPath(startX, startY, endX, endY, collisionGrid, "npc", maxDistance);
}

class NPC extends Entity {
    constructor(name, x, y, dialogue, hoverText = null, schedule = null) {

        console.log("Spawning an NPC named " + name + " at " + x + "," + y);

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
        this.portraitImage = portraitPic;
        this.portraitSX = 0;
        this.schedule = schedule;
        this.active = true;
        this.targetX = null;
        this.targetY = null;
        this._schedulePhase = null;
        this.speed = 30;
        this.path = []; 
        this.nextMoveTimer = 0; 

    }

    // Getter for dialogue
    get dialogue() {
        return this._dialogue;
    }

    // Setter for dialogue
    set dialogue(newDialogue) {
        this._dialogue = newDialogue;
    }

    applySchedule(timeOfDay) {
        if (!this.schedule) return;

        const phase = this.schedule[timeOfDay];
        if (!phase) return;

        this.dialogueSet = phase.dialogueSet ?? "default";
        this._schedulePhase = phase;

        if (phase.destination) {
            const startTileX = Math.floor(this.x / TILE_W);
            const startTileY = Math.floor(this.y / TILE_H);
            const endTileX = Math.floor(phase.destination.x / TILE_W);
            const endTileY = Math.floor(phase.destination.y / TILE_H);

            this.path = findPathForNPC(startTileX, startTileY, endTileX, endTileY, collisionGrid);
            this.targetX = phase.destination.x;
            this.targetY = phase.destination.y;
            this.active = true;
        } else {
            this.path = [];
            this.targetX = null;
            this.targetY = null;
        }
    }

    speak() {
        console.log(`${this.name}: "${this._dialogue}"`);
    }

    interact() {
        if (!this.active) return;
        if (dialoguePrompt || pendingQuest) {
            console.log("[INTERACT] Skipped — dialogue prompt active");
            return;
        }

        if (this.name === "Chuck") {
            const graveyardQuest = quests.restlessBones;
            const bossQuest = quests.skeletonKing;

            if (!graveyardQuest.started && !graveyardQuest.completed) {
                dialoguePrompt = "The dead are rising! I saw skeletons crawling out of the graveyard...\nPlease, I’m too scared to go near it. Can you find out what’s causing it?";
                pendingQuest = () => {
                    graveyardQuest.started = true;
                    this.dialogue = "Thank you... I just can't face them myself. The graveyard’s to the east.";
                    console.log("Quest Started: Restless Bones");
                };
                return;
            }

            if (graveyardQuest.started && !graveyardQuest.completed) {
                this.dialogue = `Please be careful... ${graveyardQuest.skeletonsNeeded - graveyardQuest.skeletonsDefeated} more skeletons still roam the graveyard.`;
                this.speak();
                return;
            }

            if (graveyardQuest.completed && !bossQuest.started) {
                dialoguePrompt = "You've done it... but something still feels wrong. The air is heavy...\nCould it be the Skeleton King? Will you face him?";
                pendingQuest = () => {
                    bossQuest.started = true;
                    this.dialogue = "May the gods protect you. The crypt should be open now.";
                    console.log("Quest Started: Skeleton King");
                    spawnSkeletonKing();
                    spawnMonstersFromMap();

                };
                return;
            }

            if (bossQuest.started && !bossQuest.completed) {
                this.dialogue = "The crypt trembles... the Skeleton King still roams.";
                this.speak();
                return;
            }

            if (bossQuest.completed) {
                this.dialogue = "You defeated the Skeleton King. You've done this village a great honor.";
                this.speak();
                return;
            }

            this.speak();
        }

        if (this.name === "Chef Gormondo") {
            const quest = quests.yesYourEggcellence;
            if (!quest.started) {
                dialoguePrompt = "I was ordered to make breakfast for the king and\nqueen and need 4 eggs and 4 mushrooms.\nPlease help me? I'll make it well worth your while.";
                pendingQuest = () => {
                    quest.started = true;
                    this.dialogue = "Thanks! This will be an omlette to remember.";
                }
            } else { // quest is underway
                if (quest.eggsFound < quest.eggsNeeded || quest.mushroomsFound < quest.mushroomsNeeded) {
                    this.dialogue = "We need " + (quest.eggsNeeded - quest.eggsFound) + " more eggs and " + (quest.mushroomsNeeded - quest.mushroomsFound) + " more mushrooms.";
                } else {
                    quest.completed = true;
                    this.dialogue = "Thank you for the eggs and mushrooms! You saved my life and the king and queen will have their breakfast as ordered. Here is your reward.";
                    player.gold += quest.rewardGold;
                }
            }
            this.speak();
        }

        if (this.name === "Mick") {
            //Replace with a Quest from Chuck
            /*const quest = quests.yesYourEggcellence;ck
            if (!quest.started) {
                dialoguePrompt = "I was ordered to make breakfast for the king and\nqueen and need 4 eggs and 4 mushrooms.\nPlease help me? I'll make it well worth your while.";
                pendingQuest = () => {
                    quest.started = true;
                    this.dialogue = "Thanks! This will be an omlette to remember.";
                }
            } else { // quest is underway
                if (quest.eggsFound < quest.eggsNeeded || quest.mushroomsFound < quest.mushroomsNeeded) {
                    this.dialogue = "We need "+(quest.eggsNeeded-quest.eggsFound)+" more eggs and "+(quest.mushroomsNeeded-quest.mushroomsFound)+" more mushrooms.";
                } else {
                    quest.completed = true;
                    this.dialogue = "Thank you for the eggs and mushrooms! You saved my life and the king and queen will have their breakfast as ordered. Here is your reward.";
                    player.gold += quest.rewardGold;
                }
            }*/
            this.speak();
        }

        if (this.name === "Old Man") {
            dialoguePortraitSX = 64 * 2;
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

            // Handle quest turn-in
            if (quest.pendantFound && !quest.completed) {
                quest.completed = true;
                this.dialogue = "You found it! I can’t thank you enough.";
                player.gold += 100;
                console.log("Quest Completed! +100 gold");
                return;
            }

            // Default response if none of the conditions matched
            this.speak();

        } else if (this.name === "Blacksmith") {
            dialoguePortraitSX = 64 * 1;
            let inventory = [basicStaff, leatherArmor, healthPotion, boltPickUp, ringOfEnergy];
            openShopInterface("Blacksmith", inventory);
            return;
        } else if (this.name === "Alchemist") {
            let inventory = [healthPotion, manaPotion, elixirOfSpeed, antidote]; // whatever items you want!
            openShopInterface("Alchemist", inventory);
            return;
        } else {
            this.speak();
        }


        if (this.name === "First Doctor" || "Second Doctor") { // Could be bad syntax. Both NPCs should behave the same.
            const quest = quests.dosDoctors;
            if (quest.completed) {
                this.dialogue = "It hasn't yet rotten... yes, I can tell... a sprinkle to preserve... reanimation...";
                return;
            }

            if (!quest.started) {
                this.dialogue = "Oh... you are not yet plagued. We need just a few things... and we will bestow upon you, something, in turn.";
                dialoguePrompt = "Will you help the Dos Doctors?";
                pendingQuest = () => {
                    quest.started = true;
                    this.dialogue = "Excellent... make haste.";
                    console.log("Quest Started: Dos Doctors");
                };
                return;
            } else { // quest is underway
                if (quest.herbsFound < quest.herbsNeeded || quest.specimensFound < quest.specimensNeeded) {
                    this.dialogue = "We need " + (quest.herbsNeeded - quest.herbsFound) + " more herbs and " + (quest.specimensNeeded - quest.specimensFound) + " more specimens...";
                } else {
                    quest.completed = true;
                    this.dialogue = "Yes... this is what we needed... now, as we promised.";
                    // A curse of some sort would be cooler than gold,
                    // that affects interactions with other NPCs.
                    player.gold += quest.rewardGold;
                }
            }
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

    update(deltaTime, timeOfDay = "day") {
        this.applySchedule(timeOfDay);

        // Movement toward destination
        if (this.active && this.path.length > 0) {
        this.nextMoveTimer -= deltaTime;
            if (this.nextMoveTimer <= 0) {
                const next = this.path.shift();
                if (next) {
                    this.x = next.x * TILE_W;
                    this.y = next.y * TILE_H;
                }

                this.nextMoveTimer = 0.3; 
            }
        } else if (this.targetX !== null) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 1) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.targetX = null;
            this.targetY = null;

            if (this._schedulePhase && this._schedulePhase.active === false) {
                this.active = false;
            }
        }
    }

        if (!this.active) return;

        this.dialogueCooldown -= deltaTime * 1000;
    }


    draw(deltaTime) {
    this.bubbleBobTimer += deltaTime;
    const bobOffset = Math.sin(this.bubbleBobTimer * 3) * 2;

    // Choose NPC image
    let npcImage = oldManPic;
    this.portraitSX = 64 * 2;

    if (this.name === "Blacksmith") {
        npcImage = blacksmithPic;
        this.portraitSX = 64 * 1;
    } else if (this.name === "Alchemist") {
        npcImage = alchemistPic;
        this.portraitSX = 64 * 0;
    } else if (this.name === "Chef Gormondo") {
        npcImage = chefPic;
        this.portraitSX = 64 * 0;
    } else if (this.name === "Chuck") {
        npcImage = chuckPic;
        this.portraitSX = 64 * 0;
    } else if (this.name === "Mick") {
        npcImage = mickPic;
        this.portraitSX = 64 * 3;
    }

    this.drawShadow();
    ctx.drawImage(npcImage, 0, 0, 32, 34, this.x, this.y, 32, 34);

    // Draw Zzz if inactive
    if (!this.active) {
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Zzz", this.x + this.width / 2, this.y - 10 + bobOffset);
    }

    // Draw dialogue bubble
    if (this.dialogue && this.active) {
        let bubblePadding = 6;
        ctx.font = "12px Arial";
        let textWidth = ctx.measureText(this.dialogue).width;
        let bubbleWidth = textWidth + bubblePadding * 2;
        let bubbleHeight = 20;

        let bubbleX = this.x + this.width / 2 - bubbleWidth / 2;
        let bubbleY = this.y - bubbleHeight - 10 + bobOffset;

        if (FADE_BUBBLES) ctx.globalAlpha = Math.min(1.0, Math.min(this.bubbleBobTimer, this.dialogueCooldown));
        ctx.drawImage(portraitPic, this.portraitSX, 0, 64, 64, bubbleX - 37, bubbleY - 5, 32, 32);
        colorRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, "white");
        outlineRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, "black");
        drawTextWithShadow(this.dialogue, this.x + this.width / 2, bubbleY + 14, "black", "12px Arial", "center");
        if (FADE_BUBBLES) ctx.globalAlpha = 1;
    }

    // Quest marker (! or ?)
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";

    const quest = this.associatedQuest;
    if (quest && !dialoguePrompt) {
        if (!quests[quest].started) {
        ctx.fillStyle = "gold";
        ctx.fillText("!", this.x + this.width / 2, this.y - 10);
        } else if (quests[quest].completed) {
        ctx.fillStyle = "cyan";
        ctx.fillText("?", this.x + this.width / 2, this.y - 10);
        }
    } // last if (quest...)
  } // END draw()
} // END class NPC


function drawDialoguePrompt() {
    if (!dialoguePrompt) {
        if (!shopOpen) {
            for (let npc of npcs) {
                const dx = player.x - npc.x;
                const dy = player.y - npc.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 40) {
                    drawTextWithShadow("Press X to Interact", player.x + 20, player.y + 60, "white", "14px Arial", "left");
                }
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
    drawTextWithShadow("[Y]es   [N]o", x + 20, y + 80, "gray", "14px Arial", "left");
    ctx.drawImage(portraitPic, dialoguePortraitSX, 0, 64, 64, x - 85, y + 17, 64, 64);
    console.log("Draw Portrait")

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
