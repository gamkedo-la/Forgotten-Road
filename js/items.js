// === Global item templates ===

var basicStaff = {
    id: "basic_staff",
    name: "Basic Staff",
    type: "weapon",
    damage: 5,
    sprite: staffIconPic, 
    stackable: true,
    quantity: 1,
    durability : 10,
};

var leatherArmor = {
    id: "leather_armor",
    name: "Leather Armor",
    type: "armor",
    defense: 2,
    sprite: leatherArmorIconPic,
    stackable: false,
    quantity: 1
};

var healthPotion = {
    id: "health_potion",
    name: "Health Potion",
    type: "consumable",
    use: "heal",
    amount: 5,
    sprite: healthPotionPic,
    stackable: true,
    quantity: 1
};

var questPendant = {
    id: "quest_pendant",
    name: "Silver Pendant",
    type: "quest",
    sprite: pendantPic,
    stackable: false,
    quantity: 1
  };
  

var boltPickUp = {
    id: "basic_bolt",
    name: "Bolt",
    type: "consumable",
    use: "bolt",
    amount: 5,
    sprite: boltItemPic,
    stackable: true,
    quantity: 5
};

function drawBackpackUI(ctx, player) {
    if (!inventoryOpen) return; 

    const panelX = 50;
    const panelY = 50;
    const panelW = canvas.width - 100;
    const panelH = canvas.height - 100;
    const slotSize = 40;
    const padding = 6;
    const cols = 6;

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(panelX, panelY, panelW, panelH);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Backpack", panelX + 10, panelY + 30);

    let startX = panelX + 10;
    let startY = panelY + 50;

    player.inventory.forEach((item, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = startX + col * (slotSize + padding);
        const y = startY + row * (slotSize + padding);

        // Draw icon
        ctx.fillStyle = "gray";
        ctx.fillRect(x, y, slotSize, slotSize);
        if (item.sprite instanceof Image) {
            ctx.drawImage(item.sprite, x, y, slotSize, slotSize);
        }

        // Draw quantity
        if (item.stackable && item.quantity > 1) {
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "right";
            ctx.fillText(`x${item.quantity}`, x + slotSize - 2, y + slotSize - 2);
            ctx.textAlign = "start";
        }

        // Equip or use
        if (
            mouse.clicked &&
            mouse.x >= x && mouse.x <= x + slotSize &&
            mouse.y >= y && mouse.y <= y + slotSize
        ) {
            if (item.type === "consumable") {
                player.useItem(item);
            } else {
                player.equipItem(item);
            }
        }
    });

    // Equipment section
    const equipStartX = panelX + panelW - 200;
    const equipStartY = panelY + 60;
    ctx.fillText("Equipped", equipStartX, equipStartY - 20);

    ["weapon", "armor", "accessory"].forEach((slot, i) => {
        let boxY = equipStartY + i * (slotSize + 20);
        ctx.strokeStyle = "white";
        ctx.strokeRect(equipStartX, boxY, slotSize, slotSize);

        const equipped = player.equipment[slot];
        if (equipped && equipped.sprite instanceof Image) {
            ctx.drawImage(equipped.sprite, equipStartX, boxY, slotSize, slotSize);
        } else {
            ctx.fillStyle = "#222";
            ctx.fillRect(equipStartX, boxY, slotSize, slotSize);
        }

        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(slot.charAt(0).toUpperCase() + slot.slice(1), equipStartX + slotSize + 10, boxY + 20);
    });

    mouse.clicked = false; // Reset click
}

