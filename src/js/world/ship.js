class Ship {

    constructor() {
        this.x = 0;
        this.y = 0;

        this.vX = 0;
        this.vY = 0;

        this.thrust = false; // TODO don't need this line
        this.angle = 0;
    }

    cycle(e) {
        this.x += this.vX * e;
        this.y += this.vY * e;

        if (this.thrust) {
            this.vX += Math.cos(this.angle) * SHIP_ACCELERATION * e;
            this.vY += Math.sin(this.angle) * SHIP_ACCELERATION * e;
        }
    }

    render() {
        wrap(() => {
            R.fillStyle = '#080';
            translate(this.x, this.y);
            beginPath();
            moveTo(0, 0);
            lineTo(-5, 10);
            lineTo(25, 0);
            lineTo(-5, -10);
            fill();
        });
    }

}