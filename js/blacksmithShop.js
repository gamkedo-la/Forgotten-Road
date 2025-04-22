let shopOpen = false;
let shopInventory = [];
let playerInventory = [];
let selectedItemIndex = 0;
let shopJustOpened = false;


function openShopInterface(npcName, inventory) {
    shopOpen = true;
    shopJustOpened = true; 
    shopInventory = inventory;
    selectedItemIndex = 0;
    paused = true;
    keys.action = false;
    keys.up = false;
    keys.down = false;
    keys.cancel = false;
}



function closeShopInterface() {
    shopOpen = false;
    paused = false;
}

function drawShopUI() {
    const x = 450;
    const y = 50;
    const width = 300;
    const height = 200;

    colorRect(x, y, width, height, "rgba(0,0,0,0.8)");
    outlineRect(x, y, width, height, "white");
    drawTextWithShadow("Blacksmith Shop", x + 10, y + 20, "white", "16px Arial");

    shopInventory.forEach((item, i) => {
        let highlight = i === selectedItemIndex ? "yellow" : "white";
        drawTextWithShadow(`${item.name} - ${item.cost}g`, x + 20, y + 50 + i * 20, highlight);
    });

    drawTextWithShadow(`Your Gold: ${player.gold}`, x + 10, y + height - 20, "gold");
}


