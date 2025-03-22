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

function drawTextWithShadow(text, x,y, color, font="13px sans-serif", align) {
	ctx.textAlign = align;
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
		textColor: "yellow",
		shadowColor: "black",
		font: "18px Arial",
		shadowBlur: 5
	},
	HEADER: {
		textColor: "white",
		shadowColor: "black",
		font: "bold 24px Arial",
		shadowBlur: 4
	}
};

function outlineRect(topLeftX, topLeftY, boxWidth, boxHeight, lineColor) {
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = "3";
    ctx.rect(topLeftX, topLeftY, boxWidth, boxHeight);
    ctx.stroke();
}

