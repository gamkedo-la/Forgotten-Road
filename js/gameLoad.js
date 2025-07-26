function loadGameData() {
    if (!localStorage) {
        loadError('Loading game save is not supported in this browser.');
        return;
    }

    const savedData = localStorage.getItem('gameSave');
    if (!savedData) {
        loadError('No saved game data found.');
        return;
    }


    try {
        const data = JSON.parse(savedData);

        // Restore currentMapKey and trigger map load FIRST
        if (typeof data.currentMapKey !== 'undefined' && data.currentMapKey !== null) {
            if (typeof currentMapKey !== 'undefined') {
                currentMapKey = data.currentMapKey;
                if (typeof switchMap === 'function') {
                    switchMap(currentMapKey);
                }
            }
        }

        // Now restore player and all other state
        player.x = data.player.x;
        player.y = data.player.y;
        player.health = data.player.health;
        player.damage = data.player.damage;
        player.level = data.player.level;
        player.gold = data.player.gold;
        player.maxStamina = data.player.maxStamina;
        player.currentStamina = data.player.currentStamina;
        player.arrows = data.player.arrows;
        player.inventory = data.player.inventory;
        player.equipment = data.player.equipment;

        enemies.length = 0;
        data.enemies.forEach(e => enemies.push(Object.assign({}, e)));

        destructibles.length = 0;
        data.destructibles.forEach(d => destructibles.push(d));

        Object.keys(worldItems).forEach(key => worldItems[key] = []);
        Object.keys(data.worldItems).forEach(key => {
            worldItems[key] = data.worldItems[key];
        });

        npcs.length = 0;
        data.npcs.forEach(n => {
            const npc = new NPC(n.name, n.x, n.y, n.dialogueLines, n.hoverText, n.schedule);
            npc.x = n.x;
            npc.y = n.y;
            if (n.dialogueLines) npc.dialogueLines = n.dialogueLines;
            if (n.hoverText) npc.hoverText = n.hoverText;
            if (n.schedule) npc.schedule = n.schedule;

            if (npc.name === "Blacksmith") npc.image = blacksmithPic;
            else if (npc.name === "Alchemist") npc.image = alchemistPic;
            else if (npc.name === "Chef Gormondo") npc.image = chefPic;
            else if (npc.name === "Chuck") npc.image = chuckPic;
            else if (npc.name === "Mick") npc.image = mickPic;
            else if (npc.name === "Old Man") npc.image = oldManPic;

            npcs.push(npc);
        });

        // Restore currentMapKey and trigger map load if needed
        if (typeof data.currentMapKey !== 'undefined' && data.currentMapKey !== null) {
            if (typeof currentMapKey !== 'undefined') {
                currentMapKey = data.currentMapKey;
                // Use the main map transition function to reload the map
                if (typeof switchMap === 'function') {
                    switchMap(currentMapKey);
                }
            }
        }

        dialoguePrompt = data.dialoguePrompt;
        pendingQuest = data.pendingQuest;
        lastMapSwitchTime = data.lastMapSwitchTime;
        currentWeather = data.currentWeather;
        timeOfDay = data.timeOfDay;
        dayNightTimer = data.dayNightTimer;
        playState = data.playState;
        insidebuilding = data.insidebuilding;

        pushableBlocks.length = 0;
        data.pushableBlocks.forEach(b => pushableBlocks.push(b));

        backgroundGrid = data.backgroundGrid;

        // Restore quests
        Object.keys(data.quests).forEach(q => {
            Object.assign(quests[q], data.quests[q]);
        });
        console.log('Game loaded successfully!');
    } catch (error) {
        loadError('Failed to load saved game data: ' + error.message);
    }
}

function loadError(message) {
    alert("An error occurred while loading the game: " + message);
}