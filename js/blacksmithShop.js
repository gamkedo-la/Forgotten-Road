let shopOpen = false;
let shopInventory = [];
let playerInventory = [];
let selectedItemIndex = 0;
let shopJustOpened = false;
let inSellMode = false; 

function openShopInterface(npcName, inventory) {
    shopOpen = true;
    shopJustOpened = true;
    shopInventory = inventory;
    selectedItemIndex = 0;
    inSellMode = false; 
    paused = true;
    keys.action = false;
    keys.cancel = false;
    keys.up = false;
    keys.down = false;
    keys.tab = false;
    keys.s = false;
}

function closeShopInterface() {
    shopOpen = false;
    paused = false;
}

function drawShopUI() {
    const x = 250;
    const y = 50;
    const width = 300;
    const height = 220;

    // Background panel
    colorRect(x, y, width, height, "rgba(0,0,0,0.8)");
    outlineRect(x, y, width, height, "white");

    // Tabs
    drawTextWithShadow(inSellMode ? "[Buy]" : "Buy", x + 10, y + 20, inSellMode ? "gray" : "white", "16px Arial");
    drawTextWithShadow(inSellMode ? "Sell" : "[Sell]", x + 80, y + 20, inSellMode ? "white" : "gray", "16px Arial");

    // Item list
    const itemList = inSellMode ? player.inventory : shopInventory;

    if (itemList.length === 0) {
        drawTextWithShadow("No items available", x + 20, y + 60, "gray", "14px Arial");
    } else {
        itemList.forEach((item, i) => {
            const color = i === selectedItemIndex ? "yellow" : "white";
        
            let stat = "";
            if (item.minDamage !== undefined && item.maxDamage !== undefined) {
                stat = `(${item.minDamage}-${item.maxDamage} dmg)`;
            } else if (item.damage !== undefined) {
                stat = `(+${item.damage} dmg)`;
            } else if (item.defense !== undefined) {
                stat = `(+${item.defense} def)`;
            } else if (item.amount && item.use === "heal") {
                stat = `(+${item.amount} HP)`;
            }
        
            const price = inSellMode
                ? `${Math.floor(item.cost / 2)}g`
                : `${item.cost}g`;
        
            const label = `${item.name} ${stat} - ${price}`;
            drawTextWithShadow(label, x + 20, y + 50 + i * 20, color);
        });
    }

    drawTextWithShadow(`Your Gold: ${player.gold}`, x + 10, y + height - 20, "gold");
    drawTextWithShadow("Press [Esc] to leave", x + width - 160, y + height - 20, "gray", "12px Arial");

    // === Tooltip Panel ===
    const selectedItem = itemList[selectedItemIndex];
    if (selectedItem) {
        const tx = x + width + 20; 
        const ty = y;
        const tWidth = 220;
        const tHeight = 160;

        colorRect(tx, ty, tWidth, tHeight, "rgba(0, 0, 0, 0.9)");
        outlineRect(tx, ty, tWidth, tHeight, "white");

        drawTextWithShadow(selectedItem.name, tx + 10, ty + 20, "white", "14px Arial");

        let detailY = ty + 40;

        // Description
        if (selectedItem.description) {
            drawTextWithShadow(selectedItem.description, tx + 10, detailY, "lightgray", "12px Arial");
            detailY += 20;
        }

        // Stats
        if (selectedItem.minDamage !== undefined && selectedItem.maxDamage !== undefined) {
            drawTextWithShadow(`Damage: ${selectedItem.minDamage}-${selectedItem.maxDamage}`, tx + 10, detailY, "orange");
            detailY += 20;
        }
        if (selectedItem.damage !== undefined) {
            drawTextWithShadow(`Damage: ${selectedItem.damage}`, tx + 10, detailY, "orange");
            detailY += 20;
        }
        if (selectedItem.defense !== undefined) {
            drawTextWithShadow(`Defense: ${selectedItem.defense}`, tx + 10, detailY, "skyblue");
            detailY += 20;
        }
        if (selectedItem.amount && selectedItem.use === "heal") {
            drawTextWithShadow(`Heals: ${selectedItem.amount} HP`, tx + 10, detailY, "green");
            detailY += 20;
        }

        // Value and Sell
        drawTextWithShadow(`Value: ${selectedItem.cost}g`, tx + 10, detailY, "gold");
        detailY += 20;

        if (inSellMode) {
            drawTextWithShadow(`Sell: ${Math.floor(selectedItem.cost / 2)}g`, tx + 10, detailY, "silver");
        }
    }
}




