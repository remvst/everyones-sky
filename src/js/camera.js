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

        this.x = U.playerShip.x - (CANVAS_WIDTH / 2 / this.scale);
        this.y = U.playerShip.y - (CANVAS_HEIGHT / 2 / this.scale);
    }

}