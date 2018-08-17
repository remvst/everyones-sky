class Ship {

    constructor() {
        this.x = this.y = 0;
        this.vX = this.vY = 0;

        // Controls
        // this.thrust = false; // don't need this line, only here for reference
        this.rotationDirection = 0;

        this.angle = 0;

        this.radius = 20;
    }

    cycle(e) {
        this.x += this.vX * e;
        this.y += this.vY * e;

        if (this.thrust && !this.uncontrolledRotation) {
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
        const velocity = Math.min(Math.max(0, distP(0, 0, this.vX, this.vY) - SHIP_DECELERATION * e), SHIP_MAX_SPEED);

        this.vX = velocity * cos(angle);
        this.vY = velocity * sin(angle);

        this.angle += e * (this.uncontrolledRotation || this.rotationDirection) * SHIP_ROTATION_SPEED;
    }

    render() {
        wrap(() => {
            R.fillStyle = '#000';
            R.globalAlpha = 0.5;
            translate(this.x + 2, this.y + 2);
            rotate(this.angle);
            beginPath();
            moveTo(-5, 0);
            lineTo(-10, 10);
            lineTo(20, 0);
            lineTo(-10, -10);
            fill();
        });

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

    shoot() {
        if ((G.clock - (this.lastShot || 0)) < SHIP_SHOT_INTERVAL) {
            return;
        }

        this.lastShot = G.clock;

        U.projectiles.push(new Laser(this, this.x, this.y, this.angle));
    }

    damage() {
        console.log('damage ship');
    }

}