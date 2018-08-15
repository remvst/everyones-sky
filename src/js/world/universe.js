class Universe {

    constructor() {
        this.ships = [];

        // Player ship
        this.playerShip = new PlayerShip();
        this.playerShip.x = CANVAS_WIDTH / 2;
        this.playerShip.y = CANVAS_HEIGHT / 2;
        this.ships.push(this.playerShip);
    }

    cycle(e) {
        this.ships.forEach(ship => ship.cycle(e));
    }

    render() {
        R.fillStyle = '#000';
        R.fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        R.fillStyle = starsPattern;
        R.fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.ships.forEach(ship => ship.render());
    }

}