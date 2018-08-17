class AIShip extends Ship {

    constructor(planet) {
        super();
        this.planet = planet;
    }

    cycle(e) {
        if (!this.target) {
            this.pickNewTarget();
        }

        const angleToTarget = atan2(this.target.y - this.y, this.target.x - this.x);
        const angleDiff = normalize(angleToTarget - this.angle);

        this.rotationDirection = sign(angleDiff);

        if (abs(angleDiff) < PI / 64) {
            const velocity = distP(0, 0, this.vX, this.vY);
            const moveAngle = atan2(this.vY, this.vX);
            const fullStopIn = velocity / SHIP_DECELERATION;
            const distAtFullStop = -SHIP_DECELERATION * fullStopIn * fullStopIn / 2 + velocity * fullStopIn
            const positionAtFullStop = {
                'x': this.x + distAtFullStop * cos(moveAngle),
                'y': this.y + distAtFullStop * sin(moveAngle)
            };

            const distanceToTargetAtFullStop = dist(positionAtFullStop, this.target);
            if (distanceToTargetAtFullStop < AI_MOVE_TARGET_RADIUS) {
                this.thrust = false;
            } else {
                this.thrust = true;
            }
        } else {
            this.thrust = false;
        }

        if (abs(angleDiff) < PI / 64) {
            this.shoot();
        }

        // this.thrust = dist(this, this.target) > 500;
        // v(t) = -DECELERATION * x + v0

        super.cycle(e);
    }

    render() {
        super.render();

        if (DEBUG) {
            if (this.target) {
                const velocity = distP(0, 0, this.vX, this.vY);
                const moveAngle = atan2(this.vY, this.vX);
                const fullStopIn = velocity / SHIP_DECELERATION;
                const distAtFullStop = -SHIP_DECELERATION * fullStopIn * fullStopIn / 2 + velocity * fullStopIn
                const positionAtFullStop = {
                    'x': this.x + distAtFullStop * cos(moveAngle),
                    'y': this.y + distAtFullStop * sin(moveAngle)
                };

                R.fillStyle = '#f00';
                fr(positionAtFullStop.x, positionAtFullStop.y, 10, 10);
            }

            R.fillText(distP(0, 0, this.vX, this.vY) / SHIP_DECELERATION + '', this.x + 50, this.y + 50);
        }
    }

    pickNewTarget() {
        this.target = {
            'x': this.planet.x + this.planet.radius + this.radius * 3,
            'y': this.planet.y
        };
        this.target = U.playerShip;
    }

}