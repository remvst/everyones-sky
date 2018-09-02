class PlayerShip extends Ship {

    constructor(x, y) {
        super(new Civilization(), x, y);

        this.nextHealing = 0;
    }

    cycle(e) {
        this.thrust = w.down[38];

        this.rotationDirection = w.down[37] ? -1 : (w.down[39] ? 1 : 0);

        if (w.down[32]) this.shoot(SimpleLaser);
        if (w.down[13]) this.shoot(SuperLaser, SHIP_SUPERSHOT_INTERVAL);

        if (this.nearStar()) {
            this.damage(this, e * 0.15);
        }

        if ((this.nextHealing -= e) < 0) {
            this.heal();
        }

        super.cycle(e);

        if (this.thrust) {
            if (!this.thrustSound) {
                this.thrustSound = thrustSound();
                this.thrustSound.loop = true;
            }
        } else if (this.thrustSound) {
            this.thrustSound.pause();
            this.thrustSound = null;
        }
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
        amount *= PLAYER_SHIP_DAMAGE_FACTOR; // Less damage for the player

        super.damage(source, amount);

        if (source != this) {
            V.shake(0.1);
        }

        this.nextHealing = SHIP_HEALING_DAMAGE_TIMEOUT;
    }

    modifyProjectile(projectile) {
        projectile.guideRadius = 100;
    }

    shipColor() {
        return '#fff';
    }

    explode(projectile) {
        super.explode(projectile);
        setTimeout(() => G.gameOver(), 2000);

        if (this.thrustSound) {
            this.thrustSound.pause();
        }
    }

    currentWarning() {
        if (this.health <= 0.3) {
            return nomangle('SHIELDS LOW') + (this.civilization.resources < SHIP_HEALING_REQUIRED_RESOURCES ? nomangle('. FIND RESOURCES TO REPAIR') : '');
        }

        if (this.nearStar()) {
            return nomangle('HEAT DAMAGING SHIELDS');
        }

        if (U.pirates.filter(ship => dist(ship, this) < CANVAS_WIDTH).length) {
            return nomangle('PIRATES NEARBY');
        }
    }

    nearStar() {
        return U.stars.filter(star => dist(this, star) < star.radius * 2)[0];
    }

}
