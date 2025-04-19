class TextEntity {
  constructor(text, x, y, color, x_speed = 0, y_speed = 0, lifespan = 10) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.xspeed = x_speed;
    this.yspeed = y_speed;
    this.lifespan = lifespan;
  }

  update(dt) {
    this.x += this.xspeed * dt;
    this.y += this.yspeed * dt;

    this.lifespan -= dt;
    if (this.lifespan <= 0) {
      const index = temp_ui_elements.indexOf(this);
      temp_ui_elements.splice(index, 1);
      console.log(`floating dmg number removed from ui elements array.`);
    }
  }

  draw() {
    ctx.globalAlpha = this.lifespan;
    drawTextWithShadow(this.text, this.x - camera.x, this.y - camera.y, this.color);
    ctx.globalAlpha = 1;
  }
}
