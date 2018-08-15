class Universe {

    constructor() {
        this.ships = [];
    }

    cycle(e) {
        this.ships.forEach(ship => ship.cycle(e));
    }

    render() {
        R.fillStyle = '#000';
        R.fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        R.fillStyle = starsPattern;
        R.fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

}