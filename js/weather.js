const WEATHER_CHANGE_MIN_TIME = 10;
const WEATHER_CHANGE_RANDOM_TIME = 10;

class WeatherSystem {
  constructor(type = "clear") {
    this.type = type;
    this.particles = [];
    this.spawnRate = 40; 
    this.timer = 0;
    this.lightningAlpha = 0;
    this.thunderTimer = 0;
    this.nextThunderTime = 5 + Math.random() * 10;
    this.weatherTimer = 0;
    this.nextWeatherChange = WEATHER_CHANGE_MIN_TIME + Math.random() * WEATHER_CHANGE_RANDOM_TIME;
    this.weatherChangeTriggered = false;
    this.weatherTypes = ["clear", "rain", "snow", "storm"];
  }

  update(deltaTime) {
    this.timer += deltaTime;

    // No particles needed if clear weather
    if (this.type === "clear") return;

    // Snow higher spawn rate to compensate for slower falling
    const effectiveSpawnRate = this.type === "snow" ? this.spawnRate * 1.5 : this.spawnRate;

    // Spawn different particles depending on type of weather
    if (["rain", "storm", "snow"].includes(this.type) && this.timer > 1 / effectiveSpawnRate) {
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
    
    const rainobj =  {
      x: camera.x - canvas.width / 2 - padding + Math.random() * (canvas.width + padding * 2),
      y: camera.y - canvas.height / 2 - 50,
      vx: 0,
      vy: 3 + Math.random() * 10,
      size: 2,
      color: "lightblue"
    };

    if (this.type === "snow"){
      return {
        ...rainobj,
        y: camera.y - canvas.height / 2,  // snow spawn inside visible area
        vy: Math.random() + 1,
        size: Math.random() + 3,
        color: "lightgray"
      }
    }
    return {
      ...rainobj,
    }

  }

  render(ctx) {
    if (this.type === "rain") {
      ctx.fillStyle = "rgba(100, 100, 100, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (this.type === "storm") {
      ctx.fillStyle = "rgba(50, 50, 50, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (this.type === "snow") {
      ctx.fillStyle = "rgba(100, 100, 100, 0.1)";
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

  changeWeatherRandomly() {
    const newType = this.weatherTypes[Math.floor(Math.random() * this.weatherTypes.length)];
    this.setWeatherType(newType);
    this.resetWeatherTimer();
    return newType;
  }

  getWeatherTimerInfo() {
    return {
      timer: this.weatherTimer,
      nextChange: this.nextWeatherChange
    };
  }

   updateWeatherTimer(deltaTime) {
      this.weatherTimer += deltaTime;
      // check if timer exceeds threshold and we haven't already recently triggered a change
      if (this.weatherTimer > this.nextWeatherChange) {
         if (!this.weatherChangeTriggered) {
            // console.log(`Weather timer reached threshold: ${this.weatherTimer.toFixed(2)}s > ${this.nextWeatherChange.toFixed(2)}s. Triggering change.`);
            this.weatherChangeTriggered = true;
            return true;
         }
      } else if (this.weatherTimer <= this.nextWeatherChange) {
         this.weatherChangeTriggered = false;
      }
      return false;
   }

  resetWeatherTimer() {
     this.weatherTimer = 0;
     this.weatherChangeTriggered = false;
     this.nextWeatherChange = WEATHER_CHANGE_MIN_TIME + Math.random() * WEATHER_CHANGE_RANDOM_TIME;
     //console.log(`Weather timer reset. Next change in ${this.nextWeatherChange.toFixed(2)}s`);
  }

  setWeatherType(type) {
    // Validate weather type
    if (!this.weatherTypes.includes(type)) {
      console.error(`Invalid weather type: ${type}`);
      return;
    }
    this.type = type;
    //console.log(`Weather changing to - ${type} - via weather system`);

    this.particles = [];
  }

  getWeatherType() {
    return this.type;
  }
}
