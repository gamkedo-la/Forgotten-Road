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

function colorText(showWords, textX, textY, fillColor, fontSize = 7, font = 'sans-serif') {
	ctx.fillStyle = fillColor;
	ctx.font=`${fontSize}px ${font}`
	ctx.fillText(showWords, textX, textY);
}

function drawTextWithShadow(text, x, y, color, font = "13px sans-serif", align = "left") {
	// can be >1 line now
    let lines = text.split("\n");
    for (let txt of lines) {
        ctx.textAlign = align;
        ctx.font = font;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = color;
        ctx.fillText(txt, x, y);
        ctx.shadowBlur = 0;
        y += 14; // ready for next line
    }
}

const UI_TEXT_STYLES = {
	DEFAULT: {
		textColor: "yellow",
		shadowColor: "black",
		font: "14px Arial",
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

function drawSprite(sprite, x, y, w = 32, h = 32, context = ctx) {
	context.drawImage(
	  sprite.img,
	  sprite.sX, sprite.sY, sprite.sW, sprite.sH,
	  x, y, w, h
	);
  }
  

