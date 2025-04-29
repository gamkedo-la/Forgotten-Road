class WeatherSystem {
  constructor(type = "rain") {
    this.type = type;
    this.particles = [];
    this.spawnRate = 40; 
    this.timer = 0;
    this.lightningAlpha = 0;
    this.thunderTimer = 0;
    this.nextThunderTime = 5 + Math.random() * 10;
  }

  update(deltaTime) {
    this.timer += deltaTime;

    // Spawn rain particles
    if (["rain", "storm"].includes(this.type) && this.timer > 1 / this.spawnRate) {
      this.timer = 0;
      this.particles.push(this.createParticle());
    }

    // Update all particles
    for (let p of this.particles) {
      p.x += p.vx * deltaTime * 60;
      p.y += p.vy * deltaTime * 60;
    }

    // Remove off-screen
    this.particles = this.particles.filter((p) => p.y < canvas.height);

    // Storm logic (lightning flash)
    if (this.type === "storm") {
      this.thunderTimer += deltaTime;
      if (this.thunderTimer > this.nextThunderTime) {
        this.lightningAlpha = 1;
        this.thunderTimer = 0;
        this.nextThunderTime = 5 + Math.random() * 10;
      }
      if (this.lightningAlpha > 0) {
        this.lightningAlpha -= deltaTime * 2;
        if (this.lightningAlpha < 0) this.lightningAlpha = 0;
      }
    } else {
      this.lightningAlpha = 0;
    }
  }

  createParticle() {
    const padding = 400;
    return {
      x: camera.x - canvas.width / 2 - padding + Math.random() * (canvas.width + padding * 2),
      y: camera.y - canvas.height / 2 - 50,
      vx: 0,
      vy: 3 + Math.random() * 10,
      size: 2,
      color: "lightblue"
    };
  }

  render(ctx) {
    if (this.type === "rain") {
      ctx.fillStyle = "rgba(100, 100, 100, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (this.type === "storm") {
      ctx.fillStyle = "rgba(50, 50, 50, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Rain particles
    for (let p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lightning flash
    if (this.lightningAlpha > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
}
