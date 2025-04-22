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
    const x = 450;
    const y = 50;
    const width = 300;
    const height = 220;

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
            const label = inSellMode
                ? `${item.name} - ${Math.floor(item.cost / 2)}g`
                : `${item.name} - ${item.cost}g`;
            drawTextWithShadow(label, x + 20, y + 50 + i * 20, color);
        });
    }

    drawTextWithShadow(`Your Gold: ${player.gold}`, x + 10, y + height - 20, "gold");
    drawTextWithShadow("Press [Esc] to leave", x + width - 160, y + height - 20, "gray", "12px Arial");
}



