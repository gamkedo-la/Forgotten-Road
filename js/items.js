function drawBackpackUI(ctx, player) {
    let startX = 600;
    let startY = 10;
    let slotSize = 32;
    let padding = 4;
    let cols = 5;

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(
        startX - 5,
        startY - 5,
        cols * (slotSize + padding),
        Math.ceil(player.inventory.length / cols) * (slotSize + padding)
    );

    let hoveredItem = null;

    player.inventory.forEach((item, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = startX + col * (slotSize + padding);
        const y = startY + row * (slotSize + padding);

        // Draw icon
        if (item.sprite instanceof Image) {
            ctx.drawImage(item.sprite, x, y, slotSize, slotSize);
        } else {
            ctx.fillStyle = "gray";
            ctx.fillRect(x, y, slotSize, slotSize);
        }

        // Split item name into two lines
        const words = item.name.split(" ");
        let firstLine = item.name;
        let secondLine = "";

        if (words.length > 1) {
            firstLine = words[0];
            secondLine = words.slice(1).join(" ");
        }

        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        const centerX = x + slotSize / 2;
        const firstWidth = ctx.measureText(firstLine).width;
        const secondWidth = ctx.measureText(secondLine).width;

        ctx.fillText(firstLine, centerX - firstWidth / 2, y + slotSize + 10);
        if (secondLine) {
            ctx.fillText(secondLine, centerX - secondWidth / 2, y + slotSize + 20);
        }

        // Hover detection
        if (
            mouse.x >= x && mouse.x <= x + slotSize &&
            mouse.y >= y && mouse.y <= y + slotSize
        ) {
            hoveredItem = item;
        }

        // Click detection
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

        // Draw stack quantity
        if (item.stackable && item.quantity > 1) {
            ctx.fillStyle = "white";
            ctx.font = "10px Arial";
            ctx.textAlign = "right";
            ctx.fillText(`x${item.quantity}`, x + slotSize - 2, y + slotSize - 2);
        }
        ctx.textAlign = "start";
    });

    // Draw tooltip if hovering
    if (hoveredItem) {
        const tooltipText = hoveredItem.name;
        const padding = 6;
        ctx.font = "12px Arial";
        const textWidth = ctx.measureText(tooltipText).width;
        const tooltipX = mouse.x + 10;
        const tooltipY = mouse.y + 10;

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(tooltipX, tooltipY, textWidth + padding * 2, 20);

        ctx.fillStyle = "white";
        ctx.fillText(tooltipText, tooltipX + padding, tooltipY + 14);
    }
}
