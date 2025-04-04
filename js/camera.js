const WORLD_WIDTH = TILE_COLS * TILE_W;
const WORLD_HEIGHT = TILE_ROWS * TILE_H;

const camera = {
    x: 0,
    y: 0,
    width: 800,
    height: 600,

    baseX: 0,
    baseY: 0,
    shakeOffsetX: 0,
    shakeOffsetY: 0,

    shakeTime: 0,
    shakeStrength: 0,

    followTarget: null,

    update(deltaTime) {
        if (this.followTarget) {
            // Center the camera on the target
            this.baseX = this.followTarget.x - this.width / 2;
            this.baseY = this.followTarget.y - this.height / 2;

            // Clamp to world bounds
            this.baseX = Math.max(0, Math.min(this.baseX, WORLD_WIDTH - this.width));
            this.baseY = Math.max(0, Math.min(this.baseY, WORLD_HEIGHT - this.height));
        }

        // Reset shake offset
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;

        // Apply shake effect
        if (this.shakeTime > 0) {
            this.shakeTime -= deltaTime * 1000;
            this.shakeOffsetX = (Math.random() - 0.5) * this.shakeStrength;
            this.shakeOffsetY = (Math.random() - 0.5) * this.shakeStrength;
        }

        // Final camera position is base + shake
        this.x = this.baseX + this.shakeOffsetX;
        this.y = this.baseY + this.shakeOffsetY;
    },

    applyTransform(ctx) {
        ctx.translate(-this.x, -this.y);
    },

    applyShake(strength = 4, duration = 300) {
        this.shakeStrength = strength;
        this.shakeTime = duration;
    }
};
