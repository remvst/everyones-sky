class AIShip extends Ship {

    constructor(civilization) {
        super(civilization);
        this.nextDecisionChange = 0;
    }

    shipColor() {
        return this.civilization.relationshipType();
    }

    canShootEnemy() {
        if (!this.enemy) {
            return false;
        }

        if (dist(this, this.enemy) > 400 && dist(this.civilization.planet, this.enemy) > this.civilization.planet.radius * 2) {
            return false;
        }

        if (dist(this.civilization.planet, this.enemy) < this.civilization.planet.radius) {
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
        this.enemy = this.civilization.relationshipType() === RELATIONSHIP_ENEMY ? U.playerShip : null;

        if (!this.target || dist(this, this.target) < this.targetRadius || dist(this.civilization.planet, this.target) < this.civilization.planet.radius || (this.nextDecisionChange -= e) <= 0) {
            this.pickNewTarget();
        }

        if (V.isVisible(this.x, this.y, V.width)) {
            this.updateControls();
            super.cycle(e);
        }
    }

    render() {
        super.render();

        // if (DEBUG) {
        //     const velocity = distP(0, 0, this.vX, this.vY);
        //     const moveAngle = atan2(this.vY, this.vX);
        //     const fullStopIn = velocity / SHIP_DECELERATION;
        //     const distAtFullStop = -SHIP_DECELERATION * fullStopIn * fullStopIn / 2 + velocity * fullStopIn
        //     const positionAtFullStop = {
        //         'x': this.x + distAtFullStop * cos(moveAngle),
        //         'y': this.y + distAtFullStop * sin(moveAngle)
        //     };

        //     R.fillStyle = '#f00';
        //     fr(positionAtFullStop.x, positionAtFullStop.y, 10, 10);

        //     fillText(distP(0, 0, this.vX, this.vY) / SHIP_DECELERATION + '', this.x + 50, this.y + 50);

        //     if (this.target) {
        //         R.strokeStyle = '#f00';
        //         beginPath();
        //         arc(this.currentTarget().x, this.currentTarget().y, this.targetRadius, 0, PI * 2);
        //         stroke();
        //     }
        // }
    }

    pickNewTarget() {
        // if (dist(U.playerShip, this) < 300) {
        //     this.target = U.playerShip;
        //     this.targetRadius = 300;
        //     this.shootTarget = true;
        //     return;
        // }

        const pts = this.civilization.planet.pointsAround([this.civilization.planet.radius + 150, this.civilization.planet.radius + 250]);

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

        this.nextDecisionChange = 3;
    }

    damage(projectile, amount) {
        super.damage(projectile, amount);

        if (projectile.owner === U.playerShip) {
            this.civilization.updateRelationship(RELATIONSHIP_UPDATE_DAMAGE_SHIP);
        }
    }

    explode(projectile) {
        super.explode(projectile);

        if (projectile.owner === U.playerShip) {
            this.civilization.updateRelationship(RELATIONSHIP_UPDATE_DESTROY_SHIP);
        }
    }

}