class Body {

    constructor() {
        this.x = this.y = 0;
        this.radius = 0;
    }

    cycle(e) {
        U.ships.forEach(ship => {
            const minDist = this.radius + ship.radius;
            const overlap = minDist - dist(ship, this);
            if (overlap > 0) {
                // Push the ship away
                const angle = atan2(ship.y - this.y, ship.x - this.x);
                ship.x = this.x + cos(angle) * (minDist);
                ship.y = this.y + sin(angle) * (minDist);
                ship.vX += cos(angle) * (overlap + SHIP_DECELERATION * 2);
                ship.vY += sin(angle) * (overlap + SHIP_DECELERATION * 2);
            }
        });
    }

    // For reference only
    // render() {

    // }

    damage() {
        console.log('damage, body');
    }

}