class Camera {

    constructor() {
        this.x = this.y = 0;
        this.shakeX = this.shakeY = 0;

        this.zoomScale = this.targetScale = 1;
        // this.targetScaleOverride = null; // for reference only
    }

    cycle(e) {
        let minDistance = 999;
        U.bodies.forEach(body => {
            minDistance = min(minDistance, dist(body, U.playerShip));
        });

        if (minDistance > BODY_UNZOOM_THRESHOLD) {
            this.targetScale = isTouch ? 0.7 : 0.5;
        } else if (minDistance < BODY_ZOOM_THRESHOLD) {
            this.targetScale = 1;
        }

        const targetScale = this.targetScaleOverride || this.targetScale;

        this.zoomScale += limit(-0.5 * e, targetScale - this.zoomScale, 0.5 * e);

        this.visibleWidth = (CANVAS_WIDTH / this.zoomScale);
        this.visibleHeight = (CANVAS_HEIGHT / this.zoomScale);

        if ((this.shakeTime -= e) > 0) {
            this.shakeX = rnd(-10, 10);
            this.shakeY = rnd(-10, 10);
        }

        this.x = U.playerShip.x - this.visibleWidth / 2 + this.shakeX;
        this.y = U.playerShip.y - this.visibleHeight / 2 + this.shakeY;
    }

    isVisible(point, radius = 0) {
        return point.x + radius > this.x &&
            point.y + radius > this.y &&
            point.x - radius < this.x + this.visibleWidth &&
            point.y - radius < this.y + this.visibleHeight;
    }

    shake(duration) {
        this.shakeTime = max(this.shakeTime || 0, duration);
    }

}
