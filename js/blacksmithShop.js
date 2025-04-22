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
    let x = 450;
    let y = 50;
    let width = 300;
    let height = 220;

    colorRect(x, y, width, height, "rgba(0,0,0,0.8)");
    outlineRect(x, y, width, height, "white");
    //drawTextWithShadow("Blacksmith Shop", x + 10, y + 20, "white", "16px Arial");
    drawTextWithShadow(inSellMode ? "Buy" : "[Buy]", x + 10, y + 20, inSellMode ? "gray" : "white", "16px Arial");
    drawTextWithShadow(inSellMode ? "[Sell]" : "Sell", x + 80, y + 20, inSellMode ? "white" : "gray", "16px Arial");

    let itemList = inSellMode ? player.inventory : shopInventory;

    itemList.forEach((item, i) => {
        let color = i === selectedItemIndex ? "yellow" : "white";
        let label = inSellMode
            ? `${item.name} - ${Math.floor(item.cost / 2)}g`
            : `${item.name} - ${item.cost}g`;
        drawTextWithShadow(label, x + 20, y + 50 + i * 20, color);
    });

    shopInventory.forEach((item, i) => {
        let highlight = i === selectedItemIndex ? "yellow" : "white";
        drawTextWithShadow(`${item.name} - ${item.cost}g`, x + 20, y + 50 + i * 20, highlight);
    });

    drawTextWithShadow(`Your Gold: ${player.gold}`, x + 10, y + height - 20, "gold");
}


