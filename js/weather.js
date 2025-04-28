class WeatherSystem {
    constructor(type = "rain") {
      this.type = type;
      this.particles = [];
      this.spawnRate = 40; // how many per second
      this.timer = 0;
    }
  
    update(deltaTime) {
      this.timer += deltaTime;
  
      // Spawn particles based on spawnRate
      if (this.timer > 1 / this.spawnRate) {
        this.timer = 0;
        this.particles.push(this.createParticle());
      }
  
      // Update all particles
      for (let p of this.particles) {
        p.x += p.vx * deltaTime * 60;
        p.y += p.vy * deltaTime * 60;
      }
  
      // Remove off-screen particles
      this.particles = this.particles.filter((p) => p.y < canvas.height);
    }
  
    createParticle() {
        const padding = 400; 
      
        if (this.type === "rain") {
          return {
            x: camera.x - canvas.width/2 - padding + Math.random() * (canvas.width + padding * 2),
            y: camera.y - canvas.height/2 - 50, // always start just above the visible screen
            vx: 0,
            vy: 3 + Math.random() * 10,
            size: 2,
            color: "lightblue"
          };
        } else if (this.type === "snow") {
          return {
            x: camera.x - canvas.width/2 - padding + Math.random() * (canvas.width + padding * 2),
            y: camera.y - canvas.height/2 - 50, // always start just above the camera
            vx: Math.random() * 50 - 25,
            vy: 50 + Math.random() * 30,
            size: 4,
            color: "white"
          };
        }
    }
      
      
    draw(ctx) {
        for (let p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
  }
  