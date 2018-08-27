class PlayerShip extends Ship {

    cycle(e) {
        this.thrust = w.down[38];

        this.rotationDirection = 0;
        if (w.down[37]) this.rotationDirection = -1;
        if (w.down[39]) this.rotationDirection = 1;

        if (w.down[32]) this.shoot(SimpleLaser);
        if (w.down[90]) this.shoot(SuperLaser, SHIP_SUPERSHOT_INTERVAL);

        const star = this.nearStar();
        if (star) {
            this.damage(star, e * 0.05);
        }

        super.cycle(e);
    }

    damage(source, amount) {
        super.damage(source, amount);

        if (amount > 0.1) {
            V.shake(amount / 0.1);
        }
    }

    shoot(type, interval) {
        const p = super.shoot(type, interval);
        if (p) {
            p.guideRadius = 100;
        }
    }

    shipColor() {
        return '#fff';
    }

    explode(projectile) {
        super.explode(projectile);
        setTimeout(() => G.gameOver(), 2000);
    }

    currentWarning() {
        if (this.health <= 0.3) {
            return nomangle('SHIELDS LOW');
        } else if (this.nearStar()) {
            return nomangle('HEAT DAMAGING SHIELDS');
        }
    }

    nearStar() {
        return U.stars.filter(star => dist(this, star) < star.radius * 2)[0];
    }

}