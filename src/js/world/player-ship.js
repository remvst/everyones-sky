class PlayerShip extends Ship {

    cycle(e) {
        this.thrust = w.down[38];

        this.rotationDirection = 0;
        if (w.down[37]) this.rotationDirection = -1;
        if (w.down[39]) this.rotationDirection = 1;

        if (w.down[32]) this.shoot(SimpleLaser);
        if (w.down[90]) this.shoot(SuperLaser, SHIP_SUPERSHOT_INTERVAL);

        super.cycle(e);
    }

    damage(source) {
        super.damage(source);

        V.shake(0.5);
    }

}