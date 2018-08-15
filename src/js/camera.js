class Camera {

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    cycle() {
        this.x = U.playerShip.x - CANVAS_WIDTH / 2;
        this.y = U.playerShip.y - CANVAS_HEIGHT / 2;
    }

}