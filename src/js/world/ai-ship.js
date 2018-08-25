class AIShip extends Ship {

    canShootEnemy() {
        if (!this.enemy) {
            return false;
        }

        if (dist(this, this.enemy) > 400 && dist(this.planet, this.enemy) > this.planet.radius * 2) {
            return false;
        }

        if (dist(this.planet, this.enemy) < this.planet.radius) {
            return false;
        }

        return true;
    }

    currentTarget() {
        if (this.canShootEnemy()) {
            return this.enemy;
        }

        return this.target;
    }

    updateControls() {
        this.rotationDirection = 0;
        this.thrust = false;

        const target = this.currentTarget();
        if (!target) {
            return;
        }

        const velocity = distP(0, 0, this.vX, this.vY);

        // Logic to reach the current target
        const angleToTarget = angleBetween(this, target);
        const angleDiff = normalize(angleToTarget - this.angle);

        if (abs(angleDiff) > PI / 64) {
            this.rotationDirection = sign(angleDiff);
        }

        if (abs(angleDiff) < PI / 64) {
            const moveAngle = atan2(this.vY, this.vX);
            const fullStopIn = velocity / SHIP_DECELERATION;
            const distAtFullStop = -SHIP_DECELERATION * fullStopIn * fullStopIn / 2 + velocity * fullStopIn
            const positionAtFullStop = {
                'x': this.x + distAtFullStop * cos(moveAngle),
                'y': this.y + distAtFullStop * sin(moveAngle)
            };

            const distanceToTargetAtFullStop = dist(positionAtFullStop, target);
            this.thrust = distanceToTargetAtFullStop > AI_MOVE_TARGET_RADIUS;
        }

        if (this.canShootEnemy()) {
            if (abs(angleDiff) > PI / 64) {
                this.shoot(SimpleLaser);
            }
        }

        if (velocity > AI_SHIP_MAX_SPEED) {
            this.thrust = false;
        }
    }

    cycle(e) {
        if (!this.target || dist(this, this.target) < this.targetRadius || dist(this.planet, this.target) < this.planet.radius) {
            this.pickNewTarget();
        }

        if (V.isVisible(this.x, this.y, V.width)) {
            this.updateControls();
            super.cycle(e);
        }
    }

    render() {
        super.render();

        if (DEBUG) {
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

            fillText(distP(0, 0, this.vX, this.vY) / SHIP_DECELERATION + '', this.x + 50, this.y + 50);

            if (this.target) {
                R.strokeStyle = '#f00';
                beginPath();
                arc(this.currentTarget().x, this.currentTarget().y, this.targetRadius, 0, PI * 2);
                stroke();
            }
        }
    }

    pickNewTarget() {
        // if (dist(U.playerShip, this) < 300) {
        //     this.target = U.playerShip;
        //     this.targetRadius = 300;
        //     this.shootTarget = true;
        //     return;
        // }

        const pts = this.planet.pointsAround([this.planet.radius + 100, this.planet.radius + 200]);

        const pathFinder = new PathFinder({
            'hash': node => {
                return node.x + ',' + node.y;
            },
            'neighbors': node => {
                return node.neighbors;
            },
            'heuristic': (node, target) => {
                return dist(node, target);
            },
            'isTarget': (node, target) => {
                return dist(node, target) < 100;
            },
            'distance': (a, b) => {
                return dist(a, b);
            }
        });

        function closestNode(target) {
            return pts.slice().sort((a, b) => {
                return dist(a, target) - dist(b, target);
            })[0];
        }

        // Find the node we're the closest to
        const nodeStart = closestNode(this);
        const nodeEnd = U.enemy ? closestNode(U.enemy) : pick(pts);

        const path = pathFinder.findPath([nodeStart], nodeEnd);
        this.targetRadius = AI_MOVE_TARGET_RADIUS;

        do {
            this.target = path.shift();
        } while (path.length && dist(this.target, this) < this.targetRadius * 1.5);

        this.shootTarget = false;

        // console.log(path);
    }

}