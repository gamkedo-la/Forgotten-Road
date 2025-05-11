// UI Elements

const Button = (
  x = 0,
  y = 0,
  text = "TEXT",
  baseColor = "red",
  highlightColor = "green",
  textColor = "black",
  minWidth = 100,
  minHeight = 50,
  font = "13px sans-serif"
) => {
  // states
  let selected = false;
  let highlighted = false;

  // highlighted check
  highlighted =
    mouse.x >= x &&
    mouse.x <= x + minWidth &&
    mouse.y >= y &&
    mouse.y <= y + minHeight;

  // selected check
  selected = highlighted && mouse.clicked;

  // background
  ctx.fillStyle = highlighted ? highlightColor : baseColor;
  ctx.fillRect(x, y, minWidth, minHeight);
  ctx.fillStyle = textColor;

  // text
  let metrics = ctx.measureText(text);
  let fontHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  drawTextWithShadow(
    text,
    x + minWidth / 2,
    y + minHeight / 2 + fontHeight / 2,
    textColor,
    font,
    "center"
  );

  // tell the UI if we have been selected so that we can execute any logic related to this button
  return selected;
};
