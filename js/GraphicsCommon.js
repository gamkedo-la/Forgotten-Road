function drawBitmapCenteredWithRotation(useBitmap, atX, atY, withAng) {
	ctx.save();
	ctx.translate(atX, atY);
	ctx.rotate(withAng);
	ctx.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
	ctx.restore();
}

function colorRect(topLeftX,topRightY, boxWidth,boxHeight, fillColor) {  //draw rectangles
	ctx.fillStyle = fillColor;
	ctx.fillRect(topLeftX,topRightY, boxWidth, boxHeight,);
}

function colorCircle(centerX,centerY, radius, fillColor) {  //draw circles
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	ctx.fill();
}

function colorText(showWords, textX, textY, fillColor, fontSize = 7) {
	ctx.fillStyle = fillColor;
	ctx.font=`${fontSize}px sans-serif`
	ctx.fillText(showWords, textX, textY);
}

function drawTextWithShadowCentered(text, x,y, color, font="13px sans-serif") {
	ctx.textAlign = "center";
	ctx.font = font;
	ctx.shadowBlur = 8;
	ctx.shadowColor = "black";
	// if these are both 0, it's more like a "glow"
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.fillStyle = color;
	ctx.fillText(text, x,y);
	ctx.shadowBlur = 0;
}

const UI_TEXT_STYLES = {
	DEFAULT: {
		primaryColor: "yellow",
		outlineColor: "black",
		font: "18px Arial",
		shadowBlur: 5,
		shadowOffsetX: 2,
		shadowOffsetY: 2,
		outlineWidth: 4
	},
	HEADER: {
		primaryColor: "white",
		outlineColor: "black",
		font: "bold 24px Arial",
		shadowBlur: 4,
		shadowOffsetX: 1,
		shadowOffsetY: 1,
		outlineWidth: 4
	}
};

function drawUIText(text, x, y, styleType = "DEFAULT") {
	const style = UI_TEXT_STYLES[styleType] || UI_TEXT_STYLES.DEFAULT;
	
	ctx.font = style.font;
	ctx.textAlign = "start";
	
	ctx.shadowBlur = style.shadowBlur;
	ctx.shadowColor = style.outlineColor;
	ctx.shadowOffsetX = style.shadowOffsetX;
	ctx.shadowOffsetY = style.shadowOffsetY;
	
	ctx.fillStyle = style.primaryColor;
	ctx.fillText(text, x, y);
	
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
}

function outlineRect(topLeftX, topLeftY, boxWidth, boxHeight, lineColor) {
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = "3";
    ctx.rect(topLeftX, topLeftY, boxWidth, boxHeight);
    ctx.stroke();
}

