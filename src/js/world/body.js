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

                if (V.isVisible(ship.x, ship.y)) {
                    explosionSound();
                }
            }
        });
    }

    // For reference only
    // render() {

    // }

    damage() {
        
    }

}