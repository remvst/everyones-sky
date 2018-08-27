class Ship {

    constructor(civilization) {
        this.civilization = civilization;

        this.x = this.y = 0;
        this.vX = this.vY = 0;

        // Controls
        // this.thrust = false; // don't need this line, only here for reference
        this.rotationDirection = 0;

        this.angle = 0;

        this.radius = 20;

        this.health = 1;

        this.heat = 0;
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

        const angle = atan2(this.vY, this.vX);
        const velocity = min(max(0, distP(0, 0, this.vX, this.vY) - SHIP_DECELERATION * e), SHIP_MAX_SPEED);

        this.vX = velocity * cos(angle);
        this.vY = velocity * sin(angle);

        this.angle += e * (this.uncontrolledRotation || this.rotationDirection) * SHIP_ROTATION_SPEED;

        if ((G.clock - (this.lastShot || 0)) > 0.5) {
            this.heat -= e * 0.5;
        }

        if (this.heat <= 0) {
            this.coolingDown = false;
        }
    }

    shape() {
        rotate(this.angle);
        beginPath();
        moveTo(-5, 0);
        lineTo(-10, 10);
        lineTo(20, 0);
        lineTo(-10, -10);
        fill();
    }

    // For reference only
    // shipColor() {

    // }

    render() {
        if (!V.isVisible(this.x, this.y, this.radius)) {
            return;
        }

        if (DEBUG) {
            G.renderedShips++;
        }

        wrap(() => {
            R.fillStyle = '#000';
            R.globalAlpha = 0.5;
            translate(this.x + 2, this.y + 2);
            this.shape();
        });

        const damageFactor = 1 - limit(0, G.clock - this.lastDamage, 0.1) / 0.1;
        wrap(() => {
            R.fillStyle = damageFactor > 0 ? '#f00' : this.shipColor();
            translate(this.x, this.y);
            this.shape();
        });

        const closestStar = U.stars
            .reduce((closest, star) => !closest || dist(closest, this) > dist(star, this) ? star : closest, null);

        if (closestStar) {
            const angleToClosestStar = normalize(this.angle - angleBetween(this, closestStar));
            const alpha = 1 - abs(abs(angleToClosestStar) / PI - 1 / 2) * 2;

            wrap(() => {
                R.fillStyle = '#000';
                R.globalAlpha = alpha * limit(0, (1 - dist(closestStar, this) / 5000), 1);
                translate(this.x, this.y);
                rotate(this.angle);

                beginPath();
                moveTo(-5, 0);
                lineTo(-10, sign(angleToClosestStar) * 10);
                lineTo(20, 0);
                fill();
            });
        }
    }

    shoot(type, interval = SHIP_SHOT_INTERVAL) {
        if ((G.clock - (this.lastShot || 0)) < interval || this.coolingDown) {
            return;
        }

        this.lastShot = G.clock;

        const p = new type(this, this.x, this.y, this.angle);
        U.projectiles.push(p);

        this.heat = max(this.heat + 0.05, 0);
        if (this.heat >= 1) {
            this.coolingDown = true;
        }

        G.eventHub.emit(EVENT_SHOT, p);

        return p;
    }

    damage(projectile, amount) {
        particle(10, '#ff0', [
            ['alpha', 1, 0, 1],
            ['size', rnd(2, 4), rnd(5, 10), 1],
            ['x', this.x, this.x + rnd(-20, 20), 1],
            ['y', this.y, this.y + rnd(-20, 20), 1]
        ]);

        this.lastDamage = G.clock;

        if ((this.health -= (amount || 0.1)) <= 0.05) {
            this.explode(projectile);
        }
    }

    explode() {
        for (let i = 0 ; i < 100 ; i++) {
            const angle = random() * PI * 2;
            const distance = rnd(5, 50);
            const d = rnd(0.2, 1.5);

            particle(10, pick(['#ff0', '#f80', '#f00']), [
                ['alpha', 1, 0, d],
                ['size', rnd(2, 4), rnd(5, 10), d],
                ['x', this.x, this.x + cos(angle) * distance, d],
                ['y', this.y, this.y + sin(angle) * distance, d]
            ]);
        }

        U.remove(U.ships, this);
    }

}