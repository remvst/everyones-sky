class PlayerShip extends Ship {

    constructor(civilization) {
        super(civilization);

        this.nextHealing = 0;
    }

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

        if ((this.nextHealing -= e) < 0) {
            this.heal();
        }

        super.cycle(e);
    }

    heal() {
        const healingAmount = min(1 - this.health, SHIP_HEALING_AMOUNT);
        const requiredResources = ~~(SHIP_HEALING_REQUIRED_RESOURCES * healingAmount / SHIP_HEALING_AMOUNT);
        if (this.civilization.resources >= requiredResources && healingAmount > 0) {
            G.healAnimation(() => {
                this.health += healingAmount;
                this.civilization.resources -= requiredResources;
            });
        }

        this.nextHealing = SHIP_HEALING_INTERVAL;
    }

    damage(source, amount) {
        super.damage(source, amount);

        if (amount > 0.1) {
            V.shake(amount / 0.1);
        }

        this.nextHealing = SHIP_HEALING_DAMAGE_TIMEOUT;
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
            let warning = nomangle('SHIELDS LOW');
            if (this.civilization.resources < SHIP_HEALING_REQUIRED_RESOURCES) {
                warning += nomangle('. FIND RESOURCES TO REPAIR');
            }
            return warning;
        } else if (this.nearStar()) {
            return nomangle('HEAT DAMAGING SHIELDS');
        }
    }

    nearStar() {
        return U.stars.filter(star => dist(this, star) < star.radius * 2)[0];
    }

}