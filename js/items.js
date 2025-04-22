// === Global item templates ===

var basicStaff = {
    id: "basic_staff",
    name: "Basic Staff",
    type: "weapon",
    minDamage: 1,
    maxDamage: 5,
    critChance: 0.1,        
    critMultiplier: 1.5,   
    sprite: staffIconPic, 
    stackable: true,
    quantity: 1,
    durability: 10
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

var ringOfEnergy = {
  id: "ring_energy",
  name: "Ring of Energy",
  type: "accessory",
  description: "+5 Max Stamina",
  sprite: pendantPic, //ringPic,
  stackable: false,
  quantity: 1
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
    const totalSlots = 20;

    colorRect(panelX, panelY, panelW, panelH, "rgba(0, 0, 0, 0.8)");
    drawTextWithShadow("Backpack", panelX + 10, panelY + 30, "white", "18px Arial");

    let startX = panelX + 10;
    let startY = panelY + 50;

    for (let index = 0; index < totalSlots; index++) {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = startX + col * (slotSize + padding);
        const y = startY + row * (slotSize + padding);

        outlineRect(x, y, slotSize, slotSize, "gray");

        const item = player.inventory[index];
        if (item) {
            if (item.sprite instanceof Image) {
                ctx.drawImage(item.sprite, x, y, slotSize, slotSize);
            } else {
                colorRect(x, y, slotSize, slotSize, "gray");
            }

            if (item.stackable && item.quantity > 1) {
                ctx.fillStyle = "white";
                ctx.font = "12px Arial";
                ctx.textAlign = "right";
                ctx.fillText(`x${item.quantity}`, x + slotSize - 2, y + slotSize - 2);
                ctx.textAlign = "start";
            }

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
        }
    }

    // Equipment section
    const equipStartX = panelX + panelW - 200;
    const equipStartY = panelY + 60;
    drawTextWithShadow("Equipped", equipStartX, equipStartY - 20, "white", "18px Arial");
    ["weapon", "armor", "accessory"].forEach((slot, i) => {
        let boxY = equipStartY + i * (slotSize + 20);
        outlineRect(equipStartX, boxY, slotSize, slotSize, "white");
    
        const equipped = player.equipment[slot];
        if (equipped && equipped.sprite instanceof Image) {
            ctx.drawImage(equipped.sprite, equipStartX, boxY, slotSize, slotSize);
        } else {
            colorRect(equipStartX, boxY, slotSize, slotSize, "#222");
        }
    
        const labelX = equipStartX + slotSize + 10;
        colorText(slot.charAt(0).toUpperCase() + slot.slice(1), labelX, boxY + 20, "white", 12);
    
        // ▶ Stat Details
        if (equipped) {
            let detail = "";
            if (slot === "weapon" && equipped.damage) {
                detail = `+${equipped.damage} dmg`;
            } else if (slot === "armor" && equipped.defense) {
                detail = `+${equipped.defense} def`;
            } else if (equipped.description) {
                detail = equipped.description;
            }
    
            if (detail) {
                colorText(detail, labelX + 70, boxY + 20, "yellow", 12);
            }
        }
    });
    

    // Stats Panel
    const statsX = equipStartX;
    const statsY = equipStartY + 200;
    const weapon = player.equipment.weapon;
    const armor = player.equipment.armor;

    const baseDamage = 10;
    const weaponBonus = weapon?.damage || 0;
    const defense = armor?.defense || 0;

    const minDamage = baseDamage;
    const maxDamage = baseDamage + weaponBonus;

    drawTextWithShadow("Stats", statsX, statsY, "white", "16px Arial");
    colorText(`HP: ${player.currentHP}/${player.maxHP}`, statsX, statsY + 20, "white", 12);
    colorText(`Stamina: ${Math.floor(player.currentStamina)}/${player.maxStamina}`, statsX, statsY + 40, "white", 12);
    colorText(`Damage: ${minDamage}-${maxDamage}`, statsX, statsY + 60, "white", 12);
    colorText(`Defense: ${defense}`, statsX, statsY + 80, "white", 12);

    mouse.clicked = false;
}



