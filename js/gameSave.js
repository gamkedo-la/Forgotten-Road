function saveGameData() {
    const data = {
        player: {
            name: player.name,
            x: player.x,
            y: player.y,
            health: player.health,
            damage: player.damage,
            level: player.level,
            gold: player.gold,
            maxStamina: player.maxStamina,
            currentStamina: player.currentStamina,
            arrows: player.arrows,
            inventory: player.inventory,
            equipment: {
                weapon: player.equipment.weapon,
                armor: player.equipment.armor,
                accessory: player.equipment.accessory,
            },
        },
        enemies: enemies.map(enemy => ({
            name: enemy.name,
            x: enemy.x,
            y: enemy.y,
            health: enemy.currentHP,
            damage: enemy.damage
        })),
        playState: playState,
        currentMapKey: typeof currentMapKey !== 'undefined' ? currentMapKey : null,
        destructibles: destructibles,
        worldItems: worldItems,
        // Only save persistent/important NPCs 
        npcs: npcs
            .filter(npc => [
                "Blacksmith",
                "Alchemist",
                "Chef Gormondo",
                "Chuck",
                "Mick",
                "Old Man",
                "First Doctor",
                "Second Doctor"
            ].includes(npc.name))
            .map(npc => ({
                name: npc.name,
                x: npc.x,
                y: npc.y,
                dialogueLines: npc.dialogueLines,
                hoverText: npc.hoverText,
                schedule: npc.schedule
            })),

        dialoguePrompt: dialoguePrompt,
        pendingQuest: pendingQuest,
        lastMapSwitchTime: lastMapSwitchTime,
        currentWeather: currentWeather,
        timeOfDay: timeOfDay,
        dayNightTimer: dayNightTimer,
        pushableBlocks: pushableBlocks,
        backgroundGrid: backgroundGrid,
        insidebuilding: insidebuilding,
        quests: {
            echoesOfTheNorth: {
                started: quests.echoesOfTheNorth.started,
                completed: quests.echoesOfTheNorth.completed,
                pendantFound: quests.echoesOfTheNorth.pendantFound,
                declinedCount: quests.echoesOfTheNorth.declinedCount,
                permanentlyDeclined: quests.echoesOfTheNorth.permanentlyDeclined
            },
            shadowsOfDoubt: {
                started: quests.shadowsOfDoubt.started,
                completed: quests.shadowsOfDoubt.completed
            },
            yesYourEggcellence: {
                started: quests.yesYourEggcellence.started,
                completed: quests.yesYourEggcellence.completed,
                eggsFound: quests.yesYourEggcellence.eggsFound,
                eggsNeeded: quests.yesYourEggcellence.eggsNeeded,
                mushroomsFound: quests.yesYourEggcellence.mushroomsFound,
                mushroomsNeeded: quests.yesYourEggcellence.mushroomsNeeded,
                rewardGold: quests.yesYourEggcellence.rewardGold
            },
            restlessBones: {
                started: quests.restlessBones.started,
                completed: quests.restlessBones.completed,
                skeletonsDefeated: quests.restlessBones.skeletonsDefeated,
                skeletonsNeeded: quests.restlessBones.skeletonsNeeded
            },
            skeletonKing: {
                started: quests.skeletonKing.started,
                completed: quests.skeletonKing.completed,
                bossDefeated: quests.skeletonKing.bossDefeated
            },
            dosDoctors: {
                started: quests.dosDoctors.started,
                completed: quests.dosDoctors.completed,
                herbsFound: quests.dosDoctors.herbsFound,
                herbsNeeded: quests.dosDoctors.herbsNeeded,
                specimensFound: quests.dosDoctors.specimensFound,
                specimensNeeded: quests.dosDoctors.specimensNeeded,
                rewardGold: quests.dosDoctors.rewardGold
            }
        }
    };
    
    gameSaved(data);
}

function gameSaved(data) {
    if (!localStorage) {
        saveError("Saving game is not supported in this browser.");
        return;
    }

    const existingSave = localStorage.getItem("gameSave");
    if (!existingSave) {
        console.log("No existing save found, saving new game data.");
        setGameSaveData(data);
    } else {
        overWriteSaveData(data);
    }
    console.log("Game saved successfully!");
}

function setGameSaveData(data) {
    localStorage.setItem("gameSave", JSON.stringify(data));
    console.log("Save Game Data:", localStorage.getItem("gameSave"));
}

function overWriteSaveData(data) {
    if (confirm("An existing save file was found. Do you want to overwrite it?")) {
        setGameSaveData(data);
    } else {
        console.log("Save operation cancelled by user.");
    } 
}

function DeleteGameSaveData() {
    localStorage.removeItem("gameSave");
    console.log("Game save cleared.");
}

function saveError(message) {
    alert("An error occurred while saving the game: " + message);
}
