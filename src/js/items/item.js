class Item {

    constructor(x, y) {
        this.scaleRandom = random();
        this.timeLeft = 15;

        interp(this, 'x', x, x + rnd(-50, 50), 0.3);
        interp(this, 'y', y, y + rnd(-50, 50), 0.3);
    }

    cycle(e) {
        if ((this.timeLeft -= e) <= 0) {
            U.remove(U.items, this);
        }

        if (U.playerShip.health <= 0) {
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
        if (!V.isVisible(this.x, this.y) || this.timeLeft < 3 && (this.timeLeft % 0.25) < 0.125) {
            return;
        }

        translate(this.x, this.y);
        scale(sin(this.scaleRandom + PI * 2 * G.clock), 1); // Give the item a nice flip animation

        this.renderGraphic();
    }

    // For reference only
    // pickUp(ship) {

    // }

    // For reference only
    // renderGraphic() {

    // }

}
