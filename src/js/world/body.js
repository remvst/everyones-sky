class Body {

    constructor() {
        this.x = this.y = 0;
        this.radius = 0;
    }

    cycle() {
        U.ships.forEach(ship => {
            const minDist = this.radius + ship.radius;
            const overlap = minDist - dist(ship, this);
            if (overlap > 0) {
                // Push the ship away
                const angle = angleBetween(this, ship);
                ship.x = this.x + cos(angle) * (minDist + 5);
                ship.y = this.y + sin(angle) * (minDist + 5);
                ship.vX += cos(angle) * (overlap + SHIP_DECELERATION * 2);
                ship.vY += sin(angle) * (overlap + SHIP_DECELERATION * 2);

                interp(ship, 'uncontrolledRotation', pick([-6, 6]), 0, 1);

                ship.damage(this, 0.1);

                if (V.isVisible(ship)) {
                    explosionSound();
                }
            }
        });
    }

    // For reference only
    // render() {

    // }

    damage(projectile) {
        particle(this.particleColor(), [
            ['alpha', 1, 0, 1],
            ['size', rnd(2, 4), rnd(5, 10), 1],
            ['x', projectile.x, projectile.x + rnd(-20, 20), 1],
            ['y', projectile.y, projectile.y + rnd(-20, 20), 1]
        ]);
    }

    renderName() {
        wrap(() => {
            R.shadowColor = '#000';
            R.shadowOffsetY = 4;

            const x1 = cos(-PI / 4) * (this.radius + 20);
            const y1 = sin(-PI / 4) * (this.radius + 20);

            const x2 = cos(-PI / 4) * (this.radius + 50);
            const y2 = sin(-PI / 4) * (this.radius + 50);

            const x3 = x2 + 30;
            const y3 = y2;

            fs('#fff');
            R.strokeStyle = R.fillStyle;
            R.lineWidth = 2;
            beginPath();
            moveTo(x1, y1);
            lineTo(x2, y2);
            lineTo(x3, y3);
            stroke();

            R.lineWith = 8;
            translate(x3 + 10, y3 - 7);
            renderStickString(this.stickString, 10, 15, 1, 0, 0);
        });
    }

}
