class Camera {

    constructor() {
        this.x = 0;
        this.y = 0;

        this.scale = this.targetScale = 1;
    }

    cycle(e) {
        let minDistance = 999;
        U.bodies.forEach(body => {
            minDistance = Math.min(minDistance, dist(body, U.playerShip));
        });

        // console.log(minDistance);

        if (minDistance > BODY_UNZOOM_THRESHOLD) {
            this.targetScale = 1;
        } else if (minDistance < BODY_ZOOM_THRESHOLD) {
            this.targetScale = 1.5;
        }

        const diff = Math.min(1, Math.abs(this.scale - this.targetScale)) * e;
        this.scale += diff * sign(this.targetScale - this.scale);

        this.width = (CANVAS_WIDTH / this.scale);
        this.height = (CANVAS_HEIGHT / this.scale);

        this.x = U.playerShip.x - this.width / 2;
        this.y = U.playerShip.y - this.height / 2;
    }

    isVisible(x, y, radius = 0) {
        return x + radius > this.x &&
            y + radius > this.y &&
            x - radius < this.x + this.width &&
            y - radius < this.y + this.height;
    }

}