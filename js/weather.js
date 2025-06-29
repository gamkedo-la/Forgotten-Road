const WEATHER_CHANGE_MIN_TIME = 10;
const WEATHER_CHANGE_RANDOM_TIME = 10;

class WeatherSystem {
  constructor(type = "clear") {
    this.type = type;
    this.nextType = null;
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
    this.inTransition = false;
  }

  update(deltaTime) {
    this.timer += deltaTime;

    // No particles needed if clear weather and in transition to the next weather
    if (this.type === "clear" && !this.inTransition) return;

    // Snow higher spawn rate to compensate for slower falling
    const effectiveSpawnRate = this.type === "snow" ? this.spawnRate * 1.5 : this.spawnRate;

    // Spawn different particles depending on type of weather
    if (!this.inTransition && ["rain", "storm", "snow"].includes(this.type) && this.timer > 1 / effectiveSpawnRate) {
      this.timer = 0;
      this.particles.push(this.createParticle());
    }

    // Update all particles
    for (let p of this.particles) {
      p.x += p.vx * deltaTime * 60;
      p.y += p.vy * deltaTime * 60;
    }

    // Remove off-screen
    this.particles = this.particles.filter((p) => p.y < GRID_HEIGHT);

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

    if (this.inTransition && this.particles.length === 0) {
      this.type = this.nextType;
      this.nextType = null;
      this.inTransition = false;
      this.timer = 0;
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

render(ctx, timeOfDay = 'day') {
  camera.applyTransform(ctx); // Particle positions depend on camera

  // Draw weather particles
  ctx.save();
  let particleSprite;

  if (["rain", "storm", "snow"].includes(this.type)) {
    for (let p of this.particles) {
      if (this.type === "rain" || this.type === "storm") {
        particleSprite = rainPic;
      } else if (this.type === "snow") {
        particleSprite = snowPic;
      }

      if (particleSprite) {
        ctx.drawImage(particleSprite, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();

  // Overlay tint after camera (screen space)
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset camera transform

  // Base tint from weather
  if (this.type === "rain") {
    ctx.fillStyle = "rgba(100, 100, 200, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (this.type === "storm") {
    ctx.fillStyle = "rgba(50, 50, 50, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (this.type === "snow") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Add night tint on top
  if (timeOfDay === "night") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Flash lightning (storm)
  if (this.lightningAlpha > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.restore();
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

    if (this.type !== type) {
      this.nextType = type;
      this.inTransition = true;
    }

    //console.log(`Weather changing to - ${type} - via weather system`);
  }


  getWeatherType() {
    return this.type;
  }
}
