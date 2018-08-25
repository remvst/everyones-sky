class Item {

    constructor() {
        this.x = this.y = 0;
        this.scaleRandom = random()
    }

    cycle(e) {
        let closestShip = null;
        U.ships.forEach(ship => {
            if (!closestShip || dist(ship, this) < dist(closestShip, this)) {
                closestShip = ship;
            }
        });

        if (!closestShip) {
            return;
        }

        const distance = dist(this, U.playerShip);
        if (distance < ITEM_MAGNETIZED_RADIUS) {
            const angle = angleBetween(this, U.playerShip);
            this.x += cos(angle) * min(distance, ITEM_MAGNETIZED_SPEED * e);
            this.y += sin(angle) * min(distance, ITEM_MAGNETIZED_SPEED * e);
        }

        if (distance < ITEM_PICKUP_RADIUS) {
            U.remove(U.items, this);
            this.pickUp(U.playerShip);
        }
    }

    render() {
        wrap(() => {
            translate(this.x, this.y);
            scale(sin(this.scaleRandom + PI * 2 * G.clock), 1); // Give the item a nice flip animation

            this.renderGraphic();
        });
    }

    // For reference only
    // pickUp(ship) {

    // }

    // For reference only
    // renderGraphic() {

    // }

}