class Ship {

    constructor() {
        this.x = this.y = 0;
        this.vX = this.vY = 0;

        // Controls
        // this.thrust = false; // don't need this line, only here for reference
        this.rotationDirection = 0;

        this.angle = 0;
    }

    cycle(e) {
        this.x += this.vX * e;
        this.y += this.vY * e;

        if (this.thrust) {
            this.vX += cos(this.angle) * SHIP_ACCELERATION * e;
            this.vY += sin(this.angle) * SHIP_ACCELERATION * e;

            particle(10, '#fff', [
                ['alpha', 1, 0, 1],
                ['size', rnd(2, 4), rnd(5, 10), 1],
                ['x', this.x, this.x + rnd(-20, 20), 1],
                ['y', this.y, this.y + rnd(-20, 20), 1]
            ]);
        }

        const angle = Math.atan2(this.vY, this.vX);
        const velocity = Math.max(0, distP(0, 0, this.vX, this.vY) - SHIP_DECELERATION * e);

        this.vX = velocity * cos(angle);
        this.vY = velocity * sin(angle);

        this.angle += e * this.rotationDirection * SHIP_ROTATION_SPEED;
    }

    render() {
        wrap(() => {
            R.fillStyle = '#080';
            translate(this.x, this.y);
            rotate(this.angle);
            beginPath();
            moveTo(-5, 0);
            lineTo(-10, 10);
            lineTo(20, 0);
            lineTo(-10, -10);
            fill();
        });
    }

}